'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Lock, Mail, Loader2, KeyRound } from 'lucide-react';

export default function AdminLoginPage() {
  const locale = useLocale();
  const router = useRouter();
  const [email, setEmail] = useState('admin@manjary.com');
  const [password, setPassword] = useState('ManjaryAdmin2026!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError(
        locale === 'ta'
          ? 'மின்னஞ்சல் அல்லது கடவுச்சொல் தவறானது'
          : 'Invalid admin credentials'
      );
      setLoading(false);
      return;
    }

    router.push(`/${locale}/admin`);
    router.refresh();
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="rounded-3xl bg-white border border-parchment-300 p-8 shadow-lg">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-crimson-800 text-white flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-crimson-700">
              NextAuth Protected Portal
            </span>
            <h1 className="font-serif text-2xl font-bold text-stone-900">
              மஞ்சரி நிர்வாக நுழைவு
            </h1>
          </div>
        </div>

        <div className="mb-6 rounded-xl bg-amber-50 border border-amber-200 p-3.5 text-xs text-amber-900 space-y-1">
          <div className="font-bold flex items-center gap-1.5">
            <KeyRound className="w-3.5 h-3.5 text-amber-700" />
            <span>Seeded Local Admin Credentials (Pre-filled):</span>
          </div>
          <p className="font-mono">Email: admin@manjary.com</p>
          <p className="font-mono">Pass: ManjaryAdmin2026!</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:border-crimson-700 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:border-crimson-700 focus:outline-none"
              />
            </div>
          </div>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-crimson-800 hover:bg-crimson-700 text-white font-semibold text-sm flex items-center justify-center gap-2 transition cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Signing In...</span>
              </>
            ) : (
              <span>Sign In to Admin Dashboard</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

