import { useMemo, useState } from 'react'
import ApplicationCard from '../components/ApplicationCard'
import ApplicationModal from '../components/ApplicationModal'
import Sidebar from '../components/Sidebar'
import Toast from '../components/Toast'
import { useAuth } from '../context/AuthContext'
import { useApplications } from '../hooks/useApplications'

const COLUMNS = [
  {
    title: 'Applied',
    accentClass: 'border-blue-500',
    badgeClass: 'bg-blue-100 text-blue-700',
  },
  {
    title: 'Screening',
    accentClass: 'border-amber-500',
    badgeClass: 'bg-amber-100 text-amber-700',
  },
  {
    title: 'Interview',
    accentClass: 'border-violet-500',
    badgeClass: 'bg-violet-100 text-violet-700',
  },
  {
    title: 'Offer',
    accentClass: 'border-emerald-500',
    badgeClass: 'bg-emerald-100 text-emerald-700',
  },
  {
    title: 'Rejected',
    accentClass: 'border-red-500',
    badgeClass: 'bg-red-100 text-red-700',
  },
]

function Dashboard() {
  const { currentUser } = useAuth()
  const { applications, loading, error, addApp, deleteApp, updateApp, toastMessage, clearToast } =
    useApplications()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const groupedApplications = useMemo(() => {
    return COLUMNS.reduce((grouped, column) => {
      grouped[column.title] = applications.filter((application) => application.status === column.title)
      return grouped
    }, {})
  }, [applications])

  const stats = useMemo(() => {
    const totalApplications = applications.length
    const interviewCount = applications.filter((application) => application.status === 'Interview').length
    const offerCount = applications.filter((application) => application.status === 'Offer').length
    const activePipeline = applications.filter((application) =>
      ['Applied', 'Screening', 'Interview'].includes(application.status),
    ).length

    const interviewRate =
      totalApplications === 0 ? 0 : Math.round((interviewCount / totalApplications) * 100)
    const offerRate = totalApplications === 0 ? 0 : Math.round((offerCount / totalApplications) * 100)

    return {
      totalApplications,
      interviewRate,
      offerRate,
      activePipeline,
    }
  }, [applications])

  const handleAddApplication = async (formData) => {
    setSubmitError('')

    try {
      await addApp(formData)
      setIsModalOpen(false)
    } catch (serviceError) {
      setSubmitError(serviceError.message || 'Failed to add application.')
    }
  }

  return (
    <div className="min-h-screen bg-slate-100 lg:flex">
      <Sidebar />

      <div className="flex-1 lg:ml-[220px]">
        <header className="border-b border-slate-700 bg-slate-900">
          <div className="flex w-full flex-wrap items-start justify-between gap-3 px-4 py-4 pl-16 sm:px-6 sm:items-center lg:pl-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-600 text-sm font-bold text-white">
                AF
              </div>
              <div>
                <span className="block text-lg font-semibold text-white">Dashboard</span>
                <span className="text-xs text-slate-300">{currentUser?.email || 'No email available'}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="w-full rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 sm:w-auto"
            >
              Add Application
            </button>
          </div>
        </header>

        <main className="w-full px-4 py-6 sm:px-6">
          {(error || submitError) && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error || submitError}
          </div>
        )}

        <section className="mb-4 grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Total Applications</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{stats.totalApplications}</p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Interview Rate</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{stats.interviewRate}%</p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Offer Rate</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{stats.offerRate}%</p>
          </div>
          <div className="rounded-xl bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Active Pipeline</p>
            <p className="mt-2 text-3xl font-bold text-slate-900">{stats.activePipeline}</p>
          </div>
        </section>

        {loading ? (
          <div className="flex min-h-[280px] items-center justify-center rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col items-center gap-3">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-200 border-t-blue-600" />
              <p className="text-sm text-slate-600">Loading applications...</p>
            </div>
          </div>
        ) : (
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
            {COLUMNS.map((column) => {
              const columnApplications = groupedApplications[column.title] ?? []

              return (
                <div
                  key={column.title}
                  className={`min-w-0 rounded-xl border-t-4 ${column.accentClass} bg-slate-50 p-3`}
                >
                  <div className="mb-3 flex items-center justify-between">
                    <h2 className="text-sm font-semibold text-slate-900">{column.title}</h2>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${column.badgeClass}`}
                    >
                      {columnApplications.length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {columnApplications.length > 0 ? (
                      columnApplications.map((application) => (
                        <ApplicationCard
                          key={application.id}
                          application={application}
                          deleteApp={deleteApp}
                          updateApp={updateApp}
                        />
                      ))
                    ) : (
                      <div className="rounded-md border border-dashed border-slate-300 bg-white px-3 py-3 text-center">
                        <div className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full bg-slate-100">
                          <div className="h-4 w-4 rounded-sm border-2 border-slate-300 bg-white" />
                        </div>
                        <p className="text-xs font-medium text-slate-600">No applications yet</p>
                        <p className="mt-1 text-[10px] text-slate-500">
                          New items in {column.title} will appear here.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </section>
        )}
      </main>
      </div>

      {isModalOpen && (
        <ApplicationModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false)
            setSubmitError('')
          }}
          onSubmit={handleAddApplication}
        />
      )}
      <Toast message={toastMessage} onClose={clearToast} />
    </div>
  )
}

export default Dashboard
