import Image from 'next/image';
import { siteContent } from '@/content/site';
import { WhatsAppButton } from './WhatsAppButton';
import styles from './Hero.module.css';

export function Hero() {
  const { fullName, profession, crp, hero } = siteContent;

  return (
    <section className={styles.abertura} data-parte data-cor="bege">
      <div className={`${styles.interno} conteudo`}>
        <div className={styles.texto}>
          <p className={styles.identificacao}>
            <span className={styles.nome}>{fullName}</span>
            <span className={styles.profissao}>{profession}</span>
            <span className={styles.crp}>{`CRP ${crp}`}</span>
          </p>

          <h1>{hero.headline}</h1>

          <p className={styles.modalidade}>{hero.modality}</p>

          <WhatsAppButton />
        </div>

        <div className={styles.retrato}>
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
