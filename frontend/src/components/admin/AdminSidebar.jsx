import { NavLink } from 'react-router-dom'

const AdminSidebar = () => {
  const base = 'admin-sidebar-item'

  return (
    <aside className="admin-sidebar">
      <nav className="admin-sidebar-nav">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) => `${base} ${isActive ? 'active' : ''}`}
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/admin/listings"
          className={({ isActive }) => `${base} ${isActive ? 'active' : ''}`}
        >
          Listings
        </NavLink>
      </nav>
    </aside>
  )
}

export default AdminSidebar
