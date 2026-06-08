import { useState, useEffect } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';

export default function Impact() {
  const { user } = useAuth();
  const [personal, setPersonal] = useState(null);
  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/impact/me'), api.get('/impact/community')])
      .then(([me, comm]) => {
        setPersonal(me.data);
        setCommunity(comm.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="loading page">Loading impact data...</p>;

  return (
    <div className="page impact-page">
      <header className="page-header">
        <h1>Track Your Impact</h1>
        <p>See how your actions contribute to environmental change in your community.</p>
      </header>

      <section className="impact-grid">
        <div className="impact-card highlight">
          <span className="impact-icon">⭐</span>
          <h3>{personal?.points || 0}</h3>
          <p>Your Points</p>
        </div>
        <div className="impact-card">
          <span className="impact-icon">🌳</span>
          <h3>{personal?.treesPlanted || 0}</h3>
          <p>Trees Planted</p>
        </div>
        <div className="impact-card">
          <span className="impact-icon">🚨</span>
          <h3>{personal?.reportsMade || 0}</h3>
          <p>Issues Reported</p>
        </div>
        <div className="impact-card">
          <span className="impact-icon">💬</span>
          <h3>{personal?.myPosts || 0}</h3>
          <p>Feed Posts</p>
        </div>
      </section>

      {personal?.badges?.length > 0 && (
        <section className="badges-section">
          <h2>Your Badges</h2>
          <div className="badges-row">
            {personal.badges.map((b) => (
              <span key={b} className="badge badge-large">{b}</span>
            ))}
          </div>
        </section>
      )}

      <section className="community-impact">
        <h2>Community Impact</h2>
        <div className="impact-grid">
          <div className="impact-card">
            <h3>{community?.totalUsers || 0}</h3>
            <p>Active Members</p>
          </div>
          <div className="impact-card">
            <h3>{community?.totalTrees || 0}</h3>
            <p>Total Trees</p>
          </div>
          <div className="impact-card">
            <h3>{community?.totalReports || 0}</h3>
            <p>Total Reports</p>
          </div>
          <div className="impact-card">
            <h3>{community?.openReports || 0}</h3>
            <p>Open Issues</p>
          </div>
        </div>
      </section>

      <section className="points-guide">
        <h2>How to Earn Points</h2>
        <ul>
          <li>Post on the community feed — <strong>+5 pts</strong></li>
          <li>Report an environmental issue with photo — <strong>+10 pts</strong></li>
          <li>Plant and log a tree with photo — <strong>+25 pts</strong></li>
        </ul>
        <h3>Badge Milestones</h3>
        <ul>
          <li>Eco-Warrior — 100+ points</li>
          <li>Tree Planter — 5+ trees</li>
          <li>Issue Reporter — 3+ reports</li>
          <li>Green Guardian — all milestones achieved</li>
        </ul>
      </section>
    </div>
  );
}
