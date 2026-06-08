import { useState, useEffect } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import PostCard from '../components/PostCard';

export default function Feed() {
  const { user, refreshUser } = useAuth();
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');
  const [location, setLocation] = useState(user?.location || '');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const fetchPosts = async () => {
    try {
      const res = await api.get('/posts');
      setPosts(res.data);
    } catch {
      setError('Failed to load feed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    if (user?.location) setLocation(user.location);
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() || !location.trim()) return;

    setSubmitting(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('content', content);
      formData.append('location', location);
      if (image) formData.append('image', image);

      await api.post('/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setContent('');
      setImage(null);
      await fetchPosts();
      await refreshUser();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="page feed-page">
      <header className="page-header">
        <h1>Community Feed</h1>
        <p>See environmental actions from people in your community. Locations are public; personal info is hidden.</p>
      </header>

      <form onSubmit={handleSubmit} className="compose-card">
        <h2>Share an update</h2>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What's happening in your environment? Call for intervention, share news..."
          rows={3}
          required
        />
        <div className="form-row">
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location (visible to all)"
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? 'Posting...' : 'Post (+5 pts)'}
        </button>
      </form>

      <section className="feed-list">
        {loading ? (
          <p className="loading">Loading feed...</p>
        ) : posts.length === 0 ? (
          <div className="empty-state">
            <p>No posts yet. Be the first to share!</p>
          </div>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} />)
        )}
      </section>
    </div>
  );
}
