import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import ConfirmDialog from '../common/ConfirmDialog'
import ThemeToggle from '../common/ThemeToggle'

const AdminHeader = ({ onToggleSidebar, isSidebarOpen }) => {
  const { username, isAuthenticated, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)

  const openLogoutConfirm = () => setShowLogoutConfirm(true)
  const closeLogoutConfirm = () => setShowLogoutConfirm(false)

  const handleLogoutConfirm = () => {
    logout()
    setShowLogoutConfirm(false)
    navigate('/', { replace: true })
  }

  if (!isAuthenticated) return null

  return (
    <header className="admin-header-bar">
      <div className="admin-header-bar-inner">
        <div className="admin-header-bar-left">
          <button
            type="button"
            className={`admin-hamburger ${isSidebarOpen ? 'open' : ''}`}
            onClick={onToggleSidebar}
            aria-label={isSidebarOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={Boolean(isSidebarOpen)}
            aria-controls="admin-sidebar"
          >
            <span className="admin-hamburger-bar" />
            <span className="admin-hamburger-bar" />
            <span className="admin-hamburger-bar" />
          </button>
          <Link to="/admin" className="admin-header-bar-brand">
            <img src="/logo.svg" alt="RA Capitals" className="admin-header-bar-logo" />
            <span className="admin-header-bar-brand-text">RA Capitals</span>
          </Link>
        </div>
        <div className="admin-header-bar-right">
          <span className="admin-header-bar-user">
            <span className="admin-header-bar-user-label">Signed in as </span>
            <span className="mono">{username}</span>
          </span>
          <ThemeToggle />
          <button
            type="button"
            className="admin-logout-btn"
            onClick={openLogoutConfirm}
            aria-label="Log out"
          >
            Logout
          </button>
        </div>
      </div>

      <ConfirmDialog
        isOpen={showLogoutConfirm}
        title="Log out?"
        message="You will need to sign in again to access the admin panel."
        confirmLabel="Log out"
        cancelLabel="Stay signed in"
        variant="neutral"
        onConfirm={handleLogoutConfirm}
        onCancel={closeLogoutConfirm}
      />
      {location.pathname === '/admin' && null}
    </header>
  )
}

export default AdminHeader