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
  metadataBase: new URL('https://your-website-url.com'), // Replace with your actual domain
  title: 'RVR Media',
  description: 'Professional Photography and Videography Services',
  openGraph: {
    title: 'RVR Media',
    description: 'Professional Photography and Videography Services',
    siteName: 'RVR Media',
    images: [
      {
        url: '/favicon.ico', // or use a proper OG image like '/og-image.png'
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RVR Media',
    description: 'Professional Photography and Videography Services',
    images: ['/favicon.ico'], // or use a proper OG image
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
