import { useEffect, useState } from 'react'
import {
  hasAttemptedPersist,
  markPersistAttempted,
  requestStoragePersist,
} from '../storage/indexedDb'

export function useStoragePersist() {
  const [persistGranted, setPersistGranted] = useState<boolean | null>(null)
  const [showPersistWarning, setShowPersistWarning] = useState(false)

  useEffect(() => {
    if (hasAttemptedPersist()) return
    markPersistAttempted()
    void (async () => {
      const granted = await requestStoragePersist()
      setPersistGranted(granted)
      if (!granted) setShowPersistWarning(true)
    })()
  }, [])

  return { persistGranted, showPersistWarning, dismissWarning: () => setShowPersistWarning(false) }
}
