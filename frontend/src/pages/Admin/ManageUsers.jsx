import { useEffect, useState } from 'react';
// eslint-disable-next-line no-unused-vars
import adminApi from '../../api/admin.api'; 
import toast from 'react-hot-toast';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // API thật: const res = await adminApi.getAllUsers(); setUsers(res);
      
      // Dữ liệu mẫu để Test giao diện
      const mockUsers = [
        { id: 1, name: 'Nguyễn Văn A', email: 'vana@gmail.com', role: 'user', status: 'active', createdAt: '2026-01-10' },
        { id: 2, name: 'Trần Thị B', email: 'thib@gmail.com', role: 'user', status: 'banned', createdAt: '2026-02-15' },
        { id: 3, name: 'Admin Đẹp Trai', email: 'admin@spaced.com', role: 'admin', status: 'active', createdAt: '2025-12-01' },
      ];
      setUsers(mockUsers);
    } catch { // Đổi thành _error để ESLint bỏ qua
      toast.error("Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'banned' : 'active';
    const confirmMsg = newStatus === 'banned' ? "Khóa tài khoản này?" : "Mở khóa tài khoản này?";
    
    if (window.confirm(confirmMsg)) {
      try {
        // API thật: await adminApi.updateUserStatus(userId, newStatus);
        
        setUsers(users.map(u => u.id === userId ? { ...u, status: newStatus } : u));
        toast.success(newStatus === 'banned' ? "Đã khóa người dùng" : "Đã mở khóa thành công");
      } catch { // Đổi thành _error để ESLint bỏ qua
        toast.error("Thao tác thất bại");
      }
    }
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Thêm logic loading để sử dụng biến 'loading'
  if (loading && users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-20 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="text-slate-500 animate-pulse">Đang tải danh sách người dùng...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Quản lý người dùng</h1>
          <p className="text-slate-500 text-sm">Danh sách tất cả thành viên trong hệ thống</p>
        </div>
        <input 
          type="text" 
          placeholder="Tìm theo tên hoặc email..." 
          className="px-4 py-2 border rounded-xl outline-none focus:ring-2 focus:ring-primary/20 w-64 transition"
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="p-4 font-semibold text-slate-600 text-sm">Người dùng</th>
              <th className="p-4 font-semibold text-slate-600 text-sm">Vai trò</th>
              <th className="p-4 font-semibold text-slate-600 text-sm">Ngày tham gia</th>
              <th className="p-4 font-semibold text-slate-600 text-sm">Trạng thái</th>
              <th className="p-4 font-semibold text-slate-600 text-sm text-right">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredUsers.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50/50 transition">
                <td className="p-4">
                  <div className="font-medium text-slate-800">{user.name}</div>
                  <div className="text-xs text-slate-400">{user.email}</div>
                </td>
                <td className="p-4">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider ${user.role === 'admin' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-4 text-sm text-slate-500">{user.createdAt}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.status === 'active' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                    {user.status === 'active' ? '● Hoạt động' : '● Đã khóa'}
                  </span>
                </td>
                <td className="p-4 text-right">
                  {user.role !== 'admin' && (
                    <button 
                      onClick={() => handleToggleStatus(user.id, user.status)}
                      className={`text-sm font-semibold transition px-3 py-1 rounded-lg ${user.status === 'active' ? 'text-red-500 hover:bg-red-50' : 'text-emerald-500 hover:bg-emerald-50'}`}
                    >
                      {user.status === 'active' ? 'Khóa' : 'Mở khóa'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {filteredUsers.length === 0 && (
          <div className="p-10 text-center text-slate-400">Không tìm thấy người dùng nào phù hợp.</div>
        )}
      </div>
    </div>
  );
};

export default ManageUsers;