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
import { AuthProvider } from './context/AuthContext'
import PrivateRoute from './components/PrivateRoute'

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
        }}
      />
      <div className="min-h-screen">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<PrivateRoute><Feed /></PrivateRoute>} />
            <Route path="/create" element={<PrivateRoute><CreatePost /></PrivateRoute>} />
            <Route path="/profile/:id?" element={<PrivateRoute><Profile /></PrivateRoute>} />
            <Route path="/leaderboard" element={<PrivateRoute><Leaderboard /></PrivateRoute>} />
          </Routes>
        </div>
      </div>
    </AuthProvider>
  )
}

export default App