import Image from 'next/image';
import { siteContent } from '@/content/site';
import { googleMapsUrl, wazeUrl } from '@/lib/office';
import type { SocialLink } from '@/types/content';
import { OfficeMap } from './OfficeMap';
import styles from './Footer.module.css';

type Props = {
  /** Only exists for the case of no social network at all: the block is then not rendered. */
  socialLinks?: SocialLink[];
};

export function Footer({ socialLinks = siteContent.socialLinks }: Props) {
  const { fullName, profession, crp, footer, office } = siteContent;

  return (
    <footer className={styles.footer} data-color="brown">
      <div className={`${styles.inner} container`}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <Image className={styles.logo} src="/images/logo-light.png" alt="" width={240} height={215} />
            <div className={styles.identity}>
              <span className={styles.name}>{fullName}</span>
              <span>{profession}</span>
              <span>{`CRP ${crp}`}</span>
            </div>
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
        </div>

        <div className={styles.office} data-map-group>
          <div className={styles.officeText}>
            <h2 className={styles.officeHeading}>{office.heading}</h2>
            <address className={styles.address}>
              <span className={styles.place}>{office.place}</span>
              <span className={styles.street}>{office.street}</span>
              <span>{`${office.district}, ${office.city} - ${office.state}`}</span>
            </address>
            <p className={styles.note}>{office.note}</p>
            <div className={styles.actions}>
              <a
                className={`${styles.action} ${styles.actionMain}`}
                href={googleMapsUrl(office)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Abrir no Google Maps
              </a>
              <a className={styles.action} href={wazeUrl(office)} target="_blank" rel="noopener noreferrer">
                Abrir no Waze
              </a>
            </div>
          </div>
          <OfficeMap office={office} />
        </div>

        <div className={styles.notes}>
          <p className={styles.emergency}>{footer.emergencyNotice}</p>
          <p className={styles.privacy}>{footer.privacyNotice}</p>
          <p className={styles.credit}>
            Dados do mapa:{' '}
            <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">
              © colaboradores do OpenStreetMap
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
