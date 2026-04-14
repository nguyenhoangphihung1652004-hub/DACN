import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';

const Register = ({ onSwitch }) => {
  const [formData, setFormData] = useState({ 
    email: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // === CÁC LUẬT KIỂM TRA (VALIDATION) ===
  const validateForm = () => {
    const email = formData.email.trim();
    const password = formData.password;
    const confirmPassword = formData.confirmPassword;

    if (!email || !password || !confirmPassword) {
      toast.error("Vui lòng điền đầy đủ các trường");
      return false;
    }

    if (/\s/.test(email)) {
      toast.error("Email không được chứa khoảng trắng!");
      return false;
    }
    if (!email.endsWith("@gmail.com")) {
      toast.error("Email đăng ký phải là @gmail.com!");
      return false;
    }

    const localPart = email.split('@')[0];
    if (localPart.length < 5 || localPart.length > 15) {
      toast.error("Tên Gmail (phần trước @) phải từ 5 đến 15 ký tự!");
      return false;
    }

    if (password.length < 10 || password.length > 12) {
      toast.error("Mật khẩu phải từ 10 đến 12 ký tự!");
      return false;
    }
    
    if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password) || !/[!@#$%^&*()]/.test(password)) {
      toast.error("Mật khẩu phải có hoa, thường, số và ký tự đặc biệt!");
      return false;
    }

    if (password !== confirmPassword) {
      toast.error("Mật khẩu nhập lại không khớp!");
      return false;
    }

    return { 
      username: localPart, 
      email: email, 
      password: password 
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validatedData = validateForm();
    if (!validatedData) return;

    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/auth/register.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(validatedData)
      });
      const data = await res.json();

      if (res.ok || res.status === 201) {
        toast.success("Đăng ký thành công!");
        if (typeof onSwitch === 'function') onSwitch();  
      } else {
        toast.error(data.message || "Lỗi đăng ký");
      }
    } catch {
      toast.error("Lỗi kết nối server!");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    'w-full px-4 py-3.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-4 focus:ring-primary/10 focus:bg-white transition-all text-sm';
  const labelClass =
    'block text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 ml-1';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* EMAIL */}
      <div className="space-y-1.5">
        <label className={labelClass}>Địa chỉ Gmail</label>
        <input
          type="email"
          placeholder="username@gmail.com"
          className={inputClass}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>

      {/* PASSWORD */}
      <div className="space-y-1.5">
        <label className={labelClass}>Mật khẩu</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            className={inputClass}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
          </button>
        </div>
      </div>

      {/* CONFIRM PASSWORD */}
      <div className="space-y-1.5">
        <label className={labelClass}>Nhập lại mật khẩu</label>
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            className={inputClass}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute top-1/2 right-3 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            {showPassword ? <MdVisibilityOff size={20} /> : <MdVisibility size={20} />}
          </button>
        </div>
      </div>

      {/* SWITCH & SUBMIT */}
      <div className="pt-2 space-y-4">
        {/* Chỉnh lại vị trí để giống bên Login: Căn phải (justify-end) */}
        <div className="flex justify-end px-1">
          <p className="text-xs font-bold text-slate-500">
            Đã có tài khoản?{' '}
            <button
              type="button"
              onClick={onSwitch}
              className="text-primary hover:underline transition-all"
            >
              Đăng nhập
            </button>
          </p>
        </div>

        <button 
          disabled={loading} 
          className="w-full rounded-xl bg-slate-900 py-4 text-[11px] font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-slate-200 transition-all hover:bg-slate-800 active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? "Đang xử lý..." : "Tạo tài khoản học viên"}
        </button>
      </div>
    </form>
  );
};

export default Register;