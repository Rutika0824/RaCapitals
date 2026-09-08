import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Catalog from './pages/Catalog'
import CompanyDetail from './pages/CompanyDetail'
import Contact from './pages/Contact'
import About from './pages/About'
import AdminLogin from './pages/admin/AdminLogin'
import AdminOverview from './pages/admin/AdminOverview'
import AdminListings from './pages/admin/AdminListings'
import AdminCompanyDetail from './pages/admin/AdminCompanyDetail'
import AdminContacts from './pages/admin/AdminContacts'
import Disclaimer from './pages/legal/Disclaimer'
import Terms from './pages/legal/Terms'
import Privacy from './pages/legal/Privacy'
import ProtectedRoute from './components/common/ProtectedRoute'
import AdminLayout from './components/admin/AdminLayout'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/company/:id" element={<CompanyDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/disclaimer" element={<Disclaimer />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={<Navigate to="/admin/dashboard" replace />}
        />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminOverview />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/listings"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminListings />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/companies/:id"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminCompanyDetail />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/contacts"
          element={
            <ProtectedRoute>
              <AdminLayout>
                <AdminContacts />
              </AdminLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  )
}

export default App
