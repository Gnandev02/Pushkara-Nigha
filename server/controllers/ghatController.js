import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper to map DB Ghat to Frontend shape
const mapGhatToFrontend = (g) => {
  return {
    id: g.id,
    name: g.ghatName,
    district: g.district,
    districtFull: `${g.district} - ${g.ghatName.replace(' Ghat', '')}`,
    occupancy: g.currentCrowd,
    capacity: g.capacity,
    risk: g.aiRisk,
    trend: g.occupancyPercentage >= 70 ? 'up' : g.occupancyPercentage <= 30 ? 'down' : 'stable',
    camerasCount: g.activeCameras,
    sensorsOnline: Math.max(2, Math.round(g.activeCameras / 2)),
    crowdDensity: g.occupancyPercentage,
    lastUpdated: g.lastUpdated,
    coordinates: { x: g.coordinatesX, y: g.coordinatesY },
    anomaliesDetected: g.anomaliesDetected,
    safetyStatus: g.safetyStatus,
    inMen: g.inMen,
    inWomen: g.inWomen,
    inOthers: g.inOthers,
    outMen: g.outMen,
    outWomen: g.outWomen,
    outOthers: g.outOthers,
    camInId: g.camInId,
    camOutId: g.camOutId,
    aiTrend: g.aiTrend
  };
};

// GET all ghats
export const getGhats = async (req, res) => {
  try {
    const ghats = await prisma.ghat.findMany();
    return res.json(ghats.map(mapGhatToFrontend));
  } catch (error) {
    console.error('Error fetching ghats:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch ghats data.' });
  }
};

// GET single ghat by ID
export const getGhatById = async (req, res) => {
  const { id } = req.params;
  try {
    const g = await prisma.ghat.findUnique({
      where: { id }
    });
    if (!g) {
      return res.status(404).json({ success: false, message: 'Ghat not found.' });
    }
    return res.json(mapGhatToFrontend(g));
  } catch (error) {
    console.error('Error fetching ghat details:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch ghat details.' });
  }
};

// POST create ghat
export const addGhat = async (req, res) => {
  const data = req.body;
  try {
    const newGhat = await prisma.ghat.create({
      data: {
        id: data.id,
        ghatName: data.name,
        district: data.district,
        capacity: data.capacity,
        currentCrowd: data.occupancy || 0,
        occupancyPercentage: data.crowdDensity || 0,
        entryCount: (data.inMen || 0) + (data.inWomen || 0) + (data.inOthers || 0),
        exitCount: (data.outMen || 0) + (data.outWomen || 0) + (data.outOthers || 0),
        activeCameras: data.camerasCount || 10,
        zoneStatus: data.crowdDensity > 65 ? 'HIGHLY CROWDED' : data.crowdDensity >= 30 ? 'CROWDED' : 'OPEN ZONE',
        aiRisk: data.risk || 'safe',
        latitude: data.latitude || 16.578,
        longitude: data.longitude || 82.006,
        coordinatesX: data.coordinates ? data.coordinates.x : 50,
        coordinatesY: data.coordinates ? data.coordinates.y : 50,
        anomaliesDetected: data.anomaliesDetected || 0,
        safetyStatus: data.safetyStatus || 'Nominal operations',
        inMen: data.inMen || 0,
        inWomen: data.inWomen || 0,
        inOthers: data.inOthers || 0,
        outMen: data.outMen || 0,
        outWomen: data.outWomen || 0,
        outOthers: data.outOthers || 0,
        camInId: data.camInId || 'CAM-IN-01',
        camOutId: data.camOutId || 'CAM-OUT-01',
        aiTrend: data.aiTrend || 'Monitoring stable',
        lastUpdated: 'Just Now'
      }
    });
    return res.json(mapGhatToFrontend(newGhat));
  } catch (error) {
    console.error('Error creating ghat:', error);
    return res.status(500).json({ success: false, message: 'Failed to create ghat.' });
  }
};

