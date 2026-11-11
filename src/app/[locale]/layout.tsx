import type { Metadata } from 'next';
import { Noto_Serif_Tamil, Noto_Sans_Tamil } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { AuthSessionProvider } from '@/components/AuthSessionProvider';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import '../globals.css';

const notoSerifTamil = Noto_Serif_Tamil({
  subsets: ['tamil', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-serif-tamil',
  display: 'swap',
});

const notoSansTamil = Noto_Sans_Tamil({
  subsets: ['tamil', 'latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-noto-sans-tamil',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'மஞ்சரி (Manjary) — எம். தயாளன் (M. Thayalan) | தமிழ் இலக்கிய இதழ்',
  description:
    'Manjary (மஞ்சரி) literary magazine, short stories, and novels authored and edited by M. Thayalan (எம். தயாளன்). Empowering emerging Tamil writers.',
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as 'ta' | 'en')) {
    notFound();
  }

  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${notoSerifTamil.variable} ${notoSansTamil.variable}`}
    >
      <body className="min-h-screen flex flex-col bg-parchment-50 text-stone-900 font-sans">
        <AuthSessionProvider>
          <NextIntlClientProvider messages={messages}>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </NextIntlClientProvider>
        </AuthSessionProvider>
      </body>
    </html>
  );
}

