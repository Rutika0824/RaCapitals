import { useEffect, useState } from 'react'
import api from '../../services/api'

const AdminContacts = () => {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchSubmissions = async () => {
      setLoading(true)
      try {
        const res = await api.get('/contact')
        setSubmissions(res.data || [])
      } catch {
        setError('Failed to load contact submissions.')
      } finally {
        setLoading(false)
      }
    }
    fetchSubmissions()
  }, [])

  const handleMarkRead = async (id) => {
    try {
      await api.patch(`/contact/${id}/read`)
      setSubmissions((prev) =>
        prev.map((s) => (s._id === id ? { ...s, status: 'read' } : s))
      )
    } catch {
      // ignore
    }
  }

  return (
    <div className="admin-wrap">
      <div className="admin-page-header">
        <h1>Contact Submissions</h1>
        <p className="page-subtitle">Manage messages from the contact form.</p>
      </div>

      {loading ? (
        <p className="muted">Loading submissions…</p>
      ) : error ? (
        <p className="form-error">{error}</p>
      ) : submissions.length === 0 ? (
        <div className="chart-empty">No contact submissions yet.</div>
      ) : (
        <div className="admin-contacts-list">
          {submissions.map((s) => (
            <div
              key={s._id}
              className={`admin-contact-card ${s.status === 'new' ? 'admin-contact-card-new' : ''}`}
            >
              <div className="admin-contact-card-header">
                <div className="admin-contact-card-header-left">
                  <strong className="contact-name">{s.name}</strong>
                  {s.status === 'new' && <span className="contact-new-badge">• NEW</span>}
                </div>
                <span className="admin-contact-card-email mono">{s.email}</span>
              </div>
              <p className="admin-contact-card-message">{s.message}</p>
              <div className="admin-contact-card-footer">
                <span className="contact-date">
                  {new Date(s.createdAt).toLocaleString('en-IN', {
                    day: 'numeric', month: 'short', year: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                  })}
                </span>
                {s.status === 'new' && (
                  <button
                    type="button"
                    className="contact-read-btn"
                    onClick={() => handleMarkRead(s._id)}
                  >
                    Mark as read
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AdminContacts
