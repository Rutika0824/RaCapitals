import { NavLink } from 'react-router-dom'
import { useEffect, useState } from 'react'
import api from '../../services/api'

const AdminSidebar = ({ isOpen = false, onNavigate }) => {
  const base = 'admin-sidebar-item'
  const [unread, setUnread] = useState(0)

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await api.get('/contact/unread-count')
        setUnread(res.data.count || 0)
      } catch {
        // ignore
      }
    }
    fetchUnread()
  }, [])

  const handleClick = () => {
    if (onNavigate) onNavigate()
  }

  return (
    <aside className={`admin-sidebar ${isOpen ? 'open' : ''}`}>
      <nav className="admin-sidebar-nav">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) => `${base} ${isActive ? 'active' : ''}`}
          onClick={handleClick}
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/admin/listings"
          className={({ isActive }) => `${base} ${isActive ? 'active' : ''}`}
          onClick={handleClick}
        >
          Listings
        </NavLink>
<NavLink
           to="/admin/contacts"
           className={({ isActive }) => `${base} ${isActive ? 'active' : ''}`}
           onClick={handleClick}
         >
           Contact Submissions
           {unread > 0 && <span className="admin-sidebar-badge">{unread}</span>}
         </NavLink>
         <NavLink
           to="/admin/events"
           className={({ isActive }) => `${base} ${isActive ? 'active' : ''}`}
           onClick={handleClick}
         >
           Events
         </NavLink>
      </nav>
    </aside>
  )
}

export default AdminSidebar
