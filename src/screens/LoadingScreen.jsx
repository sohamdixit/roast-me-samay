import { useState, useEffect } from 'react'

const MESSAGES = [
  'samay judge kar raha hai...',
  'gym membership ka hisaab...',
  'sleep schedule dekh ke rona aa gaya...',
  'roast ban raha hai, ruko...',
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
  'algorithm bhi ruk gaya sun ke...',
  'reels ka screen time — calculating...',
  "'kal pakka' list update ho rahi hai...",
  '5-year plan vs reality — oof...',
  "'main busy hoon' — fact-check chal raha hai...",
  '11:30pm Instagram — productivity peak noted...',
  'sapne bade, effort chhota...',
  'chai-samosa vs savings goal...',
  'Samay bhi confuse ho gaya yaar...',
  'tera life coach therapy mein hai...',
  'AI chai lene gaya, wapas aa raha hai...',
  'struggles Hinglish mein translate ho rahi hain...',
  'upcoming regrets ki list ready ho rahi hai...',
  'future vs present — bridge nahi mila...',
  'chai bhi, roast bhi — dono ban rahe hain...',
  'situation ko funny angle de rahe hain...',
  'ambition vs execution — graph dekha...',
  'side project: 1 commit, 8 mahine pehle...',
  'phone bhi sharma gaya tera screen time dekh ke...',
  'AI hasa, phir wapas aaya...',
  "'I should sleep' logs mil gaye...",
  'relationship status vs actual feelings...',
  'Samay chess chhod denge shayad...',
  'procrastination index calculate ho raha hai...',
  'kya karte ho? achha wahi...',
  'premium roast ban raha hai...',
  'thoda aur — almost ready...',
  'meditation app: 0 sessions found...',
  "'I'm fine' — fact-check chal rahi hai...",
  'worth the wait... shayad...',
  'age vs life goals — interesting...',
  'diet plan vs Swiggy — confrontation chal raha hai...',
  'tera screen time — sharma gaye hum...',
  'ruk jao, almost done...',
]

function randomIdx(current) {
  if (MESSAGES.length <= 1) return 0
  let next = Math.floor(Math.random() * MESSAGES.length)
  while (next === current) next = Math.floor(Math.random() * MESSAGES.length)
  return next
}

export default function LoadingScreen() {
  const [idx, setIdx] = useState(() => Math.floor(Math.random() * MESSAGES.length))

  useEffect(() => {
    const t = setInterval(() => setIdx(i => randomIdx(i)), 2500)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="screen flex flex-col items-center justify-center min-h-screen gap-8">
      {/* Spinner */}
      <div className="spinner" />

      {/* Message */}
      <div className="font-mono text-sm text-muted text-center px-6" style={{ minHeight: '2em' }}>
        {MESSAGES[idx]}
      </div>

      {/* 10-second progress bar — fixed at bottom of viewport */}
      <div className="loading-progress-track">
        <div className="loading-progress-bar" />
      </div>
    </div>
  )
}
