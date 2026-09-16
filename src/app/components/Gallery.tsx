import { getGalleryItems, PORTFOLIO_CATEGORIES } from '@/lib/gallery';
import PortfolioBrowser from './PortfolioBrowser';

export default async function Gallery() {
  const items = await getGalleryItems();

  if (items.length === 0) {
    return null;
  }

  return (
    <section id="portfolio" className="bg-ink py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-gold">
            Portfolio
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold text-cream md:text-6xl">
            Events, Portraits, and Candid Work
          </h2>
        </div>

        <PortfolioBrowser
          categories={[...PORTFOLIO_CATEGORIES]}
          items={items}
        />
      </div>
    </section>
  );
}
