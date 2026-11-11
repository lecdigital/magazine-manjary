'use client';

import { useEffect, useState } from 'react';
import {
  BookMarked,
  Plus,
  Edit3,
  Trash2,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

interface MagazineIssueItem {
  id: string;
  issueNumber: number;
  month: string;
  year: number;
  title: string;
  subtitle: string;
  description: string;
  highlights: string;
  coverImageUrl: string;
  pdfUrl: string;
  isPublished: boolean;
}

export default function AdminIssuesPage() {
  const [issues, setIssues] = useState<MagazineIssueItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [issueNumber, setIssueNumber] = useState(15);
  const [month, setMonth] = useState('டிசம்பர் (December)');
  const [year, setYear] = useState(2026);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [highlights, setHighlights] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState(
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=900&q=80'
  );
  const [pdfUrl, setPdfUrl] = useState('/sample-issues/manjary-issue-15.pdf');
  const [isPublished, setIsPublished] = useState(true);

  const fetchIssues = async () => {
    setLoading(true);
    const res = await fetch('/api/admin/issues');
    const data = await res.json();
    const list: MagazineIssueItem[] = data.issues || [];
    setIssues(list);
    if (list.length > 0 && !editingId) {
      setIssueNumber(list[0].issueNumber + 1);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setIssueNumber((issues[0]?.issueNumber || 14) + 1);
    setMonth('டிசம்பர் (December)');
    setYear(2026);
    setTitle('');
    setSubtitle('');
    setDescription('');
    setHighlights('');
    setCoverImageUrl(
      'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=900&q=80'
    );
    setPdfUrl('/sample-issues/manjary-issue-15.pdf');
    setIsPublished(true);
  };

  const startEdit = (issue: MagazineIssueItem) => {
    setEditingId(issue.id);
    setIssueNumber(issue.issueNumber);
    setMonth(issue.month);
    setYear(issue.year);
    setTitle(issue.title);
    setSubtitle(issue.subtitle);
    setDescription(issue.description);
    setHighlights(issue.highlights);
    setCoverImageUrl(issue.coverImageUrl);
    setPdfUrl(issue.pdfUrl);
    setIsPublished(issue.isPublished);
    setNotice(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setNotice(null);

    const res = await fetch('/api/admin/issues', {
      method: editingId ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id: editingId,
        issueNumber,
        month,
        year,
        title,
        subtitle,
        description,
        highlights,
        coverImageUrl,
        pdfUrl,
        isPublished,
      }),
    });

    setSaving(false);
    if (res.ok) {
      setNotice(
        editingId
          ? '✅ மஞ்சரி இதழ் விவரம் புதுப்பிக்கப்பட்டது'
          : '✅ புதிய மஞ்சரி இதழ் வெளியிடப்பட்டது'
      );
      resetForm();
      fetchIssues();
    }
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/admin/issues?id=${id}`, { method: 'DELETE' });
    fetchIssues();
  };

  return (
    <div className="space-y-8">
      <div>
        <span className="text-xs font-bold uppercase tracking-wider text-crimson-700">
          Manjary Monthly Issue Archive CMS
        </span>
        <h1 className="font-serif text-3xl font-bold text-stone-900 mt-1">
          மஞ்சரி இதழ்கள் மேலாண்மை (/admin/issues)
        </h1>
        <p className="text-sm text-stone-600 mt-1">
          Publish monthly editions of Manjary with Tamil Unicode titles, issue highlights, cover images, and PDF links.
        </p>
      </div>

      {notice && (
        <div className="rounded-xl bg-emerald-950 text-emerald-100 p-4 text-xs sm:text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{notice}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl bg-white border border-parchment-300 p-6 shadow-2xs space-y-4"
          >
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h2 className="font-serif text-lg font-bold text-stone-900 flex items-center gap-2">
                {editingId ? (
                  <>
                    <Edit3 className="w-4 h-4 text-crimson-700" />
                    <span>Edit Issue #{issueNumber}</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 text-crimson-700" />
                    <span>Publish New Magazine Issue</span>
                  </>
                )}
              </h2>
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="text-xs text-crimson-700 hover:underline font-semibold"
                >
                  Cancel
                </button>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Issue # *
                </label>
                <input
                  type="number"
                  required
                  value={issueNumber}
                  onChange={(e) => setIssueNumber(Number(e.target.value))}
                  className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Month (மாதம்) *
                </label>
                <input
                  type="text"
                  required
                  value={month}
                  onChange={(e) => setMonth(e.target.value)}
                  className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Year *
                </label>
                <input
                  type="number"
                  required
                  value={year}
                  onChange={(e) => setYear(Number(e.target.value))}
                  className="w-full rounded-xl border border-stone-300 px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                இதழின் தலைப்பு (Issue Title) *
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="எ.கா: மார்கழி இலக்கியச் சிறப்பிதழ்"
                className="w-full rounded-xl border border-stone-300 px-3.5 py-2 text-sm font-serif"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                துணைத் தலைப்பு (Subtitle)
              </label>
              <input
                type="text"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className="w-full rounded-xl border border-stone-300 px-3.5 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                இதழ் பற்றிய குறிப்பு (Description)
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full rounded-xl border border-stone-300 px-3.5 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                முக்கிய அம்சங்கள் (Highlights separated by | )
              </label>
              <input
                type="text"
                value={highlights}
                onChange={(e) => setHighlights(e.target.value)}
                placeholder="ஆசிரியர் தலையங்கம்|10 புதிய சிறுகதைகள்"
                className="w-full rounded-xl border border-stone-300 px-3.5 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Cover Image URL
              </label>
              <input
                type="text"
                value={coverImageUrl}
                onChange={(e) => setCoverImageUrl(e.target.value)}
                className="w-full rounded-xl border border-stone-300 px-3 py-2 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                PDF Digital Edition URL
              </label>
              <input
                type="text"
                value={pdfUrl}
                onChange={(e) => setPdfUrl(e.target.value)}
                className="w-full rounded-xl border border-stone-300 px-3 py-2 text-xs font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full py-3 rounded-xl bg-crimson-800 hover:bg-crimson-700 text-white font-semibold text-sm flex items-center justify-center gap-2 transition cursor-pointer"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <BookMarked className="w-4 h-4" />
              )}
              <span>{editingId ? 'Update Issue' : 'Publish Issue'}</span>
            </button>
          </form>
        </div>

        <div className="lg:col-span-7 space-y-4">
          {loading ? (
            <div className="p-12 text-center text-sm text-stone-400">
              Loading magazine issues...
            </div>
          ) : (
            issues.map((issue) => (
              <div
                key={issue.id}
                className="rounded-2xl bg-white border border-parchment-300 p-5 shadow-2xs flex items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="px-2.5 py-0.5 rounded bg-crimson-800 text-white font-bold">
                      Issue #{issue.issueNumber}
                    </span>
                    <span className="text-stone-500 font-medium">
                      {issue.month} {issue.year}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-stone-900">
                    {issue.title}
                  </h3>
                  <p className="text-xs text-stone-600 line-clamp-2">
                    {issue.description}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => startEdit(issue)}
                    className="p-2 rounded-lg border border-stone-200 text-stone-600 hover:text-crimson-800 cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(issue.id)}
                    className="p-2 rounded-lg border border-stone-200 text-stone-400 hover:text-red-600 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

