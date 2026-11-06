import { siteContent } from '@/content/site';
import { WhatsAppButton } from './WhatsAppButton';
import styles from './FinalCta.module.css';

export function FinalCta() {
  return (
    <section className={`${styles.finalCta} section`} data-panel data-color="dark-blue">
      <div className={`${styles.inner} container`}>
        <h2 className={styles.headline}>{siteContent.finalCta.headline}</h2>
        <WhatsAppButton variant="light" />
      </div>
    </section>
  );
}
