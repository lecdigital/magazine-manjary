'use client';

import { Link, usePathname } from '@/i18n/routing';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  CreditCard,
  Users,
  FileText,
  BookMarked,
  LogOut,
} from 'lucide-react';

export function AdminNav({ userEmail }: { userEmail?: string | null }) {
  const pathname = usePathname();

  const items = [
    { href: '/admin', label: 'Overview', labelTa: 'மேற்பார்வை', icon: LayoutDashboard },
    { href: '/admin/plans', label: 'Stripe Plans', labelTa: 'சந்தாத் திட்டங்கள்', icon: CreditCard },
    { href: '/admin/subscribers', label: 'Subscribers', labelTa: 'சந்தாதாரர்கள்', icon: Users },
    { href: '/admin/posts', label: 'Stories & Novels CMS', labelTa: 'படைப்புகள் CMS', icon: FileText },
    { href: '/admin/issues', label: 'Magazine Issues', labelTa: 'இதழ்கள் CMS', icon: BookMarked },
  ];

  return (
    <div className="bg-stone-900 text-parchment-50 border-b border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {items.map((item) => {
            const Icon = item.icon;
            const active =
              item.href === '/admin'
                ? pathname === '/admin'
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                  active
                    ? 'bg-amber-400 text-stone-950 shadow-xs'
                    : 'text-stone-300 hover:bg-stone-800 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.labelTa}</span>
                <span className="hidden lg:inline opacity-75">
                  ({item.label})
                </span>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3 text-xs">
          {userEmail && (
            <span className="text-stone-400 hidden sm:inline font-mono">
              {userEmail}
            </span>
          )}
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: '/' })}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-red-900/70 text-stone-200 text-xs font-medium transition cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
}

