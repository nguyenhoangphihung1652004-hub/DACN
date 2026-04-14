import { Outlet, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Sidebar from '../components/layout/admin/Sidebar';
import Header from '../components/layout/admin/Header';
import Footer from '../components/layout/admin/Footer';

const AdminLayout = () => {
  const navigate = useNavigate();

  const menuItems = [
    { path: '/admin', label: 'Tổng quan', icon: 'grid_view' },
    { path: '/admin/users', label: 'Người dùng', icon: 'group' },
    { path: '/admin/decks', label: 'Bộ thẻ', icon: 'layers' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Hẹn gặp lại, Admin! 👋');
    navigate('/login');
  };

  return (
    <div className="bg-slate-50 min-h-screen flex">
      <Sidebar menuItems={menuItems} handleLogout={handleLogout} />

      <main className="flex min-h-screen flex-1 flex-col md:ml-64 transition-all duration-300">
        <Header handleLogout={handleLogout} />

        <div className="flex-1 p-8">
          <div className="mx-auto w-full max-w-7xl">
            <Outlet />
          </div>
        </div>

        <Footer />
      </main>
    </div>
  );
};

export default AdminLayout;