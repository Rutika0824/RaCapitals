import { useEffect, useRef, useState } from 'react'

const pricePoints = [
  { x: 20, y: 185 }, { x: 60, y: 175 }, { x: 100, y: 145 }, { x: 140, y: 160 },
  { x: 180, y: 115 }, { x: 220, y: 135 }, { x: 260, y: 85 }, { x: 300, y: 105 },
  { x: 340, y: 75 }, { x: 380, y: 55 }, { x: 420, y: 30 }, { x: 460, y: 10 }
]

const volumeData = [
  { x: 12, y: 180, h: 45 }, { x: 52, y: 165, h: 60 }, { x: 92, y: 150, h: 75 },
  { x: 132, y: 170, h: 55 }, { x: 172, y: 130, h: 95 }, { x: 212, y: 160, h: 65 },
  { x: 252, y: 140, h: 85 }, { x: 292, y: 115, h: 110 }, { x: 332, y: 155, h: 70 },
  { x: 372, y: 100, h: 125 }, { x: 412, y: 80, h: 145 }, { x: 452, y: 45, h: 180 }
]

const pathD = `M ${pricePoints.map((p, i) => (i === 0 ? 'M' : 'L') + ` ${p.x},${p.y}`).join(' ')}`
const areaD = `${pathD} L 460,225 L 20,225 Z`

