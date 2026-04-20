import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

const ADMIN = { email: 'admin@persona.com', password: 'admin123' }
const LS_USER  = 'persona_user'
const LS_USERS = 'persona_users'

function loadUsers() {
  try { return JSON.parse(localStorage.getItem(LS_USERS) || '[]') } catch { return [] }
}

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const saved = localStorage.getItem(LS_USER)
    if (saved) {
      try { setUser(JSON.parse(saved)) } catch { localStorage.removeItem(LS_USER) }
    }
    setIsLoading(false)
  }, [])

  /* ---- REGISTER ---- */
  const register = (name, email, password) => {
    if (email === ADMIN.email)
      return { success: false, error: 'Bu e-posta adresi kullanılamaz.' }

    const users = loadUsers()
    if (users.find((u) => u.email.toLowerCase() === email.toLowerCase()))
      return { success: false, error: 'Bu e-posta adresi zaten kayıtlı.' }

    const newUser = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      name,
      email,
      password, // ⚠️ Demo: plain text — production'da hash kullanın
      role: 'user',
      createdAt: new Date().toISOString(),
    }
    const updated = [...users, newUser]
    localStorage.setItem(LS_USERS, JSON.stringify(updated))

    // Otomatik oturum aç
    const session = { id: newUser.id, name, email, role: 'user' }
    setUser(session)
    localStorage.setItem(LS_USER, JSON.stringify(session))
    return { success: true }
  }

  /* ---- LOGIN ---- */
  const login = (email, password) => {
    // Admin kontrolü
    if (email === ADMIN.email && password === ADMIN.password) {
      const userData = { id: 'admin', email, name: 'Admin', role: 'admin' }
      setUser(userData)
      localStorage.setItem(LS_USER, JSON.stringify(userData))
      return { success: true }
    }
    // Kayıtlı kullanıcı kontrolü
    const found = loadUsers().find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    )
    if (found) {
      const userData = { id: found.id, name: found.name, email: found.email, role: 'user' }
      setUser(userData)
      localStorage.setItem(LS_USER, JSON.stringify(userData))
      return { success: true }
    }
    return { success: false, error: 'E-posta veya şifre hatalı.' }
  }

  /* ---- LOGOUT ---- */
  const logout = () => {
    setUser(null)
    localStorage.removeItem(LS_USER)
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAdmin:    user?.role === 'admin',
      isLoggedIn: !!user,
      isLoading,
      login,
      logout,
      register,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
