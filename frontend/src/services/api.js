import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

api.interceptors.request.use((config) => {
  try {
    const stored = localStorage.getItem('ra_admin_auth')
    if (stored) {
      const parsed = JSON.parse(stored)
      if (parsed?.token) {
        config.headers.Authorization = `Bearer ${parsed.token}`
      }
    }
  } catch (err) {
  }
  return config
})

export default api