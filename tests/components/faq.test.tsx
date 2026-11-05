import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Faq } from '@/components/Faq';
import { siteContent } from '@/content/site';

describe('Faq', () => {
  it('expõe a âncora #duvidas', () => {
    const { container } = render(<Faq />);
    expect(container.querySelector('section#duvidas')).not.toBeNull();
  });

  it('usa details/summary nativo para cada pergunta', () => {
    const { container } = render(<Faq />);
    const detalhes = container.querySelectorAll('details');
    expect(detalhes).toHaveLength(siteContent.faq.items.length);
    siteContent.faq.items.forEach((item, i) => {
      expect(detalhes[i]?.querySelector('summary')).toHaveTextContent(item.question);
    });
  });

  it('começa com todas as respostas fechadas', () => {
    const { container } = render(<Faq />);
    expect(container.querySelectorAll('details[open]')).toHaveLength(0);
  });

  it('abre a resposta ao clicar no resumo', async () => {
    const { container } = render(<Faq />);
    await userEvent.click(screen.getByText(siteContent.faq.items[0]!.question));
    expect(container.querySelector('details')).toHaveAttribute('open');
  });

  it('não cita preço na resposta sobre valores', () => {
    render(<Faq />);
    const valores = siteContent.faq.items.find((i) => /valor/i.test(i.question))!;
    expect(valores.answer).not.toMatch(/R\$/i);
    expect(screen.getByText(valores.answer)).toBeInTheDocument();
  });
  it('agrupa as perguntas num acordeão exclusivo', () => {
    const { container } = render(<Faq />);
    const nomes = [...container.querySelectorAll('details')].map((d) => d.getAttribute('name'));
    expect(nomes).toHaveLength(siteContent.faq.items.length);
    expect(new Set(nomes)).toEqual(new Set(['duvidas']));
  });
});
