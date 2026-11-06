import Image from 'next/image';
import { siteContent } from '@/content/site';
import styles from './About.module.css';

export function About() {
  const { title, paragraphs, education, approach, photo } = siteContent.about;

  return (
    <section id="sobre" className={`${styles.about} section`} data-panel data-color="beige">
      <div className={`${styles.inner} container`}>
        <div className={styles.photo}>
          <Image
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            sizes="(min-width: 48rem) 38vw, 100vw"
          />
        </div>

        <div className={styles.text}>
          <h2>{title}</h2>

          {paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}

          <h3 className={styles.subheading}>Formação</h3>
          <ul className={styles.education}>
            {education.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h3 className={styles.subheading}>Abordagem</h3>
          <p className={styles.approach}>{approach}</p>
        </div>
      </div>
    </section>
  );
}
