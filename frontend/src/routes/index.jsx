import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import AdminLayout from '../layouts/AdminLayout'; // Layout mới cho Admin

// Pages - User
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';
import Dashboard from '../pages/Dashboard/Dashboard';
import DeckList from '../pages/Deck/DeckList';
import DeckDetail from '../pages/Deck/DeckDetail';
import ReviewPage from '../pages/Review/ReviewPage';
import Profile from '../pages/Profile/Profile';
import NotFound from '../pages/NotFound';

// Pages - Admin (Bạn cần tạo folder src/pages/Admin)
import AdminDashboard from '../pages/Admin/Dashboard';
import ManageUsers from '../pages/Admin/ManageUsers';
import ManageDecks from '../pages/Admin/ManageDecks';

// Bảo mật
import PrivateRoute from './PrivateRoute';

const AppRoutes = () => {
  return (
    <Routes>
      {/* ================= PUBLIC ROUTES (Không cần đăng nhập) ================= */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      {/* ================= USER & ADMIN ROUTES (Cần đăng nhập) ================= */}
      {/* Cho phép cả 'user' và 'admin' truy cập các trang học tập thông thường */}
      <Route element={<PrivateRoute allowRoles={['user', 'admin']} />}>
        <Route path="/" element={<MainLayout />}>
          {/* Điều hướng mặc định "/" -> "/dashboard" */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          
          <Route path="dashboard" element={<Dashboard />} />
          
          {/* Quản lý bộ thẻ cá nhân */}
          <Route path="decks" element={<DeckList />} />
          <Route path="decks/:id" element={<DeckDetail />} />

          {/* Ôn tập thẻ */}
          <Route path="review" element={<ReviewPage />} />
          
          {/* Trang cá nhân */}
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>

      {/* ================= ADMIN ONLY ROUTES (Chỉ Admin mới vào được) ================= */}
      <Route element={<PrivateRoute allowRoles={['admin']} />}>
        <Route path="/admin" element={<AdminLayout />}>
          {/* Trang thống kê tổng quan của Admin */}
          <Route index element={<AdminDashboard />} />
          
          {/* Quản lý người dùng hệ thống */}
          <Route path="users" element={<ManageUsers />} />
          
          {/* Kiểm duyệt tất cả bộ thẻ hệ thống */}
          <Route path="decks" element={<ManageDecks />} />
        </Route>
      </Route>

      {/* ================= 404 NOT FOUND ================= */}
      <Route path="*" element={<NotFound />} />

    </Routes>
  );
};

export default AppRoutes;