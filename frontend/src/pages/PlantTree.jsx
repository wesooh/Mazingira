import { useState, useEffect } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function PlantTree() {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({
    species: '',
    description: '',
    location: user?.location || '',
    latitude: '',
    longitude: '',
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [trees, setTrees] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/trees').then((res) => setTrees(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (user?.location) setForm((f) => ({ ...f, location: user.location }));
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      setError('Please take or upload a photo of your planted tree');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (v) formData.append(k, v);
      });
      formData.append('image', image);

      await api.post('/trees', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccess('Tree logged! +25 points earned. Shared to community feed.');
      setForm({ species: '', description: '', location: user?.location || '', latitude: '', longitude: '' });
      setImage(null);
      setPreview(null);
      const res = await api.get('/trees');
      setTrees(res.data);
      await refreshUser();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to log tree');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page tree-page">
      <header className="page-header">
        <h1>Tree Planting Tracker</h1>
        <p>Plant a tree, take a photo, and track your contribution to a greener environment.</p>
      </header>

      <div className="two-col">
        <form onSubmit={handleSubmit} className="action-card">
          <h2>Log a Tree</h2>

          <label>
            Tree species
            <input name="species" value={form.species} onChange={handleChange} placeholder="e.g. Acacia, Mango" />
          </label>

          <label>
            Notes
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Where you planted it, why, community involved..."
            />
          </label>

          <label>
            Location <span className="public-tag">(public)</span>
            <input name="location" value={form.location} onChange={handleChange} required placeholder="Area, city" />
          </label>

          <div className="form-row">
            <label>
              Latitude (optional)
              <input name="latitude" value={form.latitude} onChange={handleChange} placeholder="-1.2921" />
            </label>
            <label>
              Longitude (optional)
              <input name="longitude" value={form.longitude} onChange={handleChange} placeholder="36.8219" />
            </label>
          </div>

          <label className="file-upload">
            Photo of planted tree (required)
            <input type="file" accept="image/*" capture="environment" onChange={handleImage} required />
          </label>

          {preview && <img src={preview} alt="Preview" className="image-preview" />}

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <button type="submit" className="btn btn-primary btn-full" disabled={submitting}>
            {submitting ? 'Uploading...' : 'Log Tree (+25 pts)'}
          </button>
        </form>

        <section className="list-card">
          <h2>Trees Planted</h2>
          <p className="stat-highlight">{trees.length} trees logged by the community</p>
          {trees.length === 0 ? (
            <p className="empty">No trees logged yet. Plant the first one!</p>
          ) : (
            <div className="mini-list">
              {trees.slice(0, 10).map((t) => (
                <div key={t.id} className="mini-item">
                  {t.image && <img src={t.image} alt="" className="mini-thumb" />}
                  <div>
                    <strong>🌳 {t.species}</strong>
                    <span className="mini-meta">📍 {t.location}</span>
                    <span className="mini-meta">by {t.planter?.username}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
