import { useEffect, useState } from 'react';
import deckApi from '../../api/deck.api';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const DeckList = () => {
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State cho Modal và Form
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDeck, setNewDeck] = useState({ title: '', description: '', is_public: false });
  const [submitting, setSubmitting] = useState(false);

  const fetchDecks = async () => {
    try {
      const data = await deckApi.getAll();
      setDecks(data);
    } catch (error) {
      console.error("Không thể tải danh sách bộ thẻ", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDecks();
  }, []);

  const handleCreateDeck = async (e) => {
    e.preventDefault();
    if (!newDeck.title.trim()) return toast.error("Vui lòng nhập tên bộ thẻ");

    setSubmitting(true);
    try {
      await deckApi.create(newDeck);
      toast.success("Tạo bộ thẻ thành công!");
      setIsModalOpen(false); // Đóng modal
      setNewDeck({ title: '', description: '', is_public: false }); // Reset form
      fetchDecks(); // Tải lại danh sách
    } catch (error) {
      console.error("Lỗi khi tạo bộ thẻ:", error);
      toast.error("Không thể tạo bộ thẻ. Vui lòng thử lại!");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-6">Đang tải dữ liệu...</div>;

  return (
    <div className="p-6 relative">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Bộ thẻ của tôi</h1>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition shadow-lg shadow-primary/20"
        >
          + Tạo bộ thẻ mới
        </button>
      </div>

      {/* RENDER DANH SÁCH BỘ THẺ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {decks.map((deck) => (
          <div key={deck.deck_id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition group">
            <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">{deck.title}</h3>
            <p className="text-slate-500 text-sm mb-4 line-clamp-2 h-10">{deck.description || "Không có mô tả"}</p>
            <div className="flex justify-between items-center border-t pt-4">
              <span className="text-xs font-medium px-2 py-1 bg-primary/5 rounded text-primary">
                {deck.card_count || 0} thẻ
              </span>
              <Link 
                to={`/decks/${deck.deck_id}/cards`}
                className="text-slate-600 font-medium text-sm hover:text-primary transition"
              >
                Quản lý thẻ →
              </Link>
            </div>
          </div>
        ))}
      </div>
      
      {decks.length === 0 && (
        <div className="text-center py-20 bg-white rounded-xl border-2 border-dashed border-slate-200">
          <p className="text-slate-400">Bạn chưa có bộ thẻ nào. Hãy tạo cái đầu tiên nhé!</p>
        </div>
      )}

      {/* MODAL TẠO BỘ THẺ MỚI */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-slate-800">Tạo bộ thẻ mới</h2>
            </div>
            
            <form onSubmit={handleCreateDeck} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Tên bộ thẻ *</label>
                <input 
                  type="text" 
                  required
                  placeholder="Ví dụ: Tiếng Anh chuyên ngành"
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                  value={newDeck.title}
                  onChange={(e) => setNewDeck({...newDeck, title: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mô tả (không bắt buộc)</label>
                <textarea 
                  rows="3"
                  placeholder="Mô tả ngắn gọn về bộ thẻ này..."
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition"
                  value={newDeck.description}
                  onChange={(e) => setNewDeck({...newDeck, description: e.target.value})}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2 rounded-xl bg-slate-100 text-slate-600 font-semibold hover:bg-slate-200 transition"
                >
                  Hủy
                </button>
                <button 
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-2 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition disabled:opacity-50"
                >
                  {submitting ? "Đang tạo..." : "Tạo ngay"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeckList;