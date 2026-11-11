import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { stripe, isLiveStripeConfigured } from '@/lib/stripe';

export async function POST(request: Request) {
  if (!stripe || !isLiveStripeConfigured) {
    return NextResponse.json({ received: true, mode: 'local-simulated' });
  }

  const signature = request.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json(
      { error: 'Missing Stripe webhook signature or secret' },
      { status: 400 }
    );
  }

  try {
    const rawBody = await request.text();
    const event = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const planId = session.metadata?.planId;
      const subscriberName =
        session.metadata?.subscriberName ||
        session.customer_details?.name ||
        'Manjary Subscriber';
      const email = session.customer_details?.email;

      if (planId && email) {
        const passwordHash = await bcrypt.hash('ReaderPass2026!', 10);
        const user = await prisma.user.upsert({
          where: { email: email.toLowerCase() },
          update: { name: subscriberName },
          create: {
            name: subscriberName,
            email: email.toLowerCase(),
            passwordHash,
            role: 'SUBSCRIBER',
          },
        });

        await prisma.subscription.create({
          data: {
            userId: user.id,
            planId,
            stripeCustomerId: String(session.customer || 'cus_stripe'),
            stripeSubscriptionId: String(
              session.subscription || `sub_${session.id}`
            ),
            status: 'active',
            currentPeriodEnd: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
          },
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Stripe webhook error:', err);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    );
  }
}

