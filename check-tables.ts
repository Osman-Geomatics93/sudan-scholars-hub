import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkTables() {
  try {
    // Query to list all tables in public schema
    const tables = await prisma.$queryRaw`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE';
    `;

    console.log('Tables in database:');
    console.log(tables);

    // Also check the database name
    const dbName = await prisma.$queryRaw`SELECT current_database();`;
    console.log('\nConnected to database:');
    console.log(dbName);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTables();
