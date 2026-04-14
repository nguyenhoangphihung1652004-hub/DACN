import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';

const Header = ({ handleLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-40 flex h-20 items-center justify-between px-8 bg-white/80 backdrop-blur-xl border-b border-slate-100">
      <div>
        <p className="text-[10px] font-black text-primary uppercase tracking-widest leading-none mb-1">Hệ thống</p>
        <h2 className="text-xl font-black text-slate-900 tracking-tight capitalize">
          {location.pathname.split('/').pop() || 'Tổng quan'}
        </h2>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-primary/10 hover:text-primary transition-all">
          <span className="material-symbols-outlined text-[24px]">notifications</span>
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary border-2 border-white rounded-full"></span>
        </button>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-3 p-1.5 pr-4 bg-slate-900 rounded-[1.25rem] text-white hover:bg-primary transition-all shadow-lg shadow-slate-200"
          >
            <div className="h-8 w-8 rounded-xl bg-white/20 flex items-center justify-center font-black text-xs">
              AD
            </div>
            <div className="text-left hidden sm:block">
              <p className="text-[10px] font-black uppercase tracking-tighter leading-none">Root Admin</p>
              <p className="text-[9px] font-bold text-emerald-400 uppercase tracking-widest mt-0.5 flex items-center gap-1">
                <span className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse"></span>
                Online
              </p>
            </div>
          </button>

          {open && (
            <div className="absolute right-0 mt-4 w-60 overflow-hidden rounded-4xl bg-white border border-slate-100 shadow-[0_20px_50px_rgba(0,0,0,0.1)] animate-in fade-in zoom-in-95 duration-200">
              <div className="p-5 border-b border-slate-50">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Tư cách</p>
                <p className="text-sm font-black text-slate-900">Quản trị tối cao</p>
              </div>
              <div className="p-2">
                <button 
                  onClick={() => { navigate('/dashboard'); setOpen(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-primary transition-all"
                >
                  <span className="material-symbols-outlined text-lg">person</span>
                  Về trang User
                </button>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-black text-red-500 hover:bg-red-50 transition-all"
                >
                  <span className="material-symbols-outlined text-lg">logout</span>
                  Thoát hệ thống
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;