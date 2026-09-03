import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const AdminHeader = () => {
  const { username, isAuthenticated, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/', { replace: true })
  }

  if (!isAuthenticated) return null

  return (
    <header className="admin-header-bar">
      <div className="admin-header-bar-inner">
        <div className="admin-header-bar-left">
          <Link to="/admin" className="admin-header-bar-brand">
            <img src="/logo.svg" alt="RA Capitals" className="admin-header-bar-logo" />
            <span>RA Capitals</span>
            <span className="admin-header-bar-tag">Admin</span>
          </Link>
        </div>
        <div className="admin-header-bar-right">
          <span className="admin-header-bar-user">
            <span className="muted">Signed in as </span>
            <span className="mono">{username}</span>
          </span>
          <button
            type="button"
            className="admin-logout-btn"
            onClick={handleLogout}
            aria-label="Log out"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}

export default AdminHeader