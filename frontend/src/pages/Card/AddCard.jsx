import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import cardApi from '../../api/card.api';
import toast from 'react-hot-toast';

const AddCard = () => {
  const { id } = useParams(); // deck_id
  const navigate = useNavigate();

  const [card, setCard] = useState({
    front_text: '',
    back_text: ''
  });

  const [loading, setLoading] = useState(false);

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await cardApi.create({
        ...card,
        deck_id: id
      });

      toast.success('Thêm thẻ thành công!');

      // ✅ QUAY VỀ ĐÚNG DECK
      navigate(`/decks/${id}`, { replace: true });

    } catch (error) {
      console.error(error);
      toast.error('Lỗi Backend: Không thể lưu thẻ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">

      {/* HEADER */}
      <div className="flex justify-between items-end">
        <div>
          {/* ✅ HỦY = Link về đúng deck */}
          <Link
            to={`/decks/${id}`}
            className="text-sm text-slate-500 hover:text-primary"
          >
            ← Quay lại bộ thẻ
          </Link>

          <h1 className="text-2xl font-bold text-slate-800 mt-2">
            Thêm thẻ mới
          </h1>

          <p className="text-slate-500 text-sm">
            Tạo nội dung front/back cho flashcard
          </p>
        </div>

        <span className="text-2xl">🧠</span>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-slate-100 rounded-3xl shadow-sm p-8 space-y-8"
      >

        {/* FRONT */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
            Mặt trước
          </label>

          <textarea
            required
            rows="4"
            placeholder="Nhập nội dung mặt trước..."
            className="w-full p-4 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition resize-none"
            value={card.front_text}
            onChange={(e) =>
              setCard({ ...card, front_text: e.target.value })
            }
          />
        </div>

        {/* BACK */}
        <div className="space-y-3">
          <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">
            Mặt sau
          </label>

          <textarea
            required
            rows="5"
            placeholder="Nhập nội dung mặt sau..."
            className="w-full p-4 rounded-xl border border-slate-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition resize-none"
            value={card.back_text}
            onChange={(e) =>
              setCard({ ...card, back_text: e.target.value })
            }
          />
        </div>

        {/* ACTIONS */}
        <div className="flex gap-3 pt-2">
          
          {/* ✅ HỦY */}
          <Link
            to={`/decks/${id}`}
            className="flex-1 text-center py-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition font-semibold"
          >
            Hủy
          </Link>

          {/* ✅ LƯU */}
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-primary text-white py-3 rounded-xl font-bold shadow-lg shadow-primary/30 hover:bg-primary/90 transition disabled:opacity-50"
          >
            {loading ? 'Đang lưu...' : 'Thêm thẻ'}
          </button>

        </div>
      </form>
    </div>
  );
};

export default AddCard;