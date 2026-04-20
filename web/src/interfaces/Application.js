/**
 * @fileoverview Application interface definitions
 * @module interfaces/Application
 */

/**
 * @typedef {'pending' | 'accepted' | 'rejected'} ApplicationStatus
 */

/**
 * @typedef {Object} Application
 * @property {string} id - Unique identifier (UUID-like)
 * @property {string} name - Applicant full name
 * @property {string} email - Applicant email address
 * @property {string} phone - Applicant phone number
 * @property {number} jobId - Related job ID
 * @property {string} jobTitle - Job title at time of application
 * @property {string} department - Department name
 * @property {string} coverLetter - Cover letter text
 * @property {string} cvFileName - Uploaded CV file name
 * @property {string} cvContent - Extracted CV text content (if available)
 * @property {ApplicationStatus} status - Current application status
 * @property {string} appliedAt - ISO date string
 * @property {string} updatedAt - ISO date string
 * @property {string} [userId] - Optional user ID if applied while logged in
 */

/**
 * Creates a new Application object with defaults
 * @param {Partial<Application>} data
 * @returns {Application}
 */
export function createApplication(data) {
  const now = new Date().toISOString()
  return {
    id: data.id || `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    name: data.name || '',
    email: data.email || '',
    phone: data.phone || '',
    jobId: data.jobId || null,
    jobTitle: data.jobTitle || '',
    department: data.department || '',
    coverLetter: data.coverLetter || '',
    cvFileName: data.cvFileName || '',
    cvContent: data.cvContent || '',
    status: data.status || 'pending',
    appliedAt: data.appliedAt || now,
    updatedAt: data.updatedAt || now,
    userId: data.userId || null,
  }
}

export const APPLICATION_STATUSES = {
  pending: { label: 'Beklemede', color: 'pending' },
  accepted: { label: 'Kabul Edildi', color: 'accepted' },
  rejected: { label: 'Reddedildi', color: 'rejected' },
}
