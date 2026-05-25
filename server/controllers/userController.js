import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

// List all supervisors
export const getSupervisors = async (req, res) => {
  try {
    const supervisors = await prisma.user.findMany({
      where: { role: 'command-supervisor' },
      orderBy: { createdAt: 'asc' }
    });
    
    const list = supervisors.map(s => ({
      fullName: s.fullName,
      employeeId: s.employeeId,
      mobileNumber: s.mobileNumber,
      email: s.email,
      username: s.username,
      password: s.passcode, // return the plaintext passcode for ICCC admin console edit views
      assignedDistrict: s.assignedDistrict,
      shiftTiming: s.shiftTiming,
      status: s.status,
      lastLogin: s.lastLogin
    }));
    
    return res.json(list);
  } catch (error) {
    console.error('Error fetching supervisors:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch supervisors directory.' });
  }
};

// Get single supervisor
export const getSupervisor = async (req, res) => {
  const { username } = req.params;
  try {
    const s = await prisma.user.findFirst({
      where: { username: username.toLowerCase(), role: 'command-supervisor' }
    });
    if (!s) {
      return res.status(404).json({ success: false, message: 'Supervisor not found.' });
    }
    return res.json({
      fullName: s.fullName,
      employeeId: s.employeeId,
      mobileNumber: s.mobileNumber,
      email: s.email,
      username: s.username,
      password: s.passcode,
      assignedDistrict: s.assignedDistrict,
      shiftTiming: s.shiftTiming,
      status: s.status,
      lastLogin: s.lastLogin
    });
  } catch (error) {
    console.error('Error fetching supervisor:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch supervisor details.' });
  }
};

// Create a new supervisor
export const addSupervisor = async (req, res) => {
  const { fullName, employeeId, mobileNumber, email, username, password, assignedDistrict, shiftTiming, status } = req.body;
  const normalizedUsername = username.trim().toLowerCase();

  try {
    if (normalizedUsername === 'admin') {
      return res.status(400).json({ success: false, message: "Username 'admin' is reserved." });
    }

    const existingUser = await prisma.user.findUnique({
      where: { username: normalizedUsername }
    });
    if (existingUser) {
      return res.status(400).json({ success: false, message: `Username "${normalizedUsername}" already exists.` });
    }

    const existingEmp = await prisma.user.findFirst({
      where: { employeeId: employeeId.trim().toUpperCase() }
    });
    if (existingEmp) {
      return res.status(400).json({ success: false, message: `Employee ID "${employeeId}" is already assigned.` });
    }

    const passwordHash = bcrypt.hashSync(password, 10);

    const newUser = await prisma.user.create({
      data: {
        username: normalizedUsername,
        password: passwordHash,
        passcode: password,
        role: 'command-supervisor',
        fullName: fullName.trim(),
        employeeId: employeeId.trim().toUpperCase(),
        mobileNumber: mobileNumber.trim(),
        email: email.trim(),
        assignedDistrict: assignedDistrict || 'East Godavari',
        shiftTiming: shiftTiming || 'Morning Shift',
        status: status || 'active',
        lastLogin: 'Never'
      }
    });

    return res.json({
      success: true,
      message: `Supervisor account created successfully for "${newUser.fullName}".`,
      supervisor: {
        fullName: newUser.fullName,
        employeeId: newUser.employeeId,
        mobileNumber: newUser.mobileNumber,
        email: newUser.email,
        username: newUser.username,
        password: newUser.passcode,
        assignedDistrict: newUser.assignedDistrict,
        shiftTiming: newUser.shiftTiming,
        status: newUser.status,
        lastLogin: newUser.lastLogin
      }
    });
  } catch (error) {
    console.error('Error adding supervisor:', error);
    return res.status(500).json({ success: false, message: 'Failed to create supervisor account.' });
  }
};

// Update supervisor fields
export const updateSupervisor = async (req, res) => {
  const { username } = req.params;
  const updatedFields = req.body;

  try {
    const s = await prisma.user.findFirst({
      where: { username: username.toLowerCase(), role: 'command-supervisor' }
    });

    if (!s) {
      return res.status(404).json({ success: false, message: 'Supervisor not found.' });
    }

    const dataToUpdate = {};
    if (updatedFields.fullName !== undefined) dataToUpdate.fullName = updatedFields.fullName.trim();
    if (updatedFields.mobileNumber !== undefined) dataToUpdate.mobileNumber = updatedFields.mobileNumber.trim();
    if (updatedFields.email !== undefined) dataToUpdate.email = updatedFields.email.trim();
    if (updatedFields.assignedDistrict !== undefined) dataToUpdate.assignedDistrict = updatedFields.assignedDistrict;
    if (updatedFields.shiftTiming !== undefined) dataToUpdate.shiftTiming = updatedFields.shiftTiming;
    if (updatedFields.status !== undefined) dataToUpdate.status = updatedFields.status;
    if (updatedFields.lastLogin !== undefined) dataToUpdate.lastLogin = updatedFields.lastLogin;

    if (updatedFields.password !== undefined && updatedFields.password !== '') {
      dataToUpdate.passcode = updatedFields.password;
      dataToUpdate.password = bcrypt.hashSync(updatedFields.password, 10);
    }

    const updated = await prisma.user.update({
      where: { id: s.id },
      data: dataToUpdate
    });

    return res.json({
      success: true,
      message: `Details updated successfully for ${updated.fullName}.`,
      supervisor: {
        fullName: updated.fullName,
        employeeId: updated.employeeId,
        mobileNumber: updated.mobileNumber,
        email: updated.email,
        username: updated.username,
        password: updated.passcode,
        assignedDistrict: updated.assignedDistrict,
        shiftTiming: updated.shiftTiming,
        status: updated.status,
        lastLogin: updated.lastLogin
      }
    });
  } catch (error) {
    console.error('Error updating supervisor:', error);
    return res.status(500).json({ success: false, message: 'Failed to update supervisor details.' });
  }
};

// Delete supervisor from database
export const deleteSupervisor = async (req, res) => {
  const { username } = req.params;
  try {
    const s = await prisma.user.findFirst({
      where: { username: username.toLowerCase(), role: 'command-supervisor' }
    });

    if (!s) {
      return res.status(404).json({ success: false, message: 'Supervisor not found.' });
    }

    await prisma.user.delete({
      where: { id: s.id }
    });

    return res.json({
      success: true,
      message: `Account "${s.fullName}" removed from security grid.`
    });
  } catch (error) {
    console.error('Error deleting supervisor:', error);
    return res.status(500).json({ success: false, message: 'Failed to remove supervisor account.' });
  }
};
