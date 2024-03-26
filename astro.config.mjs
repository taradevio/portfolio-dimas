import { defineConfig } from 'astro/config';
import node from "@astrojs/node";

import react from "@astrojs/react";
import markdoc from "@astrojs/markdoc";
import keystatic from '@keystatic/astro';

// https://astro.build/config
export default defineConfig({
  output: "server",
  adapter: node({
    mode: "standalone"
  }),
  integrations: [react(), markdoc(), keystatic()],
  output: 'hybrid',
});