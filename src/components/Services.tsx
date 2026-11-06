import { siteContent } from '@/content/site';
import styles from './Services.module.css';

export function Services() {
  const { title, items } = siteContent.services;

  return (
    <section id="servicos" className={`${styles.services} section`} data-panel data-color="green">
      <div className="container">
        <h2>{title}</h2>

        <ul className={styles.list}>
          {items.map((item) => (
            <li key={item.title} className={styles.item}>
              <h3 className={styles.itemTitle}>{item.title}</h3>
              <p className={styles.itemText}>{item.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
