# Apni Tragedy Batao — Task Checklist

**Last Updated:** 2026-04-25

Legend: `[ ]` todo · `[~]` in progress · `[x]` done · `[!]` blocked

> This file is the single source of truth for task tracking. Update as work progresses.

---

## Phase 0 — Pre-Build (Design Lock-In)

- [x] Read initial brief context (one-shot, now disregarded)
- [x] Install `dev-docs` slash commands from showcase repo
- [x] Create `dev/active/apni-tragedy-batao-mvp/` with plan/context/tasks
- [x] Build HTML mockups (`mockups/index.html`, `01-form`, `02-loading`, `03-roast`, `04-share-card`)
- [x] Refine buffalo plaid CSS to true 4-tone shirt look
- [x] Update color tokens (`--red: #CC2128`, `--black: #0E0808`)
- [x] Redesign share card to editorial masthead layout
- [x] Add `name` + `age` to form scope, summary, roast tag, share card
- [x] Lock `claude-sonnet-4-6` as model
- [x] Add system-prompt rule for natural name address
- [ ] Final visual review — walk through all 4 mockups, sign off
- [ ] Decide site URL for share card footer (currently placeholder `apnitragedy.app`)

## Phase 1 — Scaffold & Tooling

- [ ] **P1.1** `npm create vite@latest . -- --template react`
- [ ] **P1.2** Install `tailwindcss@3 postcss autoprefixer html2canvas`; `npx tailwindcss init -p`
- [ ] **P1.3** Add Google Fonts links (Boogaloo, DM Sans, DM Mono) to `index.html`
- [ ] **P1.4** Port color tokens from `mockups/_shared.css` to `tailwind.config.js`
- [ ] **P1.5** Create `src/styles/globals.css` with `.check-pattern`, `.check-pattern--lg`, `.check-strip`
- [ ] **P1.6** Create empty file skeletons: `src/screens/{Form,Loading,Roast}Screen.jsx`, `src/components/ShareCard.jsx`, `api/roast.js`, `vercel.json`
- [ ] **P1.7** `.gitignore` (node_modules, .env*, dist, .vercel)
- [ ] **P1.8** Verify `npm run dev` boots and Tailwind/fonts/plaid all work

## Phase 2 — Form Screen

- [ ] **P2.1** Define `formData` shape in `App.jsx`: `{ name, age, job, relationship, city, recentL, sundayLie }`
- [ ] **P2.2** Identity block: name (text input, 1–40 chars) + age (number, 16–99). Red focus border per mockup.
- [ ] **P2.3** Build pill-button component (selected = red, unselected = `--black2`)
- [ ] **P2.4** Render 5 question groups in `FormScreen.jsx` per `context.md → Form Questions`
- [ ] **P2.5** Live summary card under questions (includes `name, age` row)
- [ ] **P2.6** CTA validation: enabled only when name + age + Q1 + Q3 + Q4 valid
- [ ] **P2.7** Header: full-bleed `.check-pattern` + light scrim + Boogaloo title + DM Mono subtitle pill
- [ ] **P2.8** Plaid trim footer (`.check-strip`)
- [ ] **P2.9** Side-by-side review against `mockups/01-form.html`

## Phase 3 — Backend Serverless Function

- [ ] **P3.1** Implement `api/roast.js` POST handler per `context.md → API Contract`
- [ ] **P3.2** Embed `SAMAY_SYSTEM_PROMPT` from `context.md` verbatim
- [ ] **P3.3** Implement `buildUserPrompt(name, age, ...)` per `context.md`
- [ ] **P3.4** Input validation: name 1–40, age 16–99, all selectors strings ≤80 chars; 400 on bad
- [ ] **P3.5** `.env.example` with `ANTHROPIC_API_KEY=`
- [ ] **P3.6** Test locally with `vercel dev` + curl
- [ ] **P3.7** Verify 5 different inputs produce on-voice roasts that occasionally use the name

## Phase 4 — Loading + Roast Screens

- [ ] **P4.1** `LoadingScreen.jsx` with 4 rotating messages (1.5s interval) per `context.md → Loading Messages`
- [ ] **P4.2** Red spinner (CSS-only, see `mockups/02-loading.html`)
- [ ] **P4.3** Submit handler in `App.jsx`: form → loading → POST → roast (or error fallback)
- [ ] **P4.4** Error fallback screen ("kuch toh gadbad hai...")
- [ ] **P4.5** `RoastScreen.jsx` — header, personalized tag `tera roast aaya, ${name}`, plaid divider, paragraphs split on `\n\n`
- [ ] **P4.6** "ek aur roast →" button — re-POST with same `formData`
- [ ] **P4.7** "share karo →" button (handler implemented in Phase 5)
- [ ] **P4.8** Side-by-side review against `mockups/02-loading.html` + `mockups/03-roast.html`

## Phase 5 — Share Card + Image Export

- [ ] **P5.1** `ShareCard.jsx` 1080×1080, mounted off-screen via `position: absolute; left: -9999px`
- [ ] **P5.2** Masthead band (280px) — `.check-pattern--lg` + scrim + Boogaloo title + "ROASTED" tag
- [ ] **P5.3** 6px solid black letterbox bar between masthead + body
- [ ] **P5.4** Body section — red eyebrow, Boogaloo `${name}, ${age}` (age in red), red rule, roast paragraphs DM Sans 36px
- [ ] **P5.5** Footer — hairline + profile line + URL + red CTA
- [ ] **P5.6** Wire `html2canvas(node, { scale: 1, width: 1080, height: 1080 })` on share click
- [ ] **P5.7** `await document.fonts.ready` before capture
- [ ] **P5.8** Trigger PNG download via `<a download="apni-tragedy-${name}.png">` blob
- [ ] **P5.9** Visual QA: open exported PNG vs `mockups/04-share-card.html`

## Phase 6 — Deploy

- [ ] **P6.1** `git init`, push to GitHub
- [ ] **P6.2** Link Vercel project (auto-detect Vite)
- [ ] **P6.3** Add `ANTHROPIC_API_KEY` in Vercel env (Production + Preview)
- [ ] **P6.4** Production deploy, capture URL
- [ ] **P6.5** Smoke test prod: full flow + share download on mobile Safari + desktop Chrome
- [ ] **P6.6** Footer disclaimer ("not affiliated with samay raina · built with pyaar")
- [ ] **P6.7** Share with 3 friends for vibe check before broader launch
- [ ] **P6.8** Update share card footer URL from placeholder to actual prod URL

---

## Discovered During Work

*(append new tasks here as they surface)*

---

## Completed This Session

- [x] Initial dev-docs structure
- [x] Built HTML mockups (4 screens)
- [x] Locked design system (colors, plaid CSS, typography, layout patterns)
- [x] Expanded scope to include name + age
- [x] Redesigned share card to editorial masthead layout
- [x] Updated system prompt with rule #11 (occasional name address)
- [x] Saved feedback memory: dev-docs are source of truth
