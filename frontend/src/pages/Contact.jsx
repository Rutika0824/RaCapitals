import { useState } from 'react'
import Footer from '../components/common/Footer'
import Navbar from '../components/common/Navbar'
import FloatingParticles from '../components/common/FloatingParticles'

const ContactMailIcon = () => (
  <svg className="contact-card-icon" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="5" width="18" height="14" rx="1.5" />
    <path d="M3 7l9 6 9-6" />
  </svg>
)

const ContactOfficeIcon = () => (
  <svg className="contact-card-icon" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 21V6l8-3 8 3v15" />
    <path d="M4 21h16" />
    <path d="M9 10h.01M9 14h.01M9 18h.01M15 10h.01M15 14h.01M15 18h.01" />
  </svg>
)

const ContactPhoneIcon = () => (
  <svg className="contact-card-icon" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
)

const ContactBriefcaseIcon = () => (
  <svg className="contact-card-icon" viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="3" y="7" width="18" height="13" rx="1.5" />
    <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <path d="M3 13h18" />
  </svg>
)

// PLACEHOLDER content — replace with real registered office, contact email, and phone once confirmed with the client.
const CONTACT_EMAIL = 'contact@racapitals.example'

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState({})

  const validate = () => {
    const next = {}
    if (!form.name.trim()) next.name = 'Please enter your name.'
    if (!form.email.trim()) next.email = 'Please enter your email.'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) next.email = 'Please enter a valid email.'
    if (!form.message.trim()) next.message = 'Please enter a message.'
    return next
  }

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const next = validate()
    if (Object.keys(next).length > 0) {
      setErrors(next)
      return
    }
    const subject = `Website enquiry from ${form.name.trim()}`
    const body = `Name: ${form.name.trim()}\nEmail: ${form.email.trim()}\n\n${form.message.trim()}`
    const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    // No backend endpoint exists for this form — it opens the user's email client via mailto:.
    // If a stored-lead version is needed later, this should be replaced with a real API call.
    window.location.href = mailto
  }

  return (
    <div className="page-wrap">
      <Navbar />
      <main className="page-main">
        <div className="particles-container">
          <FloatingParticles />
        </div>
        <header className="page-header">
          <p className="eyebrow">Contact</p>
          <h1>Get in touch with RA Capitals</h1>
          <p className="muted">
            We respond to every WhatsApp and email enquiry within one business day.
          </p>
        </header>

        <section className="contact-grid">
          <div className="contact-card card-hover-tilt">
            <ContactBriefcaseIcon />
            <h3>Company</h3>
            <p>RA Capitals</p>
          </div>
          <div className="contact-card card-hover-tilt">
            <ContactOfficeIcon />
            <h3>Registered Office</h3>
            {/* PLACEHOLDER — replace with actual registered address */}
            <p>[Registered Office Address Line 1]<br />[City, State, PIN]<br />India</p>
          </div>
          <div className="contact-card card-hover-tilt">
            <ContactMailIcon />
            <h3>Email</h3>
            {/* PLACEHOLDER — replace with real contact email */}
            <p className="mono contact-card-long-text">{CONTACT_EMAIL}</p>
          </div>
          <div className="contact-card card-hover-tilt">
            <ContactPhoneIcon />
            <h3>Phone / WhatsApp</h3>
            {/* PLACEHOLDER — replace with real contact phone */}
            <p className="mono">+91 99999 99999</p>
          </div>
        </section>

        <section className="contact-form-section">
          <h2 className="section-title">Send us a message</h2>
          <form className="admin-form contact-form" onSubmit={handleSubmit} noValidate>
            <label className="form-label">
              Name
              <input
                type="text"
                className="form-input"
                value={form.name}
                onChange={handleChange('name')}
                placeholder="Your full name"
                aria-invalid={Boolean(errors.name)}
              />
              {errors.name && <span className="form-error">{errors.name}</span>}
            </label>
            <label className="form-label">
              Email
              <input
                type="email"
                className="form-input"
                value={form.email}
                onChange={handleChange('email')}
                placeholder="you@example.com"
                aria-invalid={Boolean(errors.email)}
              />
              {errors.email && <span className="form-error">{errors.email}</span>}
            </label>
            <label className="form-label">
              Message
              <textarea
                className="form-input contact-form-textarea"
                value={form.message}
                onChange={handleChange('message')}
                placeholder="How can we help?"
                rows={5}
                aria-invalid={Boolean(errors.message)}
              />
              {errors.message && <span className="form-error">{errors.message}</span>}
            </label>
            <button type="submit" className="primary-btn contact-form-submit">Send Message</button>
          </form>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default Contact