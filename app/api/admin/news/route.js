import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { requireAdminApi, badRequest, serverError, parsePositiveInt } from '@/lib/admin/auth';
import { validateNewsPayload } from '@/lib/admin/validation';

export const dynamic = 'force-dynamic';

export async function GET(request) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  try {
    const { searchParams } = new URL(request.url);
    const page = parsePositiveInt(searchParams.get('page'), 1);
    const pageSize = Math.min(parsePositiveInt(searchParams.get('pageSize'), 20), 100);
    const query = String(searchParams.get('q') || '').trim();

    const where = query
      ? {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { content: { contains: query, mode: 'insensitive' } },
          ],
        }
      : {};

    const [items, total] = await Promise.all([
      prisma.news.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.news.count({ where }),
    ]);

    return NextResponse.json({ items, total, page, pageSize });
  } catch (error) {
    console.error('Admin news list error:', error);
    return serverError('Failed to fetch news');
  }
}

export async function POST(request) {
  const auth = await requireAdminApi();
  if (!auth.ok) return auth.response;

  try {
    const body = await request.json();
    const validation = validateNewsPayload(body);

    if (!validation.ok) {
      return badRequest(validation.error);
    }

    const created = await prisma.news.create({ data: validation.data });
    return NextResponse.json({ item: created }, { status: 201 });
  } catch (error) {
    console.error('Admin news create error:', error);
    return serverError('Failed to create news');
  }
}
