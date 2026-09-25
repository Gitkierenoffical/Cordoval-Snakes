import { useCallback, useEffect, useState } from 'react'
import { KEYS } from '../storage/constants'
import { getValue, setValue } from '../storage/indexedDb'

export function useBestScore() {
  const [bestScore, setBestScore] = useState(0)
  const [ready, setReady] = useState(false)

  const reload = useCallback(async () => {
    const stored = await getValue<number>(KEYS.bestScore)
    setBestScore(typeof stored === 'number' ? stored : 0)
    setReady(true)
  }, [])

  useEffect(() => {
    void reload()
  }, [reload])

  const updateIfHigher = useCallback(async (score: number) => {
    setBestScore((prev) => {
      if (score <= prev) return prev
      void setValue(KEYS.bestScore, score)
      return score
    })
  }, [])

  const setBestScoreDirect = useCallback(async (score: number) => {
    await setValue(KEYS.bestScore, score)
    setBestScore(score)
  }, [])

  return { bestScore, ready, updateIfHigher, reload, setBestScoreDirect }
}
