import Image from 'next/image';

export default function Team() {
  return (
    <section className="py-20 bg-black text-white">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-12 text-center ">Meet Our Team</h2>

        <div className="flex flex-col items-center gap-12 mb-16">
          <div className="flex flex-col items-center">
            <div className="w-48 h-48 rounded-full overflow-hidden mb-4 border-2 border-black/10">
              <Image
                src="/profilepic/Vishnu(temp).png"
                alt="Vishnu Somisetty"
                width={192}
                height={192}
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-xl font-semibold">Vishnu Somisetty</h3>
          </div>

          <div className="flex flex-row justify-center gap-12">
            <div className="flex flex-col items-center">
              <div className="w-48 h-48 rounded-full overflow-hidden mb-4 border-2 border-black/10">
                <Image
                  src="/profilepic/Rishi.png"
                  alt="Rishi Ven"
                  width={192}
                  height={192}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold">Rishi Ven</h3>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-48 h-48 rounded-full overflow-hidden mb-4 border-2 border-black/10">
                <Image
                  src="/profilepic/Rishan.png"
                  alt="Rishan Kundharaju"
                  width={192}
                  height={192}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold">Rishan Kundharaju</h3>
            </div>
          </div>
        </div>
        <div className="text-center">
          <p className="text-lg text-white">
            Gmail:{' '}
            <a
              href="mailto:rvr.mediaco@gmail.com"
              className="text-blue-600 hover:underline"
            >
              rvr.mediaco@gmail.com
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
