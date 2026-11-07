import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Services } from '@/components/Services';
import { siteContent } from '@/content/site';

const { services } = siteContent;
const { adults, children } = services;
const first = adults.items[0]!;

function moreButton(title: string) {
  return screen.getByRole('button', { name: `${services.moreLabel} sobre ${title}` });
}

describe.each([
  ['adults', adults, 'servicos', 'brown'],
  ['children', children, 'infantojuvenil', 'beige'],
] as const)('Services for %s', (audience, group, id, color) => {
  it(`exposes the #${id} anchor on a ${color} panel, named by its title`, () => {
    render(<Services audience={audience} />);
    const section = screen.getByRole('region', { name: group.title });
    expect(section).toHaveAttribute('id', id);
    expect(section).toHaveAttribute('data-color', color);
  });

  it('shows the eyebrow and the h2 with the section title', () => {
    render(<Services audience={audience} />);
    expect(screen.getByText(group.eyebrow)).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent(group.title);
  });

  it('lists every topic of its audience, and only those', () => {
    render(<Services audience={audience} />);
    expect(screen.getAllByRole('listitem')).toHaveLength(group.items.length);
    for (const item of group.items) {
      expect(screen.getByText(item.title)).toBeInTheDocument();
    }
  });

  it('uses the struggle label written for its audience', async () => {
    const topic = group.items[0]!;
    render(<Services audience={audience} />);
    await userEvent.click(moreButton(topic.title));
    expect(screen.getByText(group.struggleLabel)).toBeInTheDocument();
  });
});

describe('Services for children', () => {
  it('shows the intro for parents', () => {
    render(<Services audience="children" />);
    expect(screen.getByText(children.intro!)).toBeInTheDocument();
  });
});

describe('Services topics', () => {

  it('gives each topic a "learn more" button named after the topic', () => {
    render(<Services audience="adults" />);
    for (const item of adults.items) {
      expect(moreButton(item.title)).toBeInTheDocument();
    }
  });

  it('starts with no topic expanded', () => {
    render(<Services audience="adults" />);
    expect(screen.queryByRole('article')).not.toBeInTheDocument();
    expect(screen.queryByText(first.struggle)).not.toBeInTheDocument();
  });

  it('shows only the chosen topic, with its full explanation, after "learn more"', async () => {
    render(<Services audience="adults" />);
    await userEvent.click(moreButton(first.title));

    const detail = screen.getByRole('article', { name: first.title });
    expect(within(detail).getByText(adults.struggleLabel)).toBeInTheDocument();
    expect(within(detail).getByText(first.struggle)).toBeInTheDocument();
    expect(within(detail).getByText(services.supportLabel)).toBeInTheDocument();
    expect(within(detail).getByText(first.support)).toBeInTheDocument();
    expect(screen.queryAllByRole('listitem')).toHaveLength(0);
  });

  it('moves focus to the back button when a topic opens', async () => {
    render(<Services audience="adults" />);
    await userEvent.click(moreButton(first.title));
    expect(screen.getByRole('button', { name: services.backLabel })).toHaveFocus();
  });

  it('brings every topic back and returns focus after "back"', async () => {
    render(<Services audience="adults" />);
    await userEvent.click(moreButton(first.title));
    await userEvent.click(screen.getByRole('button', { name: services.backLabel }));

    expect(screen.queryByRole('article')).not.toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(adults.items.length);
    expect(moreButton(first.title)).toHaveFocus();
  });
});
