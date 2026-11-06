import { siteContent } from '@/content/site';
import { WhatsAppButton } from './WhatsAppButton';
import styles from './Header.module.css';

const LINKS = [
  { label: 'Sobre mim', href: '#sobre' },
  { label: 'Serviços', href: '#servicos' },
  { label: 'Dúvidas', href: '#duvidas' },
] as const;

export function Header() {
  return (
    <header className={styles.header}>
      <div className={`${styles.inner} container`}>
        <a className={styles.name} href="#inicio">
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

        <WhatsAppButton className={styles.button} />
      </div>
    </header>
  );
}
