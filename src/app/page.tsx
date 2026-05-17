import Hero from './components/Hero';
import Services from './components/Services';
import Team from './components/Team';
import Gallery from './components/Gallery';

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <Gallery />
      <Team />
    </>
  );
}
