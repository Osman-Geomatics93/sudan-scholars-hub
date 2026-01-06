import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('Testing database connection...\n');

    // Test connection by counting records
    const scholarshipCount = await prisma.scholarship.count();
    const adminCount = await prisma.admin.count();
    const countryCount = await prisma.country.count();
    const testimonialCount = await prisma.testimonial.count();

    console.log('✓ Connection successful!\n');
    console.log('Database: sudan_scholars_hub');
    console.log('----------------------------');
    console.log(`Scholarships: ${scholarshipCount}`);
    console.log(`Admins: ${adminCount}`);
    console.log(`Countries: ${countryCount}`);
    console.log(`Testimonials: ${testimonialCount}`);

    // Get admin email
    const admin = await prisma.admin.findFirst();
    if (admin) {
      console.log(`\nAdmin email: ${admin.email}`);
    }

  } catch (error) {
    console.error('✗ Connection failed!');
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
