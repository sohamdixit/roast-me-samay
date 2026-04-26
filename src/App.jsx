import { useState } from 'react'
import FormScreen from './screens/FormScreen'
import LoadingScreen from './screens/LoadingScreen'
import RoastScreen from './screens/RoastScreen'

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

  async function handleSubmit(data) {
    setSavedForm(data)
    setScreen('loading')
    setError(null)

    // Ensure loading screen shows for at least 3s so messages are readable
    const minDelay = new Promise(resolve => setTimeout(resolve, 3000))

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
      setError(randomError())
      setScreen('form')
    }
  }

  function handleRestart() {
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
    />
  )
  return <FormScreen onSubmit={handleSubmit} error={error} initialData={savedForm} />
}
