import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { prisma } from '@/lib/prisma';
import {
  BookOpen,
  Feather,
  Sparkles,
  ArrowRight,
  Clock,
  Award,
  Newspaper,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  const [latestIssue, featuredStories, novelChapters] = await Promise.all([
    prisma.magazineIssue.findFirst({
      where: { isPublished: true },
      orderBy: { issueNumber: 'desc' },
    }),
    prisma.post.findMany({
      where: {
        isPublished: true,
        category: { in: ['SHORT_STORY', 'ARTICLE'] },
      },
      orderBy: { publishedAt: 'desc' },
      take: 3,
    }),
    prisma.post.findMany({
      where: {
        isPublished: true,
        category: 'NOVEL_CHAPTER',
      },
      orderBy: { publishedAt: 'desc' },
      take: 2,
    }),
  ]);

  return (
    <div className="space-y-20 pb-12">
      {/* Hero Banner */}
      <section className="relative overflow-hidden border-b border-parchment-300 bg-gradient-to-b from-parchment-100 via-parchment-50 to-parchment-50 pt-12 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-crimson-800/10 border border-crimson-800/20 text-crimson-800 text-xs font-semibold">
                <Feather className="w-3.5 h-3.5" />
                <span>{t('Home.badge')}</span>
              </div>

              <h1 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900 leading-[1.25]">
                {t('Home.heroTitle')}
              </h1>

              <p className="text-base sm:text-lg text-stone-700 leading-relaxed max-w-2xl">
                {t('Home.heroDescription')}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/manjary"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-crimson-800 hover:bg-crimson-700 text-white font-semibold text-sm shadow-sm transition"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{t('Home.exploreMagazine')}</span>
                </Link>
                <Link
                  href="/short-stories"
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl border border-stone-300 bg-white hover:border-crimson-700 hover:text-crimson-800 text-stone-800 font-semibold text-sm transition"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>{t('Home.readStories')}</span>
                </Link>
              </div>
            </div>

            {/* Latest Issue Spotlight Card */}
            <div className="lg:col-span-5">
              {latestIssue && (
                <div className="rounded-2xl bg-stone-900 text-parchment-50 p-6 sm:p-8 shadow-xl border border-stone-800 relative">
                  <div className="flex items-center justify-between text-xs text-amber-400 font-semibold uppercase tracking-wider mb-3">
                    <span className="inline-flex items-center gap-1.5">
                      <Newspaper className="w-4 h-4" />
                      {t('Home.latestIssue')}
                    </span>
                    <span>
                      #{latestIssue.issueNumber} • {latestIssue.month}{' '}
                      {latestIssue.year}
                    </span>
                  </div>

                  <h2 className="font-serif text-2xl font-bold text-white leading-snug">
                    {latestIssue.title}
                  </h2>
                  <p className="text-xs text-amber-200/90 mt-1">
                    {latestIssue.subtitle}
                  </p>

                  <p className="mt-4 text-sm text-stone-300 leading-relaxed">
                    {latestIssue.description}
                  </p>

                  {latestIssue.highlights && (
                    <ul className="mt-5 space-y-2 border-t border-stone-800 pt-4 text-xs text-stone-200">
                      {latestIssue.highlights
                        .split('|')
                        .slice(0, 3)
                        .map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                    </ul>
                  )}

                  <div className="mt-6 pt-4 border-t border-stone-800 flex items-center justify-between">
                    <Link
                      href="/manjary"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-amber-400 hover:text-amber-300"
                    >
                      <span>{t('Manjary.readIssue')}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      href="/manjary#pricing"
                      className="text-xs px-3 py-1.5 rounded-lg bg-crimson-700 hover:bg-crimson-600 text-white font-medium"
                    >
                      {t('Nav.subscribe')}
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Author Bio Section: M. Thayalan */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-parchment-100 border border-parchment-300 p-8 sm:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left">
            <div className="w-24 h-24 rounded-2xl bg-crimson-800 text-parchment-50 flex items-center justify-center font-serif text-4xl font-bold shadow-md mb-4">
              த
            </div>
            <h2 className="font-serif text-2xl font-bold text-stone-900">
              எம். தயாளன்
            </h2>
            <p className="text-sm font-semibold text-crimson-700">
              M. Thayalan — Author & Founding Editor
            </p>
            <div className="mt-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-900 text-xs font-medium">
              <Award className="w-3.5 h-3.5 text-amber-700" />
              <span>ஆசிரியர், மஞ்சரி இலக்கிய இதழ்</span>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-4">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900">
              {t('Home.authorBioTitle')}
            </h3>
            <p className="text-stone-700 leading-relaxed text-sm sm:text-base">
              {t('Home.authorBioP1')}
            </p>
            <p className="text-stone-700 leading-relaxed text-sm sm:text-base">
              {t('Home.authorBioP2')}
            </p>
          </div>
        </div>
      </section>

      {/* Featured Short Stories & Articles */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-crimson-700">
              தமிழ் யூனிகோட் வாசிப்பகம்
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              {t('Home.featuredStories')}
            </h2>
          </div>
          <Link
            href="/short-stories"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-crimson-800 hover:text-crimson-700"
          >
            <span>{t('Home.viewAll')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {featuredStories.map((story) => (
            <article
              key={story.id}
              className="rounded-2xl bg-white border border-parchment-300 p-6 flex flex-col justify-between shadow-2xs hover:shadow-md transition"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-stone-500 mb-3">
                  <span className="px-2.5 py-0.5 rounded-md bg-parchment-200 text-crimson-800 font-semibold">
                    {story.category === 'ARTICLE'
                      ? locale === 'ta'
                        ? 'கட்டுரை'
                        : 'Editorial'
                      : locale === 'ta'
                      ? 'சிறுகதை'
                      : 'Short Story'}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {story.readingTimeMinutes} {t('Home.minutesRead')}
                  </span>
                </div>

                <h3 className="font-serif text-xl font-bold text-stone-900 leading-snug">
                  <Link
                    href={`/short-stories/${story.slug}`}
                    className="hover:text-crimson-800 transition"
                  >
                    {story.title}
                  </Link>
                </h3>

                <p className="mt-3 text-sm text-stone-600 leading-relaxed line-clamp-4">
                  {story.excerpt}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
                <span className="text-xs font-medium text-stone-600">
                  {story.authorName}
                </span>
                <Link
                  href={`/short-stories/${story.slug}`}
                  className="inline-flex items-center gap-1 text-xs font-bold text-crimson-800 hover:text-crimson-700"
                >
                  <span>{t('Home.readNow')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Featured Novels Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-crimson-700">
              நெடுங்கதைகள் & தொடர் புதினங்கள்
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mt-1">
              {t('Home.featuredNovels')}
            </h2>
          </div>
          <Link
            href="/novels"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-crimson-800 hover:text-crimson-700"
          >
            <span>{t('Home.viewAll')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {novelChapters.map((novel) => (
            <div
              key={novel.id}
              className="rounded-2xl bg-gradient-to-br from-stone-900 to-stone-800 text-parchment-50 p-7 sm:p-8 border border-stone-700 flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                  {novel.bookTitle || 'நாவல் தொடர்'} • {t('Novels.chapter')}{' '}
                  {novel.chapterNumber}
                </span>
                <h3 className="font-serif text-2xl font-bold text-white mt-2">
                  {novel.title}
                </h3>
                <p className="mt-3 text-sm text-stone-300 leading-relaxed">
                  {novel.excerpt}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-700/80 flex items-center justify-between">
                <span className="text-xs text-stone-400">{novel.authorName}</span>
                <Link
                  href={`/short-stories/${novel.slug}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold transition"
                >
                  <span>{t('Novels.readChapter')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

