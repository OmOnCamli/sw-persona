import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useData } from '../context/DataContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import ApplicationTable from '../components/ApplicationTable.jsx'
import { JOB_TYPES, createJob } from '../interfaces/Job.js'

const EMPTY_JOB_FORM = {
  title: '',
  department: '',
  location: '',
  type: 'full-time',
  salary: '',
  description: '',
  requirements: '',
  responsibilities: '',
}

export default function AdminPage() {
  const { jobs, addJob, updateJob, deleteJob, applications } = useData()
  const { user, logout } = useAuth()

  const [activeTab, setActiveTab] = useState('applications') // 'applications' | 'jobs'
  const [showJobForm, setShowJobForm] = useState(false)
  const [editingJob, setEditingJob] = useState(null) // null = adding new
  const [jobForm, setJobForm] = useState(EMPTY_JOB_FORM)
  const [confirmDeleteJob, setConfirmDeleteJob] = useState(null)

  // Stats
  const stats = {
    total: applications.length,
    pending: applications.filter((a) => a.status === 'pending').length,
    accepted: applications.filter((a) => a.status === 'accepted').length,
    rejected: applications.filter((a) => a.status === 'rejected').length,
    activeJobs: jobs.filter((j) => j.isActive).length,
  }

  /* ============ JOB FORM HANDLERS ============ */
  const openAddForm = () => {
    setEditingJob(null)
    setJobForm(EMPTY_JOB_FORM)
    setShowJobForm(true)
  }

  const openEditForm = (job) => {
    setEditingJob(job)
    setJobForm({
      title: job.title,
      department: job.department,
      location: job.location,
      type: job.type,
      salary: job.salary || '',
      description: job.description,
      requirements: job.requirements.join('\n'),
      responsibilities: job.responsibilities.join('\n'),
    })
    setShowJobForm(true)
  }

  const handleJobFormChange = (e) => {
    setJobForm((p) => ({ ...p, [e.target.name]: e.target.value }))
  }

  const handleJobFormSubmit = (e) => {
    e.preventDefault()
    const parsed = {
      ...jobForm,
      requirements: jobForm.requirements.split('\n').map((s) => s.trim()).filter(Boolean),
      responsibilities: jobForm.responsibilities.split('\n').map((s) => s.trim()).filter(Boolean),
    }

    if (editingJob) {
      updateJob(editingJob.id, parsed)
    } else {
      addJob(parsed)
    }
    setShowJobForm(false)
    setEditingJob(null)
    setActiveTab('jobs')
  }

  const handleDeleteJob = (id) => {
    deleteJob(id)
    setConfirmDeleteJob(null)
  }

  return (
    <div className="min-h-screen pt-16">
      {/* Admin Header */}
      <div className="bg-primary/30 border-b border-white/10 px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
              <p className="text-gray-400 text-sm mt-0.5">
                Hoş geldin, <span className="text-accent">{user?.name}</span>
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={openAddForm} className="btn-primary text-sm" id="add-job-btn">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Yeni İlan Ekle
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-6">
            {[
              { label: 'Toplam Başvuru', value: stats.total, color: 'text-white', bg: 'bg-white/5' },
              { label: 'Beklemede', value: stats.pending, color: 'text-amber-400', bg: 'bg-amber-500/10' },
              { label: 'Kabul Edildi', value: stats.accepted, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
              { label: 'Reddedildi', value: stats.rejected, color: 'text-red-400', bg: 'bg-red-500/10' },
              { label: 'Aktif İlan', value: stats.activeJobs, color: 'text-accent', bg: 'bg-accent/10' },
            ].map((s) => (
              <div key={s.label} className={`${s.bg} rounded-xl p-3 border border-white/10 text-center`}>
                <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                <p className="text-gray-400 text-xs mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex gap-1 glass-card p-1 w-fit mb-6">
          {[
            { key: 'applications', label: `Başvurular (${stats.total})` },
            { key: 'jobs', label: `İlanlar (${jobs.length})` },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.key
                  ? 'bg-gradient-to-r from-secondary to-accent text-white shadow'
                  : 'text-gray-400 hover:text-white'
              }`}
              id={`tab-${tab.key}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div className="animate-fade-in">
            <ApplicationTable applications={applications} showJobFilter />
          </div>
        )}

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <div className="animate-fade-in space-y-4">
            {jobs.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <p className="text-gray-400">Henüz ilan yok.</p>
                <button onClick={openAddForm} className="btn-primary mt-4">
                  İlk İlanı Ekle
                </button>
              </div>
            ) : (
              jobs.map((job) => (
                <div key={job.id} className="glass-card p-5 flex items-center gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-white font-medium">{job.title}</h3>
                      <span className={job.isActive
                        ? 'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                        : 'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-500/15 text-gray-400 border border-gray-500/30'
                      }>
                        {job.isActive ? 'Aktif' : 'Pasif'}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mt-0.5">
                      {job.department} • {job.location} • {JOB_TYPES[job.type]}
                    </p>
                    {job.salary && (
                      <p className="text-accent text-sm font-medium mt-0.5">{job.salary}</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/jobs/${job.id}`}
                      className="btn-ghost text-xs px-3 py-1.5"
                      target="_blank"
                    >
                      Önizle
                    </Link>
                    <button
                      onClick={() => openEditForm(job)}
                      className="btn-secondary text-xs px-3 py-1.5"
                      id={`edit-job-${job.id}`}
                    >
                      Düzenle
                    </button>
                    <button
                      onClick={() => updateJob(job.id, { isActive: !job.isActive })}
                      className="btn-ghost text-xs px-3 py-1.5"
                    >
                      {job.isActive ? 'Pasife Al' : 'Aktife Al'}
                    </button>
                    {confirmDeleteJob === job.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDeleteJob(job.id)}
                          className="text-xs text-red-400 hover:text-red-300 font-medium px-2 py-1.5"
                        >
                          Evet, Sil
                        </button>
                        <button
                          onClick={() => setConfirmDeleteJob(null)}
                          className="text-xs text-gray-400 hover:text-white px-2 py-1.5"
                        >
                          Hayır
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDeleteJob(job.id)}
                        className="btn-danger text-xs px-3 py-1.5"
                        id={`delete-job-${job.id}`}
                      >
                        Sil
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Job Form Modal */}
      {showJobForm && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-primary-dark border border-white/15 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scale-in">
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <h2 className="text-white font-semibold text-lg">
                {editingJob ? 'İlanı Düzenle' : 'Yeni İlan Ekle'}
              </h2>
              <button
                onClick={() => setShowJobForm(false)}
                className="text-gray-400 hover:text-white transition-colors"
                id="close-job-form"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleJobFormSubmit} className="p-6 space-y-4" id="job-form">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="form-label">Pozisyon Adı *</label>
                  <input name="title" value={jobForm.title} onChange={handleJobFormChange}
                    className="form-input" placeholder="Frontend Developer" required />
                </div>
                <div>
                  <label className="form-label">Departman *</label>
                  <input name="department" value={jobForm.department} onChange={handleJobFormChange}
                    className="form-input" placeholder="Mühendislik" required />
                </div>
                <div>
                  <label className="form-label">Lokasyon *</label>
                  <input name="location" value={jobForm.location} onChange={handleJobFormChange}
                    className="form-input" placeholder="İstanbul (Hibrit)" required />
                </div>
                <div>
                  <label className="form-label">Çalışma Türü</label>
                  <select name="type" value={jobForm.type} onChange={handleJobFormChange} className="form-select">
                    {Object.entries(JOB_TYPES).map(([k, v]) => (
                      <option key={k} value={k} className="bg-primary-dark">{v}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label">Maaş Aralığı</label>
                  <input name="salary" value={jobForm.salary} onChange={handleJobFormChange}
                    className="form-input" placeholder="25.000 - 40.000 ₺" />
                </div>
                <div className="sm:col-span-2">
                  <label className="form-label">İş Tanımı *</label>
                  <textarea name="description" value={jobForm.description} onChange={handleJobFormChange}
                    className="form-input resize-none" rows={3} required
                    placeholder="Bu pozisyonun genel açıklaması..." />
                </div>
                <div>
                  <label className="form-label">
                    Gereksinimler
                    <span className="text-gray-600 text-xs ml-2">(Her satıra bir tane)</span>
                  </label>
                  <textarea name="requirements" value={jobForm.requirements} onChange={handleJobFormChange}
                    className="form-input resize-none" rows={4}
                    placeholder="React bilgisi&#10;TypeScript deneyimi&#10;Git bilgisi" />
                </div>
                <div>
                  <label className="form-label">
                    Sorumluluklar
                    <span className="text-gray-600 text-xs ml-2">(Her satıra bir tane)</span>
                  </label>
                  <textarea name="responsibilities" value={jobForm.responsibilities} onChange={handleJobFormChange}
                    className="form-input resize-none" rows={4}
                    placeholder="UI geliştirme&#10;Code review&#10;Dokümantasyon" />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" className="btn-primary flex-1" id="save-job-btn">
                  {editingJob ? 'Değişiklikleri Kaydet' : 'İlanı Ekle'}
                </button>
                <button type="button" onClick={() => setShowJobForm(false)} className="btn-secondary">
                  İptal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
