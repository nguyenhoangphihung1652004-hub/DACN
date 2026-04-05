import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../hooks/useAuth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.promise(
      login({ email, password }),
      {
        loading: 'Đang xác thực...',
        success: 'Đăng nhập thành công! Chào mừng bạn.',
        error: (err) => `Lỗi: ${err.response?.data?.message || 'Thông tin không chính xác'}`,
      }
    ).then(() => {
      navigate('/dashboard');
    }).catch(() => {});
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
      <input 
        type="email" 
        placeholder="Email"
        className="border p-2 rounded"
        onChange={(e) => setEmail(e.target.value)} 
      />
      <input 
        type="password" 
        placeholder="Mật khẩu"
        className="border p-2 rounded"
        onChange={(e) => setPassword(e.target.value)} 
      />
      <button type="submit" className="bg-primary text-white p-2 rounded">
        Đăng nhập
      </button>

      {/* Thêm link chuyển sang đăng ký */}
      <p className="text-center text-sm text-slate-500">
        Chưa có tài khoản?{' '}
        <Link to="/register" className="text-primary hover:underline">
          Đăng ký
        </Link>
      </p>
    </form>
  );
};

export default Login;