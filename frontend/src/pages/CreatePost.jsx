import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'

const CreatePost = () => {
  const navigate = useNavigate()
  const [postType, setPostType] = useState('issue')
  const [photo, setPhoto] = useState(null)
  const [photoPreview, setPhotoPreview] = useState(null)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    coordinates: { lat: '', lng: '' },
    interventionNeeded: false,
    interventionType: 'cleanup'
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleCoordinateChange = (e) => {
    setFormData({
      ...formData,
      coordinates: { ...formData.coordinates, [e.target.name]: parseFloat(e.target.value) || '' }
    })
  }

  const handlePhotoCapture = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Photo must be less than 5MB')
        return
      }
      setPhoto(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleUseCamera = () => {
    // Create camera input for mobile devices
    const cameraInput = document.createElement('input')
    cameraInput.type = 'file'
    cameraInput.accept = 'image/*'
    cameraInput.capture = 'environment' // 'user' for front camera, 'environment' for back
    cameraInput.onchange = handlePhotoCapture
    cameraInput.click()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!photo) {
      toast.error('Please take a photo to verify your action')
      return
    }

    setUploading(true)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append('type', postType)
      formDataToSend.append('title', formData.title)
      formDataToSend.append('description', formData.description)
      formDataToSend.append('location', formData.location)
      formDataToSend.append('coordinates', JSON.stringify(formData.coordinates))
      formDataToSend.append('interventionNeeded', formData.interventionNeeded)
      formDataToSend.append('interventionType', formData.interventionType)
      formDataToSend.append('photo', photo)

      const { data } = await axios.post('/posts/create', formDataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      
      toast.success(data.message || (postType === 'tree' ? '🌳 Tree planting verified! +50 points' : '⚠️ Issue reported with evidence! +20 points'))
      navigate('/')
    } catch (error) {
      console.error('Create post error:', error)
      toast.error(error.response?.data?.message || 'Failed to create post')
    } finally {
      setUploading(false)
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
            {postType === 'tree' 
              ? 'Take a photo of your planted tree to earn points' 
              : 'Take a photo of the issue as evidence'}
          </p>
          <p className="text-red-600 text-sm mt-1">
            📸 Photo verification is required to prevent fake reports
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
          {/* Photo Upload Section */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
            <label className="block text-gray-700 font-semibold mb-2">
              {postType === 'tree' ? 'Tree Planting Photo *' : 'Issue Evidence Photo *'}
            </label>
            
            {photoPreview ? (
              <div className="relative">
                <img src={photoPreview} alt="Preview" className="rounded-lg max-h-64 w-full object-cover" />
                <button
                  type="button"
                  onClick={() => {
                    setPhoto(null)
                    setPhotoPreview(null)
                    if (fileInputRef.current) fileInputRef.current.value = ''
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoCapture}
                  className="hidden"
                  id="photo-upload"
                />
                <button
                  type="button"
                  onClick={() => document.getElementById('photo-upload').click()}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  📁 Upload from Gallery
                </button>
                <button
                  type="button"
                  onClick={handleUseCamera}
                  className="w-full bg-forest text-white py-3 rounded-lg hover:bg-light-green transition-colors"
                >
                  📸 Take Photo with Camera
                </button>
              </div>
            )}
            <p className="text-xs text-gray-500 mt-2">
              Accepted formats: JPG, PNG, GIF (Max 5MB). Photos help verify real environmental action.
            </p>
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input-field"
              required
              placeholder={postType === 'tree' ? "e.g., Planted 5 indigenous trees" : "e.g., Plastic pollution in river"}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="input-field"
              rows="4"
              required
              placeholder={postType === 'tree' 
                ? "Describe what trees you planted and where..." 
                : "Describe the environmental issue in detail..."}
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2">Location *</label>
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
              <label className="block text-gray-700 font-semibold mb-2">Latitude (optional)</label>
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
              <label className="block text-gray-700 font-semibold mb-2">Longitude (optional)</label>
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
                  This issue needs intervention (cleanup, authorities, etc.)
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

          <button 
            type="submit" 
            disabled={uploading || !photo} 
            className="btn-primary w-full disabled:opacity-50"
          >
            {uploading ? (
              'Uploading Photo... 📸'
            ) : postType === 'tree' ? (
              '🌱 Verify & Earn 50 Points'
            ) : (
              '📢 Submit Report with Evidence'
            )}
          </button>
        </form>

        <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
          <div className="flex items-start gap-2">
            <span className="text-yellow-600 text-xl">⚠️</span>
            <div className="text-sm text-gray-700">
              <p className="font-semibold">Why photo verification?</p>
              <p>Photos help prevent fake reports and ensure real environmental action. All photos are reviewed for authenticity.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CreatePost