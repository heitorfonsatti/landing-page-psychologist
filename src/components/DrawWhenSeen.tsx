'use client';

import { useEffect } from 'react';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Plays a one-time drawing on elements marked `data-draw`, the first time
 * most of each one is on screen.
 *
 * The element's CSS draws it in full by default. This component first sets
 * `data-draw="waiting"` (CSS then holds the undrawn state) and switches it to
 * `"done"` once the element is seen, which the CSS transitions. So without
 * JavaScript, without IntersectionObserver or with reduced motion on, the
 * drawing is simply there.
 */
export function DrawWhenSeen(): null {
  useEffect(() => {
    if (typeof window.IntersectionObserver !== 'function') {
      return;
    }
    if (typeof window.matchMedia === 'function' && window.matchMedia(REDUCED_MOTION_QUERY).matches) {
      return;
    }

    const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-draw]'));
    targets.forEach((el) => el.setAttribute('data-draw', 'waiting'));

    const observer = new window.IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.setAttribute('data-draw', 'done');
            observer.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.6 },
    );
    targets.forEach((el) => observer.observe(el));

    return () => {
      observer.disconnect();
      targets.forEach((el) => el.setAttribute('data-draw', 'done'));
    };
  }, []);

  return null;
}
