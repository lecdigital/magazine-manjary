import Stripe from 'stripe';

const rawSecretKey = process.env.STRIPE_SECRET_KEY || '';

export const isLiveStripeConfigured =
  Boolean(rawSecretKey) &&
  !rawSecretKey.includes('placeholder') &&
  (rawSecretKey.startsWith('sk_test_') || rawSecretKey.startsWith('sk_live_'));

export const stripe = isLiveStripeConfigured
  ? new Stripe(rawSecretKey, {
      apiVersion: '2025-02-24.acacia',
    })
  : null;

export interface SyncStripePlanInput {
  nameEn: string;
  nameTa: string;
  descriptionEn: string;
  amount: number; // in cents
  currency: string;
  billingInterval: 'month' | 'year';
  existingProductId?: string | null;
  existingPriceId?: string | null;
  priceChanged?: boolean;
}

export interface SyncStripePlanResult {
  stripeProductId: string;
  stripePriceId: string;
  deactivatedPriceId: string | null;
  mode: 'stripe-api' | 'local-simulated';
}

/**
 * Synchronizes a SubscriptionPlan with Stripe.
 * - Creates or updates the Stripe Product
 * - When a plan is created or its price/interval/currency changes:
 *   1. Generates a new Stripe Price
 *   2. Deactivates (archives) the old Stripe Price
 *   3. Returns the new stripeProductId & stripePriceId to persist in Prisma
 */
export async function syncSubscriptionPlanWithStripe(
  input: SyncStripePlanInput
): Promise<SyncStripePlanResult> {
  const {
    nameEn,
    nameTa,
    descriptionEn,
    amount,
    currency,
    billingInterval,
    existingProductId,
    existingPriceId,
    priceChanged = true,
  } = input;

  if (!stripe || !isLiveStripeConfigured) {
    const suffix = Math.random().toString(36).substring(2, 8);
    const productId = existingProductId || `prod_local_${suffix}`;
    const newPriceId = priceChanged || !existingPriceId
      ? `price_local_${amount}_${billingInterval}_${suffix}`
      : existingPriceId;

    return {
      stripeProductId: productId,
      stripePriceId: newPriceId,
      deactivatedPriceId:
        priceChanged && existingPriceId && existingPriceId !== newPriceId
          ? existingPriceId
          : null,
      mode: 'local-simulated',
    };
  }

  let productId = existingProductId || '';

  // 1. Ensure Stripe Product exists or update its metadata/name
  if (productId && !productId.startsWith('prod_local_') && !productId.startsWith('prod_manjary_')) {
    await stripe.products.update(productId, {
      name: `${nameEn} (${nameTa})`,
      description: descriptionEn,
    });
  } else {
    const product = await stripe.products.create({
      name: `${nameEn} (${nameTa})`,
      description: descriptionEn,
      metadata: {
        platform: 'Manjary',
        nameTa,
      },
    });
    productId = product.id;
  }

  // 2. If price, currency, or billing interval changed (or no valid Stripe price exists), create a new Stripe Price
  let priceId = existingPriceId || '';
  let deactivatedPriceId: string | null = null;

  const needsNewPrice =
    priceChanged ||
    !priceId ||
    priceId.startsWith('price_local_') ||
    priceId.startsWith('price_manjary_');

  if (needsNewPrice) {
    const newPrice = await stripe.prices.create({
      product: productId,
      unit_amount: amount,
      currency: currency.toLowerCase(),
      recurring: {
        interval: billingInterval === 'year' ? 'year' : 'month',
      },
      metadata: {
        nameTa,
        nameEn,
      },
    });

    // Deactivate old Stripe price if it was a real Stripe price ID
    if (
      existingPriceId &&
      !existingPriceId.startsWith('price_local_') &&
      !existingPriceId.startsWith('price_manjary_')
    ) {
      try {
        await stripe.prices.update(existingPriceId, { active: false });
        deactivatedPriceId = existingPriceId;
      } catch (err) {
        console.warn('Could not deactivate old Stripe price:', err);
      }
    }

    priceId = newPrice.id;
  }

  return {
    stripeProductId: productId,
    stripePriceId: priceId,
    deactivatedPriceId,
    mode: 'stripe-api',
  };
}

