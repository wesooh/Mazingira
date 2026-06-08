import { useState, useEffect } from 'react';
import api from '../api/client';

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/users/leaderboard')
      .then((res) => setUsers(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page leaderboard-page">
      <header className="page-header">
        <h1>Leaderboard</h1>
        <p>Top environmental champions. Only usernames and locations are shown — personal info stays private.</p>
      </header>

      {loading ? (
        <p className="loading">Loading...</p>
      ) : (
        <div className="leaderboard-table">
          <div className="lb-header">
            <span>Rank</span>
            <span>User</span>
            <span>Location</span>
            <span>Points</span>
            <span>Trees</span>
            <span>Reports</span>
          </div>
          {users.map((u, i) => (
            <div key={u.id} className={`lb-row ${i < 3 ? 'top-three' : ''}`}>
              <span className="rank">{i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : i + 1}</span>
              <span className="lb-user">
                <span className="avatar sm">{u.username[0].toUpperCase()}</span>
                {u.username}
              </span>
              <span>📍 {u.location}</span>
              <span className="points">{u.points}</span>
              <span>{u.treesPlanted}</span>
              <span>{u.reportsMade}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
