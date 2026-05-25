import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const resolvedParam = searchParams.get("resolved");

    const filter: any = {};
    if (resolvedParam !== null) {
      filter.resolved = resolvedParam === "true";
    }

    const alerts = await prisma.alert.findMany({
      where: filter,
      orderBy: { timestamp: "desc" },
      take: 50,
      include: {
        camera: true
      }
    });

    return NextResponse.json({
      success: true,
      alerts
    });
  } catch (err: any) {
    console.error("Error fetching alerts:", err);
    return NextResponse.json(
      { error: "Failed", details: err.message },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { id, resolved } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "Missing alert ID." }, { status: 400 });
    }

    const updatedAlert = await prisma.alert.update({
      where: { id },
      data: {
        resolved: resolved !== undefined ? resolved : true
      }
    });

    // Broadcast live event via Socket.IO
    if ((global as any).io) {
      (global as any).io.emit("alert_resolved", updatedAlert);
    }

    return NextResponse.json({
      success: true,
      message: "Alert status updated.",
      alert: updatedAlert
    });
  } catch (err: any) {
    console.error("Error updating alert status:", err);
    return NextResponse.json(
      { error: "Failed", details: err.message },
      { status: 500 }
    );
  }
}
