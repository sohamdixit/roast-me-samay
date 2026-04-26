import { forwardRef } from 'react'

const ShareCard = forwardRef(function ShareCard({ formData, roastData }, ref) {
  const paragraphs = roastData.roast.split('\n\n').filter(Boolean)

  return (
    <div
      ref={ref}
      style={{
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
      {/* Masthead */}
      <div style={{ position: 'relative', height: '190px', flexShrink: 0, overflow: 'hidden', borderBottom: '5px solid #0E0808' }}>
        <div className="check-pattern check-pattern--lg" style={{ position: 'absolute', inset: 0 }} />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,0,0,0.06) 0%, rgba(0,0,0,0.50) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 2, height: '100%', padding: '0 64px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ fontFamily: 'Boogaloo, cursive', fontSize: '64px', lineHeight: 1, color: '#F2EAE8', textShadow: '0 2px 0 rgba(0,0,0,0.55)' }}>
            Roast Me Samay
          </div>
          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: '#F2EAE8', textTransform: 'uppercase', letterSpacing: '0.3em', border: '1.5px solid rgba(242,234,232,0.45)', padding: '8px 16px', background: 'rgba(14,8,8,0.55)' }}>
            roasted
          </div>
        </div>
      </div>

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

        {/* Divider */}
        <div style={{ width: '56px', height: '3px', background: '#CC2128', marginBottom: '24px', flexShrink: 0 }} />

        {/* Roast */}
        <div>
          {paragraphs.map((para, i) => (
            <p key={i} style={{ fontFamily: 'DM Sans, sans-serif', fontSize: '36px', lineHeight: 1.55, color: '#F2EAE8', marginBottom: '28px' }}>
              {para}
            </p>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{ margin: '0 64px', padding: '20px 0 44px', borderTop: '1px solid rgba(242,234,232,0.10)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '15px', color: '#9A8885' }}>
          {[formData.job, formData.city, formData.recentL].filter(Boolean).join(' · ')}
        </div>
        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '15px', color: '#F2EAE8' }}>
          <span style={{ color: '#CC2128' }}>roastmesamay</span>.app
        </div>
      </div>
    </div>
  )
})

export default ShareCard
