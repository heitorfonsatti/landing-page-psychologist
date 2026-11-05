import { siteContent } from '@/content/site';
import styles from './Services.module.css';

export function Services() {
  const { title, items } = siteContent.services;

  return (
    <section id="servicos" className={`${styles.servicos} secao`} data-parte data-cor="verde">
      <div className="conteudo">
        <h2>{title}</h2>

        <ul className={styles.lista}>
          {items.map((item) => (
            <li key={item.title} className={styles.item}>
              <h3 className={styles.itemTitulo}>{item.title}</h3>
              <p className={styles.itemTexto}>{item.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
