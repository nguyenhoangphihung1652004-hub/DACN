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
        cardApi.getByDeckId(id),
      ]);
      setDeck(deckRes);
      setCards(cardsRes);
    } catch (error) {
      console.error('Lỗi khi tải chi tiết bộ thẻ', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deckRes, cardsRes] = await Promise.all([
          deckApi.getById(id),
          cardApi.getByDeckId(id),
        ]);
        setDeck(deckRes);
        setCards(cardsRes);
      } catch (error) {
        console.error('Lỗi khi tải chi tiết bộ thẻ', error);
        toast.error('Không thể tải dữ liệu', { id: 'fetch-error' });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Xử lý thêm thẻ mới
  const handleAddCard = async (e) => {
    e.preventDefault();
    if (!newCard.front_text.trim() || !newCard.back_text.trim()) {
      return toast.error('Vui lòng điền đầy đủ 2 mặt của thẻ');
    }

    setSubmitting(true);
    try {
      // Gọi API thêm thẻ (Gửi kèm deck_id)
      await cardApi.create({ ...newCard, deck_id: id });

      toast.success('Đã thêm thẻ mới!');
      setNewCard({ front_text: '', back_text: '' }); // Reset form để nhập tiếp
      fetchData(); // Tải lại danh sách thẻ

      // Nếu muốn đóng modal ngay thì setIsModalOpen(false),
      // nhưng thường người dùng sẽ muốn thêm nhiều thẻ liên tục.
    } catch (error) {
      console.error('Lỗi khi thêm thẻ:', error);
      toast.error('Không thể thêm thẻ. Vui lòng kiểm tra lại Backend!');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="p-6 text-center text-slate-500">Đang tải dữ liệu...</div>
    );

  return (
    <div className="mx-auto max-w-5xl p-6">
      {/* Header */}
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <Link
            to="/decks"
            className="text-primary mb-2 inline-block text-sm hover:underline"
          >
            ← Quay lại danh sách
          </Link>
          <h1 className="text-3xl font-bold text-slate-800">{deck?.title}</h1>
          <p className="mt-2 text-slate-500">{deck?.description}</p>
        </div>
        <div className="flex gap-3">
          <Link
            to={`/review/${id}`}
            className="rounded-lg bg-emerald-500 px-6 py-2 font-bold text-white shadow-lg shadow-emerald-100 transition hover:bg-emerald-600"
          >
            Bắt đầu học ngay
          </Link>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary rounded-lg px-4 py-2 text-white transition hover:opacity-90"
          >
            + Thêm thẻ mới
          </button>
        </div>
      </div>

      {/* List Cards */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-700">
          Danh sách thẻ ({cards.length})
        </h2>
        <div className="grid gap-3">
          {cards.map((card) => (
            <div
              key={card.card_id}
              className="group hover:border-primary flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition"
            >
              <div className="grid flex-1 grid-cols-1 gap-4 md:grid-cols-2 md:gap-8">
                <div>
                  <span className="mb-1 block text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                    Mặt trước
                  </span>
                  <p className="font-medium text-slate-800">
                    {card.front_text}
                  </p>
                </div>
                <div>
                  <span className="mb-1 block text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                    Mặt sau
                  </span>
                  <p className="text-slate-600 italic">{card.back_text}</p>
                </div>
              </div>
              <div className="ml-4 flex gap-1 opacity-0 transition group-hover:opacity-100">
                <button className="rounded-lg p-2 text-slate-400 transition hover:bg-blue-50 hover:text-blue-500">
                  Sửa
                </button>
                <button className="rounded-lg p-2 text-slate-400 transition hover:bg-red-50 hover:text-red-500">
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>

        {cards.length === 0 && (
          <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 py-16 text-center">
            <p className="text-slate-400">
              Bộ thẻ này đang trống. Hãy thêm những thẻ đầu tiên!
            </p>
          </div>
        )}
      </div>

      {/* MODAL THÊM THẺ MỚI */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4 backdrop-blur-sm">
          <div className="animate-in fade-in zoom-in w-full max-w-lg rounded-2xl bg-white shadow-2xl duration-200">
            <div className="flex items-center justify-between border-b p-6">
              <h2 className="text-xl font-bold text-slate-800">Thêm thẻ mới</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-2xl text-slate-400 hover:text-slate-600"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleAddCard} className="space-y-5 p-6">
              <div>
                <label className="mb-2 block text-sm font-bold tracking-wide text-slate-700 uppercase">
                  Mặt trước (Câu hỏi/Từ vựng)
                </label>
                <textarea
                  rows="3"
                  required
                  placeholder="Nhập nội dung mặt trước..."
                  className="focus:ring-primary/10 focus:border-primary w-full resize-none rounded-xl border border-slate-200 px-4 py-3 transition outline-none focus:ring-4"
                  value={newCard.front_text}
                  onChange={(e) =>
                    setNewCard({ ...newCard, front_text: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-bold tracking-wide text-slate-700 uppercase">
                  Mặt sau (Đáp án/Giải nghĩa)
                </label>
                <textarea
                  rows="3"
                  required
                  placeholder="Nhập nội dung mặt sau..."
                  className="focus:ring-primary/10 focus:border-primary w-full resize-none rounded-xl border border-slate-200 px-4 py-3 transition outline-none focus:ring-4"
                  value={newCard.back_text}
                  onChange={(e) =>
                    setNewCard({ ...newCard, back_text: e.target.value })
                  }
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 rounded-xl bg-slate-100 px-4 py-3 font-bold text-slate-600 transition hover:bg-slate-200"
                >
                  Xong
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-primary hover:bg-primary/90 shadow-primary/20 flex-1 rounded-xl px-4 py-3 font-bold text-white shadow-lg transition disabled:opacity-50"
                >
                  {submitting ? 'Đang lưu...' : 'Thêm vào bộ thẻ'}
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
