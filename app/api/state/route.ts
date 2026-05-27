import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const globalState = await prisma.globalState.findUnique({
      where: { id: "singleton" },
    });

    if (!globalState) {
      return NextResponse.json({ success: true, state: null });
    }

    return NextResponse.json({ success: true, state: globalState.stateData });
  } catch (err: any) {
    console.error("Error fetching global state:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body || typeof body !== "object") {
      return NextResponse.json({ success: false, error: "Invalid state data payload" }, { status: 400 });
    }

    const updatedState = await prisma.globalState.upsert({
      where: { id: "singleton" },
      update: { stateData: body },
      create: {
        id: "singleton",
        stateData: body,
      },
    });

    return NextResponse.json({ success: true, state: updatedState.stateData });
  } catch (err: any) {
    console.error("Error updating global state:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
