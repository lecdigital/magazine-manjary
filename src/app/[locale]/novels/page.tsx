import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { prisma } from '@/lib/prisma';
import { BookOpen, ArrowRight, Clock, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function NovelsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale });

  const chapters = await prisma.post.findMany({
    where: {
      isPublished: true,
      category: 'NOVEL_CHAPTER',
    },
    orderBy: [{ bookTitle: 'asc' }, { chapterNumber: 'asc' }],
  });

  return (
    <div className="space-y-14 pb-16">
      <section className="bg-stone-900 text-parchment-50 py-14 border-b border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              {t('Novels.badge')}
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white">
              {t('Novels.title')}
            </h1>
            <p className="text-stone-300 text-base leading-relaxed">
              {t('Novels.subtitle')}
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {chapters.map((chapter) => (
          <div
            key={chapter.id}
            className="rounded-3xl bg-white border border-parchment-300 p-7 sm:p-10 shadow-2xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
          >
            <div className="lg:col-span-4 rounded-2xl bg-gradient-to-br from-crimson-900 via-crimson-800 to-stone-900 text-parchment-50 p-7 flex flex-col justify-between min-h-[240px] shadow-md">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-amber-300">
                  M. Thayalan Novel Series
                </span>
                <h2 className="font-serif text-2xl font-bold text-white mt-2 leading-snug">
                  {chapter.bookTitle || chapter.title}
                </h2>
              </div>
              <div className="pt-6 border-t border-white/15 flex items-center justify-between text-xs text-parchment-200">
                <span>{chapter.authorName}</span>
                <span>
                  {t('Novels.chapter')} {chapter.chapterNumber}
                </span>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-4">
              <div className="flex items-center gap-3 text-xs text-stone-500">
                <span className="px-3 py-1 rounded-md bg-parchment-200 text-crimson-800 font-semibold">
                  {t('Novels.chapter')} {chapter.chapterNumber}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {chapter.readingTimeMinutes} {t('Home.minutesRead')}
                </span>
              </div>

              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
                {chapter.title}
              </h3>

              <p className="text-stone-700 leading-relaxed text-base">
                {chapter.excerpt}
              </p>

              {/* Excerpt Preview Box */}
              <div className="rounded-xl bg-parchment-100 border border-parchment-300 p-4 font-serif text-sm text-stone-800 leading-relaxed line-clamp-3">
                {chapter.content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()}
              </div>

              <div className="pt-2">
                <Link
                  href={`/short-stories/${chapter.slug}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-crimson-800 hover:bg-crimson-700 text-white text-xs sm:text-sm font-semibold transition"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>{t('Novels.readChapter')}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

