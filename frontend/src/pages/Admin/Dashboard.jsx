import { useEffect, useState } from 'react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDecks: 0,
    totalCards: 0,
    activeToday: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Sau này có API thật thì dùng dòng này:
        // const res = await adminApi.getStats();
        // setStats(res);

        // HIỆN TẠI: Dùng dữ liệu mẫu để test giao diện
        setStats({
          totalUsers: 1250,
          totalDecks: 450,
          totalCards: 8900,
          activeToday: 85
        });
      } catch (error) {
        console.error("Lỗi fetch stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { label: 'Tổng người dùng', value: stats.totalUsers, icon: '👥', color: 'bg-blue-500' },
    { label: 'Tổng bộ thẻ', value: stats.totalDecks, icon: '🗂️', color: 'bg-purple-500' },
    { label: 'Tổng số thẻ học', value: stats.totalCards, icon: '📝', color: 'bg-emerald-500' },
    { label: 'Hoạt động hôm nay', value: stats.activeToday, icon: '🔥', color: 'bg-orange-500' },
  ];

  if (loading) return <div className="p-6">Đang tải thống kê...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Thống kê hệ thống</h1>
        <p className="text-slate-500">Cập nhật tình hình hoạt động của ứng dụng</p>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((item, index) => (
          <div key={index} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
            <div className={`${item.color} w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-lg shadow-blue-100`}>
              {item.icon}
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{item.label}</p>
              <h3 className="text-2xl font-bold text-slate-800">{item.value.toLocaleString()}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Gợi ý thêm: Danh sách người dùng mới đăng ký gần đây */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-lg font-bold text-slate-800 mb-4">Hoạt động gần đây</h3>
        <div className="text-center py-10 text-slate-400 border-2 border-dashed rounded-xl">
           Hệ thống đang theo dõi dữ liệu thời gian thực...
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;