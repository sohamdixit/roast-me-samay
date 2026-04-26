# Apni Tragedy Batao — MVP Plan

**Last Updated:** 2026-04-25

> This file (plus context.md and tasks.md in the same folder) is the single source of truth for this project. Do not consult outside spec files.

---

## Executive Summary

Single-page React web app where a user fills in their name, age, and 5 multiple-choice questions, then receives a 4-paragraph stand-up roast in the voice of Samay Raina. Output is rendered on screen and exportable as a 1080×1080 PNG share card styled like a magazine feature on the user.

**Roast voice:** flat, dry, Hinglish, dark, self-deprecating Samay-as-narrator. See `context.md → SAMAY_SYSTEM_PROMPT` for the full prompt — do not paraphrase.

**Out of scope for MVP:** auth, accounts, persistence, analytics, rate limiting, multi-language, mobile apps, social-auto-share, leaderboards.

---

## Current State

- Mockups locked for visual design (see `mockups/` directory). Four screens: form, loading, roast, share card. Real Google Fonts + real buffalo-plaid CSS, served via `python3 -m http.server 8765`.
- Color tokens, plaid CSS, and component patterns finalized — see `context.md → Locked Design System`.
- Form scope expanded from 5 fields → **7 fields**: name, age, + 5 pill questions.
- No `package.json`, no source code, no Vercel link yet.
- `.claude/commands/dev-docs.md` and `dev-docs-update.md` installed.

---

## Target State

A Vite-bundled React SPA, Tailwind-styled, three view states managed by `useState` in `App.jsx`:

1. **Form** — identity inputs (name, age) + five pill-button questions + live summary card + CTA
2. **Loading** — full-screen with rotating Hinglish messages + red spinner
3. **Roast** — personalized header (`tera roast aaya, [name]`), 4 paragraphs, share + regenerate buttons

A single Vercel serverless route (`/api/roast.js`) proxies to Anthropic's Messages API. Share card rendered as a hidden 1080×1080 DOM node, exported as PNG via `html2canvas`.

Visual identity is the Samay buffalo-plaid shirt — see `context.md → Locked Design System` for exact CSS.

---

## Implementation Phases

### Phase 1 — Scaffold & Tooling

Goal: project boots, dev server runs, Tailwind compiles, fonts load, design tokens wired.

1. **P1.1** — `npm create vite@latest . -- --template react`. **AC:** `npm run dev` serves a default page. **Effort:** S
2. **P1.2** — Install runtime deps: `tailwindcss@3 postcss autoprefixer html2canvas`. Init Tailwind config. **AC:** Tailwind utilities work. **Effort:** S
3. **P1.3** — Add Google Fonts (Boogaloo, DM Sans, DM Mono) to `index.html`. Configure Tailwind `theme.extend.fontFamily`. **AC:** All three fonts render. **Effort:** S
4. **P1.4** — Port locked design tokens from `mockups/_shared.css` into `tailwind.config.js` `theme.extend.colors` + `globals.css` for `.check-pattern`, `.check-pattern--lg`, `.check-strip` utilities. **AC:** Test page matches mockup palette and patterns. **Effort:** S
5. **P1.5** — Create file skeletons: `src/screens/{FormScreen,LoadingScreen,RoastScreen}.jsx`, `src/components/ShareCard.jsx`, `api/roast.js`, `vercel.json`. **AC:** All paths exist, import without error. **Effort:** S

**Risks:** Tailwind v4 PostCSS plugin friction — pin to v3.

---

### Phase 2 — Form Screen

Goal: user fills in name/age + 5 questions, sees live summary, clicks CTA.

1. **P2.1** — `App.jsx` holds `formData = { name, age, job, relationship, city, recentL, sundayLie }` and `screen` state. **Effort:** S
2. **P2.2** — Identity block at top: text input (name, required, 1+ chars) + number input (age, required, 16–99). Style per mockup: dark input, red focus border. **AC:** Validation on blur + submit. **Effort:** M
3. **P2.3** — Five pill-question groups per `context.md → Form Questions`. Selected pill = solid red. **Effort:** M
4. **P2.4** — Live summary card under the questions reflecting current selections (including `name, age` row). **Effort:** S
5. **P2.5** — CTA button (`Roast Karo Yaar →`), enabled only when name + age + Q1 + Q3 + Q4 are valid. Disabled state: muted. **Effort:** S
6. **P2.6** — Header with full-bleed `.check-pattern` + light overlay + Boogaloo title + DM Mono subtitle. **Effort:** S

**Dependencies:** Phase 1.

---

### Phase 3 — Backend Serverless Function

Goal: `/api/roast` accepts POST with 7 fields and returns Claude-generated text.

1. **P3.1** — Implement `api/roast.js` per `context.md → API Contract`. Embed `SAMAY_SYSTEM_PROMPT` and `buildUserPrompt(name, age, job, relationship, city, recentL, sundayLie)` from context.md verbatim. **AC:** `curl` against `vercel dev` returns roast text. **Effort:** M
2. **P3.2** — Input validation: required fields present, name length 1–40, age 16–99, all selectors are strings ≤80 chars. Return 400 on invalid. **Effort:** S
3. **P3.3** — Pick model: default `claude-sonnet-4-6`. Document in context.md if changed. **Effort:** S
4. **P3.4** — `.env.example` documenting `ANTHROPIC_API_KEY`. Add `.env*` to `.gitignore`. **AC:** Key not committed. **Effort:** S

