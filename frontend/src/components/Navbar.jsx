import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  if (!user) return null

  return (
    <nav className="bg-forest shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-3xl">🌍</span>
            <span className="text-2xl font-bold text-white">Mazingira</span>
          </Link>

          <div className="flex items-center space-x-6">
            <Link to="/" className="text-white hover:text-leaf transition-colors">
              📱 Feed
            </Link>
            <Link to="/create" className="text-white hover:text-leaf transition-colors">
              ➕ Create Post
            </Link>
            <Link to="/leaderboard" className="text-white hover:text-leaf transition-colors">
              🏆 Leaderboard
            </Link>
            <Link to={`/profile/${user.id}`} className="text-white hover:text-leaf transition-colors">
              👤 {user.username}
            </Link>
            <button
              onClick={() => {
                logout()
                navigate('/login')
              }}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar