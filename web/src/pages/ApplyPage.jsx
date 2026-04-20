import { useState } from 'react'
import { useSearchParams, Link, useNavigate } from 'react-router-dom'
import { useData } from '../context/DataContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import CVUploader from '../components/CVUploader.jsx'

export default function ApplyPage() {
  const [params] = useSearchParams()
  const jobId = params.get('jobId')
  const { jobs, addApplication, getJobById } = useData()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [selectedJob, setSelectedJob] = useState(jobId || '')
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [cvInfo, setCvInfo] = useState({ email: '', phone: '', fileName: '', hasData: false })
  const [form, setForm] = useState({
    name: user ? user.name : '',
    email: user ? user.email : '',
    phone: '',
    coverLetter: '',
  })

  const job = getJobById(selectedJob)
  const activeJobs = jobs.filter((j) => j.isActive)

  // Auto-fill from CV
  const handleCVParsed = (info) => {
    setCvInfo({ ...info, hasData: info.hasData })
    
    setForm((p) => {
      const next = { ...p }
      if (info.name && !p.name) next.name = info.name
      if (info.email && !p.email) next.email = info.email
      if (info.phone && !p.phone) next.phone = info.phone
      return next
    })
  }

  const handleChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedJob) {
      alert('Lütfen bir pozisyon seçin.')
      return
    }
    if (!form.name.trim() || !form.email.trim()) {
      alert('Lütfen ad soyad ve e-posta alanlarını doldurun.')
      return
    }

    setIsSubmitting(true)
    await new Promise((r) => setTimeout(r, 800))

    addApplication({
      name: form.name.trim(),
      email: form.email.trim(),
      phone: form.phone.trim(),
      jobId: Number(selectedJob),
      jobTitle: job?.title || '',
      department: job?.department || '',
      coverLetter: form.coverLetter.trim(),
      cvFileName: cvInfo.fileName,
      cvContent: '',
      status: 'pending',
      userId: user ? user.id : null,
    })

    setIsSubmitting(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20 px-4">
        <div className="max-w-md w-full text-center animate-scale-in">
          <div className="w-20 h-20 rounded-full bg-emerald-500/15 border-2 border-emerald-500/40
                          flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Başvurunuz Alındı!</h2>
          <p className="text-gray-400 mb-2">
            <strong className="text-white">{form.name}</strong>, başvurunuz başarıyla iletildi.
          </p>
          <p className="text-gray-500 text-sm mb-8">
            {job?.title} pozisyonu için başvurunuzu değerlendirdikten sonra iletişime geçeceğiz.
          </p>
          <div className="flex gap-3 justify-center">
            <Link to="/jobs" className="btn-primary">
              Diğer İlanlara Bak
            </Link>
            <button
              onClick={() => {
                setSubmitted(false)
                setForm({ name: '', email: '', phone: '', coverLetter: '' })
                setCvInfo({ email: '', phone: '', fileName: '', hasData: false })
              }}
              className="btn-secondary"
            >
              Yeni Başvuru
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <div className="hero-gradient py-10 px-4">
        <div className="max-w-3xl mx-auto">
          <Link to={job ? `/jobs/${job.id}` : '/jobs'} className="btn-ghost text-sm mb-4 inline-flex">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Geri Dön
          </Link>
          <h1 className="text-3xl font-bold text-white">
            {job ? `${job.title} — Başvuru Formu` : 'Başvuru Formu'}
          </h1>
          <p className="text-gray-400 mt-2">
            CV'nizi yükleyin, bilgilerinizi doldurun ve başvurunuzu tamamlayın.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        <form onSubmit={handleSubmit} className="space-y-6" id="apply-form">
          {/* Job Selection */}
          <div className="glass-card p-6 animate-slide-up">
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-xs text-accent font-bold">1</span>
              Pozisyon Seçin
            </h2>
            <div>
              <label htmlFor="job-select" className="form-label">Başvurmak istediğiniz pozisyon</label>
              <select
                id="job-select"
                value={selectedJob}
                onChange={(e) => setSelectedJob(e.target.value)}
                className="form-select"
                required
              >
                <option value="" className="bg-primary-dark">— Pozisyon seçin —</option>
                {activeJobs.map((j) => (
                  <option key={j.id} value={j.id} className="bg-primary-dark">
                    {j.title} — {j.department}
                  </option>
                ))}
              </select>
            </div>

            {job && (
              <div className="mt-4 p-3 bg-accent/5 border border-accent/20 rounded-xl">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center text-sm">💼</div>
                  <div>
                    <p className="text-white text-sm font-medium">{job.title}</p>
                    <p className="text-gray-400 text-xs">{job.department} • {job.location}</p>
                  </div>
                  {job.salary && (
                    <span className="ml-auto text-accent text-sm font-semibold">{job.salary}</span>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* CV Upload */}
          <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '80ms', animationFillMode: 'backwards' }}>
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-xs text-accent font-bold">2</span>
              CV Yükle
            </h2>
            <CVUploader onParsed={handleCVParsed} />
          </div>

          {/* Personal Info */}
          <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '160ms', animationFillMode: 'backwards' }}>
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-xs text-accent font-bold">3</span>
              Kişisel Bilgiler
              {cvInfo.hasData && (
                <span className="ml-auto text-xs text-emerald-400 font-normal">
                  ✅ CV'den otomatik dolduruldu
                </span>
              )}
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label htmlFor="name" className="form-label">Ad Soyad *</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Ahmet Yılmaz"
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label htmlFor="apply-email" className="form-label">E-posta *</label>
                <input
                  id="apply-email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="ahmet@example.com"
                  className="form-input"
                  required
                />
              </div>
              <div>
                <label htmlFor="apply-phone" className="form-label">Telefon</label>
                <input
                  id="apply-phone"
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="0532 123 45 67"
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* Cover Letter */}
          <div className="glass-card p-6 animate-slide-up" style={{ animationDelay: '240ms', animationFillMode: 'backwards' }}>
            <h2 className="text-white font-semibold mb-4 flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center text-xs text-accent font-bold">4</span>
              Ön Yazı <span className="text-gray-500 font-normal text-sm">(opsiyonel)</span>
            </h2>
            <textarea
              id="cover-letter"
              name="coverLetter"
              value={form.coverLetter}
              onChange={handleChange}
              placeholder="Kendinizi ve bu pozisyon için neden uygun olduğunuzu kısaca anlatın..."
              rows={5}
              className="form-input resize-none"
            />
          </div>

          {/* Submit */}
          <div className="flex gap-4 animate-slide-up" style={{ animationDelay: '320ms', animationFillMode: 'backwards' }}>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex-1"
              id="submit-application"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Gönderiliyor...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Başvuruyu Gönder
                </>
              )}
            </button>
            <Link to="/jobs" className="btn-secondary">
              İptal
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
