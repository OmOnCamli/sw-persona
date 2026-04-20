import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { MOCK_JOBS } from '../data/mockJobs.js'
import { createJob } from '../interfaces/Job.js'
import { createApplication } from '../interfaces/Application.js'

const DataContext = createContext(null)

const LS_JOBS         = 'persona_jobs'
const LS_APPLICATIONS = 'persona_applications'

function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch { return fallback }
}

function saveToStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

export function DataProvider({ children }) {
  const [jobs, setJobs]               = useState(() => loadFromStorage(LS_JOBS, MOCK_JOBS))
  const [applications, setApplications] = useState(() => loadFromStorage(LS_APPLICATIONS, []))

  useEffect(() => { saveToStorage(LS_JOBS, jobs) }, [jobs])
  useEffect(() => { saveToStorage(LS_APPLICATIONS, applications) }, [applications])

  /* =================== JOB CRUD =================== */
  const addJob = useCallback((data) => {
    const newJob = createJob({ ...data, id: Date.now() })
    setJobs((prev) => [newJob, ...prev])
    return newJob
  }, [])

  const updateJob = useCallback((id, data) => {
    setJobs((prev) => prev.map((j) => (j.id === id ? { ...j, ...data } : j)))
  }, [])

  const deleteJob = useCallback((id) => {
    setJobs((prev) => prev.filter((j) => j.id !== id))
  }, [])

  const getJobById = useCallback(
    (id) => jobs.find((j) => j.id === Number(id)),
    [jobs]
  )

  /* =================== APPLICATION CRUD =================== */
  const addApplication = useCallback((data) => {
    const newApp = createApplication(data)
    setApplications((prev) => [newApp, ...prev])
    return newApp
  }, [])

  const updateApplicationStatus = useCallback((id, status) => {
    setApplications((prev) =>
      prev.map((a) =>
        a.id === id ? { ...a, status, updatedAt: new Date().toISOString() } : a
      )
    )
  }, [])

  const deleteApplication = useCallback((id) => {
    setApplications((prev) => prev.filter((a) => a.id !== id))
  }, [])

  const getApplicationById = useCallback(
    (id) => applications.find((a) => a.id === id),
    [applications]
  )

  const getApplicationsByJob = useCallback(
    (jobId) => applications.filter((a) => a.jobId === Number(jobId)),
    [applications]
  )

  /** Kullanıcının kendi başvurularını getirir */
  const getApplicationsByUser = useCallback(
    (userId) => applications.filter((a) => a.userId === userId),
    [applications]
  )

  return (
    <DataContext.Provider value={{
      jobs, addJob, updateJob, deleteJob, getJobById,
      applications, addApplication, updateApplicationStatus,
      deleteApplication, getApplicationById, getApplicationsByJob,
      getApplicationsByUser,
    }}>
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}
