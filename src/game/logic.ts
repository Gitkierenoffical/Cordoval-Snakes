import {
  GRID_COLS,
  GRID_ROWS,
  type Direction,
  type Point,
} from './types'

export function pointsEqual(a: Point, b: Point): boolean {
  return a.x === b.x && a.y === b.y
}

export function stepHead(head: Point, dir: Direction): Point {
  switch (dir) {
    case 'up':
      return { x: head.x, y: head.y - 1 }
    case 'down':
      return { x: head.x, y: head.y + 1 }
    case 'left':
      return { x: head.x - 1, y: head.y }
    case 'right':
      return { x: head.x + 1, y: head.y }
  }
}

export function isOutOfBounds(p: Point): boolean {
  return p.x < 0 || p.y < 0 || p.x >= GRID_COLS || p.y >= GRID_ROWS
}

export function randomFood(snake: Point[], occupied: Point[] = snake): Point {
  const blocked = new Set(occupied.map((p) => `${p.x},${p.y}`))
  const free: Point[] = []
  for (let y = 0; y < GRID_ROWS; y++) {
    for (let x = 0; x < GRID_COLS; x++) {
      if (!blocked.has(`${x},${y}`)) free.push({ x, y })
    }
  }
  if (free.length === 0) {
    return { x: 0, y: 0 }
  }
  return free[Math.floor(Math.random() * free.length)]
}

export function initialSnake(): Point[] {
  const cx = Math.floor(GRID_COLS / 2)
  const cy = Math.floor(GRID_ROWS / 2)
  return [
    { x: cx, y: cy },
    { x: cx - 1, y: cy },
    { x: cx - 2, y: cy },
  ]
}

export function initialDirection(): Direction {
  return 'right'
}
