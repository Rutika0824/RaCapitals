import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import ComplianceRibbon from '../components/common/ComplianceRibbon'
import EnquireButton from '../components/common/EnquireButton'
import Footer from '../components/common/Footer'
import Navbar from '../components/common/Navbar'
import HeroChart from '../components/home/HeroChart'
import { formatINR } from '../utils/format'

const PREVIEW_LIMIT = 12
const MARQUEE_DURATION = 22

const Home = () => {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sector, setSector] = useState('All')
  const [faqOpen, setFaqOpen] = useState(-1)
  const [heroChartData, setHeroChartData] = useState(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      setLoading(true)
      try {
        const res = await api.get('/companies', { params: { limit: PREVIEW_LIMIT } })
        if (!cancelled) {
          setCompanies(res.data || [])
          if (res.data && res.data.length > 0) {
            const firstCompany = res.data[0]
            const history = firstCompany.priceHistory || []
            if (history.length >= 2) {
              const firstPrice = history[0].price
              const lastPrice = history[history.length - 1].price
              const pctChange = firstPrice ? ((lastPrice - firstPrice) / firstPrice * 100).toFixed(1) : 0
              setHeroChartData({
                companyName: firstCompany.name,
                latestPrice: lastPrice,
                pctChange: pctChange >= 0 ? `+${pctChange}%` : `${pctChange}%`
              })
            }
          }
        }
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

  const toggleFaq = (index) => {
    setFaqOpen(prev => prev === index ? -1 : index)
  }

  return (
    <div className="home-page-wrap">
      <Navbar />
      <ComplianceRibbon />
      <main className="home-page-main">
        <section className="home-hero">
          <div className="home-hero-inner">
            <div className="home-hero-content">
              <p className="home-eyebrow">Unlisted & Pre-IPO Shares</p>
              <h1 className="home-hero-headline">Own tomorrow's listed companies, today.</h1>
              <p className="home-hero-body">
                Taurus Magnus has spent the last five years helping investors access unlisted and pre-IPO equity
                through an offline network built on trust, diligence, and direct relationships. This platform
                brings that research and access online — clearly, transparently, and without the noise of a
                live trading terminal.
              </p>
              <Link to="/catalog" className="home-hero-cta">Browse the price list</Link>
            </div>
            {heroChartData && (
              <HeroChart
                companyName={heroChartData.companyName}
                latestPrice={heroChartData.latestPrice}
                pctChange={heroChartData.pctChange}
              />
            )}
          </div>
        </section>

        <section className="home-marquee-section" aria-label="Live catalog ticker">
          <div className="home-marquee-header">
            <div>
              <p className="home-eyebrow">Live Catalog</p>
              <h2 className="home-section-title">A taste of the price list</h2>
            </div>
            <Link to="/catalog" className="home-marquee-cta">View Full Price List →</Link>
          </div>
          <div className="home-marquee-track" role="region" aria-label="Scrolling company cards">
            <div className="home-marquee-content">
              {loading ? (
                Array.from({ length: 8 }).map((_, i) => (
                  <div key={`skeleton-${i}`} className="home-marquee-card skeleton" />
                ))
              ) : visible.length === 0 ? (
                <div className="home-marquee-empty">No listings match your search.</div>
              ) : (
                [...visible, ...visible].map((c, i) => (
                  <article key={`${c._id}-${i}`} className="home-marquee-card">
                    <div className="home-marquee-card-top">
                      <h3 className="home-marquee-card-name">{c.name}</h3>
                      {c.sector && <span className="home-marquee-card-sector">{c.sector}</span>}
                    </div>
                    <div className="home-marquee-card-mid">
                      <span className="home-marquee-card-price-label">Indicative Price</span>
                      <span className="home-marquee-card-price mono">{formatINR(c.latestPrice)}</span>
                    </div>
                    {(c.high52 != null && c.low52 != null && c.priceHistory && c.priceHistory.length >= 2) && (
                      <div className="home-marquee-card-delta">
                        {(() => {
                          const history = c.priceHistory
                          const last = history[history.length - 1].price
                          const prev = history[history.length - 2].price
                          const diff = last - prev
                          const pct = prev ? ((diff / prev) * 100).toFixed(2) : 0
                          const isPositive = diff >= 0
                          return (
                            <span className={`home-marquee-delta ${isPositive ? 'positive' : 'negative'}`}>
                              {isPositive ? '▲' : '▼'} {Math.abs(pct)}%
                            </span>
                          )
                        })()}
                      </div>
                    )}
                  </article>
                ))
              )}
            </div>
          </div>
          <style jsx>{`
            .home-marquee-track {
              overflow: hidden;
              position: relative;
            }
            .home-marquee-content {
              display: flex;
              gap: 1rem;
              animation: marqueeScroll ${MARQUEE_DURATION}s linear infinite;
              width: max-content;
            }
            @keyframes marqueeScroll {
              0% { transform: translateX(0); }
              100% { transform: translateX(-50%); }
            }
          `}</style>
        </section>

        <section className="home-faq-section" aria-labelledby="faq-heading">
          <div className="home-section-header">
            <h2 id="faq-heading" className="home-section-title">Frequently Asked Questions</h2>
          </div>
          <div className="home-faq-grid">
            <article className="home-faq-card">
              <button
                type="button"
                className="home-faq-question"
                onClick={() => toggleFaq(0)}
                aria-expanded={faqOpen === 0}
                aria-controls="faq-answer-0"
              >
                <span>What are unlisted shares?</span>
                <span className="home-faq-icon" aria-hidden="true">
                  {faqOpen === 0 ? '−' : '+'}
                </span>
              </button>
              <div id="faq-answer-0" className="home-faq-answer" role="region" aria-hidden={faqOpen !== 0}>
                <p>Unlisted shares are equity shares of a company that are not listed on a recognised stock exchange (such as NSE or BSE). They are typically held by promoters, early investors, employees, or private equity funds. Transactions occur privately, often through intermediaries, and prices are negotiated rather than discovered on a public order book.</p>
              </div>
            </article>
            <article className="home-faq-card">
              <button
                type="button"
                className="home-faq-question"
                onClick={() => toggleFaq(1)}
                aria-expanded={faqOpen === 1}
                aria-controls="faq-answer-1"
              >
                <span>Why buy before a company's IPO?</span>
                <span className="home-faq-icon" aria-hidden="true">
                  {faqOpen === 1 ? '−' : '+'}
                </span>
              </button>
              <div id="faq-answer-1" className="home-faq-answer" role="region" aria-hidden={faqOpen !== 1}>
                <p>Investing before an IPO can provide access to companies at earlier growth stages, often at lower valuations than the eventual public offering price. However, it carries higher illiquidity risk, longer holding periods, and less regulatory oversight. Investors should assess their risk tolerance and investment horizon carefully.</p>
              </div>
            </article>
            <article className="home-faq-card">
              <button
                type="button"
                className="home-faq-question"
                onClick={() => toggleFaq(2)}
                aria-expanded={faqOpen === 2}
                aria-controls="faq-answer-2"
              >
                <span>How does a purchase actually work?</span>
                <span className="home-faq-icon" aria-hidden="true">
                  {faqOpen === 2 ? '−' : '+'}
                </span>
              </button>
              <div id="faq-answer-2" className="home-faq-answer" role="region" aria-hidden={faqOpen !== 2}>
                <p>Browse the price list, shortlist companies, and tap Enquire on any listing. Our team responds personally on WhatsApp or email within one business day with current availability, lot size, and next steps. Once terms are agreed, shares are transferred via demat-to-demat transfer with full documentation.</p>
              </div>
            </article>
            <article className="home-faq-card">
              <button
                type="button"
                className="home-faq-question"
                onClick={() => toggleFaq(3)}
                aria-expanded={faqOpen === 3}
                aria-controls="faq-answer-3"
              >
                <span>Is this SEBI-regulated?</span>
                <span className="home-faq-icon" aria-hidden="true">
                  {faqOpen === 3 ? '−' : '+'}
                </span>
              </button>
              <div id="faq-answer-3" className="home-faq-answer" role="region" aria-hidden={faqOpen !== 3}>
                <p>Taurus Magnus is an information platform for unlisted and pre-IPO shares — not a stock exchange, broker, or investment adviser. We do not execute trades, hold client funds, or offer regulated investment services. All transactions are private, bilateral arrangements between buyers and sellers. Investors should seek independent financial and legal advice before transacting.</p>
              </div>
            </article>
          </div>
        </section>

        <section className="home-trust-section" aria-labelledby="trust-heading">
          <h2 id="trust-heading" className="home-section-title">Research you can rely on</h2>
          <div className="home-trust-grid">
            <article className="home-trust-card">
              <div className="home-trust-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h3 className="home-trust-title">Research-driven</h3>
              <p className="home-trust-desc">Every listing is backed by documented due diligence and direct verification with company management.</p>
            </article>
            <article className="home-trust-card">
              <div className="home-trust-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h3 className="home-trust-title">Bank-level security</h3>
              <p className="home-trust-desc">Data encrypted in transit and at rest. Demat-to-demat transfers with full audit trails.</p>
            </article>
            <article className="home-trust-card">
              <div className="home-trust-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
              <h3 className="home-trust-title">Low ticket size</h3>
              <p className="home-trust-desc">Accessible lot sizes let you build a diversified pre-IPO portfolio without outsized capital.</p>
            </article>
            <article className="home-trust-card">
              <div className="home-trust-icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3 className="home-trust-title">Personal follow-up</h3>
              <p className="home-trust-desc">Every enquiry is handled by a person on our team — no ticket queues, no auto-replies.</p>
            </article>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default Home