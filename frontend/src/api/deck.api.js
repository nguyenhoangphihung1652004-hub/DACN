import axiosClient from './axiosClient';

const deckApi = {
  getAll: () => axiosClient.get('/decks/read.php'),
  getPublic: () => axiosClient.get('/decks/read_public.php'),
  clone: (deckId) => axiosClient.post('/decks/clone.php', { deck_id: deckId }),
  
  getById: async (id) => {
    // Tạm giữ mock data này vì chưa code API GET một bộ thẻ (Giai đoạn sau)
    await new Promise(resolve => setTimeout(resolve, 400));
    return { id, title: 'Bộ thẻ mẫu', description: 'Mô tả chi tiết', cards: [] };
  },

  create: (data) => axiosClient.post('/decks/create.php', data),
};

export default deckApi;