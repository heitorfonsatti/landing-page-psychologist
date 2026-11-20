import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Footer } from '@/components/Footer';
import { siteContent } from '@/content/site';

describe('Footer', () => {
  it('shows the full name, "Psicóloga" and the CRP', () => {
    render(<Footer />);
    expect(screen.getByText(siteContent.fullName)).toBeInTheDocument();
    expect(screen.getByText(/Psicóloga/)).toBeInTheDocument();
    expect(screen.getByText(new RegExp(siteContent.crp.replace('/', '\/')))).toBeInTheDocument();
  });

  it('shows the emergency notice with CVV and SAMU', () => {
    render(<Footer />);
    expect(screen.getByText(siteContent.footer.emergencyNotice)).toBeInTheDocument();
  });

  it('shows the privacy notice', () => {
    render(<Footer />);
    expect(screen.getByText(siteContent.footer.privacyNotice)).toBeInTheDocument();
  });

  it('lists the social links from the content', () => {
    render(<Footer />);
    for (const link of siteContent.socialLinks) {
      expect(screen.getByRole('link', { name: link.label })).toHaveAttribute('href', link.url);
    }
  });

  it('shows the office address with street, number, district and city', () => {
    const { container } = render(<Footer />);
    const address = container.querySelector('address');
    expect(address).toHaveTextContent('Rua Pombas, 212');
    expect(address).toHaveTextContent('Centro');
    expect(address).toHaveTextContent('Arapongas');
  });

  it('names the clinic where the office is', () => {
    const { container } = render(<Footer />);
    expect(container.querySelector('address')).toHaveTextContent(siteContent.office.place);
  });

  it('opens the address in Google Maps and in Waze, in a new tab', () => {
    render(<Footer />);
    const google = screen.getByRole('link', { name: /Google Maps/ });
    const waze = screen.getByRole('link', { name: /Waze/ });
    expect(google.getAttribute('href')).toMatch(/^https:\/\/www\.google\.com\/maps\/search\//);
    expect(waze.getAttribute('href')).toMatch(/^https:\/\/waze\.com\/ul\?/);
    for (const link of [google, waze]) {
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    }
  });

  it('draws the street map as a labelled image', () => {
    render(<Footer />);
    const map = screen.getByRole('img', { name: /Rua Pombas/ });
    expect(map.tagName.toLowerCase()).toBe('svg');
    expect(map.querySelectorAll('path').length).toBeGreaterThan(0);
  });

  it('names nearby streets and landmarks on the map, so the spot is easy to recognise', () => {
    render(<Footer />);
    const map = screen.getByRole('img', { name: /Rua Pombas/ });
    for (const name of ['Rua Pombas', 'Rua Condor', 'Avenida Arapongas', 'Igreja Matriz', 'Rodoviária']) {
      expect(map).toHaveTextContent(name);
    }
  });

  it('names the block around the clinic for the closer view', () => {
    render(<Footer />);
    const map = screen.getByRole('img', { name: /Rua Pombas/ });
    for (const name of ['Rua Beija-Flor', 'Imobiliária Bertoni', 'Restaurante Seu30']) {
      expect(map).toHaveTextContent(name);
    }
  });

  it('opens on the neighbourhood and zooms to the block and back with its buttons', async () => {
    const user = userEvent.setup();
    const { container } = render(<Footer />);
    const frame = container.querySelector('[data-zoom]');
    const zoomIn = screen.getByRole('button', { name: /Aproximar/ });
    const zoomOut = screen.getByRole('button', { name: /Afastar/ });

    expect(frame).toHaveAttribute('data-zoom', 'far');
    expect(zoomOut).toBeDisabled();

    await user.click(zoomIn);
    expect(frame).toHaveAttribute('data-zoom', 'near');
    expect(zoomIn).toBeDisabled();
    expect(zoomOut).toBeEnabled();

    await user.click(zoomOut);
    expect(frame).toHaveAttribute('data-zoom', 'far');
  });

  it('labels the pin with the clinic name', () => {
    const { container } = render(<Footer />);
    expect(container.querySelector('[data-map-pin]')).toHaveTextContent(siteContent.office.place);
  });

  it('credits OpenStreetMap for the map data', () => {
    render(<Footer />);
    expect(screen.getByRole('link', { name: /OpenStreetMap/ })).toHaveAttribute(
      'href',
      'https://www.openstreetmap.org/copyright',
    );
  });

  // Review Focus 3
  it('renders neither the list nor its label when there are no social links', () => {
    const { container } = render(<Footer socialLinks={[]} />);
    expect(container.querySelectorAll('ul')).toHaveLength(0);
    expect(screen.queryByText(/redes/i)).not.toBeInTheDocument();
  });
});
