import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { formatCurrency } from '../utils/format'

const DrhpFiled = () => {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    api.get('/companies/drhp-filed')
      .then((res) => { if (active) setCompanies(res.data) })
      .catch(() => { if (active) setCompanies([]) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  return (
    <div className="page-main">
      <div className="page-header">
        <Link to="/catalog" className="back-pill">← Back to Price List</Link>
        <h1>DRHP Filed</h1>
        <p className="page-subtitle">Companies that have filed their Draft Red Herring Prospectus.</p>
      </div>

      {loading ? (
        <p className="muted">Loading...</p>
      ) : companies.length === 0 ? (
        <div className="chart-empty">No companies have filed a DRHP yet.</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table catalog-table-desktop">
            <thead>
              <tr>
                <th>Company</th>
                <th>Sector</th>
                <th>Latest Price</th>
                <th>52-Week Range</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {companies.map((c) => (
                <tr key={c._id}>
                  <td>
                    <Link to={`/company/${c._id}`} className="company-link">{c.name}</Link>
                  </td>
                  <td>{c.sector || '—'}</td>
                  <td>{c.latestPrice != null ? formatCurrency(c.latestPrice) : '—'}</td>
                  <td>
                    {c.high52 != null && c.low52 != null
                      ? `${formatCurrency(c.low52)} – ${formatCurrency(c.high52)}`
                      : '—'}
                  </td>
                  <td>
                    <Link to={`/company/${c._id}`} className="row-action-btn">View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default DrhpFiled