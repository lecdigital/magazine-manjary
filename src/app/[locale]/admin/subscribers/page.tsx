'use client';

import { useEffect, useState } from 'react';
import { Users, UserPlus, CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface SubscriberRecord {
  id: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  status: string;
  currentPeriodEnd: string;
  createdAt: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  plan: {
    id: string;
    nameTa: string;
    nameEn: string;
    amount: number;
    currency: string;
    billingInterval: string;
  };
}

interface PlanOption {
  id: string;
  nameTa: string;
  nameEn: string;
}

export default function AdminSubscribersPage() {
  const [subscriptions, setSubscriptions] = useState<SubscriberRecord[]>([]);
  const [plans, setPlans] = useState<PlanOption[]>([]);
  const [loading, setLoading] = useState(true);

  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [selectedPlanId, setSelectedPlanId] = useState('');
  const [creating, setCreating] = useState(false);

  const loadData = async () => {
    setLoading(true);
    const [subRes, planRes] = await Promise.all([
      fetch('/api/admin/subscribers'),
      fetch('/api/admin/plans'),
    ]);
    const subData = await subRes.json();
    const planData = await planRes.json();

    setSubscriptions(subData.subscriptions || []);
    setPlans(planData.plans || []);
    if (planData.plans?.length && !selectedPlanId) {
      setSelectedPlanId(planData.plans[0].id);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateSubscriber = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newEmail || !selectedPlanId) return;
    setCreating(true);

    const res = await fetch('/api/admin/subscribers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: newName,
        email: newEmail,
        planId: selectedPlanId,
        status: 'active',
      }),
    });

    setCreating(false);
    if (res.ok) {
      setNewName('');
      setNewEmail('');
      loadData();
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'canceled' : 'active';
    await fetch('/api/admin/subscribers', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status: nextStatus }),
    });
    loadData();
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-crimson-700">
            Reader Membership Directory
          </span>
          <h1 className="font-serif text-3xl font-bold text-stone-900 mt-1">
            சந்தாதாரர்கள் பட்டியல் (/admin/subscribers)
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Monitor active readers, subscription tiers, membership status, and renewal dates.
          </p>
        </div>
      </div>

      {/* Quick Add Reader Card */}
      <form
        onSubmit={handleCreateSubscriber}
        className="rounded-2xl bg-white border border-parchment-300 p-6 shadow-2xs grid grid-cols-1 md:grid-cols-4 gap-4 items-end"
      >
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Reader Name (பெயர்)
          </label>
          <input
            type="text"
            required
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="செந்தில் குமார்"
            className="w-full rounded-xl border border-stone-300 px-3.5 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            required
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            placeholder="senthil@example.com"
            className="w-full rounded-xl border border-stone-300 px-3.5 py-2 text-sm"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Subscription Plan
          </label>
          <select
            value={selectedPlanId}
            onChange={(e) => setSelectedPlanId(e.target.value)}
            className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm bg-white"
          >
            {plans.map((p) => (
              <option key={p.id} value={p.id}>
                {p.nameTa} ({p.nameEn})
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          disabled={creating}
          className="py-2.5 px-4 rounded-xl bg-crimson-800 hover:bg-crimson-700 text-white text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-2 transition cursor-pointer"
        >
          {creating ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <UserPlus className="w-4 h-4" />
          )}
          <span>Add Subscriber</span>
        </button>
      </form>

      {/* Roster Table */}
      <div className="rounded-2xl bg-white border border-parchment-300 overflow-hidden shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-parchment-300 bg-parchment-100 text-xs font-bold uppercase tracking-wider text-stone-600">
                <th className="py-3.5 px-5">Reader (வாசகர்)</th>
                <th className="py-3.5 px-5">Plan (திட்டம்)</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5">Period End</th>
                <th className="py-3.5 px-5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-sm">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-stone-400">
                    Loading subscribers...
                  </td>
                </tr>
              ) : subscriptions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-stone-400">
                    No subscribers found.
                  </td>
                </tr>
              ) : (
                subscriptions.map((sub) => (
                  <tr key={sub.id} className="hover:bg-parchment-50/60">
                    <td className="py-4 px-5">
                      <div className="font-serif font-bold text-stone-900">
                        {sub.user.name}
                      </div>
                      <div className="text-xs text-stone-500">
                        {sub.user.email}
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <div className="font-medium text-stone-900">
                        {sub.plan.nameTa}
                      </div>
                      <div className="text-xs text-crimson-700">
                        ${(sub.plan.amount / 100).toFixed(2)} /{' '}
                        {sub.plan.billingInterval}
                      </div>
                    </td>
                    <td className="py-4 px-5">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase ${
                          sub.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-stone-200 text-stone-700'
                        }`}
                      >
                        {sub.status === 'active' ? (
                          <CheckCircle className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        {sub.status}
                      </span>
                    </td>
                    <td className="py-4 px-5 text-xs text-stone-600">
                      {new Date(sub.currentPeriodEnd).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-5 text-right">
                      <button
                        type="button"
                        onClick={() => toggleStatus(sub.id, sub.status)}
                        className="text-xs font-semibold text-crimson-800 hover:underline cursor-pointer"
                      >
                        {sub.status === 'active' ? 'Cancel' : 'Reactivate'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

