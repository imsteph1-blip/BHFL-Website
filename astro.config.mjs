// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://hefirstloved.com',

  // The old contact form has been replaced by the Request Care booking flow.
  // Anyone holding the old link still ends up in the right place.
  redirects: {
    '/contact': '/request-care/',
    '/contact/': '/request-care/',
    // The booking page briefly lived at this address.
    '/request-care.html': '/request-care/',
  },
});
