import { siteContent } from '@/content/site';
import { ServiceTopics } from './ServiceTopics';
import styles from './Services.module.css';

export function Services() {
  const { title, ...topics } = siteContent.services;

  return (
    <section id="servicos" className={`${styles.services} section`} data-panel data-color="brown">
      <div className="container">
        <h2>{title}</h2>
        <ServiceTopics {...topics} />
      </div>
    </section>
  );
}
