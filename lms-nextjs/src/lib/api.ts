import axios from 'axios'

// Get API URL from environment variables or fallback to Railway backend
const API_BASE_URL = typeof window !== 'undefined' && (window as any).NEXT_PUBLIC_BACKEND_URL
  ? (window as any).NEXT_PUBLIC_BACKEND_URL
  : 'https://lms-fixed-production-c83a.up.railway.app'

console.log('🔗 API Base URL:', API_BASE_URL)

// Create axios instance
const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
})

// Add request interceptor to include token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error)
    console.error('Request URL:', error.config?.url)
    console.error('Response:', error.response?.data)
    
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
