# Farzam Shahzad — Portfolio

Personal portfolio site for an AI/ML engineer, built with React and TypeScript, featuring a 3D
skill-network visualisation and an AI assistant that answers questions about my background.

**Live site:** https://farzam-shahzad.vercel.app

---

## Tech Stack

**Frontend:** React 18 • TypeScript • Vite • GSAP (ScrollSmoother, ScrollTrigger, SplitText)
**3D / Graphics:** Three.js • React Three Fiber • WebGL • Draco compression
**AI Assistant:** Google Gemini API via a Vercel serverless function
**Deployment:** Vercel

---

## Features

- 3D animated character on the landing section, driven by cursor position
- Interactive skill network — 36 skills rendered as nodes on a brain-shaped point cloud,
  grouped into five filterable categories
- Scroll-driven section animations and smooth scrolling via GSAP
- Built-in AI assistant that answers visitor questions about my skills, projects, and experience,
  grounded in a profile context rather than open-ended generation
- Fully responsive, with a dedicated mobile navigation menu

---

## Running Locally

```bash
npm install
npm run dev
```

The AI assistant requires a serverless runtime, so it will not respond under `npm run dev`.
To test it locally, use the Vercel CLI instead:

```bash
npm i -g vercel
vercel dev
```

### Environment Variables

| Variable | Purpose |
| --- | --- |
| `GEMINI_API_KEY` | Google Gemini API key, used server-side by `api/chat.ts` |

Set this in your Vercel project settings (or a local `.env` for `vercel dev`). It is never exposed
to the client — all model calls go through the serverless function.

---

## Project Structure

```
api/                      Vercel serverless functions (AI assistant endpoint)
public/
  models/                 3D character model, HDR environment map
  draco/                  Draco decoder for compressed geometry
  images/                 Static image assets
src/
  components/             Section components (Landing, About, Work, TechStack, Contact, ...)
    Character/            3D avatar scene, loading and animation logic
    styles/               Per-component stylesheets
    utils/                Shared GSAP scroll and text-splitting helpers
  context/                Global loading state
  data/                   Static data (skeleton bone mappings)
```

---

## Credits

The original design and front-end structure of this site is based on the open-source portfolio
template by **Moncy Yohannan** (github.com/MoncyDev), used with credit. The colour system,
typography, navigation, skill-network visualisation, project content, and AI assistant are my own
additions and modifications.

See the LICENSE file for the original template's license terms.

---

## Contact

**Email:** FarzamShahzad27@gmail.com
**GitHub:** github.com/farzamshahzad46
**LinkedIn:** linkedin.com/in/farzam-shahzad-568024283
