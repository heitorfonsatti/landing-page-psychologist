import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { About } from '@/components/About';
import { siteContent } from '@/content/site';

describe('About', () => {
  it('expõe a âncora #sobre', () => {
    const { container } = render(<About />);
    expect(container.querySelector('section#sobre')).not.toBeNull();
  });

  it('mostra a foto com texto alternativo', () => {
    render(<About />);
    expect(screen.getByAltText(siteContent.about.photo.alt)).toBeInTheDocument();
  });

  it('mostra apresentação, formação e abordagem', () => {
    render(<About />);
    for (const p of siteContent.about.paragraphs) {
      expect(screen.getByText(p)).toBeInTheDocument();
    }
    for (const f of siteContent.about.education) {
      expect(screen.getByText(f)).toBeInTheDocument();
    }
    expect(screen.getByText(siteContent.about.approach)).toBeInTheDocument();
  });
});
