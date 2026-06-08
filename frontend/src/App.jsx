import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Feed from './pages/Feed'
import CreatePost from './pages/CreatePost'
import Profile from './pages/Profile'
import Leaderboard from './pages/Leaderboard'
import { AuthProvider, useAuth } from './context/AuthContext'

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="text-6xl mb-4">🌍</div>
          <div className="text-forest text-xl">Loading Mazingira...</div>
        </div>
      </div>
    )
  }
  
  return user ? children : <Navigate to="/login" />
}

function AppContent() {
  const { user } = useAuth()
  
  return (
    <div className="min-h-screen">
      {user && <Navbar />}
      <div className="container mx-auto px-4 py-8">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Feed />
            </ProtectedRoute>
          } />
          <Route path="/create" element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          } />
          <Route path="/profile/:id?" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/leaderboard" element={
            <ProtectedRoute>
              <Leaderboard />
            </ProtectedRoute>
          } />
        </Routes>
      </div>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#2E7D32',
            color: '#fff',
          },
          duration: 3000,
        }}
      />
      <AppContent />
    </AuthProvider>
  )
}

export default App