import { siteContent } from '@/content/site';
import { buildWhatsAppLink } from '@/lib/whatsapp';
import styles from './WhatsAppButton.module.css';

type Variant = 'primary' | 'light';

type Props = {
  /** Button text. Defaults to the call to action defined in the content. */
  label?: string;
  /** `primary`: beige on brown. `light`: beige with brown text, for the final call to action. */
  variant?: Variant;
  className?: string;
};

export function WhatsAppButton({ label, variant = 'primary', className }: Props) {
  const href = buildWhatsAppLink(siteContent.whatsappNumber, siteContent.whatsappMessage);

  return (
    <a
      className={[styles.button, styles[variant], className].filter(Boolean).join(' ')}
      href={href}
      target="_blank"
      rel="noopener noreferrer"
    >
      {label ?? siteContent.whatsappCta}
    </a>
  );
}
