import Image from 'next/image';
import { siteContent } from '@/content/site';
import { WhatsAppButton } from './WhatsAppButton';
import styles from './Header.module.css';

/* In page order. "Como funciona" is left out on purpose: it is a short
   step-by-step that the visitor reaches by scrolling, and a fifth link would
   wrap the menu to a third row on phones. */
const LINKS = [
  { label: 'Adultos', href: '#servicos' },
  { label: 'Infantojuvenil', href: '#infantojuvenil' },
  { label: 'Sobre mim', href: '#sobre' },
  { label: 'Dúvidas', href: '#duvidas' },
] as const;

export function Header() {
  return (
    <header className={styles.header}>
      <div className={`${styles.inner} container`}>
        <a className={styles.name} href="#inicio">
          {/* Decorative: the name next to it already labels the link. */}
          <Image className={styles.logo} src="/images/logo.png" alt="" width={240} height={215} priority />
          {siteContent.fullName}
        </a>

        {/* No hamburger menu: on mobile the links wrap to a second row. */}
        <nav className={styles.nav} aria-label="Seções da página">
          <ul className={styles.list}>
            {LINKS.map(({ label, href }) => (
              <li key={href}>
                <a className={styles.link} href={href}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Short label: the full one does not fit next to the name on phones. */}
        <WhatsAppButton className={styles.button} label={siteContent.whatsappShortCta} />
      </div>
    </header>
  );
}
