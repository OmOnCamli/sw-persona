import { useAuth } from '../context/AuthContext.jsx'
import { useData } from '../context/DataContext.jsx'
import { Link, Navigate } from 'react-router-dom'
import StatusBadge from '../components/StatusBadge.jsx'

export default function MyApplicationsPage() {
  const { user } = useAuth()
  const { getApplicationsByUser } = useData()

  // Sadece normal üyeler bu sayfayı görmeli
  if (!user || user.role === 'admin') {
    return <Navigate to="/jobs" replace />
  }

  const myApplications = getApplicationsByUser(user.id)

  return (
    <div className="min-h-screen pt-20">
      <div className="hero-gradient py-10 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-2">Başvurularım</h1>
          <p className="text-gray-400">
            Yaptığınız tüm iş başvurularını ve durumlarını buradan takip edebilirsiniz.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        {myApplications.length === 0 ? (
          <div className="glass-card p-16 text-center animate-fade-in">
            <div className="text-5xl mb-4">📝</div>
            <h3 className="text-white font-semibold text-lg">Henüz bir başvurunuz yok</h3>
            <p className="text-gray-400 text-sm mt-2">
              Açık pozisyonları inceleyip hemen başvurabilirsiniz.
            </p>
            <Link to="/jobs" className="btn-primary mt-6 inline-flex">
              İlanları İncele
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {myApplications.map((app, index) => (
              <div 
                key={app.id} 
                className="glass-card p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 animate-slide-up"
                style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'backwards' }}
              >
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-white font-medium text-lg">{app.jobTitle}</h3>
                    <StatusBadge status={app.status} />
                  </div>
                  <div className="text-gray-400 text-sm space-y-1">
                    <p>Departman: <span className="text-gray-300">{app.department}</span></p>
                    <p>Başvuru Tarihi: <span className="text-gray-300">
                      {new Date(app.appliedAt).toLocaleDateString('tr-TR', {
                        day: 'numeric', month: 'long', year: 'numeric'
                      })}
                    </span></p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 mt-2 md:mt-0">
                  <Link to={`/jobs/${app.jobId}`} className="btn-ghost text-sm">
                    İlanı Gör
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
