require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const cameras = await prisma.camera.findMany();
  console.log(JSON.stringify(cameras, null, 2));
}

main().catch(console.error).finally(() => process.exit(0));
