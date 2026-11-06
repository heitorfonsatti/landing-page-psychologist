import { siteContent } from '@/content/site';
import styles from './HowItWorks.module.css';

export function HowItWorks() {
  const { title, steps } = siteContent.howItWorks;

  return (
    <section className={`${styles.howItWorks} section`} data-panel data-color="beige">
      <div className="container">
        <h2>{title}</h2>

        {/* The large numbers are decorative (CSS counter, blue on beige,
            3.92:1, allowed for large text only). The order is carried by
            the <ol>, not by the drawn number. */}
        <ol className={styles.list}>
          {steps.map((step) => (
            <li key={step.title} className={styles.step}>
              <h3 className={styles.stepTitle}>{step.title}</h3>
              <p className={styles.stepText}>{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