const HeroChart = ({ companyName = 'Taurus Magnus', latestPrice = 5.75, pctChange = '+310.71%' }) => {
  const containerRef = useRef(null)
  const pathRef = useRef(null)
  const crosshairVRef = useRef(null)
  const crosshairHRef = useRef(null)
  const hoverDotRef = useRef(null)
  const tooltipRef = useRef(null)
  const displayPriceRef = useRef(null)
  const volumeBarsRef = useRef([])
  const [isHovering, setIsHovering] = useState(false)
  const [hoverData, setHoverData] = useState({ price: latestPrice, vol: 1.2, x: 0, y: 0 })
  const [activeTimeframe, setActiveTimeframe] = useState('MAX')

  useEffect(() => {
    if (pathRef.current) {
      pathRef.current.style.strokeDasharray = pathRef.current.getTotalLength()
      pathRef.current.style.strokeDashoffset = pathRef.current.getTotalLength()
      pathRef.current.style.animation = 'drawLine 2s cubic-bezier(0.25, 1, 0.5, 1) forwards'
    }
  }, [])

  const handleMouseMove = (e) => {
    const container = containerRef.current
    if (!container || !pathRef.current) return

    const rect = container.getBoundingClientRect()
    const mouseX = e.clientX - rect.left
    const normalizedX = Math.max(0, Math.min(mouseX, rect.width))

    const targetX = (normalizedX / rect.width) * 500
    const pathLength = pathRef.current.getTotalLength()

    let beginning = 0, end = pathLength, targetPoint = pathRef.current.getPointAtLength(0)
    while (beginning <= end) {
      const mid = (beginning + end) / 2
      const point = pathRef.current.getPointAtLength(mid)
      if (Math.abs(point.x - targetX) < 0.5) {
        targetPoint = point
        break
      }
      if (point.x < targetX) beginning = mid + 1
      else end = mid - 1
    }

    const calculatedPrice = (1.10 + ((225 - targetPoint.y) / 225) * 4.65).toFixed(2)
    const calculatedVol = (0.4 + (targetPoint.x / 500) * 1.8).toFixed(1)

    if (crosshairVRef.current) {
      crosshairVRef.current.setAttribute('x1', targetPoint.x)
      crosshairVRef.current.setAttribute('x2', targetPoint.x)
      crosshairVRef.current.setAttribute('y1', 0)
      crosshairVRef.current.setAttribute('y2', 225)
    }
    if (crosshairHRef.current) {
      crosshairHRef.current.setAttribute('x1', 0)
      crosshairHRef.current.setAttribute('x2', 500)
      crosshairHRef.current.setAttribute('y1', targetPoint.y)
      crosshairHRef.current.setAttribute('y2', targetPoint.y)
    }
    if (hoverDotRef.current) {
      hoverDotRef.current.setAttribute('cx', targetPoint.x)
      hoverDotRef.current.setAttribute('cy', targetPoint.y)
    }

    const tooltipX = Math.min(Math.max(mouseX - 50, 10), rect.width - 140)
    const tooltipY = targetPoint.y * (rect.height / 240) - 45

    setHoverData({ price: calculatedPrice, vol: calculatedVol, x: tooltipX, y: tooltipY })
    if (displayPriceRef.current) displayPriceRef.current.textContent = `₹${calculatedPrice}`

    volumeBarsRef.current.forEach(bar => {
      if (!bar) return
      const barX = parseFloat(bar.getAttribute('x'))
      if (Math.abs(barX - targetPoint.x) < 20) {
        bar.classList.add('active')
      } else {
        bar.classList.remove('active')
      }
    })

    setIsHovering(true)
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
    if (displayPriceRef.current) displayPriceRef.current.textContent = `₹${latestPrice}`
    volumeBarsRef.current.forEach(bar => bar?.classList.remove('active'))
  }

  const timeframes = ['1M', '6M', '1Y', '3Y', 'MAX']

  return (
    <div className="hero-chart-card">
      <div className="hero-chart-header">
        <span className="hero-chart-sub">Indicative Price History</span>
        <span className="hero-chart-live">
          <span className="hero-chart-dot" />
          Live Feed
        </span>
      </div>
      <div className="hero-chart-price-row">
        <span className="hero-chart-current-price" ref={displayPriceRef}>₹{latestPrice}</span>
        <span className="hero-chart-gain">▲ {pctChange} <span>over Max</span></span>
      </div>

      <div
        ref={containerRef}
        className="hero-chart-wrapper"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div className="hero-chart-tooltip" ref={tooltipRef} style={isHovering ? { opacity: 1, transform: `translate(${hoverData.x}px, ${hoverData.y}px)` } : { opacity: 0 }}>
          ₹{hoverData.price} • Vol: {hoverData.vol}M
        </div>

        <svg className="hero-chart-svg" viewBox="0 0 500 240" preserveAspectRatio="none">
          <defs>
            <linearGradient id="hero-blue-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
            </linearGradient>
          </defs>

          <line className="hero-grid-line" x1="0" y1="50" x2="500" y2="50" />
          <line className="hero-grid-line" x1="0" y1="110" x2="500" y2="110" />
          <line className="hero-grid-line" x1="0" y1="170" x2="500" y2="170" />

          <g id="hero-volume-bars">
            {volumeData.map((bar, i) => (
              <rect
                key={i}
                ref={el => { volumeBarsRef.current[i] = el }}
                className="hero-volume-bar"
                x={bar.x}
                y={bar.y}
                width="16"
                height={bar.h}
                rx="3"
              />
            ))}
          </g>

          <path className="hero-chart-area" d={areaD} fill="url(#hero-blue-gradient)" />
          <path
            ref={pathRef}
            className="hero-chart-line"
            d={pathD}
          />

          <line
            ref={crosshairVRef}
            className="hero-crosshair-line"
            x1="0" y1="0" x2="0" y2="225"
          />
          <line
            ref={crosshairHRef}
            className="hero-crosshair-line"
            x1="0" y1="0" x2="500" y2="0"
          />

          <circle
            ref={hoverDotRef}
            className="hero-hover-dot"
            cx="0" cy="0" r="6"
          />
        </svg>
      </div>

      <div className="hero-chart-controls">
        <div className="hero-timeframe-group">
          {timeframes.map(tf => (
            <button
              key={tf}
              className={`hero-tf-btn ${activeTimeframe === tf ? 'active' : ''}`}
              onClick={() => setActiveTimeframe(tf)}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <style jsx>{`
        .hero-chart-card {
          background: rgba(255, 255, 255, 0.72);
          backdrop-filter: blur(90px);
          -webkit-backdrop-filter: blur(100px);
          border: 1px solid rgba(255, 255, 255, 0.85);
          border-radius: 24px;
          padding: 24px;
          box-shadow:
            0 25px 50px -12px rgba(37, 99, 235, 0.12),
            0 10px 20px -5px rgba(15, 23, 42, 0.05),
            inset 0 1px 0 0 rgba(255, 255, 255, 0.95);
          width: 100%;
          max-width: 400px;
        }

        .hero-chart-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 6px;
        }

        .hero-chart-sub {
          font-size: 11px;
          font-weight: 700;
          color: #64748b;
          letter-spacing: 0.8px;
          text-transform: uppercase;
        }

        .hero-chart-live {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 600;
          color: #2563eb;
          background: rgba(37, 99, 235, 0.08);
          padding: 4px 10px;
          border-radius: 20px;
          border: 1px solid rgba(37, 99, 235, 0.15);
        }

        .hero-chart-dot {
          width: 6px;
          height: 6px;
          background-color: #2563eb;
          border-radius: 50%;
          box-shadow: 0 0 8px #2563eb;
        }

        .hero-chart-price-row {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          margin-bottom: 20px;
        }

        .hero-chart-current-price {
          font-size: 32px;
          font-weight: 800;
          color: #0f172a;
          letter-spacing: -0.5px;
        }

        .hero-chart-gain {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: rgba(37, 99, 235, 0.08);
          border: 1px solid rgba(37, 99, 235, 0.2);
          color: #2563eb;
          font-size: 13px;
          font-weight: 700;
          padding: 4px 12px;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.08);
        }

        .hero-chart-gain span {
          font-weight: 500;
          color: #64748b;
        }

        .hero-chart-wrapper {
          position: relative;
          width: 100%;
          height: 220px;
          cursor: crosshair;
          background: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          border-radius: 18px;
          border: 1px solid rgba(226, 232, 240, 0.6);
          padding: 10px;
        }

        .hero-chart-svg {
          width: 100%;
          height: 100%;
          overflow: visible;
        }

        .hero-volume-bar {
          fill: #2563eb;
          opacity: 0.12;
          transition: opacity 0.2s ease, fill 0.2s ease;
        }

        .hero-volume-bar.active {
          opacity: 0.35;
          fill: #2563eb;
        }

        .hero-chart-line {
          fill: none;
          stroke: #2563eb;
          stroke-width: 3.5;
          stroke-linejoin: round;
          stroke-linecap: round;
          filter: drop-shadow(0px 8px 12px rgba(37, 99, 235, 0.35));
        }

        .hero-chart-area {
          opacity: 0;
          animation: fadeIn 0.8s ease forwards 1s;
        }

        .hero-grid-line {
          stroke: #e2e8f0;
          stroke-width: 1;
          stroke-dasharray: 4 4;
          opacity: 0.7;
        }

        .hero-crosshair-line {
          stroke: #94a3b8;
          stroke-width: 1.5;
          stroke-dasharray: 3 3;
          opacity: 0;
          transition: opacity 0.15s ease;
          pointer-events: none;
        }

        .hero-hover-dot {
          fill: #2563eb;
          stroke: #ffffff;
          stroke-width: 3.5;
          r: 6;
          opacity: 0;
          transition: opacity 0.15s ease;
          pointer-events: none;
          filter: drop-shadow(0px 4px 10px rgba(37, 99, 235, 0.8));
        }

        .hero-chart-tooltip {
          position: absolute;
          background: rgba(15, 23, 42, 0.85);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          color: #ffffff;
          padding: 8px 14px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 600;
          pointer-events: none;
          transition: opacity 0.15s ease, transform 0.1s ease;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.15);
          z-index: 10;
          white-space: nowrap;
        }

        .hero-chart-controls {
          margin-top: 16px;
          border-top: 1px solid rgba(226, 232, 240, 0.8);
          padding-top: 16px;
        }

        .hero-timeframe-group {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: rgba(241, 245, 249, 0.6);
          backdrop-filter: blur(8px);
          padding: 5px;
          border-radius: 14px;
          border: 1px solid rgba(226, 232, 240, 0.8);
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.02);
        }

        .hero-tf-btn {
          flex: 1;
          background: transparent;
          border: none;
          color: #64748b;
          font-size: 13px;
          font-weight: 700;
          padding: 8px 0;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .hero-tf-btn:hover {
          color: #2563eb;
        }

        .hero-tf-btn.active {
          background: #ffffff;
          color: #2563eb;
          box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
        }

        @keyframes drawLine {
          from { stroke-dashoffset: 1000; }
          to { stroke-dashoffset: 0; }
        }

        @keyframes fadeIn {
          to { opacity: 1; }
        }

        @media (max-width: 768px) {
          .hero-chart-card {
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  )
}

export default HeroChart