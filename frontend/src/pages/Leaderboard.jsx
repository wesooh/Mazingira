import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'

const Leaderboard = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const fetchLeaderboard = async () => {
    try {
      const { data } = await axios.get('/users/leaderboard/top')
      setUsers(data.leaderboard)
    } catch (error) {
      toast.error('Failed to load leaderboard')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center text-forest text-xl">Loading leaderboard... 🏆</div>
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="card">
        <div className="text-center mb-8">
          <span className="text-6xl">🏆</span>
          <h1 className="text-3xl font-bold text-forest mt-4">Environmental Champions</h1>
          <p className="text-gray-600 mt-2">Top 10 eco-warriors by points</p>
        </div>

        <div className="space-y-3">
          {users.map((user, index) => (
            <Link to={`/profile/${user._id}`} key={user._id}>
              <div className="flex items-center justify-between p-4 bg-mint rounded-lg hover:bg-leaf transition-colors cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="text-3xl font-bold text-forest w-12">
                    #{index + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">{user.username}</div>
                    <div className="text-sm text-gray-600">📍 {user.location}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-forest">{user.points}</div>
                  <div className="text-sm text-gray-600">
                    🌳 {user.treesPlanted} trees • ⚠️ {user.reportsMade} reports
                  </div>
                </div>
              </div>
            </Link>
          ))}

          {users.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">No users yet. Be the first eco-warrior! 🌱</p>
            </div>
          )}
        </div>

        <div className="mt-8 p-4 bg-forest bg-opacity-10 rounded-lg">
          <h3 className="font-semibold text-forest mb-2">💚 How to Earn Points</h3>
          <ul className="text-sm text-gray-700 space-y-1">
            <li>🌳 Plant a tree: +50 points</li>
            <li>⚠️ Report an issue: +20 points</li>
            <li>🚨 Report issue needing intervention: +30 points</li>
            <li>🏅 Earn badges for milestones</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Leaderboard