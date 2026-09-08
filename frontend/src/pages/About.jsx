import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import FloatingParticles from '../components/common/FloatingParticles'

const About = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 50)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="page-wrap">
      <Navbar />
      <main className="page-main">
        <div className="particles-container">
          <FloatingParticles />
        </div>
        <header className="page-header">
          <p className="eyebrow">About us</p>
          <h1>Research-driven access to unlisted and pre-IPO equity</h1>
          <p className="muted">
            RA Capitals has spent the last five years helping investors access unlisted and pre-IPO equity
            through an offline network built on trust, diligence, and direct relationships.
          </p>
        </header>

        <section className={`about-section ${visible ? 'reveal-visible' : 'reveal'}`}>
          <div className="about-grid">
            <div className="about-card">
              <h3>Who we are</h3>
              <p>
                RA Capitals is a research-focused intermediary for unlisted and pre-IPO shares in India.
                We work directly with company management, early investors, and promoters to verify
                fundamentals before any listing is presented to clients.
              </p>
            </div>
            <div className="about-card">
              <h3>What we do</h3>
              <p>
                We maintain a curated price list across sectors, supported by documented due diligence.
                Every enquiry is handled by a person on our team — no ticket queues, no auto-replies.
                We believe transparency and personal follow-up are non-negotiable.
              </p>
            </div>
            <div className="about-card">
              <h3>How it works</h3>
              <p>
                Browse the price list, shortlist opportunities, and tap <strong>Enquire</strong>. Our team
                responds on WhatsApp or email within one business day with current availability, lot size,
                and next steps. Once confirmed, shares move via demat-to-demat transfer.
              </p>
            </div>
            <div className="about-card">
              <h3>Our track record</h3>
              <p>
                Five years of offline track record in unlisted and pre-IPO equity. We have helped
                hundreds of investors access companies before they list, with a focus on risk-aware
                allocation and clear communication.
              </p>
            </div>
          </div>
        </section>

        <section className="about-cta-section">
          <Link to="/catalog" className="primary-btn">Browse the Price List</Link>
          <Link to="/contact" className="secondary-btn">Contact us</Link>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default About
