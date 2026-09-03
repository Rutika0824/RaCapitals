import { Link, NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const Navbar = () => {
  const { isAuthenticated } = useAuth()
  const location = useLocation()
  const onAdmin = location.pathname.startsWith('/admin')

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="wordmark">
          <img src="/logo.svg" alt="RA Capitals" className="brand-logo" />
          <span className="wordmark-text">RA CAPITALS</span>
        </Link>
        <nav className="nav-links">
          <NavLink to="/" end>Home</NavLink>
          <NavLink to="/catalog">Price List</NavLink>
          <NavLink to="/contact">Contact</NavLink>
          {onAdmin ? (
            <NavLink to="/admin">{isAuthenticated ? 'Dashboard' : 'Login'}</NavLink>
          ) : (
            <NavLink to={isAuthenticated ? '/admin' : '/admin/login'}>Login</NavLink>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Navbar