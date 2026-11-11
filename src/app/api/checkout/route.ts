import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { stripe, isLiveStripeConfigured } from '@/lib/stripe';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { planId, email, name, locale = 'ta' } = body;

    if (!planId) {
      return NextResponse.json(
        { error: 'Subscription plan ID is required' },
        { status: 400 }
      );
    }

    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: planId },
    });

    if (!plan || !plan.isActive) {
      return NextResponse.json(
        { error: 'Selected subscription plan is not available' },
        { status: 404 }
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

    // Live Stripe Checkout Session when valid Stripe keys are configured
    if (
      stripe &&
      isLiveStripeConfigured &&
      plan.stripePriceId &&
      !plan.stripePriceId.startsWith('price_local_') &&
      !plan.stripePriceId.startsWith('price_manjary_')
    ) {
      const checkoutSession = await stripe.checkout.sessions.create({
        mode: 'subscription',
        payment_method_types: ['card'],
        customer_email: email || undefined,
        line_items: [
          {
            price: plan.stripePriceId,
            quantity: 1,
          },
        ],
        metadata: {
          planId: plan.id,
          subscriberName: name || 'Manjary Reader',
        },
        success_url: `${appUrl}/${locale}/manjary?checkout=success&plan=${encodeURIComponent(
          locale === 'ta' ? plan.nameTa : plan.nameEn
        )}`,
        cancel_url: `${appUrl}/${locale}/manjary?checkout=cancelled`,
      });

      return NextResponse.json({
        mode: 'stripe-live',
        checkoutUrl: checkoutSession.url,
      });
    }

    // Local-First Simulated Checkout (records subscriber in SQLite so the entire flow works out of the box)
    const customerEmail = (email || `reader.${Date.now()}@manjary.local`)
      .trim()
      .toLowerCase();
    const customerName = name || 'மஞ்சரி வாசகர் (Manjary Reader)';
    const passwordHash = await bcrypt.hash('ReaderPass2026!', 10);

    const user = await prisma.user.upsert({
      where: { email: customerEmail },
      update: { name: customerName },
      create: {
        name: customerName,
        email: customerEmail,
        passwordHash,
        role: 'SUBSCRIBER',
      },
    });

    const days = plan.billingInterval === 'year' ? 365 : 30;
    const subscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        planId: plan.id,
        stripeCustomerId: `cus_local_${Math.random().toString(36).substring(2, 9)}`,
        stripeSubscriptionId: `sub_local_${Math.random().toString(36).substring(2, 11)}`,
        status: 'active',
        currentPeriodEnd: new Date(Date.now() + 1000 * 60 * 60 * 24 * days),
      },
    });

    return NextResponse.json({
      mode: 'local-simulated',
      subscriptionId: subscription.id,
      checkoutUrl: `/${locale}/manjary?checkout=success&plan=${encodeURIComponent(
        locale === 'ta' ? plan.nameTa : plan.nameEn
      )}`,
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: 'Unable to initiate checkout session' },
      { status: 500 }
    );
  }
}

