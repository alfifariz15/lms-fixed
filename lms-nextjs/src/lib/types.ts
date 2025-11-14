export interface User {
  id: number
  name: string
  username: string
  role: 'guru' | 'siswa'
  kelas?: string
}

export interface Material {
  id: number
  title: string
  description: string
  video_url: string
  order: number
  duration: number
  is_active: boolean
  progress?: UserMaterialProgress
}

export interface UserMaterialProgress {
  id: number
  user_id: number
  material_id: number
  video_completed: boolean
  watch_duration: number
  quiz_completed: boolean
  is_unlocked: boolean
}

export interface Quiz {
  id: number
  material_id: number
  title: string
  question: string
  options: {
    A: string
    B: string
    C: string
    D: string
  }
  quiz_variant?: string
  completed?: boolean
}

export interface QuizResult {
  id: number
  user_id: number
  quiz_id: number
  answer: string
  is_correct: boolean
  created_at: string
  quiz: {
    material: {
      title: string
    }
    question: string
  }
}

export interface DashboardGuru {
  total_siswa: number
  siswa_data: Array<{
    id: number
    name: string
    kelas: string
    correct_answers: Array<{
      material_title: string
      question: string
      answer: string
      answered_at: string
    }>
    total_correct: number
  }>
}

export interface DashboardSiswa {
  user: {
    name: string
    kelas: string
  }
  progress: {
    completed_materials: number
    total_materials: number
    percentage: number
  }
  recent_activities: Array<{
    material_title: string
    is_correct: boolean
    date: string
  }>
}
