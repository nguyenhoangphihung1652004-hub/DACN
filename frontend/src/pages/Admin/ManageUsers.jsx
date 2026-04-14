import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Loading from '../../components/common/Loading';
import adminApi from '../../api/admin.api';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await adminApi.getAllUsers();
        setUsers(
          data.map((user) => ({
            ...user,
            name: user.username || user.name || 'Người dùng',
            avatar: user.username ? user.username.charAt(0).toUpperCase() : 'U',
          }))
        );
      // eslint-disable-next-line no-unused-vars
      } catch (error) {
        toast.error('Không thể tải người dùng');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'banned' : 'active';

    try {
      await adminApi.updateUserStatus(id, newStatus);
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status: newStatus } : u))
      );
      if (newStatus === 'banned') {
        toast.error('Đã khóa tài khoản');
      } else {
        toast.success('Đã mở khóa tài khoản');
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          'Không thể cập nhật trạng thái người dùng'
      );
    }
  };

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loading />;

  return (
    <div className="animate-in fade-in space-y-8 duration-500">
      {/* HEADER & SEARCH BENTO BOX */}
      <div className="relative flex flex-col justify-between gap-6 overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white p-8 shadow-sm lg:flex-row lg:items-center">
        <div className="bg-primary/5 absolute -top-10 -left-10 h-32 w-32 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">
            Người dùng
          </h1>
          <p className="mt-1 font-medium text-slate-500">
            Quản lý và phân quyền thành viên hệ thống
          </p>
        </div>

        <div className="relative z-10 w-full lg:w-96">
          <span className="absolute top-1/2 left-4 -translate-y-1/2 opacity-40">
            🔍
          </span>
          <input
            type="text"
            placeholder="Tìm theo tên, email..."
            className="focus:ring-primary/10 focus:border-primary w-full rounded-2xl border border-slate-100 bg-slate-50 py-3.5 pr-4 pl-12 text-sm font-medium shadow-inner transition-all outline-none focus:bg-white focus:ring-4"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE CONTAINER */}
      <div className="overflow-hidden rounded-[2.5rem] border border-slate-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/50 text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase">
                <th className="px-8 py-5 text-left">Thành viên</th>
                <th className="px-6 py-5 text-center">Vai trò</th>
                <th className="px-6 py-5 text-center">Ngày gia nhập</th>
                <th className="px-6 py-5 text-center">Trạng thái</th>
                <th className="px-8 py-5 text-right">Thao tác</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {filtered.map((user) => (
                <tr
                  key={user.id}
                  className="group transition-all duration-300 hover:bg-slate-50/80"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-100 text-xl shadow-sm transition-transform group-hover:scale-110">
                        {user.avatar}
                      </div>
                      <div>
                        <div className="text-sm font-black text-slate-900">
                          {user.name}
                        </div>
                        <div className="text-xs font-medium text-slate-400">
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5 text-center">
                    <span
                      className={`rounded-xl px-3 py-1.5 text-[10px] font-black tracking-widest uppercase ${
                        user.role === 'admin'
                          ? 'border border-purple-100 bg-purple-50 text-purple-600'
                          : 'border border-blue-100 bg-blue-50 text-blue-600'
                      }`}
                    >
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
                      <span
                        className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-[10px] font-black tracking-widest uppercase ${
                          user.status === 'active'
                            ? 'border border-emerald-100 bg-emerald-50 text-emerald-600'
                            : 'border border-rose-100 bg-rose-50 text-rose-500'
                        }`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${user.status === 'active' ? 'animate-pulse bg-emerald-500' : 'bg-rose-500'}`}
                        ></span>
                        {user.status}
                      </span>
                    </div>
                  </td>

                  <td className="px-8 py-5 text-right">
                    <button
                      onClick={() => handleToggleStatus(user.id, user.status)}
                      className={`rounded-xl px-5 py-2 text-xs font-black tracking-widest uppercase shadow-sm transition-all active:scale-95 ${
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
          <div className="flex flex-col items-center py-24 text-center">
            <div className="mb-4 text-6xl opacity-20 grayscale">🔍</div>
            <p className="text-xs font-black tracking-widest text-slate-400 uppercase">
              Không tìm thấy thành viên
            </p>
            <p className="mt-1 text-xs font-medium text-slate-300">
              Thử tìm kiếm với từ khóa khác xem sao!
            </p>
          </div>
        )}
      </div>

      {/* FOOTER INFO */}
      <div className="flex items-center justify-between rounded-4xl border border-slate-100 bg-slate-50 p-6 px-10">
        <p className="text-[10px] font-black tracking-widest text-slate-400 uppercase">
          Tổng cộng:{' '}
          <span className="text-slate-900">{filtered.length} thành viên</span>
        </p>
        <div className="flex gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
          <div className="h-2 w-2 rounded-full bg-slate-200"></div>
          <div className="h-2 w-2 rounded-full bg-slate-200"></div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
