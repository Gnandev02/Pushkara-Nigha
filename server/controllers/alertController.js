import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/alerts — returns all incident log / alert records
export const getAlerts = async (_req, res) => {
  try {
    const alerts = await prisma.alert.findMany();

    // Map to frontend INCIDENT_LOGS shape
    const mapped = alerts.map(a => ({
      id: a.id,
      time: a.time,
      location: a.location,
      category: a.category,
      severity: a.severity,
      description: a.description,
      status: a.status,
      assignedUnit: a.assignedUnit,
    }));

    return res.json(mapped);
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch alerts.' });
  }
};
