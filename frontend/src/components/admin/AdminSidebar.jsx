import { NavLink } from 'react-router-dom'

const AdminSidebar = ({ isOpen = false, onNavigate }) => {
  const base = 'admin-sidebar-item'

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
      </nav>
    </aside>
  )
}

export default AdminSidebar