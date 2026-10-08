import { funnyFragments, quips } from './data'
import { dictionaries, displayEntry, entryVariants, getCategorySets, learnedKey, lettersByLanguage, polishChaosLetters } from './language'
import type { Category, Difficulty, GameLanguage, LearnedAnswers, RoundResult, RowResult, Settings } from './types'

export const normalize = (value: string) => value.normalize('NFC').trim().replace(/\s+/g, ' ').toLocaleLowerCase('pl-PL')
export const normalizeForLookup = (value: string) => normalize(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ł/g, 'l')
export const initialLetter = (value: string) => normalize(value).charAt(0).toLocaleUpperCase('pl-PL')
export const startsWithLetter = (value: string, letter: string) => initialLetter(value) === letter.toLocaleUpperCase('pl-PL')
export const sameAnswer = (a: string, b: string) => Boolean(normalize(a)) && normalizeForLookup(a) === normalizeForLookup(b)

export function drawLetter(used: string[], chaos: boolean, random = Math.random, language: GameLanguage = 'pl'): string {
  const languageLetters = lettersByLanguage[language]
  const fullPool = chaos && language === 'pl' ? [...languageLetters, ...polishChaosLetters] : languageLetters
  const pool = fullPool.filter((letter) => !used.includes(letter))
  const available = pool.length ? pool : fullPool
  return available[Math.floor(random() * available.length)]
}

const matchesEntry = (entry: string, value: string) => entryVariants(entry).some((variant) => normalizeForLookup(variant) === normalizeForLookup(value))
const matchingEntry = (categoryId: string, value: string, language: GameLanguage) => Object.values(dictionaries[language][categoryId] ?? {}).flat().find((entry) => matchesEntry(entry, value))

export function inDictionary(categoryId: string, value: string, language: GameLanguage = 'pl'): boolean {
  return Boolean(matchingEntry(categoryId, value, language))
}

export function belongsToAnotherCategory(categoryId: string, value: string, language: GameLanguage = 'pl'): boolean {
  return Object.entries(dictionaries[language]).some(([otherId, entries]) => otherId !== categoryId && Object.values(entries).flat().some((item) => matchesEntry(item, value)))
}

const accuracy: Record<Difficulty, number> = { tourist: .70, nerd: .90, omniscient: .98 }
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

export function botAnswer(category: Category, letter: string, difficulty: Difficulty, used: Set<string>, random = Math.random, language: GameLanguage = 'pl'): string {
  if (!shouldBotAnswer(difficulty, random)) return ''
  const source = category.funny ? [funnyAnswer(category.id, letter, random)] : (dictionaries[language][category.id]?.[letter] ?? [])
  const fresh = source.filter((answer) => answer && !used.has(normalize(answer)))
  const fallback = source.filter(Boolean)
  const choices = fresh.length ? fresh : fallback
  if (!choices.length) return ''
  const index = difficulty === 'tourist' ? 0 : Math.floor(random() * choices.length)
  const answer = choices[index]
  used.add(normalize(answer))
  return displayEntry(answer)
}

const pick = (items: string[], seed: number) => items[seed % items.length]
export function scoreRow(category: Category, player: string, bot: string, letter: string, acceptedOverride?: boolean | null, learned: LearnedAnswers = {}, language: GameLanguage = 'pl'): RowResult {
  const entry = matchingEntry(category.id, player, language)
  const learnedLocally = (learned[learnedKey(language, category.id)] ?? (language === 'pl' ? learned[category.id] : []) ?? []).some((item) => normalizeForLookup(item) === normalizeForLookup(player))
  const known = learnedLocally || (!category.funny && Boolean(entry))
  const hanziInput = language === 'zh' && /[\u3400-\u9fff]/u.test(player)
  const startsCorrectly = hanziInput ? (entry ? entryVariants(entry).some((variant) => initialLetter(variant) === letter) : true) : startsWithLetter(player, letter)
  const wrongCategory = !category.funny && !known && belongsToAnotherCategory(category.id, player, language)
  const accepted = !player ? false : !startsCorrectly || wrongCategory ? false : category.funny ? true : acceptedOverride ?? (known ? true : null)
  const botEntry = matchingEntry(category.id, bot, language)
  const botValid = Boolean(bot) && (language === 'zh' ? Boolean(botEntry && entryVariants(botEntry).some((variant) => initialLetter(variant) === letter)) : startsWithLetter(bot, letter))
  const playerValid = accepted === true
  const playerCanonical = entry ? displayEntry(entry) : player
  const botCanonical = botEntry ? displayEntry(botEntry) : bot
  const tied = playerValid && botValid && sameAnswer(playerCanonical, botCanonical)
  return {
    category, player, bot,
    verdict: { accepted, startsCorrectly, inDictionary: known },
    playerPoints: playerValid ? (tied ? 5 : 10) : 0,
    botPoints: botValid ? (tied ? 5 : 10) : 0,
    comment: !player ? pick(quips.empty, category.id.length) : wrongCategory ? 'Litera się zgadza, kategoria już nie. To odpowiedź z innej szuflady.' : accepted === null ? pick(quips.review, category.label.length) : playerValid ? pick(quips.correct, player.length) : 'Pierwsza litera zgłasza formalny sprzeciw.'
  }
}

export function scoreRound(round: number, letter: string, settings: Settings, answers: Record<string, string>, botAnswers: Record<string, string>, overrides: Record<string, boolean | null> = {}, learned: LearnedAnswers = {}): RoundResult {
  const rows = getCategorySets(settings.language)[settings.setId].categories.map((category) => scoreRow(category, answers[category.id] ?? '', botAnswers[category.id] ?? '', letter, overrides[category.id], learned, settings.language))
  return { round, letter, rows, playerPoints: rows.reduce((sum, row) => sum + row.playerPoints, 0), botPoints: rows.reduce((sum, row) => sum + row.botPoints, 0) }
}

export function recalculateRound(result: RoundResult, categoryId: string, accepted: boolean, language: GameLanguage = 'pl'): RoundResult {
  const rows = result.rows.map((row) => row.category.id === categoryId ? scoreRow(row.category, row.player, row.bot, result.letter, accepted, {}, language) : row)
  return { ...result, rows, playerPoints: rows.reduce((sum, row) => sum + row.playerPoints, 0), botPoints: rows.reduce((sum, row) => sum + row.botPoints, 0) }
}

export function generateBotRound(settings: Settings, letter: string, used: Set<string>, random = Math.random): Record<string, string> {
  return Object.fromEntries(getCategorySets(settings.language)[settings.setId].categories.map((category) => [category.id, botAnswer(category, letter, settings.difficulty, used, random, settings.language)]))
}
