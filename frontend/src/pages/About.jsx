import { useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import Footer from '../components/common/Footer'
import FloatingParticles from '../components/common/FloatingParticles'

const ABOUT_SECTIONS = [
  {
    title: 'Who we are',
    body: 'RA Capitals is a research-focused intermediary for unlisted and pre-IPO shares in India. We work directly with company management, early investors, and promoters to verify fundamentals before any listing is presented to clients.',
    image: 'https://images.unsplash.com/photo-1556075294-3b8eb5e2e0d2?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'What we do',
    body: 'We maintain a curated price list across sectors, supported by documented due diligence. Every enquiry is handled by a person on our team — no ticket queues, no auto-replies. We believe transparency and personal follow-up are non-negotiable.',
    image: 'https://images.unsplash.com/photo-1551836880-7e8b9d710b9c?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'How it works',
    body: 'Browse the price list, shortlist opportunities, and tap Enquire. Our team responds on WhatsApp or email within one business day with current availability, lot size, and next steps. Once confirmed, shares move via demat-to-demat transfer.',
    image: 'https://images.unsplash.com/photo-1551360401-62fe59164005?auto=format&fit=crop&w=600&q=80'
  },
  {
    title: 'Our track record',
    body: 'Five years of offline track record in unlisted and pre-IPO equity. We have helped hundreds of investors access companies before they list, with a focus on risk-aware allocation and clear communication.',
    image: 'https://images.unsplash.com/photo-1486072431993-8059aec5f261?auto=format&fit=crop&w=600&q=80'
  }
]

const CARD_OFFSET_X = 280
const CARD_DEPTH_Z = 80
const FRONT_Z = 100
const ROTATION = 28
const EASING = 'cubic-bezier(0.25, 1, 0.5, 1)'

const getCardStyle = (index, activeIndex) => {
  const offset = index - activeIndex
  const absOffset = Math.abs(offset)

  if (absOffset === 0) {
    return {
      transform: `translate(-50%) translateX(0px) translateZ(${FRONT_Z}px) rotateY(0deg)`,
      opacity: 1,
      zIndex: 10,
      filter: 'brightness(1)',
      transition: `all 0.5s ${EASING}`
    }
  }

  const sign = offset > 0 ? 1 : -1
  const x = offset * CARD_OFFSET_X
  const z = absOffset === 1 ? -CARD_DEPTH_Z : -CARD_DEPTH_Z * 2
  const brightness = absOffset === 1 ? 0.7 : 0.5
  const zIndex = 10 - absOffset

  return {
    transform: `translate(-50%) translateX(${x}px) translateZ(${z}px) rotateY(${sign * ROTATION}deg)`,
    opacity: 0.75,
    zIndex,
    filter: `brightness(${brightness})`,
    transition: `all 0.5s ${EASING}`
  }
}

const CoverflowCard = ({ section, isActive, onClick, style }) => (
  <div
    className={`coverflow-card ${isActive ? 'coverflow-card-active' : ''}`}
    onClick={onClick}
    style={style}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => e.key === 'Enter' && onClick()}
    aria-label={`View: ${section.title}`}
  >
    <div className="coverflow-card-inner">
      <div className="coverflow-card-img-wrap">
        <img src={section.image} alt="" className="coverflow-card-img" loading="lazy" />
        <button type="button" className="coverflow-card-close" aria-hidden="true">✕</button>
      </div>
      <div className="coverflow-card-content">
        <h3>{section.title}</h3>
        <p>{section.body}</p>
      </div>
    </div>
  </div>
)

const About = () => {
  const [activeIndex, setActiveIndex] = useState(0)

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

        <section className="coverflow-section" aria-label="About RA Capitals">
          <div className="coverflow-outer">
            <div className="coverflow-inner">
              {ABOUT_SECTIONS.map((section, i) => (
                <CoverflowCard
                  key={section.title}
                  section={section}
                  isActive={i === activeIndex}
                  onClick={() => setActiveIndex(i)}
                  style={getCardStyle(i, activeIndex)}
                />
              ))}
            </div>
          </div>
        </section>

        <section className="about-cta-section">
          <Link to="/catalog" className="primary-btn about-cta-btn">Browse the Price List</Link>
          <Link to="/contact" className="secondary-btn">Contact us</Link>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default About
