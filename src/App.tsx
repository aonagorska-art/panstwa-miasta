import { useEffect, useRef, useState } from 'react'
import ArrowLeft from 'lucide-react/dist/esm/icons/arrow-left'
import BarChart3 from 'lucide-react/dist/esm/icons/bar-chart-3'
import Check from 'lucide-react/dist/esm/icons/check'
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right'
import Clock3 from 'lucide-react/dist/esm/icons/clock-3'
import Compass from 'lucide-react/dist/esm/icons/compass'
import Gamepad2 from 'lucide-react/dist/esm/icons/gamepad-2'
import HelpCircle from 'lucide-react/dist/esm/icons/help-circle'
import Home from 'lucide-react/dist/esm/icons/home'
import LogOut from 'lucide-react/dist/esm/icons/log-out'
import MapIcon from 'lucide-react/dist/esm/icons/map'
import Medal from 'lucide-react/dist/esm/icons/medal'
import RotateCcw from 'lucide-react/dist/esm/icons/rotate-ccw'
import SettingsIcon from 'lucide-react/dist/esm/icons/settings'
import ShieldCheck from 'lucide-react/dist/esm/icons/shield-check'
import Sparkles from 'lucide-react/dist/esm/icons/sparkles'
import Trophy from 'lucide-react/dist/esm/icons/trophy'
import Volume2 from 'lucide-react/dist/esm/icons/volume-2'
import VolumeX from 'lucide-react/dist/esm/icons/volume-x'
import X from 'lucide-react/dist/esm/icons/x'
import Zap from 'lucide-react/dist/esm/icons/zap'
import { createDailyChallenge, previousDateKey, type DailyChallenge } from './daily'
import { categorySets, quips } from './data'
import { drawLetter, generateBotRound, recalculateRound, scoreRound } from './game'
import { availableSetIds, getCategorySets, languageOptions } from './language'
import { clearGame, clearStats, defaultStats, loadGame, loadLearnedAnswers, loadSettings, loadStats, saveGame, saveLearnedAnswer, saveSettings, saveStats } from './storage'
import type { ActiveGame, CategorySetId, Difficulty, GameLanguage, RoundResult, Screen, Settings, Stats, TimeLimit } from './types'

const difficultyLabels: Record<Difficulty, { name: string; note: string }> = {
  tourist: { name: 'Turystka', note: 'Zna drogę do kuchni. Resztę różnie.' },
  nerd: { name: 'Kujonka', note: 'Czyta atlas dla fabuły.' },
  omniscient: { name: 'Podejrzanie wszechwiedząca', note: 'Wie za dużo. Nie pytamy skąd.' }
}
const randomItem = (items: string[]) => items[Math.floor(Math.random() * items.length)]
const formatTime = (seconds: number) => `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`
const modeKicker: Record<CategorySetId, string> = { standard: 'DOBRY POCZĄTEK', hard: 'DLA AMBITNYCH', funny: 'ABSURD PO GODZINACH' }
const modeDetails: Record<CategorySetId, { duration: string; mood: string; art: string }> = {
  standard: { duration: 'około 4 min', mood: 'spokojne tempo', art: '/balbina-editorial.png' },
  hard: { duration: 'około 7 min', mood: 'więcej myślenia', art: '/balbina-editorial.png' },
  funny: { duration: 'około 6 min', mood: 'nieoczywiste', art: '/balbina-editorial.png' }
}
type PlayPreset = { id: string; kicker: string; name: string; note: string; settings: Pick<Settings, 'setId' | 'difficulty' | 'timeLimit' | 'rounds' | 'chaos'> }
const playPresets: PlayPreset[] = [
  { id: 'quick', kicker: 'NA SZYBKO', name: 'Trzy rundy i po sprawie', note: 'Klasyczny zestaw, minuta na rundę.', settings: { setId: 'standard', difficulty: 'tourist', timeLimit: 60, rounds: 3, chaos: false } },
  { id: 'after-hours', kicker: 'PO PRACY', name: 'Bez pośpiechu', note: 'Pięć rund bez zegarka i bez presji.', settings: { setId: 'standard', difficulty: 'nerd', timeLimit: 0, rounds: 5, chaos: false } },
  { id: 'controlled-chaos', kicker: 'ABSURD KONTROLOWANY', name: 'Logika ma dziś wolne', note: 'Niekonwencjonalne kategorie, krótkie tempo.', settings: { setId: 'funny', difficulty: 'tourist', timeLimit: 90, rounds: 3, chaos: false } },
  { id: 'balbina-challenge', kicker: 'WYZWANIE BALBINY', name: 'Dla naprawdę ambitnych', note: 'Trudne pytania i Balbina w najwyższej formie.', settings: { setId: 'hard', difficulty: 'omniscient', timeLimit: 60, rounds: 5, chaos: true } }
]

type PresetRecommendation = { preset: PlayPreset; reason: string }

function personalizedPresets(stats: Stats): PresetRecommendation[] {
  if (stats.games < 3) return [
    { preset: playPresets[0], reason: stats.games ? 'Dobry kierunek na kolejną grę' : 'Najlepszy wariant na początek' },
    { preset: playPresets[2], reason: 'Spróbuj mniej oczywistych kategorii' },
    { preset: playPresets[3], reason: 'Wyzwanie na później' }
  ]
  const favoriteSet = (Object.entries(stats.favoriteSets) as [CategorySetId, number][]).sort((a, b) => b[1] - a[1])[0][0]
  const leastPlayedSet = (Object.entries(stats.favoriteSets) as [CategorySetId, number][]).sort((a, b) => a[1] - b[1])[0][0]
  const winRate = stats.games ? stats.wins / stats.games : 0
  const candidates: PresetRecommendation[] = [
    { preset: playPresets.find((item) => item.settings.setId === favoriteSet) ?? playPresets[0], reason: `Najczęściej wybierasz: ${categorySets[favoriteSet].name.toLowerCase()}` },
    { preset: winRate >= .55 ? playPresets[3] : playPresets[0], reason: winRate >= .55 ? 'Twoje wyniki proszą o trudniejszą próbę' : 'Dobry wariant na odzyskanie serii' },
    { preset: playPresets.find((item) => item.settings.setId === leastPlayedSet) ?? playPresets[2], reason: `Tego wariantu próbujesz najrzadziej` }
  ]
  return candidates.filter((item, index) => candidates.findIndex((candidate) => candidate.preset.id === item.preset.id) === index).slice(0, 3)
}

