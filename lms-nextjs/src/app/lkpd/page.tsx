'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getUser } from '@/lib/auth'
import Navbar from '@/components/Navbar'

export default function LKPDPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const userData = getUser()
    if (!userData) {
      router.push('/login')
      return
    }
    setUser(userData)
  }, [router])

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  const lkpdSteps = [
    "Bacalah skenario permasalahan tentang jaringan WiFi di laboratorium sekolah.",
    "Diskusikan bersama kelompok mengenai masalah yang terjadi",
    "Catat poin penting dari hasil temuan bersama kelompok",
    "Tulis jawaban dan kesimpulan pribadi di kolom LKPD masing-masing.",
    {
      text: "Lakukan praktik konfigurasi Access Point bersama sama lalu mendokumentasikan setiap langkah langkahnya. Cisco Packet Tracer bisa di download link berikut ",
      link: { text: "Soal CPT", url: "https://drive.google.com/drive/folders/1NQitDCvW-UjKwpbybE3VnjjmidCo_MP_?usp=sharing" },
      suffix: "."
    },
    "Pilih salah satu anggota untuk menjelaskan hasil diskusi kelompok secara lisan.",
    "Kumpulkan FIle LKPD di Google Form berikut http://PengumpulanLKPD"
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              LKPD
            </h1>
            <p className="text-lg text-gray-600">
              Lembar Kerja Peserta Didik
            </p>
          </div>

          {/* Main LKPD Card */}
          <div className="card-glass p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6">
              Langkah Pengerjaan LKPD
            </h2>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <h3 className="text-lg font-semibold text-green-800 mb-4">
                Instruksi Pengerjaan:
              </h3>
              <div className="space-y-3">
                {lkpdSteps.map((step, index) => (
                  <div key={index} className="flex items-start">
                    <span className="bg-green-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold mr-4 mt-1 flex-shrink-0">
                      {index + 1}
                    </span>
                    <p className="text-green-800 leading-relaxed">
                      {typeof step === 'string' ? (
                        step
                      ) : (
                        <>
                          {step.text}
                          <a 
                            href={step.link.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 underline font-semibold"
                          >
                            {step.link.text}
                          </a>
                          {step.suffix}
                        </>
                      )}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="mt-auto py-6 text-center">
        <p className="text-gray-600 text-sm">© 2025 Aurylia | ALL RIGHTS RESERVED</p>
      </footer>
    </div>
  )
}
