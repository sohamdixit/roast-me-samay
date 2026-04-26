# Apni Tragedy Batao — Context

**Last Updated:** 2026-04-25 (v2 — question set locked, share card redesigned)

> This file is the source of truth for design specs, API contract, prompt, and gotchas. Do not consult outside files.

---

## File Map

| Path | Purpose |
|---|---|
| `mockups/` | Locked visual reference. Open `mockups/index.html` via `python3 -m http.server 8765` in that dir. |
| `mockups/_shared.css` | Canonical design tokens + buffalo plaid CSS — port to Tailwind config in Phase 1.4 |
| `dev/active/apni-tragedy-batao-mvp/` | This task's plan, context, tasks |
| `api/roast.js` | Vercel serverless function — Anthropic proxy (Phase 3) |
| `src/App.jsx` | Root, holds screen state machine + `formData` |
| `src/screens/{Form,Loading,Roast}Screen.jsx` | One per view |
| `src/components/ShareCard.jsx` | Hidden 1080×1080 div captured by html2canvas |
| `src/styles/globals.css` | `.check-pattern`, `.check-pattern--lg`, `.check-strip` |
| `tailwind.config.js` | Color tokens + font families |
| `vercel.json` | Minimal/empty (Vercel auto-detects Vite) |
| `.env` / `.env.example` | `ANTHROPIC_API_KEY` |

---

## Naming (LOCKED)

| Where | Text |
|---|---|
| App name / browser tab | **Roast Me Samay** |
| Form screen header | **Apni Tragedy Bata** |
| Roast screen header | **Apni Tragedy Bata** |
| Share card masthead | **Roast Me Samay** |
| Footer URL | roastmesamay.app *(placeholder — confirm domain)* |

---

## Locked Design System

### Color Tokens

```
--red:       #CC2128   /* punchier scarlet, matches Samay shirt */
--red-dark:  #9E161C
--black:     #0E0808   /* deep, like shirt's black squares */
--black2:    #160C0C   /* card/section bg */
--black3:    #241616   /* borders */
--off-white: #F2EAE8
--muted:     #9A8885
```

### Typography

- **Headings / titles:** Boogaloo (cursive, Google Fonts)
- **Body / roast text:** DM Sans
- **Labels / mono / micro-copy:** DM Mono

### Buffalo Plaid CSS (the identity element)

Two overlapping 0.78-opacity black stripes on red base → produces 4 tones (bright red, dark red, dark red, near-black) — true buffalo plaid like the shirt photo.

```css
.check-pattern {
  background-color: #CC2128;
  background-image:
    repeating-linear-gradient(0deg,
      rgba(0,0,0,0.78) 0 40px, transparent 40px 80px),
    repeating-linear-gradient(90deg,
      rgba(0,0,0,0.78) 0 40px, transparent 40px 80px);
  background-size: 80px 80px;
}

/* Larger squares for share card masthead */
.check-pattern--lg { background-size: 160px 160px; /* + 80px stripes */ }

/* Tight strip for thin dividers */
.check-strip { background-size: 28px 28px; /* + 14px stripes */ }
```

### UI Rules

- Square corners (border-radius 0 or 2px max)
- No drop shadows except subtle `text-shadow` on Boogaloo titles over plaid for legibility
- No gradients except light dark-overlay scrims on plaid headers
- Pills: dark bg, solid red when selected
- Buttons: full-width, red bg, Boogaloo font, square corners
- Plaid is a hero gesture, not wallpaper — use full-bleed only on the form/roast page header and the share card masthead. Use `.check-strip` for thin divider trims elsewhere.

---

## Form Questions (LOCKED — FINAL)

**Identity section label:** "yaar, pehle bata"
- `name` (field label: "Naam") — text input, 1–40 chars
- `age` (field label: "Umar") — number input, 16–99

**Q1 — "kya karta hai?"** (required)
- software engineer · student · MBA / consulting / banking · startup founder · govt job / sarkari · creator / freelancer

