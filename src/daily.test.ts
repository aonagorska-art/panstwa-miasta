import { describe, expect, it } from 'vitest'
import { createDailyChallenge, localDateKey, previousDateKey } from './daily'

describe('dzisiejsze wyzwanie', () => {
  it('tworzy ten sam zestaw dla tej samej daty', () => {
    const date = new Date(2026, 9, 4)
    expect(createDailyChallenge(date)).toEqual(createDailyChallenge(date))
    expect(createDailyChallenge(date).letters).toHaveLength(3)
    expect(new Set(createDailyChallenge(date).letters).size).toBe(3)
  })
  it('używa lokalnej daty i poprawnie wskazuje poprzedni dzień', () => {
    expect(localDateKey(new Date(2026, 9, 4))).toBe('2026-10-04')
    expect(previousDateKey('2026-10-01')).toBe('2026-09-30')
  })
})
