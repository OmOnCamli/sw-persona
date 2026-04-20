import { useParams, Link, useNavigate } from 'react-router-dom'
import { useData } from '../context/DataContext.jsx'
import StatusBadge from '../components/StatusBadge.jsx'
import { APPLICATION_STATUSES } from '../interfaces/Application.js'

export default function AdminApplicationDetail() {
  const { id } = useParams()
  const { getApplicationById, updateApplicationStatus, deleteApplication } = useData()
  const navigate = useNavigate()

  const app = getApplicationById(id)

  if (!app) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="text-center">
          <div className="text-5xl mb-4">📄</div>
          <h2 className="text-white text-xl font-bold">Başvuru bulunamadı</h2>
          <Link to="/admin" className="btn-primary mt-6 inline-flex">
            Admin Panele Dön
          </Link>
        </div>
      </div>
    )
  }

  const handleStatusChange = (e) => {
    updateApplicationStatus(app.id, e.target.value)
  }

  const handleDelete = () => {
    if (window.confirm(`"${app.name}" adlı başvuruyu silmek istediğinizden emin misiniz?`)) {
      deleteApplication(app.id)
      navigate('/admin')
    }
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <div className="hero-gradient py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <Link to="/admin" className="btn-ghost text-sm mb-4 inline-flex">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Admin Panele Dön
          </Link>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-2xl font-bold text-white">{app.name}</h1>
              <p className="text-gray-400 mt-1">{app.jobTitle} — {app.department}</p>
            </div>
            <StatusBadge status={app.status} showIcon />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info */}
          <div className="lg:col-span-2 space-y-5">
            {/* Contact Info */}
            <div className="glass-card p-6 animate-slide-up">
              <h2 className="text-white font-semibold mb-4">İletişim Bilgileri</h2>
              <div className="space-y-3">
                <InfoRow icon="📧" label="E-posta" value={
                  <a href={`mailto:${app.email}`} className="text-accent hover:underline">{app.email}</a>
                } />
                <InfoRow icon="📞" label="Telefon" value={app.phone || '—'} />
                <InfoRow icon="💼" label="Pozisyon" value={app.jobTitle} />
                <InfoRow icon="🏢" label="Departman" value={app.department} />
                <InfoRow icon="📅" label="Başvuru Tarihi" value={
                  new Date(app.appliedAt).toLocaleDateString('tr-TR', {
                    day: 'numeric', month: 'long', year: 'numeric',
                    hour: '2-digit', minute: '2-digit',
                  })
                } />
                {app.cvFileName && (
                  <InfoRow icon="📄" label="CV Dosyası" value={
                    <span className="text-accent font-medium">{app.cvFileName}</span>
                  } />
                )}
              </div>
            </div>

            {/* Cover Letter */}
            {app.coverLetter && (
              <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '80ms', animationFillMode: 'backwards' }}>
                <h2 className="text-white font-semibold mb-3">Ön Yazı</h2>
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">
                  {app.coverLetter}
                </p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Status Management */}
            <div className="glass-card p-5 animate-scale-in">
              <h3 className="text-white font-semibold mb-4">Başvuru Durumu</h3>
              <div className="mb-4">
                <StatusBadge status={app.status} showIcon />
              </div>
              <label className="form-label">Durumu Güncelle</label>
              <select
                value={app.status}
                onChange={handleStatusChange}
                className="form-select text-sm"
                id="app-status-select"
              >
                {Object.entries(APPLICATION_STATUSES).map(([key, val]) => (
                  <option key={key} value={key} className="bg-primary-dark text-white">
                    {val.label}
                  </option>
                ))}
              </select>

              {app.updatedAt !== app.appliedAt && (
                <p className="text-gray-600 text-xs mt-2">
                  Son güncelleme: {new Date(app.updatedAt).toLocaleDateString('tr-TR')}
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="glass-card p-5 space-y-2">
              <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">
                İşlemler
              </h3>
              <a
                href={`mailto:${app.email}?subject=Başvurunuz Hakkında — ${app.jobTitle}`}
                className="btn-secondary w-full text-sm justify-center"
                id="email-applicant"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                E-posta Gönder
              </a>
              <button
                onClick={handleDelete}
                className="btn-danger w-full text-sm justify-center"
                id="delete-application"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Başvuruyu Sil
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-base w-5 flex-shrink-0 mt-0.5">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-gray-500 text-xs font-medium uppercase tracking-wide">{label}</p>
        <div className="text-gray-200 text-sm mt-0.5">{value}</div>
      </div>
    </div>
  )
}
