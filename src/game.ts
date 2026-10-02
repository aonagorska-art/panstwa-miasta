import { categorySets, chaosLetters, dictionary, funnyFragments, normalLetters, quips } from './data'
import type { Category, Difficulty, RoundResult, RowResult, Settings } from './types'

export const normalize = (value: string) => value.normalize('NFC').trim().replace(/\s+/g, ' ').toLocaleLowerCase('pl-PL')
export const normalizeForLookup = (value: string) => normalize(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ł/g, 'l')
export const initialLetter = (value: string) => normalize(value).charAt(0).toLocaleUpperCase('pl-PL')
export const startsWithLetter = (value: string, letter: string) => initialLetter(value) === letter.toLocaleUpperCase('pl-PL')
export const sameAnswer = (a: string, b: string) => Boolean(normalize(a)) && normalizeForLookup(a) === normalizeForLookup(b)

export function drawLetter(used: string[], chaos: boolean, random = Math.random): string {
  const pool = (chaos ? chaosLetters : normalLetters).filter((letter) => !used.includes(letter))
  const available = pool.length ? pool : (chaos ? chaosLetters : normalLetters)
  return available[Math.floor(random() * available.length)]
}

export function inDictionary(categoryId: string, value: string): boolean {
  return Object.values(dictionary[categoryId] ?? {}).flat().some((item) => normalizeForLookup(item) === normalizeForLookup(value))
}

export function belongsToAnotherCategory(categoryId: string, value: string): boolean {
  return Object.entries(dictionary).some(([otherId, entries]) => otherId !== categoryId && Object.values(entries).flat().some((item) => normalizeForLookup(item) === normalizeForLookup(value)))
}

const accuracy: Record<Difficulty, number> = { tourist: .54, nerd: .78, omniscient: .94 }
export function shouldBotAnswer(difficulty: Difficulty, random = Math.random) { return random() < accuracy[difficulty] }

function funnyAnswer(categoryId: string, letter: string, random = Math.random): string {
  const parts = funnyFragments[categoryId]
  if (!parts) return ''
  const matching = parts.starts.filter((part) => initialLetter(part) === letter)
  if (!matching.length) return ''
  const start = matching[Math.floor(random() * matching.length)]
  const end = parts.ends[Math.floor(random() * parts.ends.length)]
  return `${start} ${end}`.trim()
}

export function botAnswer(category: Category, letter: string, difficulty: Difficulty, used: Set<string>, random = Math.random): string {
  if (!shouldBotAnswer(difficulty, random)) return ''
  const source = category.funny ? [funnyAnswer(category.id, letter, random)] : (dictionary[category.id]?.[letter] ?? [])
  const fresh = source.filter((answer) => answer && !used.has(normalize(answer)))
  const fallback = source.filter(Boolean)
  const choices = fresh.length ? fresh : fallback
  if (!choices.length) return ''
  const index = difficulty === 'tourist' ? 0 : Math.floor(random() * choices.length)
  const answer = choices[index]
  used.add(normalize(answer))
  return answer
}

const pick = (items: string[], seed: number) => items[seed % items.length]
export function scoreRow(category: Category, player: string, bot: string, letter: string, acceptedOverride?: boolean | null): RowResult {
  const startsCorrectly = startsWithLetter(player, letter)
  const known = category.funny ? false : inDictionary(category.id, player)
  const wrongCategory = !category.funny && !known && belongsToAnotherCategory(category.id, player)
  const accepted = !player ? false : !startsCorrectly || wrongCategory ? false : acceptedOverride ?? (category.funny ? null : known ? true : null)
  const botValid = Boolean(bot) && startsWithLetter(bot, letter)
  const playerValid = accepted === true
  const tied = playerValid && botValid && sameAnswer(player, bot)
  return {
    category, player, bot,
    verdict: { accepted, startsCorrectly, inDictionary: known },
    playerPoints: playerValid ? (tied ? 5 : 10) : 0,
    botPoints: botValid ? (tied ? 5 : 10) : 0,
    comment: !player ? pick(quips.empty, category.id.length) : wrongCategory ? 'Litera się zgadza, kategoria już nie. To odpowiedź z innej szuflady.' : accepted === null ? pick(quips.review, category.label.length) : playerValid ? pick(quips.correct, player.length) : 'Pierwsza litera zgłasza formalny sprzeciw.'
  }
}

export function scoreRound(round: number, letter: string, settings: Settings, answers: Record<string, string>, botAnswers: Record<string, string>, overrides: Record<string, boolean | null> = {}): RoundResult {
  const rows = categorySets[settings.setId].categories.map((category) => scoreRow(category, answers[category.id] ?? '', botAnswers[category.id] ?? '', letter, overrides[category.id]))
  return { round, letter, rows, playerPoints: rows.reduce((sum, row) => sum + row.playerPoints, 0), botPoints: rows.reduce((sum, row) => sum + row.botPoints, 0) }
}

export function recalculateRound(result: RoundResult, categoryId: string, accepted: boolean): RoundResult {
  const rows = result.rows.map((row) => row.category.id === categoryId ? scoreRow(row.category, row.player, row.bot, result.letter, accepted) : row)
  return { ...result, rows, playerPoints: rows.reduce((sum, row) => sum + row.playerPoints, 0), botPoints: rows.reduce((sum, row) => sum + row.botPoints, 0) }
}

export function generateBotRound(settings: Settings, letter: string, used: Set<string>, random = Math.random): Record<string, string> {
  return Object.fromEntries(categorySets[settings.setId].categories.map((category) => [category.id, botAnswer(category, letter, settings.difficulty, used, random)]))
}
