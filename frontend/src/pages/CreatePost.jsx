import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'

const CreatePost = () => {
  const navigate = useNavigate()
  const [postType, setPostType] = useState('issue')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    coordinates: { lat: '', lng: '' },
    interventionNeeded: false,
    interventionType: 'cleanup'
  })
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleCoordinateChange = (e) => {
    setFormData({
      ...formData,
      coordinates: { ...formData.coordinates, [e.target.name]: parseFloat(e.target.value) || '' }
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const postData = {
        type: postType,
        ...formData,
        coordinates: {
          lat: formData.coordinates.lat || 0,
          lng: formData.coordinates.lng || 0
        }
      }

      await axios.post('/posts/create', postData)
      toast.success(postType === 'tree' ? '🌳 Tree planted! +50 points' : '⚠️ Issue reported! +20 points')
      navigate('/')
    } catch (error) {
      toast.error('Failed to create post')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <div className="text-center mb-8">
          <span className="text-5xl">{postType === 'tree' ? '🌳' : '⚠️'}</span>
          <h2 className="text-3xl font-bold text-forest mt-2">
            {postType === 'tree' ? 'Log Tree Planting' : 'Report Environmental Issue'}
          </h2>
          <p className="text-gray-600 mt-2">
            {postType === 'tree' ? 'Share your tree planting activity' : 'Document and report environmental problems'}
          </p>
        </div>

        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setPostType('issue')}
            className={`flex-1 py-2 rounded-lg ${postType === 'issue' ? 'btn-primary' : 'btn-secondary'}`}
          >
            ⚠️ Report Issue
          </button>
          <button
            onClick={() => setPostType('tree')}
            className={`flex-1 py-2 rounded-lg ${postType === 'tree' ? 'btn-primary' : 'btn-secondary'}`}
          >
            🌳 Plant Tree
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input-field"
              required
              placeholder="e.g., Plastic pollution in river"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="input-field"
              rows="4"
              required
              placeholder="Describe what you saw or did..."
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="input-field"
              required
              placeholder="e.g., Nairobi River, Karura Forest"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Latitude</label>
              <input
                type="number"
                name="lat"
                value={formData.coordinates.lat}
                onChange={handleCoordinateChange}
                className="input-field"
                step="any"
                placeholder="-1.2864"
              />
            </div>
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Longitude</label>
              <input
                type="number"
                name="lng"
                value={formData.coordinates.lng}
                onChange={handleCoordinateChange}
                className="input-field"
                step="any"
                placeholder="36.8172"
              />
            </div>
          </div>

          {postType === 'issue' && (
            <>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="interventionNeeded"
                  name="interventionNeeded"
                  checked={formData.interventionNeeded}
                  onChange={(e) => setFormData({ ...formData, interventionNeeded: e.target.checked })}
                  className="mr-2"
                />
                <label htmlFor="interventionNeeded" className="text-gray-700 font-semibold">
                  This issue needs intervention
                </label>
              </div>

              {formData.interventionNeeded && (
                <div>
                  <label className="block text-gray-700 font-semibold mb-2">Intervention Type</label>
                  <select
                    name="interventionType"
                    value={formData.interventionType}
                    onChange={handleChange}
                    className="input-field"
                  >
                    <option value="cleanup">Cleanup Required</option>
                    <option value="authorities">Notify Authorities</option>
                    <option value="volunteers">Need Volunteers</option>
                    <option value="funding">Funding Needed</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              )}
            </>
          )}

          <button type="submit" disabled={submitting} className="btn-primary w-full">
            {submitting ? 'Posting...' : postType === 'tree' ? '🌱 Plant Tree & Earn 50 Points' : '📢 Report Issue'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreatePost