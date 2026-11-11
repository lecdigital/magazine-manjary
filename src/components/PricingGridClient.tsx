'use client';

import { useState } from 'react';
import { Check, CreditCard, Loader2, Sparkles, ShieldCheck } from 'lucide-react';

export interface PublicPlan {
  id: string;
  nameTa: string;
  nameEn: string;
  descriptionTa: string;
  descriptionEn: string;
  perksTa: string;
  perksEn: string;
  amount: number;
  currency: string;
  billingInterval: string;
  stripeProductId: string;
  stripePriceId: string;
  sortOrder: number;
}

export function PricingGridClient({
  plans,
  locale,
  subscribeLabel,
}: {
  plans: PublicPlan[];
  locale: string;
  subscribeLabel: string;
}) {
  const [selectedPlan, setSelectedPlan] = useState<PublicPlan | null>(null);
  const [readerName, setReaderName] = useState('');
  const [readerEmail, setReaderEmail] = useState('');
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat(locale === 'ta' ? 'ta-IN' : 'en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
      minimumFractionDigits: amount % 100 === 0 ? 0 : 2,
    }).format(amount / 100);
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlan) return;

    setLoadingPlanId(selectedPlan.id);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          planId: selectedPlan.id,
          name: readerName,
          email: readerEmail,
          locale,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Checkout failed');
      }

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong');
      setLoadingPlanId(null);
    }
  };

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => {
          const isHighlighted = index === 1;
          const title = locale === 'ta' ? plan.nameTa : plan.nameEn;
          const subtitle = locale === 'ta' ? plan.nameEn : plan.nameTa;
          const description =
            locale === 'ta' ? plan.descriptionTa : plan.descriptionEn;
          const perksRaw = locale === 'ta' ? plan.perksTa : plan.perksEn;
          const perks = perksRaw
            ? perksRaw.split('|').filter(Boolean)
            : [];

          const intervalLabel =
            plan.billingInterval === 'year'
              ? locale === 'ta'
                ? '/ ஆண்டுக்கு'
                : '/ year'
              : locale === 'ta'
              ? '/ மாதத்திற்கு'
              : '/ month';

          return (
            <div
              key={plan.id}
              className={`relative rounded-2xl p-7 flex flex-col justify-between transition border ${
                isHighlighted
                  ? 'bg-stone-900 text-parchment-50 border-amber-500/70 shadow-xl scale-[1.02]'
                  : 'bg-white text-stone-900 border-parchment-300 shadow-sm hover:shadow-md'
              }`}
            >
              {isHighlighted && (
                <div className="absolute -top-3.5 left-6 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-amber-400 text-stone-950 text-xs font-bold uppercase tracking-wider shadow-xs">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    {locale === 'ta' ? 'வாசகர் விருப்பம்' : 'Most Popular'}
                  </span>
                </div>
              )}

              <div>
                <h3
                  className={`font-serif text-xl font-bold ${
                    isHighlighted ? 'text-white' : 'text-stone-900'
                  }`}
                >
                  {title}
                </h3>
                <p
                  className={`text-xs mt-1 ${
                    isHighlighted ? 'text-amber-300/90' : 'text-crimson-700'
                  }`}
                >
                  {subtitle}
                </p>

                <div className="mt-6 flex items-baseline gap-1.5">
                  <span className="font-serif text-4xl font-extrabold">
                    {formatAmount(plan.amount, plan.currency)}
                  </span>
                  <span
                    className={`text-sm ${
                      isHighlighted ? 'text-stone-300' : 'text-stone-500'
                    }`}
                  >
                    {intervalLabel}
                  </span>
                </div>

                <p
                  className={`mt-4 text-sm leading-relaxed ${
                    isHighlighted ? 'text-stone-300' : 'text-stone-600'
                  }`}
                >
                  {description}
                </p>

                <ul className="mt-6 space-y-3 border-t border-stone-200/20 pt-5">
                  {perks.map((perk, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-sm">
                      <Check
                        className={`w-4 h-4 mt-1 shrink-0 ${
                          isHighlighted ? 'text-amber-400' : 'text-crimson-700'
                        }`}
                      />
                      <span
                        className={
                          isHighlighted ? 'text-stone-200' : 'text-stone-700'
                        }
                      >
                        {perk}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPlan(plan);
                    setErrorMsg(null);
                  }}
                  className={`w-full py-3 px-4 rounded-xl font-semibold text-sm inline-flex items-center justify-center gap-2 transition cursor-pointer ${
                    isHighlighted
                      ? 'bg-amber-400 hover:bg-amber-300 text-stone-950 shadow-sm'
                      : 'bg-crimson-800 hover:bg-crimson-700 text-white'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>{subscribeLabel}</span>
                </button>
                <p
                  className={`mt-2 text-[11px] text-center font-mono ${
                    isHighlighted ? 'text-stone-400' : 'text-stone-400'
                  }`}
                >
                  Stripe Price: {plan.stripePriceId}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Checkout Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-parchment-300">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-crimson-700">
                  Stripe Dynamic Checkout
                </span>
                <h4 className="font-serif text-xl font-bold text-stone-900 mt-0.5">
                  {locale === 'ta' ? selectedPlan.nameTa : selectedPlan.nameEn}
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPlan(null)}
                className="text-stone-400 hover:text-stone-700 text-sm font-medium"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCheckoutSubmit} className="mt-5 space-y-4">
              <div className="bg-parchment-100 rounded-xl p-3.5 flex items-center justify-between">
                <span className="text-xs text-stone-600 font-medium">
                  {locale === 'ta' ? 'சந்தாத் தொகை' : 'Subscription Total'}
                </span>
                <span className="font-serif text-lg font-bold text-crimson-800">
                  {formatAmount(selectedPlan.amount, selectedPlan.currency)} /{' '}
                  {selectedPlan.billingInterval}
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {locale === 'ta' ? 'உங்கள் பெயர் (Full Name)' : 'Your Name'}
                </label>
                <input
                  type="text"
                  required
                  value={readerName}
                  onChange={(e) => setReaderName(e.target.value)}
                  placeholder={
                    locale === 'ta'
                      ? 'எ.கா: சுந்தரம் நடராஜன்'
                      : 'e.g. Sundaram Natarajan'
                  }
                  className="w-full rounded-lg border border-stone-300 px-3.5 py-2.5 text-sm focus:border-crimson-700 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {locale === 'ta'
                    ? 'மின்னஞ்சல் முகவரி (Email Address)'
                    : 'Email Address'}
                </label>
                <input
                  type="email"
                  required
                  value={readerEmail}
                  onChange={(e) => setReaderEmail(e.target.value)}
                  placeholder="reader@example.com"
                  className="w-full rounded-lg border border-stone-300 px-3.5 py-2.5 text-sm focus:border-crimson-700 focus:outline-none"
                />
              </div>

              {errorMsg && (
                <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg">
                  {errorMsg}
                </p>
              )}

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedPlan(null)}
                  className="w-1/3 py-2.5 rounded-lg border border-stone-300 text-stone-700 text-sm font-medium hover:bg-stone-100"
                >
                  {locale === 'ta' ? 'ரத்து' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={loadingPlanId === selectedPlan.id}
                  className="w-2/3 py-2.5 px-4 rounded-lg bg-crimson-800 hover:bg-crimson-700 text-white text-sm font-semibold inline-flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {loadingPlanId === selectedPlan.id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>
                        {locale === 'ta'
                          ? 'சந்தாவை உறுதி செய்'
                          : 'Proceed to Checkout'}
                      </span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

