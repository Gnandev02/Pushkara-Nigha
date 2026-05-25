import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/officers — returns all shift officers for the Reporting module
export const getOfficers = async (_req, res) => {
  try {
    const officers = await prisma.shiftOfficer.findMany({
      orderBy: { district: 'asc' },
    });

    // Map to the shape the reporting.js frontend expects
    const mapped = officers.map(o => ({
      name: o.officerName,
      employeeId: o.officerId,
      district: o.district,
      ghat: o.assignedGhat,
      shiftType: o.shiftTime.split('(')[0].trim(),
      startTime: extractTime(o.shiftTime, 'start'),
      endTime: extractTime(o.shiftTime, 'end'),
      status: o.dutyStatus,
      attendance: o.attendance,
      contactNumber: o.contactNumber,
      reportingOfficer: o.reportingOfficer,
      emergencyContact: o.emergencyContact,
    }));

    return res.json(mapped);
  } catch (error) {
    console.error('Error fetching officers:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch shift officers.' });
  }
};

// GET /api/officers/:id — returns single officer by officerId
export const getOfficerById = async (req, res) => {
  const { id } = req.params;
  try {
    const officer = await prisma.shiftOfficer.findFirst({
      where: { officerId: id },
    });

    if (!officer) {
      return res.status(404).json({ success: false, message: 'Officer not found.' });
    }

    return res.json({
      name: officer.officerName,
      employeeId: officer.officerId,
      district: officer.district,
      ghat: officer.assignedGhat,
      shiftType: officer.shiftTime.split('(')[0].trim(),
      startTime: extractTime(officer.shiftTime, 'start'),
      endTime: extractTime(officer.shiftTime, 'end'),
      status: officer.dutyStatus,
      attendance: officer.attendance,
      contactNumber: officer.contactNumber,
      reportingOfficer: officer.reportingOfficer,
      emergencyContact: officer.emergencyContact,
    });
  } catch (error) {
    console.error('Error fetching officer:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch officer details.' });
  }
};

/**
 * Helper — extracts start or end time from strings like:
 * "Morning Shift (06:00 AM - 02:00 PM)"
 */
function extractTime(shiftStr, which) {
  const match = shiftStr.match(/\((.+?)\)/);
  if (!match) return 'N/A';
  const parts = match[1].split('-').map(s => s.trim());
  return which === 'start' ? (parts[0] || 'N/A') : (parts[1] || 'N/A');
}
