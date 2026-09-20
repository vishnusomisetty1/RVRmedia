'use client';

import { useInView } from './useInView';

type Props = {
  text: string;
  className?: string;
  /** Milliseconds before the first word starts. */
  delay?: number;
  /** Milliseconds between consecutive words. */
  stagger?: number;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'span';
};

/**
 * Splits a line into words and lifts each one out from behind its own mask as
 * the element scrolls into view. The text is rendered as normal words in the
 * DOM, so it still reads as one string to search engines and screen readers.
 */
export default function RevealText({
  text,
  className = '',
  delay = 0,
  stagger = 70,
  as: Tag = 'h2',
}: Props) {
  const { ref, isVisible } = useInView<HTMLHeadingElement>();
  const words = text.split(' ');

  return (
    <Tag ref={ref} className={className}>
      {words.map((word, index) => (
        <span key={`${word}-${index}`}>
          <span className="word-mask">
            <span
              className={`word-scroll ${isVisible ? 'is-visible' : ''}`}
              style={{ transitionDelay: `${delay + index * stagger}ms` }}
            >
              {word}
            </span>
          </span>
          {index < words.length - 1 ? ' ' : null}
        </span>
      ))}
    </Tag>
  );
}
