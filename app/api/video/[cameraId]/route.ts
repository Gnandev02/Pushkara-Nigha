import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request, { params }: { params: { cameraId: string } }) {
  try {
    const video = await prisma.videoBlob.findUnique({
      where: { cameraId: params.cameraId },
    });

    if (!video) {
      return new NextResponse("Video not found", { status: 404 });
    }

    return new NextResponse(video.data, {
      headers: {
        "Content-Type": video.mimeType,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch (err: any) {
    console.error("Video Fetch Error:", err);
    return new NextResponse(err.message, { status: 500 });
  }
}
