import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import bcrypt from 'bcryptjs';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session || role !== 'ADMIN') {
    return null;
  }
  return session;
}

export async function GET() {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const subscriptions = await prisma.subscription.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
        },
      },
      plan: true,
    },
  });

  return NextResponse.json({ subscriptions });
}

export async function POST(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { name, email, planId, status = 'active' } = body;

    if (!name || !email || !planId) {
      return NextResponse.json(
        { error: 'Name, email, and planId are required' },
        { status: 400 }
      );
    }

    const plan = await prisma.subscriptionPlan.findUnique({
      where: { id: planId },
    });

    if (!plan) {
      return NextResponse.json({ error: 'Plan not found' }, { status: 404 });
    }

    const defaultPasswordHash = await bcrypt.hash('ReaderPass2026!', 10);

    const user = await prisma.user.upsert({
      where: { email: email.trim().toLowerCase() },
      update: { name },
      create: {
        name,
        email: email.trim().toLowerCase(),
        passwordHash: defaultPasswordHash,
        role: 'SUBSCRIBER',
      },
    });

    const days = plan.billingInterval === 'year' ? 365 : 30;
    const subscription = await prisma.subscription.create({
      data: {
        userId: user.id,
        planId: plan.id,
        stripeCustomerId: `cus_manual_${Math.random().toString(36).substring(2, 8)}`,
        stripeSubscriptionId: `sub_manual_${Math.random().toString(36).substring(2, 10)}`,
        status,
        currentPeriodEnd: new Date(Date.now() + 1000 * 60 * 60 * 24 * days),
      },
      include: {
        user: true,
        plan: true,
      },
    });

    return NextResponse.json({ subscription });
  } catch (error) {
    console.error('Error creating subscriber:', error);
    return NextResponse.json(
      { error: 'Failed to create subscriber' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, status } = body;

    const updated = await prisma.subscription.update({
      where: { id },
      data: { status },
      include: { user: true, plan: true },
    });

    return NextResponse.json({ subscription: updated });
  } catch (error) {
    console.error('Error updating subscription status:', error);
    return NextResponse.json(
      { error: 'Failed to update subscription status' },
      { status: 500 }
    );
  }
}

