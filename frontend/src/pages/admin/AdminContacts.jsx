import { useEffect, useState } from 'react'
import api from '../../services/api'

const AdminContacts = () => {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [searchTerm, setSearchTerm] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 6

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

  // Derived state for filters
  const filteredSubmissions = submissions.filter((s) => {
    const matchSearch =
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    let matchDate = true
    if (startDate || endDate) {
      const sDate = new Date(s.createdAt)
      const sDateWithoutTime = new Date(sDate.getFullYear(), sDate.getMonth(), sDate.getDate())
      
      if (startDate) {
        const start = new Date(startDate)
        if (sDateWithoutTime < start) matchDate = false
      }
      if (endDate) {
        const end = new Date(endDate)
        if (sDateWithoutTime > end) matchDate = false
      }
    }

    return matchSearch && matchDate
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage)
  const paginatedSubmissions = filteredSubmissions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages)
    }
  }, [totalPages, currentPage])

  return (
    <div className="admin-wrap">
      <div className="admin-page-header">
        <h1>Contact Submissions</h1>
        <p className="page-subtitle">Manage messages from the contact form.</p>
      </div>

      <div className="admin-filters" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-input"
          style={{ flex: 1, minWidth: '200px' }}
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="form-input"
          placeholder="Start Date"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="form-input"
          placeholder="End Date"
        />
      </div>

      {loading ? (
        <p className="muted">Loading submissions…</p>
      ) : error ? (
        <p className="form-error">{error}</p>
      ) : filteredSubmissions.length === 0 ? (
        <div className="chart-empty">No contact submissions found.</div>
      ) : (
        <>
          <div className="admin-table-wrap" style={{ overflowX: 'auto' }}>
            <table className="admin-table" style={{ width: '100%' }}>
              <thead>
                <tr>
                  <th>Sr No</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Message</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedSubmissions.map((s, idx) => (
                  <tr key={s._id} style={{ background: s.status === 'new' ? 'var(--surface-3)' : 'transparent' }}>
                    <td>{(currentPage - 1) * itemsPerPage + idx + 1}</td>
                    <td>
                      <strong>{s.name}</strong>
                      {s.status === 'new' && <span className="contact-new-badge" style={{ marginLeft: '8px', fontSize: '0.75em', padding: '2px 6px', background: 'var(--brass)', color: 'var(--ink)', borderRadius: '4px' }}>NEW</span>}
                    </td>
                    <td className="mono">{s.email}</td>
                    <td style={{ maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={s.message}>
                      {s.message}
                    </td>
                    <td>
                      {new Date(s.createdAt).toLocaleString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric',
                        hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                    <td>
                      {s.status === 'new' && (
                        <button
                          type="button"
                          className="btn-primary"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.85rem' }}
                          onClick={() => handleMarkRead(s._id)}
                        >
                          Mark Read
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="pagination" style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '1.5rem' }}>
              <button
                className="btn-outline"
                style={{ padding: '0.25rem 0.75rem' }}
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
              >
                Prev
              </button>
              <span style={{ display: 'flex', alignItems: 'center' }}>
                Page {currentPage} of {totalPages}
              </span>
              <button
                className="btn-outline"
                style={{ padding: '0.25rem 0.75rem' }}
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default AdminContacts
