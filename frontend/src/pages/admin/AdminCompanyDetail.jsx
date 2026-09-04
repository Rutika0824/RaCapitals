import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import api from '../../services/api'
import { apiBaseWithoutApi, formatINR } from '../../utils/format'
import InfoTooltip from '../../components/common/InfoTooltip'

const AdminCompanyDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [company, setCompany] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [flash, setFlash] = useState('')

  const [priceModalOpen, setPriceModalOpen] = useState(false)
  const [priceValue, setPriceValue] = useState('')
  const [priceError, setPriceError] = useState('')

  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editForm, setEditForm] = useState({
    name: '', sector: '', description: '', lotSize: '', faceValue: '', isin: '',
  })
  const [editError, setEditError] = useState('')

  const loadAll = async () => {
    setLoading(true)
    setError('')
    try {
      const [companyRes, historyRes] = await Promise.all([
        api.get(`/companies/${id}`),
        api.get(`/prices/${id}`),
      ])
      setCompany(companyRes.data)
      setHistory(historyRes.data || [])
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to load company')
      setCompany(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadAll()
  }, [id])

  useEffect(() => {
    if (!flash) return
    const t = setTimeout(() => setFlash(''), 3000)
    return () => clearTimeout(t)
  }, [flash])

  const openEdit = () => {
    setEditForm({
      name: company.name || '',
      sector: company.sector || '',
      description: company.description || '',
      lotSize: company.lotSize ?? '',
      faceValue: company.faceValue ?? '',
      isin: company.isin || '',
    })
    setEditError('')
    setEditModalOpen(true)
  }

  const submitEdit = async (e) => {
    e.preventDefault()
    setEditError('')
    try {
      const payload = {
        name: editForm.name.trim(),
        sector: editForm.sector.trim(),
        description: editForm.description.trim(),
        lotSize: editForm.lotSize === '' ? undefined : Number(editForm.lotSize),
        faceValue: editForm.faceValue === '' ? undefined : Number(editForm.faceValue),
        isin: editForm.isin.trim(),
      }
      await api.put(`/companies/${id}`, payload)
      setEditModalOpen(false)
      setFlash(`Updated "${payload.name}"`)
      await loadAll()
    } catch (err) {
      setEditError(err?.response?.data?.message || 'Save failed')
    }
  }

  const submitPrice = async (e) => {
    e.preventDefault()
    setPriceError('')
    const num = Number(priceValue)
    if (Number.isNaN(num) || num <= 0) {
      setPriceError('Enter a valid positive number')
      return
    }
    try {
      await api.post(`/prices/${id}`, { price: num })
      setPriceModalOpen(false)
      setPriceValue('')
      setFlash(`Price recorded: ${formatINR(num)}`)
      await loadAll()
    } catch (err) {
      setPriceError(err?.response?.data?.message || 'Price update failed')
    }
  }

  const handleLogoUpload = async (file) => {
    if (!file) return
    try {
      const fd = new FormData()
      fd.append('logo', file)
      await api.post(`/companies/${id}/logo`, fd, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setFlash('Logo updated')
      await loadAll()
    } catch (err) {
      setFlash(err?.response?.data?.message || 'Logo upload failed')
    }
  }

  if (loading) {
    return (
      <div className="admin-wrap">
        <p className="muted">Loading company…</p>
      </div>
    )
  }

  if (error || !company) {
    return (
      <div className="admin-wrap">
        <Link to="/admin/listings" className="back-pill">← Back to listings</Link>
        <p className="form-error">{error || 'Company not found'}</p>
      </div>
    )
  }

  const latestPrice = company.priceHistory && company.priceHistory.length
    ? company.priceHistory[company.priceHistory.length - 1].price
    : (history.length ? history[history.length - 1].price : null)

  const logoSrc = company.logoUrl ? `${apiBaseWithoutApi()}${company.logoUrl}` : null
  const initial = company.name ? company.name.charAt(0).toUpperCase() : '?'
  const hasLogo = !!company.logoUrl

  return (
    <div className="admin-wrap admin-wrap-wide">
      <div className="detail-topbar">
        <Link to="/admin/listings" className="back-pill">← Back to listings</Link>
        <h1 className="detail-title">{company.name}</h1>
        <div className="detail-meta-row">
          {company.sector && <span className="sector-badge">{company.sector}</span>}
          <span className={`status-badge ${company.isActive ? 'status-live' : 'status-off'}`}>
            {company.isActive ? 'Live' : 'Deactivated'}
          </span>
        </div>
      </div>

      {flash && <div className="flash">{flash}</div>}

      <div className="detail-grid">
        <div className="detail-main">
          <section className="detail-section">
            <h3 className="detail-subhead">Market Data</h3>
            <div className="detail-hero-price">
              <span className="detail-hero-price-label">
                <InfoTooltip text="An estimated price based on our own research — not sourced from a live stock exchange.">
                  Latest Price
                </InfoTooltip>
              </span>
              {latestPrice == null ? (
                <button type="button" className="set-price-link" onClick={() => setPriceModalOpen(true)}>
                  Set price
                </button>
              ) : (
                <span className="detail-hero-price-value mono">{formatINR(latestPrice)}</span>
              )}
            </div>
            <dl className="kv-list">
              <div className="kv-row">
                <span className="kv-label">
                  <InfoTooltip text="Highest and lowest indicative price recorded over the last 12 months.">
                    52W High
                  </InfoTooltip>
                </span>
                <span className="kv-value mono">{formatINR(company.high52)}</span>
              </div>
              <div className="kv-row">
                <span className="kv-label">
                  <InfoTooltip text="Highest and lowest indicative price recorded over the last 12 months.">
                    52W Low
                  </InfoTooltip>
                </span>
                <span className="kv-value mono">{formatINR(company.low52)}</span>
              </div>
              <div className="kv-row">
                <span className="kv-label">
                  <InfoTooltip text="Minimum number of shares you can enquire about in one transaction.">
                    Lot Size
                  </InfoTooltip>
                </span>
                <span className="kv-value mono">{company.lotSize ?? '—'}</span>
              </div>
              <div className="kv-row">
                <span className="kv-label">Face Value</span>
                <span className="kv-value mono">{formatINR(company.faceValue)}</span>
              </div>
              <div className="kv-row">
                <span className="kv-label">ISIN</span>
                <span className="kv-value mono">{company.isin || '—'}</span>
              </div>
            </dl>
          </section>

          <section className="detail-section">
            <h3 className="detail-subhead">Description</h3>
            <p>{company.description || <span className="muted">No description provided.</span>}</p>
          </section>

          <section className="detail-section">
            <h3 className="detail-subhead">Price History ({history.length} records)</h3>
            {history.length === 0 ? (
              <p className="muted">No price records yet. Use "Update Price" to add the first one.</p>
            ) : (
              <table className="detail-history-table">
                <thead>
                  <tr>
                    <th>Recorded At</th>
                    <th>Price (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {[...history].reverse().map((p, idx) => (
                    <tr key={p._id || idx}>
                      <td className="mono">{new Date(p.recordedAt).toLocaleString('en-IN')}</td>
                      <td className="mono">{formatINR(p.price)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        </div>

        <aside className="detail-side">
          <div className="detail-logo-block">
            <div className="detail-logo-preview">
              {logoSrc ? (
                <img src={logoSrc} alt={`${company.name} logo`} />
              ) : (
                <span className="logo-placeholder">{initial}</span>
              )}
            </div>
            <label className="secondary-btn upload-btn-label">
              {hasLogo ? 'Replace Logo' : 'Upload Logo'}
              <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  e.target.value = ''
                  if (file) handleLogoUpload(file)
                }}
              />
            </label>
          </div>

          <div className="detail-actions-block">
            <button type="button" className="secondary-btn" onClick={openEdit}>
              Edit Details
            </button>
          </div>
        </aside>
      </div>

      {priceModalOpen && (
        <div className="modal-backdrop" onClick={() => setPriceModalOpen(false)}>
          <div className="modal small" onClick={(e) => e.stopPropagation()}>
            <h2>Update Price — {company.name}</h2>
            <form onSubmit={submitPrice} className="admin-form">
              <label className="form-label">
                New Price (₹) *
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={priceValue}
                  onChange={(e) => setPriceValue(e.target.value)}
                  required
                  className="form-input"
                />
              </label>
              {priceError && <p className="form-error">{priceError}</p>}
              <div className="modal-actions">
                <button type="button" className="secondary-btn" onClick={() => setPriceModalOpen(false)}>Cancel</button>
                <button type="submit" className="primary-btn">Save Price</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {editModalOpen && (
        <div className="modal-backdrop" onClick={() => setEditModalOpen(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>Edit — {company.name}</h2>
            <form onSubmit={submitEdit} className="admin-form">
              <label className="form-label">
                Name *
                <input type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} required className="form-input" />
              </label>
              <label className="form-label">
                Sector *
                <input type="text" value={editForm.sector} onChange={(e) => setEditForm({ ...editForm, sector: e.target.value })} required className="form-input" />
              </label>
              <label className="form-label">
                Description
                <textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} className="form-input" rows={3} />
              </label>
              <div className="form-row">
                <label className="form-label">
                  <InfoTooltip text="Minimum number of shares a buyer must purchase in one transaction.">
                    Lot Size
                  </InfoTooltip>
                  <input type="number" value={editForm.lotSize} onChange={(e) => setEditForm({ ...editForm, lotSize: e.target.value })} className="form-input" />
                </label>
                <label className="form-label">
                  <InfoTooltip text="The share's original nominal value set at incorporation — unrelated to its current market price.">
                    Face Value
                  </InfoTooltip>
                  <input type="number" step="0.01" value={editForm.faceValue} onChange={(e) => setEditForm({ ...editForm, faceValue: e.target.value })} className="form-input" />
                </label>
              </div>
              <label className="form-label">
                <InfoTooltip text="International Securities Identification Number — a unique code for the share. Leave blank if not yet assigned.">
                  ISIN
                </InfoTooltip>
                <input type="text" value={editForm.isin} onChange={(e) => setEditForm({ ...editForm, isin: e.target.value })} className="form-input" />
              </label>
              {editError && <p className="form-error">{editError}</p>}
              <div className="modal-actions">
                <button type="button" className="secondary-btn" onClick={() => setEditModalOpen(false)}>Cancel</button>
                <button type="submit" className="primary-btn">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminCompanyDetail