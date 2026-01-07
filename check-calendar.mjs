import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: "postgres://2e99221efa0ad0820b96c8808ff5f528972ce4eb6caf4aecee26dbf3bc58bb7a:sk_lvn4QBfFDS7L7BkaXGAia@db.prisma.io:5432/postgres?sslmode=require"
    }
  }
});

async function main() {
  const scholarships = await prisma.scholarship.findMany({
    select: {
      id: true,
      title: true,
      deadline: true,
      isPublished: true
    }
  });

  console.log('=== All Scholarships ===');
  console.log('Total:', scholarships.length);

  for (const s of scholarships) {
    console.log('');
    console.log('- ' + s.title);
    console.log('  ID: ' + s.id);
    console.log('  Deadline: ' + (s.deadline ? s.deadline.toISOString() : 'NOT SET'));
    console.log('  Published: ' + s.isPublished);
  }

  const withDeadlines = scholarships.filter(s => s.deadline);
  console.log('');
  console.log('Scholarships with deadlines: ' + withDeadlines.length);
  console.log('Scholarships without deadlines: ' + (scholarships.length - withDeadlines.length));

  await prisma.$disconnect();
}

main();
