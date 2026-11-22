/**
 * Seeds the database.
 *
 *   npm run seed          → bootstrap admin + settings, then add the starter
 *                           menu only when no services exist yet
 *   npm run seed:reset    → wipe catalogue records and re-create them
 *
 * The menu lives in `catalogueData.ts` so the same content can also generate
 * the static Pages snapshot without a database.
 */
import mongoose from 'mongoose';
import { connectDatabase, disconnectDatabase } from '../config/database.js';
import { Category } from '../models/category.model.js';
import { GalleryItem } from '../models/galleryItem.model.js';
import { Product } from '../models/product.model.js';
import { Review } from '../models/review.model.js';
import { bootstrap } from './bootstrap.js';
import { categories, gallery, products } from './catalogueData.js';

const reset = process.argv.includes('--reset');

async function main(): Promise<void> {
  await connectDatabase();
  await bootstrap();

  const existing = await Product.countDocuments();
  if (existing > 0 && !reset) {
    console.log(`[seed] ${existing} services already present — menu seed skipped`);
  } else {
    if (reset) {
      await Promise.all([
        Product.deleteMany({}),
        Category.deleteMany({}),
        Review.deleteMany({}),
        GalleryItem.deleteMany({}),
      ]);
      console.log('[seed] catalogue cleared');
    }

    const categoryIds = new Map<string, mongoose.Types.ObjectId>();
    for (const category of categories) {
      const created = await Category.create(category);
      categoryIds.set(category.slug, created._id as mongoose.Types.ObjectId);
    }
    console.log(`[seed] ${categories.length} categories created`);

    for (const product of products) {
      const { categorySlug, ...rest } = product;
      await Product.create({
        ...rest,
        category: categoryIds.get(categorySlug) ?? null,
      });
    }
    console.log(`[seed] ${products.length} services created`);

    await GalleryItem.create(gallery);
    console.log(`[seed] ${gallery.length} gallery images created`);

    console.log('[seed] reviews are left empty — add real guest words in Admin → Reviews');
  }

  await disconnectDatabase();
  console.log('[seed] done');
}

main().catch(async (err) => {
  console.error('[seed] failed', err);
  await disconnectDatabase().catch(() => undefined);
  process.exit(1);
});
