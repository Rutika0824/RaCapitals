import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import ComplianceRibbon from '../components/common/ComplianceRibbon'
import CompanyPreviewCard from '../components/home/CompanyPreviewCard'
import EnquireButton from '../components/common/EnquireButton'
import Footer from '../components/common/Footer'
import Navbar from '../components/common/Navbar'
import TrustSeal from '../components/common/TrustSeal'
import useScrollReveal from '../hooks/useScrollReveal'
import FloatingParticles from '../components/common/FloatingParticles'
import { useTheme } from '../context/ThemeContext'
import HowItWorksAccordion from '../components/home/HowItWorksAccordion'
import AnimatedHeadline from '../components/home/AnimatedHeadline'

const SECTORS = ['All', 'Fintech', 'Energy', 'Logistics', 'Consumer', 'Healthcare']
const PREVIEW_LIMIT = 6

const Home = () => {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sector, setSector] = useState('All')
  const { theme } = useTheme()

  const previewRef = useScrollReveal()
  const trustRef = useScrollReveal()
  const howRef = useScrollReveal()
  const gridRef = useRef(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      try {
        const res = await api.get('/companies', { params: { limit: PREVIEW_LIMIT } })
        if (!cancelled) setCompanies(res.data || [])
      } catch (err) {
        if (!cancelled) setCompanies([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [])

  const sectorsAvailable = useMemo(() => {
    const set = new Set()
    companies.forEach((c) => { if (c.sector) set.add(c.sector) })
    return ['All', ...Array.from(set).sort()]
  }, [companies])

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase()
    return companies
      .filter((c) => sector === 'All' || c.sector === sector)
      .filter((c) => !q || (c.name || '').toLowerCase().includes(q))
      .slice(0, PREVIEW_LIMIT)
  }, [companies, sector, search])

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced || !gridRef.current) return
    const nodes = gridRef.current.querySelectorAll('.reveal:not(.reveal-visible)')
    if (!nodes.length) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.15 }
    )
    nodes.forEach((n) => observer.observe(n))
    return () => observer.disconnect()
  }, [visible])

  return (
    <div className="page-wrap">
      <Navbar />
      <ComplianceRibbon />
      <main className="page-main">
        <section className="hero hero-polished">
          <div className="particles-container">
            <FloatingParticles />
          </div>
          <div className="hero-glow hero-glow-brass" aria-hidden="true" />
          <div className="hero-glow hero-glow-ink" aria-hidden="true" />
          <div className="hero-grid">
            <div className="hero-text">
              <p className="eyebrow fade-in-up">Unlisted &amp; Pre-IPO Shares</p>
              <h1 className="hero-headline fade-in-up delay-1"><AnimatedHeadline text="Own tomorrow's listed companies, today." /></h1>
              <p className="hero-body fade-in-up delay-2">
                RA Capitals has spent the last five years helping investors access unlisted and pre-IPO equity
                through an offline network built on trust, diligence, and direct relationships. This platform
                brings that research and access online — clearly, transparently, and without the noise of a
                live trading terminal.
              </p>
              <Link to="/catalog" className="primary-btn fade-in-up delay-3">Browse the Price List</Link>
              <ul className="hero-stats fade-in-up delay-3">
                <li className="hero-stat">
                  <span className="hero-stat-num">01</span>
                  <span className="hero-stat-label">Researched Listings</span>
                </li>
                <li className="hero-stat">
                  <span className="hero-stat-num">02</span>
                  <span className="hero-stat-label">Direct WhatsApp Access</span>
                </li>
                <li className="hero-stat">
                  <span className="hero-stat-num">03</span>
                  <span className="hero-stat-label">Demat-to-Demat Transfer</span>
                </li>
              </ul>
            </div>
            <div className="hero-logo-wrap fade-in-logo" aria-hidden="true">
              <TrustSeal size={280} showSubText showRingText className="hero-trust-seal" />
            </div>
          </div>
        </section>

        <section className="home-preview reveal" ref={previewRef}>
          <div className="particles-container">
            <FloatingParticles />
          </div>
          <div className="home-preview-header">
            <div>
              <p className="eyebrow">Live Catalog</p>
              <h2 className="section-title">A taste of the price list</h2>
            </div>
            <Link to="/catalog" className="secondary-btn home-preview-cta">View Full Price List →</Link>
          </div>

          <div className="home-preview-controls">
            <input
              type="text"
              placeholder="Search by name…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />
            <div className="sector-chips">
              {sectorsAvailable.map((s) => (
                <button
                  key={s}
                  type="button"
                  className={`chip ${sector === s ? 'chip-active' : ''}`}
                  onClick={() => setSector(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <p className="muted">Loading listings…</p>
          ) : visible.length === 0 ? (
            <p className="muted">
              {companies.length === 0
                ? 'No listings are available yet — please check back soon.'
                : 'No listings match your search.'}
            </p>
          ) : (
            <div className="preview-grid" ref={gridRef}>
              {visible.map((c, i) => (
                <div key={c._id} className={`reveal reveal-stagger-${Math.min(i, 6)}`}>
                  <CompanyPreviewCard company={c} />
                </div>
              ))}
            </div>
          )}

          {!loading && companies.length > 0 && (
            <div className="home-preview-cta-row">
              <EnquireButton companyName="RA Capitals" />
            </div>
          )}
        </section>

        <section className="trust-band reveal" ref={trustRef}>
          <div className="trust-band-inner">
            <h2 className="trust-band-heading">Research you can rely on, access you can trust.</h2>
            <ul className="trust-band-points">
              <li>
                <span className="trust-band-num mono">5+</span>
                <span className="trust-band-label">Years Offline Track Record</span>
                <p>Five years of operating in the unlisted and pre-IPO space through direct, offline relationships.</p>
              </li>
              <li>
                <span className="trust-band-num mono">1:1</span>
                <span className="trust-band-label">Direct, Personal Follow-up</span>
                <p>Every enquiry is handled by a person on our team — no ticket queues, no auto-replies.</p>
              </li>
              <li>
                <span className="trust-band-num mono">D2D</span>
                <span className="trust-band-label">Demat-to-Demat Transfer</span>
                <p>Shares move securely between demat accounts with full documentation once a deal is confirmed.</p>
              </li>
            </ul>
          </div>
        </section>

        {theme === 'indigo-light' ? (
          <HowItWorksAccordion />
        ) : (
          <section className="how-it-works" ref={howRef}>
            <h2 className="section-title fade-in-up">How it works</h2>
            <div className="steps-grid">
              <div className="step-card fade-in-up">
                <div className="step-number">01</div>
                <h3>Discover a company</h3>
                <p>Browse our indicative price list across sectors and shortlist opportunities that fit your thesis.</p>
              </div>
              <div className="step-card fade-in-up delay-1">
                <div className="step-number">02</div>
                <h3>Enquire, we follow up on WhatsApp</h3>
                <p>Tap enquire on any listing. Our team responds personally with current availability and lot details.</p>
              </div>
              <div className="step-card fade-in-up delay-2">
                <div className="step-number">03</div>
                <h3>Shares reach your demat account</h3>
                <p>Once confirmed, shares are transferred securely into your demat account with full documentation.</p>
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default Home