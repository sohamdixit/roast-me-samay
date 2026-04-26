import { useRef } from 'react'
import html2canvas from 'html2canvas'
import ShareCard from '../components/ShareCard'

export default function RoastScreen({ formData, roastData, onRestart, muted, onToggleMute }) {
  const shareCardRef = useRef(null)

  // bars: lines separated by \n, couplets separated by \n\n
  const couplets = roastData.bars
    .split('\n\n')
    .filter(Boolean)
    .map(block => block.split('\n').filter(Boolean))

  async function handleShare() {
    await document.fonts.ready
    const canvas = await html2canvas(shareCardRef.current, {
      useCORS: true,
      allowTaint: true,
      scale: 1,
      width: 1080,
      height: 1080,
      backgroundColor: '#0E0808',
      logging: false,
    })
    const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'))
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `diss-${formData.name.toLowerCase()}.png`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="screen">
      {/* Header */}
      <header className="screen-header relative overflow-hidden border-b-4 border-black">
        <div className="check-pattern absolute inset-0" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(26,16,16,0.10) 0%, rgba(26,16,16,0.45) 100%)' }} />
        <div className="relative z-10 flex items-start justify-between gap-4">
          <div>
            <h1 className="font-heading text-off-white leading-none" style={{ fontSize: 'clamp(2.5rem, 6vw, 4rem)', textShadow: '0 2px 0 rgba(0,0,0,0.55)' }}>
              Roast Me Samay
            </h1>
            <div className="inline-block font-mono text-xs text-off-white mt-3" style={{ background: 'rgba(26,16,16,0.78)', padding: '4px 8px' }}>
              tera diss track aaya, {formData.name}
            </div>
          </div>
          {/* Mute toggle */}
          <button
            type="button"
            onClick={onToggleMute}
            title={muted ? 'unmute beat' : 'mute beat'}
            style={{
              flexShrink: 0,
              background: 'rgba(14,8,8,0.72)',
              border: '1px solid rgba(242,234,232,0.18)',
              borderRadius: '999px',
              padding: '6px 10px',
              fontSize: '18px',
              lineHeight: 1,
              cursor: 'pointer',
              marginTop: '4px',
            }}
          >
            {muted ? '🔇' : '🔊'}
          </button>
        </div>
      </header>

      {/* Check strip divider */}
      <div className="check-strip" style={{ height: '12px' }} />

      {/* Identity + designation */}
      <div className="screen-section" style={{ paddingBottom: 0 }}>
        <div className="font-mono text-xs text-red uppercase tracking-widest mb-1">DISSED →</div>
        <div className="font-heading text-off-white" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.5rem)' }}>
          {formData.name}, <span className="text-red">{formData.age}</span>
        </div>
        <div className="font-mono text-sm text-muted mt-2 leading-relaxed">
          {roastData.designation}
        </div>
        <div className="mt-4" style={{ width: '56px', height: '3px', background: '#CC2128' }} />
      </div>

      {/* Track title */}
      <div className="screen-section" style={{ paddingTop: '20px', paddingBottom: '8px' }}>
        <div className="font-mono text-xs text-red uppercase tracking-widest mb-2">TRACK 01</div>
        <div className="font-heading text-off-white" style={{ fontSize: 'clamp(1.1rem, 3vw, 1.5rem)', lineHeight: 1.2 }}>
          {roastData.title}
        </div>
      </div>

      {/* Bars */}
      <div className="screen-section" style={{ paddingTop: '16px' }}>
        <div className="font-mono text-xs text-muted uppercase tracking-widest mb-4">VERSE 1</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {couplets.map((lines, ci) => (
            <div key={ci}>
              {lines.map((line, li) => (
                <div
                  key={li}
                  className="font-mono text-off-white"
                  style={{ fontSize: 'clamp(14px, 2.2vw, 17px)', lineHeight: 1.6 }}
                >
                  {line}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Check strip */}
      <div className="check-strip" style={{ height: '12px', marginTop: '8px' }} />

      {/* Actions */}
      <div className="screen-section" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <button type="button" onClick={handleShare} className="cta">
          share karo →
        </button>
        <button type="button" onClick={onRestart} className="cta-secondary">
          ek aur diss →
        </button>
      </div>

      {/* Hidden share card — position: absolute so html2canvas can capture it reliably */}
      <div style={{ position: 'absolute', top: '-1100px', left: 0, width: '1080px', height: '1080px', overflow: 'hidden', pointerEvents: 'none' }}>
        <ShareCard ref={shareCardRef} formData={formData} roastData={roastData} />
      </div>
    </div>
  )
}
