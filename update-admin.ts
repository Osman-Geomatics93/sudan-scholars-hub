import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Try to update existing admin first
  try {
    const existingAdmin = await prisma.admin.findFirst();

    if (existingAdmin) {
      // Update existing admin's email
      const admin = await prisma.admin.update({
        where: { id: existingAdmin.id },
        data: { email: 'osmangeomatics1@gmail.com' }
      });
      console.log('Admin updated:', admin);
    } else {
      // Create new admin
      const admin = await prisma.admin.create({
        data: {
          email: 'osmangeomatics1@gmail.com',
          name: 'Admin',
          role: 'SUPER_ADMIN'
        }
      });
      console.log('Admin created:', admin);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
