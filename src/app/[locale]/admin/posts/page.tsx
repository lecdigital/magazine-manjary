'use client';

import { useEffect, useState } from 'react';
import {
  FileText,
  Plus,
  Edit3,
  Trash2,
  Eye,
  Loader2,
  CheckCircle2,
} from 'lucide-react';
import { Link } from '@/i18n/routing';

interface PostItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  bookTitle: string;
  chapterNumber: number;
  authorName: string;
  language: string;
  readingTimeMinutes: number;
  isFeatured: boolean;
  isPublished: boolean;
}

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<PostItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('SHORT_STORY');
  const [bookTitle, setBookTitle] = useState('');
  const [chapterNumber, setChapterNumber] = useState(1);
  const [authorName, setAuthorName] = useState('எம். தயாளன் (M. Thayalan)');
  const [language, setLanguage] = useState('ta');
  const [readingTimeMinutes, setReadingTimeMinutes] = useState(6);
  const [isFeatured, setIsFeatured] = useState(true);
  const [isPublished, setIsPublished] = useState(true);

  const fetchPosts = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/posts');
    const data = await res.json();
    setPosts(data.posts || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setSlug('');
    setExcerpt('');
    setContent('');
    setCategory('SHORT_STORY');
    setBookTitle('');
    setChapterNumber(1);
    setAuthorName('எம். தயாளன் (M. Thayalan)');
    setLanguage('ta');
    setReadingTimeMinutes(6);
    setIsFeatured(true);
    setIsPublished(true);
  };

  const startEdit = (post: PostItem) => {
    setEditingId(post.id);
    setTitle(post.title);
    setSlug(post.slug);
    setExcerpt(post.excerpt);
    setContent(post.content);
    setCategory(post.category);
    setBookTitle(post.bookTitle || '');
    setChapterNumber(post.chapterNumber || 1);
    setAuthorName(post.authorName);
    setLanguage(post.language);
    setReadingTimeMinutes(post.readingTimeMinutes);
    setIsFeatured(post.isFeatured);
    setIsPublished(post.isPublished);
    setNotice(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setNotice(null);

    const res = await fetch('/api/admin/posts', {
      method: editingId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: editingId,
        title,
        slug,
        excerpt,
        content,
        category,
        bookTitle,
        chapterNumber,
        authorName,
        language,
        readingTimeMinutes,
        isFeatured,
        isPublished,
      }),
    });

    setSaving(false);
    if (res.ok) {
      setNotice(
        editingId
          ? '✅ படைப்பு வெற்றிகரமாகப் புதுப்பிக்கப்பட்டது (Post updated)'
          : '✅ புதிய படைப்பு வெற்றிகரமாகச் சேர்க்கப்பட்டது (Post published)'
      );
      resetForm();
      fetchPosts();
    }
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/posts?id=${id}`, { method: 'DELETE' });
    fetchPosts();
  };

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-crimson-700">
          Tamil Unicode Literary CMS
        </span>
        <h1 className="font-serif text-3xl font-bold text-stone-900 mt-1">
          சிறுகதைகள், நாவல் அத்தியாயங்கள் & கட்டுரைகள் (/admin/posts)
        </h1>
        <p className="text-sm text-stone-600 mt-1">
          Compose and publish stories, novel chapters, and essays in clean Tamil Unicode with instant live preview.
        </p>
      </div>

      {notice && (
        <div className="rounded-xl bg-emerald-950 text-emerald-100 p-4 text-xs sm:text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notice}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Editor Column */}
        <div className="lg:col-span-6">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl bg-white border border-parchment-300 p-6 shadow-2xs space-y-4"
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h2 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
                {editingId ? (
                  <>
                    <Edit3 className="w-4 h-4 text-crimson-700" />
                    <span>Edit Literary Post</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 text-crimson-700" />
                    <span>New Tamil Unicode Post</span>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Category (வகை)
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm bg-white"
                >
                  <option value="SHORT_STORY">சிறுகதை (Short Story)</option>
                  <option value="NOVEL_CHAPTER">
                    நாவல் அத்தியாயம் (Novel Chapter)
                  </option>
                  <option value="ARTICLE">கட்டுரை (Editorial Article)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Author Name
                </label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm"
                />
              </div>
            </div>

            {category === 'NOVEL_CHAPTER' && (
              <div className="grid grid-cols-3 gap-3 bg-parchment-100 p-3.5 rounded-xl border border-parchment-300">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Novel / Book Title (நாவலின் பெயர்)
                  </label>
                  <input
                    type="text"
                    value={bookTitle}
                    onChange={(e) => setBookTitle(e.target.value)}
                    placeholder="வேர்களின் கீதம்"
                    className="w-full rounded-lg border border-stone-300 px-3 py-1.5 text-sm bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Chapter #
                  </label>
                  <input
                    type="number"
                    value={chapterNumber}
                    onChange={(e) => setChapterNumber(Number(e.target.value))}
                    className="w-full rounded-lg border border-stone-300 px-3 py-1.5 text-sm bg-white"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                தலைப்பு (Title in Tamil Unicode or English) *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="எ.கா: மழை நின்ற பிறகும் தூறும் மரங்கள்"
                className="w-full rounded-xl border border-stone-300 px-3.5 py-2 text-sm font-serif"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  URL Slug (optional)
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="auto-generated-if-empty"
                  className="w-full rounded-xl border border-stone-300 px-3 py-2 text-xs font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Reading Time (mins)
                </label>
                <input
                  type="number"
                  value={readingTimeMinutes}
                  onChange={(e) =>
                    setReadingTimeMinutes(Number(e.target.value))
                  }
                  className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                சுருக்கம் (Excerpt / Synopsis)
              </label>
              <textarea
                rows={2}
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full rounded-xl border border-stone-300 px-3.5 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                முழுப் படைப்பு (Full Tamil Unicode Content) *
              </label>
              <textarea
                rows={8}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="உங்கள் சிறுகதை அல்லது நாவல் அத்தியாயத்தை இங்கே தமிழ் யூனிகோடில் தட்டச்சு செய்யவும்..."
                className="w-full rounded-xl border border-stone-300 px-4 py-3 text-base font-serif leading-relaxed"
              />
            </div>

            <div className="flex items-center gap-6 pt-1">
              <label className="inline-flex items-center gap-2 text-xs font-semibold text-stone-700">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                />
                <span>Published</span>
              </label>
              <label className="inline-flex items-center gap-2 text-xs font-semibold text-stone-700">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                />
                <span>Featured on Home</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 rounded-xl bg-crimson-800 hover:bg-crimson-700 text-white font-semibold text-sm flex items-center justify-center gap-2 transition cursor-pointer"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <FileText className="w-4 h-4" />
              )}
              <span>{editingId ? 'Save Changes' : 'Publish Literary Work'}</span>
            </button>
          </form>
        </div>

        {/* Posts List Column */}
        <div className="lg:col-span-6 space-y-4">
          {loading ? (
            <div className="p-12 text-center text-sm text-stone-400">
              Loading literary works...
            </div>
          ) : (
            posts.map((post) => (
              <div
                key={post.id}
                className="rounded-2xl bg-white border border-parchment-300 p-5 shadow-2xs flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="px-2.5 py-0.5 rounded bg-parchment-200 text-crimson-800 font-bold">
                      {post.category}
                    </span>
                    <span className="text-stone-400 font-mono text-[11px]">
                      /{post.slug}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-stone-900">
                    {post.title}
                  </h3>
                  <p className="text-xs text-stone-600 mt-1 line-clamp-2">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-xs text-stone-500">
                    {post.authorName}
                  </span>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/short-stories/${post.slug}`}
                      className="p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:text-crimson-800"
                      title="Read Public Page"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => startEdit(post)}
                      className="p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:text-crimson-800 cursor-pointer"
                      title="Edit"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(post.id)}
                      className="p-1.5 rounded-lg border border-stone-200 text-stone-400 hover:text-red-600 cursor-pointer"
                      title="Delete"
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

