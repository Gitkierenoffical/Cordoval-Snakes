import { useCallback, useEffect, useState } from 'react'
import {
  initialDirection,
  initialSnake,
  isOutOfBounds,
  pointsEqual,
  randomFood,
  stepHead,
} from '../game/logic'
import {
  OPPOSITE,
  TICK_MS,
  type Direction,
  type GameStatus,
  type Point,
} from '../game/types'

export interface SnakeGameState {
  snake: Point[]
  food: Point
  direction: Direction
  pendingDirection: Direction
  score: number
  status: GameStatus
}

function createInitialState(): SnakeGameState {
  const snake = initialSnake()
  return {
    snake,
    food: randomFood(snake),
    direction: initialDirection(),
    pendingDirection: initialDirection(),
    score: 0,
    status: 'idle',
  }
}

export function useSnakeGame() {
  const [state, setState] = useState<SnakeGameState>(createInitialState)

  const setDirection = useCallback((dir: Direction) => {
    setState((prev) => {
      if (prev.status !== 'playing') return prev
      const current = prev.pendingDirection
      if (OPPOSITE[dir] === current) return prev
      return { ...prev, pendingDirection: dir }
    })
  }, [])

  const start = useCallback(() => {
    setState((prev) => {
      if (prev.status === 'playing') return prev
      return { ...prev, status: 'playing' }
    })
  }, [])

  const pause = useCallback(() => {
    setState((prev) => {
      if (prev.status !== 'playing') return prev
      return { ...prev, status: 'paused' }
    })
  }, [])

  const resume = useCallback(() => {
    setState((prev) => {
      if (prev.status !== 'paused') return prev
      return { ...prev, status: 'playing' }
    })
  }, [])

  const restart = useCallback(() => {
    setState(createInitialState())
  }, [])

  const togglePause = useCallback(() => {
    setState((prev) => {
      if (prev.status === 'playing') return { ...prev, status: 'paused' }
      if (prev.status === 'paused') return { ...prev, status: 'playing' }
      return prev
    })
  }, [])

  useEffect(() => {
    if (state.status !== 'playing') return

    const id = window.setInterval(() => {
      setState((prev) => {
        if (prev.status !== 'playing') return prev

        const direction = prev.pendingDirection
        const head = stepHead(prev.snake[0], direction)
        if (isOutOfBounds(head)) {
          return { ...prev, direction, status: 'gameover' }
        }
        const hitSelf = prev.snake.some((s) => pointsEqual(s, head))
        if (hitSelf) {
          return { ...prev, direction, status: 'gameover' }
        }

        const ate = pointsEqual(head, prev.food)
        const nextSnake = ate
          ? [head, ...prev.snake]
          : [head, ...prev.snake.slice(0, -1)]

        const nextScore = ate ? prev.score + 1 : prev.score
        const nextFood = ate ? randomFood(nextSnake) : prev.food

        return {
          ...prev,
          snake: nextSnake,
          food: nextFood,
          direction,
          pendingDirection: direction,
          score: nextScore,
        }
      })
    }, TICK_MS)

    return () => window.clearInterval(id)
  }, [state.status])

  return {
    ...state,
    setDirection,
    start,
    pause,
    resume,
    togglePause,
    restart,
  }
}
