import Image from 'next/image';

const GALLERY_IMAGES = [
  'SPK.jpg',
  'bball.png',
  'temple.JPG',
  'navside.JPG',
  'redflow.JPG',
  'robville.JPG',
  'icerink.MP4',
  'bench.png',
  'peacockwhite.JPG',
  'rishiside.JPG',
  'NYbridge.png',
  'beachme.png',
  'penny2.MP4',
  'street.JPG',
  'bridge.png',
  'IMG_9164.jpeg',
  'cooly.png',
  'penny.MP4',
  'peacocktwo.JPG',
  'house.png',
  'whiteflow.JPG',
  'cutey.png',
  'bluepeacock.JPG',
  'sedona.MP4',
  'meside.JPG',
  'pittsburgh.JPG',
  'mustang.jpg',
  'swan.JPG',
  'lightning.JPG',
  'droneshot.MP4',
] as const;

export default function Gallery() {
  return (
    <section id="gallery" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center text-black">
          Our Work
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-0.5">
          {GALLERY_IMAGES.map((media) => {
            const isVideo = media.toLowerCase().endsWith('.mp4');
            return (
              <div key={media} className="relative group overflow-hidden">
                <div className="relative h-[300px]">
                  {isVideo ? (
                    <video
                      src={`/gallery/${media}`}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <Image
                      src={`/gallery/${media}`}
                      alt={`Gallery image ${media}`}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  )}
                  <div className="absolute inset-0 border border-black/5" />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
