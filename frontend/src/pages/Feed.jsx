import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

const Feed = () => {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const { user } = useAuth()

  useEffect(() => {
    fetchPosts()
  }, [filter])

  const fetchPosts = async () => {
    try {
      const url = filter === 'all' ? '/posts/feed' : `/posts/feed?type=${filter}`
      const { data } = await axios.get(url)
      setPosts(data.posts)
    } catch (error) {
      toast.error('Failed to load feed')
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (postId) => {
    try {
      const { data } = await axios.put(`/posts/${postId}/like`)
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
    return <div className="text-center text-forest text-xl">Loading feed... 🌿</div>
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex gap-4">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg ${filter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
        >
          All Posts
        </button>
        <button
          onClick={() => setFilter('issue')}
          className={`px-4 py-2 rounded-lg ${filter === 'issue' ? 'btn-primary' : 'btn-secondary'}`}
        >
          ⚠️ Issues
        </button>
        <button
          onClick={() => setFilter('tree')}
          className={`px-4 py-2 rounded-lg ${filter === 'tree' ? 'btn-primary' : 'btn-secondary'}`}
        >
          🌳 Trees
        </button>
      </div>

      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post._id} className="card">
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="text-2xl mr-2">{post.type === 'tree' ? '🌳' : '⚠️'}</span>
                <span className="font-semibold text-forest">{post.username}</span>
                <span className="text-gray-500 text-sm ml-2">{post.location}</span>
              </div>
              <span className="text-sm text-gray-500">
                {new Date(post.createdAt).toLocaleDateString()}
              </span>
            </div>

            <h3 className="text-xl font-bold text-gray-800 mb-2">{post.title}</h3>
            <p className="text-gray-600 mb-4">{post.description}</p>

            {post.photoUrl && (
              <img src={post.photoUrl} alt="Post" className="rounded-lg mb-4 max-h-96 w-full object-cover" />
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

        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No posts yet. Be the first to create one! 🌱</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Feed