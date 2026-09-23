'use client';

import { useActionState, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  BUDGETS,
  CONTACT_METHODS,
  COVERAGE_HOURS,
  GUEST_COUNTS,
  OCCASIONS,
  PHOTO_PERMISSION,
  REFERRAL_SOURCES,
  SERVICES,
  SETTINGS,
} from '@/lib/booking-form';
import { submitBooking, type BookingState } from '../booking/actions';

const STEPS = [
  {
    eyebrow: 'First things first',
    heading: 'What are we celebrating?',
    sub: 'Pick anything that fits. You can add your own below.',
  },
  {
    eyebrow: 'The day',
    heading: 'When and where?',
    sub: 'Rough details are fine — we can nail it down later.',
  },
  {
    eyebrow: 'The coverage',
    heading: 'What do you need from us?',
    sub: 'This is what shapes your quote.',
  },
  {
    eyebrow: 'Almost done',
    heading: 'How do we reach you?',
    sub: 'We reply within 1–2 business days.',
  },
];

const field =
  'w-full rounded-lg border border-cream/12 bg-ink/50 px-4 py-3.5 text-[15px] text-cream placeholder:text-cream/25 outline-none transition-all duration-200 focus:border-orchid/60 focus:bg-ink/80 focus:shadow-[0_0_0_3px_rgba(212,94,196,0.12)]';

function Ask({
  label,
  optional,
  hint,
  children,
}: {
  label: string;
  optional?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-2.5 flex items-baseline gap-2">
        <span className="text-[15px] font-medium text-cream/90">{label}</span>
        {optional ? (
          <span className="text-xs text-cream/30">optional</span>
        ) : null}
      </div>
      {hint ? (
        <p className="-mt-1 mb-2.5 text-sm text-cream/40">{hint}</p>
      ) : null}
      {children}
    </div>
  );
}

function Pill({
  label,
  name,
  value,
  type,
  checked,
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  type: 'radio' | 'checkbox';
  checked: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label
      className={`group relative cursor-pointer select-none rounded-lg border px-4 py-3 text-[15px] transition-all duration-200 ${
        checked
          ? 'border-orchid/70 bg-orchid/[0.12] text-cream shadow-[0_0_0_1px_rgba(212,94,196,0.35)]'
          : 'border-cream/10 bg-ink/40 text-cream/65 hover:border-cream/30 hover:bg-ink/70 hover:text-cream'
      }`}
    >
      <input
        type={type}
        name={name}
        value={value}
        checked={checked}
        onChange={() => onChange(value)}
        className="sr-only"
      />
      <span className="flex items-center justify-between gap-3">
        {label}
        <span
          aria-hidden
          className={`text-orchid transition-all duration-200 ${
            checked ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
          }`}
        >
          &#10003;
        </span>
      </span>
    </label>
  );
}

// Keeps the phone number readable while typing without fighting the user.
function formatPhone(raw: string) {
  const digits = raw.replace(/\D/g, '').slice(0, 10);
  if (digits.length <= 3) return digits;
  if (digits.length <= 6) return `(${digits.slice(0, 3)}) ${digits.slice(3)}`;
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
}

const initialState: BookingState = { status: 'idle' };

