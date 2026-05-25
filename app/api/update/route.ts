import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Calculate density based on standard capacity threshold
    const capacityThreshold = 100;
    const density = Math.min(parseFloat(((body.total_people || 0) / capacityThreshold).toFixed(4)), 1.0);

    // 2. Ensure camera exists in database (Upsert)
    await prisma.camera.upsert({
      where: { cameraId: body.camera_id },
      update: { status: (body.risk_score || 0) > 0.7 ? "critical" : (body.risk_score || 0) > 0.4 ? "warning" : "active" },
      create: {
        cameraId: body.camera_id,
        name: `Camera ${body.camera_id.toUpperCase().replace("_", " ")}`,
        location: `Ghat Security Grid ${body.camera_id.split("_")[1] || "Main Area"}`,
        status: (body.risk_score || 0) > 0.7 ? "critical" : (body.risk_score || 0) > 0.4 ? "warning" : "active"
      }
    });

    // 3. Save telemetry data inside Analytics table
    const saved = await prisma.analytics.create({
      data: {
        cameraId: body.camera_id,
        totalPeople: parseInt(body.total_people) || 0,
        uniquePeople: parseInt(body.unique_people) || 0,
        maleCount: parseInt(body.male_count) || 0,
        femaleCount: parseInt(body.female_count) || 0,
        unknownGender: parseInt(body.unknown_gender) || 0,
        density: density,
        riskScore: parseFloat(body.risk_score) || 0.0
      }
    });

    // 4. Automated Alert Checking System
    let activeAlert = null;
    if (body.total_people > 75) {
      activeAlert = await prisma.alert.create({
        data: {
          cameraId: body.camera_id,
          message: `HIGH DENSITY DETECTED: ${body.total_people} operators at security grid exceed buffer capacity threshold!`,
          severity: body.total_people > 90 ? "critical" : "warning",
        }
      });
    } else if (body.risk_score > 0.65) {
      activeAlert = await prisma.alert.create({
        data: {
          cameraId: body.camera_id,
          message: `STAMPEDE RISK ALERT: Chaotic flow motion vectors detected (Risk Index: ${(body.risk_score * 100).toFixed(0)}%).`,
          severity: body.risk_score > 0.8 ? "critical" : "warning",
        }
      });
    }

    // 5. Broadcast to Socket.IO live dashboard in real time
    if ((global as any).io) {
      (global as any).io.emit("analytics_update", {
        ...saved,
        timestamp: saved.createdAt
      });

      if (activeAlert) {
        (global as any).io.emit("alert_trigger", activeAlert);
      }
    }

    return NextResponse.json(saved);

  } catch (err: any) {
    console.error("Error receiving AI telemetry update:", err);
    return NextResponse.json(
      { error: "Failed", details: err.message },
      { status: 500 }
    );
  }
}
