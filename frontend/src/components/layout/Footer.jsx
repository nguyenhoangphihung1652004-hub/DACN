import { FaGithub, FaFacebook } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-6 py-10">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-4">
            <h2 className="text-primary text-lg font-bold">Flashcard Master</h2>
            <p className="text-sm leading-relaxed text-slate-500">
              Ứng dụng học tập sử dụng thuật toán SM-2 giúp bạn ghi nhớ kiến
              thức hiệu quả và lâu dài hơn.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="mb-4 text-xs font-semibold tracking-wider text-slate-700 uppercase">
              Khám phá
            </h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li>
                <Link to="/" className="hover:text-primary transition">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/decks" className="hover:text-primary transition">
                  Bộ thẻ
                </Link>
              </li>
              <li>
                <Link to="/review" className="hover:text-primary transition">
                  Ôn tập
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="mb-4 text-xs font-semibold tracking-wider text-slate-700 uppercase">
              Hỗ trợ
            </h3>
            <ul className="space-y-3 text-sm text-slate-600">
              <li className="flex items-center gap-2">
                <span>📧</span> support@flashcard.com
              </li>
              <li>
                <Link to="#" className="hover:text-primary transition">
                  Chính sách bảo mật
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-primary transition">
                  Điều khoản sử dụng
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-100 pt-6 md:flex-row">
          <p className="text-xs text-slate-400">
            © {currentYear} Flashcard Master. Made with ❤️
          </p>

          {/* Social icons */}
          <div className="flex items-center gap-4 text-slate-500">
            <a href="#" className="hover:text-primary transition">
              <FaGithub size={18} />
            </a>

            <a href="#" className="hover:text-primary transition">
              <FaFacebook size={18} />
            </a>
          </div>

          <span className="text-xs text-slate-400 italic">v1.0.0</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
