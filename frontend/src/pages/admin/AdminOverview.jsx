import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import { formatINR } from '../../utils/format'

const AdminOverview = () => {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        const res = await api.get('/companies/admin/all')
        setCompanies(res.data || [])
      } catch {
        setCompanies([])
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [])

  const total = companies.length
  const live = companies.filter((c) => c.isActive).length
  const deactivated = total - live

  const recent = [...companies]
    .sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0))
    .slice(0, 4)

  return (
    <div className="admin-wrap">
      <div className="admin-page-header">
        <h1>Dashboard</h1>
      </div>

      {loading ? (
        <p className="muted">Loading overview…</p>
      ) : (
        <>
          <div className="admin-overview-stats">
            <div className="stat-card">
              <p className="stat-label">Total Companies</p>
              <p className="stat-value">{total}</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Live</p>
              <p className="stat-value">{live}</p>
            </div>
            <div className="stat-card">
              <p className="stat-label">Deactivated</p>
              <p className="stat-value">{deactivated}</p>
            </div>
          </div>

          <section className="detail-section">
            <h3 className="detail-subhead">Recently Updated</h3>
            {recent.length === 0 ? (
              <p className="muted">No companies yet.</p>
            ) : (
              <table className="detail-history-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Latest Price</th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map((c) => (
                    <tr key={c._id}>
                      <td>
                        <Link to={`/admin/companies/${c._id}`}>{c.name}</Link>
                      </td>
                      <td className="mono">{c.latestPrice == null ? '—' : formatINR(c.latestPrice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </>
      )}
    </div>
  )
}

export default AdminOverview
