import { useState, useRef } from 'react'
import FormScreen from './screens/FormScreen'
import LoadingScreen from './screens/LoadingScreen'
import RoastScreen from './screens/RoastScreen'

const BEAT_URL = '/beat.mp3'

const ERROR_MSGS = [
  'server ne bhi roast sunne se mana kar diya. retry kar yaar.',
  'API bhi teri tarah unreliable nikla. ek baar aur try kar.',
  'kuch toh gadbad hai. Samay bhi confused hai. dobara try kar.',
  'yaar network ne bhi judge kiya. phir se chal.',
]

function randomError() {
  return ERROR_MSGS[Math.floor(Math.random() * ERROR_MSGS.length)]
}

const EMPTY_FORM = { name: '', age: '', job: '', city: '', relationship: '', recentL: '', sundayLie: '' }

export default function App() {
  const [screen, setScreen] = useState('form')
  const [savedForm, setSavedForm] = useState(EMPTY_FORM)
  const [roastData, setRoastData] = useState(null)
  const [error, setError] = useState(null)
  const [muted, setMuted] = useState(false)
  const audioRef = useRef(null)

  function startMusic() {
    if (!audioRef.current) {
      audioRef.current = new Audio(BEAT_URL)
      audioRef.current.loop = true
      audioRef.current.volume = 0.35
    }
    audioRef.current.play().catch(() => {}) // silently ignore autoplay block
  }

  function stopMusic() {
    if (audioRef.current) {
      audioRef.current.pause()
      audioRef.current.currentTime = 0
      audioRef.current = null
    }
    setMuted(false)
  }

  function toggleMute() {
    if (!audioRef.current) return
    const next = !muted
    audioRef.current.muted = next
    setMuted(next)
  }

  async function handleSubmit(data) {
    setSavedForm(data)
    setScreen('loading')
    setError(null)
    startMusic()

    // Animation (0.72s) fires after this delay.
    // Target: animation finishes at exactly 11s into the beat → 11000 - 720 = 10280ms
    const minDelay = new Promise(resolve => setTimeout(resolve, 10280))

    try {
      const res = await fetch('/api/roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const json = await res.json()
      await minDelay                               // wait out remaining minimum time
      if (!res.ok) throw new Error(json.error || 'Something went wrong')
      setRoastData(json)
      setScreen('roast')
    } catch {
      await minDelay                               // already resolved if API was slow
      stopMusic()
      setError(randomError())
      setScreen('form')
    }
  }

  function handleRestart() {
    stopMusic()
    setScreen('form')
    setRoastData(null)
    setSavedForm(EMPTY_FORM)
    setError(null)
  }

  if (screen === 'loading') return <LoadingScreen />
  if (screen === 'roast') return (
    <RoastScreen
      formData={savedForm}
      roastData={roastData}
      onRestart={handleRestart}
      muted={muted}
      onToggleMute={toggleMute}
    />
  )
  return <FormScreen onSubmit={handleSubmit} error={error} initialData={savedForm} />
}
