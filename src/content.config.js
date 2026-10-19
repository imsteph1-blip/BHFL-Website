/**
 * Tells the site where blog posts live and what each one needs at the top.
 *
 * Posts are plain text files in src/content/blog/. To write a new one, copy an
 * existing file, rename it, and change the bit at the top between the two
 * lines of dashes. The file name becomes the web address, so
 * "senior-pets.md" becomes hefirstloved.com/blog/senior-pets/
 */
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    /** Shown as the headline, and in the list on the blog page. */
    title: z.string(),
    /** One or two sentences, shown under the title in the list. */
    summary: z.string(),
    /** The day it was published, written as YYYY-MM-DD. */
    date: z.date(),
    /** A photo filename from /public/images/photos/, or leave it out. */
    photo: z.string().optional(),
    /** A plain description of that photo, for anyone who cannot see it. */
    photoAlt: z.string().optional(),
    /** true keeps a post hidden while it is still being written. */
    draft: z.boolean().default(false),
  }),
});

export const collections = { blog };
