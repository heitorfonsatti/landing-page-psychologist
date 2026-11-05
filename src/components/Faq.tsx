import { siteContent } from '@/content/site';
import styles from './Faq.module.css';

export function Faq() {
  const { title, items } = siteContent.faq;

  return (
    <section id="duvidas" className={`${styles.duvidas} secao`}>
      <div className={`${styles.interno} conteudo`}>
        <h2>{title}</h2>

        {/* <details> nativo: abre e fecha sem JavaScript, e já vem
            acessível pelo teclado. */}
        <div className={styles.lista}>
          {items.map((item) => (
            <details key={item.question} name="duvidas" className={styles.item}>
              <summary className={styles.pergunta}>{item.question}</summary>
              <p className={styles.resposta}>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
