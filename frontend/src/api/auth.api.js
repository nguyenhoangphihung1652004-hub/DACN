import axiosClient from './axiosClient';

const authApi = {
  // ================= LOGIN =================
  login: async (data) => {
    // -------- BACKDOOR LOGIN --------
    await new Promise((resolve) => setTimeout(resolve, 800));

    const ADMIN_EMAIL = "test@gmail.com";
    const ADMIN_PASS = "123456";

    if (data.email === ADMIN_EMAIL && data.password === ADMIN_PASS) {
      console.log("🔥 Login backdoor thành công");

      const fakeResponse = {
        user: {
          id: 99,
          name: "Nguyễn Hoàng Phi Hùng",
          email: ADMIN_EMAIL,
          role: "admin", // ✅ thêm role admin
        },
        token: "fake-jwt-token-2026-backdoor",
      };

      // Lưu localStorage
      localStorage.setItem('token', fakeResponse.token);
      localStorage.setItem('user', JSON.stringify(fakeResponse.user));

      return fakeResponse;
    }

    // -------- LOGIN THẬT (backend) --------
    const res = await axiosClient.post('/auth/login.php', data);

    if (res?.token) {
      localStorage.setItem('sr_token', res.token);
      localStorage.setItem('sr_user', JSON.stringify({ role: res.role, fullname: res.fullname }));
    }

    return res;
  },

  // ================= REGISTER =================
  register: (data) => {
    return axiosClient.post('/auth/register', data);
  },

  // ================= PROFILE =================
  getProfile: () => {
    return axiosClient.get('/auth/profile');
  },

  // ================= LOGOUT =================
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
};

export default authApi;