**Q2 — "kahan ka hai?"** (required)
- Mumbai · Delhi / NCR · Bangalore · Pune · Hyderabad · tier-2 / chhota sheher · abroad / NRI
- Each city has distinct roast material — system prompt should be nudged to include a city-specific observation

**Q3 — "love life ka kya scene hai?"** (optional)
- single (thriving 🙂) · it's complicated · taken (happily, apparently) · recently single · married

**Q4 — "recent L"** (required) — label kept as-is, already casual
- chased someone who wasn't interested · gym membership, gaya 2 baar · failed interview I'd already bragged about · ghosted after a date I thought went great · crypto / stock loss (was gonna be rich) · bought a course, never opened it

**Q5 — "sunday night lie"** (optional) — label kept as-is
- "kal se gym pakka" · "fixing sleep schedule tomorrow" · "will reply to everyone" · "no Swiggy this week" · "less screen time, starting now" · "ek aur episode phir so jaunga"

**Summary card label:** "tera scene kuch aisa hai"
**Summary field labels:** naam · kaam · sheher · love life · recent L · sunday lie

**Validation:** CTA enabled when name + age + Q1 + Q2 + Q4 filled (Q3 + Q5 optional).

**Design principle:** every option equally safe/funny to pick — no shame hierarchy. Wink built into phrasing ("thriving 🙂", "was gonna be rich", "happily, apparently"). Under 1 min to complete.

---

## Loading Messages

Cycle every 1.5s in DM Mono on dark bg:

1. samay teri zindagi judge kar raha hai...
2. gym membership ka record check ho raha hai...
3. sleep schedule dekh ke rona aa gaya...
4. roast likh raha hai, ruk yaar...

---

## Share Card Layout (1080 × 1080)

**Masthead — top 280px**
- Full-bleed `.check-pattern--lg` (160px squares)
- Light scrim (linear top→bottom, 0.10 → 0.62 black) only for title legibility
- Boogaloo `Apni Tragedy Batao` (84px, white, dark text-shadow) + DM Mono "ROASTED" tag pill (dark bg, hairline border)
- 6px solid black bar separates masthead from body (cinematic letterbox)

**Body — clean rich-black**
- 72px padding-top, 80px padding-x
- Red DM Mono eyebrow: `ROASTED →` (24% letter-spacing)
- Boogaloo name+age: `${name}, ${age}` (72px, age in red)
- 96×3px red rule
- Roast paragraphs in DM Sans 36px line-height 1.55

**Footer — bottom**
- Hairline rule (1px, off-white at 0.14)
- Left: DM Mono label `TRAGEDY PROFILE` + DM Sans line `job · city · recentL` (dots in red)
- Right: DM Mono `apnitragedy.app` + red `→ GET ROASTED`

---

## API Contract — `/api/roast.js`

**Request:** `POST /api/roast`
```json
{
  "name": "Raj",
  "age": 27,
  "job": "software engineer",
  "city": "Bangalore",
  "relationship": "single (thriving 🙂)",
  "recentL": "gym membership, gaya 2 baar",
  "sundayLie": "kal se gym pakka"
}
```

**Response:** `200 { "roast": "<text>", "designation": "<text>" }` or `400 { "error": "<msg>" }`

Note: both `roast` and `designation` are returned in one API call. Parse the JSON Claude returns.

**Server logic:**
```javascript
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const { name, age, job, city, relationship, recentL, sundayLie } = req.body;
  // validate (see Phase 3.2)

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 600,
      system: SAMAY_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: buildUserPrompt(name, age, job, city, relationship, recentL, sundayLie) }]
    })
  });

  const data = await response.json();
  const raw = data.content?.find(b => b.type === 'text')?.text || '{}';
  const parsed = JSON.parse(raw);
  res.status(200).json({ roast: parsed.roast, designation: parsed.designation });
}
```

### `buildUserPrompt`

