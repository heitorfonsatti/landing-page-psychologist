'use client';

import { useId, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import type { ServiceItem } from '@/types/content';
import { isFullyVisible, scrollToShow } from './PanelStack';
import styles from './Services.module.css';

type Props = {
  moreLabel: string;
  backLabel: string;
  struggleLabel: string;
  supportLabel: string;
  items: ServiceItem[];
};

const EASE = 'cubic-bezier(.22,.8,.24,1)';
const GROW_MS = 620;
const SHRINK_MS = 560;
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

type Box = { top: number; left: number; width: number; height: number };

function boxStyle({ top, left, width, height }: Box): Keyframe {
  return { top: `${top}px`, left: `${left}px`, width: `${width}px`, height: `${height}px` };
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

/** Box of `el` relative to `frame`, in px. */
function boxIn(frame: HTMLElement, el: HTMLElement): Box {
  const f = frame.getBoundingClientRect();
  const r = el.getBoundingClientRect();
  return { top: r.top - f.top, left: r.left - f.left, width: r.width, height: r.height };
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
export function ServiceTopics({ moreLabel, backLabel, struggleLabel, supportLabel, items }: Props) {
  const id = useId();
  const titleId = `${id}-title`;

  /** Topic whose explanation is rendered (also while it grows or shrinks). */
  const [active, setActive] = useState<number | null>(null);
  /** True once the explanation alone fills the frame. */
  const [expanded, setExpanded] = useState(false);

  const frameRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLButtonElement>(null);
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

    if (canAnimate(frame)) {
      const gridHeight = frame.offsetHeight;
      const from = boxIn(frame, card);
      // Renders the explanation, still absolutely positioned over the grid.
      flushSync(() => setActive(index));
      const detail = detailRef.current!;
      const content = contentRef.current!;
      const to: Box = { top: 0, left: 0, width: frame.clientWidth, height: detail.offsetHeight };

      // Starts scrolling while it grows, aiming at the frame's final size, so
      // the next panel never covers the explanation on its way open.
      frame.style.height = `${to.height}px`;
      reveal(frame);
      frame.style.height = '';

      card.style.visibility = 'hidden';
      const others = cardRefs.current.filter((c): c is HTMLLIElement => c !== null && c !== card);
      await finished([
        ...others.map((c) =>
          c.animate(
            [
              { opacity: 1, transform: 'scale(1)' },
              { opacity: 0, transform: 'scale(.94)' },
            ],
            { duration: 320, easing: EASE, fill: 'forwards' },
          ),
        ),
        // `forwards` holds the final size until the explanation takes the
        // cards' place in the flow; without it, the frame would flash back to
        // the grid's height while the text is still fading in.
        detail.animate([boxStyle(from), boxStyle(to)], { duration: GROW_MS, easing: EASE, fill: 'forwards' }),
        frame.animate([{ height: `${gridHeight}px` }, { height: `${to.height}px` }], {
          duration: GROW_MS,
          easing: EASE,
          fill: 'forwards',
        }),
        content.animate(
          [
            { opacity: 0, transform: 'translateY(8px)' },
            { opacity: 1, transform: 'none' },
          ],
          { duration: 320, delay: 380, easing: EASE, fill: 'backwards' },
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
    reveal(frame);
    backRef.current?.focus({ preventScroll: true });
    busy.current = false;
  };

  const close = async () => {
    const frame = frameRef.current;
    const detail = detailRef.current;
    const content = contentRef.current;
    const index = active;
    if (busy.current || !frame || !detail || !content || index === null) {
      return;
    }
    const card = cardRefs.current[index];
    if (!card) {
      return;
    }
    busy.current = true;

    if (canAnimate(frame)) {
      const detailHeight = frame.offsetHeight;
      const from: Box = { top: 0, left: 0, width: frame.clientWidth, height: detail.offsetHeight };
      await finished([content.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160, easing: EASE, fill: 'forwards' })]);

      // Lays the grid out again underneath the explanation to find where the card goes.
      flushSync(() => setExpanded(false));
      const gridHeight = frame.offsetHeight;
      const to = boxIn(frame, card);
      card.style.visibility = 'hidden';
      const others = cardRefs.current.filter((c): c is HTMLLIElement => c !== null && c !== card);

      await finished([
        detail.animate([boxStyle(from), boxStyle(to)], { duration: SHRINK_MS, easing: EASE, fill: 'forwards' }),
        frame.animate([{ height: `${detailHeight}px` }, { height: `${gridHeight}px` }], {
          duration: SHRINK_MS,
          easing: EASE,
        }),
        ...others.map((c) =>
          c.animate(
            [
              { opacity: 0, transform: 'scale(.94)' },
              { opacity: 1, transform: 'scale(1)' },
            ],
            { duration: 360, delay: 260, easing: EASE, fill: 'backwards' },
          ),
        ),
      ]);
      others.forEach((c) => c.getAnimations().forEach((a) => a.cancel()));
      card.style.visibility = '';
    }

    flushSync(() => {
      setExpanded(false);
      setActive(null);
    });
    reveal(card);
    moreRefs.current[index]?.focus({ preventScroll: true });
    busy.current = false;
  };

  const current = active === null ? null : items[active];

  return (
    <div ref={frameRef} className={styles.frame} data-expanded={expanded || undefined}>
      <ul className={styles.list} hidden={expanded}>
        {items.map((item, i) => (
          <li
            key={item.title}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className={styles.item}
          >
            <h3 className={styles.itemTitle}>{item.title}</h3>
            <p className={styles.itemText}>{item.description}</p>
            <button
              ref={(el) => {
                moreRefs.current[i] = el;
              }}
              type="button"
              className={styles.link}
              onClick={() => void open(i)}
            >
              {moreLabel}{' '}
              <span className="visually-hidden">sobre {item.title}</span>
              <span aria-hidden="true"> →</span>
            </button>
          </li>
        ))}
      </ul>

      {current && (
        <article ref={detailRef} className={styles.detail} aria-labelledby={titleId}>
          <div ref={contentRef} className={styles.detailContent}>
            <button ref={backRef} type="button" className={styles.link} onClick={() => void close()}>
              <span aria-hidden="true">← </span>
              {backLabel}
            </button>
            <h3 id={titleId} className={styles.detailTitle}>
              {current.title}
            </h3>
            <p className={styles.detailLabel}>{struggleLabel}</p>
            <p className={styles.detailText}>{current.struggle}</p>
            <p className={styles.detailLabel}>{supportLabel}</p>
            <p className={styles.detailText}>{current.support}</p>
          </div>
        </article>
      )}
    </div>
  );
}
