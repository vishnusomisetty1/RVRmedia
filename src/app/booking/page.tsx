import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Book Us | RVR Media',
  description: 'Book RVR Media for events, portraits, and creative shoots.',
};

export default function BookingPage() {
  return (
    <main className="min-h-screen bg-ink pb-16 pt-28">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-gold">
            RVR Media
          </p>
          <h1 className="mt-3 font-display text-5xl font-semibold text-cream md:text-7xl">
            Book Us
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-cream/65">
            Tell us about your event or shoot and we&apos;ll get back to you
            with availability.
          </p>
        </div>

        <div className="overflow-hidden rounded-lg border border-cream/10 bg-white">
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
