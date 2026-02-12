import { prisma } from '@/lib/prisma';
import { NotificationType } from '@prisma/client';

export async function createNotification({
  userId,
  type,
  title,
  message,
  relatedId,
}: {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedId?: string;
}) {
  return prisma.notification.create({
    data: {
      userId,
      type,
      title,
      message,
      relatedId: relatedId || null,
    },
  });
}
