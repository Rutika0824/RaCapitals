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
  const range = max - min || 1
  const width = 600
  const height = 200
  const padding = 20
  const stepX = (width - padding * 2) / Math.max(prices.length - 1, 1)
  const coords = prices.map((price, i) => {
    const x = padding + i * stepX
    const y = padding + (height - padding * 2) * (1 - (price - min) / range)
    return `${x},${y}`
  })
  const polyline = coords.join(' ')
  return (
    <div className="chart-wrap">
      <svg viewBox={`0 0 ${width} ${height}`} className="chart-svg" role="img" aria-label="Price history">
        <rect x="0" y="0" width={width} height={height} fill="transparent" />
        <polyline points={polyline} fill="none" stroke="var(--brass)" strokeWidth="2" />
        {coords.map((c, i) => (
          <circle key={i} cx={c.split(',')[0]} cy={c.split(',')[1]} r="2.5" fill="var(--brass)" />
        ))}
      </svg>
    </div>
  )
}

const CompanyDetail = () => {
  const { id } = useParams()
  const [company, setCompany] = useState(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

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
              <img src={logoSrc} alt={`${company.name} logo`} />
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
      <Footer />
    </div>
  )
}

export default CompanyDetail