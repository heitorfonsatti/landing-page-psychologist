import Image from 'next/image';
import { siteContent } from '@/content/site';
import type { SocialLink } from '@/types/content';
import styles from './Footer.module.css';

type Props = {
  /** Only exists for the case of no social network at all: the block is then not rendered. */
  socialLinks?: SocialLink[];
};

export function Footer({ socialLinks = siteContent.socialLinks }: Props) {
  const { fullName, profession, crp, footer } = siteContent;

  return (
    <footer className={styles.footer} data-color="brown">
      <div className={`${styles.inner} container`}>
        <Image className={styles.logo} src="/images/logo-light.png" alt="" width={240} height={215} />

        <div className={styles.identity}>
          <span className={styles.name}>{fullName}</span>
          <span>{profession}</span>
          <span>{`CRP ${crp}`}</span>
        </div>

        {socialLinks.length > 0 && (
          <div>
            <h2 className="visually-hidden">Redes sociais</h2>
            <ul className={styles.socialList}>
              {socialLinks.map((link) => (
                <li key={link.url}>
                  <a
                    className={styles.socialLink}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <p className={styles.emergency}>{footer.emergencyNotice}</p>
        <p className={styles.privacy}>{footer.privacyNotice}</p>
      </div>
    </footer>
  );
}
