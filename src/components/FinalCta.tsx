import { siteContent } from '@/content/site';
import { WhatsAppButton } from './WhatsAppButton';
import styles from './FinalCta.module.css';

export function FinalCta() {
  return (
    <section className={`${styles.chamada} secao`} data-parte data-cor="azul-escuro">
      <div className={`${styles.interno} conteudo`}>
        <h2 className={styles.frase}>{siteContent.finalCta.headline}</h2>
        <WhatsAppButton variant="claro" />
      </div>
    </section>
  );
}
