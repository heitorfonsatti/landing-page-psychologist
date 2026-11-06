import { siteContent } from '@/content/site';
import styles from './Faq.module.css';

export function Faq() {
  const { title, items } = siteContent.faq;

  return (
    <section id="duvidas" className={`${styles.faq} section`} data-panel data-color="beige">
      <div className={`${styles.inner} container`}>
        <h2>{title}</h2>

        {/* Native <details>: opens and closes without JavaScript and is
            keyboard accessible out of the box. The shared `name` makes it an
            exclusive accordion: opening one answer closes the other. */}
        <div className={styles.list}>
          {items.map((item) => (
            <details key={item.question} name="faq" className={styles.item}>
              <summary className={styles.question}>{item.question}</summary>
              <p className={styles.answer}>{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
