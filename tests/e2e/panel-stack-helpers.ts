import type { Page } from '@playwright/test';

/** CSS selector of panel `i` (zero-based) inside `<main>`. */
export function panelSelector(i: number): string {
  return `main > [data-panel]:nth-of-type(${i + 1})`;
}

/** Waits for window scrolling to settle: two equal readings of `scrollY`. */
export async function waitForScrollToStop(page: Page): Promise<void> {
  // Clears the previous reading: a stale one, left by another wait, would make
  // the first comparison report "stopped" before the new scroll starts.
  await page.evaluate(() => {
    delete (window as unknown as { __lastScrollY?: number }).__lastScrollY;
  });
  await page.waitForTimeout(50);
  await page.waitForFunction(
    () => {
      const win = window as unknown as { __lastScrollY?: number };
      const current = window.scrollY;
      const previous = win.__lastScrollY;
      win.__lastScrollY = current;
      return previous !== undefined && Math.abs(previous - current) < 0.5;
    },
    undefined,
    { polling: 100, timeout: 5_000 },
  );
}

/**
 * Scrolls the whole page, 40px at a time, and tells whether the last text of
 * a panel is, at some point, fully on screen, below the header and with no
 * other panel on top of it.
 *
 * The default target is the last visible element of the panel that has its
 * own text. `targetSelector` picks another target inside the panel, such as
 * an open answer.
 */
export async function isLastTextReachable(
  page: Page,
  panelSel: string,
  targetSelector?: string,
): Promise<boolean> {
  return page.evaluate(
    ({ ps, ts }) => {
      const panel = document.querySelector<HTMLElement>(ps);
      if (!panel) {
        throw new Error(`panel not found: ${ps}`);
      }

      const hasOwnText = (el: Element) =>
        Array.from(el.childNodes).some(
          (n) => n.nodeType === Node.TEXT_NODE && (n.textContent ?? '').trim() !== '',
        );

      const target = ts
        ? panel.querySelector<HTMLElement>(ts)
        : Array.from(panel.querySelectorAll<HTMLElement>('*'))
            .filter((el) => hasOwnText(el) && el.getClientRects().length > 0)
            .at(-1);
      if (!target) {
        throw new Error(`target not found in ${ps}`);
      }

      const header = document.querySelector('header');
      const end = document.documentElement.scrollHeight;

      for (let y = 0; y <= end; y += 40) {
        window.scrollTo({ top: y, behavior: 'instant' });
        const headerBottom = header ? header.getBoundingClientRect().bottom : 0;
        const r = target.getBoundingClientRect();
        if (r.top < headerBottom - 1 || r.bottom > window.innerHeight + 1) {
          continue;
        }
        const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
        if (hit && panel.contains(hit)) {
          return true;
        }
      }
      return false;
    },
    { ps: panelSel, ts: targetSelector },
  );
}
