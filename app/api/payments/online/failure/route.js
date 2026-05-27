import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const body = await request.json();
    const orderId = String(body.orderId || '').trim();
    const reason = String(body.reason || 'Payment cancelled or failed').trim();

    if (!orderId) {
      return NextResponse.json({ error: 'Missing order id' }, { status: 400 });
    }

    await prisma.donationPaymentAttempt.updateMany({
      where: {
        gatewayOrderId: orderId,
        status: 'PENDING',
      },
      data: {
        status: 'FAILED',
        failureReason: reason,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Payment failure update error:', error);
    return NextResponse.json({ error: 'Failed to update payment status' }, { status: 500 });
  }
}
