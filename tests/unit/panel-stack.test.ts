import { describe, expect, it } from 'vitest';
import { coverage, scrollTopToShow } from '@/lib/panel-stack';

describe('coverage', () => {
  it('is 0 while the next panel is still at the bottom of the viewport', () => {
    expect(coverage(844, 113, 844)).toBe(0);
  });
  it('is 1 when the next panel has reached the visible top', () => {
    expect(coverage(113, 113, 844)).toBe(1);
  });
  it('is proportional halfway', () => {
    expect(coverage(478.5, 113, 844)).toBeCloseTo(0.5);
  });
  it('stays at 0 below the viewport and at 1 past the top', () => {
    expect(coverage(1200, 113, 844)).toBe(0);
    expect(coverage(-50, 113, 844)).toBe(1);
  });
  it('does not divide by zero when the visible top touches the bottom', () => {
    expect(coverage(100, 844, 844)).toBe(1);
    expect(coverage(900, 844, 844)).toBe(0);
  });
});

describe('scrollTopToShow', () => {
  // a panel that fits: 731px in an 844px viewport with a 113px header
  const fits = { naturalTop: 2000, panelHeight: 731, viewportHeight: 844, stickTop: 113 };
  // a tall panel: 1400px
  const tall = { naturalTop: 2000, panelHeight: 1400, viewportHeight: 844, stickTop: 113 };

  it('brings a panel that fits to its natural place, right below the header', () => {
    expect(scrollTopToShow({ ...fits, offset: 0 })).toBe(1887);
    expect(scrollTopToShow({ ...fits, offset: 500 })).toBe(1887);
  });

  it('in a tall panel, brings the target right below the header, with a margin', () => {
    expect(scrollTopToShow({ ...tall, offset: 300 })).toBe(1887 + 300 - 16);
  });

  it('in a tall panel, never goes past the point where it sticks by its bottom', () => {
    // 1400 − (844 − 113) = 669 of free scrolling inside the panel
    expect(scrollTopToShow({ ...tall, offset: 1350 })).toBe(1887 + 669);
  });

  it("never scrolls above the panel's natural top", () => {
    expect(scrollTopToShow({ ...tall, offset: 5 })).toBe(1887);
  });
});
