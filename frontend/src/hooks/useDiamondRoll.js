import { useEffect } from 'react'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)

export default function useDiamondRoll(arenaRef) {
  useEffect(() => {
    const arena = arenaRef.current
    if (!arena || prefersReducedMotion()) return

    const diamonds = Array.from(arena.querySelectorAll('.ff-diamond'))
    const n = diamonds.length
    if (n === 0) return

    const STAGGER = 0.12
    const MARGIN = 100
    const RANGE = 480
    const TRAVEL = -90
    const TURN = 360

    const reset = () =>
      diamonds.forEach((d) => {
        d.style.removeProperty('transform')
        d.style.removeProperty('transition')
      })

    const update = () => {
      const rect = arena.getBoundingClientRect()
      if (rect.height === 0 || rect.width === 0) {
        reset()
        return
      }
      const vh = window.innerHeight
      let p = (vh - rect.top + MARGIN) / (rect.height + RANGE)
      p = Math.max(0, Math.min(1, p))
      if (p === 0) {
        reset()
        return
      }

      diamonds.forEach((diamond, i) => {
        const start = i * STAGGER
        const end = 1 - (n - 1 - i) * STAGGER
        let local = (p - start) / (end - start)
        local = Math.max(0, Math.min(1, local))
        const eased = easeOutCubic(local)
        const inv = 1 - eased
        const tx = inv * TRAVEL
        const rot = inv * -TURN
        if (tx === 0 && rot === 0) {
          diamond.style.removeProperty('transform')
          diamond.style.removeProperty('transition')
        } else {
          diamond.style.transition = 'none'
          diamond.style.transform = `translateX(calc(-50% + ${tx}px)) rotate(${45 + rot}deg)`
        }
      })
    }

    let scheduled = false
    const onScroll = () => {
      if (scheduled) return
      scheduled = true
      requestAnimationFrame(() => {
        update()
        scheduled = false
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    update()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      reset()
    }
  }, [arenaRef])
}
