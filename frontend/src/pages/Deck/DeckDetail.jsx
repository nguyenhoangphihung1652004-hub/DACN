import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import cardApi from '../../api/card.api';
import deckApi from '../../api/deck.api';
import toast from 'react-hot-toast';

const DeckDetail = () => {
  const { id } = useParams();
  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);

  // State cho Modal thêm thẻ
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCard, setNewCard] = useState({ front_text: '', back_text: '' });
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const [deckRes, cardsRes] = await Promise.all([
        deckApi.getById(id),
        cardApi.getByDeckId(id)
      ]);
      setDeck(deckRes);
      setCards(cardsRes);
    } catch (error) {
      console.error("Lỗi khi tải chi tiết bộ thẻ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  // Xử lý thêm thẻ mới
  const handleAddCard = async (e) => {
    e.preventDefault();
    if (!newCard.front_text.trim() || !newCard.back_text.trim()) {
      return toast.error("Vui lòng điền đầy đủ 2 mặt của thẻ");
    }

    setSubmitting(true);
    try {
      // Gọi API thêm thẻ (Gửi kèm deck_id)
      await cardApi.create({ ...newCard, deck_id: id });
      
      toast.success("Đã thêm thẻ mới!");
      setNewCard({ front_text: '', back_text: '' }); // Reset form để nhập tiếp
      fetchData(); // Tải lại danh sách thẻ
      
      // Nếu muốn đóng modal ngay thì setIsModalOpen(false), 
      // nhưng thường người dùng sẽ muốn thêm nhiều thẻ liên tục.
    } catch (error) {
      console.error("Lỗi khi thêm thẻ:", error);
      toast.error("Không thể thêm thẻ. Vui lòng kiểm tra lại Backend!");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-6 text-center text-slate-500">Đang tải dữ liệu...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <Link to="/decks" className="text-sm text-primary hover:underline mb-2 inline-block">← Quay lại danh sách</Link>
          <h1 className="text-3xl font-bold text-slate-800">{deck?.title}</h1>
          <p className="text-slate-500 mt-2">{deck?.description}</p>
        </div>
        <div className="flex gap-3">
          <Link 
            to={`/review/${id}`} 
            className="bg-emerald-500 text-white px-6 py-2 rounded-lg font-bold hover:bg-emerald-600 transition shadow-lg shadow-emerald-100"
          >
            Bắt đầu học ngay
          </Link>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition"
          >
            + Thêm thẻ mới
          </button>
        </div>
      </div>

      {/* List Cards */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-700">Danh sách thẻ ({cards.length})</h2>
        <div className="grid gap-3">
          {cards.map((card) => (
            <div key={card.card_id} className="bg-white p-4 rounded-xl border border-slate-200 flex justify-between items-center group hover:border-primary transition shadow-sm">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 flex-1">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Mặt trước</span>
                  <p className="text-slate-800 font-medium">{card.front_text}</p>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-1">Mặt sau</span>
                  <p className="text-slate-600 italic">{card.back_text}</p>
                </div>
              </div>
              <div className="flex gap-1 ml-4 opacity-0 group-hover:opacity-100 transition">
                <button className="p-2 text-slate-400 hover:text-blue-500 hover:bg-blue-50 rounded-lg transition">Sửa</button>
                <button className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition">Xóa</button>
              </div>
            </div>
          ))}
        </div>

        {cards.length === 0 && (
          <div className="text-center py-16 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400">Bộ thẻ này đang trống. Hãy thêm những thẻ đầu tiên!</p>
          </div>
        )}
      </div>

      {/* MODAL THÊM THẺ MỚI */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">Thêm thẻ mới</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 text-2xl">&times;</button>
            </div>
            
            <form onSubmit={handleAddCard} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Mặt trước (Câu hỏi/Từ vựng)</label>
                <textarea 
                  rows="3"
                  required
                  placeholder="Nhập nội dung mặt trước..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition resize-none"
                  value={newCard.front_text}
                  onChange={(e) => setNewCard({...newCard, front_text: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wide">Mặt sau (Đáp án/Giải nghĩa)</label>
                <textarea 
                  rows="3"
                  required
                  placeholder="Nhập nội dung mặt sau..."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-4 focus:ring-primary/10 focus:border-primary outline-none transition resize-none"
                  value={newCard.back_text}
                  onChange={(e) => setNewCard({...newCard, back_text: e.target.value})}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-3 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition"
                >
                  Xong
                </button>
                <button 
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-3 rounded-xl bg-primary text-white font-bold hover:bg-primary/90 transition disabled:opacity-50 shadow-lg shadow-primary/20"
                >
                  {submitting ? "Đang lưu..." : "Thêm vào bộ thẻ"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeckDetail;