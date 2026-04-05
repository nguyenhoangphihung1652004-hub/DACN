import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { path: '/admin', label: 'Thống kê tổng quan', icon: '📊' },
    { path: '/admin/users', label: 'Quản lý người dùng', icon: '👤' },
    { path: '/admin/decks', label: 'Kiểm duyệt bộ thẻ', icon: '🗂️' },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Đã đăng xuất');
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* SIDEBAR FIXED */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col sticky top-0 h-screen">
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center font-bold text-xl">S</div>
          <span className="text-xl font-bold tracking-tight">SPACED <span className="text-primary text-sm uppercase">Admin</span></span>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 mt-4">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={item.path}
                to={item.path} 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <span className="text-lg">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all font-semibold"
          >
            <span>🚪</span> Đăng xuất
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 min-h-screen">
        {/* TOPBAR */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="text-sm text-slate-500 font-medium">
            Hệ thống / <span className="text-slate-800 font-bold capitalize">{location.pathname.split('/').pop() || 'Dashboard'}</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-800 leading-tight">Quản trị viên</p>
              <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest">Đang trực tuyến</p>
            </div>
            <div className="w-10 h-10 bg-slate-200 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-slate-600 font-bold">
              AD
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <div className="p-8 max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;