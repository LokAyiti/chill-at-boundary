# Chill At Boundary — Food Truck Website

🏏 3D cricket-stadium themed menu browser and group order planner for the Chill At Boundary food truck (vegetarian & vegan Indian-fusion street food), Liberty Hill, TX.

## Features

- **3D hero** — night cricket stadium built with Three.js (react-three-fiber): floating ball, stumps, bat, floodlights, orbit controls
- **Menu browser** — all 6 categories (Openers, Anchors, Pinch Hitters, Thirst Quenchers, Tail Enders, Other), with filters for vegetarian / vegan / crowd favorites, primary protein, price range, and search
- **Nutrition panel** — estimated calories, protein, carbs, fat, fiber, sodium per item (editable in `src/data/menu.ts`)
- **Order planner** — Scorecard cart with per-person cost split, side-by-side combo comparison, combo presets, WhatsApp/clipboard share
- **Stripe payments** — prepaid combos + $50 catering deposit via Payment Links (no backend; paste your `buy.stripe.com` URLs in `src/data/payments.ts`)

## Stack

React 19 · TypeScript · Vite 7 · Tailwind CSS 3.4 · shadcn/ui · Three.js / react-three-fiber / drei · lucide-react

## Develop

```bash
npm install
npm run dev
```

## Build

```bash
npm run build   # outputs to dist/
```

## Deploy (free options)

Static site — deploy `dist/` to Cloudflare Pages, Azure Static Web Apps, Netlify, or GitHub Pages. Build command: `npm run build`, output dir: `dist`.

## Content management

- Menu items, prices, nutrition, crowd-favorite flags: `src/data/menu.ts`
- Stripe payment links: `src/data/payments.ts` (⚠️ never put secret API keys here — Payment Links need no keys)
