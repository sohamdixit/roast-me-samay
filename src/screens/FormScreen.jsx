import { useState } from 'react'
import { JOBS, CITIES, RELATIONSHIPS, RECENT_LS, SUNDAY_LIES, INITIAL_VISIBLE } from '../data/formOptions'

function PillGroup({ options, value, onChange, placeholder, initialVisible = INITIAL_VISIBLE }) {
  const [custom, setCustom] = useState('')
  const [expanded, setExpanded] = useState(false)
  const isCustomSelected = value && !options.includes(value)

  const visibleOptions = expanded ? options : options.slice(0, initialVisible)
  const hiddenCount = options.length - initialVisible

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
      {visibleOptions.map(opt => (
        <button
          key={opt}
          type="button"
          onClick={() => selectPill(opt)}
          className={`pill ${value === opt ? 'pill--selected' : ''}`}
        >
          {opt}
        </button>
      ))}
      {!expanded && hiddenCount > 0 && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="pill pill--more"
        >
          +{hiddenCount} aur →
        </button>
      )}
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

  const ageNum    = parseInt(age, 10)
  const ageError  = age.length > 0
    ? ageNum === 69  ? 'nice.'
    : ageNum >= 100  ? 'BKL...'
    : null
    : null
  const ageBlocks = ageNum >= 100   // 69 is allowed through, 100+ is not

  const canSubmit = name.trim() && age && !ageBlocks && job && city && recentL

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
      <header className="screen-header relative overflow-hidden border-b-4 border-black">
        <div className="check-pattern absolute inset-0" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(26,16,16,0.10) 0%, rgba(26,16,16,0.45) 100%)' }} />
        <div className="relative z-10">
          <h1 className="font-heading text-off-white leading-none" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', textShadow: '0 2px 0 rgba(0,0,0,0.55)' }}>
            Apni Tragedy Bata
          </h1>
          <div className="inline-block font-mono text-xs text-off-white mt-3" style={{ background: 'rgba(26,16,16,0.78)', padding: '4px 8px' }}>
            fill in. get destroyed. share with enemies.
          </div>
        </div>
      </header>

      {/* Identity */}
      <section className="screen-section border-b border-black3" style={{ background: '#160C0C' }}>
        <div className="font-mono text-xs text-muted uppercase tracking-widest mb-4">yaar, pehle bata</div>
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="field-label">Naam</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value.replace(/[^a-zA-Z\s\-']/g, ''))}
              placeholder="apna naam"
              maxLength={40}
              className="text-input"
            />
          </div>
          <div style={{ flex: '0 0 110px' }}>
            <label className="field-label">Umar</label>
            <input
              type="text"
              inputMode="numeric"
              value={age}
              onChange={e => setAge(e.target.value.replace(/\D/g, '').slice(0, 3))}
              placeholder="age"
              className={`text-input ${ageBlocks ? 'text-input--error' : ''}`}
            />
            {ageError && (
              <div className="font-mono mt-2" style={{ fontSize: '11px', color: ageBlocks ? '#CC2128' : '#9A8885', letterSpacing: '0.02em' }}>
                {ageError}
              </div>
            )}
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
      <div className="screen-section" style={{ paddingTop: 0 }}>
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
        <div className="screen-section" style={{ paddingTop: 0, paddingBottom: '12px' }}>
          <div className="p-3 border border-red font-mono text-xs" style={{ color: '#CC2128' }}>
            {error}
          </div>
        </div>
      )}

      {/* CTA */}
      <div className="screen-section" style={{ paddingTop: 0 }}>
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
