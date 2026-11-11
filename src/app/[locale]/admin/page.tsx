import { Link } from '@/i18n/routing';
import { prisma } from '@/lib/prisma';
import { isLiveStripeConfigured } from '@/lib/stripe';
import {
  CreditCard,
  Users,
  FileText,
  BookMarked,
  Database,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminOverviewPage() {
  const [planCount, subscriberCount, postCount, issueCount] = await Promise.all(
    [
      prisma.subscriptionPlan.count(),
      prisma.subscription.count({ where: { status: 'active' } }),
      prisma.post.count(),
      prisma.magazineIssue.count(),
    ]
  );

  const cards = [
    {
      title: 'Stripe Subscription Tiers',
      titleTa: 'சந்தாத் திட்டங்கள்',
      count: planCount,
      href: '/admin/plans',
      icon: CreditCard,
      desc: 'Add or edit bilingual plans. Updating prices automatically rotates Stripe Price IDs.',
    },
    {
      title: 'Active Subscribers',
      titleTa: 'செயலில் உள்ள சந்தாதாரர்கள்',
      count: subscriberCount,
      href: '/admin/subscribers',
      icon: Users,
      desc: 'View reader roster, subscription periods, and billing statuses.',
    },
    {
      title: 'Stories & Novels (Unicode CMS)',
      titleTa: 'சிறுகதைகள் & நாவல்கள்',
      count: postCount,
      href: '/admin/posts',
      icon: FileText,
      desc: 'Publish short stories, serialized novel chapters, and editorial essays.',
    },
    {
      title: 'Manjary Magazine Issues',
      titleTa: 'மஞ்சரி இதழ்கள்',
      count: issueCount,
      href: '/admin/issues',
      icon: BookMarked,
      desc: 'Manage monthly editions, cover artwork, highlights, and archival PDFs.',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-parchment-300 pb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-crimson-700">
            Manjary Editorial & Commerce Control Center
          </span>
          <h1 className="font-serif text-3xl font-bold text-stone-900 mt-1">
            நிர்வாகப் பலகை (Admin Dashboard)
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 font-semibold">
            <Database className="w-3.5 h-3.5 text-emerald-700" />
            <span>DB: Local SQLite (MySQL Ready)</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-700" />
            <span>
              Stripe:{' '}
              {isLiveStripeConfigured ? 'Live API Mode' : 'Local Simulated Sync'}
            </span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.href}
              href={card.href}
              className="group rounded-2xl bg-white border border-parchment-300 p-6 shadow-2xs hover:shadow-md hover:border-crimson-700 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-crimson-800/10 text-crimson-800 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-serif text-3xl font-extrabold text-stone-900">
                    {card.count}
                  </span>
                </div>
                <h2 className="font-serif text-xl font-bold text-stone-900 mt-4">
                  {card.titleTa}
                </h2>
                <p className="text-xs font-semibold text-crimson-700">
                  {card.title}
                </p>
                <p className="mt-2 text-sm text-stone-600 leading-relaxed">
                  {card.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between text-xs font-bold text-crimson-800">
                <span>Manage Module</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

