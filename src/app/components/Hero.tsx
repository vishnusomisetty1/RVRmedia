// Type-only hero on flat ink. The photography lives in the film strip
// directly below, so nothing competes with the headline for attention.
const HEADLINE = 'Capture Your Moments. Relive Them Forever.'.split(' ');

const LAST_WORD_DELAY = 480 + HEADLINE.length * 90;

export default function Hero() {
  return (
    <section className="relative flex min-h-[78vh] items-center justify-center overflow-hidden bg-ink px-4 py-24">
      <div className="relative z-10 mx-auto max-w-4xl text-center text-cream">
        <p
          className="rise-in text-sm font-semibold uppercase tracking-[0.35em] text-orchid"
          style={{ animationDelay: '120ms' }}
        >
          RVR Media
        </p>

        <span
          aria-hidden
          className="ruler-grow mx-auto mt-4 block h-px w-16 bg-orchid/70"
          style={{ animationDelay: '320ms' }}
        />

        {/* Each word rides up from behind its own mask, one after another. */}
        <h1 className="mt-5 font-display text-5xl font-normal leading-[1.05] sm:text-6xl md:text-8xl">
          {HEADLINE.map((word, index) => (
            <span key={`${word}-${index}`}>
              <span className="word-mask">
                <span
                  className="word-rise"
                  style={{ animationDelay: `${480 + index * 90}ms` }}
                >
                  {word}
                </span>
              </span>
              {index < HEADLINE.length - 1 ? ' ' : null}
            </span>
          ))}
        </h1>

        <p
          className="rise-in mx-auto mt-6 max-w-2xl text-lg leading-8 text-cream/65 md:text-xl"
          style={{ animationDelay: `${LAST_WORD_DELAY + 120}ms` }}
        >
          Professional photo and video coverage for birthdays, weddings, and
          private events across New Jersey.
        </p>

        <div
          className="rise-in"
          style={{ animationDelay: `${LAST_WORD_DELAY + 280}ms` }}
        >
          <a
            href="#contact"
            className="mt-9 inline-flex rounded-full bg-violet px-8 py-3 text-sm font-semibold text-cream transition-all duration-300 hover:bg-violet-dark"
          >
            Get in Touch
          </a>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2">
        <a
          href="#services"
          aria-label="Scroll to services"
          className="rise-in block text-cream/50 transition-colors hover:text-orchid"
          style={{ animationDelay: `${LAST_WORD_DELAY + 520}ms` }}
        >
          <span className="scroll-cue block text-2xl leading-none">&darr;</span>
        </a>
      </div>
    </section>
  );
}
