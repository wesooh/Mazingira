import React from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-forest text-xl">Loading... 🌱</div>
      </div>
    )
  }

  return user ? children : <Navigate to="/login" />
}

export default PrivateRoute