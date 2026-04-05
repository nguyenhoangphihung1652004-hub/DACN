import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import AdminLayout from '../layouts/AdminLayout';

// Pages - Auth
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';

// Pages - User
import Dashboard from '../pages/Dashboard/Dashboard';
import ExplorePage from '../pages/Explore/ExplorePage';
import DeckList from '../pages/Deck/DeckList';
import DeckDetail from '../pages/Deck/DeckDetail';
import ReviewPage from '../pages/Review/ReviewPage';
import Profile from '../pages/Profile/Profile';
import NotFound from '../pages/NotFound';

// Pages - Admin
import AdminDashboard from '../pages/Admin/Dashboard';
import ManageUsers from '../pages/Admin/ManageUsers';
import ManageDecks from '../pages/Admin/ManageDecks';

// Bảo mật
import PrivateRoute from './PrivateRoute';

const AppRoutes = () => {
  return (
    <Routes>

      {/* ================= AUTH ================= */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* ================= USER ROUTES ================= */}
      <Route element={<PrivateRoute allowRoles={['user', 'admin']} />}>
        <Route path="/" element={<MainLayout />}>

          {/* Default */}
          <Route index element={<Navigate to="/dashboard" replace />} />

          {/* Core pages */}
          <Route path="dashboard" element={<Dashboard />} />

          {/* Discover (Explore) */}
          <Route path="explore" element={<ExplorePage />} />

          {/* Decks */}
          <Route path="decks" element={<DeckList />} />
          <Route path="decks/:id" element={<DeckDetail />} />

          {/* Learning */}
          <Route path="review" element={<ReviewPage />} />

          {/* Profile */}
          <Route path="profile" element={<Profile />} />

        </Route>
      </Route>

      {/* ================= ADMIN ROUTES ================= */}
      <Route element={<PrivateRoute allowRoles={['admin']} />}>
        <Route path="/admin" element={<AdminLayout />}>

          <Route index element={<AdminDashboard />} />

          <Route path="users" element={<ManageUsers />} />

          <Route path="decks" element={<ManageDecks />} />

        </Route>
      </Route>

      {/* ================= 404 ================= */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
};

export default AppRoutes;