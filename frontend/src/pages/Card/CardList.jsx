import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import cardApi from '../../api/card.api';
import { toast } from 'react-hot-toast';

const CardList = () => {
  const { id } = useParams();
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  // Sửa lỗi exhaustive-deps bằng cách đưa hàm vào trong useEffect
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const response = await cardApi.getCardsByDeck(id);
        setCards(response.data);
      } catch (err) {
        // Sửa lỗi 'error' unused bằng cách dùng 'err' để log hoặc bỏ trống
        console.error("Fetch error:", err);
        toast.error("Không thể tải danh sách thẻ", { id: "fetch-cards-error" });
      } finally {
        setLoading(false);
      }
    };

    fetchCards();
  }, [id]); // id là dependency duy nhất

  const handleDelete = async (cardId) => {
    if (window.confirm("Bạn có chắc muốn xóa thẻ này?")) {
      try {
        await cardApi.deleteCard(cardId);
        setCards(prev => prev.filter(c => c.id !== cardId));
        toast.success("Đã xóa thẻ");
      } catch (err) {
        console.error("Delete error:", err);
        toast.error("Xóa thất bại");
      }
    }
  };

  if (loading) return <div className="p-10 text-center">Đang tải...</div>;

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Danh sách thẻ</h1>
        <Link 
          to={`/decks/${id}/add-card`} 
          className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition"
        >
          + Thêm thẻ mới
        </Link>
      </div>

      <div className="grid gap-4">
        {cards && cards.length > 0 ? cards.map(card => (
          <div key={card.id} className="bg-white p-4 rounded-xl shadow-sm border flex justify-between items-center">
            <div className="flex-1">
              <p className="font-medium text-slate-700">Mặt trước: {card.front_text || card.front}</p>
              <p className="text-sm text-slate-500 mt-1">Mặt sau: {card.back_text || card.back}</p>
            </div>
            <div className="flex gap-2">
              <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg">Sửa</button>
              <button 
                onClick={() => handleDelete(card.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
              >
                Xóa
              </button>
            </div>
          </div>
        )) : (
          <div className="text-center py-10 bg-slate-50 rounded-2xl border-2 border-dashed">
            Chưa có thẻ nào trong bộ này.
          </div>
        )}
      </div>
    </div>
  );
};

export default CardList;