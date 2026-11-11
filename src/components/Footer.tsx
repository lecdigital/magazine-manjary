import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Feather, Shield, Sparkles } from 'lucide-react';

export function Footer() {
  const t = useTranslations();

  return (
    <footer className="border-t border-parchment-300 bg-stone-900 text-parchment-100 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand Column */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-crimson-700 text-white flex items-center justify-center font-serif text-xl font-bold">
                ம
              </div>
              <div>
                <h3 className="font-serif text-xl font-bold text-white">
                  மஞ்சரி (Manjary)
                </h3>
                <p className="text-xs text-stone-400">
                  எம். தயாளன் (M. Thayalan)
                </p>
              </div>
            </div>
            <p className="text-sm text-stone-300 leading-relaxed max-w-sm">
              {t('Footer.description')}
            </p>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-amber-400 mb-4 flex items-center gap-1.5">
              <Feather className="w-4 h-4" />
              <span>இலக்கியப் பக்கங்கள் / Navigation</span>
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-300">
              <li>
                <Link href="/" className="hover:text-white transition">
                  {t('Nav.home')}
                </Link>
              </li>
              <li>
                <Link href="/manjary" className="hover:text-white transition">
                  {t('Nav.manjary')}
                </Link>
              </li>
              <li>
                <Link href="/short-stories" className="hover:text-white transition">
                  {t('Nav.shortStories')}
                </Link>
              </li>
              <li>
                <Link href="/novels" className="hover:text-white transition">
                  {t('Nav.novels')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Admin & Editorial Info */}
          <div>
            <h4 className="font-serif text-sm font-semibold uppercase tracking-wider text-amber-400 mb-4 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4" />
              <span>ஆசிரியர் & நிர்வாகம் / Editorial</span>
            </h4>
            <p className="text-xs text-stone-300 leading-relaxed mb-4">
              புதிய எழுத்தாளர்கள் தங்கள் சிறுகதைகள், கவிதைகள் மற்றும் கட்டுரைகளை தமிழ் யூனிகோட் வடிவில் மஞ்சரி இதழுக்கு அனுப்பலாம்.
            </p>
            <div className="flex flex-wrap gap-2">
              <Link
                href="/admin"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-xs font-medium text-amber-300 border border-stone-700 transition"
              >
                <Shield className="w-3.5 h-3.5" />
                <span>Admin CMS & Stripe Pricing</span>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
          <p>
            © {new Date().getFullYear()} Manjary (மஞ்சரி) — M. Thayalan (எம். தயாளன்). {t('Footer.rights')}
          </p>
          <p className="text-stone-500">
            Local-First SQLite • Hostinger MySQL Ready • Next.js + Prisma + Stripe
          </p>
        </div>
      </div>
    </footer>
  );
}

