'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { logout, getUser } from '@/lib/auth'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const user = getUser()

  const handleLogout = () => {
    logout()
  }

  const menuItems = [
    { id: 'pendahuluan', label: 'Pendahuluan', icon: '🏠', path: '/pendahuluan' },
    { id: 'materi', label: 'Materi', icon: '📖', path: '/materi' },
    { id: 'lkpd', label: 'LKPD', icon: '📝', path: '/lkpd' },
    { id: 'asesmen', label: 'Asesmen', icon: '📊', path: '/asesmen' },
  ]

  const handleMenuClick = (path: string) => {
    router.push(path)
    setIsOpen(false) // Close menu after navigation
  }

  return (
    <>
      {/* Burger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-3 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
      >
        <div className="w-6 h-5 relative flex flex-col justify-between">
          <span className={`block h-0.5 w-6 bg-gray-600 transform transition-transform ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block h-0.5 w-6 bg-gray-600 transition-opacity ${isOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block h-0.5 w-6 bg-gray-600 transform transition-transform ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </div>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Sliding Sidebar */}
      <div className={`fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-40 transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6">
          {/* Header */}
          <div className="mb-8 pt-8">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">📚</span>
              </div>
              <h1 className="ml-3 text-lg font-bold text-gray-800">
                Manajemen Pembelajaran
              </h1>
            </div>
            
            {user && (
              <div className="text-sm text-gray-600">
                <p className="font-medium">{user.name}</p>
                <p className="text-xs text-gray-500 capitalize">
                  {user.role} {user.kelas && `- ${user.kelas}`}
                </p>
              </div>
            )}
          </div>

          {/* Menu Items */}
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleMenuClick(item.path)}
                className="w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors hover:bg-blue-50 hover:text-blue-700 group"
              >
                <span className="text-xl mr-4 group-hover:scale-110 transition-transform">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* Logout Button */}
          {user && (
            <div className="absolute bottom-6 left-6 right-6">
              <button
                onClick={handleLogout}
                className="w-full bg-red-500 hover:bg-red-600 text-white px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center"
              >
                <span className="mr-2">🚪</span>
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
