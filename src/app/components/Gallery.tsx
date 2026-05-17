import GalleryGrid from './GalleryGrid';
import { getGalleryItems } from '@/lib/gallery';

export default async function Gallery() {
  const items = await getGalleryItems();

  if (items.length === 0) {
    return null;
  }

  return (
    <section id="gallery" className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-black/50">
            Recent Work
          </p>
          <h2 className="mt-3 text-3xl font-bold text-black md:text-4xl">
            Gallery
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base text-black/65">
            A clean look at recent RVR Media photo and video work.
          </p>
        </div>

        <GalleryGrid items={items} />
      </div>
    </section>
  );
}
