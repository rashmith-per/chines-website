let counter = 0

/** Collision-safe local id: prefix + time + counter. */
export const uid = (prefix = 'id') =>
  `${prefix}_${Date.now().toString(36)}${(counter++).toString(36)}${Math.random().toString(36).slice(2, 6)}`

/** Human friendly sequential codes like DP10245 / RS1025. */
export const sequenceCode = (prefix, existing = [], start = 10000) => {
  const max = existing.reduce((acc, code) => {
    const n = Number(String(code).replace(/\D/g, ''))
    return Number.isFinite(n) && n > acc ? n : acc
  }, start)
  return `${prefix}${max + 1}`
}

/** Deterministic PRNG so seeded demo data is stable between reloads. */
export function seeded(seed = 42) {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
