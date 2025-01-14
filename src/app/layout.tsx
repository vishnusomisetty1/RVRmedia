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
  title: "Ratna & Suresh's Gruhapravesam",
  description: 'Join us for our Gruhapravesam celebration on 12/25/24',
  openGraph: {
    images: '/gallery/favicon.ico', // Path to your favicon in the public folder
    title: "Ratna & Suresh's Gruhapravesam",
    description: 'Join us for our Gruhapravesam celebration on 12/25/24',
  },
  twitter: {
    card: 'summary_large_image',
    images: '/gallery/favicon.ico', // Path to your favicon in the public folder
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
