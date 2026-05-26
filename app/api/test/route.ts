import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export const dynamic = "force-dynamic";

export async function GET() {
  const cameras = await prisma.camera.findMany({
    include: {
      analytics: true
    }
  });
  return NextResponse.json(cameras);
}
