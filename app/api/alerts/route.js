import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const resolved = searchParams.get('resolved');

    const filter = {};
    if (resolved !== null) {
      filter.resolved = resolved === 'true';
    }

    const alerts = await prisma.alert.findMany({
      where: filter,
      orderBy: { timestamp: 'desc' },
      take: 50,
      include: {
        camera: true
      }
    });

    return NextResponse.json({
      success: true,
      alerts
    });
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const body = await req.json();
    const { id, resolved } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: 'Missing alert ID.' }, { status: 400 });
    }

    const updatedAlert = await prisma.alert.update({
      where: { id },
      data: {
        resolved: resolved !== undefined ? resolved : true
      }
    });

    // Broadcast to update dashboard
    if (global.io) {
      global.io.emit('alert_resolved', updatedAlert);
    }

    return NextResponse.json({
      success: true,
      message: 'Alert status updated.',
      alert: updatedAlert
    });
  } catch (error) {
    console.error('Error resolving alert:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
