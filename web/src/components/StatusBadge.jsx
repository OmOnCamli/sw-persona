import { APPLICATION_STATUSES } from '../interfaces/Application.js'

const STATUS_CONFIG = {
  pending: {
    className: 'badge-pending',
    dot: 'bg-amber-400',
    icon: '⏳',
  },
  accepted: {
    className: 'badge-accepted',
    dot: 'bg-emerald-400',
    icon: '✅',
  },
  rejected: {
    className: 'badge-rejected',
    dot: 'bg-red-400',
    icon: '❌',
  },
}

/**
 * @param {{ status: import('../interfaces/Application.js').ApplicationStatus, showIcon?: boolean }} props
 */
export default function StatusBadge({ status, showIcon = false }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.pending
  const label = APPLICATION_STATUSES[status]?.label || status

  return (
    <span className={config.className}>
      {showIcon ? (
        <span>{config.icon}</span>
      ) : (
        <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      )}
      {label}
    </span>
  )
}
