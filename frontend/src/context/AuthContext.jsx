import { createContext, useContext, useEffect, useState } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

const STORAGE_KEY = 'ra_admin_auth'

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null)
  const [username, setUsername] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (!stored) {
          setLoading(false)
          return
        }
        const parsed = JSON.parse(stored)
        if (parsed?.token) {
          setToken(parsed.token)
          setUsername(parsed.username || null)
          try {
            await api.get('/auth/verify')
          } catch (err) {
            localStorage.removeItem(STORAGE_KEY)
            setToken(null)
            setUsername(null)
          }
        }
      } catch (err) {
        localStorage.removeItem(STORAGE_KEY)
      } finally {
        setLoading(false)
      }
    }
    init()
  }, [])

  const login = async (usernameArg, password) => {
    try {
      const res = await api.post('/auth/login', { username: usernameArg, password })
      const { token: newToken, admin } = res.data
      const payload = { token: newToken, username: admin?.username || usernameArg }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
      setToken(newToken)
      setUsername(payload.username)
      return { ok: true }
    } catch (err) {
      const message = err?.response?.data?.message || 'Invalid credentials'
      return { ok: false, message }
    }
  }

  const logout = () => {
    localStorage.removeItem(STORAGE_KEY)
    setToken(null)
    setUsername(null)
  }

  const value = {
    token,
    username,
    isAuthenticated: !!token,
    loading,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}

export default AuthContext