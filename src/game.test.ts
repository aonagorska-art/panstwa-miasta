import { beforeEach, describe, expect, it, vi } from 'vitest'
import { botAnswer, drawLetter, inDictionary, normalize, recalculateRound, sameAnswer, scoreRound, shouldBotAnswer, startsWithLetter } from './game'
import { categorySets, chaosLetters, normalLetters } from './data'
import { defaultSettings, loadGame, saveGame } from './storage'
import type { ActiveGame } from './types'

describe('litery i normalizacja', () => {
  it('losuje literę z właściwej puli', () => {
    expect(normalLetters).toContain(drawLetter([], false, () => 0))
    expect(chaosLetters).toContain(drawLetter([], true, () => .999))
  })
  it('nie powtarza litery przed wyczerpaniem puli', () => {
    const used = normalLetters.slice(0, -1)
    expect(drawLetter(used, false, () => 0)).toBe(normalLetters.at(-1))
  })
  it('czyści spacje, wielkość liter i zapis Unicode', () => {
    expect(normalize('  ŻÓŁTY   DOM ')).toBe('żółty dom')
    expect(normalize('Żaba')).toBe(normalize('Żaba'))
  })
  it('sprawdza pierwszą polską literę', () => {
    expect(startsWithLetter('  Łódź', 'Ł')).toBe(true)
    expect(startsWithLetter('Lublin', 'Ł')).toBe(false)
  })
  it('wykrywa identyczne odpowiedzi', () => expect(sameAnswer(' Nowy   Sącz ', 'nowy sącz')).toBe(true))
})

describe('punktacja', () => {
  it('daje 10 punktów za inną poprawną odpowiedź', () => {
    const result = scoreRound(1, 'K', defaultSettings, { city: 'Kraków' }, { city: 'Katowice' })
    expect(result.rows.find((row) => row.category.id === 'city')?.playerPoints).toBe(10)
  })
  it('daje 5 punktów za taką samą poprawną odpowiedź', () => {
    const result = scoreRound(1, 'K', defaultSettings, { city: 'Kraków' }, { city: 'kraków' })
    expect(result.rows.find((row) => row.category.id === 'city')?.playerPoints).toBe(5)
  })
  it('poprawnie rozdziela punkty, gdy gracz zna odpowiedź, a Balbina nie', () => {
    const result = scoreRound(1, 'D', defaultSettings, { plant: 'Dąb' }, { plant: '' })
    const plant = result.rows.find((row) => row.category.id === 'plant')
    expect(plant?.verdict.accepted).toBe(true)
    expect(plant?.playerPoints).toBe(10)
    expect(plant?.botPoints).toBe(0)
  })
  it('uznaje popularne odpowiedzi i zapis bez polskich znaków', () => {
    expect(inDictionary('plant', 'dąb')).toBe(true)
    expect(inDictionary('plant', 'dab')).toBe(true)
    expect(inDictionary('thing', 'odkurzacz')).toBe(true)
    expect(inDictionary('job', 'programista')).toBe(true)
  })
  it('odrzuca złą pierwszą literę', () => {
    const result = scoreRound(1, 'K', defaultSettings, { city: 'Warszawa' }, { city: 'Katowice' })
    expect(result.rows.find((row) => row.category.id === 'city')?.playerPoints).toBe(0)
  })
  it('odrzuca poprawną literę, gdy odpowiedź należy do innej kategorii', () => {
    const result = scoreRound(1, 'W', defaultSettings, { plant: 'wuzetka' }, { plant: 'wierzba' })
    const plant = result.rows.find((row) => row.category.id === 'plant')
    expect(plant?.verdict.accepted).toBe(false)
    expect(plant?.playerPoints).toBe(0)
  })
  it('przelicza ręcznie uznaną odpowiedź', () => {
    const result = scoreRound(1, 'K', defaultSettings, { city: 'Kozia Wólka' }, { city: 'Katowice' })
    expect(result.rows.find((row) => row.category.id === 'city')?.verdict.accepted).toBeNull()
    expect(recalculateRound(result, 'city', true).rows.find((row) => row.category.id === 'city')?.playerPoints).toBe(10)
  })
})

describe('bot', () => {
  it('ma różne progi trudności', () => {
    expect(shouldBotAnswer('tourist', () => .7)).toBe(false)
    expect(shouldBotAnswer('nerd', () => .7)).toBe(true)
    expect(shouldBotAnswer('omniscient', () => .9)).toBe(true)
  })
  it('unika świeżo użytej odpowiedzi, gdy ma wybór', () => {
    const used = new Set<string>()
    const category = categorySets.standard.categories.find((item) => item.id === 'city')!
    const first = botAnswer(category, 'K', 'omniscient', used, () => 0)
    const second = botAnswer(category, 'K', 'omniscient', used, () => 0)
    expect(first).not.toBe(second)
  })
  it('generator zabawny zachowuje literę', () => {
    const category = categorySets.funny.categories.find((item) => item.id === 'pet')!
    expect(startsWithLetter(botAnswer(category, 'K', 'omniscient', new Set(), () => 0), 'K')).toBe(true)
  })
  it('używa nowej kategorii o przełożonym', () => {
    const category = categorySets.funny.categories.find((item) => item.id === 'boss')!
    expect(category.label).toBe('Co chcesz usłyszeć od przełożonego')
    expect(categorySets.funny.categories.some((item) => item.id === 'promo')).toBe(false)
    expect(startsWithLetter(botAnswer(category, 'A', 'omniscient', new Set(), () => 0), 'A')).toBe(true)
  })
})

describe('zapis gry', () => {
  beforeEach(() => {
    const store = new Map<string, string>()
    vi.stubGlobal('localStorage', { getItem: (key: string) => store.get(key) ?? null, setItem: (key: string, value: string) => store.set(key, value), removeItem: (key: string) => store.delete(key) })
  })
  it('zapisuje i odczytuje rozpoczętą grę', () => {
    const game: ActiveGame = { settings: defaultSettings, round: 1, usedLetters: ['K'], playerScore: 0, botScore: 0, letter: 'K', answers: { city: 'Kraków' }, results: [], startedAt: 1, timeLeft: 90 }
    saveGame(game)
    expect(loadGame()?.answers.city).toBe('Kraków')
  })
})
