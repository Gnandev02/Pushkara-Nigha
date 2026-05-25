import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/monitoring — returns weather telemetry + system status
export const getMonitoring = async (_req, res) => {
  try {
    const data = await prisma.monitoringData.findFirst({
      orderBy: { updatedAt: 'desc' },
    });

    if (!data) {
      return res.json({
        weather: {},
        systemStatus: {},
      });
    }

    // Map to the shape the frontend expects
    return res.json({
      weather: {
        temp: data.temp,
        condition: data.condition,
        humidity: data.humidity,
        wind: data.wind,
        waterLevel: data.waterLevel,
        safetyAlert: data.safetyAlert,
      },
      systemStatus: {
        totalMonitoredGhats: data.totalMonitoredGhats,
        activeFeeds: data.activeFeeds,
        onlineSensors: data.onlineSensors,
        incidentsResolvedToday: data.incidentsResolvedToday,
        citizenReportsReceived: data.citizenReportsReceived,
        aiModelAccuracy: data.aiModelAccuracy,
        inferenceLatency: data.inferenceLatency,
      },
    });
  } catch (error) {
    console.error('Error fetching monitoring data:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch monitoring data.' });
  }
};

// PUT /api/monitoring — update monitoring telemetry
export const updateMonitoring = async (req, res) => {
  try {
    const existing = await prisma.monitoringData.findFirst({
      orderBy: { updatedAt: 'desc' },
    });

    if (!existing) {
      return res.status(404).json({ success: false, message: 'No monitoring data record found.' });
    }

    const updated = await prisma.monitoringData.update({
      where: { id: existing.id },
      data: req.body,
    });

    return res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating monitoring data:', error);
    return res.status(500).json({ success: false, message: 'Failed to update monitoring data.' });
  }
};
