import { useState, useEffect } from 'react'

// "Let's gooo.." plays for INTRO_DUR ms, then lyrics start.
// 8 lines × LINE_DUR + INTRO_DUR ≈ 26.98s from audio start → card slams at the beat drop (~s27).
const INTRO_DUR  = 1700   // ms
const LINE_DUR   = 1750   // ms per bar line
const SLOT_H     = 100    // px — height of each line slot in the scrolling viewport

export default function SingAlongScreen({ roastData, onSkip, onFinish, muted, onToggleMute }) {
  const barLines = roastData.bars.split('\n').filter(Boolean)  // 8 lines

  const [phase,        setPhase]        = useState('intro')   // 'intro' | 'lyrics'
  const [lyricsReady,  setLyricsReady]  = useState(false)     // fade in lyrics slightly before intro ends
  const [activeIdx,    setActiveIdx]    = useState(0)         // which bar line is active

  // Intro → lyrics transition
  useEffect(() => {
    const t1 = setTimeout(() => setLyricsReady(true),  INTRO_DUR - 300)
    const t2 = setTimeout(() => setPhase('lyrics'),    INTRO_DUR)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  // Advance lyrics line by line
  useEffect(() => {
    if (phase !== 'lyrics') return
    const t = setTimeout(() => {
      if (activeIdx >= barLines.length - 1) {
        onFinish()
      } else {
        setActiveIdx(i => i + 1)
      }
    }, LINE_DUR)
    return () => clearTimeout(t)
  }, [phase, activeIdx])

  // Pad lines so edge items work (empty strings become invisible slots)
  const paddedLines = ['', ...barLines, '']

  return (
    <div
      className="screen"
      style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}
    >
      {/* Controls — top right */}
      <div style={{ position: 'absolute', top: '20px', right: '24px', display: 'flex', gap: '8px', zIndex: 20 }}>
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
        <button type="button" onClick={onSkip} className="pill" style={{ fontSize: '12px' }}>
          skip →
        </button>
      </div>

      {/* "Let's gooo.." intro — full screen, centered, grows + fades */}
      {phase === 'intro' && (
        <div
          className="lets-gooo"
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
          }}
        >
          <span
            className="font-heading"
            style={{ fontSize: 'clamp(40px, 10vw, 72px)', color: '#CC2128', textAlign: 'center', lineHeight: 1 }}
          >
            Let's gooo..
          </span>
        </div>
      )}

      {/* Scrolling lyrics viewport — fades in as intro ends */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          opacity: lyricsReady ? 1 : 0,
          transition: 'opacity 0.4s ease',
        }}
      >
        {/* VERSE label */}
        <div
          className="font-mono"
          style={{
            fontSize: '11px',
            color: '#9A8885',
            textTransform: 'uppercase',
            letterSpacing: '0.14em',
            textAlign: 'center',
            marginBottom: '24px',
          }}
        >
          VERSE 1
        </div>

        {/* 3-slot scrolling window */}
        <div style={{ overflow: 'hidden', height: SLOT_H * 3, position: 'relative' }}>
          <div
            style={{
              transform: `translateY(${-activeIdx * SLOT_H}px)`,
              transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          >
            {paddedLines.map((line, i) => {
              const offset  = i - (activeIdx + 1)   // -1 = prev, 0 = current, +1 = next
              const isCurr  = offset === 0
              const isAdj   = Math.abs(offset) === 1

              return (
                <div
                  key={i}
                  style={{
                    height:         SLOT_H,
                    display:        'flex',
                    alignItems:     'center',
                    justifyContent: 'center',
                    padding:        '0 40px',
                    textAlign:      'center',
                    fontFamily:     'DM Mono, monospace',
                    fontSize:       isCurr ? 'clamp(22px, 5vw, 30px)' : 'clamp(12px, 2.5vw, 15px)',
                    fontWeight:     isCurr ? '500' : '400',
                    color:          isCurr ? '#F2EAE8' : '#9A8885',
                    opacity:        isCurr ? 1 : isAdj ? 0.45 : 0,
                    transition:     'font-size 0.5s ease, color 0.5s ease, opacity 0.5s ease',
                  }}
                >
                  {line}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
