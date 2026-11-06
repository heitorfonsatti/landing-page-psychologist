import Image from 'next/image';
import { siteContent } from '@/content/site';
import { WhatsAppButton } from './WhatsAppButton';
import styles from './FinalCta.module.css';

export function FinalCta() {
  return (
    <section className="section" data-panel data-color="brown">
      <div className={`${styles.inner} container`}>
        {/* Brown panel: the beige version of the logo. Decorative. */}
        <Image className={styles.logo} src="/images/logo-light.png" alt="" width={240} height={215} />
        <h2 className={styles.headline}>{siteContent.finalCta.headline}</h2>
        <WhatsAppButton variant="light" />
      </div>
    </section>
  );
}