function nextRecommendation(game: ActiveGame): PresetRecommendation {
  const won = game.playerScore > game.botScore
  if (game.source === 'daily') return won
    ? { preset: playPresets[3], reason: 'Dzisiejsze wyzwanie zaliczone. Balbina podnosi poprzeczkę.' }
    : { preset: playPresets[0], reason: 'Krótki rewanż to najlepsza odpowiedź na dzisiejszy wynik.' }
  if (won && game.settings.difficulty !== 'omniscient') return { preset: playPresets[3], reason: 'Wygrana zasługuje na trudniejszą przeciwniczkę.' }
  if (!won && game.playerScore !== game.botScore) return { preset: playPresets[0], reason: 'Trzy szybkie rundy pomogą odwrócić serię.' }
  return { preset: playPresets[2], reason: 'Po remisie przyda się odrobina kontrolowanego absurdu.' }
}

function Logo({ compact = false }: { compact?: boolean }) {
  return <div className={compact ? 'logo compact' : 'logo'} aria-label="Państwa-miasta"><span>Państwa</span><i>miasta</i></div>
}

function LanguagePicker({ value, onChange, compact = false }: { value: GameLanguage; onChange: (language: GameLanguage) => void; compact?: boolean }) {
  return <div className={`language-picker ${compact ? 'compact' : ''}`} aria-label="Język rozgrywki">
    {(Object.keys(languageOptions) as GameLanguage[]).map((language) => <button key={language} className={value === language ? 'active' : ''} onClick={() => onChange(language)} aria-pressed={value === language} title={languageOptions[language].note}><b>{languageOptions[language].short}</b>{!compact && <span>{languageOptions[language].nativeName}</span>}</button>)}
  </div>
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => { const close = (event: KeyboardEvent) => event.key === 'Escape' && onClose(); document.addEventListener('keydown', close); return () => document.removeEventListener('keydown', close) }, [onClose])
  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
    <section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-head"><h2 id="modal-title">{title}</h2><button className="icon-btn" onClick={onClose} aria-label="Zamknij"><X /></button></div>{children}
    </section>
  </div>
}

