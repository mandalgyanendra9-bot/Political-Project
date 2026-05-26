import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

async function getRoleFromToken(token) {
  if (!token) return null;

  const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'super-secret-pdp-key');

  try {
    const { payload } = await jwtVerify(token, secret);
    return payload?.role || null;
  } catch {
    return null;
  }
}

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith('/admin') && !pathname.startsWith('/api/admin')) {
    return NextResponse.next();
  }

  const token = request.cookies.get('auth_token')?.value;
  const role = await getRoleFromToken(token);

  if (role === 'ADMIN') {
    return NextResponse.next();
  }

  if (pathname.startsWith('/api/admin')) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const loginUrl = new URL('/login', request.url);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
