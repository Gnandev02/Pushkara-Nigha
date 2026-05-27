import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const cameraId = formData.get("camera_id") as string;
    const ghatId = formData.get("ghat_id") as string;

    if (!file || !cameraId) {
      return NextResponse.json({ success: false, error: "Missing file or camera_id" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Ensure the Camera exists first
    const camera = await prisma.camera.upsert({
      where: { cameraId },
      update: {},
      create: {
        cameraId,
        name: `${ghatId} Camera`,
        location: ghatId,
        status: "active",
      }
    });

    // Save to PostgreSQL via Prisma
    await prisma.videoBlob.upsert({
      where: { cameraId },
      update: { data: buffer, mimeType: file.type },
      create: { cameraId, data: buffer, mimeType: file.type }
    });

    const publicUrl = `/api/video/${cameraId}`;

    // Update Camera with the new internal URL
    await prisma.camera.update({
      where: { cameraId },
      data: { rtspUrl: publicUrl }
    });

    return NextResponse.json({ success: true, url: publicUrl });
  } catch (err: any) {
    console.error("Upload Error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
