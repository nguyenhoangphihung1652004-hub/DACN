import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import userApi from '../../api/user.api';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  useEffect(() => {
    if (user?.username) {
      setUsername(user.username);
    }
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!username.trim()) {
      return toast.error('Tên hiển thị không được để trống!');
    }

    if (password && password !== confirmPassword) {
      return toast.error('Mật khẩu xác nhận không khớp!');
    }

    setLoading(true);
    try {
      const data = { username };
      if (password) {
        data.password = password;
      }
      await userApi.updateProfile(data);
      toast.success('Cập nhật thông tin thành công!');
      // Cập nhật context
      setUser({ ...user, username });
      setPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Có lỗi xảy ra khi cập nhật'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* HEADER SECTION */}
      <div className="flex flex-col justify-between gap-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm md:flex-row md:items-center md:p-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-800 md:text-3xl">
            Hồ sơ cá nhân
          </h1>
          <p className="mt-1 text-sm text-slate-500 md:text-base">
            Quản lý thông tin và tài khoản của bạn để đồng bộ tiến độ học tập.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* LEFT COLUMN: MAIN INFO */}
        <div className="space-y-8 lg:col-span-2">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm md:p-8">
            {/* TOP INFO & AVATAR */}
            <div className="flex flex-col gap-6 border-b border-slate-50 pb-8 md:flex-row md:items-center">
              <div className="group relative">
                <div className="bg-primary/10 text-primary border-primary/20 flex h-24 w-24 items-center justify-center rounded-full border-2 text-4xl font-bold shadow-inner">
                  {username?.charAt(0)?.toUpperCase() || 'U'}
                </div>
                <button className="hover:text-primary absolute -right-1 -bottom-1 rounded-full border border-slate-100 bg-white p-2 shadow-md transition-colors">
                  📷
                </button>
              </div>

              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-800">
                  {username || 'Người dùng'}
                </h2>
                <p className="font-medium text-slate-500">{user?.email}</p>
                <div className="mt-2 inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                  Tài khoản đã xác thực
                </div>
              </div>

              <button className="hover:bg-primary rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-slate-200 transition-all active:scale-95">
                Chỉnh sửa ảnh
              </button>
            </div>

            {/* UPDATE FORM */}
            <form
              onSubmit={handleUpdate}
              className="mt-8 grid gap-6 md:grid-cols-2"
            >
              <div className="space-y-2">
                <label className="ml-1 text-xs font-bold tracking-wider text-slate-400 uppercase">
                  Tên hiển thị
                </label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Nhập tên hiển thị của bạn"
                  className="focus:ring-primary/20 focus:border-primary w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 transition-all outline-none focus:ring-2"
                />
              </div>

              <div className="space-y-2">
                <label className="ml-1 text-xs font-bold tracking-wider text-slate-400 uppercase">
                  Email (Không thể thay đổi)
                </label>
                <input
                  defaultValue={user?.email}
                  disabled
                  className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-100 p-3.5 text-slate-400 italic"
                />
              </div>

              <div className="space-y-2">
                <label className="ml-1 text-xs font-bold tracking-wider text-slate-400 uppercase">
                  Mật khẩu mới (để trống nếu không đổi)
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Nhập mật khẩu mới"
                  className="focus:ring-primary/20 focus:border-primary w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 transition-all outline-none focus:ring-2"
                />
              </div>

              <div className="space-y-2">
                <label className="ml-1 text-xs font-bold tracking-wider text-slate-400 uppercase">
                  Xác nhận mật khẩu
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Nhập lại mật khẩu"
                  className="focus:ring-primary/20 focus:border-primary w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 transition-all outline-none focus:ring-2"
                />
              </div>

              <div className="flex flex-col justify-end gap-3 pt-4 sm:flex-row md:col-span-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-primary shadow-primary/20 hover:bg-primary/90 rounded-xl px-8 py-3 text-sm font-bold text-white shadow-lg transition-all active:scale-95 disabled:opacity-50"
                >
                  {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                </button>
              </div>
            </form>
          </div>

          {/* DANGER ZONE */}
          <div className="rounded-2xl border border-red-100 bg-red-50 p-6 md:p-8">
            <h3 className="mb-1 flex items-center gap-2 text-lg font-bold text-red-600">
              ⚠️ Vùng nguy hiểm
            </h3>
            <p className="mb-6 text-sm text-red-500/80">
              Khi xóa tài khoản, toàn bộ bộ thẻ, dữ liệu học tập và tiến độ sẽ
              bị xóa vĩnh viễn và không thể khôi phục.
            </p>

            <button className="rounded-xl bg-red-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-red-200 transition-all hover:bg-red-700 active:scale-95">
              Xóa tài khoản vĩnh viễn
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: STATS */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="mb-6 flex items-center gap-2 font-bold text-slate-800">
              📊 Thống kê tổng quát
            </h3>

            <div className="space-y-5">
              <div className="flex items-center justify-between rounded-xl bg-blue-50 p-4">
                <div>
                  <p className="text-xs font-bold text-blue-600 uppercase">
                    Bộ thẻ
                  </p>
                  <p className="mt-0.5 text-2xl font-black text-blue-900">12</p>
                </div>
                <span className="text-2xl">🗂️</span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-purple-50 p-4">
                <div>
                  <p className="text-xs font-bold text-purple-600 uppercase">
                    Đã học
                  </p>
                  <p className="mt-0.5 text-2xl font-black text-purple-900">
                    320
                  </p>
                </div>
                <span className="text-2xl">🧠</span>
              </div>

              <div className="flex items-center justify-between rounded-xl bg-orange-50 p-4">
                <div>
                  <p className="text-xs font-bold text-orange-600 uppercase">
                    Streak
                  </p>
                  <p className="mt-0.5 text-2xl font-black text-orange-900">
                    7 ngày
                  </p>
                </div>
                <span className="text-2xl">🔥</span>
              </div>
            </div>
          </div>

          <div className="from-primary shadow-primary/20 rounded-2xl bg-linear-to-br to-indigo-600 p-6 text-white shadow-xl">
            <h4 className="mb-2 font-bold">Khám phá nội dung</h4>
            <p className="text-xs leading-relaxed opacity-90">
              Tìm và lựa chọn các bộ thẻ phù hợp để bắt đầu học hoặc mở rộng
              kiến thức của bạn.
            </p>
            <Link
              to="/explore"
              className="text-primary hover:bg-opacity-90 mt-4 block w-full rounded-xl bg-white py-2.5 text-center text-sm font-black transition-colors"
            >
              Khám phá ngay
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
