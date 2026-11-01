import type { ImageMetadata } from 'astro';

const metas = import.meta.glob('/src/series/*/serie.json', { eager: true });
const imgs = import.meta.glob<{ default: ImageMetadata }>(
  '/src/series/*/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}',
  { eager: true }
);

export const FORMATOS = ['cover', 'collage', 'strip', 'single', 'mosaic', 'pin', 'ig', 'zara', 'flickr'];

export type Serie = {
  slug: string; titulo: string; anio: string; cedula: string; formato: string; fotos: ImageMetadata[];
};

export function getSeries(): Serie[] {
  return Object.entries(metas)
    .map(([path, mod]) => {
      const slug = path.split('/')[3];
      const d = (mod as any).default ?? {};
      const fotos = Object.entries(imgs)
        .filter(([p]) => p.split('/')[3] === slug)
        .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
        .map(([, m]) => m.default);
      return {
        slug,
        titulo: d.titulo ?? slug,
        anio: String(d.anio ?? ''),
        cedula: d.cedula ?? '',
        formato: FORMATOS.includes(d.formato) ? d.formato : 'cover',
        fotos,
      };
    })
    .sort((a, b) => b.anio.localeCompare(a.anio));
}
