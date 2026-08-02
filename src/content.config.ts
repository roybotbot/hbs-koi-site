import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const fish = defineCollection({
  loader: glob({ base: './src/content/fish', pattern: '**/*.md' }),
  schema: ({ image }) => z.object({
    order: z.number().int().positive(),
    label: z.string(),
    markings: z.string(),
    variety: z.string().nullable(),
    age: z.string().nullable(),
    recordStatus: z.enum(['incomplete', 'verified']),
    image: image(),
    imageAlt: z.string(),
    sourceUrl: z.url(),
    license: z.string(),
    replacementStatus: z.enum(['temporary', 'final']),
  }),
});

export const collections = { fish };
