export const DB_NAME = 'cordoval-snakes'
export const DB_VERSION = 1
export const STORE_NAME = 'app-state'

export const BACKUP_FORMAT_VERSION = 1
export const PRODUCT_SLUG = 'snakes'

export const KEYS = {
  bestScore: 'bestScore',
  backupMeta: 'backupMeta',
} as const

export type AppStateKey = (typeof KEYS)[keyof typeof KEYS]

export interface BackupFile {
  formatVersion: number
  productSlug: string
  exportedAt: string
  data: Record<string, unknown>
}
