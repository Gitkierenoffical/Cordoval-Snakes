import {
  BACKUP_FORMAT_VERSION,
  PRODUCT_SLUG,
  type BackupFile,
} from './constants'
import { getAllEntries, replaceAllEntries } from './indexedDb'

export function buildBackupPayload(data: Record<string, unknown>): BackupFile {
  return {
    formatVersion: BACKUP_FORMAT_VERSION,
    productSlug: PRODUCT_SLUG,
    exportedAt: new Date().toISOString(),
    data,
  }
}

export function validateBackupFile(raw: unknown): BackupFile | null {
  if (!raw || typeof raw !== 'object') return null
  const o = raw as Record<string, unknown>
  if (o.formatVersion !== BACKUP_FORMAT_VERSION) return null
  if (o.productSlug !== PRODUCT_SLUG) return null
  if (typeof o.data !== 'object' || o.data === null) return null
  return raw as BackupFile
}

export async function exportBackup(): Promise<BackupFile> {
  const data = await getAllEntries()
  return buildBackupPayload(data)
}

export function downloadBackup(file: BackupFile): void {
  const blob = new Blob([JSON.stringify(file, null, 2)], {
    type: 'application/json',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  const date = new Date().toISOString().slice(0, 10)
  a.href = url
  a.download = `cordoval-snakes-backup-${date}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export async function importBackup(file: BackupFile): Promise<void> {
  await replaceAllEntries(file.data)
}
