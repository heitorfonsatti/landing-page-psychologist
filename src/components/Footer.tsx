import { siteContent } from '@/content/site';
import type { SocialLink } from '@/types/content';
import styles from './Footer.module.css';

type Props = {
  /** Existe só para o caso de não haver rede alguma: o bloco então não é renderizado. */
  socialLinks?: SocialLink[];
};

export function Footer({ socialLinks = siteContent.socialLinks }: Props) {
  const { fullName, profession, crp, footer } = siteContent;

  return (
    <footer className={styles.rodape}>
      <div className={`${styles.interno} conteudo`}>
        <div className={styles.identificacao}>
          <span className={styles.nome}>{fullName}</span>
          <span>{profession}</span>
          <span>{`CRP ${crp}`}</span>
        </div>

        {socialLinks.length > 0 && (
          <div className={styles.redes}>
            <h2 className="visualmente-oculto">Redes sociais</h2>
            <ul className={styles.listaRedes}>
              {socialLinks.map((rede) => (
                <li key={rede.url}>
                  <a
                    className={styles.linkRede}
                    href={rede.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {rede.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className={styles.emergencia}>{footer.emergencyNotice}</p>
        <p className={styles.privacidade}>{footer.privacyNotice}</p>
      </div>
    </footer>
  );
}
