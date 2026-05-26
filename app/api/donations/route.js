import { NextResponse } from 'next/server';
import { getUserSession } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function POST(request) {
  try {
    const session = await getUserSession();
    const { amount } = await request.json();

    if (!amount || isNaN(amount) || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    // Simulated payment success (in real app, integrate with payment gateway)
    const donation = await prisma.donation.create({
      data: {
        amount: Number(amount),
        referenceId: `SIM-${Date.now()}`,
        userId: session?.userId || undefined,
      },
    });

    return NextResponse.json({ success: true, donation });
  } catch (error) {
    console.error('Donation error:', error);
    return NextResponse.json({ error: 'Failed to process donation' }, { status: 500 });
  }
}
