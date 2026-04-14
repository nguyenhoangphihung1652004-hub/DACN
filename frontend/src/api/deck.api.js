import axiosClient from './axiosClient';

const deckApi = {
  getAll: () => axiosClient.get('/decks/read.php'),
  getPublic: () => axiosClient.get('/decks/read_public.php'),
  clone: (deckId) => axiosClient.post('/decks/clone.php', { deck_id: deckId }),
  
  getById: (id) => axiosClient.get(`/decks/read_single.php?id=${id}`),
  update: (id, data) => axiosClient.put('/decks/update.php', { ...data, id }),
  delete: (id) => axiosClient.delete('/decks/delete.php', { data: { id } }),

  create: (data) => axiosClient.post('/decks/create.php', data),
};

export default deckApi;