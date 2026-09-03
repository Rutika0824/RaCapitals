import Footer from '../components/common/Footer'
import Navbar from '../components/common/Navbar'

// PLACEHOLDER content — replace with real registered office, contact email, and phone once confirmed with the client.
const Contact = () => {
  return (
    <div className="page-wrap">
      <Navbar />
      <main className="page-main">
        <header className="page-header">
          <p className="eyebrow">Contact</p>
          <h1>Get in touch with RA Capitals</h1>
          <p className="muted">
            We respond to every WhatsApp and email enquiry within one business day.
          </p>
        </header>

        <section className="contact-grid">
          <div className="contact-card">
            <h3>Company</h3>
            <p>RA Capitals</p>
          </div>
          <div className="contact-card">
            <h3>Registered Office</h3>
            {/* PLACEHOLDER — replace with actual registered address */}
            <p>[Registered Office Address Line 1]<br />[City, State, PIN]<br />India</p>
          </div>
          <div className="contact-card">
            <h3>Email</h3>
            {/* PLACEHOLDER — replace with real contact email */}
            <p className="mono">contact@racapitals.example</p>
          </div>
          <div className="contact-card">
            <h3>Phone / WhatsApp</h3>
            {/* PLACEHOLDER — replace with real contact phone */}
            <p className="mono">+91 99999 99999</p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

export default Contact