import Image from 'next/image';

export default function Team() {
  return (
    <section id="contact" className="py-20 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold mb-12 text-center text-white">
          Meet Our Team
        </h2>

        <div className="flex flex-col items-center gap-12 mb-16">
          <div className="flex flex-col items-center">
            <div className="w-36 h-36 md:w-48 md:h-48 rounded-full overflow-hidden mb-4 border-2 border-white/10">
              <Image
                src="/profilepic/Vishnu(temp).png"
                alt="Vishnu Somisetty"
                width={192}
                height={192}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-lg md:text-xl font-semibold text-white">
              Vishnu Somisetty
            </h3>
          </div>

          <div className="flex flex-col md:flex-row justify-center gap-12">
            <div className="flex flex-col items-center">
              <div className="w-36 h-36 md:w-48 md:h-48 rounded-full overflow-hidden mb-4 border-2 border-white/10">
                <Image
                  src="/profilepic/Rishi.png"
                  alt="Rishi Ven"
                  width={192}
                  height={192}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-white">
                Rishikesh Venkateshwaraja
              </h3>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-36 h-36 md:w-48 md:h-48 rounded-full overflow-hidden mb-4 border-2 border-white/10">
                <Image
                  src="/profilepic/Rishan.png"
                  alt="Rishan Kundharaju"
                  width={192}
                  height={192}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg md:text-xl font-semibold text-white">
                Rishan Kundharaju
              </h3>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-lg text-white mb-2">
            Gmail:{' '}
            <a
              href="mailto:rvr.mediaco@gmail.com"
              className="text-blue-400 hover:underline"
            >
              rvr.mediaco@gmail.com
            </a>
          </p>
          <p className="text-lg text-white">
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
