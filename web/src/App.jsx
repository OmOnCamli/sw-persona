import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { DataProvider } from './context/DataContext.jsx'
import Navbar from './components/Navbar.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import LoginPage from './pages/LoginPage.jsx'
import JobsPage from './pages/JobsPage.jsx'
import JobDetailPage from './pages/JobDetailPage.jsx'
import ApplyPage from './pages/ApplyPage.jsx'
import AdminPage from './pages/AdminPage.jsx'
import AdminApplicationDetail from './pages/AdminApplicationDetail.jsx'
import RegisterPage from './pages/RegisterPage.jsx'
import MyApplicationsPage from './pages/MyApplicationsPage.jsx'

function Layout({ children }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            {/* Auth */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Public — with Navbar */}
            <Route
              path="/jobs"
              element={<Layout><JobsPage /></Layout>}
            />
            <Route
              path="/jobs/:id"
              element={<Layout><JobDetailPage /></Layout>}
            />
            <Route
              path="/apply"
              element={<Layout><ApplyPage /></Layout>}
            />
            <Route
              path="/my-applications"
              element={<Layout><MyApplicationsPage /></Layout>}
            />

            {/* Admin — Protected + Navbar */}
            <Route
              path="/admin"
              element={
                <Layout>
                  <ProtectedRoute>
                    <AdminPage />
                  </ProtectedRoute>
                </Layout>
              }
            />
            <Route
              path="/admin/application/:id"
              element={
                <Layout>
                  <ProtectedRoute>
                    <AdminApplicationDetail />
                  </ProtectedRoute>
                </Layout>
              }
            />

            {/* Fallback */}
            <Route path="/" element={<Navigate to="/jobs" replace />} />
            <Route path="*" element={<Navigate to="/jobs" replace />} />
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </AuthProvider>
  )
}
