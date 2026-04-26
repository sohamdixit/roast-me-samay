import { useRef } from 'react'
import html2canvas from 'html2canvas'
import ShareCard from '../components/ShareCard'

export default function RoastScreen({ formData, roastData, onRestart }) {
  const shareCardRef = useRef(null)
  const paragraphs = roastData.roast.split('\n\n').filter(Boolean)

  async function handleShare() {
    await document.fonts.ready
    const canvas = await html2canvas(shareCardRef.current, {
      useCORS: true,
      scale: 1,
      width: 1080,
      height: 1080,
    })
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'))
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `roast-${formData.name.toLowerCase()}.png`
    a.click()
    URL.revokeObjectURL(url)
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
            tera roast aaya, {formData.name}
          </div>
        </div>
      </header>

      {/* Check strip divider */}
      <div className="check-strip" style={{ height: '12px' }} />

      {/* Designation */}
      <div style={{ padding: '24px 24px 0' }}>
        <div className="font-mono text-xs text-red uppercase tracking-widest mb-1">ROASTED →</div>
        <div className="font-heading text-3xl text-off-white">
          {formData.name}, <span className="text-red">{formData.age}</span>
        </div>
        <div className="font-mono text-sm text-muted mt-2 leading-relaxed">
          {roastData.designation}
        </div>
        <div className="mt-4" style={{ width: '56px', height: '3px', background: '#CC2128' }} />
      </div>

      {/* Roast text */}
      <div style={{ padding: '24px' }}>
        {paragraphs.map((para, i) => (
          <p key={i} className="font-body text-off-white leading-relaxed mb-5 last:mb-0" style={{ fontSize: '17px' }}>
            {para}
          </p>
        ))}
      </div>

      {/* Check strip */}
      <div className="check-strip" style={{ height: '12px' }} />

      {/* Actions */}
      <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <button type="button" onClick={handleShare} className="cta">
          share karo →
        </button>
        <button type="button" onClick={onRestart} className="cta-secondary">
          ek aur roast →
        </button>
      </div>

      {/* Hidden share card */}
      <div style={{ position: 'fixed', left: '-9999px', top: 0, pointerEvents: 'none' }}>
        <ShareCard ref={shareCardRef} formData={formData} roastData={roastData} />
      </div>
    </div>
  )
}