function App() {
  const [screen, setScreen] = useState<Screen>('home')
  const [settings, setSettings] = useState<Settings>(loadSettings)
  const [stats, setStats] = useState<Stats>(loadStats)
  const [game, setGame] = useState<ActiveGame | null>(null)
  const [review, setReview] = useState<RoundResult | null>(null)
  const [rulesOpen, setRulesOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [quitOpen, setQuitOpen] = useState(false)
  const [botStatus, setBotStatus] = useState('analizuje literę z przesadną powagą…')
  const [learnedAnswers, setLearnedAnswers] = useState(loadLearnedAnswers)
  const usedBotAnswers = useRef(new Set<string>())
  const savedGame = loadGame()
  const dailyChallenge = createDailyChallenge(new Date(), settings.language)

  useEffect(() => { saveSettings(settings) }, [settings])
  useEffect(() => { document.documentElement.dataset.motion = settings.motion ? 'on' : 'off' }, [settings.motion])
  useEffect(() => { document.documentElement.dataset.language = settings.language }, [settings.language])
  useEffect(() => { const frame = requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'auto' })); return () => cancelAnimationFrame(frame) }, [screen])

  const ping = () => {
    if (!settings.sound) return
    const context = new AudioContext()
    const oscillator = context.createOscillator(); const gain = context.createGain()
    oscillator.frequency.value = 520; gain.gain.setValueAtTime(.035, context.currentTime); gain.gain.exponentialRampToValueAtTime(.001, context.currentTime + .12)
    oscillator.connect(gain); gain.connect(context.destination); oscillator.start(); oscillator.stop(context.currentTime + .12)
  }

  const beginGame = (nextSettings = settings, launch: { source?: 'regular' | 'daily'; dailyKey?: string; letters?: string[] } = {}) => {
    const letter = launch.letters?.[0] ?? drawLetter([], nextSettings.chaos, Math.random, nextSettings.language)
    const next: ActiveGame = { settings: nextSettings, round: 1, usedLetters: [letter], playerScore: 0, botScore: 0, letter, answers: {}, results: [], startedAt: Date.now(), timeLeft: nextSettings.timeLimit, source: launch.source ?? 'regular', dailyKey: launch.dailyKey, dailyLetters: launch.letters }
    setGame(next); saveGame(next); setReview(null); setScreen('play'); setBotStatus(randomItem(quips.start)); ping()
  }

  const beginDailyChallenge = () => {
    const nextSettings: Settings = { ...settings, setId: dailyChallenge.setId, difficulty: dailyChallenge.difficulty, timeLimit: dailyChallenge.timeLimit, rounds: dailyChallenge.rounds, chaos: false }
    beginGame(nextSettings, { source: 'daily', dailyKey: dailyChallenge.key, letters: dailyChallenge.letters })
  }

  const resume = () => { if (savedGame) { setGame(savedGame); setScreen('play') } }
  const changeAnswer = (categoryId: string, value: string) => setGame((current) => {
    if (!current) return current
    const next = { ...current, answers: { ...current.answers, [categoryId]: value } }; saveGame(next); return next
  })

  const finishRound = () => {
    if (!game) return
    const botAnswers = generateBotRound(game.settings, game.letter, usedBotAnswers.current)
    const result = scoreRound(game.round, game.letter, game.settings, game.answers, botAnswers, {}, learnedAnswers)
    setReview(result); setScreen('review'); ping()
  }

  useEffect(() => {
    if (screen !== 'play' || !game || game.settings.timeLimit === 0) return
    const timer = window.setInterval(() => setGame((current) => {
      if (!current) return current
      const timeLeft = Math.max(0, current.timeLeft - 1)
      const next = { ...current, timeLeft }; saveGame(next)
      return next
    }), 1000)
    return () => window.clearInterval(timer)
  }, [screen, game?.round])

  useEffect(() => {
    if (screen === 'play' && game?.settings.timeLimit !== 0 && game?.timeLeft === 0) finishRound()
  }, [screen, game?.timeLeft])

  useEffect(() => {
    if (screen !== 'play' || !game) return
    setBotStatus('myśli… podobno bardzo intensywnie')
    const base = game.settings.difficulty === 'tourist' ? 7000 : game.settings.difficulty === 'nerd' ? 5000 : 3200
    const timer = window.setTimeout(() => setBotStatus(randomItem(quips.botDone)), base + Math.random() * 2500)
    return () => window.clearTimeout(timer)
  }, [screen, game?.round])

  const decide = (categoryId: string, accepted: boolean) => setReview((current) => {
    if (!current) return current
    const row = current.rows.find((item) => item.category.id === categoryId)
    if (accepted && row?.player && game) setLearnedAnswers(saveLearnedAnswer(categoryId, row.player, game.settings.language))
    return recalculateRound(current, categoryId, accepted, game?.settings.language)
  })

  const updateFinalStats = (finished: ActiveGame) => {
    const won = finished.playerScore > finished.botScore; const lost = finished.playerScore < finished.botScore
    const completedDaily = finished.source === 'daily' && finished.dailyKey
    const dailyAlreadyCompleted = Boolean(completedDaily && stats.daily.scores[finished.dailyKey!])
    const nextDailyStreak = !completedDaily || dailyAlreadyCompleted ? stats.daily.streak : stats.daily.lastCompleted === previousDateKey(finished.dailyKey!) ? stats.daily.streak + 1 : 1
    const next: Stats = {
      ...stats, games: stats.games + 1, wins: stats.wins + (won ? 1 : 0), losses: stats.losses + (lost ? 1 : 0), draws: stats.draws + (!won && !lost ? 1 : 0),
      bestScore: Math.max(stats.bestScore, finished.playerScore), favoriteSets: { ...stats.favoriteSets, [finished.settings.setId]: stats.favoriteSets[finished.settings.setId] + 1 },
      winStreak: won ? stats.winStreak + 1 : 0, bestWinStreak: Math.max(stats.bestWinStreak, won ? stats.winStreak + 1 : 0),
      recentGames: [{ setId: finished.settings.setId, difficulty: finished.settings.difficulty, language: finished.settings.language, playerScore: finished.playerScore, botScore: finished.botScore, won, playedAt: Date.now() }, ...stats.recentGames].slice(0, 8),
      daily: completedDaily ? {
        lastCompleted: finished.dailyKey!,
        streak: nextDailyStreak,
        bestStreak: Math.max(stats.daily.bestStreak, nextDailyStreak),
        scores: { ...stats.daily.scores, [finished.dailyKey!]: Math.max(stats.daily.scores[finished.dailyKey!] ?? 0, finished.playerScore) }
      } : stats.daily
    }
    setStats(next); saveStats(next)
  }

  const nextRound = () => {
    if (!game || !review) return
    const playerScore = game.playerScore + review.playerPoints; const botScore = game.botScore + review.botPoints
    const results = [...game.results, review]
    if (game.round >= game.settings.rounds) {
      const finished = { ...game, playerScore, botScore, results }
      setGame(finished); clearGame(); updateFinalStats(finished); setScreen('summary'); return
    }
    const letter = game.source === 'daily' && game.dailyLetters ? game.dailyLetters[game.round] : drawLetter(game.usedLetters, game.settings.chaos, Math.random, game.settings.language)
    const next: ActiveGame = { ...game, round: game.round + 1, letter, usedLetters: [...game.usedLetters, letter], answers: {}, results, playerScore, botScore, timeLeft: game.settings.timeLimit, startedAt: Date.now() }
    setGame(next); saveGame(next); setReview(null); setScreen('play'); window.scrollTo({ top: 0, behavior: settings.motion ? 'smooth' : 'auto' })
  }

  const goHome = () => { setScreen('home'); setGame(null); setReview(null) }
  const saveAndGoHome = () => { if (game) saveGame(game); setQuitOpen(false); goHome() }
  const abandonGame = () => { clearGame(); setQuitOpen(false); goHome() }
  const presetSettings = (preset: PlayPreset) => {
    const next = { ...settings, ...preset.settings }
    return next.language === 'pl' ? next : { ...next, setId: 'standard' as const, chaos: false }
  }
  const choosePreset = (preset: PlayPreset) => { setSettings(presetSettings(preset)); setScreen('config') }
  const quickPlay = () => beginGame(presetSettings(playPresets[0]))

  return <div className="app-shell">
    {screen !== 'home' && <header className="game-nav"><Logo compact /><div className="nav-actions">{(screen === 'play' || screen === 'review') && <button className="ghost-btn exit-link" aria-label="Wróć do menu" onClick={() => setQuitOpen(true)}><LogOut /> <span>Menu</span></button>}<button className="ghost-btn" aria-label="Zasady" onClick={() => setRulesOpen(true)}><HelpCircle /> <span>Zasady</span></button><button className="icon-btn" onClick={() => setSettingsOpen(true)} aria-label="Ustawienia"><SettingsIcon /></button></div></header>}
    {screen === 'home' && <HomeScreen settings={settings} setSettings={setSettings} stats={stats} savedGame={savedGame} dailyChallenge={dailyChallenge} onDaily={beginDailyChallenge} onQuickPlay={quickPlay} onPlay={() => setScreen('config')} onPreset={choosePreset} onResume={resume} onRules={() => setRulesOpen(true)} onSettings={() => setSettingsOpen(true)} />}
    {screen === 'config' && <ConfigScreen settings={settings} setSettings={setSettings} onBack={goHome} onStart={() => beginGame()} />}
    {screen === 'play' && game && <PlayScreen key={game.round} game={game} botStatus={botStatus} onAnswer={changeAnswer} onFinish={finishRound} />}
    {screen === 'review' && game && review && <ReviewScreen game={game} result={review} onDecide={decide} onNext={nextRound} />}
    {screen === 'summary' && game && <SummaryScreen game={game} stats={stats} onRecommended={(preset) => beginGame(presetSettings(preset))} onRematch={() => beginGame(game.settings)} onNew={() => setScreen('config')} onHome={goHome} />}
    {rulesOpen && <Rules onClose={() => setRulesOpen(false)} />}
    {settingsOpen && <SettingsModal settings={settings} setSettings={setSettings} stats={stats} setStats={setStats} onClose={() => setSettingsOpen(false)} />}
    {quitOpen && <Modal title="Wrócić do menu?" onClose={() => setQuitOpen(false)}><div className="quit-dialog"><p>Możesz zachować rundę i wrócić do niej później albo porzucić ją całkowicie.</p><div><button className="ghost-btn" onClick={() => setQuitOpen(false)}>Graj dalej</button><button className="secondary dark" onClick={abandonGame}>Porzuć grę</button><button className="primary" onClick={saveAndGoHome}>Zapisz i wróć</button></div></div></Modal>}
  </div>
}

