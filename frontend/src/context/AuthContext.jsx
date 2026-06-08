import React, { createContext, useState, useContext, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  // Configure axios defaults
  axios.defaults.baseURL = 'http://localhost:5000/api'

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      fetchUser()
    } else {
      setLoading(false)
    }
  }, [token])

  const fetchUser = async () => {
    try {
      const { data } = await axios.get('/auth/me')
      setUser(data.user)
    } catch (error) {
      console.error('Failed to fetch user:', error)
      // If token is invalid, clear it
      if (error.response?.status === 401) {
        localStorage.removeItem('token')
        setToken(null)
        delete axios.defaults.headers.common['Authorization']
      }
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const { data } = await axios.post('/auth/login', { email, password })
      setToken(data.token)
      localStorage.setItem('token', data.token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
      setUser(data.user)
      toast.success('Welcome back to Mazingira! 🌍')
      return true
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed')
      return false
    }
  }

  const register = async (userData) => {
    try {
      const { data } = await axios.post('/auth/register', userData)
      setToken(data.token)
      localStorage.setItem('token', data.token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`
      setUser(data.user)
      toast.success('Account created! Welcome to Mazingira 🌱')
      return true
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed')
      return false
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
    toast.success('Logged out successfully')
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}