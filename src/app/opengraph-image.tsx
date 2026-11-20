import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { siteContent } from '@/content/site';

/* The picture shown when the link is shared (WhatsApp, Instagram, search).
   Generated once at build time, in the page's own palette. */

export const alt = `${siteContent.fullName}, ${siteContent.profession}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
// Required by `output: 'export'`: the image is written to `out/` at build time.
export const dynamic = 'force-static';

const BEIGE = '#f2efe2';
const BROWN = '#785135';

export default async function Image() {
  const logo = await readFile(join(process.cwd(), 'public/images/logo.png'));
  const logoSrc = `data:image/png;base64,${logo.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '80px 96px',
          backgroundColor: BEIGE,
          color: BROWN,
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse only renders plain <img>. */}
        <img src={logoSrc} width={134} height={120} alt="" />
        <div style={{ marginTop: 40, fontSize: 76, lineHeight: 1.1 }}>{siteContent.fullName}</div>
        <div style={{ marginTop: 16, fontSize: 36 }}>
          {`${siteContent.profession} · CRP ${siteContent.crp}`}
        </div>
        <div style={{ marginTop: 40, fontSize: 32, maxWidth: 900 }}>{siteContent.hero.modality}</div>
      </div>
    ),
    size,
  );
}
