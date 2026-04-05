import { useEffect, useRef, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import cardApi from '../../api/card.api';
import deckApi from '../../api/deck.api';
import toast from 'react-hot-toast';
import Loading from '../../components/common/Loading';

const DeckDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [deck, setDeck] = useState(null);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [newCard, setNewCard] = useState({
    front_text: '',
    back_text: '',
  });

  const hasFetched = useRef({});

  // ================= FETCH DATA =================
  const fetchData = useCallback(async () => {
    try {
      const [deckRes, cardsRes] = await Promise.all([
        deckApi.getById(id),
        cardApi.getByDeckId(id),
      ]);
      setDeck(deckRes);
      setCards(cardsRes);
    } catch (error) {
      console.error(error);
      toast.error('Không thể tải dữ liệu bộ thẻ');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (hasFetched.current[id]) return;
    hasFetched.current[id] = true;
    fetchData();
  }, [id, fetchData]);

  // ================= ACTIONS =================
  const handleAddCard = async (e) => {
    e.preventDefault();
    if (!newCard.front_text.trim() || !newCard.back_text.trim()) {
      return toast.error('Vui lòng nhập đầy đủ hai mặt của thẻ');
    }

    setSubmitting(true);
    try {
      await cardApi.create({ ...newCard, deck_id: id });
      toast.success('Đã thêm thẻ mới thành công!');
      setNewCard({ front_text: '', back_text: '' });
      fetchData(); // Refresh danh sách
    } catch {
      toast.error('Lỗi khi thêm thẻ');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCard = async (cardId) => {
    if (!window.confirm('Bạn có chắc muốn xóa thẻ này?')) return;
    try {
      await cardApi.delete(cardId);
      toast.success('Đã xóa thẻ');
      setCards(cards.filter(c => c.card_id !== cardId));
    } catch {
      toast.error('Không thể xóa thẻ');
    }
  };

  // ================= FILTER =================
  const filteredCards = cards.filter((card) =>
    card.front_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
    card.back_text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <Loading />;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* BACK BUTTON & HEADER */}
      <div className="flex flex-col gap-4">
        <button 
          onClick={() => navigate('/decks')}
          className="flex items-center gap-2 text-slate-400 hover:text-primary font-bold text-xs uppercase tracking-widest transition-colors w-fit"
        >
          <span>←</span> Quay lại kho thẻ
        </button>

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
               <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                {deck?.title}
              </h1>
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase">
                {cards.length} thẻ
              </span>
            </div>
            <p className="text-slate-500 max-w-2xl leading-relaxed">
              {deck?.description || 'Bộ thẻ này chưa có mô tả.'}
            </p>
          </div>

          <button 
            onClick={() => navigate(`/review/${id}`)}
            disabled={cards.length === 0}
            className="flex items-center justify-center gap-3 px-10 py-4 rounded-2xl font-black text-white bg-primary shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:grayscale cursor-pointer"
          >
            <span className="text-xl">▶</span>
            Bắt đầu ôn tập
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT: ADD NEW CARD FORM */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm sticky top-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-primary/10 p-2 rounded-xl text-primary">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                 </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-800">Thêm thẻ nhanh</h3>
            </div>

            <form onSubmit={handleAddCard} className="space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mặt trước (Câu hỏi)</label>
                <textarea
                  rows="3"
                  placeholder="Ví dụ: Hello có nghĩa là gì?"
                  className="w-full rounded-2xl bg-slate-50 border border-slate-100 p-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none text-sm font-medium"
                  value={newCard.front_text}
                  onChange={(e) => setNewCard({ ...newCard, front_text: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Mặt sau (Đáp án)</label>
                <textarea
                  rows="3"
                  placeholder="Ví dụ: Xin chào"
                  className="w-full rounded-2xl bg-slate-50 border border-slate-100 p-4 focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all resize-none text-sm font-medium"
                  value={newCard.back_text}
                  onChange={(e) => setNewCard({ ...newCard, back_text: e.target.value })}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 rounded-2xl font-black text-white bg-slate-900 shadow-lg hover:bg-primary transition-all disabled:opacity-50 active:scale-95 text-sm uppercase tracking-widest"
              >
                {submitting ? 'Đang lưu...' : 'Lưu vào bộ thẻ'}
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT: CARD LIST TABLE */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
            
            {/* SEARCH & TITLE */}
            <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h3 className="font-bold text-slate-800 flex items-center gap-2">
                Danh sách thẻ
                <span className="text-slate-300 font-normal">({filteredCards.length})</span>
              </h3>

              <div className="relative group">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors">🔍</span>
                <input
                  type="text"
                  placeholder="Tìm kiếm nội dung..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full md:w-64 pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all text-sm"
                />
              </div>
            </div>

            {/* TABLE */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50/50 text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <th className="px-6 py-4 text-left">Mặt trước</th>
                    <th className="px-6 py-4 text-left">Mặt sau</th>
                    <th className="px-6 py-4 text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredCards.map((card) => (
                    <tr key={card.card_id} className="group hover:bg-slate-50/80 transition-colors">
                      <td className="px-6 py-5">
                        <p className="text-sm font-bold text-slate-700 leading-snug">{card.front_text}</p>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-sm text-slate-500 font-medium italic leading-snug">{card.back_text}</p>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-all">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </button>
                          <button 
                            onClick={() => handleDeleteCard(card.card_id)}
                            className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* EMPTY STATE */}
            {filteredCards.length === 0 && (
              <div className="py-20 text-center space-y-3">
                <div className="text-4xl grayscale opacity-20">📭</div>
                <p className="text-slate-400 text-sm font-medium italic">Không tìm thấy nội dung yêu cầu</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeckDetail;