import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

async function fixDatabase() {
  console.log('=== DATABASE CONNECTION CHECK ===\n');

  try {
    // Check current database
    const dbInfo = await prisma.$queryRaw`SELECT current_database(), current_user, inet_server_addr(), inet_server_port();` as any[];
    console.log('Connected to:');
    console.log('  Database:', dbInfo[0].current_database);
    console.log('  User:', dbInfo[0].current_user);
    console.log('  Server:', dbInfo[0].inet_server_addr || 'localhost');
    console.log('  Port:', dbInfo[0].inet_server_port || '5432');

    // Check tables
    const tables = await prisma.$queryRaw`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE';
    ` as any[];

    console.log('\nTables found:', tables.length);
    tables.forEach((t: any) => console.log('  -', t.table_name));

    // Check data counts
    console.log('\n=== DATA COUNTS ===');
    const scholarshipCount = await prisma.scholarship.count();
    const adminCount = await prisma.admin.count();
    const countryCount = await prisma.country.count();

    console.log('Scholarships:', scholarshipCount);
    console.log('Admins:', adminCount);
    console.log('Countries:', countryCount);

    if (scholarshipCount === 0) {
      console.log('\n⚠️  Database is empty! Running seed...\n');
      return false;
    }

    return true;

  } catch (error) {
    console.error('Connection Error:', error);
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

fixDatabase().then(hasData => {
  if (!hasData) {
    console.log('Please run: npm run db:seed');
  }
});
