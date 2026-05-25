import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const cameraId = searchParams.get('cameraId');

    // 1. Filter metrics based on Camera ID
    const filter = cameraId ? { cameraId } : {};

    // 2. Fetch the latest historical records
    const analytics = await prisma.analytics.findMany({
      where: filter,
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: { camera: true }
    });

    // Reverse history to chronological order for charts
    const historyChronological = [...analytics].reverse();

    // 3. Compute aggregate telemetry for all cameras
    const latestAnalyticsPerCamera = await prisma.camera.findMany({
      include: {
        analytics: {
          orderBy: { createdAt: 'desc' },
          take: 1
        }
      }
    });

    let totalPeople = 0;
    let uniquePeople = 0;
    let maleCount = 0;
    let femaleCount = 0;
    let unknownGender = 0;
    let averageRisk = 0;
    let camerasActive = 0;

    latestAnalyticsPerCamera.forEach(cam => {
      if (cam.analytics && cam.analytics[0]) {
        const a = cam.analytics[0];
        totalPeople += a.totalPeople;
        uniquePeople += a.uniquePeople;
        maleCount += a.maleCount;
        femaleCount += a.femaleCount;
        unknownGender += a.unknownGender;
        averageRisk += a.riskScore;
        if (cam.status !== 'inactive') {
          camerasActive += 1;
        }
      }
    });

    const activeCount = latestAnalyticsPerCamera.length;
    if (activeCount > 0) {
      averageRisk = parseFloat((averageRisk / activeCount).toFixed(4));
    }

    return NextResponse.json({
      success: true,
      summary: {
        totalPeople,
        uniquePeople,
        maleCount,
        femaleCount,
        unknownGender,
        averageRisk,
        activeCameras: camerasActive,
        totalCameras: latestAnalyticsPerCamera.length
      },
      history: historyChronological
    });

  } catch (error) {
    console.error('Error fetching analytics history:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
