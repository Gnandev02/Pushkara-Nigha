import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const cameraId = searchParams.get("cameraId");
    const isRaw = searchParams.get("raw") === "true";

    const filter = cameraId ? { cameraId } : {};

    const analytics = await prisma.analytics.findMany({
      where: filter,
      orderBy: {
        createdAt: "desc"
      },
      take: limit
    });

    // If requesting raw array, return it directly
    if (isRaw) {
      return NextResponse.json(analytics);
    }

    // Compute aggregates for Dashboard UI compatibility
    const latestAnalyticsPerCamera = await prisma.camera.findMany({
      include: {
        analytics: {
          orderBy: { createdAt: "desc" },
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

    latestAnalyticsPerCamera.forEach(cam => {
      if (cam.analytics && cam.analytics[0]) {
        const a = cam.analytics[0];
        totalPeople += a.totalPeople;
        uniquePeople += a.uniquePeople;
        maleCount += a.maleCount;
        femaleCount += a.femaleCount;
        unknownGender += a.unknownGender;
        averageRisk += a.riskScore;
      }
    });

    const activeCount = latestAnalyticsPerCamera.length;
    if (activeCount > 0) {
      averageRisk = parseFloat((averageRisk / activeCount).toFixed(4));
    }

    // Return both formats to support both raw fetch requirements and dashboard bootstrapper
    return NextResponse.json({
      success: true,
      summary: {
        totalPeople,
        uniquePeople,
        maleCount,
        femaleCount,
        unknownGender,
        averageRisk,
        totalCameras: activeCount
      },
      history: [...analytics].reverse(),
      analytics
    });

  } catch (err: any) {
    console.error("Error fetching analytics history:", err);
    return NextResponse.json(
      { error: "Failed", details: err.message },
      { status: 500 }
    );
  }
}
