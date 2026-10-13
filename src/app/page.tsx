import FilmStrip from './components/FilmStrip';
import Hero from './components/Hero';
import Reveal from './components/Reveal';
import Services from './components/Services';
import Team from './components/Team';
import { closeTheLoop, getGalleryItems, spreadOutShoots } from '@/lib/gallery';

export default function Home() {
  // Mix the shoots so the strip does not run six photos from one event in a row.
  const items = closeTheLoop(spreadOutShoots(getGalleryItems()));

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
