import type { Metadata } from 'next';
import { Analytics } from '@vercel/analytics/next';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Bodoni_Moda, Lato } from 'next/font/google';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import { SITE_URL, structuredData } from '@/lib/site';
import './globals.css';

// Lato is a humanist sans: narrower, slightly warm, and calm enough to sit
// under a didone. Bodoni Moda gives the headings their thick/thin contrast.
const sans = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  style: ['normal', 'italic'],
  variable: '--font-sans',
  display: 'swap',
});
const display = Bodoni_Moda({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'RVR Media | New Jersey Event & Portrait Photography',
    // Child pages set just their own name; this appends the brand.
    template: '%s | RVR Media',
  },
  description:
    'Photo and video coverage for events, portraits, and creative lifestyle shoots across New Jersey.',
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    type: 'website',
    url: SITE_URL,
    title: 'RVR Media',
    description:
      'Photo and video coverage for events, portraits, and creative lifestyle shoots.',
    siteName: 'RVR Media',
  },
  twitter: {
    // 'summary' rather than 'summary_large_image': no image is being
    // supplied, and the large-image card expects one.
    card: 'summary',
    title: 'RVR Media',
    description:
      'Photo and video coverage for events, portraits, and creative lifestyle shoots.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* Extensions such as Grammarly inject attributes onto <body> before
          React hydrates, which React otherwise reports as a mismatch. */}
      <body
        suppressHydrationWarning
        className={`${sans.variable} ${display.variable} bg-ink text-cream antialiased`}
      >
        <script
          type="application/ld+json"
          // Static, locally authored object — no user input reaches this.
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
        <Navbar />
        {children}
        <Footer />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
