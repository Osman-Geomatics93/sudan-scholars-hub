import { auth } from './auth';
import { NextResponse } from 'next/server';
import { Session } from 'next-auth';

// Extended user type with admin flag
interface AdminUser {
  id: string;
  email: string;
  name?: string | null;
  image?: string | null;
  isAdmin: boolean;
}

export async function getAdminSession() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  return session;
}

/**
 * Require admin authentication for API routes
 * Returns the session if user is authenticated AND is an admin
 * Otherwise returns an appropriate error response
 */
export async function requireAdmin(): Promise<{
  session: Session | null;
  error: NextResponse | null;
}> {
  const session = await auth();

  // Not authenticated
  if (!session?.user) {
    return {
      session: null,
      error: NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      )
    };
  }

  // Authenticated but not admin
  const user = session.user as AdminUser;
  if (!user.isAdmin) {
    return {
      session: null,
      error: NextResponse.json(
        { error: 'Forbidden - Admin access required' },
        { status: 403 }
      )
    };
  }

  // Authenticated and is admin
  return { session, error: null };
}

/**
 * Require user authentication (non-admin)
 * Returns the session if user is authenticated
 */
export async function requireAuth(): Promise<{
  session: Session | null;
  error: NextResponse | null;
}> {
  const session = await auth();

  if (!session?.user) {
    return {
      session: null,
      error: NextResponse.json(
        { error: 'Unauthorized - Please log in' },
        { status: 401 }
      )
    };
  }

  return { session, error: null };
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

export function forbiddenResponse() {
  return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
}
