import type { Metadata } from 'next';
import { Cormorant_Garamond } from 'next/font/google';
import localFont from 'next/font/local';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import './globals.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});
const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-display',
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${display.variable} bg-ink text-cream antialiased`}
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
