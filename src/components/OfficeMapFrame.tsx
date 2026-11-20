'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import styles from './OfficeMap.module.css';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
const DURATION_MS = 550;
// Every view is 4:3, like the map's frame, so nothing is cropped at any width.
const ASPECT = 3 / 4;

type Zoom = 'far' | 'near';

type Props = {
  /** Width in metres of the neighbourhood view (the first one). */
  farWidth: number;
  /** Width in metres of the block view. */
  nearWidth: number;
  label: string;
  /** The pin, drawn over the map's centre. */
  overlay: ReactNode;
  /** The map's layers, in metres around the office (which sits at 0 0). */
  children: ReactNode;
};

/** A viewBox of the given width, centred on the office. */
function viewBoxFor(width: number): string {
  const height = width * ASPECT;
  return `${-width / 2} ${-height / 2} ${width} ${height}`;
}

/**
 * The map's frame with two zoom levels: the neighbourhood, with the landmarks
 * people in town know, and the block, with what sits next to the clinic.
 * Buttons switch between them; the view glides there unless the visitor asked
 * for reduced motion. Nothing reacts to scroll or the mouse wheel.
 */
export function OfficeMapFrame({ farWidth, nearWidth, label, overlay, children }: Props) {
  const [zoom, setZoom] = useState<Zoom>('far');
  const svgRef = useRef<SVGSVGElement>(null);
  const widthRef = useRef(farWidth);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    // --k scales the map's type with the view, so names keep their size on
    // screen; --zw widens the streets a little as the view closes in.
    const apply = (width: number) => {
      widthRef.current = width;
      svg.setAttribute('viewBox', viewBoxFor(width));
      const closeness = (farWidth - width) / (farWidth - nearWidth);
      svg.style.setProperty('--k', (width / farWidth).toFixed(4));
      svg.style.setProperty('--zw', (1 + 0.6 * closeness).toFixed(3));
    };

    const from = widthRef.current;
    const to = zoom === 'near' ? nearWidth : farWidth;
    const reduced =
      typeof window.matchMedia === 'function' && window.matchMedia(REDUCED_MOTION_QUERY).matches;
    if (from === to || reduced || typeof window.requestAnimationFrame !== 'function') {
      apply(to);
      return;
    }

    let frame = 0;
    const start = performance.now();
    const step = (now: number) => {
      const progress = Math.min(1, (now - start) / DURATION_MS);
      const eased = 1 - (1 - progress) ** 3;
      // Interpolated on a log scale, so the zoom feels even all the way.
      apply(from * (to / from) ** eased);
      if (progress < 1) frame = window.requestAnimationFrame(step);
    };
    frame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(frame);
  }, [zoom, farWidth, nearWidth]);

  return (
    <div className={styles.map} data-zoom={zoom}>
      <svg
        ref={svgRef}
        className={styles.svg}
        viewBox={viewBoxFor(farWidth)}
        preserveAspectRatio="xMidYMid slice"
        role="img"
        aria-label={label}
      >
        {children}
      </svg>

      {overlay}

      <div className={styles.controls}>
        <button
          type="button"
          className={styles.control}
          aria-label="Aproximar o mapa do quarteirão"
          disabled={zoom === 'near'}
          onClick={() => setZoom('near')}
        >
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M8 3v10M3 8h10" />
          </svg>
        </button>
        <button
          type="button"
          className={styles.control}
          aria-label="Afastar o mapa para o bairro"
          disabled={zoom === 'far'}
          onClick={() => setZoom('far')}
        >
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path d="M3 8h10" />
          </svg>
        </button>
      </div>
    </div>
  );
}