export default function BookingForm() {
  const [state, formAction, isPending] = useActionState(
    submitBooking,
    initialState,
  );
  const [step, setStep] = useState(0);

  const [occasion, setOccasion] = useState<string[]>([]);
  const [occasionOther, setOccasionOther] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [setting, setSetting] = useState('');
  const [guests, setGuests] = useState('');
  const [services, setServices] = useState<string[]>([]);
  const [coverage, setCoverage] = useState('');
  const [budget, setBudget] = useState('');
  const [permission, setPermission] = useState<string>(PHOTO_PERMISSION.yes);
  const [referral, setReferral] = useState('');
  const [contactMethod, setContactMethod] = useState('Text');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const toggle = (
    value: string,
    list: string[],
    set: (next: string[]) => void,
  ) =>
    set(
      list.includes(value) ? list.filter((v) => v !== value) : [...list, value],
    );

  const stepValid = useMemo(() => {
    if (step === 0) return occasion.length > 0 || occasionOther.trim() !== '';
    if (step === 1) return eventDate !== '';
    if (step === 2) return services.length > 0;
    return name.trim() !== '' && email.trim() !== '' && phone.trim() !== '';
  }, [step, occasion, occasionOther, eventDate, services, name, email, phone]);

  const isLast = step === STEPS.length - 1;
  const goNext = () => stepValid && !isLast && setStep((s) => s + 1);

  // Enter should move the form along, not submit it halfway through.
  const onKeyDown = (event: React.KeyboardEvent<HTMLFormElement>) => {
    const target = event.target as HTMLElement;
    if (event.key !== 'Enter' || target.tagName === 'TEXTAREA') return;
    if (!isLast) {
      event.preventDefault();
      goNext();
    }
  };

  if (state.status === 'success') {
    return (
      <div className="step-panel rounded-2xl border border-orchid/25 bg-surface px-6 py-20 text-center sm:px-12">
        <p className="font-display text-6xl italic text-orchid">Thank you</p>
        <h2 className="mt-5 font-display text-3xl font-normal text-cream">
          Your inquiry is in.
        </h2>
        <p className="mx-auto mt-4 max-w-md leading-7 text-cream/60">
          We read every request ourselves and usually reply within 1&ndash;2
          business days. If it&apos;s urgent, email{' '}
          <a
            href="mailto:Rvr.mediaco@gmail.com"
            className="text-orchid underline-offset-4 hover:underline"
          >
            Rvr.mediaco@gmail.com
          </a>
          .
        </p>
        <Link
          href="/portfolio"
          className="mt-9 inline-block rounded-lg border border-orchid/50 px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.2em] text-orchid transition-colors hover:bg-violet hover:text-cream"
        >
          Browse the portfolio
        </Link>
      </div>
    );
  }

  const current = STEPS[step];

  return (
    <form
      action={formAction}
      onKeyDown={onKeyDown}
      className="overflow-hidden rounded-2xl border border-cream/10 bg-surface"
    >
      {/* Progress */}
      <div className="h-[3px] w-full bg-cream/[0.07]">
        <div
          className="h-full bg-orchid transition-[width] duration-500 ease-out"
          style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
        />
      </div>

      <div className="px-6 py-10 sm:px-12 sm:py-12">
        <div key={step} className="step-panel">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orchid/80">
            {current.eyebrow}
          </p>
          <h2 className="mt-3 font-display text-3xl font-normal text-cream sm:text-4xl">
            {current.heading}
          </h2>
          <p className="mt-2 text-[15px] text-cream/45">{current.sub}</p>
        </div>

        {/* Every step stays mounted so one submit carries the whole answer set. */}
        <div className={step === 0 ? 'step-panel mt-9 space-y-5' : 'hidden'}>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {OCCASIONS.map((item) => (
              <Pill
                key={item}
                label={item}
                name="occasion"
                value={item}
                type="checkbox"
                checked={occasion.includes(item)}
                onChange={(value) => toggle(value, occasion, setOccasion)}
              />
            ))}
          </div>
          <input
            type="text"
            name="occasionOther"
            value={occasionOther}
            onChange={(event) => setOccasionOther(event.target.value)}
            placeholder="Something else? Tell us here"
            className={field}
          />
        </div>

        <div className={step === 1 ? 'step-panel mt-9 space-y-7' : 'hidden'}>
          <div className="grid gap-5 sm:grid-cols-2">
            <Ask label="Event date">
              <input
                type="date"
                name="eventDate"
                value={eventDate}
                onChange={(event) => setEventDate(event.target.value)}
                className={`${field} [color-scheme:dark]`}
              />
            </Ask>
            <Ask label="Start & end time" optional>
              <input
                type="text"
                name="eventTime"
                placeholder="6:00 PM – 11:00 PM"
                className={field}
              />
            </Ask>
          </div>

          <Ask
            label="Venue"
            optional
            hint='If it&rsquo;s a house, just write "house".'
          >
            <input
              type="text"
              name="venue"
              placeholder="Name & address"
              className={field}
            />
          </Ask>

          <div className="grid gap-5 sm:grid-cols-2">
            <Ask label="Indoor or outdoor?" optional>
              <div className="grid grid-cols-3 gap-2.5">
                {[...SETTINGS, 'Other'].map((item) => (
                  <Pill
                    key={item}
                    label={item}
                    name="setting"
                    value={item}
                    type="radio"
                    checked={setting === item}
                    onChange={setSetting}
                  />
                ))}
              </div>
              {setting === 'Other' ? (
                <input
                  type="text"
                  name="settingOther"
                  placeholder="Describe the space"
                  className={`${field} mt-2.5`}
                />
              ) : null}
            </Ask>
            <Ask label="Guests expected" optional>
              <div className="grid grid-cols-3 gap-2.5">
                {GUEST_COUNTS.map((item) => (
                  <Pill
                    key={item}
                    label={item}
                    name="guests"
                    value={item}
                    type="radio"
                    checked={guests === item}
                    onChange={setGuests}
                  />
                ))}
              </div>
            </Ask>
          </div>

          <Ask label="Who is the event for?" optional>
            <input
              type="text"
              name="guestOfHonor"
              placeholder="Guest of honor's name"
              className={field}
            />
          </Ask>
        </div>

        <div className={step === 2 ? 'step-panel mt-9 space-y-7' : 'hidden'}>
          <Ask label="Which services?">
            <div className="grid gap-2.5 sm:grid-cols-3">
              {SERVICES.map((item) => (
                <Pill
                  key={item}
                  label={item}
                  name="services"
                  value={item}
                  type="checkbox"
                  checked={services.includes(item)}
                  onChange={(value) => toggle(value, services, setServices)}
                />
              ))}
            </div>
          </Ask>

          <Ask label="How many hours of coverage?" optional>
            <div className="grid gap-2.5 sm:grid-cols-5">
              {COVERAGE_HOURS.map((item) => (
                <Pill
                  key={item}
                  label={item}
                  name="coverageHours"
                  value={item}
                  type="radio"
                  checked={coverage === item}
                  onChange={setCoverage}
                />
              ))}
            </div>
          </Ask>

          <Ask
            label="Budget range"
            optional
            hint="A ballpark helps us build the right package — no pressure."
          >
            <div className="grid gap-2.5 sm:grid-cols-3">
              {BUDGETS.map((item) => (
                <Pill
                  key={item}
                  label={item}
                  name="budget"
                  value={item}
                  type="radio"
                  checked={budget === item}
                  onChange={setBudget}
                />
              ))}
            </div>
          </Ask>

          <Ask
            label="Moments we cannot miss"
            optional
            hint="Cake cutting, speeches, entrance, first dance, family photos…"
          >
            <textarea
              name="timeline"
              rows={3}
              className={`${field} resize-y`}
            />
          </Ask>

          <Ask label="May we show selected photos in our portfolio?">
            <div className="grid gap-2.5 sm:grid-cols-2">
              {[PHOTO_PERMISSION.yes, PHOTO_PERMISSION.no].map((item) => (
                <Pill
                  key={item}
                  label={item}
                  name="photoPermission"
                  value={item}
                  type="radio"
                  checked={permission === item}
                  onChange={setPermission}
                />
              ))}
            </div>
          </Ask>
        </div>

        <div className={step === 3 ? 'step-panel mt-9 space-y-7' : 'hidden'}>
          <div className="grid gap-5 sm:grid-cols-2">
            <Ask label="Your name">
              <input
                type="text"
                name="name"
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className={field}
              />
            </Ask>
            <Ask label="Phone">
              <input
                type="tel"
                name="phone"
                autoComplete="tel"
                inputMode="tel"
                placeholder="(555) 123-4567"
                value={phone}
                onChange={(event) => setPhone(formatPhone(event.target.value))}
                className={field}
              />
            </Ask>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Ask label="Email">
              <input
                type="email"
                name="email"
                autoComplete="email"
                inputMode="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className={field}
              />
            </Ask>
            <Ask label="Instagram" optional>
              <input
                type="text"
                name="instagram"
                placeholder="@yourhandle"
                className={field}
              />
            </Ask>
          </div>

          <Ask label="Best way to reach you">
            <div className="grid grid-cols-3 gap-2.5">
              {CONTACT_METHODS.map((item) => (
                <Pill
                  key={item}
                  label={item}
                  name="contactMethod"
                  value={item}
                  type="radio"
                  checked={contactMethod === item}
                  onChange={setContactMethod}
                />
              ))}
            </div>
          </Ask>

          <Ask label="How did you find us?" optional>
            <div className="grid gap-2.5 sm:grid-cols-3">
              {REFERRAL_SOURCES.map((item) => (
                <Pill
                  key={item}
                  label={item}
                  name="referral"
                  value={item}
                  type="radio"
                  checked={referral === item}
                  onChange={setReferral}
                />
              ))}
            </div>
            {referral === 'Other' ? (
              <input
                type="text"
                name="referralOther"
                placeholder="Tell us where"
                className={`${field} mt-2.5`}
              />
            ) : null}
          </Ask>

          <Ask label="Anything else we should know?" optional>
            <textarea name="notes" rows={3} className={`${field} resize-y`} />
          </Ask>
        </div>

        {state.status === 'error' && state.message ? (
          <div className="mt-8 rounded-lg border border-red-400/25 bg-red-400/[0.08] px-4 py-4">
            <p className="text-sm text-red-200">{state.message}</p>
            {state.mailto ? (
              <a
                href={state.mailto}
                className="mt-3 inline-flex rounded-lg bg-violet px-5 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-violet-dark"
              >
                Send as email instead
              </a>
            ) : null}
          </div>
        ) : null}
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-cream/10 bg-ink/30 px-6 py-5 sm:px-12">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          className={`text-sm text-cream/45 transition-colors hover:text-cream ${
            step === 0 ? 'invisible' : ''
          }`}
        >
          &larr; Back
        </button>

        <span className="text-xs tracking-[0.25em] text-cream/25">
          {step + 1}&thinsp;/&thinsp;{STEPS.length}
        </span>

        <button
          type={isLast ? 'submit' : 'button'}
          onClick={isLast ? undefined : goNext}
          disabled={!stepValid || isPending}
          className="rounded-lg bg-violet px-7 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-cream transition-all duration-200 hover:bg-violet-dark disabled:cursor-not-allowed disabled:bg-cream/10 disabled:text-cream/30"
        >
          {isLast ? (isPending ? 'Sending…' : 'Send inquiry') : 'Continue'}
        </button>
      </div>
    </form>
  );
}
