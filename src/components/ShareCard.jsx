import { forwardRef, useRef, useEffect } from 'react'

// Draws the check pattern directly onto a <canvas>.
// html2canvas reads <canvas> pixel data natively — no CSS parsing needed.
// This is necessary because html2canvas v1.x cannot render repeating-linear-gradient.
function CheckPatternCanvas({ width, height, cellSize = 160, style }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    for (let y = 0; y < height; y += cellSize) {
      for (let x = 0; x < width; x += cellSize) {
        // Red tile base
        ctx.fillStyle = '#CC2128'
        ctx.fillRect(x, y, cellSize, cellSize)
        // Left vertical band
        ctx.fillStyle = 'rgba(0,0,0,0.78)'
        ctx.fillRect(x, y, cellSize / 2, cellSize)
        // Bottom horizontal band
        ctx.fillStyle = 'rgba(0,0,0,0.78)'
        ctx.fillRect(x, y + cellSize / 2, cellSize, cellSize / 2)
      }
    }
  }, [width, height, cellSize])

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ display: 'block', flexShrink: 0, ...style }}
    />
  )
}

const ShareCard = forwardRef(function ShareCard({ formData, roastData }, ref) {
  const paragraphs = roastData.roast.split('\n\n').filter(Boolean)

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        width: '1080px',
        height: '1080px',
        background: '#0E0808',
        color: '#F2EAE8',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        fontFamily: 'DM Sans, sans-serif',
      }}
    >
      {/* ROASTED stamp — absolute, lower-right, rotated like a rubber stamp */}
      <div style={{
        position: 'absolute',
        bottom: '148px',
        right: '56px',
        transform: 'rotate(-18deg)',
        transformOrigin: 'center',
        border: '7px solid rgba(204,33,40,0.75)',
        padding: '14px 28px',
        fontFamily: 'DM Mono, monospace',
        fontWeight: 'bold',
        fontSize: '46px',
        color: 'rgba(204,33,40,0.75)',
        textTransform: 'uppercase',
        letterSpacing: '0.28em',
        lineHeight: 1,
        zIndex: 10,
        pointerEvents: 'none',
      }}>
        ROASTED
      </div>

      {/* Masthead */}
      <div style={{ position: 'relative', height: '190px', flexShrink: 0, overflow: 'hidden' }}>
        <CheckPatternCanvas
          width={1080}
          height={190}
          cellSize={160}
          style={{ position: 'absolute', top: 0, left: 0 }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.50) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 2, height: '100%', padding: '0 64px', display: 'flex', alignItems: 'center' }}>
          <div style={{ fontFamily: 'Boogaloo, cursive', fontSize: '64px', lineHeight: 1, color: '#F2EAE8', textShadow: '0 2px 0 rgba(0,0,0,0.55)' }}>
            Roast Me Samay
          </div>
        </div>
      </div>

      {/* Check-strip divider — same pattern, smaller cells */}
      <CheckPatternCanvas width={1080} height={24} cellSize={28} />

      {/* Body */}
      <div style={{ flex: 1, padding: '44px 64px 0', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Person */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontFamily: 'Boogaloo, cursive', fontSize: '68px', lineHeight: 1, color: '#F2EAE8' }}>
            {formData.name}, <span style={{ color: '#CC2128' }}>{formData.age}</span>
          </div>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '17px', color: '#CC2128', marginTop: '8px', lineHeight: 1.4, letterSpacing: '0.02em' }}>
            {roastData.designation}
          </div>
        </div>

        {/* Red accent bar */}
        <div style={{ width: '64px', height: '4px', background: '#CC2128', marginBottom: '28px', flexShrink: 0 }} />

        {/* Roast */}
        <div>
          {paragraphs.map((para, i) => (
            <p key={i} style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '36px', lineHeight: 1.55, color: '#F2EAE8', marginBottom: '28px' }}>
              {para}
            </p>
          ))}
        </div>
      </div>

      {/* Check-strip divider before footer */}
      <CheckPatternCanvas width={1080} height={24} cellSize={28} />

      {/* Footer */}
      <div style={{ padding: '22px 64px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '15px', color: '#9A8885' }}>
          {[formData.job, formData.city, formData.recentL].filter(Boolean).join(' · ')}
        </div>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '15px', color: '#F2EAE8' }}>
          <span style={{ color: '#CC2128' }}>roast-me-samay</span>.vercel.app
        </div>
      </div>
    </div>
  )
})

export default ShareCard
