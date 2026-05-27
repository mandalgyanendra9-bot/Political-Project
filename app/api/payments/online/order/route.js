import { NextResponse } from 'next/server';
import { getUserSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { createRazorpayOrder } from '@/lib/payments/razorpay';

export const dynamic = 'force-dynamic';

function toPaise(amountRupees) {
  return Math.round(Number(amountRupees) * 100);
}

export async function POST(request) {
  try {
    const session = await getUserSession();
    const body = await request.json();
    const amount = Number(body.amount);

    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    if (amount < 10) {
      return NextResponse.json({ error: 'Minimum online donation is Rs 10' }, { status: 400 });
    }

    const amountInPaise = toPaise(amount);
    const receipt = `don-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    const { order, keyId } = await createRazorpayOrder({
      amountInPaise,
      receipt,
      notes: {
        source: 'UAP_WEBSITE',
        userId: session?.userId || 'guest',
      },
    });

    const attempt = await prisma.donationPaymentAttempt.create({
      data: {
        userId: session?.userId || null,
        amount,
        currency: 'INR',
        status: 'PENDING',
        gateway: 'RAZORPAY',
        gatewayOrderId: order.id,
      },
      select: {
        id: true,
        gatewayOrderId: true,
      },
    });

    return NextResponse.json({
      keyId,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      attemptId: attempt.id,
      receipt,
    });
  } catch (error) {
    console.error('Create payment order error:', error);
    return NextResponse.json({ error: error.message || 'Failed to initiate payment' }, { status: 500 });
  }
}
