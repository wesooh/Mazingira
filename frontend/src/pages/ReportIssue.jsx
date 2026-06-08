import { useState, useEffect } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function ReportIssue() {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: user?.location || '',
    latitude: '',
    longitude: '',
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [reports, setReports] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/reports').then((res) => setReports(res.data)).catch(() => {});
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
      setError('Please take or upload a photo of the issue');
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

      await api.post('/reports', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSuccess('Report submitted! +10 points earned. Shared to community feed.');
      setForm({ title: '', description: '', location: user?.location || '', latitude: '', longitude: '' });
      setImage(null);
      setPreview(null);
      const res = await api.get('/reports');
      setReports(res.data);
      await refreshUser();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit report');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page report-page">
      <header className="page-header">
        <h1>Report Environmental Issue</h1>
        <p>See litter or pollution? Take a photo, add the location, and call for intervention.</p>
      </header>

      <div className="two-col">
        <form onSubmit={handleSubmit} className="action-card">
          <h2>Submit a Report</h2>

          <label>
            Issue title
            <input name="title" value={form.title} onChange={handleChange} required placeholder="e.g. Plastic waste on roadside" />
          </label>

          <label>
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              rows={4}
              placeholder="Describe the issue and what intervention is needed..."
            />
          </label>

          <label>
            Location <span className="public-tag">(public)</span>
            <input name="location" value={form.location} onChange={handleChange} required placeholder="Street, area, city" />
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
            Photo evidence (required)
            <input type="file" accept="image/*" capture="environment" onChange={handleImage} required />
          </label>

          {preview && <img src={preview} alt="Preview" className="image-preview" />}

          {error && <div className="alert alert-error">{error}</div>}
          {success && <div className="alert alert-success">{success}</div>}

          <button type="submit" className="btn btn-primary btn-full" disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Report (+10 pts)'}
          </button>
        </form>

        <section className="list-card">
          <h2>Recent Reports</h2>
          {reports.length === 0 ? (
            <p className="empty">No reports yet.</p>
          ) : (
            <div className="mini-list">
              {reports.slice(0, 10).map((r) => (
                <div key={r.id} className="mini-item">
                  {r.image && <img src={r.image} alt="" className="mini-thumb" />}
                  <div>
                    <strong>{r.title}</strong>
                    <span className="mini-meta">📍 {r.location}</span>
                    <span className={`status status-${r.status}`}>{r.status}</span>
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