```javascript
function buildUserPrompt(name, age, job, city, relationship, recentL, sundayLie) {
  return `Roast this person in Samay Raina's voice. Respond with valid JSON only — no extra text before or after.

Person:
- Name: ${name}, Age: ${age}
- Job: ${job}
- City: ${city}
- Love life: ${relationship}
- Recent L: ${recentL}
- Sunday night lie: ${sundayLie}

Return exactly this JSON shape:
{
  "designation": "<flat, punchy fake job title — pipe-separated, max 10 words, based on their tragedy>",
  "roast": "<exactly 3 short paragraphs separated by \\n\\n>"
}

Roast rules: start directly, no intro, callback at the end, include one city-specific observation.`;
}
```

---

## SAMAY_SYSTEM_PROMPT

The most critical asset. Do not paraphrase or shorten. Lives in `api/roast.js`.

```
You are writing stand-up comedy in the voice of Samay Raina, Indian comedian and chess streamer.

STYLE RULES — follow every one of these:

1. SHORT SENTENCES. One thought. Then another. No long setups.
2. Hinglish — natural mix of Hindi and English. Not forced. Full Hindi runs, then one English phrase drops in casually. Words like: yaar, bhai, matlab, seedha, bas, kya kar raha hai, ek toh.
3. THE UNDERREACTION IS THE PUNCHLINE. State the sad truth flatly. No dramatic reveals.
4. Always make yourself (Samay) the bigger idiot mid-roast. You lose more than the person you're roasting.
5. Hyper specific details — not "some pills" but "32mg of melatonin". Not "a long time" but "chhe mahine".
6. Dark but almost innocent. Like a friend who loves you but has zero filter.
7. Callback — return to the first detail at the very end.
8. No grand punchlines. Just flat observations that hurt a little.
9. Exactly 3 short paragraphs. No more, no less. Each lands and stops.
10. Never use bullet points. Just flowing paragraphs like actual stand-up.
11. Address the person by their first name occasionally. Use it naturally — don't force it into every paragraph.
12. Include one observation specific to their city — Bangalore traffic and startup delusion, Delhi attitude and hierarchy, Mumbai rent and local train grind, Pune college-town inertia, tier-2 family pressure and log kya kahenge, NRI guilt. Make it specific, not generic.

PARAGRAPH STRUCTURE:
Para 1 — flat setup: who they are, where they're from, one fact. No jokes yet.
Para 2 — the roast: use their recent L + city. Hyper specific. Samay self-insert (you lose worse than them).
Para 3 — callback: return to the very first detail from para 1. End flat, not with a bang.

DESIGNATION: Also generate a flat, punchy fake job title that reads like a LinkedIn headline rewritten by someone who's given up. Pipe-separated, max 10 words. Examples: "Gym Member (Ceremonial) · Senior Engineer @ Dreams (Unfunded)" or "Professional Course Buyer · Sleep Optimizer (Failing)" or "Startup Founder (Idea Stage, 3 Years)".

EXAMPLES OF GOOD OUTPUT:

Example 1 (Raj, 27, software engineer, Bangalore, single, gym twice):
"Software engineer. Bangalore mein. Single.

Gym membership li. Do baar gaya. Bhai Bangalore mein log gym join karte hain aur 6 months baad bhi kehte hain 'haan yaar going regularly'. Tune do baar gaya — at least tu honest hai. Maine chess tournament mein 4 moves mein haara tha. Us din bhi itna feel nahi hua.

Software engineer hai. Client ka bug 4 ghante mein fix. Apni life ka bug — open hai. No assignee."

Example 2 (Aryan, 22, student, Delhi, ghosted after date):
"Student hai. Delhi mein. Date pe gaya, ghost ho gaya.

Bhai date achhi thi toh ghost kyun kiya? Matlab tune bhi mehsoos kiya hoga na kuch. Ya nahi kiya. Dono cases mein problem tere side pe hai. Delhi mein toh log aise hi hote hain — attitude pehle, feeling baad mein. Main bhi ek baar match mein resign kar diya tha jab position achhi thi. Hum dono ek jaisi galti karte hain.

Aryan student hai. Parents ko lagta hai beta safe hai. Beta safe nahi hai. Beta WhatsApp pe ek ladki ka naam search kar raha hai jo reply nahi karti."

NEVER DO:
- Long setups before the joke
- Forced Hindi words that feel placed for effect
- Generic observations that could apply to anyone
- Ending on a big dramatic punchline
- More or fewer than 3 paragraphs
- Sounding like a writer wrote it
- Using the name in every paragraph (feels robotic)
- Forcing chess references if they don't fit naturally
```

