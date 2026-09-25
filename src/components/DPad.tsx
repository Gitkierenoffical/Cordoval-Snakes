import type { Direction } from '../game/types'

interface DPadProps {
  onDirection: (dir: Direction) => void
  disabled?: boolean
}

export function DPad({ onDirection, disabled }: DPadProps) {
  const btn = (dir: Direction, label: string, className: string) => (
    <button
      type="button"
      className={`dpad-btn ${className}`}
      aria-label={label}
      disabled={disabled}
      onPointerDown={(e) => {
        e.preventDefault()
        onDirection(dir)
      }}
    >
      <span aria-hidden="true">{label === 'Up' ? '▲' : label === 'Down' ? '▼' : label === 'Left' ? '◀' : '▶'}</span>
    </button>
  )

  return (
    <div className="dpad" aria-label="Direction controls">
      <div className="dpad-row">
        {btn('up', 'Up', 'dpad-up')}
      </div>
      <div className="dpad-row dpad-row--middle">
        {btn('left', 'Left', 'dpad-left')}
        <div className="dpad-centre" aria-hidden="true" />
        {btn('right', 'Right', 'dpad-right')}
      </div>
      <div className="dpad-row">
        {btn('down', 'Down', 'dpad-down')}
      </div>
    </div>
  )
}
