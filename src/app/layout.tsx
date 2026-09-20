import type { Metadata } from 'next';
import { Bodoni_Moda, Lato } from 'next/font/google';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
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

const SHARE_IMAGE = {
  url: '/gallery/events/_DSC9302.jpg',
  width: 2400,
  height: 1600,
  alt: 'Guests dancing at a private event photographed by RVR Media',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://rvrmedia.vercel.app'),
  title: 'RVR Media',
  description:
    'Photo and video coverage for events, portraits, and creative lifestyle shoots.',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    type: 'website',
    url: 'https://rvrmedia.vercel.app',
    title: 'RVR Media',
    description:
      'Photo and video coverage for events, portraits, and creative lifestyle shoots.',
    siteName: 'RVR Media',
    images: [SHARE_IMAGE],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RVR Media',
    description:
      'Photo and video coverage for events, portraits, and creative lifestyle shoots.',
    images: [SHARE_IMAGE.url],
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
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
