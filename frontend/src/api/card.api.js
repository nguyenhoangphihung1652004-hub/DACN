import axiosClient from './axiosClient';

const cardApi = {
  // Lấy tất cả thẻ của một bộ thẻ cụ thể
  getByDeckId: (deckId) => {
    return axiosClient.get(`/cards/read.php?deck_id=${deckId}`);
  },
  // Tạo thẻ mới trong một bộ thẻ
  create: (data) => {
    return axiosClient.post('/cards/create.php', data);
  },
  // Cập nhật nội dung thẻ
  update: (id, data) => {
    return axiosClient.put(`/cards/update.php?id=${id}`, data);
  },
  // Xóa thẻ
  delete: (id) => {
    return axiosClient.delete(`/cards/delete.php?id=${id}`);
  }
};

export default cardApi;