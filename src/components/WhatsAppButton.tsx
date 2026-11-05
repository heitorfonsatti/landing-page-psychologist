import { siteContent } from '@/content/site';
import { buildWhatsAppLink } from '@/lib/whatsapp';
import styles from './WhatsAppButton.module.css';

type Variante = 'primario' | 'claro';

type Props = {
  /** Texto do botão. Por padrão, o convite definido no conteúdo. */
  label?: string;
  /** `primario`: bege sobre marrom. `claro`: bege com texto marrom, para a chamada final. */
  variant?: Variante;
  className?: string;
};

export function WhatsAppButton({ label, variant = 'primario', className }: Props) {
  const href = buildWhatsAppLink(siteContent.whatsappNumber, siteContent.whatsappMessage);

  return (
    <a
      className={[styles.botao, styles[variant], className].filter(Boolean).join(' ')}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {label ?? siteContent.whatsappCta}
    </a>
  );
}
