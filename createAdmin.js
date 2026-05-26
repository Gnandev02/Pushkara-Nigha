import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@ap.gov.in';
  
  // Check if admin already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email },
  });

  if (existingAdmin) {
    console.log(`Admin user ${email} already exists.`);
    return;
  }

  // Use a secure password hashing mechanism
  const password = 'AdminPassword123!';
  const hashedPassword = await bcrypt.hash(password, 10);

  const adminUser = await prisma.user.create({
    data: {
      name: 'System Administrator',
      email: email,
      password: hashedPassword,
      role: 'admin',
      approved: true, // Auto-approve the first admin
    },
  });

  console.log(`Successfully created root admin account:`);
  console.log(`Email: ${adminUser.email}`);
  console.log(`Role: ${adminUser.role}`);
  console.log(`Password: ${password}`);
  console.log(`Please login and change this password immediately via the User Management panel if applicable.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
