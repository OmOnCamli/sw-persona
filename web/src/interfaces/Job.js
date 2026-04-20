/**
 * @fileoverview Job interface definitions
 * @module interfaces/Job
 */

/**
 * @typedef {'full-time' | 'part-time' | 'intern'} JobType
 */

/**
 * @typedef {Object} Job
 * @property {number} id - Unique identifier
 * @property {string} title - Job title
 * @property {string} department - Department name
 * @property {string} location - Work location
 * @property {JobType} type - Employment type
 * @property {string} description - Job description
 * @property {string[]} requirements - List of requirements
 * @property {string[]} responsibilities - List of responsibilities
 * @property {string} salary - Salary range (optional)
 * @property {string} createdAt - ISO date string
 * @property {boolean} isActive - Whether the job is active
 */

/**
 * Creates a new Job object with defaults
 * @param {Partial<Job>} data
 * @returns {Job}
 */
export function createJob(data) {
  return {
    id: data.id || Date.now(),
    title: data.title || '',
    department: data.department || '',
    location: data.location || 'İstanbul',
    type: data.type || 'full-time',
    description: data.description || '',
    requirements: data.requirements || [],
    responsibilities: data.responsibilities || [],
    salary: data.salary || '',
    createdAt: data.createdAt || new Date().toISOString(),
    isActive: data.isActive !== undefined ? data.isActive : true,
  }
}

export const JOB_TYPES = {
  'full-time': 'Tam Zamanlı',
  'part-time': 'Yarı Zamanlı',
  'intern': 'Stajyer',
}
