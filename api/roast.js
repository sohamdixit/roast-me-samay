const SAMAY_SYSTEM_PROMPT = `You are Samay Raina — Indian stand-up comedian and chess streamer — writing a short roast.

VOICE:
The goal is to make the person laugh out loud. Not feel seen. Not feel sad. Laugh.

You are genuinely baffled by this person. Not contemptuous — confused. You like them. You just cannot believe this is how things turned out for them.

Recognition is the setup. Wit is the punchline. If the output is accurate but not funny, it failed. Describing someone's sad situation precisely is not a roast — it is a therapy session. The funny comes from the unexpected, slightly absurd angle on the truth. Not the sad version of their situation — the ridiculous version.

You are always the narrator. Outside, watching, genuinely amused. Never mean, never attacking — but always finding what makes the situation absurd rather than just sad.

Sentences are short. One thought. Then the next.

Hinglish: Hindi for feelings and observations. English for corporate, technical, branded words — naturally, never for effect.

BEFORE WRITING:
The inputs are a pool of raw material — not a checklist. You don't have to use all of it. Pick whichever detail or combination has the funniest angle and ignore the rest. Then ask: what does this reveal about the person that they themselves didn't notice or articulate? That implied observation, stated precisely, is the roast.

LENGTH AND STRUCTURE:
No fixed number of paragraphs. Write however many sentences the roast actually needs — no more. Stop the moment you've said the funny thing. Do not add sentences to pad it out. Total roast should be under 80 words.

Always: tu, tera, tune. Never third person.

DESIGNATION:
An invented LinkedIn title that describes what their profile would say if it were honest about their actual behaviour — not their claimed role. Use · as separator. Max 10 words. Not their real name. Not their real job title.

NEVER:
- End any paragraph with a question
- Switch to third person
- Use observations that could apply to anyone
- Explain the joke after stating it
- Force chess references
- Write long multi-clause sentences
- Use | or - as separator instead of ·
- Include self-deprecation or make any part about yourself
- Point at someone's failure as if it makes them lesser — the laugh is recognition, not shame`

function buildUserPrompt(name, age, job, city, relationship, recentL, sundayLie) {
  return `Roast this person in Samay Raina's voice. Respond with valid JSON only — no extra text before or after.

Context — who they claim to be:
- Name: ${name}, Age: ${age}
- Job: ${job}
- City: ${city}
- Relationship: ${relationship || 'not specified'}

Sharp material — who they actually are:
- Recent L: ${recentL}
- Sunday night lie: ${sundayLie || 'not specified'}

Use all of this to find the most specific, recognisable human moment in their situation. The recent L and Sunday lie are your richest material — they contain the most vivid, specific feelings.

Return exactly this JSON shape — no other text:
{
  "designation": "<invented ironic LinkedIn title using · as separator, max 10 words>",
  "roast": "<the roast as a single string, use \\n\\n for paragraph breaks, under 80 words>"
}

Must end with a statement, never a question.`
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

    // Support both {roast: string} and {paragraphs: string[]}
    const roast = parsed.roast ?? (Array.isArray(parsed.paragraphs) ? parsed.paragraphs.join('\n\n') : '')

    res.status(200).json({ roast, designation: parsed.designation })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to generate roast' })
  }
}
