import { useParams, Link, useNavigate } from 'react-router-dom'
import { useData } from '../context/DataContext.jsx'
import { JOB_TYPES } from '../interfaces/Job.js'

const TYPE_CLASSES = {
  'full-time': 'job-type-full-time',
  'part-time': 'job-type-part-time',
  intern: 'job-type-intern',
}

export default function JobDetailPage() {
  const { id } = useParams()
  const { getJobById, getApplicationsByJob } = useData()
  const navigate = useNavigate()

  const job = getJobById(id)
  const applicationCount = getApplicationsByJob(id).length

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-white text-2xl font-bold">İlan bulunamadı</h2>
          <p className="text-gray-400 mt-2">Bu ilan mevcut değil veya kaldırılmış olabilir.</p>
          <Link to="/jobs" className="btn-primary inline-flex mt-6">
            İlanları Gör
          </Link>
        </div>
      </div>
    )
  }

  const typeLabel = JOB_TYPES[job.type] || job.type
  const typeClass = TYPE_CLASSES[job.type] || 'job-type-full-time'

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <div className="hero-gradient py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => navigate(-1)}
            className="btn-ghost mb-6 text-sm"
            id="back-button"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Geri Dön
          </button>

          <div className="flex items-start justify-between gap-6 flex-wrap">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className={typeClass}>{typeLabel}</span>
                <span className="text-gray-500 text-sm">{job.department}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold text-white">{job.title}</h1>
              {job.salary && (
                <p className="text-accent font-semibold text-lg mt-2">{job.salary}</p>
              )}
            </div>

            <div className="flex flex-col gap-2 min-w-0">
              {applicationCount > 0 && (
                <div className="glass-card px-4 py-2 text-center">
                  <p className="text-2xl font-bold text-white">{applicationCount}</p>
                  <p className="text-gray-400 text-xs">Başvuran</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-6 text-sm text-gray-400">
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {job.location}
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {new Date(job.createdAt).toLocaleDateString('tr-TR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="glass-card p-6 animate-slide-up">
              <h2 className="text-white font-semibold text-lg mb-4">İş Tanımı</h2>
              <p className="text-gray-300 leading-relaxed">{job.description}</p>
            </div>

            {/* Responsibilities */}
            {job.responsibilities?.length > 0 && (
              <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '80ms', animationFillMode: 'backwards' }}>
                <h2 className="text-white font-semibold text-lg mb-4">Sorumluluklar</h2>
                <ul className="space-y-3">
                  {job.responsibilities.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-300 text-sm">
                      <span className="w-5 h-5 rounded-full bg-accent/20 border border-accent/30
                                       flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3 h-3 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Requirements */}
            {job.requirements?.length > 0 && (
              <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '160ms', animationFillMode: 'backwards' }}>
                <h2 className="text-white font-semibold text-lg mb-4">Aranan Nitelikler</h2>
                <ul className="space-y-3">
                  {job.requirements.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-gray-300 text-sm">
                      <span className="w-5 h-5 rounded-full bg-secondary/20 border border-secondary/30
                                       flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Apply CTA */}
            <div className="glass-card p-6 border-accent/20 animate-scale-in sticky top-24">
              <h3 className="text-white font-semibold mb-2">Bu pozisyona başvur</h3>
              <p className="text-gray-400 text-sm mb-4">
                CV'nizi yükleyin ve başvurunuzu tamamlayın.
              </p>
              <Link
                to={`/apply?jobId=${job.id}`}
                className="btn-primary w-full justify-center"
                id="apply-btn"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Başvur
              </Link>
              <Link
                to="/jobs"
                className="btn-ghost w-full justify-center mt-2 text-sm"
              >
                Diğer İlanlar
              </Link>
            </div>

            {/* Job Details Card */}
            <div className="glass-card p-5">
              <h3 className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">
                Detaylar
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Çalışma Şekli</span>
                  <span className="text-gray-200 font-medium">{typeLabel}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Departman</span>
                  <span className="text-gray-200 font-medium">{job.department}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-500">Lokasyon</span>
                  <span className="text-gray-200 font-medium">{job.location}</span>
                </div>
                {job.salary && (
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Maaş</span>
                    <span className="text-accent font-semibold">{job.salary}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
