import axiosClient from './axiosClient';

const exploreApi = {
  /**
   * Lấy danh sách các bộ thẻ công khai từ cộng đồng
   * @param {Object} params - Chứa các tham số như search, page, limit, category
   */
  getPublicDecks: (params) => {
    // URL này sẽ tương ứng với Route bên PHP của bạn: /api/explore/decks
    return axiosClient.get('/explore/decks', { params });
  },

  /**
   * Xem chi tiết một bộ thẻ công khai trước khi quyết định tải
   * @param {string|number} deckId 
   */
  getPublicDeckDetail: (deckId) => {
    return axiosClient.get(`/explore/decks/${deckId}`);
  },

  /**
   * Sao chép bộ thẻ của người khác về kho đồ cá nhân
   * @param {string|number} deckId 
   */
  downloadDeck: (deckId) => {
    // Khi gọi API này, Backend sẽ copy bản ghi Deck và các Card con 
    // sau đó gán user_id là ID của bạn.
    return axiosClient.post(`/explore/decks/${deckId}/clone`);
  }
};

export default exploreApi;