const SAMAY_SYSTEM_PROMPT = `You are Samay Raina — Indian stand-up comedian and chess streamer — writing a personalised diss track / rap roast.

VOICE:
The goal is to make the person laugh out loud. Not feel seen. Not feel sad. Laugh.

You are the narrator spitting bars — baffled by this person, not contemptuous. You like them. You just cannot believe this is how things turned out for them. You are always the observer — outside, amused, never cruel.

FORMAT — DISS TRACK:
Write exactly 4 couplets (8 lines total). AABB rhyme scheme — every two consecutive lines rhyme with each other. 4 couplets only — no more.

In each couplet:
- Line 1 is the setup — one specific, vivid detail from their life
- Line 2 is the punchline — the unexpected, slightly absurd angle that makes you laugh

THE RHYME IS THE PUNCHLINE. The surprise of landing a rhyme on an unexpected word IS the joke. The rhyme should force an unexpected connection between two unrelated things — that collision is the comedy. Never rhyme a word with itself or a near-homophone. Find a real rhyme.

GOOD rhyme example (the collision creates the joke):
"Tune kharida gym membership, leke full josh"
"Ab woh card sirf wallet mein karta hai tosh"
(josh → tosh: unexpected, the word collision lands the punchline)

BAD rhyme example (too easy, no surprise):
"Kal se gym pakka, yeh tera plan tha"
"Par gaya nahi tu, yeh toh sab ko pata tha"
(tha → tha: same word, zero surprise, no joke)

LANGUAGE:
Hinglish — Hindi for feelings and situations, English for brand/tech/corporate words. Mix naturally, the way someone actually speaks. Each line: maximum 10 syllables. Short. Punchy. Rappable.

TITLE:
One catchy hook phrase (3–5 words) that captures the person's whole situation + a parenthetical specific subtitle referencing their most embarrassing detail.
Format: "Hook Phrase (feat. Specific Detail)"

DESIGNATION:
An invented LinkedIn title that describes what their profile would say if it were honest about their actual behaviour — not their claimed role. Use · as separator. Max 10 words.

RULES:
- Always use: tu, tera, tune. Never third person about the subject
- Never rhyme a word with itself
- Never end on a question
- Never use | or - as separator instead of ·
- Never explain the joke after landing it
- Never force chess references
- Exactly 4 couplets, exactly 8 lines — no more, no less
- Every observation must be specific to THIS person — never generic enough to apply to anyone
- JSON output only: use the two-character sequence \n for line breaks in bars — never put a real newline character inside a JSON string value
- JSON output only: never put double-quote characters inside string values — use single quotes if quoting is needed`

function buildUserPrompt(name, age, job, city, relationship, recentL, sundayLie) {
  return `Write a diss track / rap roast for this person in Samay Raina's voice. Respond with valid JSON only — no extra text before or after.

Context — who they are:
- Name: ${name}, Age: ${age}
- Job: ${job}
- City: ${city}
- Relationship status: ${relationship || 'not specified'}
- Recent L: ${recentL}
- Sunday night lie they tell themselves: ${sundayLie || 'not specified'}

The Recent L and Sunday lie are your richest material — they have the most specific, vivid feelings. Use them. The rhyme connecting their situation to something unexpected IS the joke.

Return exactly this JSON shape — no other text:
{
  "designation": "<invented ironic LinkedIn title using · as separator, max 10 words>",
  "title": "<catchy hook phrase (feat. specific subtitle)>",
  "bars": "<exactly 4 couplets — lines separated by \\n, couplets separated by \\n\\n, 8 lines total>"
}`
}

// ─── JSON repair ─────────────────────────────────────────────────────────────
// LLMs frequently return malformed JSON. This function fixes the two most
// common failure modes before handing off to JSON.parse:
//   1. Literal newline / tab / carriage-return characters inside string values
//      (JSON spec requires these to be escaped as \n / \t / \r)
//   2. Extra text or markdown fences wrapping the object

function repairJSON(raw) {
  // Strip markdown code fences (```json ... ``` or ``` ... ```)
  let s = raw
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/```\s*$/g, '')
    .trim()

  // Extract the first complete {...} block — ignores any preamble/postamble
  const start = s.indexOf('{')
  const end   = s.lastIndexOf('}')
  if (start === -1 || end === -1) throw new Error('No JSON object in model response')
  s = s.slice(start, end + 1)

  // Walk character-by-character, track whether we are inside a JSON string,
  // and replace any bare control characters with their escape sequences.
  let out      = ''
  let inString = false
  let i        = 0
  while (i < s.length) {
    const ch = s[i]
    // Already-escaped pair — pass through unchanged so we don't double-escape
    if (ch === '\\' && inString) {
      out += ch + (s[i + 1] ?? '')
      i += 2
      continue
    }
    if (ch === '"') {
      inString = !inString
      out += ch
    } else if (inString) {
      if      (ch === '\n') out += '\\n'
      else if (ch === '\r') out += '\\r'
      else if (ch === '\t') out += '\\t'
      else                  out += ch
    } else {
      out += ch
    }
    i++
  }
  return out
}

// ─── LLM adapter ────────────────────────────────────────────────────────────
// To switch providers, only edit callLLM. The prompt, validation, and
// response parsing above/below this function stay untouched.

async function callLLM(systemPrompt, userPrompt) {
  const apiKey = process.env.GEMINI_API_KEY
  const model  = 'gemini-2.5-flash'
  const url    = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: systemPrompt }] },
      contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
      generationConfig: { maxOutputTokens: 3000, temperature: 1, thinkingConfig: { thinkingBudget: 8192 } },
    }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.error?.message || 'Gemini API error')
  }

  return data.candidates?.[0]?.content?.parts?.[0]?.text || '{}'
}

// ─── Handler ─────────────────────────────────────────────────────────────────

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const sanitise = (v, maxLen = 120) =>
    typeof v === 'string' ? v.trim().slice(0, maxLen) : ''

  const name        = sanitise(req.body.name, 60)
  const age         = String(req.body.age ?? '').trim().slice(0, 3)
  const job         = sanitise(req.body.job)
  const city        = sanitise(req.body.city)
  const relationship = sanitise(req.body.relationship)
  const recentL     = sanitise(req.body.recentL)
  const sundayLie   = sanitise(req.body.sundayLie)

  if (!name || !age || !job || !city || !recentL) {
    return res.status(400).json({ error: 'Required fields missing' })
  }

  try {
    const raw    = await callLLM(SAMAY_SYSTEM_PROMPT, buildUserPrompt(name, age, job, city, relationship, recentL, sundayLie))
    const parsed = JSON.parse(repairJSON(raw))

    res.status(200).json({
      title:       parsed.title       ?? '',
      bars:        parsed.bars        ?? '',
      designation: parsed.designation ?? '',
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to generate roast' })
  }
}
