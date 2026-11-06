import Image from 'next/image';
import { siteContent } from '@/content/site';
import { WhatsAppButton } from './WhatsAppButton';
import styles from './Hero.module.css';

export function Hero() {
  const { fullName, profession, crp, hero } = siteContent;

  return (
    <section className={styles.hero} data-panel data-color="beige">
      <div className={`${styles.inner} container`}>
        <div className={styles.text}>
          <p className={styles.identity}>
            <span className={styles.name}>{fullName}</span>
            <span className={styles.profession}>{profession}</span>
            <span className={styles.crp}>{`CRP ${crp}`}</span>
          </p>

          <h1>{hero.headline}</h1>

          <p className={styles.modality}>{hero.modality}</p>

          <WhatsAppButton />
        </div>

        <div className={styles.portrait}>
          <Image
            src={hero.portrait.src}
            alt={hero.portrait.alt}
            width={hero.portrait.width}
            height={hero.portrait.height}
            priority
            sizes="(min-width: 48rem) 42vw, 100vw"
          />
        </div>
      </div>
    </section>
  );
}
