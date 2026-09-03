import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const LogoutButton = () => {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/admin/login', { replace: true })
  }

  useEffect(() => {}, [])

  return (
    <button type="button" className="logout-btn" onClick={handleLogout}>
      Logout
    </button>
  )
}

export default LogoutButton