function HomeScreen({ settings, setSettings, stats, savedGame, dailyChallenge, onDaily, onQuickPlay, onPlay, onPreset, onResume, onRules, onSettings }: { settings: Settings; setSettings: React.Dispatch<React.SetStateAction<Settings>>; stats: Stats; savedGame: ActiveGame | null; dailyChallenge: DailyChallenge; onDaily: () => void; onQuickPlay: () => void; onPlay: () => void; onPreset: (preset: PlayPreset) => void; onResume: () => void; onRules: () => void; onSettings: () => void }) {
  const dailyScore = stats.daily.scores[dailyChallenge.key]
  const recommendations = personalizedPresets(stats).filter(({ preset }) => settings.language === 'pl' || preset.settings.setId === 'standard')
  const sets = getCategorySets(settings.language)
  const changeLanguage = (language: GameLanguage) => setSettings((current) => ({ ...current, language, setId: language === 'pl' ? current.setId : 'standard', chaos: language === 'pl' && current.chaos }))
  return <main className="welcome-shell"><header className="topbar"><Logo compact /><div className="topbar-tools"><LanguagePicker compact value={settings.language} onChange={changeLanguage}/><button className="icon-btn" onClick={onSettings} aria-label="Ustawienia"><SettingsIcon /></button></div></header>
    <section className="hero-card entertainment-hero"><div className="hero-copy"><h1>Jedna litera.<br/>Wszystko do ugrania.</h1><p className="slogan">Znajdź odpowiedzi, zanim Balbina zrobi to pierwsza. Klasyka, trudniejsze pytania albo kontrolowany absurd.</p>
      <div className="hero-actions"><button className="primary hero-play" onClick={onQuickPlay}><Gamepad2 /> Graj</button><button className="secondary" onClick={onPlay}>Wybierz wariant</button><button className="hero-rules" onClick={onRules}>Jak to działa?</button></div>
      {stats.games > 0 && <div className="mini-stats"><div><b>{stats.games}</b><span>gier</span></div><div><b>{stats.wins}</b><span>wygranych</span></div><div><b>{stats.bestScore}</b><span>rekord</span></div></div>}
    </div><div className="bot-stage"><div className="speech"><b>Balbina, przeciwniczka</b><span>Nie zdradza strategii. Podobno jej nie potrzebuje.</span></div><img src="/balbina-editorial.png" alt="Balbina, subtelnie ilustrowana szylkretowa kotka"/></div></section>
    {savedGame && <section className="continue-card"><div><span>KONTYNUUJ GRĘ</span><h2>Runda {savedGame.round} z {savedGame.settings.rounds}</h2><p>{getCategorySets(savedGame.settings.language ?? 'pl')[savedGame.settings.setId].name} · {languageOptions[savedGame.settings.language ?? 'pl'].nativeName} · litera {savedGame.letter} · wynik {savedGame.playerScore}:{savedGame.botScore}</p></div><button className="primary" onClick={onResume}><RotateCcw /> Wróć do rundy</button></section>}
    <section className={`daily-challenge ${dailyScore !== undefined ? 'completed' : ''}`}><div className="daily-copy"><span><Sparkles /> DZISIEJSZE WYZWANIE · {dailyChallenge.label.toLocaleUpperCase(languageOptions[settings.language].locale)}</span><h2>Jedno wyzwanie na dziś.</h2><p>{sets[dailyChallenge.setId].name} · {languageOptions[settings.language].nativeName} · 3 rundy · 90 sekund na rundę.</p><div className="daily-letters">{dailyChallenge.letters.map((letter) => <b key={letter}>{letter}</b>)}</div></div><div className="daily-status"><img src="/balbina-editorial.png" alt="Balbina zaprasza do dzisiejszego wyzwania"/>{dailyScore !== undefined && <div className="daily-result"><small>TWÓJ NAJLEPSZY WYNIK</small><strong>{dailyScore}</strong><span>Seria: {stats.daily.streak} {stats.daily.streak === 1 ? 'dzień' : 'dni'}</span></div>}<button className="primary" onClick={onDaily}>{dailyScore !== undefined ? 'Zagraj ponownie' : 'Podejmij wyzwanie'} <ChevronRight /></button></div></section>
    {stats.games < 3 && <section className="getting-started"><Sparkles/><div><small>POZNAJ GRĘ W PRAKTYCE</small><b>{stats.games === 0 ? 'Pierwsza partia zajmuje około czterech minut.' : `Jeszcze ${3 - stats.games} ${3 - stats.games === 1 ? 'gra' : 'gry'}, a rekomendacje zaczną korzystać z Twoich wyników.`}</b><span>Wpisujesz odpowiedzi po kolei, a nieznane słowa możesz potwierdzić — Balbina zapamięta je na tym urządzeniu.</span></div><button onClick={onRules}>Zobacz zasady <ChevronRight/></button></section>}
    <section className="discovery-section personalized-section"><div className="discovery-heading"><div><span>{stats.games >= 3 ? 'NA PODSTAWIE TWOICH GIER' : 'WARTO SPRÓBOWAĆ'}</span><h2>{stats.games >= 3 ? 'Wybrane dla Ciebie' : 'Dobry następny krok'}</h2></div>{stats.games > 0 && stats.games < 3 && <em>Personalizacja po 3 grach</em>}</div><div className="personalized-rail">{recommendations.map(({ preset, reason }, index) => <button key={preset.id} className={`personalized-card personalized-${index + 1}`} onClick={() => onPreset(preset)}><small>{reason}</small><strong>{preset.name}</strong><p>{preset.note}</p><span>{sets[settings.language === 'pl' ? preset.settings.setId : 'standard'].name} · {preset.settings.rounds} rund <ChevronRight /></span></button>)}</div></section>
    <section className="discovery-section"><div className="discovery-heading"><div><span>GOTOWE SCENARIUSZE</span><h2>Na co masz dziś ochotę?</h2></div><button onClick={onPlay}>Dostosuj własną grę <ChevronRight /></button></div><div className="preset-rail">{playPresets.filter((preset) => settings.language === 'pl' || preset.settings.setId === 'standard').map((preset, index) => <button key={preset.id} className={`preset-card preset-${index + 1}`} onClick={() => onPreset(preset)}><small>{preset.kicker}</small><strong>{preset.name}</strong><p>{preset.note}</p><span>Zobacz wariant <ChevronRight /></span></button>)}</div></section>
  </main>
}

