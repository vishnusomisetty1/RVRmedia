import type { Metadata } from 'next';
import BookingForm from '../components/BookingForm';
import Reveal from '../components/Reveal';

export const metadata: Metadata = {
  title: 'Book Us | RVR Media',
  description:
    'Tell us about your event and we will get back to you with availability within 1-2 business days.',
};

const ASSURANCES = [
  {
    title: 'Reply in 1-2 days',
    body: 'Every inquiry is read by Rishi, Vishnu, or Rishan directly.',
  },
  {
    title: 'No obligation',
    body: 'Sending this costs nothing and does not hold a date yet.',
  },
  {
    title: 'Built around you',
    body: 'We shape the package to your timeline, venue, and budget.',
  },
];

export default function BookingPage() {
  return (
    <main className="min-h-screen bg-ink pb-24 pt-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Reveal className="mb-14 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-orchid">
            Inquiries
          </p>
          <h1 className="mt-3 font-display text-5xl font-normal text-cream md:text-7xl">
            Book Us
          </h1>
          <p className="mx-auto mt-5 max-w-xl leading-7 text-cream/65">
            A few questions about your event, and we&apos;ll come back with
            availability and a package that fits. Takes about two minutes.
          </p>
        </Reveal>

        <div className="mb-12 grid gap-4 md:grid-cols-3">
          {ASSURANCES.map((item, index) => (
            <Reveal key={item.title} delay={index * 110}>
              <div className="h-full rounded-lg border border-cream/10 bg-surface/60 p-6">
                <h2 className="font-display text-xl font-normal text-cream">
                  {item.title}
                </h2>
                <p className="mt-2 text-sm leading-6 text-cream/60">
                  {item.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <BookingForm />
        </Reveal>

        <Reveal className="mt-10 text-center text-sm text-cream/45">
          Prefer email? Reach us at{' '}
          <a
            href="mailto:Rvr.mediaco@gmail.com"
            className="text-orchid underline-offset-4 hover:underline"
          >
            Rvr.mediaco@gmail.com
          </a>
          .
        </Reveal>
      </div>
    </main>
  );
}
