import type { Metadata } from 'next';
import localFont from 'next/font/local';
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
    images: [
      {
        url: '/favicon.ico',
        width: 800,
        height: 600,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RVR Media',
    description:
      'Photo and video coverage for events, portraits, and creative lifestyle shoots.',
    images: ['/favicon.ico'],
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
