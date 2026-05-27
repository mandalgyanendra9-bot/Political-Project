import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyRazorpayWebhookSignature } from '@/lib/payments/razorpay';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const signature = request.headers.get('x-razorpay-signature') || '';
    const rawBody = await request.text();

    if (!verifyRazorpayWebhookSignature(rawBody, signature)) {
      return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const event = String(payload.event || '');

    const paymentEntity = payload?.payload?.payment?.entity;
    const orderId = String(paymentEntity?.order_id || '').trim();
    const paymentId = String(paymentEntity?.id || '').trim();
    const failureReason = String(paymentEntity?.error_description || paymentEntity?.error_reason || '').trim();

    if (!orderId) {
      return NextResponse.json({ success: true, ignored: true });
    }

    if (event === 'payment.captured' || event === 'payment.authorized') {
      await prisma.$transaction(async (tx) => {
        const attempt = await tx.donationPaymentAttempt.findUnique({
          where: { gatewayOrderId: orderId },
        });

        if (!attempt) return;

        await tx.donationPaymentAttempt.update({
          where: { gatewayOrderId: orderId },
          data: {
            status: 'SUCCESS',
            gatewayPaymentId: paymentId || attempt.gatewayPaymentId,
            failureReason: null,
          },
        });

        if (paymentId) {
          const existingDonation = await tx.donation.findUnique({
            where: { gatewayPaymentId: paymentId },
          });

          if (!existingDonation) {
            await tx.donation.create({
              data: {
                userId: attempt.userId,
                amount: attempt.amount,
                referenceId: paymentId,
                status: 'SUCCESS',
                paymentMode: 'ONLINE',
                gateway: 'RAZORPAY',
                gatewayOrderId: orderId,
                gatewayPaymentId: paymentId,
                verifiedAt: new Date(),
              },
            });
          }
        }
      });
    }

    if (event === 'payment.failed') {
      await prisma.donationPaymentAttempt.updateMany({
        where: { gatewayOrderId: orderId },
        data: {
          status: 'FAILED',
          gatewayPaymentId: paymentId || null,
          failureReason: failureReason || 'Payment failed',
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Razorpay webhook error:', error);
    return NextResponse.json({ error: 'Webhook handling failed' }, { status: 500 });
  }
}
