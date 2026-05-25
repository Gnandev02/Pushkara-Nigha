import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'pushkara_secret_key_neural_grid';

export const login = async (req, res) => {
  const { username, password, role } = req.body;

  try {
    const inputUser = username.trim().toLowerCase();
    
    // Find user in database
    const user = await prisma.user.findUnique({
      where: { username: inputUser }
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. User not found.' });
    }

    // Validate role
    if (user.role !== role) {
      return res.status(403).json({ success: false, message: 'Access denied: Clearance mismatch.' });
    }

    // Validate active status
    if (user.status === 'inactive') {
      return res.status(403).json({ success: false, message: 'Account is currently deactivated.' });
    }

    // Check password
    const isPasswordValid = bcrypt.compareSync(password.trim(), user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid password.' });
    }

    // Update lastLogin timestamp
    const nowISO = new Date().toISOString();
    await prisma.user.update({
      where: { username: inputUser },
      data: { lastLogin: nowISO }
    });

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return success response without leaking password hash
    const sessionUser = {
      username: user.username,
      fullName: user.fullName,
      role: user.role,
      employeeId: user.employeeId,
      district: user.assignedDistrict,
    };

    return res.json({
      success: true,
      message: 'Authorized.',
      token,
      user: sessionUser
    });
  } catch (error) {
    console.error('Authentication Error:', error);
    return res.status(500).json({ success: false, message: 'Internal server login error.' });
  }
};

export const logout = (req, res) => {
  return res.json({ success: true, message: 'Logged out successfully.' });
};
