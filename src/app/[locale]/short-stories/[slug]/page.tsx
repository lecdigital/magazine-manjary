import { notFound } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { prisma } from '@/lib/prisma';
import { ArrowLeft, Clock, Feather, BookOpen } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function StoryReaderPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;

  const decodedSlug = decodeURIComponent(slug);

  const post = await prisma.post.findUnique({
    where: { slug: decodedSlug },
  });

  if (!post || !post.isPublished) {
    notFound();
  }

  const isHtmlContent = /<(p|h[1-6]|div|figure|img|blockquote|ul|ol|br|strong|em)\b/i.test(
    post.content
  );

  const paragraphs = !isHtmlContent
    ? post.content
        .split(/\n\s*\n/)
        .map((p) => p.trim())
        .filter(Boolean)
    : [];

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <Link
          href={
            post.category === 'NOVEL_CHAPTER' ? '/novels' : '/short-stories'
          }
          className="inline-flex items-center gap-2 text-xs font-semibold text-crimson-800 hover:text-crimson-700"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>
            {locale === 'ta'
              ? 'பட்டியலுக்குத் திரும்புக'
              : 'Back to Literary Library'}
          </span>
        </Link>
      </div>

      <header className="border-b border-parchment-300 pb-8 mb-10">
        <div className="flex flex-wrap items-center gap-3 text-xs text-stone-600 mb-4">
          <span className="px-3 py-1 rounded-md bg-crimson-800 text-white font-semibold">
            {post.category === 'NOVEL_CHAPTER'
              ? post.bookTitle || 'நாவல் அத்தியாயம்'
              : post.category === 'ARTICLE'
              ? 'ஆசிரியர் கட்டுரை / Essay'
              : 'சிறுகதை / Short Story'}
          </span>
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-crimson-700" />
            {post.readingTimeMinutes} min read
          </span>
        </div>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 leading-[1.35]">
          {post.title}
        </h1>

        <div className="mt-5 flex items-center gap-3 text-sm text-stone-700 font-medium">
          <Feather className="w-4 h-4 text-crimson-700" />
          <span>{post.authorName}</span>
        </div>
      </header>

      {/* Clean Tamil Unicode & Rich Media Reader Body */}
      {isHtmlContent ? (
        <div
          className="bg-white rounded-3xl border border-parchment-300 p-7 sm:p-12 shadow-2xs tamil-prose font-serif text-lg sm:text-xl text-stone-900"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
      ) : (
        <div className="bg-white rounded-3xl border border-parchment-300 p-7 sm:p-12 shadow-2xs tamil-prose font-serif text-lg sm:text-xl text-stone-900">
          {paragraphs.map((para, idx) => (
            <p key={idx} className="leading-[2.1] mb-6 last:mb-0">
              {para}
            </p>
          ))}
        </div>
      )}

      <div className="mt-12 rounded-2xl bg-parchment-100 border border-parchment-300 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <BookOpen className="w-6 h-6 text-crimson-800" />
          <div>
            <h3 className="font-serif text-base font-bold text-stone-900">
              மஞ்சரி (Manjary) மாதாந்திர இலக்கிய இதழ்
            </h3>
            <p className="text-xs text-stone-600">
              புதிய எழுத்தாளர்களின் படைப்புகளையும் எம். தயாளனின் தொடர் நாவல்களையும் தொடர்ந்து வாசிக்க சந்தா செலுத்துங்கள்.
            </p>
          </div>
        </div>
        <Link
          href="/manjary#pricing"
          className="px-4 py-2.5 rounded-xl bg-crimson-800 hover:bg-crimson-700 text-white text-xs font-semibold shrink-0 transition"
        >
          {locale === 'ta' ? 'சந்தாத் திட்டங்கள்' : 'View Subscription Plans'}
        </Link>
      </div>
    </article>
  );
}