function ConfigScreen({ settings, setSettings, onBack, onStart }: { settings: Settings; setSettings: React.Dispatch<React.SetStateAction<Settings>>; onBack: () => void; onStart: () => void }) {
  const [detailsOpen, setDetailsOpen] = useState(false)
  const patch = <K extends keyof Settings>(key: K, value: Settings[K]) => setSettings((current) => ({ ...current, [key]: value }))
  const sets = getCategorySets(settings.language)
  const changeLanguage = (language: GameLanguage) => setSettings((current) => ({ ...current, language, setId: language === 'pl' ? current.setId : 'standard', chaos: language === 'pl' && current.chaos }))
  return <main className="page config-page"><button className="back-link" onClick={onBack}><ArrowLeft /> Wróć</button><div className="section-heading config-heading"><span>WYBIERZ WARIANT</span><h1>Na co masz dziś ochotę?</h1><p>Wybierz klimat i zacznij. Reszta ustawień może poczekać.</p></div>
    <section className="setup-section language-section"><div className="language-heading"><div><span>JĘZYK ROZGRYWKI</span><h2>W którym języku gramy?</h2></div><p>{languageOptions[settings.language].note}</p></div><LanguagePicker value={settings.language} onChange={changeLanguage}/>{settings.language === 'zh' && <div className="pinyin-note"><b>中文 działa inaczej.</b><span>Losujemy pierwszą literę wymowy pinyin. Możesz wpisać odpowiedź znakami, np. 北京, albo jako „Beijing”.</span></div>}</section>
    <section className="setup-section mode-section"><div className="mode-rail">{availableSetIds(settings.language).map((id) => <button key={id} className={`mode-card mode-${id} ${settings.setId === id ? 'selected' : ''}`} onClick={() => patch('setId', id)}><div className="mode-art"><img src={modeDetails[id].art} alt=""/><span>{modeKicker[id]}</span></div><div className="mode-copy"><div className="choice-check">{settings.setId === id && <Check />}</div><small>{sets[id].categories.length} KATEGORII</small><b>{sets[id].name}</b><p>{sets[id].note}</p><div className="mode-meta"><span>{modeDetails[id].duration}</span><span>{modeDetails[id].mood}</span></div></div></button>)}</div>{settings.language !== 'pl' && <p className="language-roadmap">Tryby „Trudne” i „Niekonwencjonalne” pozostają na razie po polsku — ich bazy wymagają osobnego opracowania językowego.</p>}</section>
    <button className="customizer-toggle" onClick={() => setDetailsOpen((open) => !open)} aria-expanded={detailsOpen}><SettingsIcon /> {detailsOpen ? 'Ukryj ustawienia' : 'Dostosuj grę'} <ChevronRight /></button>
    {detailsOpen && <div className="advanced-settings"><section className="setup-section"><h2>Forma Balbiny</h2><div className="choice-grid">{(Object.keys(difficultyLabels) as Difficulty[]).map((id) => <button key={id} className={`choice-card ${settings.difficulty === id ? 'selected' : ''}`} onClick={() => patch('difficulty', id)}><Compass /><b>{difficultyLabels[id].name}</b><p>{difficultyLabels[id].note}</p></button>)}</div></section>
      <div className="config-row"><section className="setup-section"><h2>Czas rundy</h2><div className="segmented">{([60,90,120,0] as TimeLimit[]).map((time) => <button key={time} className={settings.timeLimit === time ? 'active' : ''} onClick={() => patch('timeLimit', time)}>{time || '∞'}{time > 0 && <small>s</small>}</button>)}</div></section>
        <section className="setup-section"><h2>Liczba rund</h2><div className="segmented">{([3,5,10] as const).map((rounds) => <button key={rounds} className={settings.rounds === rounds ? 'active' : ''} onClick={() => patch('rounds', rounds)}>{rounds}</button>)}</div></section></div>
      <section className="setup-section toggles">{settings.language === 'pl' && <label><div><Zap /><span><b>Tryb chaosu</b><small>Dodaje polskie znaki do puli liter.</small></span></div><input type="checkbox" checked={settings.chaos} onChange={(event) => patch('chaos', event.target.checked)} /><i /></label>}<label><div>{settings.sound ? <Volume2 /> : <VolumeX />}<span><b>Dźwięki</b><small>Subtelne i całkowicie lokalne.</small></span></div><input type="checkbox" checked={settings.sound} onChange={(event) => patch('sound', event.target.checked)} /><i /></label></section>
      <div className="score-note"><Medal /><p><b>Punktacja:</b> inna poprawna odpowiedź = 10 pkt, taka sama jak Balbiny = 5 pkt, brak lub odrzucona = 0 pkt.</p></div></div>}
    <div className="sticky-start"><div><b>{sets[settings.setId].name} · {languageOptions[settings.language].nativeName} · {settings.rounds} rund</b><span>{settings.timeLimit ? `${settings.timeLimit} sekund` : 'bez limitu'} · {difficultyLabels[settings.difficulty].name}</span></div><button className="primary" onClick={onStart}>Losuj literę <ChevronRight /></button></div>
  </main>
}

