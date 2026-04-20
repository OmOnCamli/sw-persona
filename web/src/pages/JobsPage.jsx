import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useData } from '../context/DataContext.jsx'
import JobCard from '../components/JobCard.jsx'
import { JOB_TYPES } from '../interfaces/Job.js'

const DEPARTMENTS = ['Tümü', 'Mühendislik', 'Tasarım', 'Altyapı', 'Pazarlama', 'İnsan Kaynakları']

export default function JobsPage() {
  const { jobs } = useData()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [deptFilter, setDeptFilter] = useState('Tümü')

  const activeJobs = useMemo(
    () =>
      jobs
        .filter((j) => j.isActive)
        .filter((j) => {
          const q = search.toLowerCase()
          return (
            j.title.toLowerCase().includes(q) ||
            j.department.toLowerCase().includes(q) ||
            j.description.toLowerCase().includes(q) ||
            j.location.toLowerCase().includes(q)
          )
        })
        .filter((j) => typeFilter === 'all' || j.type === typeFilter)
        .filter((j) => deptFilter === 'Tümü' || j.department === deptFilter),
    [jobs, search, typeFilter, deptFilter]
  )

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="hero-gradient pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/15 border border-accent/30 text-accent text-xs font-medium mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            {jobs.filter((j) => j.isActive).length} Açık Pozisyon
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
            Kariyerinde{' '}
            <span className="text-gradient">Yeni Bir Sayfa</span> Aç
          </h1>
          <p className="text-gray-300 text-lg mt-4 max-w-2xl mx-auto">
            Software Persona'da yazılım, tasarım ve teknoloji alanlarında kariyer
            fırsatlarını keşfet. Dinamik ekibimize katıl.
          </p>

          {/* Search */}
          <div className="mt-8 max-w-xl mx-auto relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Pozisyon, departman veya lokasyon ara..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-input pl-12 text-base h-13 shadow-lg shadow-black/20"
              id="job-search"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="page-container">
        {/* Filters */}
        <div className="flex flex-wrap items-center gap-4 mb-8">
          {/* Type Filter */}
          <div className="flex flex-wrap gap-2">
            {[['all', 'Hepsi'], ...Object.entries(JOB_TYPES)].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setTypeFilter(key)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  typeFilter === key
                    ? 'bg-gradient-to-r from-secondary to-accent text-white shadow-lg shadow-accent/20'
                    : 'glass-card text-gray-300 hover:text-white hover:border-white/20'
                }`}
                id={`type-filter-${key}`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Department Filter */}
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="form-select w-auto pl-4 pr-8 text-sm"
            id="dept-filter"
          >
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d} className="bg-primary-dark">
                {d}
              </option>
            ))}
          </select>

          {(search || typeFilter !== 'all' || deptFilter !== 'Tümü') && (
            <button
              onClick={() => { setSearch(''); setTypeFilter('all'); setDeptFilter('Tümü') }}
              className="text-sm text-gray-400 hover:text-white transition-colors flex items-center gap-1"
              id="clear-filters"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Filtreleri Temizle
            </button>
          )}
        </div>

        {/* Results */}
        {activeJobs.length > 0 ? (
          <>
            <p className="text-gray-500 text-sm mb-4">
              {activeJobs.length} pozisyon bulundu
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {activeJobs.map((job, idx) => (
                <JobCard key={job.id} job={job} index={idx} />
              ))}
            </div>
          </>
        ) : (
          <div className="glass-card p-16 text-center animate-fade-in">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-white font-semibold text-lg">Sonuç bulunamadı</h3>
            <p className="text-gray-400 text-sm mt-2">
              Arama kriterlerinizi değiştirmeyi deneyin.
            </p>
            <button
              onClick={() => { setSearch(''); setTypeFilter('all'); setDeptFilter('Tümü') }}
              className="btn-secondary mt-4 text-sm"
            >
              Filtreleri Temizle
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
