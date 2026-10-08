import type { ActiveGame, LearnedAnswers, Settings, Stats } from './types'

export const defaultSettings: Settings = { setId: 'standard', difficulty: 'nerd', timeLimit: 90, rounds: 5, sound: true, chaos: false, motion: true, language: 'pl' }
export const defaultStats: Stats = { games: 0, wins: 0, losses: 0, draws: 0, bestScore: 0, favoriteSets: { standard: 0, hard: 0, funny: 0 }, winStreak: 0, bestWinStreak: 0, recentGames: [], daily: { lastCompleted: null, streak: 0, bestStreak: 0, scores: {} } }

function read<T>(key: string, fallback: T): T {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) as T : fallback } catch { return fallback }
}
function write<T>(key: string, value: T) { localStorage.setItem(key, JSON.stringify(value)) }

export const loadSettings = () => ({ ...defaultSettings, ...read<Partial<Settings>>('pm-settings', {}) })
export const saveSettings = (value: Settings) => write('pm-settings', value)
export const loadStats = () => {
  const stored = read<Partial<Stats>>('pm-stats', {})
  return {
    ...defaultStats,
    ...stored,
    favoriteSets: { ...defaultStats.favoriteSets, ...(stored.favoriteSets ?? {}) },
    recentGames: Array.isArray(stored.recentGames) ? stored.recentGames : [],
    daily: { ...defaultStats.daily, ...(stored.daily ?? {}), scores: { ...defaultStats.daily.scores, ...(stored.daily?.scores ?? {}) } }
  }
}
export const saveStats = (value: Stats) => write('pm-stats', value)
export const loadGame = () => {
  const game = read<ActiveGame | null>('pm-game', null)
  return game ? { ...game, settings: { ...defaultSettings, ...game.settings } } : null
}
export const saveGame = (value: ActiveGame) => write('pm-game', value)
export const clearGame = () => localStorage.removeItem('pm-game')
export const clearStats = () => { localStorage.removeItem('pm-stats'); return defaultStats }
export const loadLearnedAnswers = () => read<LearnedAnswers>('pm-learned-answers', {})
export const saveLearnedAnswer = (categoryId: string, answer: string, language: Settings['language'] = 'pl') => {
  const learned = loadLearnedAnswers()
  const key = `${language}:${categoryId}`
  const current = learned[key] ?? learned[categoryId] ?? []
  if (!current.some((item) => item.toLocaleLowerCase('pl-PL') === answer.trim().toLocaleLowerCase('pl-PL'))) {
    learned[key] = [...current, answer.trim()]
    write('pm-learned-answers', learned)
  }
  return learned
}
