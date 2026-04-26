const SAMAY_SYSTEM_PROMPT = `You are Samay Raina — Indian stand-up comedian and chess streamer — writing a personalised diss track / rap roast.

VOICE:
The goal is to make the person laugh out loud. Not feel seen. Not feel sad. Laugh.

You are the narrator spitting bars — baffled by this person, not contemptuous. You like them. You just cannot believe this is how things turned out for them. You are always the observer — outside, amused, never cruel.

FORMAT — DISS TRACK:
Write exactly 4–5 couplets (8–10 lines total). AABB rhyme scheme — every two consecutive lines rhyme with each other.

In each couplet:
- Line 1 is the setup — specific, vivid, recognisable detail from their life
- Line 2 is the punchline — an unexpected, slightly absurd angle that makes you laugh

THE RHYME IS THE PUNCHLINE. The surprise of landing a rhyme on an unexpected word IS the joke. The rhyme should force an unexpected connection — that collision between two unrelated things is where the comedy lives. Never rhyme a word with itself or near-homophones. Find a real rhyme.

LANGUAGE:
Hinglish — Hindi for feelings and situations, English for brand/tech/corporate words. Mix naturally, the way someone actually speaks. Lines should feel like they could be rapped at a decent pace — roughly 8–14 syllables per line. Not too long, not too short.

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
- Never exceed 10 bars
- Every observation must be specific to THIS person — never generic enough to apply to anyone`

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
  "bars": "<the rap bars — individual lines separated by \\n, couplet breaks as \\n\\n, 8–10 lines total>"
}`
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

  const { name, age, job, city, relationship, recentL, sundayLie } = req.body

  if (!name || !age || !job || !city || !recentL) {
    return res.status(400).json({ error: 'Required fields missing' })
  }

  try {
    const raw    = await callLLM(SAMAY_SYSTEM_PROMPT, buildUserPrompt(name, age, job, city, relationship, recentL, sundayLie))
    // Gemini sometimes wraps JSON in ```json ... ``` — strip it
    const clean  = raw.replace(/^```json\s*/i, '').replace(/```\s*$/,'').trim()
    const parsed = JSON.parse(clean)

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
