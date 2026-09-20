'use client';

import { useInView } from './useInView';

type Props = {
  children: React.ReactNode;
  /** Milliseconds to stagger this element behind its neighbours. */
  delay?: number;
  className?: string;
};

/**
 * Fades and lifts its children into place the first time they scroll into
 * view. Children are always rendered into the DOM (only opacity/transform
 * change), and the animation is skipped entirely under prefers-reduced-motion.
 */
export default function Reveal({ children, delay = 0, className = '' }: Props) {
  const { ref, isVisible } = useInView<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`reveal ${isVisible ? 'is-visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}
