import axiosClient from './axiosClient';

const authApi = {
  // ================= LOGIN =================
  login: async (data) => {
    const res = await axiosClient.post('/auth/login.php', data);

    if (res?.token) {
      localStorage.setItem('sr_token', res.token);
      localStorage.setItem(
        'sr_user',
        JSON.stringify({
          role: res.role,
          username: res.username,
          email: data.email,
        })
      );
    }
    
    return res;
  },

  // ================= REGISTER =================
  register: (data) => {
    // data: { fullname, email, password }
    return axiosClient.post('/auth/register.php', data);
  },

  // ================= UPDATE PROFILE =================
  updateProfile: (data) => {
    // data: { username, password }
    return axiosClient.post('/user/update_profile.php', data);
  },

  // ================= LOGOUT =================
  logout: () => {
    localStorage.removeItem('sr_token');
    localStorage.removeItem('sr_user');
    window.location.href = '/'; // Điều hướng về landing page
  },
};

export default authApi;