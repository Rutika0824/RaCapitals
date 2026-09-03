// Phone number is a placeholder — replace with the real RA Capitals WhatsApp Business number.
const WHATSAPP_PHONE = '919999999999'

const EnquireButton = ({ companyName }) => {
  const handleClick = () => {
    const message = `Hi, I'm interested in ${companyName}. Please share more details.`
    const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(message)}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  return (
    <button type="button" className="enquire-btn" onClick={handleClick}>
      Enquire on WhatsApp
    </button>
  )
}

export default EnquireButton