import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

const ManageDecks = () => {
  const [decks, setDecks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, public, private

  const fetchDecks = async () => {
    setLoading(true);
    try {
      // 👉 Khi có backend thật thì dùng:
      // const res = await adminApi.getAllDecks();
      // setDecks(res.data);

      // 👉 Mock data tạm để test UI
      const mockDecks = [
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
          title: 'Lập trình ReactJS từ A-Z',
          creator: 'Lê Văn C',
          cardCount: 35,
          isPublic: true,
          createdAt: '2026-03-10',
        },
      ];

      setDecks(mockDecks);
    } catch (error) {
      console.error(error);
      toast.error('Không thể tải danh sách bộ thẻ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDecks();
  }, []);

  const handleDeleteDeck = async (deckId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bộ thẻ này? Hành động này không thể hoàn tác.')) {
      try {
        // 👉 Backend thật:
        // await adminApi.deleteDeck(deckId);

        // Update UI
        setDecks((prev) => prev.filter((d) => d.id !== deckId));

        toast.success('Đã xóa bộ thẻ vi phạm');
      } catch (error) {
        console.error(error);
        toast.error('Xóa thất bại');
      }
    }
  };

  const filteredDecks = decks.filter((deck) => {
    if (filter === 'public') return deck.isPublic;
    if (filter === 'private') return !deck.isPublic;
    return true;
  });

  if (loading) {
    return <div className="p-6 text-center">Đang tải danh sách bộ thẻ...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Kiểm duyệt bộ thẻ</h1>
          <p className="text-slate-500 text-sm">
            Quản lý nội dung học tập trên toàn hệ thống
          </p>
        </div>

        <select
          className="px-4 py-2 border rounded-xl outline-none bg-white shadow-sm"
          onChange={(e) => setFilter(e.target.value)}
          value={filter}
        >
          <option value="all">Tất cả bộ thẻ</option>
          <option value="public">Chỉ bộ thẻ Công khai</option>
          <option value="private">Chỉ bộ thẻ Riêng tư</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 border-b border-slate-100">
            <tr>
              <th className="p-4 font-semibold text-slate-600 text-sm">Bộ thẻ</th>
              <th className="p-4 font-semibold text-slate-600 text-sm">Người tạo</th>
              <th className="p-4 font-semibold text-slate-600 text-sm text-center">
                Số thẻ
              </th>
              <th className="p-4 font-semibold text-slate-600 text-sm">Chế độ</th>
              <th className="p-4 font-semibold text-slate-600 text-sm text-right">
                Thao tác
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-50">
            {filteredDecks.map((deck) => (
              <tr key={deck.id} className="hover:bg-slate-50/50 transition">
                <td className="p-4 font-medium text-slate-800">{deck.title}</td>

                <td className="p-4 text-sm text-slate-600">
                  {deck.creator}
                </td>

                <td className="p-4 text-center text-sm font-bold text-primary">
                  {deck.cardCount}
                </td>

                <td className="p-4">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      deck.isPublic
                        ? 'bg-emerald-100 text-emerald-600'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {deck.isPublic ? 'Công khai' : 'Riêng tư'}
                  </span>
                </td>

                <td className="p-4 text-right">
                  <button className="text-blue-500 hover:underline text-sm mr-4">
                    Xem chi tiết
                  </button>

                  <button
                    onClick={() => handleDeleteDeck(deck.id)}
                    className="text-red-500 hover:bg-red-50 px-3 py-1 rounded-lg text-sm font-semibold transition"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredDecks.length === 0 && (
          <div className="p-10 text-center text-slate-400 italic">
            Không có bộ thẻ nào được tìm thấy.
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageDecks;