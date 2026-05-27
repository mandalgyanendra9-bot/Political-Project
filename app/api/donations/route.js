import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json(
    { error: 'Direct donation API is disabled. Use verified online payment flow.' },
    { status: 410 }
  );
}
