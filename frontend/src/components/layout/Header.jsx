import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);

  // 👉 Handle click outside
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
              className="flex items-center gap-2"
            >
              <div className="w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center font-semibold cursor-pointer">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow-lg z-50">
                <button
                  onClick={() => {
                    navigate('/profile');
                    setOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-slate-100 text-sm"
                >
                  👤 Profile
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 hover:bg-slate-100 text-sm text-red-500"
                >
                  🚪 Đăng xuất
                </button>
              </div>
            )}
          </div>

        </nav>
      </div>
    </header>
  );
};

export default Header;