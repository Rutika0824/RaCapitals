import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../services/api'
import { formatShortDate } from '../utils/format'

const eventTypeClass = (type) => {
  switch (type) {
    case 'DRHP': return 'event-tag-drhp'
    case 'Funding': return 'event-tag-funding'
    case 'Leadership Change': return 'event-tag-leadership'
    default: return 'event-tag-other'
  }
}

const Events = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    api.get('/events')
      .then((res) => { if (active) setEvents(res.data) })
      .catch(() => { if (active) setEvents([]) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  return (
    <div className="page-main">
      <div className="page-header">
        <h1>Events</h1>
        <p className="page-subtitle">Corporate events, most recent first.</p>
      </div>

      {loading ? (
        <p className="muted">Loading events...</p>
      ) : events.length === 0 ? (
        <div className="chart-empty">No events have been published yet.</div>
      ) : (
        <div className="events-timeline">
          {events.map((ev) => (
            <div className="event-card" key={ev._id}>
              <div className="event-card-head">
                <span className={`event-tag ${eventTypeClass(ev.eventType)}`}>{ev.eventType}</span>
                <span className="event-date">{formatShortDate(ev.eventDate)}</span>
              </div>
              <h3 className="event-title">{ev.title}</h3>
              {ev.description && <p className="event-desc">{ev.description}</p>}
              {ev.company && (
                <p className="event-company">
                  Company:{' '}
                  <Link to={`/company/${ev.company._id}`}>{ev.company.name}</Link>
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Events