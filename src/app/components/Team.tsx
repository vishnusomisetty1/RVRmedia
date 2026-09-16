import Image from 'next/image';

const TEAM = [
  { name: 'Vishnu Somisetty', photo: '/profilepic/Vishnu(temp).png' },
  { name: 'Rishan Kundharaju', photo: '/profilepic/Rishan.png' },
];

export default function Team() {
  return (
    <section id="about" className="scroll-mt-16 bg-ink py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-14 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-gold">
            About
          </p>
          <h2 className="mt-3 font-display text-4xl font-semibold text-cream md:text-6xl">
            Meet RVR Media
          </h2>
        </div>

        <div className="mb-24 flex flex-col items-center justify-center gap-12 md:flex-row md:gap-20">
          {TEAM.map((member) => (
            <div key={member.name} className="flex flex-col items-center">
              <div className="mb-5 h-36 w-36 overflow-hidden rounded-full border border-gold/40 p-1 md:h-48 md:w-48">
                <Image
                  src={member.photo}
                  alt={member.name}
                  width={192}
                  height={192}
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
              <h3 className="font-display text-2xl font-semibold text-cream md:text-3xl">
                {member.name}
              </h3>
            </div>
          ))}
        </div>

        <div
          id="contact"
          className="scroll-mt-24 rounded-lg border border-cream/10 bg-surface px-6 py-12 text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-gold">
            Contact
          </p>
          <h3 className="mt-3 font-display text-3xl font-semibold text-cream md:text-5xl">
            Let&apos;s plan your shoot
          </h3>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href="mailto:rvr.mediaco@gmail.com"
              className="inline-flex rounded-full bg-gold px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-cream focus:outline-none focus-visible:ring-4 focus-visible:ring-gold/40"
            >
              rvr.mediaco@gmail.com
            </a>
            <a
              href="https://www.instagram.com/rvr_mediaco/profilecard"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex rounded-full border border-cream/25 px-6 py-3 text-sm font-semibold text-cream transition-colors hover:bg-cream hover:text-ink focus:outline-none focus-visible:ring-4 focus-visible:ring-cream/30"
            >
              Instagram @rvr_mediaco
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
