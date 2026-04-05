import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom'; // Thêm useLocation
import { useAuth } from '../../hooks/useAuth';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Lấy URL hiện tại để kiểm tra đang ở đâu
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);

  // Kiểm tra xem có đang ở các trang quản trị không
  const isAdminPath = location.pathname.startsWith('/admin');

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-slate-200">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <nav className="flex items-center justify-between">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <img
              src="/icons/Logo.png"
              alt="Logo"
              className="h-8 w-auto object-contain"
            />
          </Link>

          {/* Menu */}
          <div className="flex items-center gap-6 text-sm text-slate-600">
            <Link to="/" className="hover:text-primary transition">
              Dashboard
            </Link>
            <Link to="/decks" className="hover:text-primary transition">
              Bộ thẻ
            </Link>
            <Link to="/review" className="hover:text-primary transition">
              Ôn tập
            </Link>
          </div>

          {/* Avatar Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center gap-2 focus:outline-none"
            >
              <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-semibold cursor-pointer border-2 border-transparent hover:border-primary/20 transition-all">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-xl z-50 py-1 overflow-hidden">
                {/* Thông tin user cơ bản */}
                <div className="px-4 py-2 border-b border-slate-50 mb-1">
                  <p className="text-xs text-slate-400">Tài khoản</p>
                  <p className="text-sm font-bold text-slate-700 truncate">{user?.name}</p>
                </div>

                <button
                  onClick={() => {
                    navigate('/profile');
                    setOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-50 text-sm text-slate-600 transition"
                >
                  👤 Trang cá nhân
                </button>

                {/* NÚT CHUYỂN ĐỔI ADMIN <-> USER */}
                {user?.role === 'admin' && (
                  isAdminPath ? (
                    <button
                      onClick={() => {
                        navigate('/dashboard');
                        setOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-primary/5 text-sm text-primary font-medium transition"
                    >
                      🚀 Về trang người dùng
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        navigate('/admin');
                        setOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-indigo-50 text-sm text-indigo-600 font-medium transition"
                    >
                      🛡️ Quản trị hệ thống
                    </button>
                  )
                )}

                <div className="border-t border-slate-50 mt-1 pt-1">
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-red-50 text-sm text-red-500 transition"
                  >
                    🚪 Đăng xuất
                  </button>
                </div>
              </div>
            )}
          </div>

        </nav>
      </div>
    </header>
  );
};

export default Header;