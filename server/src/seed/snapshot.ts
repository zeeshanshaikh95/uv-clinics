/**
 * Writes the static catalogue snapshot that the GitHub Pages build serves.
 *
 *   npm run demo:snapshot
 *
 * GitHub Pages cannot run the Express API, so the preview build reads this
 * file from `/demo/catalogue.json`. Building it straight from the seed data
 * means no database is needed to publish the site — and the snapshot can never
 * drift from the starter menu.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { categories, gallery, products, publicSettings } from './catalogueData.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Resolved from this file so the script can run from either workspace root.
const OUT = path.resolve(__dirname, '../../../client/public/demo/catalogue.json');

const stamp = new Date('2026-01-01T09:00:00.000Z');

/** Deterministic 24-char hex id, so the snapshot is stable between builds. */
function id(prefix: string, index: number): string {
  return `${prefix}${String(index).padStart(22, '0')}`;
}

async function main() {
  const categoryDocs = categories.map((category, index) => ({
    _id: id('c', index + 1),
    ...category,
    productCount: products.filter((product) => product.categorySlug === category.slug).length,
    createdAt: stamp.toISOString(),
    updatedAt: stamp.toISOString(),
  }));

  const productDocs = products.map((product, index) => {
    const category = categoryDocs.find((item) => item.slug === product.categorySlug);
    return {
      _id: id('a', index + 1),
      name: product.name,
      slug: product.slug,
      description: product.description,
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      fabric: product.fabric,
      care: product.care,
      colour: product.colour,
      category: category ? { _id: category._id, name: category.name, slug: category.slug } : null,
      images: product.images,
      variants: product.variants,
      stockStatus: 'in_stock' as const,
      bestseller: product.bestseller,
      featured: product.featured,
      newArrival: product.newArrival,
      seoTitle: '',
      seoDescription: '',
      displayOrder: product.displayOrder,
      archived: false,
      createdAt: stamp.toISOString(),
      updatedAt: stamp.toISOString(),
    };
  });

  const galleryDocs = gallery.map((item, index) => ({
    _id: id('d', index + 1),
    image: item.image,
    caption: item.caption,
    externalUrl: item.externalUrl,
    displayOrder: item.displayOrder,
    active: true,
    createdAt: stamp.toISOString(),
    updatedAt: stamp.toISOString(),
  }));

  const snapshot = {
    generatedAt: new Date().toISOString(),
    settings: publicSettings,
    products: productDocs,
    categories: categoryDocs,
    reviews: [],
    gallery: galleryDocs,
  };

  await mkdir(path.dirname(OUT), { recursive: true });
  await writeFile(OUT, `${JSON.stringify(snapshot, null, 2)}\n`, 'utf8');

  console.log(
    `[demo] wrote ${OUT} — ${productDocs.length} services, ` +
      `${categoryDocs.length} categories, ${galleryDocs.length} gallery images`
  );
}

main().catch((error) => {
  console.error('[demo] failed:', error);
  process.exit(1);
});