// PUT update ghat (counter changes, capacity changes)
export const updateGhat = async (req, res) => {
  const { id } = req.params;
  const data = req.body;

  try {
    const existing = await prisma.ghat.findUnique({
      where: { id }
    });

    if (!existing) {
      return res.status(404).json({ success: false, message: 'Ghat not found.' });
    }

    const updateData = {};
    if (data.capacity !== undefined) updateData.capacity = parseInt(data.capacity);
    if (data.inMen !== undefined) updateData.inMen = parseInt(data.inMen);
    if (data.inWomen !== undefined) updateData.inWomen = parseInt(data.inWomen);
    if (data.inOthers !== undefined) updateData.inOthers = parseInt(data.inOthers);
    if (data.outMen !== undefined) updateData.outMen = parseInt(data.outMen);
    if (data.outWomen !== undefined) updateData.outWomen = parseInt(data.outWomen);
    if (data.outOthers !== undefined) updateData.outOthers = parseInt(data.outOthers);
    
    // Automatically recalculate crowds and densities based on updated fields
    const inMen = updateData.inMen !== undefined ? updateData.inMen : existing.inMen;
    const inWomen = updateData.inWomen !== undefined ? updateData.inWomen : existing.inWomen;
    const inOthers = updateData.inOthers !== undefined ? updateData.inOthers : existing.inOthers;
    
    const outMen = updateData.outMen !== undefined ? updateData.outMen : existing.outMen;
    const outWomen = updateData.outWomen !== undefined ? updateData.outWomen : existing.outWomen;
    const outOthers = updateData.outOthers !== undefined ? updateData.outOthers : existing.outOthers;

    const capacity = updateData.capacity !== undefined ? updateData.capacity : existing.capacity;
    
    const totalIn = inMen + inWomen + inOthers;
    const totalOut = outMen + outWomen + outOthers;
    const currentCrowd = Math.max(0, totalIn - totalOut);
    const occupancyPercentage = parseFloat(((currentCrowd / capacity) * 100).toFixed(1));

    updateData.currentCrowd = currentCrowd;
    updateData.occupancyPercentage = occupancyPercentage;
    updateData.entryCount = totalIn;
    updateData.exitCount = totalOut;

    // Set risk levels matching frontend bounds
    let aiRisk = 'safe';
    if (occupancyPercentage >= 88.0) aiRisk = 'critical';
    else if (occupancyPercentage >= 75.0) aiRisk = 'busy';
    else if (occupancyPercentage >= 50.0) aiRisk = 'moderate';

    updateData.aiRisk = aiRisk;
    updateData.zoneStatus = occupancyPercentage > 65 ? 'HIGHLY CROWDED' : occupancyPercentage >= 30 ? 'CROWDED' : 'OPEN ZONE';
    
    // Safety status and trends updates
    if (aiRisk === 'critical') {
      updateData.safetyStatus = 'CRITICAL LIMIT EXCEEDED. Dispatch SWAT!';
      updateData.anomaliesDetected = Math.max(existing.anomaliesDetected, 1);
    } else if (aiRisk === 'busy') {
      updateData.safetyStatus = 'Heavy density. Diverting pathway streams.';
    } else {
      updateData.safetyStatus = 'Nominal clearing bounds.';
    }

    updateData.lastUpdated = 'Just Now';

    const updated = await prisma.ghat.update({
      where: { id },
      data: updateData
    });

    return res.json(mapGhatToFrontend(updated));
  } catch (error) {
    console.error('Error updating ghat:', error);
    return res.status(500).json({ success: false, message: 'Failed to update ghat telemetry.' });
  }
};

// DELETE ghat
export const deleteGhat = async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.ghat.delete({
      where: { id }
    });
    return res.json({ success: true, message: `Ghat ${id} removed successfully.` });
  } catch (error) {
    console.error('Error deleting ghat:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete ghat.' });
  }
};
