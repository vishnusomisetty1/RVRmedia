import Image from 'next/image';
import Link from 'next/link';
import Reveal from './Reveal';
import RevealText from './RevealText';

const TEAM = [
  { name: 'Vishnu Somisetty', photo: '/profilepic/Vishnu(temp).png' },
  { name: 'Rishan Kundharaju', photo: '/profilepic/Rishan.png' },
];

export default function Team() {
  return (
    <section id="about" className="scroll-mt-16 bg-ink py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-3 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-orchid">
            About
          </p>
        </Reveal>
        <RevealText
          as="h2"
          text="Meet RVR Media"
          className="mb-14 text-center font-display text-4xl font-normal text-cream md:text-6xl"
        />

        <div className="mb-24 flex flex-col items-center justify-center gap-12 md:flex-row md:gap-20">
          {TEAM.map((member, index) => (
            <Reveal
              key={member.name}
              delay={index * 140}
              className="flex flex-col items-center"
            >
              <div className="group mb-5 h-36 w-36 overflow-hidden rounded-full border border-orchid/40 p-1 transition-all duration-500 hover:border-orchid md:h-48 md:w-48">
                <Image
                  src={member.photo}
                  alt={member.name}
                  width={192}
                  height={192}
                  className="h-full w-full rounded-full object-cover transition-transform duration-700 group-hover:scale-[1.06]"
                />
              </div>
              <RevealText
                as="h3"
                text={member.name}
                delay={index * 140}
                className="font-display text-2xl font-normal text-cream md:text-3xl"
              />
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div
            id="contact"
            className="scroll-mt-24 rounded-xl border border-plum/20 bg-surface/45 px-6 py-14 text-center"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-orchid/80">
              Contact
            </p>
            <RevealText
              as="h3"
              text="Let's plan your shoot"
              className="mt-3 font-display text-3xl font-normal text-cream/90 md:text-5xl"
            />
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <a
                href="mailto:rvr.mediaco@gmail.com"
                className="inline-flex rounded-full bg-violet px-6 py-3 text-sm font-semibold text-cream transition-colors hover:bg-violet-dark focus:outline-none focus-visible:ring-4 focus-visible:ring-orchid/40"
              >
                rvr.mediaco@gmail.com
              </a>
              <Link
                href="/booking"
                className="inline-flex rounded-full border border-orchid/35 px-6 py-3 text-sm font-semibold text-cream/90 transition-colors hover:border-orchid/70 hover:bg-orchid/10 focus:outline-none focus-visible:ring-4 focus-visible:ring-orchid/40"
              >
                Book a shoot
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
