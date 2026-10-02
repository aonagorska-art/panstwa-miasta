import type { ActiveGame, Settings, Stats } from './types'

export const defaultSettings: Settings = { setId: 'standard', difficulty: 'nerd', timeLimit: 90, rounds: 5, sound: true, chaos: false, motion: true }
export const defaultStats: Stats = { games: 0, wins: 0, losses: 0, draws: 0, bestScore: 0, favoriteSets: { standard: 0, hard: 0, funny: 0 }, winStreak: 0, bestWinStreak: 0 }

function read<T>(key: string, fallback: T): T {
  try { const raw = localStorage.getItem(key); return raw ? JSON.parse(raw) as T : fallback } catch { return fallback }
}
function write<T>(key: string, value: T) { localStorage.setItem(key, JSON.stringify(value)) }

export const loadSettings = () => read('pm-settings', defaultSettings)
export const saveSettings = (value: Settings) => write('pm-settings', value)
export const loadStats = () => read('pm-stats', defaultStats)
export const saveStats = (value: Stats) => write('pm-stats', value)
export const loadGame = () => read<ActiveGame | null>('pm-game', null)
export const saveGame = (value: ActiveGame) => write('pm-game', value)
export const clearGame = () => localStorage.removeItem('pm-game')
export const clearStats = () => { localStorage.removeItem('pm-stats'); return defaultStats }
