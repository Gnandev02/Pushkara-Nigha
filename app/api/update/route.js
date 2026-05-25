import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(req) {
  try {
    const data = await req.json();
    const {
      camera_id,
      total_people,
      unique_people,
      male_count,
      female_count,
      unknown_gender,
      risk_score
    } = data;

    if (!camera_id) {
      return NextResponse.json({ success: false, message: 'Missing camera_id.' }, { status: 400 });
    }

    // 1. Calculate density based on standard capacity threshold
    const capacityThreshold = 100;
    const density = Math.min(parseFloat((total_people / capacityThreshold).toFixed(4)), 1.0);

    // 2. Ensure camera exists in database (Upsert)
    const camera = await prisma.camera.upsert({
      where: { cameraId: camera_id },
      update: { status: risk_score > 0.7 ? 'critical' : risk_score > 0.4 ? 'warning' : 'active' },
      create: {
        cameraId: camera_id,
        name: `Camera ${camera_id.toUpperCase().replace('_', ' ')}`,
        location: `Ghat Security Grid ${camera_id.split('_')[1] || 'Main Area'}`,
        status: risk_score > 0.7 ? 'critical' : risk_score > 0.4 ? 'warning' : 'active'
      }
    });

    // 3. Save telemetry data inside Analytics table
    const analyticsRecord = await prisma.analytics.create({
      data: {
        cameraId: camera_id,
        totalPeople: parseInt(total_people) || 0,
        uniquePeople: parseInt(unique_people) || 0,
        maleCount: parseInt(male_count) || 0,
        femaleCount: parseInt(female_count) || 0,
        unknownGender: parseInt(unknown_gender) || 0,
        density: density,
        riskScore: parseFloat(risk_score) || 0.0
      },
      include: {
        camera: true
      }
    });

    // 4. Automated Alert Checking System
    let activeAlert = null;
    if (total_people > 75) {
      activeAlert = await prisma.alert.create({
        data: {
          cameraId: camera_id,
          message: `HIGH DENSITY DETECTED: ${total_people} operators at security grid exceed buffer capacity threshold!`,
          severity: total_people > 90 ? 'critical' : 'warning',
        }
      });
    } else if (risk_score > 0.65) {
      activeAlert = await prisma.alert.create({
        data: {
          cameraId: camera_id,
          message: `STAMPEDE RISK ALERT: Chaotic flow motion vectors detected (Risk Index: ${(risk_score * 100).toFixed(0)}%).`,
          severity: risk_score > 0.8 ? 'critical' : 'warning',
        }
      });
    }

    // 5. Broadcast to Socket.IO live dashboard in real time
    if (global.io) {
      // Broadcast live updates to dashboard
      global.io.emit('analytics_update', {
        ...analyticsRecord,
        timestamp: analyticsRecord.createdAt
      });

      if (activeAlert) {
        global.io.emit('alert_trigger', activeAlert);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Telemetry updated successfully.',
      analytics: analyticsRecord,
      alert: activeAlert
    });

  } catch (error) {
    console.error('Error receiving AI telemetry update:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
