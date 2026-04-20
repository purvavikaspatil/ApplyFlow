import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import {
  addApplication,
  deleteApplication,
  getApplications,
  updateApplication,
} from '../services/applications'

export function useApplications() {
  const { currentUser } = useAuth()
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [toastMessage, setToastMessage] = useState('')

  const refreshApplications = useCallback(async () => {
    setLoading(true)

    if (!currentUser?.uid) {
      setApplications([])
      setLoading(false)
      return
    }

    try {
      setError('')
      const data = await getApplications(currentUser.uid)
      setApplications(data)
    } catch (serviceError) {
      setError(serviceError.message || 'Failed to load applications.')
    } finally {
      setLoading(false)
    }
  }, [currentUser])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    refreshApplications()
  }, [refreshApplications])

  const addApp = async (data) => {
    if (!currentUser?.uid) {
      setError('You must be logged in to add an application.')
      return
    }

    try {
      setError('')
      await addApplication(currentUser.uid, data)
      await refreshApplications()
      setToastMessage('Application added')
    } catch (serviceError) {
      setError(serviceError.message || 'Failed to add application.')
      throw serviceError
    }
  }

  const updateApp = async (id, data) => {
    if (!currentUser?.uid) {
      setError('You must be logged in to update an application.')
      return
    }

    try {
      setError('')
      await updateApplication(currentUser.uid, id, data)
      await refreshApplications()
      setToastMessage('Application updated')
    } catch (serviceError) {
      setError(serviceError.message || 'Failed to update application.')
      throw serviceError
    }
  }

  const deleteApp = async (id) => {
    if (!currentUser?.uid) {
      setError('You must be logged in to delete an application.')
      return
    }

    try {
      setError('')
      await deleteApplication(currentUser.uid, id)
      await refreshApplications()
      setToastMessage('Application deleted')
    } catch (serviceError) {
      setError(serviceError.message || 'Failed to delete application.')
      throw serviceError
    }
  }

  const clearToast = () => {
    setToastMessage('')
  }

  return {
    applications,
    loading,
    error,
    addApp,
    updateApp,
    deleteApp,
    refreshApplications,
    toastMessage,
    clearToast,
  }
}
