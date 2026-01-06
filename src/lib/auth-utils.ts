import { auth } from './auth';
import { NextResponse } from 'next/server';

export async function getAdminSession() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  return session;
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

export function forbiddenResponse() {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}
