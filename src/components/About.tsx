import Image from 'next/image';
import { siteContent } from '@/content/site';
import styles from './About.module.css';

export function About() {
  const { title, paragraphs, education, approach, photo } = siteContent.about;

  return (
    <section id="sobre" className={`${styles.sobre} secao`} data-parte data-cor="bege">
      <div className={`${styles.interno} conteudo`}>
        <div className={styles.foto}>
          <Image
            src={photo.src}
            alt={photo.alt}
            width={photo.width}
            height={photo.height}
            sizes="(min-width: 48rem) 38vw, 100vw"
          />
        </div>

        <div className={styles.texto}>
          <h2>{title}</h2>

          {paragraphs.map((paragrafo) => (
            <p key={paragrafo}>{paragrafo}</p>
          ))}

          <h3 className={styles.subtitulo}>Formação</h3>
          <ul className={styles.formacao}>
            {education.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <h3 className={styles.subtitulo}>Abordagem</h3>
          <p className={styles.abordagem}>{approach}</p>
        </div>
      </div>
    </section>
  );
}
