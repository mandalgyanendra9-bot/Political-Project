import { NextResponse } from 'next/server';
import { getUserSession } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { verifyRazorpayPaymentSignature } from '@/lib/payments/razorpay';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const session = await getUserSession();
    const body = await request.json();

    const orderId = String(body.razorpay_order_id || '').trim();
    const paymentId = String(body.razorpay_payment_id || '').trim();
    const signature = String(body.razorpay_signature || '').trim();

    if (!orderId || !paymentId || !signature) {
      return NextResponse.json({ error: 'Missing payment verification fields' }, { status: 400 });
    }

    const isSignatureValid = verifyRazorpayPaymentSignature({ orderId, paymentId, signature });

    const existingAttempt = await prisma.donationPaymentAttempt.findUnique({
      where: { gatewayOrderId: orderId },
    });

    if (!existingAttempt) {
      return NextResponse.json({ error: 'Payment attempt not found' }, { status: 404 });
    }

    if (!isSignatureValid) {
      await prisma.donationPaymentAttempt.update({
        where: { gatewayOrderId: orderId },
        data: {
          status: 'FAILED',
          gatewayPaymentId: paymentId,
          failureReason: 'Signature verification failed',
        },
      });

      return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 });
    }

    const result = await prisma.$transaction(async (tx) => {
      await tx.donationPaymentAttempt.update({
        where: { gatewayOrderId: orderId },
        data: {
          status: 'SUCCESS',
          gatewayPaymentId: paymentId,
          failureReason: null,
        },
      });

      const existingDonation = await tx.donation.findUnique({
        where: { gatewayPaymentId: paymentId },
      });

      if (existingDonation) {
        return existingDonation;
      }

      return tx.donation.create({
        data: {
          userId: existingAttempt.userId || session?.userId || null,
          amount: existingAttempt.amount,
          referenceId: paymentId,
          status: 'SUCCESS',
          paymentMode: 'ONLINE',
          gateway: 'RAZORPAY',
          gatewayOrderId: orderId,
          gatewayPaymentId: paymentId,
          gatewaySignature: signature,
          verifiedAt: new Date(),
        },
      });
    });

    return NextResponse.json({ success: true, donation: result });
  } catch (error) {
    console.error('Verify payment error:', error);
    return NextResponse.json({ error: 'Failed to verify payment' }, { status: 500 });
  }
}
