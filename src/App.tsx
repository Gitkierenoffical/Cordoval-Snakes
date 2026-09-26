import { useCallback, useEffect, useRef } from 'react'
import { BackupPanel } from './components/BackupPanel'
import { DPad } from './components/DPad'
import { BuildHouseDailyAd } from './components/BuildHouseDailyAd'
import { Footer } from './components/Footer'
import { GameBoard } from './components/GameBoard'
import { Header } from './components/Header'
import type { Direction } from './game/types'
import { useBestScore } from './hooks/useBestScore'
import { useSnakeGame } from './hooks/useSnakeGame'
import { useStoragePersist } from './hooks/useStoragePersist'

const KEY_TO_DIR: Record<string, Direction> = {
  ArrowUp: 'up',
  ArrowDown: 'down',
  ArrowLeft: 'left',
  ArrowRight: 'right',
  w: 'up',
  W: 'up',
  s: 'down',
  S: 'down',
  a: 'left',
  A: 'left',
  d: 'right',
  D: 'right',
}

function App() {
  const { bestScore, updateIfHigher, reload } = useBestScore()
  const { showPersistWarning, dismissWarning } = useStoragePersist()

  const game = useSnakeGame()
  const touchRef = useRef<{ x: number; y: number } | null>(null)
  const lastScoreRef = useRef(0)

  useEffect(() => {
    lastScoreRef.current = game.score
  }, [game.score])

  useEffect(() => {
    if (game.status === 'gameover') {
      void updateIfHigher(lastScoreRef.current)
    }
  }, [game.status, updateIfHigher])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'p' || e.key === 'P') {
        if (game.status === 'playing' || game.status === 'paused') {
          e.preventDefault()
          game.togglePause()
        }
        return
      }
      const dir = KEY_TO_DIR[e.key]
      if (!dir) return
      e.preventDefault()
      if (game.status === 'idle') {
        game.start()
      }
      if (game.status === 'paused') return
      game.setDirection(dir)
    },
    [game],
  )

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const onTouchStart = (e: React.TouchEvent) => {
    const t = e.changedTouches[0]
    touchRef.current = { x: t.clientX, y: t.clientY }
  }

  const onTouchEnd = (e: React.TouchEvent) => {
    const start = touchRef.current
    touchRef.current = null
    if (!start) return
    const t = e.changedTouches[0]
    const dx = t.clientX - start.x
    const dy = t.clientY - start.y
    const min = 24
    if (Math.abs(dx) < min && Math.abs(dy) < min) return
    let dir: Direction
    if (Math.abs(dx) > Math.abs(dy)) {
      dir = dx > 0 ? 'right' : 'left'
    } else {
      dir = dy > 0 ? 'down' : 'up'
    }
    if (game.status === 'idle') game.start()
    if (game.status === 'playing') game.setDirection(dir)
  }

  const playOrResume = () => {
    if (game.status === 'idle' || game.status === 'gameover') {
      game.restart()
      game.start()
      return
    }
    if (game.status === 'paused') game.resume()
    else game.start()
  }

  return (
    <div className="app">
      <Header />
      <main className="main">
        {showPersistWarning && (
          <div className="banner banner--warn" role="status">
            <p>
              This browser may clear site data over time. Use Backup to keep your best score safe.
            </p>
            <button type="button" className="banner-dismiss" onClick={dismissWarning}>
              Dismiss
            </button>
          </div>
        )}

        <div className="score-row">
          <div className="score-card">
            <span className="score-label">Score</span>
            <span className="score-value">{game.score}</span>
          </div>
          <div className="score-card score-card--best">
            <span className="score-label">Best</span>
            <span className="score-value">{bestScore}</span>
          </div>
        </div>

        <div
          className="play-area"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <GameBoard snake={game.snake} food={game.food} gameOver={game.status === 'gameover'} />
        </div>

        <div className="control-bar">
          {game.status === 'idle' && (
            <p className="hint">Press an arrow key, WASD, or the pad below to start.</p>
          )}
          {game.status === 'paused' && (
            <p className="hint">Paused. Press Play or space to continue.</p>
          )}
          <div className="button-row button-row--centre">
            {game.status === 'gameover' ? (
              <button type="button" className="btn btn-primary" onClick={playOrResume}>
                Restart
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={playOrResume}
                  disabled={game.status === 'playing'}
                >
                  {game.status === 'paused' ? 'Resume' : 'Play'}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={game.togglePause}
                  disabled={game.status !== 'playing' && game.status !== 'paused'}
                >
                  {game.status === 'paused' ? 'Paused' : 'Pause'}
                </button>
                <button type="button" className="btn btn-ghost" onClick={game.restart}>
                  Restart
                </button>
              </>
            )}
          </div>
        </div>

        <DPad
          onDirection={(dir) => {
            if (game.status === 'idle') {
              game.start()
            }
            if (game.status === 'playing') {
              game.setDirection(dir)
            }
          }}
          disabled={game.status !== 'playing' && game.status !== 'idle'}
        />

        <BackupPanel onRestored={() => void reload()} />
      </main>
      <BuildHouseDailyAd />
      <Footer />
    </div>
  )
}

export default App
