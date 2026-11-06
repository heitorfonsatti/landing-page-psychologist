import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Services } from '@/components/Services';
import { siteContent } from '@/content/site';

const { services } = siteContent;
const first = services.items[0]!;

function moreButton(title: string) {
  return screen.getByRole('button', { name: `${services.moreLabel} sobre ${title}` });
}

describe('Services', () => {
  it('exposes the #servicos anchor', () => {
    const { container } = render(<Services />);
    expect(container.querySelector('section#servicos')).not.toBeNull();
  });

  it('lists every concern from the content', () => {
    render(<Services />);
    expect(screen.getAllByRole('listitem')).toHaveLength(services.items.length);
    for (const item of services.items) {
      expect(screen.getByText(item.title)).toBeInTheDocument();
    }
  });

  it('has an h2 with the section title', () => {
    render(<Services />);
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(services.title);
  });

  it('gives each topic a "learn more" button named after the topic', () => {
    render(<Services />);
    for (const item of services.items) {
      expect(moreButton(item.title)).toBeInTheDocument();
    }
  });

  it('starts with no topic expanded', () => {
    render(<Services />);
    expect(screen.queryByRole('article')).not.toBeInTheDocument();
    expect(screen.queryByText(first.struggle)).not.toBeInTheDocument();
  });

  it('shows only the chosen topic, with its full explanation, after "learn more"', async () => {
    render(<Services />);
    await userEvent.click(moreButton(first.title));

    const detail = screen.getByRole('article', { name: first.title });
    expect(within(detail).getByText(services.struggleLabel)).toBeInTheDocument();
    expect(within(detail).getByText(first.struggle)).toBeInTheDocument();
    expect(within(detail).getByText(services.supportLabel)).toBeInTheDocument();
    expect(within(detail).getByText(first.support)).toBeInTheDocument();
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });

  it('moves focus to the back button when a topic opens', async () => {
    render(<Services />);
    await userEvent.click(moreButton(first.title));
    expect(screen.getByRole('button', { name: services.backLabel })).toHaveFocus();
  });

  it('brings every topic back and returns focus after "back"', async () => {
    render(<Services />);
    await userEvent.click(moreButton(first.title));
    await userEvent.click(screen.getByRole('button', { name: services.backLabel }));

    expect(screen.queryByRole('article')).not.toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(services.items.length);
    expect(moreButton(first.title)).toHaveFocus();
  });
});
