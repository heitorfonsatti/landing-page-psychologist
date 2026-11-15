import Image from 'next/image';
import { siteContent } from '@/content/site';
import { WhatsAppButton } from './WhatsAppButton';
import styles from './FinalCta.module.css';

export function FinalCta() {
  return (
    <section className="section" data-panel data-color="beige">
      <div className={`${styles.inner} container`}>
        {/* Beige panel: the brown version of the logo. Decorative. */}
        <Image className={styles.logo} src="/images/logo.png" alt="" width={240} height={215} />
        <h2 className={styles.headline}>{siteContent.finalCta.headline}</h2>
        <WhatsAppButton />
      </div>
    </section>
  );
}
