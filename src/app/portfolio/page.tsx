import type { Metadata } from 'next';
import Gallery from '../components/Gallery';

export const metadata: Metadata = {
  title: 'Portfolio',
  description:
    'Event, portrait, and candid lifestyle photography by RVR Media, serving all of New Jersey. Browse recent parties, receptions, graduations, and portrait sessions.',
  alternates: {
    canonical: '/portfolio',
  },
};

export default function PortfolioPage() {
  return (
    <main className="min-h-screen bg-ink pt-16">
      <Gallery />
    </main>
  );
}