**Risks:** Anthropic auth/rate; CORS not needed (same-origin).

---

### Phase 4 — Loading + Roast Screens

Goal: end-to-end flow — submit form, see loading, see personalized roast.

1. **P4.1** — `LoadingScreen.jsx` — full-screen, red spinner, 4 rotating Hinglish messages cycling every 1.5s (see `context.md → Loading Messages`). DM Mono. **Effort:** S
2. **P4.2** — `App.jsx` submit handler: form → loading state → POST `/api/roast` → on success store `{ roast, formData }` and switch to roast state. Generic error fallback ("kuch toh gadbad hai..."). **Effort:** M
3. **P4.3** — `RoastScreen.jsx`: header, personalized tag (`tera roast aaya, ${name}`), `.check-strip` divider, paragraphs split on `\n\n` in DM Sans 17px line-height 1.7. **Effort:** S
4. **P4.4** — Buttons: "share karo →" (CTA, primary) + "ek aur roast →" (secondary outlined). Re-roast re-POSTs with same `formData`. **Effort:** S

**Dependencies:** Phases 2 + 3.

---

### Phase 5 — Share Card + Image Export

Goal: user clicks "share karo", gets a 1080×1080 PNG download.

1. **P5.1** — `ShareCard.jsx` — 1080×1080, mounted off-screen (`position: absolute; left: -9999px`). Layout per `context.md → Share Card Layout`:
   - **Masthead** (280px, `.check-pattern--lg`, light scrim, Boogaloo title + "roasted" tag)
   - **Body** (clean black: red eyebrow `ROASTED →`, Boogaloo `${name}, ${age}` with age in red, thin red rule, roast paragraphs DM Sans 36px)
   - **Footer** (hairline rule, profile line `job · city · recentL`, URL + red CTA on right)
   **Effort:** M
2. **P5.2** — Wire `html2canvas(node, { scale: 1, width: 1080, height: 1080 })` on share click. Trigger download via `<a download="apni-tragedy-${name}.png">` blob URL. **Effort:** M
3. **P5.3** — `await document.fonts.ready` before capture (font race). **AC:** PNG has correct fonts. **Effort:** S
4. **P5.4** — Visual QA: open exported PNG, compare to `mockups/04-share-card.html`. **Effort:** S

**Risks:** html2canvas + complex CSS gradients; if rendering differs from DOM, fall back to `dom-to-image-more`.

---

### Phase 6 — Deploy

1. **P6.1** — Init git, push to GitHub. **Effort:** S
2. **P6.2** — Link Vercel project, accept Vite auto-detect. **Effort:** S
3. **P6.3** — Add `ANTHROPIC_API_KEY` in Vercel dashboard env vars (Production + Preview). **Effort:** S
4. **P6.4** — Production deploy + smoke test: full happy path on mobile Safari + desktop Chrome. **Effort:** S
5. **P6.5** — Footer disclaimer: "not affiliated with samay raina · built with pyaar". **Effort:** S

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Roast quality off-brand | M | H | System prompt locked verbatim; test 10+ inputs before ship; consider tweaking prompt to address by name |
| html2canvas rendering quirks (gradients/fonts) | M | M | Test early in Phase 5; fallback `dom-to-image-more` |
| API key leaked to client | L | H | Only via serverless env var; never `VITE_*` prefix |
| Anthropic cost spike from abuse | L | M | MVP: no rate limiting. Post-MVP: IP throttle if traffic |
| Samay/likeness pushback | L | M | Disclaimer in footer; parody framing; remove if requested |
| Mobile share UX (iOS download) | H | M | Accept for MVP; consider Web Share API + files post-launch |

---

## Success Metrics

- All 6 phases complete; happy path works on prod URL
- 8/10 test inputs produce roasts that hit ≥3 of the 10 voice rules
- First roast returns in <8s p95; share-card PNG export <2s
- Side-by-side visual review of built screens vs. `mockups/` matches

---

## Resources & Dependencies

- Anthropic API key with Sonnet access
- Vercel account
- GitHub repo
- Node 18+
- ~5 hours focused dev

---

## Timeline Estimates

- Phase 1: 30 min
- Phase 2: 1.5 hr (added identity inputs)
- Phase 3: 45 min
- Phase 4: 1 hr
- Phase 5: 1.5 hr
- Phase 6: 30 min
- **Total: ~5.5 hours**

---

## Open Decisions

1. **Site URL on share card:** placeholder `apnitragedy.app`. Confirm domain or use Vercel URL.
2. **Analytics:** none / Plausible / PostHog. Recommend none for MVP.
3. **Should the system prompt explicitly use `${name}`** in the address (e.g., "Raj, bhai...")? Currently the prompt examples don't address by name. Recommend a small prompt nudge in Phase 3.
