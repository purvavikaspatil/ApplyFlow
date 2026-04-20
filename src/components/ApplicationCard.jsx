import { useState } from 'react'
import { Pencil, Trash2 } from 'lucide-react'
import EditModal from './EditModal'

const STATUS_STYLES = {
  Applied: 'bg-blue-100 text-blue-700',
  Screening: 'bg-blue-100 text-blue-700',
  Interview: 'bg-blue-100 text-blue-700',
  Offer: 'bg-blue-100 text-blue-700',
  Rejected: 'bg-blue-100 text-blue-700',
}

const formatAppliedDate = (value) => {
  if (!value) {
    return 'N/A'
  }

  const dateValue =
    typeof value?.toDate === 'function'
      ? value.toDate()
      : value instanceof Date
        ? value
        : new Date(value)

  if (Number.isNaN(dateValue.getTime())) {
    return 'N/A'
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: '2-digit',
    year: 'numeric',
  }).format(dateValue)
}

function ApplicationCard({ application, deleteApp, updateApp }) {
  const [isEditOpen, setIsEditOpen] = useState(false)

  const handleDelete = async (event) => {
    event.stopPropagation()
    const isConfirmed = window.confirm('Are you sure you want to delete this application?')
    if (!isConfirmed) {
      return
    }

    await deleteApp(application.id)
  }

  const handleEditClick = (event) => {
    event.stopPropagation()
    setIsEditOpen(true)
  }

  const handleSave = async (data) => {
    await updateApp(application.id, data)
  }

  const badgeClass = STATUS_STYLES[application.status] ?? 'bg-slate-100 text-slate-700'

  return (
    <>
      <article
        role="button"
        tabIndex={0}
        onClick={() => setIsEditOpen(true)}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            setIsEditOpen(true)
          }
        }}
        className="cursor-pointer rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              {application.company || 'Untitled Company'}
            </h3>
            <p className="mt-1 text-sm text-slate-700">{application.role || 'Role not specified'}</p>
          </div>
          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${badgeClass}`}>
            {application.status || 'Applied'}
          </span>
        </div>

        <p className="mt-3 text-xs text-slate-500">
          Applied: <span className="font-medium text-slate-700">{formatAppliedDate(application.appliedDate)}</span>
        </p>

        <div className="mt-3 flex justify-end gap-2">
          <button
            type="button"
            onClick={handleEditClick}
            className="rounded-md border border-slate-200 p-2 text-slate-600 transition hover:bg-blue-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
            aria-label="Edit application"
          >
            <Pencil size={16} />
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="rounded-md border border-red-200 p-2 text-red-600 transition hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
            aria-label="Delete application"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </article>

      {isEditOpen && (
        <EditModal
          application={application}
          onClose={() => setIsEditOpen(false)}
          onSave={handleSave}
        />
      )}
    </>
  )
}

export default ApplicationCard
