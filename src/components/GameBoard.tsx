import type { ReactNode } from 'react'
import type { Point } from '../game/types'
import { GRID_COLS, GRID_ROWS } from '../game/types'

interface GameBoardProps {
  snake: Point[]
  food: Point
  gameOver: boolean
}

export function GameBoard({ snake, food, gameOver }: GameBoardProps) {
  const snakeSet = new Set(snake.map((p) => `${p.x},${p.y}`))
  const head = snake[0]

  const cells: ReactNode[] = []
  for (let y = 0; y < GRID_ROWS; y++) {
    for (let x = 0; x < GRID_COLS; x++) {
      const key = `${x},${y}`
      const isHead = head && head.x === x && head.y === y
      const isBody = snakeSet.has(key) && !isHead
      const isFood = food.x === x && food.y === y
      let className = 'cell'
      if (isHead) className += ' cell-head'
      else if (isBody) className += ' cell-body'
      else if (isFood) className += ' cell-food'
      cells.push(<div key={key} className={className} />)
    }
  }

  return (
    <div
      className={`game-board${gameOver ? ' game-board--over' : ''}`}
      style={{
        gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
        gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)`,
      }}
      role="img"
      aria-label="Snake game board"
    >
      {cells}
      {gameOver && (
        <div className="game-over-overlay" aria-live="polite">
          <p className="game-over-title">Game over</p>
        </div>
      )}
    </div>
  )
}
