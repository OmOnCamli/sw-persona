import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 nav-blur bg-primary-dark/80 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/jobs" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
              <span className="text-white font-bold text-sm">SP</span>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-xs text-gray-400 font-medium">software</span>
              <span className="text-white font-bold text-sm tracking-wide group-hover:text-accent transition-colors">
                PERSONA
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink
              to="/jobs"
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-accent bg-accent/10'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`
              }
            >
              İş İlanları
            </NavLink>
            {isAdmin && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-accent bg-accent/10'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`
                }
              >
                Admin Panel
              </NavLink>
            )}
            {user && !isAdmin && (
              <NavLink
                to="/my-applications"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-accent bg-accent/10'
                      : 'text-gray-300 hover:text-white hover:bg-white/10'
                  }`
                }
              >
                Başvurularım
              </NavLink>
            )}
          </div>

          {/* Auth Area */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="hidden sm:flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {user.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="text-white text-xs font-medium">{user.name}</span>
                    <span className="text-accent text-xs">
                      {isAdmin ? 'Yönetici' : 'Kullanıcı'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn-ghost text-xs px-3 py-1.5"
                >
                  Çıkış
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-ghost text-xs px-4 py-2">
                  Giriş Yap
                </Link>
                <Link to="/register" className="btn-primary text-xs px-4 py-2 hidden sm:flex">
                  Kayıt Ol
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
