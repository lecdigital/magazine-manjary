import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { prisma } from '@/lib/prisma';
import { BookOpen, Clock, ArrowRight, Feather } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ShortStoriesPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { locale } = await params;
  const query = await searchParams;
  const t = await getTranslations({ locale });

  const selectedCategory = query.category || 'ALL';

  const whereClause =
    selectedCategory === 'SHORT_STORY'
      ? { isPublished: true, category: 'SHORT_STORY' }
      : selectedCategory === 'ARTICLE'
      ? { isPublished: true, category: 'ARTICLE' }
      : {
          isPublished: true,
          category: { in: ['SHORT_STORY', 'ARTICLE'] },
        };

  const posts = await prisma.post.findMany({
    where: whereClause,
    orderBy: { publishedAt: 'desc' },
  });

  const filters = [
    { key: 'ALL', label: t('Stories.allCategories') },
    { key: 'SHORT_STORY', label: t('Stories.shortStories') },
    { key: 'ARTICLE', label: t('Stories.articles') },
  ];

  return (
    <div className="space-y-12 pb-16">
      <section className="bg-parchment-100 border-b border-parchment-300 py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-crimson-700">
              <Feather className="w-3.5 h-3.5" />
              {t('Stories.badge')}
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-stone-900">
              {t('Stories.title')}
            </h1>
            <p className="text-stone-600 text-base leading-relaxed">
              {t('Stories.subtitle')}
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="mt-8 flex flex-wrap gap-2">
            {filters.map((f) => {
              const active = selectedCategory === f.key;
              return (
                <Link
                  key={f.key}
                  href={
                    f.key === 'ALL'
                      ? '/short-stories'
                      : `/short-stories?category=${f.key}`
                  }
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition ${
                    active
                      ? 'bg-crimson-800 text-white shadow-xs'
                      : 'bg-white text-stone-700 border border-parchment-300 hover:border-crimson-700'
                  }`}
                >
                  {f.label}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className="rounded-2xl bg-white border border-parchment-300 p-7 sm:p-8 shadow-2xs hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-stone-500 mb-4">
                  <span className="px-3 py-1 rounded-md bg-parchment-200 text-crimson-800 font-semibold">
                    {post.category === 'ARTICLE'
                      ? locale === 'ta'
                        ? 'கட்டுரை'
                        : 'Editorial Essay'
                      : locale === 'ta'
                      ? 'சிறுகதை'
                      : 'Short Story'}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    {post.readingTimeMinutes} {t('Home.minutesRead')}
                  </span>
                </div>

                <h2 className="font-serif text-2xl font-bold text-stone-900 leading-snug">
                  <Link
                    href={`/short-stories/${post.slug}`}
                    className="hover:text-crimson-800 transition"
                  >
                    {post.title}
                  </Link>
                </h2>

                <p className="mt-3 text-stone-600 text-sm sm:text-base leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-medium text-stone-700">
                  <BookOpen className="w-4 h-4 text-crimson-700" />
                  <span>{post.authorName}</span>
                </div>
                <Link
                  href={`/short-stories/${post.slug}`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-crimson-800 hover:bg-crimson-700 text-white text-xs font-semibold transition"
                >
                  <span>{t('Stories.readFullStory')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

