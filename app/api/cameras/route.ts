import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const cameras = await prisma.camera.findMany({
      include: {
        analytics: {
          orderBy: { createdAt: "desc" },
          take: 1
        }
      },
      orderBy: { cameraId: "asc" }
    });

    const formattedCameras = cameras.map(cam => {
      const latest = cam.analytics && cam.analytics[0] ? cam.analytics[0] : null;
      return {
        id: cam.id,
        cameraId: cam.cameraId,
        name: cam.name,
        location: cam.location,
        rtspUrl: cam.rtspUrl || "",
        status: cam.status,
        updatedAt: cam.updatedAt,
        peopleCount: latest ? latest.totalPeople : 0,
        uniquePeople: latest ? latest.uniquePeople : 0,
        riskScore: latest ? latest.riskScore : 0.0,
        density: latest ? latest.density : 0.0,
        genderBreakdown: latest ? {
          male: latest.maleCount,
          female: latest.femaleCount,
          unknown: latest.unknownGender
        } : { male: 0, female: 0, unknown: 0 }
      };
    });

    return NextResponse.json({
      success: true,
      cameras: formattedCameras
    });
  } catch (error: any) {
    console.error("Error fetching cameras:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { cameraId, name, location, rtspUrl, status } = body;

    if (!cameraId || !name || !location) {
      return NextResponse.json({ success: false, message: "Missing fields." }, { status: 400 });
    }

    const camera = await prisma.camera.upsert({
      where: { cameraId },
      update: {
        name,
        location,
        rtspUrl,
        status: status || "active"
      },
      create: {
        cameraId,
        name,
        location,
        rtspUrl,
        status: status || "active"
      }
    });

    return NextResponse.json({
      success: true,
      message: "Camera saved successfully.",
      camera
    });
  } catch (error: any) {
    console.error("Error upserting camera:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
