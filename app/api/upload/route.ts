import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { put } from "@vercel/blob";
import crypto from "crypto";

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

    const ext = file.name.split('.').pop();
    const filename = `${cameraId}_${Date.now()}_${crypto.randomUUID().slice(0, 6)}.${ext}`;
    
    // Upload the file directly to permanent Vercel Blob storage
    const blob = await put(`monitoring-videos/${filename}`, file, {
      access: 'public',
      addRandomSuffix: false,
    });

    const publicUrl = blob.url;

    // Update the camera's rtspUrl with the new permanent Blob URL in the Neon database
    const camera = await prisma.camera.upsert({
      where: { cameraId },
      update: { rtspUrl: publicUrl },
      create: {
        cameraId,
        name: `${ghatId} Camera`,
        location: ghatId,
        rtspUrl: publicUrl,
        status: "active",
      }
    });

    return NextResponse.json({ success: true, url: publicUrl, camera });
  } catch (err: any) {
    console.error("Upload Error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
