import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import ApplicationModal from '../components/ApplicationModal'
import Sidebar from '../components/Sidebar'
import Toast from '../components/Toast'
import { useApplications } from '../hooks/useApplications'

const STATUS_OPTIONS = ['All', 'Applied', 'Screening', 'Interview', 'Offer', 'Rejected']

const STATUS_STYLES = {
  Applied: 'bg-blue-50 text-blue-500',
  Screening: 'bg-amber-50 text-amber-500',
  Interview: 'bg-violet-50 text-violet-500',
  Offer: 'bg-emerald-50 text-emerald-500',
  Rejected: 'bg-red-50 text-red-500',
}

const FILTER_STYLES = {
  All: 'bg-white text-slate-700 border-slate-300',
  Applied: 'bg-blue-50 text-blue-500 border-blue-200',
  Screening: 'bg-amber-50 text-amber-500 border-amber-200',
  Interview: 'bg-violet-50 text-violet-500 border-violet-200',
  Offer: 'bg-emerald-50 text-emerald-500 border-emerald-200',
  Rejected: 'bg-red-50 text-red-500 border-red-200',
}

const parseDateValue = (value) => {
  if (!value) {
    return null
  }

  if (typeof value?.toDate === 'function') {
    return value.toDate()
  }

  const parsedDate = new Date(value)
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate
}

const formatDate = (value) => {
  const dateValue = parseDateValue(value)
  if (!dateValue) {
    return 'N/A'
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).format(dateValue)
}

function Applications() {
  const { applications, loading, error, addApp, updateApp, deleteApp, toastMessage, clearToast } =
    useApplications()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedApplication, setSelectedApplication] = useState(null)
  const [submitError, setSubmitError] = useState('')
  const searchInputRef = useRef(null)
  const selectedFilterStyle = FILTER_STYLES[statusFilter] ?? FILTER_STYLES.All

  useEffect(() => {
    searchInputRef.current?.focus()
  }, [])

  const handleSearchChange = useCallback((event) => {
    setSearchTerm(event.target.value)
  }, [])

  const filteredApplications = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()

    const visibleApplications = applications.filter((application) => {
      const matchesStatus = statusFilter === 'All' || application.status === statusFilter
      const matchesSearch =
        !normalizedSearch ||
        application.company?.toLowerCase().includes(normalizedSearch) ||
        application.role?.toLowerCase().includes(normalizedSearch)

      return matchesStatus && matchesSearch
    })

    return [...visibleApplications].sort((a, b) => {
      const firstDate = parseDateValue(a.appliedDate)?.getTime() ?? 0
      const secondDate = parseDateValue(b.appliedDate)?.getTime() ?? 0
      return secondDate - firstDate
    })
  }, [applications, searchTerm, statusFilter])

  const openAddModal = () => {
    setSubmitError('')
    setSelectedApplication(null)
    setIsModalOpen(true)
  }

  const openEditModal = (application) => {
    setSubmitError('')
    setSelectedApplication(application)
    setIsModalOpen(true)
  }

  const handleModalSubmit = async (data) => {
    setSubmitError('')

    try {
      if (selectedApplication) {
        await updateApp(selectedApplication.id, data)
      } else {
        await addApp(data)
      }
      setIsModalOpen(false)
      setSelectedApplication(null)
    } catch (serviceError) {
      setSubmitError(serviceError.message || 'Unable to save application.')
    }
  }

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Are you sure you want to delete this application?')
    if (!confirmed) {
      return
    }

    await deleteApp(id)
  }

  return (
    <div className="min-h-screen bg-slate-100 lg:flex">
      <Sidebar />

      <div className="flex-1 lg:ml-[220px]">
        <header className="border-b border-slate-700 bg-slate-900">
          <div className="flex w-full items-center justify-between gap-4 px-4 py-4 pl-16 sm:px-6 lg:pl-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-600 text-sm font-bold text-white">
                AF
              </div>
              <div>
                <span className="block text-lg font-semibold text-white">All Applications</span>
                <span className="text-xs text-slate-300">Manage and track all job applications in one place.</span>
              </div>
            </div>
          </div>
        </header>

        <main className="w-full px-4 py-6 sm:px-6">
        <div className="mb-4 grid grid-cols-1 gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:grid-cols-[1fr_180px_auto]">
          <input
            ref={searchInputRef}
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search by company or role..."
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
          />
          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className={`w-full rounded-md border px-3 py-2 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 ${selectedFilterStyle}`}
          >
            {STATUS_OPTIONS.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
          >
            <Plus size={16} />
            Add Application
          </button>
        </div>

        {(error || submitError) && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error || submitError}
          </div>
        )}

        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Company
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Role
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Date</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-10">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
                        <p className="text-sm text-slate-600">Loading applications...</p>
                      </div>
                    </td>
                  </tr>
                ) : filteredApplications.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-sm text-slate-600">
                      No applications found.
                    </td>
                  </tr>
                ) : (
                  filteredApplications.map((application) => {
                    const badgeClass = STATUS_STYLES[application.status] ?? 'bg-slate-100 text-slate-700'

                    return (
                      <tr key={application.id} className="hover:bg-slate-50">
                        <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-slate-900">
                          {application.company || 'N/A'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-700">
                          {application.role || 'N/A'}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm">
                          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${badgeClass}`}>
                            {application.status || 'Applied'}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-700">
                          {formatDate(application.appliedDate)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3">
                          <div className="flex justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openEditModal(application)}
                              className="rounded-md border border-slate-200 p-2 text-slate-600 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
                              aria-label="Edit application"
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDelete(application.id)}
                              className="rounded-md border border-red-200 p-2 text-red-600 transition hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
                              aria-label="Delete application"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
        </main>
      </div>

      {isModalOpen && (
        <ApplicationModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedApplication(null)
          }}
          onSubmit={handleModalSubmit}
          initialData={selectedApplication}
        />
      )}
      <Toast message={toastMessage} onClose={clearToast} />
    </div>
  )
}

export default Applications
