import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const Profile = () => {
  const { id } = useParams()
  const { user: currentUser, token } = useAuth()
  const navigate = useNavigate()
  const [profile, setProfile] = useState(null)
  const [userPosts, setUserPosts] = useState([])
  const [loading, setLoading] = useState(true)

  // Use the ID from URL or fallback to current user's ID
  const userId = id || currentUser?.id

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }
    
    if (!userId) {
      console.error('No user ID available')
      toast.error('Unable to load profile')
      navigate('/')
      return
    }
    
    fetchProfile()
    fetchUserPosts()
  }, [userId, token])

  const fetchProfile = async () => {
    try {
      const { data } = await axios.get(`/users/${userId}`)
      if (data && data.user) {
        setProfile(data.user)
      } else {
        throw new Error('No user data received')
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error)
      if (error.response?.status === 404) {
        toast.error('User not found')
        navigate('/')
      } else {
        toast.error('Failed to load profile')
      }
    }
  }

  const fetchUserPosts = async () => {
    try {
      const { data } = await axios.get(`/posts/user/${userId}`)
      setUserPosts(data.posts || [])
    } catch (error) {
      console.error('Failed to fetch posts:', error)
      // Don't show error for posts, just set empty array
      setUserPosts([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="text-4xl mb-4">🌍</div>
          <div className="text-forest text-xl">Loading profile...</div>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="text-4xl mb-4">😕</div>
          <div className="text-red-500 text-xl">User not found</div>
          <button 
            onClick={() => navigate('/')}
            className="btn-primary mt-4"
          >
            Go to Feed
          </button>
        </div>
      </div>
    )
  }

  const isOwnProfile = currentUser?.id === userId

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card mb-8">
        <div className="text-center">
          <div className="text-6xl mb-4">🌍</div>
          <h1 className="text-3xl font-bold text-forest">{profile.username}</h1>
          <p className="text-gray-600 mt-2">📍 {profile.location || 'Location not set'}</p>
          <p className="text-gray-500 text-sm">
            Member since {profile.createdAt ? new Date(profile.createdAt).toLocaleDateString() : 'Recently'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="text-center p-4 bg-mint rounded-lg">
            <div className="text-3xl font-bold text-forest">{profile.points || 0}</div>
            <div className="text-gray-600 mt-1">Total Points</div>
          </div>
          <div className="text-center p-4 bg-mint rounded-lg">
            <div className="text-3xl font-bold text-forest">{profile.treesPlanted || 0}</div>
            <div className="text-gray-600 mt-1">Trees Planted</div>
          </div>
          <div className="text-center p-4 bg-mint rounded-lg">
            <div className="text-3xl font-bold text-forest">{profile.reportsMade || 0}</div>
            <div className="text-gray-600 mt-1">Issues Reported</div>
          </div>
        </div>

        {profile.badges && profile.badges.length > 0 && (
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
          {isOwnProfile ? 'Your Environmental Impact' : `${profile.username}'s Environmental Impact`}
        </h2>
        
        {userPosts.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">🌱</div>
            <p className="text-gray-600 text-lg">
              {isOwnProfile 
                ? "You haven't made any posts yet." 
                : `${profile.username} hasn't made any posts yet.`}
            </p>
            {isOwnProfile && (
              <button 
                onClick={() => navigate('/create')}
                className="btn-primary mt-4"
              >
                Create Your First Post
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {userPosts.map((post) => (
              <div key={post._id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{post.type === 'tree' ? '🌳' : '⚠️'}</span>
                  <span className="font-semibold text-forest text-lg">{post.title}</span>
                  <span className="text-gray-500 text-sm ml-auto">📍 {post.location}</span>
                </div>
                <p className="text-gray-600 mb-3">{post.description}</p>
                <div className="flex justify-between items-center text-sm">
                  <div className="text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-forest font-semibold">
                    +{post.pointsAwarded || 0} points
                  </div>
                </div>
                <div className="flex gap-4 mt-3 text-sm text-gray-500">
                  <span>❤️ {post.likes?.length || 0} likes</span>
                  <span>💬 {post.comments?.length || 0} comments</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile