import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import ComplianceRibbon from '../components/common/ComplianceRibbon'
import EnquireButton from '../components/common/EnquireButton'
import Footer from '../components/common/Footer'
import Navbar from '../components/common/Navbar'
import { formatINR } from '../utils/format'

const SECTORS = ['All', 'Fintech', 'Energy', 'Logistics', 'Consumer', 'Healthcare']

const Catalog = () => {
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [sector, setSector] = useState('All')
  const navigate = useNavigate()

  const fetchCompanies = async (overrides = {}) => {
    setLoading(true)
    try {
      const params = {}
      const s = overrides.sector !== undefined ? overrides.sector : sector
      const q = overrides.search !== undefined ? overrides.search : search
      if (s && s !== 'All') params.sector = s
      if (q && q.trim()) params.search = q.trim()
      const res = await api.get('/companies', { params })
      setCompanies(res.data || [])
    } catch (err) {
      setCompanies([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCompanies()
  }, [])

  const handleSectorClick = (next) => {
    setSector(next)
    fetchCompanies({ sector: next })
  }

  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearch(value)
    fetchCompanies({ search: value })
  }

  return (
    <div className="page-wrap">
      <Navbar />
      <ComplianceRibbon />
      <main className="page-main">
        <header className="page-header">
          <p className="eyebrow">Indicative Price List</p>
          <h1>Unlisted &amp; Pre-IPO Companies</h1>
          <p className="muted">Browse, filter, and enquire on companies we track. Prices are indicative and updated periodically.</p>
        </header>

        <div className="catalog-controls">
          <input
            type="text"
            placeholder="Search by company name…"
            value={search}
            onChange={handleSearchChange}
            className="search-input"
          />
          <div className="sector-chips">
            {SECTORS.map((s) => (
              <button
                key={s}
                type="button"
                className={`chip ${sector === s ? 'chip-active' : ''}`}
                onClick={() => handleSectorClick(s)}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p className="muted">Loading companies…</p>
        ) : companies.length === 0 ? (
          <p className="muted">No companies match your search.</p>
        ) : (
          <div className="catalog-table-wrap">
            <table className="catalog-table">
              <thead>
                <tr>
                  <th>Company Name</th>
                  <th>Indicative Price</th>
                  <th>52W Range</th>
                  <th>Lot Size</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {companies.map((c) => (
                  <tr key={c._id} className="catalog-row" onClick={() => navigate(`/company/${c._id}`)}>
                    <td>
                      <div className="company-cell">
                        <span className="company-name">{c.name}</span>
                        {c.sector && <span className="sector-badge">{c.sector}</span>}
                      </div>
                    </td>
                    <td className="mono">{formatINR(c.latestPrice)}</td>
                    <td className="mono">{c.low52 != null && c.high52 != null ? `${formatINR(c.low52)} – ${formatINR(c.high52)}` : '—'}</td>
                    <td className="mono">{c.lotSize ?? '—'}</td>
                    <td onClick={(e) => e.stopPropagation()}>
                      <EnquireButton companyName={c.name} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

export default Catalog