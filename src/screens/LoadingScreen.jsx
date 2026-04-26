import { useState, useEffect } from 'react'

const MESSAGES = [
  'samay teri zindagi judge kar rahe hain...',
  'gym membership ka record check ho raha hai...',
  'sleep schedule dekh ke rona aa gaya...',
  'roast likh rahe hain, ruko yaar...',
  'tera Sunday lie database se dhoondh rahe hain...',
  'teri LinkedIn profile dekh ke thoda ruk gaye...',
  'AI bhi thoda confused hai, teri tarah...',
  'career graph ka slope calculate ho raha hai...',
  'tera potential aur actual output compare ho raha hai...',
  'teri Netflix history aur ambitions mein mismatch mile...',
  'teri age aur life goals ka gap measure kar rahe hain...',
  'quarterly review teri zindagi ka ho raha hai...',
  'morning alarm aur actual wake-up time ka analysis ho raha hai...',
  'teri horoscope bhi rone lagi hai...',
  'wishlist vs bank balance ka audit ho raha hai...',
  'teri diet plan aur Swiggy history ka confrontation ho raha hai...',
  'Samay ne chai li, wapas aa rahe hain...',
  'teri situation sun ke algorithm bhi ruk gaya...',
  'reels ka total screen time calculate kar rahe hain...',
  "teri 'kal pakka' list update ho rahi hai...",
  '5-year plan vs 5-year reality cross-referencing...',
  "teri 'main busy hoon' aur last seen ka fact-check ho raha hai...",
  'tera productivity peak — 11:30pm Instagram — recorded...',
  'bade sapne, chhota effort — ratio nikaal rahe hain...',
  'tera savings goal aur chai-samosa budget reconcile ho raha hai...',
  'Samay khud confuse ho gaya, teri situation sun ke...',
  'tera life coach bhi abhi therapy le raha hai...',
  'AI ne ek baar padha aur chai banana chala gaya...',
  'teri struggles ko Hinglish mein translate kar rahe hain...',
  'upcoming regrets ka list ready ho rahi hai...',
  'sundar future aur vartaman mein bridge dhundh rahe hain...',
  "teri 'bs thoda aur' wali psychology analyze ho rahi hai...",
  'chai ke saath roast — dono ban rahe hain...',
  'teri feelings ko comical angle dene ki koshish ho rahi hai...',
  'situation ko hum bhi process kar rahe hain, ruk jao...',
  "teri 'this week I'll be productive' history mil gayi...",
  'tera ambition aur execution speed ka graph — oof...',
  'side project ka commit history: 1 commit, 8 mahine pehle...',
  'tera screen time dekh ke phone bhi sharma gaya...',
  'thoda ruk — AI bhi hasa aur phir wapas aaya...',
  'teri late night "I should sleep" vs actual sleep time audit...',
  'relationship status aur actual feelings cross-referencing...',
  'Samay tera bio padh ke chess chhod denge shayad...',
  'tera procrastination index calculate ho raha hai...',
  'kya karte ho? achha wahi — theek hai yaar...',
  'aaj ka roast premium quality mein aa raha hai...',
  'queue mein teri zindagi ke bare mein kuch aur mile...',
  'downloaded meditation app usage log: 0 sessions found...',
  "teri 'I'm fine' aur actual situation ka gap measure ho raha hai...",
  'bas thodi der — worth the wait (shayad)...',
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
    const t = setInterval(() => setIdx(i => randomIdx(i)), 2000)
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
    </div>
  )
}
