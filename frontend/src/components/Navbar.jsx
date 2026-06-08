import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  if (!user) return null

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-forest shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4 flex-wrap gap-4">
          <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
            <span className="text-3xl">🌍</span>
            <span className="text-2xl font-bold text-white">Mazingira</span>
          </Link>

          <div className="flex items-center space-x-4 flex-wrap gap-2">
            <Link to="/" className="text-white hover:bg-light-green hover:bg-opacity-20 px-3 py-2 rounded-lg transition-all">
              📱 Feed
            </Link>
            <Link to="/create" className="text-white hover:bg-light-green hover:bg-opacity-20 px-3 py-2 rounded-lg transition-all">
              ➕ Create
            </Link>
            <Link to="/leaderboard" className="text-white hover:bg-light-green hover:bg-opacity-20 px-3 py-2 rounded-lg transition-all">
              🏆 Leaderboard
            </Link>
            <Link to={`/profile/${user.id}`} className="text-white hover:bg-light-green hover:bg-opacity-20 px-3 py-2 rounded-lg transition-all">
              👤 {user.username}
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-all"
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