import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Loading from '../../components/common/Loading';

const FILTERS = [
  { key: 'all', label: 'Tất cả', emoji: '📚' },
  { key: 'public', label: 'Công khai', emoji: '🌍' },
  { key: 'private', label: 'Riêng tư', emoji: '🔒' },
];

const ManageDecks = () => {
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchDecks = async () => {
      try {
        // Giả lập API call
        await new Promise((resolve) => setTimeout(resolve, 700));
        setDecks([
          {
            id: 101,
            title: 'Tiếng Anh Giao Tiếp cơ bản',
            creator: 'Nguyễn Văn A',
            cardCount: 50,
            isPublic: true,
            createdAt: '2026-03-01',
          },
          {
            id: 102,
            title: 'Từ vựng N3 Nhật Ngữ',
            creator: 'Trần Thị B',
            cardCount: 120,
            isPublic: false,
            createdAt: '2026-03-05',
          },
          {
            id: 103,
            title: 'React Design Patterns',
            creator: 'Lê Minh C',
            cardCount: 24,
            isPublic: true,
            createdAt: '2026-03-10',
          },
        ]);
      } catch {
        toast.error('Không thể tải bộ thẻ');
      } finally {
        setLoading(false);
      }
    };

    fetchDecks();
  }, []);

  const handleDeleteDeck = (id) => {
    if (!window.confirm('Xóa bộ thẻ này? Thao tác này không thể hoàn tác.')) return;

    setDecks((prev) => prev.filter((d) => d.id !== id));
    toast.success('Đã xóa bộ thẻ khỏi hệ thống');
  };

  const filteredDecks = decks.filter((deck) => {
    if (filter === 'public') return deck.isPublic;
    if (filter === 'private') return !deck.isPublic;
    return true;
  });

  if (loading) return <Loading />;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* BENTO HEADER & FILTERS */}
      <div className="bg-white p-8 md:p-10 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col xl:flex-row xl:items-center justify-between gap-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-50 rounded-full blur-3xl -mr-20 -mt-20"></div>
        
        <div className="relative z-10">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Kho bộ thẻ
          </h1>
          <p className="text-slate-500 font-medium mt-1">
            Kiểm duyệt và điều phối nội dung học tập cộng đồng
          </p>
        </div>

        {/* CUSTOM FILTER TABS */}
        <div className="flex p-1.5 bg-slate-100/80 backdrop-blur-md rounded-2xl w-fit relative z-10">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`flex items-center gap-2 px-6 py-2.5 text-xs font-black uppercase tracking-widest transition-all duration-300 rounded-xl ${
                filter === f.key
                  ? 'bg-white text-slate-900 shadow-sm scale-100'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'
              }`}
            >
              <span>{f.emoji}</span>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT TABLE */}
      <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden px-4">
        <div className="overflow-x-auto">
          <table className="w-full border-separate border-spacing-y-3">
            <thead>
              <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                <th className="px-6 py-6 text-left font-black">Thông tin bộ thẻ</th>
                <th className="px-6 py-6 text-left font-black">Tác giả</th>
                <th className="px-6 py-6 text-center font-black">Quy mô</th>
                <th className="px-6 py-6 text-center font-black">Chế độ</th>
                <th className="px-6 py-6 text-right font-black">Hành động</th>
              </tr>
            </thead>

            <tbody>
              {filteredDecks.map((deck) => (
                <tr 
                  key={deck.id} 
                  className="group bg-white hover:bg-slate-50/50 transition-all duration-300 border border-transparent hover:border-slate-100 rounded-2xl shadow-none hover:shadow-xl hover:shadow-slate-200/20"
                >
                  <td className="px-6 py-5 first:rounded-l-2xl last:rounded-r-2xl border-y border-l border-transparent group-hover:border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black shadow-lg shadow-slate-200">
                        {deck.title.charAt(0)}
                      </div>
                      <div>
                        <div className="font-black text-slate-900 text-sm line-clamp-1">{deck.title}</div>
                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">ID: #{deck.id}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-5 border-y border-transparent group-hover:border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-500 font-bold tracking-tight">{deck.creator}</span>
                    </div>
                  </td>

                  <td className="px-6 py-5 text-center border-y border-transparent group-hover:border-slate-100">
                    <div className="inline-flex items-center justify-center bg-indigo-50 text-indigo-600 px-3 py-1 rounded-lg">
                       <span className="text-xs font-black">{deck.cardCount} thẻ</span>
                    </div>
                  </td>

                  <td className="px-6 py-5 text-center border-y border-transparent group-hover:border-slate-100">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      deck.isPublic 
                        ? 'bg-emerald-50 text-emerald-600' 
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      {deck.isPublic ? 'Public' : 'Private'}
                    </span>
                  </td>

                  <td className="px-6 py-5 text-right first:rounded-l-2xl last:rounded-r-2xl border-y border-r border-transparent group-hover:border-slate-100">
                    <div className="flex justify-end gap-2">
                      <button className="h-10 w-10 flex items-center justify-center rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-900 hover:text-white transition-all duration-300 shadow-sm active:scale-90">
                         👁️
                      </button>
                      <button 
                        onClick={() => handleDeleteDeck(deck.id)}
                        className="h-10 w-10 flex items-center justify-center rounded-xl bg-rose-50 text-rose-500 hover:bg-rose-600 hover:text-white transition-all duration-300 shadow-sm active:scale-90"
                      >
                         🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredDecks.length === 0 && (
          <div className="py-20 text-center">
            <div className="text-5xl mb-4 grayscale opacity-30">📦</div>
            <p className="text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">Kho dữ liệu trống</p>
          </div>
        )}
      </div>

      {/* DECORATIVE STATS FOOTER */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-indigo-600 p-8 rounded-4xl text-white flex justify-between items-center relative overflow-hidden group">
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase opacity-60 tracking-widest">Trung bình</p>
                <h4 className="text-3xl font-black mt-1">42 thẻ/bộ</h4>
              </div>
              <div className="text-4xl opacity-20 group-hover:scale-125 transition-transform duration-500">📈</div>
          </div>
          <div className="bg-white p-8 rounded-4xl border border-slate-100 flex justify-between items-center group">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tỉ lệ công khai</p>
                <h4 className="text-3xl font-black text-slate-900 mt-1">68%</h4>
              </div>
              <div className="w-12 h-12 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin-slow"></div>
          </div>
          <div className="bg-white p-8 rounded-4xl border border-slate-100 flex justify-between items-center group">
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tạo mới tuần này</p>
                <h4 className="text-3xl font-black text-slate-900 mt-1">+12</h4>
              </div>
              <div className="text-4xl animate-bounce-slow">✨</div>
          </div>
      </div>
    </div>
  );
};

export default ManageDecks;