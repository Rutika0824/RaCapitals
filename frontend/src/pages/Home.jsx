import { Link } from 'react-router-dom'
import ComplianceRibbon from '../components/common/ComplianceRibbon'
import Footer from '../components/common/Footer'
import Navbar from '../components/common/Navbar'

const Home = () => {
  return (
    <div className="page-wrap">
      <Navbar />
      <ComplianceRibbon />
      <main className="page-main">
        <section className="hero">
          <div className="hero-grid">
            <div className="hero-text">
              <p className="eyebrow fade-in-up">Unlisted &amp; Pre-IPO Shares</p>
              <h1 className="hero-headline fade-in-up delay-1">Own tomorrow's listed companies, today.</h1>
              <p className="hero-body fade-in-up delay-2">
                RA Capitals has spent the last five years helping investors access unlisted and pre-IPO equity
                through an offline network built on trust, diligence, and direct relationships. This platform
                brings that research and access online — clearly, transparently, and without the noise of a
                live trading terminal.
              </p>
              <Link to="/catalog" className="primary-btn fade-in-up delay-3">Browse the Price List</Link>
            </div>
            <div className="hero-logo-wrap fade-in-logo" aria-hidden="true">
              <img src="/logo.svg" alt="" className="hero-logo" />
            </div>
          </div>
        </section>

        <section className="how-it-works">
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
      </main>
      <Footer />
    </div>
  )
}

export default Home