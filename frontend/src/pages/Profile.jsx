import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const Profile = () => {
  const { id } = useParams()
  const { user: currentUser } = useAuth()
  const [profile, setProfile] = useState(null)
  const [userPosts, setUserPosts] = useState([])
  const [loading, setLoading] = useState(true)

  const userId = id || currentUser?.id

  useEffect(() => {
    fetchProfile()
    fetchUserPosts()
  }, [userId])

  const fetchProfile = async () => {
    try {
      const { data } = await axios.get(`/users/${userId}`)
      setProfile(data.user)
    } catch (error) {
      toast.error('Failed to load profile')
    }
  }

  const fetchUserPosts = async () => {
    try {
      const { data } = await axios.get(`/posts/user/${userId}`)
      setUserPosts(data.posts)
    } catch (error) {
      toast.error('Failed to load posts')
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="text-center text-forest text-xl">Loading profile... 🌿</div>
  if (!profile) return <div className="text-center text-red-500">User not found</div>

  const isOwnProfile = currentUser?.id === userId

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card mb-8">
        <div className="text-center">
          <div className="text-6xl mb-4">🌍</div>
          <h1 className="text-3xl font-bold text-forest">{profile.username}</h1>
          <p className="text-gray-600 mt-2">📍 {profile.location}</p>
          <p className="text-gray-500 text-sm">Member since {new Date(profile.createdAt).toLocaleDateString()}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="text-center">
            <div className="text-3xl font-bold text-forest">{profile.points}</div>
            <div className="text-gray-600">Total Points</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-forest">{profile.treesPlanted}</div>
            <div className="text-gray-600">Trees Planted</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-forest">{profile.reportsMade}</div>
            <div className="text-gray-600">Issues Reported</div>
          </div>
        </div>

        {profile.badges?.length > 0 && (
          <div className="mt-6">
            <h3 className="font-semibold text-gray-700 mb-3">🏅 Badges Earned</h3>
            <div className="flex flex-wrap gap-2">
              {profile.badges.map((badge, idx) => (
                <span key={idx} className="bg-forest text-white px-3 py-1 rounded-full text-sm">
                  {badge}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold text-forest mb-4">
          {isOwnProfile ? 'Your Activity' : `${profile.username}'s Activity`}
        </h2>
        <div className="space-y-4">
          {userPosts.map((post) => (
            <div key={post._id} className="card">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xl">{post.type === 'tree' ? '🌳' : '⚠️'}</span>
                <span className="font-semibold text-forest">{post.title}</span>
                <span className="text-gray-500 text-sm">{post.location}</span>
              </div>
              <p className="text-gray-600">{post.description}</p>
              <div className="mt-2 text-sm text-gray-500">
                {new Date(post.createdAt).toLocaleDateString()} • +{post.pointsAwarded} points
              </div>
            </div>
          ))}
          {userPosts.length === 0 && (
            <p className="text-center text-gray-500">No activity yet. Start posting! 🌱</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Profile