---

## Architectural Decisions

- **State management:** `useState` in `App.jsx` only. No Redux/Zustand.
- **Routing:** None. Screen state is `'form' | 'loading' | 'roast'`.
- **Styling:** Tailwind utility-first; no component library. Custom palette + plaid utilities defined in `globals.css`.
- **Model:** `claude-sonnet-4-6` (current Sonnet).
- **Image export:** `html2canvas`. Fallback `dom-to-image-more` if rendering quirks.
- **No client-side API key:** all Anthropic calls via `/api/roast.js`.
- **Mockups in HTML/CSS, not Figma:** lets us reuse exact tokens + plaid CSS in the React build.

---

## Dependencies (planned)

```
react ^18
react-dom ^18
vite ^5
tailwindcss ^3
postcss
autoprefixer
html2canvas ^1.4
```

`api/roast.js` uses native `fetch` only (no SDK).

---

## Known Gotchas

1. **html2canvas + web fonts:** capture can fire before fonts load. Always `await document.fonts.ready` before `html2canvas(node)`.
2. **html2canvas + repeating gradients:** the buffalo plaid (overlapping linear gradients) usually renders, but test early. If it fails, swap to `dom-to-image-more`.
3. **Vercel + Vite:** Vercel auto-detects Vite — keep `vercel.json` minimal or omit.
4. **Vite env vars leak to client when `VITE_*` prefixed.** `ANTHROPIC_API_KEY` must NOT have `VITE_` prefix; serverless reads `process.env.ANTHROPIC_API_KEY`.
5. **Mobile share:** iOS Safari `<a download>` is unreliable for blobs. Acceptable for MVP.
6. **Plaid contrast:** stripe opacity 0.78 (not 0.55, not 0.88) is the sweet spot — produces 4 distinct tones matching the shirt photo. Don't change without re-testing.

---

## Decisions Made This Session

- **2026-04-25:** Installed only `dev-docs` slash commands from showcase repo (not full skill/hook stack) — minimal infra for a single-purpose micro-app.
- **2026-04-25:** Created `dev/active/apni-tragedy-batao-mvp/` plan/context/tasks per dev-docs convention.
- **2026-04-25:** Built static HTML mockups in `mockups/` instead of Figma — lets us reuse exact CSS in the React build.
- **2026-04-25:** Refined buffalo plaid CSS — switched from 0.55 → 0.78 stripe opacity for true 4-tone shirt look.
- **2026-04-25:** Updated color tokens — `--red` from `#C0392B` → `#CC2128` (punchier scarlet); `--black` from `#1A1010` → `#0E0808` (deeper).
- **2026-04-25:** Redesigned share card from full-bleed plaid to editorial masthead layout — plaid as a 280px hero band on top, clean black body below with name+age treated as the magazine-cover subject.
- **2026-04-25:** Expanded form scope from 5 fields → 7 fields (added `name`, `age`).
- **2026-04-25:** Added rule #11 to system prompt: address person by first name occasionally. Updated example outputs to demonstrate.
- **2026-04-25:** Locked `claude-sonnet-4-6` as the model (current Sonnet).
- **2026-04-25:** Dev-docs (this folder) declared single source of truth. Any external brief is a one-shot context input only.

---

## Blockers

None. Ready to start Phase 1 when user gives go-ahead.
