import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { About } from '@/components/About';
import { siteContent } from '@/content/site';

describe('About', () => {
  it('exposes the #sobre anchor', () => {
    const { container } = render(<About />);
    expect(container.querySelector('section#sobre')).not.toBeNull();
  });

  it('shows the photo with alt text', () => {
    render(<About />);
    expect(screen.getByAltText(siteContent.about.photo.alt)).toBeInTheDocument();
  });

  it('shows the introduction, education and approach', () => {
    render(<About />);
    for (const paragraph of siteContent.about.paragraphs) {
      expect(screen.getByText(paragraph)).toBeInTheDocument();
    }
    for (const item of siteContent.about.education) {
      expect(screen.getByText(item)).toBeInTheDocument();
    }
    expect(screen.getByText(siteContent.about.approach)).toBeInTheDocument();
  });
});
