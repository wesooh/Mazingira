import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Feed from './pages/Feed';
import ReportIssue from './pages/ReportIssue';
import PlantTree from './pages/PlantTree';
import Impact from './pages/Impact';
import Leaderboard from './pages/Leaderboard';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <p className="loading page">Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function PublicOnlyRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <p className="loading page">Loading...</p>;
  if (user) return <Navigate to="/" replace />;
  return children;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <Layout>
      <Routes>
        <Route path="/" element={user ? <Feed /> : <Landing />} />
        <Route path="/login" element={<PublicOnlyRoute><Login /></PublicOnlyRoute>} />
        <Route path="/register" element={<PublicOnlyRoute><Register /></PublicOnlyRoute>} />
        <Route path="/report" element={<ProtectedRoute><ReportIssue /></ProtectedRoute>} />
        <Route path="/plant" element={<ProtectedRoute><PlantTree /></ProtectedRoute>} />
        <Route path="/impact" element={<ProtectedRoute><Impact /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Routes>
    </Layout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
