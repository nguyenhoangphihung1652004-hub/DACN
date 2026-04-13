import { useEffect, useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import Loading from '../../components/common/Loading';
import deckApi from '../../api/deck.api';

const ExplorePage = () => {
  const [allDecks, setAllDecks] = useState([]); // Lưu trữ toàn bộ dữ liệu từ API
  const [displayDecks, setDisplayDecks] = useState([]); // Dữ liệu sau khi lọc để hiển thị
  const [cloningId, setCloningId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const navigate = useNavigate();
  const isInitialMount = useRef(true);

  // Hàm gọi API lấy danh sách (chỉ gọi 1 lần khi load trang)
  const fetchPublicDecks = useCallback(async (isMounted) => {
    setLoading(true);
    try {
      const data = await deckApi.getPublic();
      if (isMounted) {
        setAllDecks(data);
        setDisplayDecks(data);
      }
    } catch {
      if (isMounted) {
        // Thêm ID để tránh hiện nhiều thông báo lỗi cùng lúc
        toast.error("Không thể tải danh sách bộ thẻ công khai", { id: 'fetch-decks-error' });
      }
    } finally {
      if (isMounted) setLoading(false);
    }
  }, []);

  // Effect khởi tạo dữ liệu
  useEffect(() => {
    let isMounted = true;
    fetchPublicDecks(isMounted);
    
    return () => {
      isMounted = false;
    };
  }, [fetchPublicDecks]);

  // Effect xử lý việc lọc dữ liệu tại Client (tối ưu hơn việc gọi API liên tục)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const filtered = allDecks.filter(d =>
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.description || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
    setDisplayDecks(filtered);
  }, [searchQuery, allDecks]);

  const handleDownload = async (deckId) => {
    if (cloningId) return;
    setCloningId(deckId);

    const clonePromise = deckApi.clone(deckId);

    toast.promise(clonePromise, {
      loading: 'Đang tải bộ thẻ về kho...',
      success: '🎉 Tải về thành công!',
      error: 'Tải bộ thẻ thất bại. Vui lòng thử lại.'
    }, { id: 'clone-toast' }); // Dùng ID để toast không bị đè

    try {
      await clonePromise;
      setTimeout(() => navigate('/decks'), 1500);
    } catch {
      // Đã có toast.promise xử lý hiển thị lỗi
    } finally {
      setCloningId(null);
    }
  };

  if (loading && allDecks.length === 0) {
    return <Loading />;
  }

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      {/* HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-slate-100 relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Khám phá cộng đồng
          </h1>
          <p className="text-slate-500 font-medium mt-2">
            Tìm kiếm và học hỏi từ các bộ thẻ được chia sẻ
          </p>
        </div>

        <div className="relative w-full lg:w-112.5 z-10">
          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl opacity-40">🔍</span>
          <input
            type="text"
            placeholder="Tìm bộ thẻ, chủ đề..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-primary/10 focus:bg-white focus:border-primary transition-all shadow-inner font-medium"
          />
        </div>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {displayDecks.map((deck) => (
          <div
            key={deck.id}
            className="group bg-white rounded-4xl border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 transition-all duration-500 p-8 flex flex-col h-full relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-full -mr-16 -mt-16 group-hover:bg-primary/5 transition-colors duration-500"></div>

            <div className="flex-1 relative z-10">
              <div className="flex justify-between items-start mb-6">
                <span className="text-[10px] font-black uppercase tracking-[0.15em] px-3 py-1.5 rounded-xl border-2 bg-emerald-50 text-emerald-500 border-emerald-100">
                  Cộng Đồng
                </span>
                <span className="text-[10px] font-black text-primary bg-primary/10 px-3 py-1.5 rounded-xl uppercase tracking-widest">
                  Miễn phí
                </span>
              </div>

              <h3 className="font-black text-slate-900 text-2xl mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                {deck.title}
              </h3>

              <p className="text-sm text-slate-400 font-medium italic flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px]">👤</span>
                {deck.author_name || 'Ẩn danh'}
              </p>
            </div>

            <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-50 relative z-10">
              <div className="flex flex-col">
                <span className="text-xl font-black text-slate-800">{deck.cards_count || 0}</span>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">
                  Thẻ Nhớ
                </span>
              </div>

              <button
                onClick={() => handleDownload(deck.id)}
                disabled={cloningId !== null}
                className="bg-slate-900 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-primary transition-all shadow-xl shadow-slate-200 hover:shadow-primary/30 active:scale-95 disabled:opacity-50"
              >
                {cloningId === deck.id ? 'Đang sao chép' : 'Tải về'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* EMPTY STATE */}
      {displayDecks.length === 0 && !loading && (
        <div className="text-center py-24 bg-white rounded-[2.5rem] border border-dashed border-slate-200 flex flex-col items-center">
          <div className="text-6xl mb-6 opacity-20">🏜️</div>
          <p className="text-slate-400 font-black uppercase tracking-widest text-sm">
            Không tìm thấy kết quả
          </p>
          <p className="text-slate-300 text-sm mt-2">
            Thử thay đổi từ khóa tìm kiếm nhé!
          </p>
          <button
            onClick={() => setSearchQuery('')}
            className="mt-6 text-primary font-medium hover:underline"
          >
            Xóa bộ lọc
          </button>
        </div>
      )}
    </div>
  );
};

export default ExplorePage;