function PlayScreen({ game, botStatus, onAnswer, onFinish }: { game: ActiveGame; botStatus: string; onAnswer: (id: string, value: string) => void; onFinish: () => void }) {
  const categories = getCategorySets(game.settings.language ?? 'pl')[game.settings.setId].categories
  const [step, setStep] = useState(0)
  const [skipped, setSkipped] = useState<Set<string>>(new Set())
  const category = categories[step]
  const answer = game.answers[category.id] ?? ''
  const canContinue = Boolean(answer.trim()) || skipped.has(category.id)
  const advance = () => {
    if (!canContinue) return
    if (step === categories.length - 1) onFinish()
    else setStep((current) => current + 1)
  }
  const skip = () => {
    onAnswer(category.id, '')
    setSkipped((current) => new Set(current).add(category.id))
    if (step < categories.length - 1) setStep((current) => current + 1)
  }
  return <main className="page play-page"><section className="play-head"><div><span className="round-label">RUNDA {game.round} / {game.settings.rounds}</span><div className="scoreline"><span>Ty <b>{game.playerScore}</b></span><i>:</i><span><b>{game.botScore}</b> Balbina</span></div></div><div className="letter-card"><small>LITERA</small><strong>{game.letter}</strong></div><div className={`timer ${game.timeLeft > 0 && game.timeLeft <= 10 ? 'urgent' : ''}`}><Clock3 /><small>CZAS</small><b>{game.settings.timeLimit ? formatTime(game.timeLeft) : '∞'}</b></div></section>
    <section className="bot-strip"><img src="/balbina-editorial.png" alt="Portret Balbiny"/><div><small>BALBINA</small><b>{botStatus}</b></div><span className="thinking-dots"><i/><i/><i/></span></section>
    <div className="progress-row"><span>Kategoria {step + 1} z {categories.length}</span><div><i style={{ width: `${(step + 1) / categories.length * 100}%` }} /></div><b>{Math.round((step + 1) / categories.length * 100)}%</b></div>
    <form className="focus-answer" onSubmit={(event) => { event.preventDefault(); advance() }}><div className="focus-counter">{String(step + 1).padStart(2, '0')} <span>/ {String(categories.length).padStart(2, '0')}</span></div><label htmlFor={`answer-${category.id}`}><small>{game.settings.language === 'zh' ? `PINYIN NA LITERĘ ${game.letter} · ZNAKI LUB ŁACINKA` : `ODPOWIEDŹ NA LITERĘ ${game.letter}`}</small><strong>{category.label}</strong></label><div className="focus-input"><input id={`answer-${category.id}`} autoFocus aria-label={category.label} value={answer} onChange={(event) => { setSkipped((current) => { const next = new Set(current); next.delete(category.id); return next }); onAnswer(category.id, event.target.value) }} placeholder={game.settings.language === 'zh' ? `${game.letter}… / 汉字` : `${game.letter}…`} autoCapitalize="words" autoComplete="off"/><em>{game.letter}</em></div><div className="focus-actions">{step > 0 && <button type="button" className="ghost-btn" onClick={() => setStep((current) => current - 1)}><ArrowLeft /> Wstecz</button>}<button type="button" className="skip-btn" onClick={skip}>{skipped.has(category.id) ? 'Pominięto' : 'Nie wiem'}</button><button className="primary next-answer" type="submit" disabled={!canContinue}>{step === categories.length - 1 ? <>Zakończ rundę <Check /></> : <>Dalej <ChevronRight /></>}</button></div></form>
  </main>
}

