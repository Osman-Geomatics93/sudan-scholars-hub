import { prisma } from '@/lib/prisma';

/**
 * Generate a unique student number in format SSH-YYYY-NNNNN
 * SSH = Sudanese Study Hub, YYYY = current year, NNNNN = 5-digit sequential
 */
export async function generateStudentNumber(userId: string): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `SSH-${year}-`;

  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      // Count existing student numbers for this year
      const count = await prisma.user.count({
        where: {
          studentNumber: { startsWith: prefix },
        },
      });

      const nextNumber = String(count + 1).padStart(5, '0');
      const studentNumber = `${prefix}${nextNumber}`;

      // Attempt to set it — unique constraint will reject duplicates
      const updated = await prisma.user.update({
        where: { id: userId },
        data: { studentNumber },
        select: { studentNumber: true },
      });

      return updated.studentNumber!;
    } catch (error: any) {
      // P2002 = unique constraint violation (race condition)
      if (error?.code === 'P2002' && attempt < 2) {
        continue;
      }
      throw error;
    }
  }

  throw new Error('Failed to generate student number after 3 attempts');
}
