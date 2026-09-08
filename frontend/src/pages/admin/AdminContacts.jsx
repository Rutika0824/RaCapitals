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
      </div>

      {loading ? (
        <p className="muted">Loading submissions…</p>
      ) : error ? (
        <p className="form-error">{error}</p>
      ) : submissions.length === 0 ? (
        <p className="muted">No contact submissions yet.</p>
      ) : (
        <div className="admin-contacts-list">
          {submissions.map((s) => (
            <div
              key={s._id}
              className={`admin-contact-card ${s.status === 'new' ? 'admin-contact-card-new' : ''}`}
            >
              <div className="admin-contact-card-header">
                <strong>{s.name}</strong>
                <span className="admin-contact-card-email mono">{s.email}</span>
              </div>
              <p className="admin-contact-card-message">{s.message}</p>
              <div className="admin-contact-card-footer">
                <span className="muted">
                  {new Date(s.createdAt).toLocaleString('en-IN')}
                </span>
                {s.status === 'new' && (
                  <button
                    type="button"
                    className="secondary-btn"
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
