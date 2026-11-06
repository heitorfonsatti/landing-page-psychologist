'use client';

import { useEffect } from 'react';
import { coverage, scrollTopToShow } from '@/lib/panel-stack';

/** Class on `<html>` that turns on the stack CSS in `globals.css`. */
export const STACK_CLASS = 'stack-active';

const PANEL_SELECTOR = '[data-panel]';
const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

/**
 * Turns on the stack of full-screen panels: each panel sticks and is covered
 * by the next one.
 *
 * CSS does not know an element's height, and the point where a tall panel
 * sticks (by its bottom, after showing all its content) depends on it. This
 * component measures the panels and the header, writes the measurements to
 * CSS variables, computes how much of each panel is already covered and adds
 * the stack class.
 *
 * With reduced motion on, or without `matchMedia` or `ResizeObserver`, the
 * stack stays off and the page scrolls normally.
 */
export function PanelStack(): null {
  useEffect(() => {
    if (typeof window.matchMedia !== 'function' || typeof window.ResizeObserver !== 'function') {
      return;
    }

    const root = document.documentElement;
    const media = window.matchMedia(REDUCED_MOTION_QUERY);
    const panels = Array.from(document.querySelectorAll<HTMLElement>(PANEL_SELECTOR));
    const header = document.querySelector<HTMLElement>('header');

    let frame = 0;

    const headerHeight = () => header?.offsetHeight ?? 0;

    const measureHeader = () => {
      root.style.setProperty('--measured-header-height', `${headerHeight()}px`);
    };

    const measurePanels = () => {
      for (const panel of panels) {
        panel.style.setProperty('--panel-height', `${panel.offsetHeight}px`);
      }
    };

    const paintCoverage = () => {
      frame = 0;
      const viewportHeight = window.innerHeight;
      const headerBottom = headerHeight();
      panels.forEach((panel, i) => {
        const next = panels[i + 1];
        if (!next) {
          return;
        }
        const visibleTop = Math.max(panel.getBoundingClientRect().top, headerBottom);
        const value = coverage(next.getBoundingClientRect().top, visibleTop, viewportHeight);
        panel.style.setProperty('--coverage', value.toFixed(3));
      });
    };

    const scheduleCoverage = () => {
      if (frame === 0) {
        frame = window.requestAnimationFrame(paintCoverage);
      }
    };

    const clearCoverage = () => {
      for (const panel of panels) {
        panel.style.removeProperty('--coverage');
      }
    };

    /* -------- anchors and focus --------
       The browser scrolls to the current position of a stuck panel, which is
       already on screen (just covered), and concludes there is nothing to
       scroll. Here the scroll is computed from the panel's natural position. */

    const main = panels[0]?.parentElement ?? null;

    const naturalTopOf = (index: number): number => {
      if (!main) {
        return 0;
      }
      let top =
        main.getBoundingClientRect().top +
        window.scrollY +
        parseFloat(window.getComputedStyle(main).paddingTop);
      for (let k = 0; k < index; k++) {
        top += panels[k]?.offsetHeight ?? 0;
      }
      return top;
    };

    const scrollToTarget = (target: HTMLElement, behavior: ScrollBehavior): boolean => {
      const panel = target.closest<HTMLElement>(PANEL_SELECTOR);
      const index = panel ? panels.indexOf(panel) : -1;
      if (!panel || index < 0) {
        return false;
      }
      const offset =
        target === panel ? 0 : target.getBoundingClientRect().top - panel.getBoundingClientRect().top;
      window.scrollTo({
        top: scrollTopToShow({
          naturalTop: naturalTopOf(index),
          panelHeight: panel.offsetHeight,
          offset,
          viewportHeight: window.innerHeight,
          stickTop: headerHeight(),
        }),
        behavior,
      });
      return true;
    };

    /* Anchor navigation stays native: the browser marks the target
       (`:target`), moves the Tab starting point into the section and handles
       history. Afterwards, only the position is corrected. */
    const fixAnchor = () => {
      const id = decodeURIComponent(window.location.hash.slice(1));
      const target = id ? document.getElementById(id) : null;
      if (target) {
        scrollToTarget(target, 'smooth');
      }
    };

    const onClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.('a[href^="#"]');
      if (link && !event.defaultPrevented) {
        // Clicking the same anchor again does not fire `hashchange`.
        window.requestAnimationFrame(fixAnchor);
      }
    };

    const isVisible = (el: HTMLElement): boolean => {
      const r = el.getBoundingClientRect();
      if (r.top < headerHeight() - 1 || r.bottom > window.innerHeight + 1) {
        return false;
      }
      const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
      return Boolean(hit && (hit === el || el.contains(hit)));
    };

    /* Keyboard focus only. With the mouse the browser focuses on mousedown;
       scrolling then would move the element out from under the pointer and
       the click would be lost. Waits one frame so the browser does its own
       scroll first, and only corrects if the element is still hidden after it. */
    const onFocus = (event: FocusEvent) => {
      const el = event.target;
      if (!(el instanceof HTMLElement)) {
        return;
      }
      window.requestAnimationFrame(() => {
        if (document.activeElement === el && el.matches(':focus-visible') && !isVisible(el)) {
          scrollToTarget(el, 'instant');
        }
      });
    };

    let active = false;

    // Measuring the header is not motion: it also applies with the stack off,
    // so content always starts below the header's real height.
    const headerObserver = new window.ResizeObserver(() => {
      measureHeader();
      if (active) {
        scheduleCoverage();
      }
    });

    const panelObserver = new window.ResizeObserver(() => {
      measurePanels();
      scheduleCoverage();
    });

    const enable = () => {
      active = true;
      measurePanels();
      root.classList.add(STACK_CLASS);
      panels.forEach((panel) => panelObserver.observe(panel));
      window.addEventListener('scroll', scheduleCoverage, { passive: true });
      window.addEventListener('resize', scheduleCoverage);
      window.addEventListener('hashchange', fixAnchor);
      document.addEventListener('click', onClick);
      document.addEventListener('focusin', onFocus);
      scheduleCoverage();
    };

    const disable = () => {
      active = false;
      root.classList.remove(STACK_CLASS);
      panelObserver.disconnect();
      window.removeEventListener('scroll', scheduleCoverage);
      window.removeEventListener('resize', scheduleCoverage);
      window.removeEventListener('hashchange', fixAnchor);
      document.removeEventListener('click', onClick);
      document.removeEventListener('focusin', onFocus);
      if (frame !== 0) {
        window.cancelAnimationFrame(frame);
        frame = 0;
      }
      clearCoverage();
    };

    const onPreferenceChange = (event: { matches: boolean }) => {
      if (event.matches) {
        disable();
      } else {
        enable();
      }
    };

    measureHeader();
    if (header) {
      headerObserver.observe(header);
    }
    if (!media.matches) {
      enable();
    }
    media.addEventListener('change', onPreferenceChange);

    return () => {
      media.removeEventListener('change', onPreferenceChange);
      disable();
      headerObserver.disconnect();
    };
  }, []);

  return null;
}
