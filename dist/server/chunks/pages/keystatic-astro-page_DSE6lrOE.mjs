import { c as createAstro, d as createComponent, r as renderTemplate, e as renderComponent } from '../astro_CavJt305.mjs';
import 'kleur/colors';
import 'html-escaper';

const $$Astro = createAstro();
const prerender = false;
const $$KeystaticAstroPage = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$KeystaticAstroPage;
  return renderTemplate`${renderComponent($$result, "Keystatic", null, { "client:only": "react", "client:component-hydration": "only", "client:component-path": "/workspaces/portfolio-update/node_modules/@keystatic/astro/internal/keystatic-page.js", "client:component-export": "Keystatic" })}`;
}, "/workspaces/portfolio-update/node_modules/@keystatic/astro/internal/keystatic-astro-page.astro", void 0);

const $$file = "/workspaces/portfolio-update/node_modules/@keystatic/astro/internal/keystatic-astro-page.astro";
const $$url = undefined;

export { $$KeystaticAstroPage as default, $$file as file, prerender, $$url as url };
