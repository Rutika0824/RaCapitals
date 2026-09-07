import { useTheme } from '../../context/ThemeContext'

const WORDS = [
  { text: "Own", delay: '0.1s' },
  { text: "tomorrow's", delay: '0.2s', breakAfter: true },
  { text: 'listed', delay: '0.35s' },
  { text: 'companies,', delay: '0.45s', breakAfter: true },
  { text: 'today.', delay: '0.6s' },
]

const LINES = [
  { text: "Own tomorrow's", delay: '0.1s' },
  { text: 'listed companies,', delay: '0.35s', accent: true },
  { text: 'today.', delay: '0.6s' },
]

const LINES_3D = [
  { text: "Own tomorrow's", delay: '0.1s' },
  { text: 'listed companies,', delay: '0.3s', accent: true },
  { text: 'today.', delay: '0.5s' },
]

const LINES_INDIGO = [
  { text: "Own tomorrow's", delay: '0.1s' },
  { text: 'listed companies,', delay: '0.3s', accent: true },
  { text: 'today.', delay: '0.5s' },
]

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const AnimatedHeadline = ({ text }) => {
  const { theme } = useTheme()
  const isEvergreen = theme === 'evergreen'
  const isBlack = theme === 'black'
  const isWhite = theme === 'white'
  const isIndigo = theme === 'indigo-light'
  const reduced = prefersReducedMotion()

  if (isEvergreen && !reduced) {
    return (
      <>
        {WORDS.map((w, i) => (
          <span key={i}>
            <span
              className="animated-word"
              style={{ animationDelay: w.delay }}
            >
              {w.text}
            </span>
            {w.breakAfter && <br />}
          </span>
        ))}
      </>
    )
  }

  if (isBlack && !reduced) {
    return (
      <>
        {LINES.map((line, i) => (
          <div
            key={i}
            className={`clip-reveal line-${i + 1}`}
            style={{ color: line.accent ? 'var(--brass)' : 'var(--page-text)' }}
          >
            {line.text}
          </div>
        ))}
      </>
    )
  }

  if (isWhite && !reduced) {
    return (
      <div className="perspective-container">
        {LINES_3D.map((line, i) => (
          <div
            key={i}
            className={`line-3d d${i + 1}`}
            style={{ color: line.accent ? 'var(--brass)' : 'var(--page-text)' }}
          >
            {line.text}
          </div>
        ))}
      </div>
    )
  }

  if (isIndigo && !reduced) {
    return (
      <>
        {LINES_INDIGO.map((line, i) => (
          <div
            key={i}
            className={`shimmer-line s${i + 1}`}
            style={{ color: line.accent ? 'var(--brass)' : 'var(--page-text)' }}
          >
            {line.text}
          </div>
        ))}
      </>
    )
  }

  return <>{text}</>
}

export default AnimatedHeadline
