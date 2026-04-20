import { Link } from 'react-router-dom'
import { JOB_TYPES } from '../interfaces/Job.js'

const TYPE_CLASSES = {
  'full-time': 'job-type-full-time',
  'part-time': 'job-type-part-time',
  intern: 'job-type-intern',
}

const DEPT_ICONS = {
  Mühendislik: '⚙️',
  Tasarım: '🎨',
  Altyapı: '🖥️',
  Pazarlama: '📊',
  'İnsan Kaynakları': '👥',
}

export default function JobCard({ job, index = 0 }) {
  const typeLabel = JOB_TYPES[job.type] || job.type
  const typeClass = TYPE_CLASSES[job.type] || 'job-type-full-time'
  const icon = DEPT_ICONS[job.department] || '💼'

  const daysAgo = Math.floor(
    (Date.now() - new Date(job.createdAt).getTime()) / (1000 * 60 * 60 * 24)
  )
  const dateLabel =
    daysAgo === 0 ? 'Bugün' : daysAgo === 1 ? '1 gün önce' : `${daysAgo} gün önce`

  return (
    <Link
      to={`/jobs/${job.id}`}
      className="glass-card-hover block p-6 animate-slide-up"
      style={{ animationDelay: `${index * 80}ms`, animationFillMode: 'backwards' }}
      id={`job-card-${job.id}`}
    >
      <div className="flex items-start justify-between gap-4">
        {/* Icon + Info */}
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary/30 to-accent/20 border border-accent/20 flex items-center justify-center text-xl flex-shrink-0">
            {icon}
          </div>
          <div>
            <h3 className="text-white font-semibold text-lg leading-tight hover:text-accent transition-colors">
              {job.title}
            </h3>
            <p className="text-gray-400 text-sm mt-0.5">{job.department}</p>
          </div>
        </div>

        {/* Type badge */}
        <span className={typeClass}>{typeLabel}</span>
      </div>

      {/* Description preview */}
      <p className="text-gray-400 text-sm mt-4 line-clamp-2 leading-relaxed">
        {job.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
        <div className="flex items-center gap-4 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {job.location}
          </span>
          {job.salary && (
            <span className="flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {job.salary}
            </span>
          )}
        </div>
        <span className="text-xs text-gray-600">{dateLabel}</span>
      </div>
    </Link>
  )
}
