import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { writeFile } from "fs/promises";
import path from "path";
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

    const buffer = Buffer.from(await file.arrayBuffer());
    const ext = file.name.split('.').pop();
    const filename = `${cameraId}_${Date.now()}_${crypto.randomUUID().slice(0, 6)}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads");
    const filePath = path.join(uploadDir, filename);

    await writeFile(filePath, buffer);

    const publicUrl = `/uploads/${filename}`;

    // Update the camera's rtspUrl with the new file path in the Neon database
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
