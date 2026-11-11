'use client';

import { useEffect, useRef, useState } from 'react';
import {
  Bold,
  Italic,
  Underline,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  ImagePlus,
  Link2,
  AlignLeft,
  AlignCenter,
  Minus,
  Undo2,
  Redo2,
  Code,
  Eye,
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

/**
 * Converts plain text (with double-newline paragraphs) to clean HTML paragraphs
 * when loading legacy plain-text stories into the rich text editor.
 */
export function normalizeContentToHtml(raw: string): string {
  if (!raw) return '';
  const trimmed = raw.trim();
  if (/<(p|h[1-6]|div|figure|img|blockquote|ul|ol|br)\b/i.test(trimmed)) {
    return trimmed;
  }
  return trimmed
    .split(/\n\s*\n/)
    .map((para) => `<p>${para.trim().replace(/\n/g, '<br/>')}</p>`)
    .join('');
}

export function RichTextEditor({
  value,
  onChange,
  placeholder = 'உங்கள் சிறுகதை, நாவல் அத்தியாயம் அல்லது கட்டுரையை இங்கே எழுதவும்...',
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showUrlModal, setShowUrlModal] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [imageCaptionInput, setImageCaptionInput] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [sourceMode, setSourceMode] = useState(false);

  // Sync external value changes (e.g. when clicking "Edit" on a post or resetting the form)
  useEffect(() => {
    const el = editorRef.current;
    if (!el) return;
    const normalized = normalizeContentToHtml(value);
    if (el.innerHTML !== normalized) {
      el.innerHTML = normalized;
    }
  }, [value]);

  const emitChange = () => {
    if (!editorRef.current) return;
    onChange(editorRef.current.innerHTML);
  };

  const exec = (command: string, commandValue?: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false, commandValue);
    emitChange();
  };

  const insertHtmlAtCursor = (html: string) => {
    const el = editorRef.current;
    if (!el) return;
    el.focus();
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0 && el.contains(selection.anchorNode)) {
      document.execCommand('insertHTML', false, html);
    } else {
      el.innerHTML += html;
    }
    emitChange();
  };

  /**
   * Reads an uploaded or pasted image file, resizes/compresses it onto an HTML5 Canvas
   * so it fits comfortably in MySQL LONGTEXT, and inserts a styled <figure> at the cursor.
   */
  const processAndInsertImageFile = async (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setUploadingImage(true);

    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const compressedDataUrl = await new Promise<string>((resolve) => {
        const img = new window.Image();
        img.onload = () => {
          const maxWidth = 1200;
          const scale = img.width > maxWidth ? maxWidth / img.width : 1;
          const canvas = document.createElement('canvas');
          canvas.width = Math.round(img.width * scale);
          canvas.height = Math.round(img.height * scale);
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL('image/jpeg', 0.84));
          } else {
            resolve(dataUrl);
          }
        };
        img.onerror = () => resolve(dataUrl);
        img.src = dataUrl;
      });

      const defaultCaption = file.name.replace(/\.[^/.]+$/, '');
      const figureHtml = `<figure class="my-6"><img src="${compressedDataUrl}" alt="${defaultCaption}" class="rounded-2xl max-w-full h-auto mx-auto shadow-sm border border-stone-200" /><figcaption class="text-center text-xs text-stone-500 mt-2 italic">படக் குறிப்பு / Caption (திருத்த கிளிக் செய்யவும்)</figcaption></figure><p><br/></p>`;
      insertHtmlAtCursor(figureHtml);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFileInputChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    for (let i = 0; i < files.length; i++) {
      await processAndInsertImageFile(files[i]);
    }
    e.target.value = '';
  };

  const handleInsertImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    const captionHtml = imageCaptionInput.trim()
      ? `<figcaption class="text-center text-xs text-stone-500 mt-2 italic">${imageCaptionInput.trim()}</figcaption>`
      : '';
    const figureHtml = `<figure class="my-6"><img src="${imageUrlInput.trim()}" alt="${
      imageCaptionInput.trim() || 'Story illustration'
    }" class="rounded-2xl max-w-full h-auto mx-auto shadow-sm border border-stone-200" />${captionHtml}</figure><p><br/></p>`;
    insertHtmlAtCursor(figureHtml);
    setImageUrlInput('');
    setImageCaptionInput('');
    setShowUrlModal(false);
  };

  const handleInsertLink = () => {
    const url = window.prompt('Enter Link URL (https://...):', 'https://');
    if (url && url !== 'https://') {
      exec('createLink', url);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    if (e.dataTransfer?.files && e.dataTransfer.files.length > 0) {
      const hasImages = Array.from(e.dataTransfer.files).some((f) =>
        f.type.startsWith('image/')
      );
      if (hasImages) {
        e.preventDefault();
        for (const file of Array.from(e.dataTransfer.files)) {
          if (file.type.startsWith('image/')) {
            await processAndInsertImageFile(file);
          }
        }
      }
    }
  };

  const handlePaste = async (e: React.ClipboardEvent<HTMLDivElement>) => {
    if (e.clipboardData?.files && e.clipboardData.files.length > 0) {
      const imageFiles = Array.from(e.clipboardData.files).filter((f) =>
        f.type.startsWith('image/')
      );
      if (imageFiles.length > 0) {
        e.preventDefault();
        for (const file of imageFiles) {
          await processAndInsertImageFile(file);
        }
      }
    }
  };

  return (
    <div className="rounded-2xl border border-stone-300 bg-white overflow-hidden shadow-2xs focus-within:border-crimson-700 transition">
      {/* Formatting & Media Toolbar */}
      <div className="bg-parchment-100 border-b border-parchment-300 px-3 py-2 flex flex-wrap items-center gap-1">
        <button
          type="button"
          onClick={() => exec('bold')}
          className="p-2 rounded-lg text-stone-700 hover:bg-white hover:text-crimson-800 transition cursor-pointer"
          title="Bold (தடித்த எழுத்து)"
        >
          <Bold className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => exec('italic')}
          className="p-2 rounded-lg text-stone-700 hover:bg-white hover:text-crimson-800 transition cursor-pointer"
          title="Italic (சாய்ந்த எழுத்து)"
        >
          <Italic className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => exec('underline')}
          className="p-2 rounded-lg text-stone-700 hover:bg-white hover:text-crimson-800 transition cursor-pointer"
          title="Underline (அடிக்கோடு)"
        >
          <Underline className="w-4 h-4" />
        </button>

        <span className="h-5 w-px bg-parchment-300 mx-1" />

        <button
          type="button"
          onClick={() => exec('formatBlock', 'H2')}
          className="p-2 rounded-lg text-stone-700 hover:bg-white hover:text-crimson-800 transition cursor-pointer"
          title="Heading 2 (தலைப்பு 2)"
        >
          <Heading2 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => exec('formatBlock', 'H3')}
          className="p-2 rounded-lg text-stone-700 hover:bg-white hover:text-crimson-800 transition cursor-pointer"
          title="Heading 3 (துணைத் தலைப்பு)"
        >
          <Heading3 className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => exec('formatBlock', 'BLOCKQUOTE')}
          className="p-2 rounded-lg text-stone-700 hover:bg-white hover:text-crimson-800 transition cursor-pointer"
          title="Quote (மேற்கோள்)"
        >
          <Quote className="w-4 h-4" />
        </button>

        <span className="h-5 w-px bg-parchment-300 mx-1" />

        <button
          type="button"
          onClick={() => exec('insertUnorderedList')}
          className="p-2 rounded-lg text-stone-700 hover:bg-white hover:text-crimson-800 transition cursor-pointer"
          title="Bullet List"
        >
          <List className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => exec('insertOrderedList')}
          className="p-2 rounded-lg text-stone-700 hover:bg-white hover:text-crimson-800 transition cursor-pointer"
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => exec('justifyLeft')}
          className="p-2 rounded-lg text-stone-700 hover:bg-white hover:text-crimson-800 transition cursor-pointer"
          title="Align Left"
        >
          <AlignLeft className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => exec('justifyCenter')}
          className="p-2 rounded-lg text-stone-700 hover:bg-white hover:text-crimson-800 transition cursor-pointer"
          title="Align Center"
        >
          <AlignCenter className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => exec('insertHorizontalRule')}
          className="p-2 rounded-lg text-stone-700 hover:bg-white hover:text-crimson-800 transition cursor-pointer"
          title="Section Divider"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={handleInsertLink}
          className="p-2 rounded-lg text-stone-700 hover:bg-white hover:text-crimson-800 transition cursor-pointer"
          title="Insert Link"
        >
          <Link2 className="w-4 h-4" />
        </button>

        <span className="h-5 w-px bg-parchment-300 mx-1" />

        {/* Upload Image Button */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileInputChange}
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadingImage}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-crimson-800 hover:bg-crimson-700 text-white text-xs font-semibold shadow-2xs transition cursor-pointer"
          title="Upload Picture from Computer"
        >
          <ImagePlus className="w-3.5 h-3.5" />
          <span>{uploadingImage ? 'Uploading...' : 'படம் இணைக்க / Add Picture'}</span>
        </button>

        <button
          type="button"
          onClick={() => setShowUrlModal(!showUrlModal)}
          className="px-2.5 py-1.5 rounded-lg border border-stone-300 bg-white hover:border-crimson-700 text-stone-700 text-xs font-semibold transition cursor-pointer"
          title="Insert Image by URL"
        >
          Image URL
        </button>

        <div className="ml-auto flex items-center gap-1">
          <button
            type="button"
            onClick={() => exec('undo')}
            className="p-1.5 rounded-lg text-stone-600 hover:bg-white cursor-pointer"
            title="Undo"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => exec('redo')}
            className="p-1.5 rounded-lg text-stone-600 hover:bg-white cursor-pointer"
            title="Redo"
          >
            <Redo2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setSourceMode(!sourceMode)}
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
              sourceMode
                ? 'bg-stone-900 text-amber-300'
                : 'text-stone-600 hover:bg-white'
            }`}
            title="Toggle HTML Source / Visual Mode"
          >
            {sourceMode ? (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>Visual</span>
              </>
            ) : (
              <>
                <Code className="w-3.5 h-3.5" />
                <span>HTML</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Optional Image URL Drawer */}
      {showUrlModal && (
        <div className="bg-amber-50/70 border-b border-amber-200 p-3.5 flex flex-wrap items-center gap-2">
          <input
            type="url"
            value={imageUrlInput}
            onChange={(e) => setImageUrlInput(e.target.value)}
            placeholder="https://example.com/photo.jpg"
            className="flex-1 min-w-[200px] rounded-lg border border-stone-300 px-3 py-1.5 text-xs bg-white"
          />
          <input
            type="text"
            value={imageCaptionInput}
            onChange={(e) => setImageCaptionInput(e.target.value)}
            placeholder="படக் குறிப்பு / Caption (optional)"
            className="flex-1 min-w-[160px] rounded-lg border border-stone-300 px-3 py-1.5 text-xs bg-white"
          />
          <button
            type="button"
            onClick={handleInsertImageUrl}
            className="px-3.5 py-1.5 rounded-lg bg-crimson-800 text-white text-xs font-semibold cursor-pointer"
          >
            Insert Picture
          </button>
          <button
            type="button"
            onClick={() => setShowUrlModal(false)}
            className="px-2.5 py-1.5 rounded-lg text-xs text-stone-600 hover:text-stone-900"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Editable Surface or Raw HTML Source */}
      {sourceMode ? (
        <textarea
          rows={14}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-4 font-mono text-xs text-stone-800 bg-stone-50 focus:outline-none"
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onInput={emitChange}
          onBlur={emitChange}
          onDrop={handleDrop}
          onPaste={handlePaste}
          data-placeholder={placeholder}
          className="min-h-[340px] max-h-[620px] overflow-y-auto p-5 font-serif text-base sm:text-lg text-stone-900 leading-[2.0] focus:outline-none tamil-rich-content empty:before:content-[attr(data-placeholder)] empty:before:text-stone-400"
        />
      )}

      <div className="bg-parchment-50 border-t border-parchment-200 px-4 py-2 flex items-center justify-between text-[11px] text-stone-500">
        <span>
          💡 Tip: படங்களை நேரடியாக இழுத்துப் போடலாம் (Drag & Drop) அல்லது ஒட்டலாம் (Paste).
        </span>
        <span>Tamil Unicode + Rich Media Enabled</span>
      </div>
    </div>
  );
}
