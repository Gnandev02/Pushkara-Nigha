import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/cameras — returns all CCTV camera feed records
export const getCameras = async (_req, res) => {
  try {
    const cameras = await prisma.cameraFeed.findMany();

    // Map to frontend CCTV_FEEDS shape
    const mapped = cameras.map(c => ({
      id: c.id,
      location: c.location,
      resolution: c.resolution,
      peopleCount: c.peopleCount,
      densityLabel: c.densityLabel,
      aiDetections: c.aiDetections,
      riskLevel: c.riskLevel,
      feedStatus: c.feedStatus,
      boundingBoxes: c.boundingBoxes || [],
    }));

    return res.json(mapped);
  } catch (error) {
    console.error('Error fetching camera feeds:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch camera feeds.' });
  }
};
