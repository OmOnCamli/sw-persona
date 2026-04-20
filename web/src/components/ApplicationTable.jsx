import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import StatusBadge from './StatusBadge.jsx'
import { useData } from '../context/DataContext.jsx'
import { APPLICATION_STATUSES } from '../interfaces/Application.js'

export default function ApplicationTable({ applications, showJobFilter = true }) {
  const { updateApplicationStatus, deleteApplication } = useData()
  const navigate = useNavigate()
  const [filterJob, setFilterJob] = useState('all')
  const [confirmDelete, setConfirmDelete] = useState(null)

  const uniqueJobs = [...new Set(applications.map((a) => a.jobTitle))]

  const filtered =
    filterJob === 'all'
      ? applications
      : applications.filter((a) => a.jobTitle === filterJob)

  const handleStatusChange = (id, newStatus) => {
    updateApplicationStatus(id, newStatus)
  }

  const handleDeleteConfirm = (id) => {
    deleteApplication(id)
    setConfirmDelete(null)
  }

  if (applications.length === 0) {
    return (
      <div className="glass-card p-12 text-center">
        <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <p className="text-gray-400 font-medium">Henüz başvuru bulunmuyor</p>
        <p className="text-gray-600 text-sm mt-1">Başvurular burada listelenecektir.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filter */}
      {showJobFilter && uniqueJobs.length > 1 && (
        <div className="flex items-center gap-3 flex-wrap">
          <span className="text-gray-400 text-sm font-medium">Filtrele:</span>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilterJob('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                filterJob === 'all'
                  ? 'bg-accent text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
              }`}
              id="filter-all"
            >
              Tüm Başvurular ({applications.length})
            </button>
            {uniqueJobs.map((jobTitle) => (
              <button
                key={jobTitle}
                onClick={() => setFilterJob(jobTitle)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
                  filterJob === jobTitle
                    ? 'bg-accent text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                }`}
                id={`filter-${jobTitle.replace(/\s+/g, '-').toLowerCase()}`}
              >
                {jobTitle} ({applications.filter((a) => a.jobTitle === jobTitle).length})
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Başvuran</th>
                <th>Pozisyon</th>
                <th>Tarih</th>
                <th>Durum</th>
                <th>İşlemler</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((app) => (
                <tr key={app.id} className="animate-fade-in">
                  <td>
                    <div>
                      <p className="text-white font-medium">{app.name}</p>
                      <p className="text-gray-500 text-xs">{app.email}</p>
                    </div>
                  </td>
                  <td>
                    <div>
                      <p className="text-gray-200">{app.jobTitle}</p>
                      <p className="text-gray-500 text-xs">{app.department}</p>
                    </div>
                  </td>
                  <td className="text-gray-400 text-xs">
                    {new Date(app.appliedAt).toLocaleDateString('tr-TR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>
                  <td>
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app.id, e.target.value)}
                      className="bg-transparent border border-white/10 rounded-lg text-xs px-2 py-1.5 text-gray-300
                                 focus:outline-none focus:border-accent/50 cursor-pointer hover:border-white/20 transition-colors"
                      id={`status-select-${app.id}`}
                    >
                      {Object.entries(APPLICATION_STATUSES).map(([key, val]) => (
                        <option key={key} value={key} className="bg-primary-dark text-white">
                          {val.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <Link
                        to={`/admin/application/${app.id}`}
                        className="text-xs text-accent hover:text-accent-light transition-colors font-medium"
                        id={`view-app-${app.id}`}
                      >
                        Detay
                      </Link>
                      <span className="text-white/10">|</span>
                      {confirmDelete === app.id ? (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleDeleteConfirm(app.id)}
                            className="text-xs text-red-400 hover:text-red-300 font-medium"
                          >
                            Evet
                          </button>
                          <span className="text-white/10">/</span>
                          <button
                            onClick={() => setConfirmDelete(null)}
                            className="text-xs text-gray-400 hover:text-white"
                          >
                            Hayır
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmDelete(app.id)}
                          className="text-xs text-gray-500 hover:text-red-400 transition-colors"
                          id={`delete-app-${app.id}`}
                        >
                          Sil
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
