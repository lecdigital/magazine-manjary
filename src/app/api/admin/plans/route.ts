import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { syncSubscriptionPlanWithStripe } from '@/lib/stripe';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session || role !== 'ADMIN') {
    return null;
  }
  return session;
}

export async function GET() {
  const plans = await prisma.subscriptionPlan.findMany({
    orderBy: { sortOrder: 'asc' },
    include: {
      _count: {
        select: { subscriptions: true },
      },
    },
  });
  return NextResponse.json({ plans });
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      nameTa,
      nameEn,
      descriptionTa,
      descriptionEn,
      perksTa = '',
      perksEn = '',
      amount,
      currency = 'usd',
      billingInterval = 'month',
      isActive = true,
      sortOrder = 1,
    } = body;

    if (!nameTa || !nameEn || typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { error: 'Please provide Tamil & English names and a valid positive amount.' },
        { status: 400 }
      );
    }

    const stripeSync = await syncSubscriptionPlanWithStripe({
      nameTa,
      nameEn,
      descriptionEn: descriptionEn || nameEn,
      amount: Math.round(amount),
      currency,
      billingInterval: billingInterval === 'year' ? 'year' : 'month',
      priceChanged: true,
    });

    const plan = await prisma.subscriptionPlan.create({
      data: {
        nameTa,
        nameEn,
        descriptionTa: descriptionTa || '',
        descriptionEn: descriptionEn || '',
        perksTa,
        perksEn,
        amount: Math.round(amount),
        currency: currency.toLowerCase(),
        billingInterval: billingInterval === 'year' ? 'year' : 'month',
        stripeProductId: stripeSync.stripeProductId,
        stripePriceId: stripeSync.stripePriceId,
        isActive: Boolean(isActive),
        sortOrder: Number(sortOrder) || 1,
      },
    });

    return NextResponse.json({
      plan,
      stripeSync,
    });
  } catch (error) {
    console.error('Error creating subscription plan:', error);
    return NextResponse.json(
      { error: 'Failed to create subscription plan' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const {
      id,
      nameTa,
      nameEn,
      descriptionTa,
      descriptionEn,
      perksTa = '',
      perksEn = '',
      amount,
      currency = 'usd',
      billingInterval = 'month',
      isActive = true,
      sortOrder = 1,
    } = body;

    if (!id) {
      return NextResponse.json({ error: 'Missing plan id' }, { status: 400 });
    }

    const existingPlan = await prisma.subscriptionPlan.findUnique({
      where: { id },
    });

    if (!existingPlan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    const normalizedAmount = Math.round(Number(amount));
    const normalizedCurrency = currency.toLowerCase();
    const normalizedInterval = billingInterval === 'year' ? 'year' : 'month';

    const priceChanged =
      existingPlan.amount !== normalizedAmount ||
      existingPlan.currency !== normalizedCurrency ||
      existingPlan.billingInterval !== normalizedInterval;

    const stripeSync = await syncSubscriptionPlanWithStripe({
      nameTa,
      nameEn,
      descriptionEn: descriptionEn || nameEn,
      amount: normalizedAmount,
      currency: normalizedCurrency,
      billingInterval: normalizedInterval,
      existingProductId: existingPlan.stripeProductId,
      existingPriceId: existingPlan.stripePriceId,
      priceChanged,
    });

    const updatedPlan = await prisma.subscriptionPlan.update({
      where: { id },
      data: {
        nameTa,
        nameEn,
        descriptionTa,
        descriptionEn,
        perksTa,
        perksEn,
        amount: normalizedAmount,
        currency: normalizedCurrency,
        billingInterval: normalizedInterval,
        stripeProductId: stripeSync.stripeProductId,
        stripePriceId: stripeSync.stripePriceId,
        isActive: Boolean(isActive),
        sortOrder: Number(sortOrder) || 1,
      },
    });

    return NextResponse.json({
      plan: updatedPlan,
      stripeSync,
      priceChanged,
    });
  } catch (error) {
    console.error('Error updating subscription plan:', error);
    return NextResponse.json(
      { error: 'Failed to update subscription plan' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Missing plan id' }, { status: 400 });
    }

    await prisma.subscription.deleteMany({ where: { planId: id } });
    await prisma.subscriptionPlan.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting subscription plan:', error);
    return NextResponse.json(
      { error: 'Failed to delete subscription plan' },
      { status: 500 }
    );
  }
}

