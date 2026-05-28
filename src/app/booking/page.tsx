import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Book Us | RVR Media',
  description: 'Book RVR Media for events, portraits, and creative shoots.',
};

export default function BookingPage() {
  return (
    <main className="min-h-screen bg-white pb-16 pt-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-black/50">
            RVR Media
          </p>
          <h1 className="mt-3 text-4xl font-bold text-black md:text-5xl">
            Book Us
          </h1>
        </div>

        <div className="overflow-hidden rounded-lg border border-black/10 bg-white shadow-[0_18px_70px_rgba(0,0,0,0.08)]">
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLSevbA8RdIBgkm_ILugVApZBtERPMLPZPzJgyxd8sebuaO4UVQ/viewform?embedded=true"
            title="RVR Media booking form"
            width="640"
            height="3198"
            className="h-[3198px] w-full"
            frameBorder="0"
            marginHeight={0}
            marginWidth={0}
          >
            Loading...
          </iframe>
        </div>
      </div>
    </main>
  );
}
