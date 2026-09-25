import { useState } from 'react'
import { downloadBackup, exportBackup, importBackup, validateBackupFile } from '../storage/backup'

interface BackupPanelProps {
  onRestored: () => void
}

export function BackupPanel({ onRestored }: BackupPanelProps) {
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleBackup = async () => {
    setError(null)
    setMessage(null)
    try {
      const file = await exportBackup()
      downloadBackup(file)
      setMessage('Backup downloaded. Keep this file somewhere safe.')
    } catch {
      setError('Could not create a backup. Please try again.')
    }
  }

  const handleLoad = () => {
    setError(null)
    setMessage(null)
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'application/json,.json'
    input.onchange = async () => {
      const picked = input.files?.[0]
      if (!picked) return
      try {
        const text = await picked.text()
        const parsed = JSON.parse(text) as unknown
        const file = validateBackupFile(parsed)
        if (!file) {
          setError('That file is not a valid Cordoval Snakes backup.')
          return
        }
        const ok = window.confirm(
          'Replace your saved data on this device with the backup? This cannot be undone.',
        )
        if (!ok) return
        await importBackup(file)
        onRestored()
        setMessage('Backup loaded. Your best score has been restored.')
      } catch {
        setError('Could not read that file. Check it is a Cordoval Snakes backup.')
      }
    }
    input.click()
  }

  return (
    <section className="panel backup-panel" aria-labelledby="backup-heading">
      <h2 id="backup-heading" className="panel-title">Backup and restore</h2>
      <p className="panel-lead">
        Your best score stays on this device. Download a backup file to move it elsewhere.
        Files never leave your browser until you save them.
      </p>
      <div className="button-row">
        <button type="button" className="btn btn-secondary" onClick={() => void handleBackup()}>
          Download backup
        </button>
        <button type="button" className="btn btn-secondary" onClick={handleLoad}>
          Load backup
        </button>
      </div>
      {message && <p className="notice notice--ok" role="status">{message}</p>}
      {error && <p className="notice notice--error" role="alert">{error}</p>}
    </section>
  )
}
