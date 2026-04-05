import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Loading from '../../components/common/Loading';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Giả lập dữ liệu
        await new Promise((resolve) => setTimeout(resolve, 600));
        setUsers([
          {
            id: 1,
            name: 'Nguyễn Văn A',
            email: 'vana@gmail.com',
            role: 'admin',
            status: 'active',
            createdAt: '2026-01-10',
            avatar: '👤'
          },
          {
            id: 2,
            name: 'Trần Thị B',
            email: 'thib@gmail.com',
            role: 'user',
            status: 'banned',
            createdAt: '2026-02-15',
            avatar: '👤'
          },
          {
            id: 3,
            name: 'Lê Minh C',
            email: 'minhc@dev.com',
            role: 'user',
            status: 'active',
            createdAt: '2026-03-20',
            avatar: '👤'
          }
        ]);
      } catch {
        toast.error('Không thể tải người dùng');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleToggleStatus = (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'banned' : 'active';
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, status: newStatus } : u))
    );
    
    if (newStatus === 'banned') {
      toast.error('Đã khóa tài khoản');
    } else {
      toast.success('Đã kích hoạt tài khoản');
    }
  };

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loading />;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* HEADER & SEARCH BENTO BOX */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 relative overflow-hidden">
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Người dùng
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Quản lý và phân quyền thành viên hệ thống
          </p>
        </div>

        <div className="relative w-full lg:w-96 z-10">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40">🔍</span>
          <input
            type="text"
            placeholder="Tìm theo tên, email..."
            className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 focus:bg-white focus:border-primary transition-all font-medium text-sm shadow-inner"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE CONTAINER */}
      <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                <th className="px-8 py-5 text-left">Thành viên</th>
                <th className="px-6 py-5 text-center">Vai trò</th>
                <th className="px-6 py-5 text-center">Ngày gia nhập</th>
                <th className="px-6 py-5 text-center">Trạng thái</th>
                <th className="px-8 py-5 text-right">Thao tác</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {filtered.map((user) => (
                <tr key={user.id} className="group hover:bg-slate-50/80 transition-all duration-300">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-2xl bg-slate-100 flex items-center justify-center text-xl group-hover:scale-110 transition-transform shadow-sm">
                        {user.avatar}
                      </div>
                      <div>
                        <div className="font-black text-slate-900 text-sm">{user.name}</div>
                        <div className="text-xs text-slate-400 font-medium">{user.email}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5 text-center">
                    <span className={`px-3 py-1.5 text-[10px] rounded-xl font-black uppercase tracking-widest ${
                      user.role === 'admin'
                        ? 'bg-purple-50 text-purple-600 border border-purple-100'
                        : 'bg-blue-50 text-blue-600 border border-blue-100'
                    }`}>
                      {user.role}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-center">
                    <span className="text-xs font-bold text-slate-500">
                        {user.createdAt}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-center">
                    <div className="flex justify-center">
                        <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                        user.status === 'active'
                            ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                            : 'bg-rose-50 text-rose-500 border border-rose-100'
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
                        {user.status}
                        </span>
                    </div>
                  </td>

                  <td className="px-8 py-5 text-right">
                    <button
                      onClick={() => handleToggleStatus(user.id, user.status)}
                      className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-sm ${
                        user.status === 'active'
                          ? 'bg-slate-900 text-white hover:bg-rose-600'
                          : 'bg-emerald-500 text-white hover:bg-emerald-600'
                      }`}
                    >
                      {user.status === 'active' ? 'Khóa' : 'Mở khóa'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* EMPTY STATE */}
        {filtered.length === 0 && (
          <div className="py-24 text-center flex flex-col items-center">
            <div className="text-6xl mb-4 grayscale opacity-20">🔍</div>
            <p className="text-slate-400 font-black text-xs uppercase tracking-widest">Không tìm thấy thành viên</p>
            <p className="text-slate-300 text-xs mt-1 font-medium">Thử tìm kiếm với từ khóa khác xem sao!</p>
          </div>
        )}
      </div>

      {/* FOOTER INFO */}
      <div className="bg-slate-50 p-6 rounded-4xl border border-slate-100 flex items-center justify-between px-10">
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Tổng cộng: <span className="text-slate-900">{filtered.length} thành viên</span>
        </p>
        <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
            <div className="w-2 h-2 rounded-full bg-slate-200"></div>
            <div className="w-2 h-2 rounded-full bg-slate-200"></div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;