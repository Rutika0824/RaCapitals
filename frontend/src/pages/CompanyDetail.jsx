import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../services/api'
import ComplianceRibbon from '../components/common/ComplianceRibbon'
import EnquireButton from '../components/common/EnquireButton'
import Footer from '../components/common/Footer'
import Navbar from '../components/common/Navbar'
import { apiBaseWithoutApi, formatINR } from '../utils/format'

const buildLogoSrc = (logoUrl) => {
  if (!logoUrl) return null
  if (logoUrl.startsWith('http')) return logoUrl
  return `${apiBaseWithoutApi()}${logoUrl}`
}

const PriceChart = ({ history }) => {
  const points = history || []
  const [hoveredIdx, setHoveredIdx] = useState(null)
  if (points.length < 2) {
    return (
      <div className="chart-empty">
        <p>Not enough price history to draw a chart yet.</p>
      </div>
    )
  }
  const prices = points.map((p) => Number(p.price)).filter((n) => !Number.isNaN(n))
  const min = Math.min(...prices)
  const max = Math.max(...prices)
  const mid = (min + max) / 2
  const range = max - min || 1
  const width = 600
  const height = 300
  const padding = 20
  const leftPad = 70
  const bottomPad = 30
  const plotTop = padding
  const plotBottom = height - padding - bottomPad
  const plotH = plotBottom - plotTop
  const plotW = width - padding * 2 - leftPad
  const stepX = plotW / Math.max(prices.length - 1, 1)
  const coords = prices.map((price, i) => {
    const x = leftPad + padding + i * stepX
    const y = plotTop + plotH * (1 - (price - min) / range)
    return { x, y, price }
  })
  const formatShortDate = (value) => {
    const d = new Date(value)
    if (Number.isNaN(d.getTime())) return ''
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  }
  const yLabelY = (val) => plotTop + plotH * (1 - (val - min) / range)
  const gridYs = [max, mid, min].map((v) => yLabelY(v))
  const smoothPath = (pts) => {
    if (pts.length === 0) return ''
    if (pts.length === 1) return `M ${pts[0].x},${pts[0].y}`
    let d = `M ${pts[0].x},${pts[0].y}`
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i - 1] || pts[i]
      const p1 = pts[i]
      const p2 = pts[i + 1]
      const p3 = pts[i + 2] || p2
      const cp1x = p1.x + (p2.x - p0.x) / 6
      const cp1y = p1.y + (p2.y - p0.y) / 6
      const cp2x = p2.x - (p3.x - p1.x) / 6
      const cp2y = p2.y - (p3.y - p1.y) / 6
      d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`
    }
    return d
  }
  const linePath = smoothPath(coords)
  const areaPath = `${linePath} L ${coords[coords.length - 1].x},${plotBottom} L ${coords[0].x},${plotBottom} Z`
  const firstDate = points[0]?.date || points[0]?.createdAt
  const lastDate = points[points.length - 1]?.date || points[points.length - 1]?.createdAt
  const hovered = hoveredIdx != null ? coords[hoveredIdx] : null
  const hoveredDate = hoveredIdx != null ? (points[hoveredIdx]?.date || points[hoveredIdx]?.createdAt) : null
  const tooltipW = 130
  const tooltipH = 44
  const tooltipX = hovered ? Math.min(Math.max(hovered.x - tooltipW / 2, padding), width - padding - tooltipW) : 0
  const tooltipY = hovered ? Math.max(hovered.y - tooltipH - 10, padding) : 0
  return (
    <div className="chart-wrap">
      <svg viewBox={`0 0 ${width} ${height}`} className="chart-svg" role="img" aria-label="Price history">
        <defs>
          <linearGradient id="chart-area-gradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--brass)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="var(--brass)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width={width} height={height} fill="transparent" />
        {gridYs.map((gy, i) => (
          <line
            key={`grid-${i}`}
            x1={leftPad + padding - 6}
            y1={gy}
            x2={width - padding}
            y2={gy}
            className="chart-grid-line"
          />
        ))}
        <text x={leftPad} y={yLabelY(max) + 4} className="chart-axis-label" textAnchor="start">{formatINR(max)}</text>
        <text x={leftPad} y={yLabelY(mid) + 4} className="chart-axis-label" textAnchor="start">{formatINR(mid)}</text>
        <text x={leftPad} y={yLabelY(min) + 4} className="chart-axis-label" textAnchor="start">{formatINR(min)}</text>
        <path d={areaPath} fill="url(#chart-area-gradient)" stroke="none" />
        <path d={linePath} fill="none" stroke="var(--brass)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {coords.map((c, i) => (
          <g key={i}>
            <circle cx={c.x} cy={c.y} r="2.5" fill="var(--brass)" />
            <circle
              cx={c.x}
              cy={c.y}
              r="10"
              fill="transparent"
              style={{ cursor: 'pointer' }}
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx((cur) => (cur === i ? null : cur))}
              onFocus={() => setHoveredIdx(i)}
              onBlur={() => setHoveredIdx((cur) => (cur === i ? null : cur))}
              onClick={() => setHoveredIdx((cur) => (cur === i ? null : i))}
              tabIndex={0}
              aria-label={`Price ${formatINR(c.price)} on ${formatShortDate(points[i]?.date || points[i]?.createdAt)}`}
            />
          </g>
        ))}
        {firstDate && (
          <text x={leftPad + padding} y={height - 8} className="chart-axis-label" textAnchor="start">{formatShortDate(firstDate)}</text>
        )}
        {lastDate && (
          <text x={width - padding} y={height - 8} className="chart-axis-label" textAnchor="end">{formatShortDate(lastDate)}</text>
        )}
        {hovered && (
          <g pointerEvents="none">
            <line x1={hovered.x} y1={hovered.y} x2={hovered.x} y2={plotBottom} className="chart-hover-line" />
            <circle cx={hovered.x} cy={hovered.y} r="5" fill="var(--brass)" stroke="var(--white)" strokeWidth="2" />
            <rect x={tooltipX} y={tooltipY} width={tooltipW} height={tooltipH} rx="4" ry="4" className="chart-tooltip-box" />
            <text x={tooltipX + tooltipW / 2} y={tooltipY + 18} className="chart-tooltip-price" textAnchor="middle">{formatINR(hovered.price)}</text>
            <text x={tooltipX + tooltipW / 2} y={tooltipY + 34} className="chart-tooltip-date" textAnchor="middle">{formatShortDate(hoveredDate)}</text>
          </g>
        )}
      </svg>
    </div>
  )
}

const CompanyDetail = () => {
  const { id } = useParams()
  const [company, setCompany] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)

  useEffect(() => {
    const fetchCompany = async () => {
      setLoading(true)
      setNotFound(false)
      try {
        const res = await api.get(`/companies/${id}`)
        setCompany(res.data)
      } catch (err) {
        if (err?.response?.status === 404) {
          setNotFound(true)
        } else {
          setNotFound(true)
        }
      } finally {
        setLoading(false)
      }
    }
    fetchCompany()
  }, [id])

  if (loading) {
    return (
      <div className="page-wrap">
        <Navbar />
        <ComplianceRibbon />
        <main className="page-main"><p className="muted">Loading company…</p></main>
        <Footer />
      </div>
    )
  }

  if (notFound || !company) {
    return (
      <div className="page-wrap">
        <Navbar />
        <ComplianceRibbon />
        <main className="page-main"><p className="muted">Company not found.</p></main>
        <Footer />
      </div>
    )
  }

  const logoSrc = buildLogoSrc(company.logoUrl)
  const initial = company.name ? company.name.charAt(0).toUpperCase() : '?'
  const history = company.priceHistory || []
  const latestPrice = history.length ? history[history.length - 1].price : null

  return (
    <div className="page-wrap">
      <Navbar />
      <ComplianceRibbon />
      <main className="page-main">
        <header className="company-header">
          <div className="company-logo">
            {logoSrc ? (
              <button
                type="button"
                className="company-logo-thumb-btn"
                onClick={() => setIsLightboxOpen(true)}
                aria-label={`View full-size ${company.name} logo`}
              >
                <img src={logoSrc} alt={`${company.name} logo`} className="company-logo-thumb" />
              </button>
            ) : (
              <span className="logo-placeholder">{initial}</span>
            )}
          </div>
          <div className="company-header-text">
            <h1>{company.name}</h1>
            {company.sector && <span className="sector-badge">{company.sector}</span>}
            {company.isin && <p className="muted mono">ISIN: {company.isin}</p>}
          </div>
        </header>

        <section className="company-stats">
          <div className="stat-card">
            <p className="stat-label">Indicative Price</p>
            <p className="stat-value mono">{formatINR(latestPrice)}</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">52W High</p>
            <p className="stat-value mono">{formatINR(company.high52)}</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">52W Low</p>
            <p className="stat-value mono">{formatINR(company.low52)}</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Lot Size</p>
            <p className="stat-value mono">{company.lotSize ?? '—'}</p>
          </div>
          <div className="stat-card">
            <p className="stat-label">Face Value</p>
            <p className="stat-value mono">{formatINR(company.faceValue)}</p>
          </div>
        </section>

        {company.description && (
          <section className="company-section">
            <h2 className="section-title">About</h2>
            <p>{company.description}</p>
          </section>
        )}

        <section className="company-section">
          <h2 className="section-title">Price History</h2>
          <PriceChart history={history} />
        </section>

        <section className="company-enquire">
          <EnquireButton companyName={company.name} />
        </section>
      </main>

      {isLightboxOpen && logoSrc && (
        <div
          className="logo-lightbox-overlay"
          onClick={() => setIsLightboxOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label={`${company.name} logo preview`}
        >
          <button
            type="button"
            className="logo-lightbox-close"
            onClick={(e) => { e.stopPropagation(); setIsLightboxOpen(false) }}
            aria-label="Close logo preview"
          >
            ✕
          </button>
          <img
            src={logoSrc}
            alt={`${company.name} logo`}
            className="logo-lightbox-img"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      <Footer />
    </div>
  )
}

export default CompanyDetail