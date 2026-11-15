import { siteContent } from '@/content/site';
import { ServiceTopics } from './ServiceTopics';
import styles from './Services.module.css';

type Audience = 'adults' | 'children';

/** Anchor and panel color of each audience's section. */
const SECTIONS = {
  adults: { id: 'servicos', color: 'brown' },
  children: { id: 'infantojuvenil', color: 'beige' },
} as const satisfies Record<Audience, { id: string; color: 'beige' | 'brown' }>;

type Props = {
  /** Whose topics the section lists. */
  audience: Audience;
};

/** A "How I can help" section for one audience, with its expandable topics. */
export function Services({ audience }: Props) {
  const { moreLabel, backLabel, supportLabel } = siteContent.services;
  const { eyebrow, title, intro, struggleLabel, items } = siteContent.services[audience];
  const { id, color } = SECTIONS[audience];
  const headingId = `${id}-title`;

  return (
    <section
      id={id}
      className="section"
      aria-labelledby={headingId}
      data-panel
      data-color={color}
    >
      <div className="container">
        <div className={styles.heading}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h2 id={headingId}>{title}</h2>
          {intro && <p className={styles.intro}>{intro}</p>}
        </div>
        <ServiceTopics
          moreLabel={moreLabel}
          backLabel={backLabel}
          struggleLabel={struggleLabel}
          supportLabel={supportLabel}
          items={items}
        />
      </div>
    </section>
  );
}
