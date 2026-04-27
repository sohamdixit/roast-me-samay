import { useState, useEffect } from 'react'

const MESSAGES = [
  'samay judge kar raha hai...',
  'gym membership ka hisaab...',
  'sleep schedule dekh ke rona aa gaya...',
  'Sunday lie verify ho rahi hai...',
  'LinkedIn dekh ke thoda ruk gaye...',
  'AI bhi confused hai, teri tarah...',
  'career graph ka slope — oof...',
  'potential vs actual output — gap mila...',
  'Netflix vs ambitions — mismatch...',
  'alarm vs actual wake-up — noted...',
  'zindagi ka quarterly review chal raha hai...',
  'teri horoscope bhi rone lagi...',
  'wishlist vs bank balance — yikes...',
  'Swiggy history expose ho rahi hai...',
  'Samay ne chai li, aa rahe hain...',
  'reels ka screen time — calculating...',
  "'kal pakka' list update ho rahi hai...",
  '5-year plan vs reality — oof...',
  "'main busy hoon' — fact-check chal raha hai...",
  'sapne bade, effort chhota...',
  'Samay bhi confuse ho gaya yaar...',
  'upcoming regrets ki list ready ho rahi hai...',
  'ambition vs execution — graph dekha...',
  'side project: 1 commit, 8 mahine pehle...',
  "'I should sleep' logs mil gaye...",
  'procrastination index calculate ho raha hai...',
  'meditation app: 0 sessions found...',
  "'I'm fine' — fact-check chal rahi hai...",
  'age vs life goals — interesting...',
  'tera screen time — sharma gaye hum...',
  'diss track likh rahe hain, ruko...',
  'bars ban rahe hain — tere liye...',
  'rhymes dhundh rahe hain... almost...',
]

function randomIdx(current) {
  if (MESSAGES.length <= 1) return 0
  let next = Math.floor(Math.random() * MESSAGES.length)
  while (next === current) next = Math.floor(Math.random() * MESSAGES.length)
  return next
}

export default function LoadingScreen() {
  const [idx, setIdx]   = useState(() => Math.floor(Math.random() * MESSAGES.length))
  const [dots, setDots] = useState('...')

  useEffect(() => {
    const t = setInterval(() => setIdx(i => randomIdx(i)), 2200)
    return () => clearInterval(t)
  }, [])

  useEffect(() => {
    const t = setInterval(() => setDots(d => d.length >= 3 ? '.' : d + '.'), 380)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="screen flex flex-col items-center justify-center min-h-screen gap-10">
      {/* Status label */}
      <div className="font-mono" style={{ fontSize: '13px', letterSpacing: '0.14em', color: '#CC2128' }}>
        [GENERATING{dots}]
      </div>

      {/* Spinner */}
      <div className="spinner" />

      {/* Message — big, centred, hard to miss */}
      <div
        className="font-mono text-off-white text-center px-8"
        style={{ fontSize: 'clamp(18px, 4vw, 26px)', lineHeight: 1.4, letterSpacing: '0.01em', minHeight: '2.8em' }}
      >
        {MESSAGES[idx]}
      </div>
    </div>
  )
}
