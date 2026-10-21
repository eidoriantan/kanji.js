
# Kanji.js Website

[![Website](https://img.shields.io/website?url=https%3A%2F%2Fkanji.js.org)][homepage]

Source of the library's [homepage] and documentation. It's built with
[Vite], [React], [TypeScript] and [Tailwind CSS], and deployed to
[GitHub Pages] by GitHub Actions on every push to this branch.

## Development

```shell
npm install
npm run dev        # start the dev server
npm run build      # typecheck and build to dist/
npm run preview    # serve the built site
```

## Structure

* `src/pages/` – one component per page. Documentation lives in `src/pages/docs/`.
* `src/components/` – layout and shared UI (code blocks, kanji card, docs layout).
* `src/lib/site.ts` – library version, links and figures shown across the site.
  Update `LIB_VERSION` here when a new library version is released.
* `src/index.css` – color tokens for light and dark mode, and docs typography.
* `public/` – files copied as-is: `CNAME`, `404.html` (SPA fallback for GitHub
  Pages), the web manifest, sitemap, fonts and favicon.

## Deployment

`.github/workflows/deploy.yml` builds the site and publishes `dist/`. In the
repository settings, **Pages → Build and deployment → Source** must be set to
**GitHub Actions**.

If you have any suggestions or questions, feel free to file an issue.

[homepage]: https://kanji.js.org
[Vite]: https://vite.dev
[React]: https://react.dev
[TypeScript]: https://www.typescriptlang.org
[Tailwind CSS]: https://tailwindcss.com
[GitHub Pages]: https://pages.github.com
