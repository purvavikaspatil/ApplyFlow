import { useEffect, useRef, useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

function Sidebar() {
  const navigate = useNavigate()
  const { logout } = useAuth()
  const sidebarRef = useRef(null)
  const [isOpen, setIsOpen] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!isOpen) {
      return
    }

    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const handleLogout = async () => {
    setError('')

    try {
      await logout()
      navigate('/login')
    } catch (authError) {
      setError(authError.message || 'Failed to logout.')
    }
  }

  const navItemClass = ({ isActive }) =>
    `block rounded-md px-3 py-2 text-sm font-medium transition ${
      isActive
        ? 'bg-blue-600 text-white'
        : 'text-slate-200 hover:bg-slate-700 hover:text-white focus-visible:bg-slate-700'
    }`

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen((previous) => !previous)}
        className="fixed left-4 top-4 z-50 rounded-md border border-slate-600 bg-slate-900 p-2 text-slate-100 shadow-sm transition hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 lg:hidden"
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X size={18} /> : <Menu size={18} />}
      </button>

      {isOpen && <div className="fixed inset-0 z-40 bg-slate-900/30 lg:hidden" />}

      <aside
        ref={sidebarRef}
        className={`fixed left-0 top-0 z-50 flex h-screen w-[220px] flex-col border-r border-slate-700 bg-slate-900 p-4 transition-transform lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-6 border-b border-slate-700 pb-4">
          <h1 className="text-xl font-bold text-white">ApplyFlow</h1>
        </div>

        <nav className="flex-1 space-y-2">
          <NavLink to="/dashboard" className={navItemClass} onClick={() => setIsOpen(false)}>
            Dashboard
          </NavLink>
          <NavLink to="/applications" className={navItemClass} onClick={() => setIsOpen(false)}>
            All Applications
          </NavLink>
        </nav>

        <div className="mt-6 border-t border-slate-700 pt-4">
          {error && <p className="mb-2 text-xs text-red-600">{error}</p>}
          <button
            type="button"
            onClick={handleLogout}
            className="w-full rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar
