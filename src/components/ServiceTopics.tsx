'use client';

import { useId, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import type { ServiceItem } from '@/types/content';
import { isFullyVisible, scrollToShow } from './PanelStack';
import styles from './Services.module.css';

/** `cards`: a grid of tinted cards. `list`: rows divided by rules, with an arrow. */
export type TopicsLayout = 'cards' | 'list';

type Props = {
  layout?: TopicsLayout;
  moreLabel: string;
  backLabel: string;
  struggleLabel: string;
  supportLabel: string;
  items: ServiceItem[];
};

/* Balanced in and out: a long decelerating tail reads as lag. */
const EASE = 'cubic-bezier(.4,0,.2,1)';
const GROW_MS = 440;
const SHRINK_MS = 380;
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

type Box = { top: number; left: number; width: number; height: number };

/**
 * `clip-path` that shows only `box` of an element `width` x `height` px,
 * with rounded corners. Animating it repaints but never lays out again, and
 * the text inside keeps its final line breaks while the shape grows.
 */
function clipTo({ top, left, width, height }: Box, outerWidth: number, outerHeight: number, radius: string): Keyframe {
  const right = outerWidth - left - width;
  const bottom = outerHeight - top - height;
  return { clipPath: `inset(${top}px ${right}px ${bottom}px ${left}px round ${radius})` };
}

/** Animations only run when the browser supports them and motion is welcome. */
function canAnimate(el: HTMLElement): boolean {
  if (typeof el.animate !== 'function') {
    return false;
  }
  return !(typeof window.matchMedia === 'function' && window.matchMedia(REDUCED_MOTION_QUERY).matches);
}

/**
 * Scrolls `el` into view when it is off screen or covered by the next panel,
 * which happens when the section changes height inside the panel stack.
 */
function reveal(el: HTMLElement): void {
  // Environments without layout (such as tests) cannot tell what is on screen.
  if (typeof document.elementFromPoint !== 'function' || isFullyVisible(el)) {
    return;
  }
  const behavior: ScrollBehavior = canAnimate(el) ? 'smooth' : 'instant';
  if (!scrollToShow(el, behavior)) {
    el.scrollIntoView({ block: 'nearest', behavior });
  }
}

function finished(animations: Animation[]): Promise<unknown> {
  return Promise.all(animations.map((a) => a.finished));
}

/**
 * Layout height of `el`, in px, with subpixels. Unlike offsetHeight it is not
 * rounded, and unlike getBoundingClientRect it ignores the depth `scale` a
 * partly covered panel carries.
 */
function layoutHeight(el: HTMLElement): number {
  return parseFloat(window.getComputedStyle(el).height) || el.offsetHeight;
}

/**
 * Box of `el` relative to `frame`, in layout px. Screen rects are divided by
 * the frame's scale, which is not 1 while the panel is partly covered.
 */
function boxIn(frame: HTMLElement, el: HTMLElement): Box {
  const f = frame.getBoundingClientRect();
  const r = el.getBoundingClientRect();
  const scale = frame.offsetWidth > 0 ? f.width / frame.offsetWidth : 1;
  return {
    top: (r.top - f.top) / scale,
    left: (r.left - f.left) / scale,
    width: r.width / scale,
    height: r.height / scale,
  };
}

/** Fades and slightly shrinks the cards that make way, or brings them back. */
function fadeCards(cards: HTMLElement[], direction: 'out' | 'in', delay = 0): Animation[] {
  const shown = { opacity: 1, transform: 'scale(1)' };
  const gone = { opacity: 0, transform: 'scale(.97)' };
  return cards.map((c) =>
    c.animate(direction === 'out' ? [shown, gone] : [gone, shown], {
      duration: direction === 'out' ? 200 : 260,
      delay,
      easing: EASE,
      fill: direction === 'out' ? 'forwards' : 'backwards',
    }),
  );
}

/**
 * The "How I can help" topics. "Learn more" grows the chosen card from where
 * it sits until it fills the frame, while the other cards fade away; "Back"
 * shrinks it into its place again and brings the others back.
 *
 * Without animation support, or with reduced motion on, the views swap
 * instantly. Focus moves to "Back" on open and returns to the "Learn more"
 * that was used on close.
 */
export function ServiceTopics({
  layout = 'cards',
  moreLabel,
  backLabel,
  struggleLabel,
  supportLabel,
  items,
}: Props) {
  const rows = layout === 'list';
  const id = useId();

  /** Topic whose explanation is rendered (also while it grows or shrinks). */
  const [active, setActive] = useState<number | null>(null);
  /** True once the explanation alone fills the frame. */
  const [expanded, setExpanded] = useState(false);

  const frameRef = useRef<HTMLDivElement>(null);
  const detailRefs = useRef<(HTMLElement | null)[]>([]);
  const contentRefs = useRef<(HTMLDivElement | null)[]>([]);
  const backRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const cardRefs = useRef<(HTMLLIElement | null)[]>([]);
  const moreRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const busy = useRef(false);

  const open = async (index: number) => {
    const frame = frameRef.current;
    const card = cardRefs.current[index];
    if (busy.current || !frame || !card) {
      return;
    }
    busy.current = true;

    // List layout: the explanation is at least as tall as the list it
    // replaces, so the frame keeps its height. Otherwise the photo beside it,
    // which stretches to the frame, would shrink, and the whole panel would
    // get shorter, making the stack jump and the next panel peek in.
    if (rows) {
      const detail = detailRefs.current[index];
      if (detail) {
        detail.style.minHeight = `${layoutHeight(frame)}px`;
      }
    }

    if (canAnimate(frame)) {
      const gridHeight = layoutHeight(frame);
      const from = boxIn(frame, card);
      // Renders the explanation at its final size, absolutely positioned over
      // the grid; the clip then reveals it from the card's shape outward.
      flushSync(() => setActive(index));
      const detail = detailRefs.current[index]!;
      const content = contentRefs.current[index]!;
      const width = frame.clientWidth;
      const height = layoutHeight(detail);
      // Tall enough to hold the card's box too: a low card can sit below the
      // explanation's final bottom, and the clip starts there.
      const canvas = Math.max(height, from.top + from.height);
      detail.style.height = `${canvas}px`;
      const radius = window.getComputedStyle(detail).borderTopLeftRadius || '0px';
      const to: Box = { top: 0, left: 0, width, height };

      // Starts scrolling while it grows, aiming at the frame's final size, so
      // the next panel never covers the explanation on its way open.
      frame.style.height = `${height}px`;
      reveal(frame);
      frame.style.height = '';

      card.style.visibility = 'hidden';
      const others = cardRefs.current.filter((c): c is HTMLLIElement => c !== null && c !== card);
      await finished([
        ...fadeCards(others, 'out'),
        // `forwards` holds the final state until the explanation takes the
        // cards' place in the flow; without it, the frame would flash back to
        // the grid's height for a frame.
        detail.animate([clipTo(from, width, canvas, radius), clipTo(to, width, canvas, radius)], {
          duration: GROW_MS,
          easing: EASE,
          fill: 'forwards',
        }),
        frame.animate([{ height: `${gridHeight}px` }, { height: `${height}px` }], {
          duration: GROW_MS,
          easing: EASE,
          fill: 'forwards',
        }),
        // The text already sits at its final line breaks, so it can come in
        // while the shape is still growing instead of after it. A row is
        // already full width, so its text shows almost at once; a card grows
        // sideways too, so its text waits until the shape is nearly wide
        // enough not to cut words at the edges. Both end with the growth.
        content.animate(
          [
            { opacity: 0, transform: 'translateY(6px)' },
            { opacity: 1, transform: 'none' },
          ],
          { duration: rows ? 300 : 220, delay: rows ? 90 : 220, easing: EASE, fill: 'backwards' },
        ),
      ]);
      others.forEach((c) => c.getAnimations().forEach((a) => a.cancel()));
      card.style.visibility = '';
    }

    flushSync(() => {
      setActive(index);
      setExpanded(true);
    });
    if (typeof frame.getAnimations === 'function') {
      frame.getAnimations({ subtree: true }).forEach((a) => a.cancel());
    }
    detailRefs.current[index]?.style.removeProperty('height');
    reveal(frame);
    backRefs.current[index]?.focus({ preventScroll: true });
    busy.current = false;
  };

  const close = async () => {
    const frame = frameRef.current;
    const index = active;
    if (index === null) {
      return;
    }
    const detail = detailRefs.current[index];
    const content = contentRefs.current[index];
    if (busy.current || !frame || !detail || !content) {
      return;
    }
    const card = cardRefs.current[index];
    if (!card) {
      return;
    }
    busy.current = true;

    if (canAnimate(frame)) {
      const detailHeight = layoutHeight(frame);
      const width = frame.clientWidth;
      const height = layoutHeight(detail);
      const radius = window.getComputedStyle(detail).borderTopLeftRadius || '0px';

      // Lays the grid out again underneath the explanation to find where the
      // card goes. Everything below then runs at once: no pause between the
      // text fading and the shape shrinking.
      flushSync(() => setExpanded(false));
      const gridHeight = layoutHeight(frame);
      const to = boxIn(frame, card);
      const canvas = Math.max(height, to.top + to.height);
      detail.style.height = `${canvas}px`;
      const from: Box = { top: 0, left: 0, width, height };
      card.style.visibility = 'hidden';
      const others = cardRefs.current.filter((c): c is HTMLLIElement => c !== null && c !== card);

      await finished([
        // Quick, so the shrinking shape does not cut words for long.
        content.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 110, easing: EASE, fill: 'forwards' }),
        detail.animate([clipTo(from, width, canvas, radius), clipTo(to, width, canvas, radius)], {
          duration: SHRINK_MS,
          easing: EASE,
          fill: 'forwards',
        }),
        frame.animate([{ height: `${detailHeight}px` }, { height: `${gridHeight}px` }], {
          duration: SHRINK_MS,
          easing: EASE,
        }),
        ...fadeCards(others, 'in', 120),
      ]);
      others.forEach((c) => c.getAnimations().forEach((a) => a.cancel()));
      card.style.visibility = '';
    }

    flushSync(() => {
      setExpanded(false);
      setActive(null);
    });
    // Leaves the hidden explanation clean for the next open: no held clip or
    // fade, no animation canvas, and the list height measured again (it
    // changes with the width).
    if (typeof detail.getAnimations === 'function') {
      detail.getAnimations({ subtree: true }).forEach((a) => a.cancel());
    }
    detail.style.removeProperty('height');
    detail.style.minHeight = '';
    reveal(card);
    moreRefs.current[index]?.focus({ preventScroll: true });
    busy.current = false;
  };

  return (
    <div ref={frameRef} className={styles.frame} data-expanded={expanded || undefined}>
      <ul className={rows ? styles.rows : styles.list} hidden={expanded}>
        {items.map((item, i) => (
          <li
            key={item.title}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className={rows ? styles.row : styles.item}
          >
            <h3 className={styles.itemTitle}>{item.title}</h3>
            <p className={styles.itemText}>{item.description}</p>
            <button
              ref={(el) => {
                moreRefs.current[i] = el;
              }}
              type="button"
              className={rows ? `${styles.rowMore} ${styles.more}` : `${styles.link} ${styles.more}`}
              onClick={() => void open(i)}
            >
              {/* Rows show only the arrow; the label stays as the button's name. */}
              {rows ? (
                <span className="visually-hidden">
                  {moreLabel} sobre {item.title}
                </span>
              ) : (
                <>
                  {moreLabel}{' '}
                  <span className="visually-hidden">sobre {item.title}</span>
                </>
              )}
              <span aria-hidden="true" className={styles.arrow}>
                {rows ? '→' : ' →'}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {/* Every explanation is in the HTML from the start, so search engines
          and find-in-page see it; only the active one is shown. */}
      {items.map((item, i) => {
        const titleId = `${id}-title-${i}`;
        return (
          <article
            key={item.title}
            ref={(el) => {
              detailRefs.current[i] = el;
            }}
            className={styles.detail}
            aria-labelledby={titleId}
            hidden={active !== i}
          >
            <div
              ref={(el) => {
                contentRefs.current[i] = el;
              }}
              className={styles.detailContent}
            >
              <button
                ref={(el) => {
                  backRefs.current[i] = el;
                }}
                type="button"
                className={styles.link}
                onClick={() => void close()}
              >
                <span aria-hidden="true">← </span>
                {backLabel}
              </button>
              <h3 id={titleId} className={styles.detailTitle}>
                {item.title}
              </h3>
              <p className={styles.detailLabel}>{struggleLabel}</p>
              <p className={styles.detailText}>{item.struggle}</p>
              <p className={styles.detailLabel}>{supportLabel}</p>
              <p className={styles.detailText}>{item.support}</p>
            </div>
          </article>
        );
      })}
    </div>
  );
}
