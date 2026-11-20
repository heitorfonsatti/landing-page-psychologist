import Image from 'next/image';
import { siteContent } from '@/content/site';
import { ServiceTopics, type TopicsLayout } from './ServiceTopics';
import styles from './Services.module.css';

type Audience = 'adults' | 'children';

/**
 * Anchor, panel color and layout of each audience's section. The two
 * sections use different layouts on purpose, so they do not read as copies:
 * adults get a grid of cards; children get a split with the office photo
 * beside a list of topics.
 */
const SECTIONS = {
  adults: { id: 'servicos', color: 'brown', layout: 'cards' },
  children: { id: 'infantojuvenil', color: 'beige', layout: 'list' },
} as const satisfies Record<Audience, { id: string; color: 'beige' | 'brown'; layout: TopicsLayout }>;

type Props = {
  /** Whose topics the section lists. */
  audience: Audience;
};

/** A "How I can help" section for one audience, with its expandable topics. */
export function Services({ audience }: Props) {
  const { moreLabel, backLabel, supportLabel } = siteContent.services;
  const { eyebrow, title, intro, struggleLabel, items, photo } = siteContent.services[audience];
  const { id, color, layout } = SECTIONS[audience];
  const headingId = `${id}-title`;
  const split = layout === 'list';

  return (
    <section
      id={id}
      className="section"
      aria-labelledby={headingId}
      data-panel
      data-color={color}
    >
      <div className={split ? `${styles.split} container` : 'container'}>
        <div className={styles.heading}>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h2 id={headingId}>{title}</h2>
          {intro && <p className={styles.intro}>{intro}</p>}
        </div>
        {split && photo && (
          <div className={styles.photo}>
            <Image
              src={photo.src}
              alt={photo.alt}
              width={photo.width}
              height={photo.height}
              sizes="(min-width: 64rem) 38vw, 100vw"
            />
          </div>
        )}
        <div className={styles.topics}>
          <ServiceTopics
            layout={layout}
            moreLabel={moreLabel}
            backLabel={backLabel}
            struggleLabel={struggleLabel}
            supportLabel={supportLabel}
            items={items}
          />
        </div>
      </div>
    </section>
  );
}
