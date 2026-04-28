import { useState, useEffect } from 'react'

const INTRO     = "Let's gooo.."
const LINE_DUR  = 1750   // ms per line — times sing-along to finish at the beat drop (~s27)

export default function SingAlongScreen({ roastData, onSkip, onFinish, muted, onToggleMute }) {
  const barLines = roastData.bars.split('\n').filter(Boolean)
  const lines    = [INTRO, ...barLines]          // 9 total: 1 intro + 8 bars

  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => {
      if (activeIdx >= lines.length - 1) {
        onFinish()
      } else {
        setActiveIdx(i => i + 1)
      }
    }, LINE_DUR)
    return () => clearTimeout(t)
  }, [activeIdx])

  return (
    <div
      className="screen"
      style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
    >
      {/* Top bar */}
      <div
        className="screen-section"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '28px',
          paddingBottom: '12px',
          flexShrink: 0,
        }}
      >
        <div className="font-mono" style={{ fontSize: '11px', color: '#9A8885', textTransform: 'uppercase', letterSpacing: '0.14em' }}>
          VERSE 1
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={onToggleMute}
            style={{
              background: 'rgba(14,8,8,0.72)',
              border: '1px solid rgba(242,234,232,0.18)',
              borderRadius: '999px',
              padding: '5px 9px',
              fontSize: '16px',
              lineHeight: 1,
              cursor: 'pointer',
            }}
          >
            {muted ? '🔇' : '🔊'}
          </button>
          <button
            type="button"
            onClick={onSkip}
            className="pill"
            style={{ fontSize: '12px' }}
          >
            skip →
          </button>
        </div>
      </div>

      {/* Lyrics */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 32px 48px',
          gap: '2px',
        }}
      >
        {lines.map((line, i) => {
          const isActive = i === activeIdx
          const isPast   = i < activeIdx
          const isIntro  = i === 0

          return (
            <div
              key={i}
              style={{
                fontFamily:     'DM Mono, monospace',
                fontSize:       isActive ? '24px' : '13px',
                lineHeight:     isActive ? 1.4 : 1.6,
                fontStyle:      isIntro ? 'italic' : 'normal',
                color:          isActive
                                  ? (isIntro ? '#CC2128' : '#F2EAE8')
                                  : isPast ? '#3a2020' : '#9A8885',
                opacity:        isActive ? 1 : isPast ? 0.35 : 0.5,
                paddingLeft:    isActive ? '12px' : '15px',
                borderLeft:     isActive ? '3px solid #CC2128' : '3px solid transparent',
                marginBottom:   isActive ? '6px' : '0',
                transition:     'font-size 0.3s ease, color 0.3s ease, opacity 0.3s ease, padding-left 0.3s ease, border-color 0.3s ease',
              }}
            >
              {line}
            </div>
          )
        })}
      </div>
    </div>
  )
}
