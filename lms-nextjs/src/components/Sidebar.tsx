'use client'

import { useRouter } from 'next/navigation'
import { isSiswa } from '@/lib/auth'

interface SidebarProps {
  activeItem?: string
}

export default function Sidebar({ activeItem }: SidebarProps) {
  const router = useRouter()
  const siswaMode = isSiswa()

  const menuItems = siswaMode ? [
    { id: 'home', label: 'Home', icon: '🏠', path: '/dashboard/siswa' },
    { id: 'materi', label: 'Mulai Materi', icon: '📖', path: '/materi' },
    { id: 'kriteria', label: 'Kriteria Penilaian', icon: '📊', path: '/kriteria-penilaian' },
  ] : [
    { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/dashboard/guru' },
    { id: 'siswa', label: 'Data Siswa', icon: '👥', path: '/data-siswa' },
  ]

  return (
    <div className="w-64 bg-white/90 backdrop-blur-sm shadow-lg h-screen">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-6">
          {siswaMode ? 'Menu Siswa' : 'Menu Guru'}
        </h2>
        
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => router.push(item.path)}
              className={`w-full flex items-center px-4 py-3 rounded-lg text-left transition-colors ${
                activeItem === item.id
                  ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="text-xl mr-3">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  )
}
