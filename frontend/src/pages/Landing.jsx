import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="landing-page">
      <section className="hero">
        <span className="hero-icon">🌍</span>
        <h1>Mazingira</h1>
        <p className="hero-tagline">
          A social platform for environmental action. Report issues, plant trees, earn points, and track your impact — together.
        </p>
        <div className="hero-actions">
          <Link to="/register" className="btn btn-primary btn-lg">Get Started</Link>
          <Link to="/login" className="btn btn-outline btn-lg">Sign In</Link>
        </div>
      </section>

      <section className="features">
        <div className="feature-card">
          <span>🚨</span>
          <h3>Report Issues</h3>
          <p>See litter or pollution? Snap a photo, mark the location, and call for intervention.</p>
        </div>
        <div className="feature-card">
          <span>🌳</span>
          <h3>Plant Trees</h3>
          <p>Log every tree you plant with a photo and location. Build a greener community.</p>
        </div>
        <div className="feature-card">
          <span>⭐</span>
          <h3>Earn Points</h3>
          <p>Get recognized for every action. Climb the leaderboard and earn badges.</p>
        </div>
        <div className="feature-card">
          <span>📍</span>
          <h3>Location-First</h3>
          <p>Your location is visible to help coordinate action. Personal details stay private.</p>
        </div>
      </section>

      <section className="journey">
        <h2>Simple User Journey</h2>
        <ol>
          <li>Sign up with your location</li>
          <li>See litter → Take photo → Submit report</li>
          <li>Plant a tree → Take photo → Upload</li>
          <li>Earn points and badges</li>
          <li>Track your impact on the community feed</li>
        </ol>
      </section>
    </div>
  );
}
