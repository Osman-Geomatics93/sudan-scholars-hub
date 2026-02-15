import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { SEED_TESTS, SEED_VOCAB } from '@/lib/ielts-toefl/seed-data';

export async function POST() {
  try {
    // Check if seed data already exists
    const existingTests = await prisma.ieltsToeflTest.count({ where: { isOfficial: true } });
    const existingVocab = await prisma.ieltsToeflVocab.count();

    let testsCreated = 0;
    let vocabCreated = 0;

    if (existingTests === 0) {
      for (const test of SEED_TESTS) {
        await prisma.ieltsToeflTest.create({
          data: {
            ...test,
            isOfficial: true,
            isPublic: true,
          },
        });
        testsCreated++;
      }
    }

    if (existingVocab === 0) {
      for (const vocab of SEED_VOCAB) {
        await prisma.ieltsToeflVocab.create({
          data: vocab,
        });
        vocabCreated++;
      }
    }

    return NextResponse.json({
      message: 'Seed complete',
      testsCreated,
      vocabCreated,
      skippedTests: existingTests > 0,
      skippedVocab: existingVocab > 0,
    });
  } catch (err) {
    console.error('Error seeding data:', err);
    return NextResponse.json({ error: 'Failed to seed data' }, { status: 500 });
  }
}
