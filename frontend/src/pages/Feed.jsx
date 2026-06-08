import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const Feed = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const { user, token } = useAuth()

  useEffect(() => {
    if (token && user) {
      fetchPosts()
    } else {
      setLoading(false)
    }
  }, [filter, token, user])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const url = filter === 'all' ? '/posts/feed' : `/posts/feed?type=${filter}`
      const { data } = await axios.get(url)
      setPosts(data.posts || [])
    } catch (error) {
      console.error('Feed error:', error)
      if (error.response?.status !== 404) {
        toast.error('Failed to load feed')
      }
      setPosts([])
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (postId) => {
    try {
      await axios.put(`/posts/${postId}/like`)
      fetchPosts()
    } catch (error) {
      toast.error('Failed to like post')
    }
  }

  const handleComment = async (postId, text) => {
    if (!text.trim()) return
    try {
      await axios.post(`/posts/${postId}/comment`, { text })
      fetchPosts()
      toast.success('Comment added!')
    } catch (error) {
      toast.error('Failed to add comment')
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="text-4xl mb-4">🌱</div>
          <div className="text-forest text-xl">Loading feed...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex gap-4 flex-wrap">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg transition-all ${filter === 'all' ? 'bg-forest text-white' : 'border-2 border-forest text-forest hover:bg-forest hover:text-white'}`}
        >
          All Posts
        </button>
        <button
          onClick={() => setFilter('issue')}
          className={`px-4 py-2 rounded-lg transition-all ${filter === 'issue' ? 'bg-forest text-white' : 'border-2 border-forest text-forest hover:bg-forest hover:text-white'}`}
        >
          ⚠️ Issues
        </button>
        <button
          onClick={() => setFilter('tree')}
          className={`px-4 py-2 rounded-lg transition-all ${filter === 'tree' ? 'bg-forest text-white' : 'border-2 border-forest text-forest hover:bg-forest hover:text-white'}`}
        >
          🌳 Trees
        </button>
      </div>

      {posts.length === 0 ? (
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">🌍</div>
          <h3 className="text-2xl font-semibold text-forest mb-2">No posts yet</h3>
          <p className="text-gray-600 mb-6">Be the first to report an issue or plant a tree!</p>
          <a href="/create" className="btn-primary inline-block">
            Create First Post
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post._id} className="card">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-2xl mr-2">{post.type === 'tree' ? '🌳' : '⚠️'}</span>
                  <span className="font-semibold text-forest">{post.username}</span>
                  <span className="text-gray-500 text-sm ml-2">📍 {post.location}</span>
                </div>
                <span className="text-sm text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString()}
                </span>
              </div>

              <h3 className="text-xl font-bold text-gray-800 mb-2">{post.title}</h3>
              <p className="text-gray-600 mb-4">{post.description}</p>

              {/* Photo Evidence */}
              {post.photoUrl && (
                <div className="mb-4">
                  <img 
                    src={post.photoUrl} 
                    alt="Evidence" 
                    className="rounded-lg max-h-96 w-full object-cover cursor-pointer"
                    onClick={() => window.open(post.photoUrl, '_blank')}
                  />
                  <p className="text-xs text-gray-500 mt-1">📸 Click to view full image (verification evidence)</p>
                </div>
              )}

              {post.interventionNeeded && post.type === 'issue' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <span className="text-red-600 font-semibold">⚠️ Intervention Needed: {post.interventionType}</span>
                  <p className="text-sm text-gray-600 mt-1">Status: {post.status}</p>
                </div>
              )}

              <div className="flex items-center gap-6 mb-4">
                <button
                  onClick={() => handleLike(post._id)}
                  className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors"
                >
                  ❤️ {post.likes?.length || 0} Likes
                </button>
                <span className="flex items-center gap-2 text-gray-600">
                  💬 {post.comments?.length || 0} Comments
                </span>
                <span className="flex items-center gap-2 text-forest font-semibold">
                  🌟 +{post.pointsAwarded} pts
                </span>
              </div>

              <div className="border-t pt-4">
                <form
                  onSubmit={(e) => {
                    e.preventDefault()
                    const input = e.target.elements.comment
                    handleComment(post._id, input.value)
                    input.value = ''
                  }}
                  className="flex gap-2"
                >
                  <input
                    name="comment"
                    type="text"
                    placeholder="Add a comment..."
                    className="input-field flex-1"
                  />
                  <button type="submit" className="btn-primary">
                    Post
                  </button>
                </form>

                {post.comments?.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {post.comments.slice(-3).map((comment, idx) => (
                      <div key={idx} className="bg-mint rounded-lg p-2">
                        <span className="font-semibold text-forest">{comment.username}</span>
                        <span className="text-gray-600 ml-2">{comment.text}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default Feed