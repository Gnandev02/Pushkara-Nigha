import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { jwtVerify } from "jose";
import { cookies } from "next/headers";

const prisma = new PrismaClient();
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "fallback-secret-key-for-dev-only");

async function checkAdmin() {
  const token = cookies().get("auth_token")?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    if (payload.role !== "admin") return null;
    return payload;
  } catch {
    return null;
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const admin = await checkAdmin();
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 403 });

  try {
    const { role, approved } = await req.json();
    
    // Validate we're not removing the last admin
    if (role !== "admin" || approved === false) {
      const adminCount = await prisma.user.count({ where: { role: "admin", approved: true } });
      const targetUser = await prisma.user.findUnique({ where: { id: params.id } });
      if (adminCount <= 1 && targetUser?.role === "admin") {
        return NextResponse.json({ error: "Cannot modify the last active admin account" }, { status: 400 });
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id: params.id },
      data: {
        ...(role && { role }),
        ...(approved !== undefined && { approved }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        approved: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
