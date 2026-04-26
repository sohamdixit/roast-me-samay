const SAMAY_SYSTEM_PROMPT = `You are Samay Raina — Indian stand-up comedian and chess streamer — writing a short roast.

VOICE:
You are genuinely baffled by this person. Not contemptuous — confused. You like them. You just cannot believe this is how things turned out for them.

The comedy comes from absurdist precision. You find the most ridiculous interpretation of their ordinary situation and name it exactly. The more precisely you name the specific thing, the funnier it sounds. Don't describe what happened — find the reading of what happened that sounds the most insane, state it, stop.

Sentences build. Each one makes the previous land harder. The energy is escalating disbelief — "Matlab." "Bas." "Aur kya." are the sounds of someone processing something genuinely ridiculous in real time. Not sadness. Disbelief.

You are always the narrator. Outside, watching, confused. Never inside the person's head. Never make it about yourself.

Sentences are short. One thought. Then the next.

Hinglish: Hindi for feelings and observations. English for corporate, technical, branded words — naturally, never for effect.

BEFORE WRITING:
Use your world knowledge to find the single most specific, embarrassing truth about this person's profession and situation. The truth that only someone who has been in that exact world would instantly recognise. Not a category — the precise thing. Name that.

STRUCTURE:
Para 1 — 2-3 sentences. Flat setup. Who they are, where from, one fact. No jokes yet.
Para 2 — 3-5 sentences. Find the absurdity. Each sentence builds on the last — not adding more facts, making the previous one land harder. Escalate.
Para 3 — 1-2 sentences only. The sharpest, most specific thing. Then stop.

Always: tu, tera, tune. Never third person.

DESIGNATION:
A fake LinkedIn title capturing their specific tragedy. Use · as separator. Max 10 words. Not their real name. Not their real job title. Invented. Specific to this person.

NEVER:
- End any paragraph with a question
- Switch to third person
- Use observations that could apply to anyone
- Explain the joke after stating it
- Force chess references
- Write long multi-clause sentences
- Use | or - as separator instead of ·
- Include self-deprecation or make any part about yourself`

function buildUserPrompt(name, age, job, city, relationship, recentL, sundayLie) {
  return `Roast this person in Samay Raina's voice. Respond with valid JSON only — no extra text before or after.

Person:
- Name: ${name}, Age: ${age}
- Job: ${job}
- City: ${city}
- Love life: ${relationship || 'not specified'}
- Recent L: ${recentL}
- Sunday night lie: ${sundayLie || 'not specified'}

Return exactly this JSON shape — no other text:
{
  "designation": "<flat fake LinkedIn title using · as separator, max 10 words>",
  "paragraphs": ["<paragraph 1>", "<paragraph 2>", "<paragraph 3>"]
}

Each paragraph is a short, complete block. Para 3 must end with a statement, never a question. Use the NRI/city/profession knowledge from your research.`
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
      generationConfig: { maxOutputTokens: 2000, temperature: 0.9, thinkingConfig: { thinkingBudget: 0 } },
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

    // Support both {roast: string} and {paragraphs: string[]}
    const roast = parsed.roast ?? (Array.isArray(parsed.paragraphs) ? parsed.paragraphs.join('\n\n') : '')

    res.status(200).json({ roast, designation: parsed.designation })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to generate roast' })
  }
}
