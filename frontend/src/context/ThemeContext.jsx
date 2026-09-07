import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const THEMES = [
  'indigo-light',
  'sage-editorial',
  'forest-ledger',
  'white',
  'black',
  'evergreen',
]

const ThemeContext = createContext(null)

const STORAGE_KEY = 'ra_theme'
const DEFAULT_THEME = 'black'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    if (typeof window === 'undefined') return DEFAULT_THEME
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'espresso') return 'evergreen'
    return THEMES.includes(stored) ? stored : DEFAULT_THEME
  })

  const [showOverlay, setShowOverlay] = useState(false)

  const setTheme = (name) => {
    if (!THEMES.includes(name)) return
    if (!prefersReducedMotion() && name !== theme) {
      setShowOverlay(true)
    }
    localStorage.setItem(STORAGE_KEY, name)
    setThemeState(name)
  }

  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    if (showOverlay) {
      const timer = setTimeout(() => setShowOverlay(false), 500)
      return () => clearTimeout(timer)
    }
  }, [showOverlay])

  const value = {
    theme,
    setTheme,
    themes: THEMES,
  }

  return (
    <ThemeContext.Provider value={value}>
      <ThemeSwitchOverlay active={showOverlay} />
      {children}
    </ThemeContext.Provider>
  )
}

const ThemeSwitchOverlay = ({ active }) => {
  if (!active || prefersReducedMotion()) return null
  return createPortal(
    <div className="theme-switch-overlay">
      <span className="overlay-particle p-1" />
      <span className="overlay-particle p-2" />
      <span className="overlay-particle p-3" />
    </div>,
    document.body
  )
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within a ThemeProvider')
  return ctx
}

export default ThemeContext
