import { useEffect, useRef, useState } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#&!?'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const SplitFlapText = ({ text, className = '' }) => {
  const [display, setDisplay] = useState(() => {
    if (prefersReducedMotion()) return text
    return text.split('').map(() => CHARS[Math.floor(Math.random() * CHARS.length)]).join('')
  })
  const settled = useRef(false)

  useEffect(() => {
    if (prefersReducedMotion() || settled.current) return
    const chars = text.split('')
    const delays = chars.map((_, i) => i * 18)
    const maxDelay = delays[delays.length - 1] + 400
    const timers = []

    delays.forEach((delay, i) => {
      const steps = 5 + Math.floor(Math.random() * 4)
      const stepTime = 50
      let step = 0
      timers.push(
        setTimeout(() => {
          const interval = setInterval(() => {
            step++
            if (step >= steps) {
              clearInterval(interval)
              setDisplay((prev) => {
                const next = prev.split('')
                next[i] = chars[i]
                return next.join('')
              })
            } else {
              setDisplay((prev) => {
                const next = prev.split('')
                next[i] = CHARS[Math.floor(Math.random() * CHARS.length)]
                return next.join('')
              })
            }
          }, stepTime)
          timers.push(interval)
        }, delay)
      )
    })

    const settle = setTimeout(() => {
      settled.current = true
      setDisplay(text)
    }, maxDelay)

    timers.push(settle)

    return () => {
      timers.forEach((t) => {
        if (typeof t === 'number') clearTimeout(t)
        else clearInterval(t)
      })
    }
  }, [text])

  return (
    <span className={className} aria-label={text}>
      {display.split('').map((char, i) => (
        <span key={i} className="split-flap-char" style={{ animationDelay: `${i * 18}ms` }}>
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  )
}

export default SplitFlapText
