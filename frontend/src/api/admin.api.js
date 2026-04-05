import axiosClient from './axiosClient';

const adminApi = {
  // Stats
  getStats: () => axiosClient.get('/admin/stats'),

  // Users
  getAllUsers: () => {
    return axiosClient.get('/admin/users');
  },

  updateUserStatus: (userId, status) => {
    return axiosClient.put(`/admin/users/${userId}/status`, { status });
  },

  deleteUser: (userId) => {
    return axiosClient.delete(`/admin/users/${userId}`);
  },

  // Decks
  getAllDecks: () => {
    return axiosClient.get('/admin/decks');
  },

  deleteDeck: (deckId) => {
    return axiosClient.delete(`/admin/decks/${deckId}`);
  },

  toggleDeckVisibility: (deckId, isPublic) => {
    return axiosClient.put(`/admin/decks/${deckId}/visibility`, {
      is_public: isPublic,
    });
  },
};

export default adminApi;