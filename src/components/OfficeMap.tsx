import map from '@/content/office-map.json';
import type { Office } from '@/types/content';
import { OfficeMapFrame } from './OfficeMapFrame';
import styles from './OfficeMap.module.css';

/**
 * Street map around the office, drawn as an SVG in the panel colors, with a
 * neighbourhood view and a closer view of the block.
 *
 * The streets come from OpenStreetMap, baked once into `office-map.json`
 * (paths in metres around the point the bake was centred on, y pointing
 * south). Nothing loads from a map service at run time: no key, no cookies,
 * no third-party script.
 *
 * To bake again, e.g. after the office moves: run the fx-map `bake.mjs` with
 * the new point and `--w 1600 --h 1100`, keep only `box` and the `green`,
 * `rail`, `path`, `minor`, `street` and `major` paths, and redo the points
 * below (all in metres from the bake's centre).
 */

// The office on Rua Pombas, 70% of the way along its block from Rua Beija-Flor
// (92.96, 66.23) to Rua Condor (-11.54, -8.18), on the street's north-east
// side (8 m off its centre line). The map is drawn shifted so the office sits
// at 0 0, the centre of every view.
const OFFICE = { x: 24.45, y: 7.62 };

const FAR_WIDTH = 906;
const NEAR_WIDTH = 300;

type StreetLabel = { id: string; name: string; d: string };
type Landmark = {
  name: string;
  x: number;
  y: number;
  side: 'right' | 'left' | 'below';
  /** The name broken over lines, where one line would run out of the frame. */
  lines?: string[];
};

// Each name runs along its own street, clear of the pin, its tag and the
// landmarks in the same view. Paths run left to right so the type reads upright.
const FAR_STREETS: StreetLabel[] = [
  { id: 'pombas-far', name: 'Rua Pombas', d: 'M-400 -291 L-200 -146' },
  { id: 'condor-far', name: 'Rua Condor', d: 'M40 -78 L180 -273' },
  { id: 'arapongas-far', name: 'Avenida Arapongas', d: 'M-440 124 L-150 332' },
];

const NEAR_STREETS: StreetLabel[] = [
  { id: 'pombas-near', name: 'Rua Pombas', d: 'M-109.3 -77.8 L-27.8 -19.8' },
  { id: 'condor-near', name: 'Rua Condor', d: 'M3 -28.5 L49.7 -93.5' },
  { id: 'beija-flor-near', name: 'Rua Beija-Flor', d: 'M52.57 123.42 L110.27 41.72' },
];

// Landmarks people in town know, for the neighbourhood view.
const FAR_LANDMARKS: Landmark[] = [
  { name: 'Igreja Matriz', x: -336, y: 116, side: 'right' },
  { name: 'Rodoviária', x: 373, y: -243, side: 'left' },
];

// The clinic's neighbours, placed from the client's description (they are not
// on OpenStreetMap): the real estate office halfway along the clinic's block,
// across Rua Pombas from the clinic; the restaurant on the corner diagonally
// across the Rua Condor and Rua Pombas crossing (the far side of both streets).
const NEAR_LANDMARKS: Landmark[] = [
  // Named to its left, on its own side of Rua Pombas and clear of the
  // Rua Beija-Flor label.
  { name: 'Imobiliária Bertoni', x: 36.07, y: 35.55, side: 'left' },
  {
    name: 'Restaurante Seu30',
    x: -28.27,
    y: -5.37,
    side: 'left',
    lines: ['Restaurante', 'Seu30'],
  },
];

const LAYERS = ['green', 'rail', 'path', 'minor', 'street', 'major'] as const;

function StreetLabels({ labels }: { labels: StreetLabel[] }) {
  return labels.map((label) => (
    <text key={label.id} className={styles.label}>
      <textPath href={`#office-map-${label.id}`} startOffset="50%" textAnchor="middle">
        {label.name}
      </textPath>
    </text>
  ));
}

function Landmarks({ landmarks }: { landmarks: Landmark[] }) {
  return landmarks.map(({ name, x, y, side, lines = [name] }) => {
    const dx = side === 'right' ? '0.75em' : side === 'left' ? '-0.75em' : '-0.4em';
    // A name over two lines is centred on its point, one line below it.
    const firstDy = side === 'below' ? '1.45em' : lines.length > 1 ? '-0.25em' : '0.35em';
    return (
      <g key={name} className={styles.landmark}>
        <circle cx={x} cy={y} />
        <text className={styles.landmarkName} y={y} textAnchor={side === 'left' ? 'end' : 'start'}>
          {lines.map((line, i) => (
            <tspan key={line} x={x} dx={dx} dy={i === 0 ? firstDy : '1.2em'}>
              {/* The space keeps the full name in the text when it is read whole. */}
              {i < lines.length - 1 ? `${line} ` : line}
            </tspan>
          ))}
        </text>
      </g>
    );
  });
}

type Props = { office: Office };

export function OfficeMap({ office }: Props) {
  const streetName = office.street.split(',')[0];

  return (
    <OfficeMapFrame
      farWidth={FAR_WIDTH}
      nearWidth={NEAR_WIDTH}
      label={`Mapa das ruas em volta da ${office.place}, na ${streetName}, ${office.district}, ${office.city}`}
      overlay={
        <div className={styles.pin} aria-hidden="true" data-map-pin>
          <span className={styles.halo} />
          <span className={styles.dot} />
          <span className={styles.tag}>{office.place}</span>
        </div>
      }
    >
      <defs>
        {[...FAR_STREETS, ...NEAR_STREETS].map((label) => (
          <path key={label.id} id={`office-map-${label.id}`} d={label.d} />
        ))}
      </defs>
      <g transform={`translate(${-OFFICE.x} ${-OFFICE.y})`}>
        <rect className={styles.land} x={map.box[0]} y={map.box[1]} width={map.box[2]} height={map.box[3]} />
        {LAYERS.map((layer) =>
          map[layer] ? <path key={layer} className={styles[layer]} d={map[layer]} /> : null,
        )}
        <g className={styles.far}>
          <StreetLabels labels={FAR_STREETS} />
          <Landmarks landmarks={FAR_LANDMARKS} />
        </g>
        <g className={styles.near}>
          <StreetLabels labels={NEAR_STREETS} />
          <Landmarks landmarks={NEAR_LANDMARKS} />
        </g>
      </g>
    </OfficeMapFrame>
  );
}
