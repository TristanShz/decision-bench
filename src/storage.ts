export function load<T>(key: string, fallback: T): T {
  try {
    const v = localStorage.getItem(key)
    return v ? (JSON.parse(v) as T) : fallback
  } catch {
    return fallback
  }
}

export function save(key: string, value: unknown, fallback?: () => unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // Quota dépassé (images en base64) : on retente sans les données lourdes.
    if (fallback) save(key, fallback())
  }
}

export const DEFAULT_URL: string = import.meta.env.VITE_SYSTEMONE_URL ?? 'http://localhost:8080'
