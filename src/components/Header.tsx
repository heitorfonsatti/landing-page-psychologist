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
    <header className={styles.cabecalho}>
      <div className={`${styles.interno} conteudo`}>
        <a className={styles.nome} href="#inicio">
          {siteContent.fullName}
        </a>

        {/* Sem menu "hambúrguer": no celular os links descem para a segunda linha. */}
        <nav className={styles.navegacao} aria-label="Seções da página">
          <ul className={styles.lista}>
            {LINKS.map(({ label, href }) => (
              <li key={href}>
                <a className={styles.link} href={href}>
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <WhatsAppButton className={styles.botao} />
      </div>
    </header>
  );
}
