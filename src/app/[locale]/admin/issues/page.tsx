'use client';

import { useEffect, useRef, useState } from 'react';
import {
  BookMarked,
  Plus,
  Edit3,
  Trash2,
  Loader2,
  CheckCircle2,
  Upload,
  Image as ImageIcon,
  FileText,
  ExternalLink,
  X,
  AlertCircle,
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
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [issueNumber, setIssueNumber] = useState(15);
  const [month, setMonth] = useState('டிசம்பர் (December)');
  const [year, setYear] = useState(2026);
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [highlights, setHighlights] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [coverFileName, setCoverFileName] = useState('');
  const [pdfUrl, setPdfUrl] = useState('');
  const [pdfFileName, setPdfFileName] = useState('');
  const [isPublished, setIsPublished] = useState(true);

  const [uploadingCover, setUploadingCover] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);

  const coverInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);

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
    setCoverImageUrl('');
    setCoverFileName('');
    setPdfUrl('');
    setPdfFileName('');
    setIsPublished(true);
    setErrorMsg(null);
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
    setCoverFileName(
      issue.coverImageUrl ? issue.coverImageUrl.split('/').pop() || 'Cover Image' : ''
    );
    setPdfUrl(issue.pdfUrl);
    setPdfFileName(
      issue.pdfUrl ? issue.pdfUrl.split('/').pop() || 'Issue PDF' : ''
    );
    setIsPublished(issue.isPublished);
    setNotice(null);
    setErrorMsg(null);
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    setErrorMsg(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'cover');

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to upload cover image.');
      } else {
        setCoverImageUrl(data.url);
        setCoverFileName(data.filename || file.name);
      }
    } catch {
      setErrorMsg('Failed to upload cover image to server.');
    } finally {
      setUploadingCover(false);
      e.target.value = '';
    }
  };

  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPdf(true);
    setErrorMsg(null);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'pdf');

      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || 'Failed to upload PDF file.');
      } else {
        setPdfUrl(data.url);
        setPdfFileName(data.filename || file.name);
      }
    } catch {
      setErrorMsg('Failed to upload PDF file to server.');
    } finally {
      setUploadingPdf(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setNotice(null);
    setErrorMsg(null);

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
    } else {
      const errData = await res.json().catch(() => ({}));
      setErrorMsg(errData.error || 'Failed to save magazine issue.');
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
          Publish monthly editions of Manjary with Tamil Unicode titles, issue highlights, cover image uploads, and PDF editions.
        </p>
      </div>

      {notice && (
        <div className="rounded-xl bg-emerald-950 text-emerald-100 p-4 text-xs sm:text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {errorMsg && (
        <div className="rounded-xl bg-red-950 text-red-100 p-4 text-xs sm:text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMsg}</span>
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

            {/* Cover Image Upload */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                அட்டைப்படம் (Cover Image)
              </label>
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                onChange={handleCoverUpload}
                className="hidden"
              />

              <div className="rounded-xl border border-stone-300 bg-parchment-50/60 p-3.5 space-y-3">
                {coverImageUrl ? (
                  <div className="flex items-center gap-3">
                    <img
                      src={coverImageUrl}
                      alt="Cover preview"
                      className="w-16 h-20 object-cover rounded-lg border border-stone-200 shadow-2xs shrink-0 bg-stone-100"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-stone-800 truncate">
                        {coverFileName || 'Cover image uploaded'}
                      </p>
                      <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
                        ✓ Stored in backend
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          type="button"
                          onClick={() => coverInputRef.current?.click()}
                          disabled={uploadingCover}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-stone-300 hover:border-crimson-700 text-xs font-semibold text-stone-700 transition cursor-pointer"
                        >
                          {uploadingCover ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Upload className="w-3.5 h-3.5 text-crimson-700" />
                          )}
                          <span>Change Image</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setCoverImageUrl('');
                            setCoverFileName('');
                          }}
                          className="p-1 rounded-lg text-stone-400 hover:text-red-600 transition cursor-pointer"
                          title="Remove cover image"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => coverInputRef.current?.click()}
                    disabled={uploadingCover}
                    className="w-full py-3 px-4 rounded-xl border border-dashed border-stone-300 bg-white hover:border-crimson-700 hover:bg-parchment-50 text-stone-700 text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    {uploadingCover ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-crimson-700" />
                        <span>Uploading Cover Image...</span>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="w-4 h-4 text-crimson-700" />
                        <span>Upload Cover Image (JPG, PNG, WebP)</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* PDF Digital Edition Upload */}
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                மஞ்சரி PDF இதழ் (PDF Digital Edition)
              </label>
              <input
                ref={pdfInputRef}
                type="file"
                accept="application/pdf,.pdf"
                onChange={handlePdfUpload}
                className="hidden"
              />

              <div className="rounded-xl border border-stone-300 bg-parchment-50/60 p-3.5">
                {pdfUrl ? (
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-10 h-10 rounded-lg bg-crimson-800/10 text-crimson-800 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-stone-800 truncate">
                          {pdfFileName || 'Magazine Edition PDF'}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[11px] text-emerald-700 font-medium">
                            ✓ Stored in backend
                          </span>
                          <a
                            href={pdfUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] text-crimson-700 hover:underline font-semibold"
                          >
                            <span>View PDF</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => pdfInputRef.current?.click()}
                        disabled={uploadingPdf}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white border border-stone-300 hover:border-crimson-700 text-xs font-semibold text-stone-700 transition cursor-pointer"
                      >
                        {uploadingPdf ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Upload className="w-3.5 h-3.5 text-crimson-700" />
                        )}
                        <span>Replace</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setPdfUrl('');
                          setPdfFileName('');
                        }}
                        className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 transition cursor-pointer"
                        title="Remove PDF"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => pdfInputRef.current?.click()}
                    disabled={uploadingPdf}
                    className="w-full py-3 px-4 rounded-xl border border-dashed border-stone-300 bg-white hover:border-crimson-700 hover:bg-parchment-50 text-stone-700 text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer"
                  >
                    {uploadingPdf ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-crimson-700" />
                        <span>Uploading PDF Edition...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 text-crimson-700" />
                        <span>Upload PDF Digital Edition (.pdf)</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={saving || uploadingCover || uploadingPdf}
              className="w-full py-3 rounded-xl bg-crimson-800 hover:bg-crimson-700 disabled:opacity-60 text-white font-semibold text-sm flex items-center justify-center gap-2 transition cursor-pointer"
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
                <div className="flex items-start gap-4 min-w-0">
                  {issue.coverImageUrl && (
                    <img
                      src={issue.coverImageUrl}
                      alt={issue.title}
                      className="w-14 h-20 object-cover rounded-lg border border-stone-200 shrink-0 bg-stone-100"
                    />
                  )}
                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="px-2.5 py-0.5 rounded bg-crimson-800 text-white font-bold">
                        Issue #{issue.issueNumber}
                      </span>
                      <span className="text-stone-500 font-medium">
                        {issue.month} {issue.year}
                      </span>
                      {issue.pdfUrl && (
                        <a
                          href={issue.pdfUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-parchment-200 text-crimson-800 hover:bg-parchment-300 font-semibold"
                        >
                          <FileText className="w-3 h-3" />
                          <span>PDF</span>
                        </a>
                      )}
                    </div>
                    <h3 className="font-serif text-lg font-bold text-stone-900">
                      {issue.title}
                    </h3>
                    <p className="text-xs text-stone-600 line-clamp-2">
                      {issue.description}
                    </p>
                  </div>
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
