import { getTranslations } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { PricingGridClient } from '@/components/PricingGridClient';
import {
  Sparkles,
  BookOpen,
  CheckCircle2,
  Send,
  FileText,
  Award,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ManjaryMagazinePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ checkout?: string; plan?: string }>;
}) {
  const { locale } = await params;
  const query = await searchParams;
  const t = await getTranslations({ locale });

  const [issues, activePlans] = await Promise.all([
    prisma.magazineIssue.findMany({
      where: { isPublished: true },
      orderBy: { issueNumber: 'desc' },
    }),
    prisma.subscriptionPlan.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    }),
  ]);

  return (
    <div className="space-y-16 pb-16">
      {/* Header Banner */}
      <section className="bg-stone-900 text-parchment-50 py-16 border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-4">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/15 text-amber-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              {t('Manjary.badge')}
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white leading-tight">
              {t('Manjary.title')}
            </h1>
            <p className="text-base sm:text-lg text-stone-300">
              {t('Manjary.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Checkout Notification Alert */}
      {query.checkout === 'success' && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-emerald-950 text-emerald-100 border border-emerald-700 p-6 flex items-start gap-4 shadow-lg">
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-serif text-lg font-bold text-white">
                {locale === 'ta'
                  ? 'மஞ்சரி சந்தா வெற்றிகரமாகப் பதிவு செய்யப்பட்டது!'
                  : 'Subscription Confirmed! Welcome to Manjary.'}
              </h3>
              <p className="text-sm text-emerald-200 mt-1">
                {locale === 'ta'
                  ? `நீங்கள் தேர்ந்தெடுத்த திட்டம்: ${query.plan || 'மஞ்சரி சந்தா'}. உங்கள் சந்தா விவரங்கள் நிர்வாகப் பட்டியலில் (Admin Subscribers Roster) சேர்க்கப்பட்டுள்ளன.`
                  : `Active Plan: ${query.plan || 'Manjary Membership'}. Your subscription has been recorded and activated.`}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Editorial Mission & Aspiring Writer Guidelines */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Editorial Mission */}
          <div className="lg:col-span-7 rounded-2xl bg-white border border-parchment-300 p-7 sm:p-9 shadow-2xs flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-crimson-700 mb-3">
                <Award className="w-4 h-4" />
                <span>Editorial Vision • எம். தயாளன்</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                {t('Manjary.missionTitle')}
              </h2>
              <p className="mt-4 text-stone-700 leading-relaxed text-base">
                {t('Manjary.missionText')}
              </p>
              <blockquote className="mt-6 pl-4 border-l-4 border-crimson-700 italic text-stone-800 font-serif text-base">
                &ldquo;ஒவ்வொரு புதிய எழுத்தாளரின் முதல் சிறுகதையும் தமிழ் இலக்கியத்தின் எதிர்காலத்திற்கான விதை.&rdquo; — எம். தயாளன் (M. Thayalan)
              </blockquote>
            </div>
          </div>

          {/* Submission Guidelines */}
          <div className="lg:col-span-5 rounded-2xl bg-parchment-100 border border-parchment-300 p-7 sm:p-9">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-crimson-800 mb-3">
              <Send className="w-4 h-4" />
              <span>For Aspiring Writers</span>
            </div>
            <h3 className="font-serif text-xl font-bold text-stone-900">
              {t('Manjary.guidelinesTitle')}
            </h3>
            <ul className="mt-4 space-y-3.5 text-sm text-stone-700">
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-crimson-800 text-white text-xs flex items-center justify-center shrink-0 mt-0.5">
                  1
                </span>
                <span>{t('Manjary.guideline1')}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-crimson-800 text-white text-xs flex items-center justify-center shrink-0 mt-0.5">
                  2
                </span>
                <span>{t('Manjary.guideline2')}</span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-crimson-800 text-white text-xs flex items-center justify-center shrink-0 mt-0.5">
                  3
                </span>
                <span>{t('Manjary.guideline3')}</span>
              </li>
            </ul>
            <div className="mt-6 pt-4 border-t border-parchment-300 text-xs text-stone-600">
              படைப்புகளை அனுப்ப வேண்டிய மின்னஞ்சல்:{' '}
              <span className="font-semibold text-crimson-800">
                editorial@manjary.com
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Issue Archive */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="text-xs font-semibold uppercase tracking-wider text-crimson-700">
            மாதாந்திர இதழ் களஞ்சியம்
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
            {t('Manjary.archiveTitle')}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {issues.map((issue) => (
            <div
              key={issue.id}
              className="rounded-2xl bg-white border border-parchment-300 overflow-hidden shadow-2xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="h-52 bg-stone-900 relative overflow-hidden flex items-end p-5">
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-40"
                    style={{ backgroundImage: `url(${issue.coverImageUrl})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/60 to-transparent" />
                  <div className="relative z-10">
                    <span className="px-2.5 py-1 rounded-md bg-amber-400 text-stone-950 text-xs font-bold">
                      {t('Manjary.issueLabel')} #{issue.issueNumber} •{' '}
                      {issue.month} {issue.year}
                    </span>
                    <h3 className="font-serif text-xl font-bold text-white mt-2">
                      {issue.title}
                    </h3>
                  </div>
                </div>

                <div className="p-6">
                  {issue.subtitle && (
                    <p className="text-xs font-semibold text-crimson-800 mb-2">
                      {issue.subtitle}
                    </p>
                  )}
                  <p className="text-sm text-stone-600 leading-relaxed">
                    {issue.description}
                  </p>

                  {issue.highlights && (
                    <ul className="mt-4 pt-4 border-t border-stone-100 space-y-1.5 text-xs text-stone-700">
                      {issue.highlights.split('|').map((h, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <BookOpen className="w-3.5 h-3.5 text-crimson-700 shrink-0" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>

              <div className="px-6 pb-6 pt-2 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-500">
                  <FileText className="w-3.5 h-3.5" />
                  Digital Edition
                </span>
                <a
                  href="#pricing"
                  className="text-xs font-bold text-crimson-800 hover:text-crimson-700"
                >
                  {t('Manjary.readIssue')} →
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Subscription Pricing Grid */}
      <section
        id="pricing"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-24"
      >
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-crimson-800/10 text-crimson-800 text-xs font-bold uppercase tracking-wider">
            {locale === 'ta' ? 'வாசகர் சந்தா' : 'Reader Membership'}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 mt-3">
            {t('Manjary.pricingTitle')}
          </h2>
          <p className="text-stone-600 mt-2 text-sm sm:text-base">
            {t('Manjary.pricingSubtitle')}
          </p>
        </div>

        <PricingGridClient
          plans={activePlans}
          locale={locale}
          subscribeLabel={t('Manjary.subscribeBtn')}
        />
      </section>
    </div>
  );
}

