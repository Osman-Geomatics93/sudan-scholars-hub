import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const allAds = await prisma.advertisement.findMany();
  console.log('All advertisements:', JSON.stringify(allAds, null, 2));

  const activeAds = await prisma.advertisement.findMany({
    where: { isActive: true },
    orderBy: { order: 'asc' },
  });
  console.log('\nActive advertisements:', JSON.stringify(activeAds, null, 2));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