function ReviewScreen({ game, result, onDecide, onNext }: { game: ActiveGame; result: RoundResult; onDecide: (id: string, accepted: boolean) => void; onNext: () => void }) {
  const [rowIndex, setRowIndex] = useState(0)
  const [phase, setPhase] = useState(game.settings.motion ? 0 : 3)
  const [showAll, setShowAll] = useState(false)
  const row = result.rows[rowIndex]
  const isLast = rowIndex === result.rows.length - 1
  useEffect(() => {
    if (phase >= 3 || !game.settings.motion) return
    const timer = window.setTimeout(() => setPhase((current) => current + 1), phase === 0 ? 700 : 850)
    return () => window.clearTimeout(timer)
  }, [phase, rowIndex, game.settings.motion])
  const nextReveal = () => { setRowIndex((current) => current + 1); setPhase(game.settings.motion ? 0 : 3) }
  const resolved = row.verdict.accepted !== null
  const allResolved = result.rows.every((item) => item.verdict.accepted !== null)
  const balbinaArt = '/balbina-editorial.png'
  return <main className="page review-page"><div className="section-heading center reveal-heading"><span>WYNIKI RUNDY {result.round}</span><h1>Odkrywamy karty.</h1><p>{rowIndex + 1} z {result.rows.length} · {row.category.label}</p></div>
    <div className="review-tools"><button className={showAll ? 'active' : ''} onClick={() => setShowAll((value) => !value)}>{showAll ? 'Wróć do odkrywania' : 'Odkryj wszystko'}</button>{!showAll && phase < 3 && <button onClick={() => setPhase(3)}>Pomiń animację</button>}</div>
    {!showAll && <><div className="reveal-progress"><i style={{ width: `${(rowIndex + 1) / result.rows.length * 100}%` }}/></div>
      <section className="reveal-stage"><img className="reveal-cat" src={balbinaArt} alt="Reakcja Balbiny na wynik"/><article className={`reveal-card ${row.verdict.accepted === true ? 'accepted' : row.verdict.accepted === false ? 'rejected' : 'pending'}`}><header><small>TWOJA ODPOWIEDŹ</small><strong>{row.player || '—'}</strong></header><div className={`reveal-part verdict ${phase >= 1 ? 'visible' : ''}`}><small>WERDYKT</small><b>{row.verdict.accepted === true ? <><Check /> Potwierdzona lokalnie</> : row.verdict.accepted === false ? <><X /> {!row.verdict.startsCorrectly ? `Odpowiedź nie zaczyna się na „${result.letter}”` : 'Odpowiedź pasuje do innej kategorii'}</> : <>Nie znaleziono w lokalnej bazie</>}</b>{row.verdict.accepted === null && <span className="verdict-note">Jeśli ją uznasz, Balbina zapamięta ją na tym urządzeniu.</span>}</div><div className={`reveal-part bot-answer ${phase >= 2 ? 'visible' : ''}`}><small>BALBINA ODPOWIADA</small><strong>{row.bot || 'Brak odpowiedzi'}</strong><span>Balbina: +{row.botPoints} pkt</span></div><div className={`reveal-part reveal-points ${phase >= 3 ? 'visible' : ''}`}><b>+{row.playerPoints}</b><p>{row.comment}</p></div>{phase >= 3 && row.verdict.accepted === null && <div className="decision reveal-decision"><button onClick={() => onDecide(row.category.id, false)}><X /> Zostaw 0 pkt</button><button onClick={() => onDecide(row.category.id, true)}><Check /> Uznaj i zapamiętaj</button></div>}</article></section></>}
    {showAll && <section className="all-results"><header><div><span>PEŁNE PODSUMOWANIE</span><h2>Wszystkie odpowiedzi</h2></div><img src="/balbina-editorial.png" alt="Balbina podsumowuje rundę"/></header><div className="all-results-list">{result.rows.map((item, index) => <article key={item.category.id} className={item.verdict.accepted === true ? 'accepted' : item.verdict.accepted === false ? 'rejected' : 'pending'}><b className="result-number">{String(index + 1).padStart(2, '0')}</b><div className="result-category"><small>{item.category.label}</small><strong>{item.player || '—'}</strong><span>Ty: +{item.playerPoints} pkt</span></div><div className="result-bot"><small>BALBINA</small><strong>{item.bot || 'Brak odpowiedzi'}</strong><span>Balbina: +{item.botPoints} pkt</span></div>{item.verdict.accepted === null && <div className="decision"><button onClick={() => onDecide(item.category.id, false)}><X /> 0 pkt</button><button onClick={() => onDecide(item.category.id, true)}><Check /> Uznaj</button></div>}</article>)}</div></section>}
    {((!showAll && isLast && phase >= 3 && resolved) || (showAll && allResolved)) && <section className="round-score reveal-total"><div><small>TY</small><b>+{result.playerPoints}</b><span>razem {game.playerScore + result.playerPoints}</span></div><i>:</i><div><small>BALBINA</small><b>+{result.botPoints}</b><span>razem {game.botScore + result.botPoints}</span></div></section>}
    {!showAll && phase >= 3 && resolved && <div className={`review-action ${isLast ? 'final-step' : ''}`}><span>{isLast ? 'Runda rozstrzygnięta. Nie zatrzymujemy dobrej serii.' : `Jeszcze ${result.rows.length - rowIndex - 1} kategorii do odkrycia.`}</span><button className="primary next-round-cta" onClick={isLast ? onNext : nextReveal}>{isLast ? (game.round === game.settings.rounds ? 'Zobacz wynik końcowy' : 'Następna runda') : 'Kolejna kategoria'} <ChevronRight /></button></div>}
    {showAll && <div className="review-action final-step"><span>{allResolved ? 'Wszystko jasne. Możemy grać dalej.' : 'Zdecyduj o nierozpoznanych odpowiedziach.'}</span><button className="primary next-round-cta" disabled={!allResolved} onClick={onNext}>{game.round === game.settings.rounds ? 'Zobacz wynik końcowy' : 'Następna runda'} <ChevronRight /></button></div>}
  </main>
}

