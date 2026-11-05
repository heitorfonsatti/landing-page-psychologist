import { siteContent } from '@/content/site';
import styles from './HowItWorks.module.css';

export function HowItWorks() {
  const { title, steps } = siteContent.howItWorks;

  return (
    <section className={`${styles.comoFunciona} secao`}>
      <div className="conteudo">
        <h2>{title}</h2>

        {/* A numeração grande é decorativa (CSS counter, azul sobre bege,
            3,92:1 — permitido só em texto grande). A ordem é carregada
            pelo <ol>, não pelo número desenhado. */}
        <ol className={styles.lista}>
          {steps.map((passo) => (
            <li key={passo.title} className={styles.passo}>
              <h3 className={styles.passoTitulo}>{passo.title}</h3>
              <p className={styles.passoTexto}>{passo.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
