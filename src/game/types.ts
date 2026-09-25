export type Direction = 'up' | 'down' | 'left' | 'right'

export interface Point {
  x: number
  y: number
}

export type GameStatus = 'idle' | 'playing' | 'paused' | 'gameover'

export const GRID_COLS = 20
export const GRID_ROWS = 20
export const TICK_MS = 120

export const OPPOSITE: Record<Direction, Direction> = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left',
}
