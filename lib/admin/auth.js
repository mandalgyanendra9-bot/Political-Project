import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getUserSession } from '@/lib/auth';

export async function getAdminSession() {
  const cookieStore = await cookies();
  const session = await getUserSession(cookieStore);

  if (!session || session.role !== 'ADMIN') {
    return null;
  }

  return session;
}

export async function requireAdminApi() {
  const session = await getAdminSession();
  if (!session) {
    return {
      ok: false,
      response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
    };
  }

  return { ok: true, session };
}

export function badRequest(message, details = undefined) {
  return NextResponse.json(
    {
      error: message,
      ...(details ? { details } : {}),
    },
    { status: 400 }
  );
}

export function serverError(message = 'Something went wrong') {
  return NextResponse.json({ error: message }, { status: 500 });
}

export function parsePositiveInt(value, fallback = 1) {
  const numeric = Number.parseInt(value, 10);
  if (Number.isNaN(numeric) || numeric <= 0) {
    return fallback;
  }
  return numeric;
}
