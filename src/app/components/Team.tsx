import Image from 'next/image';

export default function Team() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-black/50">
            About
          </p>
          <h2 className="mt-3 text-3xl font-bold text-black md:text-4xl">
            Meet RVR Media
          </h2>
        </div>

        <div className="mb-16 flex flex-col items-center justify-center gap-12 md:flex-row">
          <div className="flex flex-col items-center">
            <div className="w-36 h-36 md:w-48 md:h-48 rounded-full overflow-hidden mb-4 border-2 border-black/10">
              <Image
                src="/profilepic/Vishnu(temp).png"
                alt="Vishnu Somisetty"
                width={192}
                height={192}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-black">
              Vishnu Somisetty
            </h3>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-36 h-36 md:w-48 md:h-48 rounded-full overflow-hidden mb-4 border-2 border-black/10">
              <Image
                src="/profilepic/Rishan.png"
                alt="Rishan Kundharaju"
                width={192}
                height={192}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-black">
              Rishan Kundharaju
            </h3>
          </div>
        </div>

        <div id="contact" className="scroll-mt-24 text-center">
          <h3 className="mb-5 text-2xl font-bold text-black">Contact</h3>
          <p className="text-lg text-black mb-2">
            Gmail:{' '}
            <a
              href="mailto:rvr.mediaco@gmail.com"
              className="text-blue-400 hover:underline"
            >
              rvr.mediaco@gmail.com
            </a>
          </p>
          <p className="text-lg text-black">
            Instagram:{' '}
            <a
              href="https://www.instagram.com/rvr_mediaco/profilecard"
              className="text-blue-400 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              @rvr_mediaco
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