function SummaryScreen({ game, stats, onRecommended, onRematch, onNew, onHome }: { game: ActiveGame; stats: Stats; onRecommended: (preset: PlayPreset) => void; onRematch: () => void; onNew: () => void; onHome: () => void }) {
  const won = game.playerScore > game.botScore; const draw = game.playerScore === game.botScore
  const recommendation = nextRecommendation(game)
  const sets = getCategorySets(game.settings.language ?? 'pl')
  const allRows = game.results.flatMap((round) => round.rows)
  const categoryPoints = new Map<string, number>(); allRows.forEach((row) => categoryPoints.set(row.category.label, (categoryPoints.get(row.category.label) ?? 0) + row.playerPoints))
  const sorted = [...categoryPoints].sort((a,b) => b[1] - a[1])
  const unusual = allRows.filter((row) => row.player.length > 0).sort((a,b) => b.player.length - a.player.length)[0]?.player ?? 'tajemnicza cisza'
  return <main className="page summary-page"><section className={`final-hero ${won ? 'won' : draw ? 'draw' : 'lost'}`}><div className="confetti">✦ ● ◆ ✦</div><img className="summary-cat" src="/balbina-editorial.png" alt={won ? 'Balbina przyjmuje porażkę z godnością' : draw ? 'Balbina analizuje remis' : 'Balbina zadowolona ze zwycięstwa'}/><div className="final-copy"><Trophy /><span>KONIEC GRY</span><h1>{won ? 'Balbina pokonana.' : draw ? 'Elegancki remis.' : 'Balbina wygrała.'}</h1><p>{randomItem(won ? quips.win : draw ? quips.draw : quips.lose)}</p><div className="final-score"><div><small>TY</small><b>{game.playerScore}</b></div><i>:</i><div><small>BALBINA</small><b>{game.botScore}</b></div></div></div></section>
    <section className="insights"><article><Sparkles/><small>NAJLEPSZA KATEGORIA</small><b>{sorted[0]?.[0] ?? '—'}</b></article><article><BarChart3/><small>NAJMNIEJ PUNKTÓW</small><b>{sorted.at(-1)?.[0] ?? '—'}</b></article><article><Zap/><small>NAJDŁUŻSZA ODPOWIEDŹ</small><b>„{unusual}”</b></article></section>
    {game.source === 'daily' && <section className="daily-complete"><Sparkles/><div><small>DZISIEJSZE WYZWANIE UKOŃCZONE</small><b>{stats.daily.streak} {stats.daily.streak === 1 ? 'dzień' : 'dni'} regularnej gry</b><span>Najlepsza seria: {stats.daily.bestStreak}</span></div></section>}
    <section className="next-recommendation"><div><small>BALBINA POLECA NASTĘPNE</small><h2>{recommendation.preset.name}</h2><p>{recommendation.reason}</p><span>{sets[game.settings.language === 'pl' ? recommendation.preset.settings.setId : 'standard'].name} · {recommendation.preset.settings.rounds} rund · {recommendation.preset.settings.timeLimit ? `${recommendation.preset.settings.timeLimit} sekund` : 'bez limitu'}</span><button className="primary" onClick={() => onRecommended(recommendation.preset)}>Zagraj teraz <ChevronRight /></button></div><img src={modeDetails[recommendation.preset.settings.setId].art} alt="Balbina poleca kolejną rozgrywkę"/></section>
    <section className="rounds-summary"><h2>Rundy pod lupą</h2>{game.results.map((round) => <div key={round.round}><span>Runda {round.round}</span><b className="round-letter">{round.letter}</b><span>Ty <b>{round.playerPoints}</b></span><span>Balbina <b>{round.botPoints}</b></span></div>)}</section>
    <div className="summary-actions"><button className="primary" onClick={onRematch}><RotateCcw /> Rewanż</button><button className="secondary dark" onClick={onNew}><MapIcon /> Nowa gra</button><button className="ghost-btn" onClick={onHome}><Home /> Strona główna</button></div>
  </main>
}

function Rules({ onClose }: { onClose: () => void }) {
  return <Modal title="Jak to działa?" onClose={onClose}><div className="rules"><p>Losujemy literę, Ty odpowiadasz na kolejne kategorie, a Balbina udaje, że wynik zupełnie jej nie obchodzi.</p><div className="rule-points"><span><b>10</b>Inna poprawna</span><span><b>5</b>Taka sama jak Balbiny</span><span><b>0</b>Pusta lub odrzucona</span></div><ol><li><b>Wybierz poziom trudności.</b> Klasyczny, trudny albo niekonwencjonalny.</li><li><b>Odpowiadaj po kolei.</b> Każda kategoria ma własny ekran. Jeśli nie wiesz, wybierz „Nie wiem” — po rundzie zobaczysz odpowiedź Balbiny.</li><li><b>Odkryj wyniki.</b> Gra kolejno pokazuje werdykt, odpowiedź Balbiny i punkty.</li><li><b>Balbina sprawdza lokalną bazę.</b> Znane odpowiedzi akceptuje, złą literę lub rozpoznaną złą kategorię odrzuca. Przy nowym słowie możesz złożyć odwołanie.</li></ol><div className="privacy-note"><ShieldCheck /><span><b>Gra zostaje na tym urządzeniu.</b> Bez logowania, śledzenia i wysyłania odpowiedzi.</span></div></div></Modal>
}

function SettingsModal({ settings, setSettings, stats, setStats, onClose }: { settings: Settings; setSettings: React.Dispatch<React.SetStateAction<Settings>>; stats: Stats; setStats: (stats: Stats) => void; onClose: () => void }) {
  const [confirm, setConfirm] = useState(false)
  const reset = () => { const next = clearStats(); setStats(next); setConfirm(false) }
  return <Modal title="Ustawienia i statystyki" onClose={onClose}><div className="settings-list"><label><span><b>Dźwięki</b><small>Krótkie sygnały, bez pobierania plików.</small></span><input type="checkbox" checked={settings.sound} onChange={(event) => setSettings((current) => ({ ...current, sound: event.target.checked }))}/></label><label><span><b>Animacje</b><small>Możesz je wyłączyć niezależnie od systemu.</small></span><input type="checkbox" checked={settings.motion} onChange={(event) => setSettings((current) => ({ ...current, motion: event.target.checked }))}/></label></div><div className="stats-panel"><h3>Twoje liczby</h3><div><span><b>{stats.games}</b>Gier</span><span><b>{stats.wins}</b>Wygranych</span><span><b>{stats.losses}</b>Przegranych</span><span><b>{stats.bestWinStreak}</b>Najlepsza seria</span></div></div>{confirm ? <div className="reset-confirm"><p><b>Naprawdę wyzerować?</b> Statystyki znikną szybciej niż dobra odpowiedź na „Ź”.</p><button onClick={() => setConfirm(false)}>Anuluj</button><button onClick={reset}>Tak, wyzeruj</button></div> : <button className="danger-link" disabled={stats === defaultStats} onClick={() => setConfirm(true)}>Wyzeruj statystyki</button>}</Modal>
}

export default App
