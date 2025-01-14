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
  description: 'Professional Photography and Videography Services',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    type: 'website',
    url: 'https://rvrmedia.vercel.app',
    title: 'RVR Media',
    description: 'Professional Photography and Videography Services',
    siteName: 'RVR Media',
    images: [
      {
        url: '/portfolio/grouppic.jpeg',
        width: 800,
        height: 600,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RVR Media',
    description: 'Professional Photography and Videography Services',
    images: ['/portfolio/grouppic.jpeg'],
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
