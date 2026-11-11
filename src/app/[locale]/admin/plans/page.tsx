'use client';

import { useEffect, useState } from 'react';
import {
  CreditCard,
  Plus,
  Edit3,
  Trash2,
  RefreshCw,
  CheckCircle2,
  Loader2,
} from 'lucide-react';

interface SubscriptionPlanItem {
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
  isActive: boolean;
  sortOrder: number;
  _count?: { subscriptions: number };
}

export default function AdminPlansPage() {
  const [plans, setPlans] = useState<SubscriptionPlanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [syncMessage, setSyncMessage] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [nameTa, setNameTa] = useState('');
  const [nameEn, setNameEn] = useState('');
  const [descriptionTa, setDescriptionTa] = useState('');
  const [descriptionEn, setDescriptionEn] = useState('');
  const [perksTa, setPerksTa] = useState('');
  const [perksEn, setPerksEn] = useState('');
  const [dollarAmount, setDollarAmount] = useState('9.99');
  const [currency, setCurrency] = useState('usd');
  const [billingInterval, setBillingInterval] = useState<'month' | 'year'>('month');
  const [isActive, setIsActive] = useState(true);
  const [sortOrder, setSortOrder] = useState(1);

  const fetchPlans = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/plans');
    const data = await res.json();
    setPlans(data.plans || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setNameTa('');
    setNameEn('');
    setDescriptionTa('');
    setDescriptionEn('');
    setPerksTa('');
    setPerksEn('');
    setDollarAmount('9.99');
    setCurrency('usd');
    setBillingInterval('month');
    setIsActive(true);
    setSortOrder(plans.length + 1);
  };

  const startEdit = (plan: SubscriptionPlanItem) => {
    setEditingId(plan.id);
    setNameTa(plan.nameTa);
    setNameEn(plan.nameEn);
    setDescriptionTa(plan.descriptionTa);
    setDescriptionEn(plan.descriptionEn);
    setPerksTa(plan.perksTa);
    setPerksEn(plan.perksEn);
    setDollarAmount((plan.amount / 100).toFixed(2));
    setCurrency(plan.currency);
    setBillingInterval(plan.billingInterval === 'year' ? 'year' : 'month');
    setIsActive(plan.isActive);
    setSortOrder(plan.sortOrder);
    setSyncMessage(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSyncMessage(null);

    const amountInCents = Math.round(parseFloat(dollarAmount) * 100);

    const payload = {
      id: editingId,
      nameTa,
      nameEn,
      descriptionTa,
      descriptionEn,
      perksTa,
      perksEn,
      amount: amountInCents,
      currency,
      billingInterval,
      isActive,
      sortOrder,
    };

    const res = await fetch('/api/admin/plans', {
      method: editingId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    setSaving(false);

    if (res.ok) {
      setSyncMessage(
        editingId
          ? '✅ சந்தாத் திட்டம் வெற்றிகரமாகப் புதுப்பிக்கப்பட்டது (Subscription plan updated)'
          : '✅ புதிய சந்தாத் திட்டம் வெற்றிகரமாக உருவாக்கப்பட்டது (Subscription plan created)'
      );
      resetForm();
      fetchPlans();
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/admin/plans?id=${id}`, { method: 'DELETE' });
    if (res.ok) {
      fetchPlans();
    }
  };

  return (
    <div className="space-y-10">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-crimson-700">
          Subscription & Pricing Manager
        </span>
        <h1 className="font-serif text-3xl font-bold text-stone-900 mt-1">
          சந்தாத் திட்டங்கள் & கட்டண மேலாண்மை (/admin/plans)
        </h1>
        <p className="text-sm text-stone-600 mt-1">
          Create or edit bilingual subscription plans, pricing, billing intervals, and reader benefits.
        </p>
      </div>

      {syncMessage && (
        <div className="rounded-2xl bg-emerald-950 text-emerald-100 border border-emerald-700 p-4 flex items-center gap-3 text-xs sm:text-sm font-mono">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{syncMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Column */}
        <div className="lg:col-span-5">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl bg-white border border-parchment-300 p-6 shadow-2xs space-y-4"
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h2 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
                {editingId ? (
                  <>
                    <Edit3 className="w-4 h-4 text-crimson-700" />
                    <span>Edit Subscription Tier</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 text-crimson-700" />
                    <span>Add New Subscription Tier</span>
                  </>
                )}
              </h2>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-xs text-crimson-700 hover:underline font-semibold"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                திட்டத்தின் பெயர் (Tamil Name) *
              </label>
              <input
                type="text"
                required
                value={nameTa}
                onChange={(e) => setNameTa(e.target.value)}
                placeholder="எ.கா: மஞ்சரி வாசகர் - மாதாந்திரத் திட்டம்"
                className="w-full rounded-xl border border-stone-300 px-3.5 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Plan Name (English) *
              </label>
              <input
                type="text"
                required
                value={nameEn}
                onChange={(e) => setNameEn(e.target.value)}
                placeholder="e.g. Manjary Reader — Monthly Pass"
                className="w-full rounded-xl border border-stone-300 px-3.5 py-2 text-sm"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Price (USD/INR) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={dollarAmount}
                  onChange={(e) => setDollarAmount(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Currency
                </label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm bg-white"
                >
                  <option value="usd">USD ($)</option>
                  <option value="cad">CAD ($)</option>
                  <option value="inr">INR (₹)</option>
                  <option value="gbp">GBP (£)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Interval
                </label>
                <select
                  value={billingInterval}
                  onChange={(e) =>
                    setBillingInterval(e.target.value as 'month' | 'year')
                  }
                  className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm bg-white"
                >
                  <option value="month">Monthly</option>
                  <option value="year">Yearly</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                விவரம் (Tamil Description)
              </label>
              <textarea
                rows={2}
                value={descriptionTa}
                onChange={(e) => setDescriptionTa(e.target.value)}
                className="w-full rounded-xl border border-stone-300 px-3.5 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Description (English)
              </label>
              <textarea
                rows={2}
                value={descriptionEn}
                onChange={(e) => setDescriptionEn(e.target.value)}
                className="w-full rounded-xl border border-stone-300 px-3.5 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                சலுகைகள் (Perks in Tamil — separated by | )
              </label>
              <input
                type="text"
                value={perksTa}
                onChange={(e) => setPerksTa(e.target.value)}
                placeholder="மாதாந்திர மின்-இதழ்|அனைத்துச் சிறுகதைகள்"
                className="w-full rounded-xl border border-stone-300 px-3.5 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Perks in English (separated by | )
              </label>
              <input
                type="text"
                value={perksEn}
                onChange={(e) => setPerksEn(e.target.value)}
                placeholder="Monthly digital issue|Full story archive"
                className="w-full rounded-xl border border-stone-300 px-3.5 py-2 text-sm"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <label className="inline-flex items-center gap-2 text-xs font-semibold text-stone-700">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded border-stone-300 text-crimson-800"
                />
                <span>Active on Public Pricing Grid</span>
              </label>

              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-500">Order:</span>
                <input
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(Number(e.target.value))}
                  className="w-16 rounded-lg border border-stone-300 px-2 py-1 text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 rounded-xl bg-crimson-800 hover:bg-crimson-700 text-white font-semibold text-sm flex items-center justify-center gap-2 transition cursor-pointer"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Plan...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-4 h-4" />
                  <span>
                    {editingId
                      ? 'Update Subscription Plan'
                      : 'Create Subscription Plan'}
                  </span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Plans List Column */}
        <div className="lg:col-span-7 space-y-4">
          {loading ? (
            <div className="p-12 text-center text-sm text-stone-500">
              Loading plans...
            </div>
          ) : (
            plans.map((plan) => (
              <div
                key={plan.id}
                className="rounded-2xl bg-white border border-parchment-300 p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                        plan.isActive
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      {plan.isActive ? 'Active' : 'Hidden'}
                    </span>
                    <span className="text-xs text-stone-400">
                      Order #{plan.sortOrder}
                    </span>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-stone-900">
                    {plan.nameTa}
                  </h3>
                  <p className="text-xs font-semibold text-crimson-700">
                    {plan.nameEn}
                  </p>
                  <p className="text-xs text-stone-600">{plan.descriptionTa}</p>
                </div>

                <div className="flex sm:flex-col items-end justify-between gap-3 shrink-0">
                  <div className="text-right">
                    <div className="font-serif text-2xl font-extrabold text-stone-900">
                      ${(plan.amount / 100).toFixed(2)}
                    </div>
                    <div className="text-xs text-stone-500 uppercase">
                      {plan.currency} / {plan.billingInterval}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(plan)}
                      className="p-2 rounded-lg border border-stone-300 hover:border-crimson-700 text-stone-700 hover:text-crimson-800 transition cursor-pointer"
                      title="Edit Plan"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(plan.id)}
                      className="p-2 rounded-lg border border-stone-200 hover:border-red-600 text-stone-400 hover:text-red-600 transition cursor-pointer"
                      title="Delete Plan"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

