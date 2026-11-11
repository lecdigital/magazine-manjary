'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { BookOpen, Feather, Globe, ShieldCheck, Sparkles, Menu, X } from 'lucide-react';
import { useState } from 'react';

export function Navbar() {
  const t = useTranslations();
  const locale = useLocale();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const nextLocale = locale === 'ta' ? 'en' : 'ta';

  const navLinks = [
    { href: '/', label: t('Nav.home'), icon: Feather },
    { href: '/manjary', label: t('Nav.manjary'), icon: Sparkles },
    { href: '/short-stories', label: t('Nav.shortStories'), icon: BookOpen },
    { href: '/novels', label: t('Nav.novels'), icon: BookOpen },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-parchment-300/80 bg-parchment-50/95 backdrop-blur-md">
      {/* Top literary ribbon */}
      <div className="bg-crimson-900 text-parchment-100 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-sans">
            <span className="inline-block w-2 h-2 rounded-full bg-gold-500" />
            <span className="font-medium">{t('Site.tagline')}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline text-parchment-200/90">
              {t('Site.author')} ({t('Site.authorEn')})
            </span>
            <Link
              href="/admin"
              className="inline-flex items-center gap-1 text-amber-300 hover:text-amber-200 font-medium transition"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{t('Nav.admin')}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3.5 group">
          <div className="w-11 h-11 rounded-xl bg-crimson-800 text-parchment-50 flex items-center justify-center font-serif text-2xl font-bold shadow-sm group-hover:bg-crimson-700 transition">
            ம
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
                மஞ்சரி
              </span>
              <span className="text-xs font-sans uppercase tracking-widest text-crimson-700 font-semibold">
                MANJARY
              </span>
            </div>
            <p className="text-xs text-stone-600 font-sans">
              {t('Site.subtitle')}
            </p>
          </div>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'bg-crimson-800 text-parchment-50 shadow-sm'
                    : 'text-stone-700 hover:bg-parchment-200/70 hover:text-crimson-800'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Actions: Language Switcher & Subscribe CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href={pathname || '/'}
            locale={nextLocale}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-stone-300 bg-white text-stone-800 hover:border-crimson-700 hover:text-crimson-800 text-xs font-semibold transition shadow-2xs"
            title="Switch Language / மொழி மாற்றம்"
          >
            <Globe className="w-3.5 h-3.5 text-crimson-700" />
            <span>{t('Nav.switchLang')}</span>
          </Link>

          <Link
            href="/manjary#pricing"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-crimson-700 hover:bg-crimson-800 text-white text-xs sm:text-sm font-medium shadow-xs transition"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>{t('Nav.subscribe')}</span>
          </Link>
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href={pathname || '/'}
            locale={nextLocale}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-stone-300 bg-white text-xs font-semibold text-stone-800"
          >
            <Globe className="w-3.5 h-3.5 text-crimson-700" />
            <span>{t('Nav.switchLang')}</span>
          </Link>
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-stone-700 hover:bg-parchment-200"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-parchment-300 bg-parchment-50 px-4 pt-3 pb-5 space-y-2">
          {navLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2.5 rounded-lg text-base font-medium text-stone-800 hover:bg-parchment-200"
            >
              {item.label}
            </Link>
          ))}
          <div className="pt-2 flex flex-col gap-2">
            <Link
              href="/manjary#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-lg bg-crimson-700 text-white font-medium text-sm"
            >
              {t('Nav.subscribe')}
            </Link>
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 rounded-lg border border-stone-300 text-stone-700 font-medium text-xs"
            >
              {t('Nav.admin')}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

