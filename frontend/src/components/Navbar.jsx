import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const links = [
  { to: '/', label: 'Feed' },
  { to: '/report', label: 'Report Issue' },
  { to: '/plant', label: 'Plant Tree' },
  { to: '/impact', label: 'My Impact' },
  { to: '/leaderboard', label: 'Leaderboard' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        <span className="brand-icon">🌍</span>
        Mazingira
      </Link>

      {user && (
        <div className="navbar-links">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={location.pathname === link.to ? 'nav-link active' : 'nav-link'}
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}

      <div className="navbar-actions">
        {user ? (
          <>
            <span className="user-badge">
              {user.username} · {user.points} pts
            </span>
            <button type="button" onClick={logout} className="btn btn-outline">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-outline">
              Login
            </Link>
            <Link to="/register" className="btn btn-primary">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
