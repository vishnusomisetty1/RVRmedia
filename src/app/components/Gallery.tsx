import { getGalleryItems, PORTFOLIO_CATEGORIES } from '@/lib/gallery';
import PortfolioBrowser from './PortfolioBrowser';

export default async function Gallery() {
  const items = await getGalleryItems();

  if (items.length === 0) {
    return null;
  }

  return (
    <section id="portfolio" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-black/50">
            Portfolio
          </p>
          <h2 className="mt-3 text-3xl font-bold text-black md:text-4xl">
            Events, Portraits, and Creative Work
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-black/65">
            Browse the three booking-focused categories we shoot most: full
            event coverage, directed portraits, and cinematic lifestyle work.
          </p>
        </div>

        <PortfolioBrowser
          categories={[...PORTFOLIO_CATEGORIES]}
          items={items}
        />
      </div>
    </section>
  );
}
