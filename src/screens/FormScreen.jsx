import { useState } from 'react'

const JOBS = [
  'software engineer', 'student', 'MBA / consulting / banking', 'startup founder',
  'govt job / sarkari', 'creator / freelancer', 'doctor / CA / lawyer',
  'teacher / professor', 'sales / marketing', 'HR (uff yaar)',
]
const CITIES = [
  'Mumbai', 'Delhi / NCR', 'Bangalore', 'Pune', 'Hyderabad',
  'Chennai', 'Kolkata', 'Jaipur / Chandigarh', 'tier-2 / chhota sheher', 'abroad / NRI',
]
const RELATIONSHIPS = ['single (thriving 🙂)', "it's complicated", 'taken (happily, apparently)', 'recently single', 'married']
const RECENT_LS = [
  "chased someone who wasn't interested",
  'gym membership, gaya 2 baar',
  "failed interview I'd already bragged about",
  'ghosted after a date I thought went great',
  'crypto / stock loss (was gonna be rich)',
  'bought a course, never opened it',
  '"kal pakka" — nahi gaya',
  'started a business, made a logo, stopped',
  'spent 3 hours on LinkedIn, felt worse',
  'watched reels till 3am, regretted it',
]
const SUNDAY_LIES = [
  '"kal se gym pakka"', '"fixing sleep schedule tomorrow"',
  '"will reply to everyone"', '"no Swiggy this week"',
  '"less screen time, starting now"', '"ek aur episode phir so jate hain"',
]

function PillGroup({ options, value, onChange, placeholder }) {
  const [custom, setCustom] = useState('')
  const isCustomSelected = value && !options.includes(value)

  function selectPill(opt) {
    setCustom('')
    onChange(opt === value ? '' : opt)
  }

  function handleCustomChange(e) {
    setCustom(e.target.value)
    onChange(e.target.value)
  }

  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button
          key={opt}
          type="button"
          onClick={() => selectPill(opt)}
          className={`pill ${value === opt ? 'pill--selected' : ''}`}
        >
          {opt}
        </button>
      ))}
      <input
        type="text"
        value={isCustomSelected ? value : custom}
        onChange={handleCustomChange}
        placeholder={placeholder}
        className={`pill pill--input ${isCustomSelected ? 'pill--selected' : ''}`}
      />
    </div>
  )
}

export default function FormScreen({ onSubmit, error, initialData }) {
  const [name, setName] = useState(initialData.name)
  const [age, setAge] = useState(initialData.age)
  const [job, setJob] = useState(initialData.job)
  const [city, setCity] = useState(initialData.city)
  const [relationship, setRelationship] = useState(initialData.relationship)
  const [recentL, setRecentL] = useState(initialData.recentL)
  const [sundayLie, setSundayLie] = useState(initialData.sundayLie)

  const canSubmit = name.trim() && age && job && city && recentL

  const summary = [
    { k: 'naam', v: name && age ? `${name}, ${age}` : null },
    { k: 'kaam', v: job || null },
    { k: 'sheher', v: city || null },
    { k: 'love life', v: relationship || null },
    { k: 'recent L', v: recentL || null },
    { k: 'sunday lie', v: sundayLie || null },
  ]

  function handleSubmit(e) {
    e.preventDefault()
    if (!canSubmit) return
    onSubmit({ name: name.trim(), age: parseInt(age), job, city, relationship, recentL, sundayLie })
  }

  return (
    <div className="screen">
      {/* Header */}
      <header className="relative overflow-hidden border-b-4 border-black" style={{ padding: '40px 24px 36px' }}>
        <div className="check-pattern absolute inset-0" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(26,16,16,0.10) 0%, rgba(26,16,16,0.45) 100%)' }} />
        <div className="relative z-10">
          <h1 className="font-heading text-5xl text-off-white leading-none" style={{ textShadow: '0 2px 0 rgba(0,0,0,0.55)' }}>
            Apni Tragedy Bata
          </h1>
          <div className="inline-block font-mono text-xs text-off-white mt-3" style={{ background: 'rgba(26,16,16,0.78)', padding: '4px 8px' }}>
            fill in. get destroyed. share with enemies.
          </div>
        </div>
      </header>

      {/* Identity */}
      <section className="border-b border-black3" style={{ padding: '24px', background: '#160C0C' }}>
        <div className="font-mono text-xs text-muted uppercase tracking-widest mb-4">yaar, pehle bata</div>
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="field-label">Naam</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="apna naam"
              maxLength={40}
              className="text-input"
            />
          </div>
          <div style={{ flex: '0 0 100px' }}>
            <label className="field-label">Umar</label>
            <input
              type="number"
              value={age}
              onChange={e => setAge(e.target.value)}
              min={16}
              max={99}
              className="text-input"
            />
          </div>
        </div>
      </section>

      {/* Q1 */}
      <section className="q-block">
        <div className="q-label">kya karte ho?</div>
        <PillGroup options={JOBS} value={job} onChange={setJob} placeholder="ya kuch aur..." />
      </section>

      {/* Q2 */}
      <section className="q-block">
        <div className="q-label">kahan se ho?</div>
        <PillGroup options={CITIES} value={city} onChange={setCity} placeholder="ya kahin aur..." />
      </section>

      {/* Q3 */}
      <section className="q-block">
        <div className="q-label">love life ka kya scene hai? <span className="text-muted">(optional)</span></div>
        <PillGroup options={RELATIONSHIPS} value={relationship} onChange={setRelationship} placeholder="ya kuch aur..." />
      </section>

      {/* Q4 */}
      <section className="q-block">
        <div className="q-label">recent L</div>
        <PillGroup options={RECENT_LS} value={recentL} onChange={setRecentL} placeholder="ya kuch aur..." />
      </section>

      {/* Q5 */}
      <section className="q-block">
        <div className="q-label">sunday night lie <span className="text-muted">(optional)</span></div>
        <PillGroup options={SUNDAY_LIES} value={sundayLie} onChange={setSundayLie} placeholder="ya apni wali..." />
      </section>

      {/* Summary */}
      <div style={{ margin: '0 24px 24px' }}>
        <div className="summary">
          <div className="summary-title">tera scene kuch aisa hai</div>
          {summary.map(({ k, v }) => (
            <div key={k} className="summary-row">
              <span className="summary-key">{k}</span>
              <span className={`summary-val ${!v ? 'text-black3 italic' : ''}`}>{v || '—'}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mx-6 mb-4 p-3 border border-red font-mono text-xs" style={{ color: '#CC2128' }}>
          {error}
        </div>
      )}

      {/* CTA */}
      <div style={{ padding: '0 24px 24px' }}>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="cta"
        >
          Roast Karo Yaar →
        </button>
      </div>

      {/* Plaid trim */}
      <div className="check-strip" style={{ height: '24px', borderTop: '3px solid #0E0808' }} />
    </div>
  )
}
