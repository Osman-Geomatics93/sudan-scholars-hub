import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgres://2e99221efa0ad0820b96c8808ff5f528972ce4eb6caf4aecee26dbf3bc58bb7a:sk_lvn4QBfFDS7L7BkaXGAia@db.prisma.io:5432/postgres?sslmode=require"
    }
  }
});

async function main() {
  try {
    // Check PageView table
    const pageViews = await prisma.pageView.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10
    });
    console.log('=== Page Views ===');
    console.log('Count:', pageViews.length);
    pageViews.forEach(pv => {
      console.log(`- ${pv.path} | ${pv.locale} | ${pv.createdAt}`);
    });

    // Check DownloadEvent table
    const downloads = await prisma.downloadEvent.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10
    });
    console.log('\n=== Downloads ===');
    console.log('Count:', downloads.length);
    downloads.forEach(d => {
      console.log(`- ${d.fileName} | ${d.category} | ${d.createdAt}`);
    });

  } catch (error) {
    console.error('Error:', error.message);
    if (error.message.includes('does not exist')) {
      console.log('\n⚠️ Tables do not exist in production database!');
      console.log('You need to push the schema to production.');
    }
  } finally {
    await prisma.$disconnect();
  }
}

main();
