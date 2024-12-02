import Image from 'next/image';

const GALLERY_IMAGES = [
  'candidme.JPG',
  'SPK.JPG',
  'temple.JPG',
  'navside.JPG',
  'peacockwhite.JPG',
  'rishiside.JPG',
  'IMG_9164.jpeg',
  'peacocktwo.JPG',
  'bluepeacock.JPG',
  'pittsburgh.JPG',
  'swan.JPG',
  'lightning.JPG',
  'meside.JPG',
];

export default function Gallery() {
  return (
    <section id="gallery" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center text-black">
          Our Work
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1">
          {GALLERY_IMAGES.map((image) => (
            <div
              key={image}
              className="relative aspect-square group overflow-hidden"
            >
              <Image
                src={`/gallery/${image}`}
                alt={`Gallery image ${image}`}
                fill
                className="object-cover transition-all duration-300 hover:scale-105"
              />
              <div className="absolute inset-0 border border-black/10" />
              <div className="absolute inset-0 bg-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
