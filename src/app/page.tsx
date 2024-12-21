import Hero from './components/Hero';
import Navbar from './components/Navbar';
import Services from './components/Services';
import Stream from './components/Stream';
import Team from './components/Team';

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Stream />
      <Services />
      <Team />
    </>
  );
}
