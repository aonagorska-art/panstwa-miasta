import { normalLetters } from './data'
import type { CategorySetId, Difficulty, TimeLimit } from './types'

export interface DailyChallenge {
  key: string
  label: string
  letters: string[]
  setId: CategorySetId
  difficulty: Difficulty
  timeLimit: TimeLimit
  rounds: 3
}

const pad = (value: number) => String(value).padStart(2, '0')
export const localDateKey = (date = new Date()) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`

const hash = (value: string) => [...value].reduce((result, character) => ((result << 5) - result + character.charCodeAt(0)) | 0, 0) >>> 0

export function createDailyChallenge(date = new Date()): DailyChallenge {
  const key = localDateKey(date)
  const seed = hash(key)
  const available = [...normalLetters]
  const letters = Array.from({ length: 3 }, (_, index) => available.splice((seed + index * 7) % available.length, 1)[0])
  const setId: CategorySetId = seed % 3 === 0 ? 'hard' : 'standard'
  return {
    key,
    label: new Intl.DateTimeFormat('pl-PL', { day: 'numeric', month: 'long' }).format(date),
    letters,
    setId,
    difficulty: setId === 'hard' ? 'nerd' : 'tourist',
    timeLimit: 90,
    rounds: 3
  }
}

export function previousDateKey(key: string) {
  const [year, month, day] = key.split('-').map(Number)
  const date = new Date(year, month - 1, day)
  date.setDate(date.getDate() - 1)
  return localDateKey(date)
}
