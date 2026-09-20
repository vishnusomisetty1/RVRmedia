import FilmStrip from './components/FilmStrip';
import Hero from './components/Hero';
import Reveal from './components/Reveal';
import Services from './components/Services';
import Team from './components/Team';
import { getGalleryItems, interleaveByCategory } from '@/lib/gallery';

export default function Home() {
  // Mix the categories so the strip does not run six event photos in a row.
  const items = interleaveByCategory(getGalleryItems());

  return (
    <>
      <Hero />
      <Reveal>
        <FilmStrip items={items} />
      </Reveal>
      <Services />
      <Team />
    </>
  );
}
