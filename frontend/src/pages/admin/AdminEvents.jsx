import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import ConfirmDialog from '../../components/common/ConfirmDialog.jsx'

const EMPTY_FORM = {
  title: '',
  description: '',
  company: '',
  eventDate: '',
  eventType: 'Other'
}

const EVENT_TYPES = ['DRHP', 'Funding', 'Leadership Change', 'Other']

const eventTypeClass = (type) => {
  switch (type) {
    case 'DRHP': return 'event-tag-drhp'
    case 'Funding': return 'event-tag-funding'
    case 'Leadership Change': return 'event-tag-leadership'
    default: return 'event-tag-other'
  }
}

const AdminEvents = () => {
  const [events, setEvents] = useState([])
  const [companies, setCompanies] = useState([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)
  const [confirmId, setConfirmId] = useState(null)

  const fetchAll = async () => {
    try {
      const [evRes, coRes] = await Promise.all([
        api.get('/events'),
        api.get('/companies/admin/all')
      ])
      setEvents(evRes.data)
      setCompanies(coRes.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchAll() }, [])

  const openCreate = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setFormError('')
    setFormOpen(true)
  }

  const openEdit = (event) => {
    setEditing(event)
    setForm({
      title: event.title || '',
      description: event.description || '',
      company: event.company?._id || event.company || '',
      eventDate: event.eventDate ? event.eventDate.slice(0, 10) : '',
      eventType: event.eventType || 'Other'
    })
    setFormError('')
    setFormOpen(true)
  }

  const closeForm = () => {
    setFormOpen(false)
    setEditing(null)
    setForm(EMPTY_FORM)
    setFormError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setFormError('')
    if (!form.title.trim()) return setFormError('Title is required')
    if (!form.eventDate) return setFormError('Event date is required')
    setSaving(true)
    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        company: form.company || undefined,
        eventDate: new Date(form.eventDate).toISOString(),
        eventType: form.eventType
      }
      if (editing) {
        await api.put(`/events/${editing._id}`, payload)
      } else {
        await api.post('/events', payload)
      }
      closeForm()
      await fetchAll()
    } catch (err) {
      setFormError(err?.response?.data?.message || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirmId) return
    try {
      await api.delete(`/events/${confirmId}`)
      setConfirmId(null)
      await fetchAll()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="admin-wrap">
      <div className="admin-page-header">
        <h1>Events</h1>
        <button className="primary-btn" onClick={openCreate}>+ Add New Event</button>
      </div>

      {loading ? (
        <p className="muted">Loading events...</p>
      ) : events.length === 0 ? (
        <div className="chart-empty">No events yet. Click "+ Add New Event" to create one.</div>
      ) : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Company</th>
                <th>Date</th>
                <th>Type</th>
                <th className="th-actions">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((ev) => (
                <tr key={ev._id}>
                  <td>{ev.title}</td>
                  <td>
                    {ev.company ? (
                      <Link to={`/admin/companies/${ev.company._id}`}>{ev.company.name}</Link>
                    ) : (
                      <span className="muted">—</span>
                    )}
                  </td>
                  <td>{new Date(ev.eventDate).toLocaleDateString()}</td>
                  <td><span className={`event-tag ${eventTypeClass(ev.eventType)}`}>{ev.eventType}</span></td>
                  <td>
                    <div className="actions-cell">
                      <button className="row-action-btn" onClick={() => openEdit(ev)}>Edit</button>
                      <button className="row-action-btn delete-btn" onClick={() => setConfirmId(ev._id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {formOpen && (
        <div className="modal-backdrop event-modal-backdrop" onClick={closeForm}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2>{editing ? 'Edit Event' : 'Add New Event'}</h2>
            <form className="admin-form" onSubmit={handleSubmit}>
              <label className="form-label">
                Title
                <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="form-input" />
              </label>
              <label className="form-label">
                Description
                <textarea className="contact-form-textarea" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </label>
              <div className="form-row">
                <label className="form-label">
                  Company (optional)
                  <select value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} className="form-input">
                    <option value="">— General —</option>
                    {companies.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </label>
                <label className="form-label">
                  Event Type
                  <select value={form.eventType} onChange={(e) => setForm({ ...form, eventType: e.target.value })} className="form-input">
                    {EVENT_TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="form-label">
                Event Date
                <input type="date" value={form.eventDate} onChange={(e) => setForm({ ...form, eventDate: e.target.value })} className="form-input" />
              </label>
              {formError && <p className="form-error">{formError}</p>}
              <div className="modal-actions">
                <button type="button" className="row-action-btn" onClick={closeForm}>Cancel</button>
                <button type="submit" className="primary-btn" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmId && (
        <ConfirmDialog
          title="Delete Event"
          message="Are you sure you want to permanently delete this event?"
          confirmLabel="Delete"
          danger
          onConfirm={handleDelete}
          onCancel={() => setConfirmId(null)}
        />
      )}
    </div>
  )
}

export default AdminEvents