import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import reviewApi from '../../api/review.api';
import { calculateSM2 } from '../../utils/sm2';
import Loading from '../../components/common/Loading';

const QUALITY = {
  AGAIN: 0,
  HARD: 3,
  GOOD: 4,
  EASY: 5,
};

const ReviewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  // ================= FETCH =================
  useEffect(() => {
    let mounted = true;

    const fetchCards = async () => {
      try {
        const data = await reviewApi.getDueCards(id);
        if (mounted) setCards(data);
      } catch {
        toast.error('Không thể tải thẻ ôn tập!', { id: 'fetch-review-error' });
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchCards();
    return () => (mounted = false);
  }, [id]);

  // ================= REVIEW =================
  const handleReview = async (quality) => {
    const currentCard = cards[currentIndex];
    if (!currentCard) return;

    const result = calculateSM2(
      quality,
      currentCard.repetitions || 0,
      currentCard.interval_days || 0,
      currentCard.ease_factor || 2.5
    );

    try {
      await reviewApi.updateCardProgress(currentCard.card_id, result);

      setIsFlipped(false);

      setTimeout(() => {
        if (currentIndex < cards.length - 1) {
          setCurrentIndex((prev) => prev + 1);
        } else {
          toast.success('🎉 Tuyệt vời! Bạn đã hoàn thành mục tiêu hôm nay.');
          setTimeout(() => navigate('/dashboard'), 1000);
        }
      }, 200);
    } catch {
      toast.error('Lỗi lưu tiến trình học');
    }
  };

  // ================= LOADING =================
  if (loading) return <Loading />;

  // ================= EMPTY STATE =================
  if (cards.length === 0) return (
    <div className="flex h-[60vh] flex-col items-center justify-center text-center">
      <div className="mb-6 text-6xl">🏆</div>
      <h2 className="text-2xl font-bold text-slate-800">Không còn thẻ nào cần ôn!</h2>
      <p className="text-slate-500 mt-2">
        Bạn đã hoàn thành hết các thẻ đến hạn. Hãy quay lại sau nhé.
      </p>
      <button 
        onClick={() => navigate('/dashboard')}
        className="mt-8 rounded-xl bg-primary px-8 py-3 font-bold text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
      >
        Về Dashboard
      </button>
    </div>
  );

  const currentCard = cards[currentIndex];
  const progressPercent = ((currentIndex + 1) / cards.length) * 100;

  return (
    <div className="mx-auto flex max-w-4xl flex-col items-center py-4">
      
      {/* Progress Bar & Counter */}
      <div className="mb-10 w-full max-w-2xl px-4">
        <div className="mb-3 flex items-center justify-between text-sm font-bold">
          <span className="text-slate-400 uppercase tracking-widest text-[10px]">
            Tiến độ ôn tập
          </span>
          <span className="text-primary font-mono bg-primary/10 px-2 py-0.5 rounded-md">
            {currentIndex + 1} / {cards.length}
          </span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 border border-slate-200">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-out shadow-[0_0_8px_rgba(var(--color-primary),0.5)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Flashcard */}
      <div className="perspective w-full max-w-2xl px-4">
        <div
          onClick={() => !isFlipped && setIsFlipped(true)}
          className={`relative h-100 w-full cursor-pointer transition-all duration-700 preserve-3d shadow-2xl rounded-4xl ${
            isFlipped ? 'rotate-y-180' : 'hover:-translate-y-1'
          }`}
        >
          {/* FRONT */}
          <div className="absolute inset-0 flex flex-col items-center justify-center rounded-4xl bg-white p-12 text-center backface-hidden border border-slate-100 shadow-sm">
            <span className="absolute top-8 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300">
              CÂU HỎI
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-800 leading-tight">
              {currentCard.front_text}
            </h2>
            <p className="absolute bottom-10 animate-bounce text-slate-400 text-xs font-medium">
              Chạm để lật thẻ 👆
            </p>
          </div>

          {/* BACK */}
          <div className="absolute inset-0 flex rotate-y-180 flex-col items-center justify-center rounded-4xl bg-slate-900 p-12 text-center backface-hidden text-white shadow-2xl overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1.5 bg-primary opacity-50"></div>
            <span className="absolute top-8 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
              ĐÁP ÁN
            </span>

            <div className="flex-1 flex items-center justify-center">
              <p className="text-xl md:text-2xl leading-relaxed font-medium">
                {currentCard.back_text}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* RATING */}
      <div className="mt-12 w-full max-w-2xl px-4 min-h-20">
        {isFlipped ? (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <button
              onClick={() => handleReview(QUALITY.AGAIN)}
              className="group flex flex-col items-center gap-1 rounded-2xl bg-red-50 p-4 transition-all hover:bg-red-100 border border-red-100 active:scale-95"
            >
              <span className="text-xs font-black uppercase text-red-600">Lặp lại</span>
              <span className="text-[10px] text-red-400">&lt; 1 phút</span>
            </button>

            <button
              onClick={() => handleReview(QUALITY.HARD)}
              className="group flex flex-col items-center gap-1 rounded-2xl bg-orange-50 p-4 transition-all hover:bg-orange-100 border border-orange-100 active:scale-95"
            >
              <span className="text-xs font-black uppercase text-orange-600">Khó</span>
              <span className="text-[10px] text-orange-400">2 ngày</span>
            </button>

            <button
              onClick={() => handleReview(QUALITY.GOOD)}
              className="group flex flex-col items-center gap-1 rounded-2xl bg-indigo-50 p-4 transition-all hover:bg-indigo-100 border border-indigo-100 active:scale-95"
            >
              <span className="text-xs font-black uppercase text-indigo-600">Tốt</span>
              <span className="text-[10px] text-indigo-400">4 ngày</span>
            </button>

            <button
              onClick={() => handleReview(QUALITY.EASY)}
              className="group flex flex-col items-center gap-1 rounded-2xl bg-emerald-50 p-4 transition-all hover:bg-emerald-100 border border-emerald-100 active:scale-95"
            >
              <span className="text-xs font-black uppercase text-emerald-600">Dễ</span>
              <span className="text-[10px] text-emerald-400">7 ngày</span>
            </button>
          </div>
        ) : (
          <div className="flex justify-center">
            <button
              onClick={() => setIsFlipped(true)}
              className="rounded-2xl bg-slate-900 px-12 py-4 font-black text-white shadow-xl transition-all hover:bg-primary active:scale-95 text-sm uppercase tracking-widest"
            >
              Hiển thị đáp án
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewPage;