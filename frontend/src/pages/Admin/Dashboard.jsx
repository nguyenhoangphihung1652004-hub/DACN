import { useEffect, useState } from 'react';
import Loading from '../../components/common/Loading';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDecks: 0,
    totalCards: 0,
    activeToday: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Giả lập gọi API
        await new Promise((resolve) => setTimeout(resolve, 800));
        setStats({
          totalUsers: 1250,
          totalDecks: 450,
          totalCards: 8900,
          activeToday: 85,
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      label: 'Tổng người dùng',
      value: stats.totalUsers,
      emoji: '👥',
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
      hoverBorder: 'hover:border-indigo-200',
      shadow: 'hover:shadow-indigo-500/5',
      symbol: 'U'
    },
    {
      label: 'Bộ thẻ công khai',
      value: stats.totalDecks,
      emoji: '🗂️',
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
      hoverBorder: 'hover:border-emerald-200',
      shadow: 'hover:shadow-emerald-500/5',
      symbol: 'D'
    },
    {
      label: 'Thẻ học tạo mới',
      value: stats.totalCards,
      emoji: '🃏',
      color: 'text-amber-600',
      bg: 'bg-amber-50',
      hoverBorder: 'hover:border-amber-200',
      shadow: 'hover:shadow-amber-500/5',
      symbol: 'C'
    },
    {
      label: 'Đang online',
      value: stats.activeToday,
      emoji: '🔥',
      color: 'text-rose-600',
      bg: 'bg-rose-50',
      hoverBorder: 'hover:border-rose-200',
      shadow: 'hover:shadow-rose-500/5',
      symbol: '!'
    },
  ];

  if (loading) return <Loading />;

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      
      {/* HEADER SECTION */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-slate-100 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-slate-50 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Quản trị hệ thống
          </h1>
          <p className="text-slate-500 font-medium mt-2">
            Theo dõi hiệu suất và tăng trưởng của cộng đồng học thuật
          </p>
        </div>

        <div className="flex gap-3 relative z-10">
            <button className="px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-primary transition-all shadow-xl shadow-slate-200 active:scale-95">
                Xuất báo cáo
            </button>
        </div>
      </header>

      {/* STATS GRID - BENTO STYLE */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((item, index) => (
          <div
            key={index}
            className={`group bg-white p-8 rounded-4xl border border-slate-100 shadow-sm transition-all duration-500 cursor-default relative overflow-hidden ${item.hoverBorder} ${item.shadow} hover:-translate-y-1`}
          >
            <div className="flex items-center justify-between relative z-10">
              <p className={`text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 group-hover:${item.color} transition-colors`}>
                {item.label}
              </p>
              <span className={`p-3 rounded-2xl text-2xl ${item.bg} transition-colors`}>
                {item.emoji}
              </span>
            </div>
            
            <h3 className="text-4xl font-black text-slate-900 mt-6 relative z-10">
              {item.value.toLocaleString()}
            </h3>

            {/* Decorative background letter */}
            <div className={`absolute -right-4 -bottom-6 text-slate-500/5 text-[100px] font-black rotate-12 group-hover:rotate-0 transition-all duration-500 pointer-events-none`}>
              {item.symbol}
            </div>
          </div>
        ))}
      </div>

      {/* SYSTEM STATUS & ACTIVITY */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* RECENT MONITORING */}
        <div className="lg:col-span-7 bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="font-black text-slate-900 text-xl tracking-tight">Nhật ký hệ thống</h3>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-1">Real-time Monitoring</p>
            </div>
            <div className="h-12 w-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-xl shadow-inner animate-pulse">🛰️</div>
          </div>

          <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-50 rounded-4xl bg-slate-50/30">
            <div className="text-5xl mb-4 opacity-20 grayscale">⚙️</div>
            <p className="text-slate-400 font-black text-xs uppercase tracking-widest">Đang kết nối dữ liệu...</p>
            <p className="text-slate-300 text-xs mt-2 italic">Tất cả các dịch vụ đang hoạt động bình thường.</p>
          </div>
        </div>

        {/* QUICK ACTIONS / INFO */}
        <div className="lg:col-span-5 bg-slate-900 rounded-[2.5rem] p-10 text-white shadow-2xl relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
            
            <div className="relative z-10">
                <h3 className="text-2xl font-black tracking-tight mb-4">Thông báo Admin</h3>
                <div className="space-y-4">
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                        <p className="text-sm font-bold text-primary-light">Bản cập nhật v2.4.0</p>
                        <p className="text-xs text-slate-400 mt-1">Hệ thống sẽ bảo trì vào lúc 02:00 AM ngày mai.</p>
                    </div>
                    <div className="p-4 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                        <p className="text-sm font-bold text-emerald-400">Tốc độ phản hồi</p>
                        <p className="text-xs text-slate-400 mt-1">Hiện tại: 120ms (Rất tốt)</p>
                    </div>
                </div>
            </div>

            <button className="relative z-10 w-full mt-8 bg-white text-slate-900 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all active:scale-95">
                Quản lý phân quyền
            </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;