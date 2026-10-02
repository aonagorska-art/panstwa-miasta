export type CategorySetId = 'standard' | 'hard' | 'funny'
export type Difficulty = 'tourist' | 'nerd' | 'omniscient'
export type Screen = 'home' | 'config' | 'play' | 'review' | 'summary'
export type TimeLimit = 0 | 60 | 90 | 120

export interface Category { id: string; label: string; funny?: boolean }
export interface Settings { setId: CategorySetId; difficulty: Difficulty; timeLimit: TimeLimit; rounds: 3 | 5 | 10; sound: boolean; chaos: boolean; motion: boolean }
export interface AnswerVerdict { accepted: boolean | null; startsCorrectly: boolean; inDictionary: boolean }
export interface RowResult { category: Category; player: string; bot: string; verdict: AnswerVerdict; playerPoints: number; botPoints: number; comment: string }
export interface RoundResult { round: number; letter: string; rows: RowResult[]; playerPoints: number; botPoints: number }
export interface ActiveGame { settings: Settings; round: number; usedLetters: string[]; playerScore: number; botScore: number; letter: string; answers: Record<string, string>; results: RoundResult[]; startedAt: number; timeLeft: number }
export interface Stats { games: number; wins: number; losses: number; draws: number; bestScore: number; favoriteSets: Record<CategorySetId, number>; winStreak: number; bestWinStreak: number }
