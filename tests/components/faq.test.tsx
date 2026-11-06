import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Faq } from '@/components/Faq';
import { siteContent } from '@/content/site';

describe('Faq', () => {
  it('exposes the #duvidas anchor', () => {
    const { container } = render(<Faq />);
    expect(container.querySelector('section#duvidas')).not.toBeNull();
  });

  it('uses native details/summary for each question', () => {
    const { container } = render(<Faq />);
    const details = container.querySelectorAll('details');
    expect(details).toHaveLength(siteContent.faq.items.length);
    siteContent.faq.items.forEach((item, i) => {
      expect(details[i]?.querySelector('summary')).toHaveTextContent(item.question);
    });
  });

  it('starts with every answer closed', () => {
    const { container } = render(<Faq />);
    expect(container.querySelectorAll('details[open]')).toHaveLength(0);
  });

  it('opens the answer when the summary is clicked', async () => {
    const { container } = render(<Faq />);
    await userEvent.click(screen.getByText(siteContent.faq.items[0]!.question));
    expect(container.querySelector('details')).toHaveAttribute('open');
  });

  it('does not mention a price in the answer about fees', () => {
    render(<Faq />);
    const fees = siteContent.faq.items.find((i) => /valor/i.test(i.question))!;
    expect(fees.answer).not.toMatch(/R\$/i);
    expect(screen.getByText(fees.answer)).toBeInTheDocument();
  });

  it('groups the questions in an exclusive accordion', () => {
    const { container } = render(<Faq />);
    const names = [...container.querySelectorAll('details')].map((d) => d.getAttribute('name'));
    expect(names).toHaveLength(siteContent.faq.items.length);
    expect(new Set(names)).toEqual(new Set(['faq']));
  });
});
