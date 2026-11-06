/**
 * How much of a stack panel the next panel has already covered, from 0 to 1.
 *
 * Coverage starts when the top of the next panel appears at the bottom of the
 * viewport and ends when it reaches the visible top of the current panel.
 *
 * @param nextTop top of the next panel, relative to the viewport, in px.
 * @param currentVisibleTop visible top of the current panel: the larger of
 *   its top and the fixed header height, in px.
 * @param viewportHeight viewport height, in px.
 */
export function coverage(nextTop: number, currentVisibleTop: number, viewportHeight: number): number {
  const travel = viewportHeight - currentVisibleTop;
  if (travel <= 0) {
    return nextTop <= currentVisibleTop ? 1 : 0;
  }
  const fraction = (viewportHeight - nextTop) / travel;
  return Math.min(1, Math.max(0, fraction));
}

/** Input for computing where to scroll to show a point inside a panel. */
export type StackTarget = {
  /** Top of the panel in the document, where it would be without sticking, in px. */
  naturalTop: number;
  /** Panel height, in px. */
  panelHeight: number;
  /** Distance from the target to the top of the panel, in px (0 for the panel itself). */
  offset: number;
  /** Viewport height, in px. */
  viewportHeight: number;
  /** Fixed header height, which is where panels stick, in px. */
  stickTop: number;
  /** Room left above the target, in px. */
  margin?: number;
};

/**
 * Scroll position that shows a target inside a stack panel, with the panel
 * uncovered.
 *
 * On its own, the browser scrolls to the *current* position of a stuck panel,
 * which is already inside the viewport (just covered), so it does not scroll.
 * This computes from the natural position instead: the panel starts right
 * below the header and, if it is taller than the viewport, scrolls internally
 * up to the point where it sticks by its bottom, never past it, so the next
 * panel does not cover it.
 */
export function scrollTopToShow({
  naturalTop,
  panelHeight,
  offset,
  viewportHeight,
  stickTop,
  margin = 16,
}: StackTarget): number {
  const start = naturalTop - stickTop;
  const innerSlack = Math.max(0, panelHeight - (viewportHeight - stickTop));
  const inside = Math.min(innerSlack, Math.max(0, offset - margin));
  return start + inside;
}
