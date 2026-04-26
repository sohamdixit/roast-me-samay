import { useState, useEffect } from 'react'

const MESSAGES = [
  'samay teri zindagi judge kar rahe hain...',
  'gym membership ka record check ho raha hai...',
  'sleep schedule dekh ke rona aa gaya...',
  'roast likh rahe hain, ruko yaar...',
]

export default function LoadingScreen() {
  const [idx, setIdx] = useState(0)

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % MESSAGES.length), 1500)
    return () => clearInterval(t)
  }, [])

  return (
    <div className="screen flex flex-col items-center justify-center min-h-screen gap-8">
      {/* Spinner */}
      <div className="spinner" />

      {/* Message */}
      <div className="font-mono text-sm text-muted text-center px-6" style={{ minHeight: '1.5em' }}>
        {MESSAGES[idx]}
      </div>
    </div>
  )
}
