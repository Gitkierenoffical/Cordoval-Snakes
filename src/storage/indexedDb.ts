import {
  DB_NAME,
  DB_VERSION,
  STORE_NAME,
  type AppStateKey,
} from './constants'

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)
    request.onerror = () => reject(request.error ?? new Error('Failed to open IndexedDB'))
    request.onsuccess = () => resolve(request.result)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME)
      }
    }
  })
}

export async function getValue<T>(key: AppStateKey): Promise<T | undefined> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const store = tx.objectStore(STORE_NAME)
    const req = store.get(key)
    req.onerror = () => reject(req.error ?? new Error('get failed'))
    req.onsuccess = () => resolve(req.result as T | undefined)
    tx.oncomplete = () => db.close()
    tx.onerror = () => {
      db.close()
      reject(tx.error)
    }
  })
}

export async function setValue(key: AppStateKey, value: unknown): Promise<void> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const req = store.put(value, key)
    req.onerror = () => reject(req.error ?? new Error('put failed'))
    tx.oncomplete = () => {
      db.close()
      resolve()
    }
    tx.onerror = () => {
      db.close()
      reject(tx.error)
    }
  })
}

export async function getAllEntries(): Promise<Record<string, unknown>> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const store = tx.objectStore(STORE_NAME)
    const req = store.getAll()
    req.onerror = () => reject(req.error ?? new Error('getAll failed'))
    req.onsuccess = () => {
      const values = req.result as unknown[]
      const keysReq = store.getAllKeys()
      keysReq.onerror = () => reject(keysReq.error ?? new Error('getAllKeys failed'))
      keysReq.onsuccess = () => {
        const keys = keysReq.result as string[]
        const data: Record<string, unknown> = {}
        keys.forEach((k, i) => {
          data[k] = values[i]
        })
        resolve(data)
      }
    }
    tx.oncomplete = () => db.close()
    tx.onerror = () => {
      db.close()
      reject(tx.error)
    }
  })
}

export async function replaceAllEntries(data: Record<string, unknown>): Promise<void> {
  const db = await openDb()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const clearReq = store.clear()
    clearReq.onerror = () => reject(clearReq.error ?? new Error('clear failed'))
    clearReq.onsuccess = () => {
      for (const [key, value] of Object.entries(data)) {
        store.put(value, key)
      }
    }
    tx.oncomplete = () => {
      db.close()
      resolve()
    }
    tx.onerror = () => {
      db.close()
      reject(tx.error)
    }
  })
}

const PERSIST_FLAG_KEY = 'cordoval-snakes-persist-attempted'

export function hasAttemptedPersist(): boolean {
  try {
    return sessionStorage.getItem(PERSIST_FLAG_KEY) === '1'
  } catch {
    return true
  }
}

export function markPersistAttempted(): void {
  try {
    sessionStorage.setItem(PERSIST_FLAG_KEY, '1')
  } catch {
    /* ignore */
  }
}

export async function requestStoragePersist(): Promise<boolean> {
  if (!navigator.storage?.persist) {
    return false
  }
  try {
    return await navigator.storage.persist()
  } catch {
    return false
  }
}
