import { useEffect } from 'react'

function Toast({ message, onClose }) {
  useEffect(() => {
    if (!message) {
      return
    }

    const timeoutId = window.setTimeout(() => {
      onClose()
    }, 2500)

    return () => window.clearTimeout(timeoutId)
  }, [message, onClose])

  if (!message) {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 z-[60] rounded-lg bg-blue-600 px-4 py-3 text-sm font-medium text-white shadow-lg">
      {message}
    </div>
  )
}

export default Toast
