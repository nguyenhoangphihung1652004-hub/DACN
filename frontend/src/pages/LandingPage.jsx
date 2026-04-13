import React, { useState, useCallback, useMemo } from 'react';
import { FaFacebookF } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import Login from './Auth/Login';
import Register from './Auth/Register';

// --- SUB-COMPONENTS ---

const NavLink = ({ children }) => (
  <a href="#" className="text-[10px] font-black tracking-[0.2em] text-slate-400 uppercase hover:text-primary transition-all relative group">
    {children}
    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
  </a>
);

const FeatureCard = ({ title, icon, desc }) => (
  <div className="group bg-white p-10 rounded-4xl border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-primary/5 hover:-translate-y-2 transition-all duration-500 relative overflow-hidden">
    <div className="absolute -right-4 -top-4 text-primary/5 text-8xl font-black group-hover:rotate-12 transition-transform duration-500 pointer-events-none">
      {icon}
    </div>
    <div className="bg-slate-50 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-8 group-hover:bg-primary/10 transition-colors">
      {icon}
    </div>
    <h4 className="text-xl font-black text-slate-900 mb-4 tracking-tight">{title}</h4>
    <p className="text-sm font-medium text-slate-500 leading-relaxed">{desc}</p>
  </div>
);

const LandingPage = () => {
  const [authMode, setAuthMode] = useState(null);
  const closeAuth = useCallback(() => setAuthMode(null), []);

  const features = useMemo(() => [
    { title: 'Quản lý bộ thẻ', icon: '📚', desc: 'Tổ chức kho kiến thức theo từng chủ đề với giao diện trực quan và khoa học.' },
    { title: 'Thuật toán SM-2', icon: '🎯', desc: 'Tối ưu hóa việc ghi nhớ bằng cách lặp lại kiến thức vào thời điểm vàng.' },
    { title: 'Thống kê chi tiết', icon: '📈', desc: 'Theo dõi biểu đồ tiến bộ hàng ngày để duy trì động lực học tập bền bỉ.' },
  ], []);

  return (
    <div className="min-h-screen bg-[#FDFDFF] text-slate-900 selection:bg-primary/20 selection:text-primary">
      
      {/* ================= NAVIGATION ================= */}
      <nav className="fixed top-0 inset-x-0 z-50 h-24 flex items-center justify-between px-8 md:px-12 bg-white/70 backdrop-blur-2xl border-b border-slate-50">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-xl group-hover:bg-primary transition-colors">M</div>
          <span className="font-black text-xl tracking-tighter">Memo.Space</span>
        </div>

        <div className="hidden md:flex items-center gap-12">
          {['Tính năng', 'Giải pháp', 'Cộng đồng'].map((item) => (
            <NavLink key={item}>{item}</NavLink>
          ))}
        </div>

        <div className="flex items-center gap-6">
          <button 
            onClick={() => setAuthMode('login')}
            className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors"
          >
            Đăng nhập
          </button>
          <button 
            onClick={() => setAuthMode('register')}
            className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-xl shadow-slate-200 hover:bg-primary hover:shadow-primary/30 hover:-translate-y-0.5 active:scale-95 transition-all"
          >
            Bắt đầu ngay
          </button>
        </div>
      </nav>

      <main className="pt-24">
        {/* ================= HERO SECTION ================= */}
        <section className="max-w-7xl mx-auto px-8 py-20 lg:py-32 grid lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7 space-y-10 animate-in fade-in slide-in-from-left duration-1000">
            <div className="inline-flex items-center gap-3 bg-primary/5 px-5 py-2 rounded-full">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-ping"></span>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Phương pháp học tập 4.0</span>
            </div>

            <h1 className="text-7xl md:text-8xl lg:text-9xl font-black tracking-tight leading-[0.85] text-slate-900">
              Học ít hơn, <br />
              <span className="text-primary italic relative">
                Nhớ lâu hơn.
                <svg className="absolute -bottom-2 left-0 w-full h-3 text-primary/20" viewBox="0 0 100 10" preserveAspectRatio="none">
                  <path d="M0 5 Q 25 0 50 5 T 100 5" stroke="currentColor" strokeWidth="4" fill="transparent" />
                </svg>
              </span>
            </h1>

            <p className="max-w-xl text-lg md:text-xl font-medium text-slate-500 leading-relaxed">
              Ứng dụng khoa học não bộ <span className="text-slate-900 font-bold">Spaced Repetition</span> để biến kiến thức ngắn hạn thành trí nhớ vĩnh cửu.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-8 pt-6">
              <button 
                onClick={() => setAuthMode('register')}
                className="w-full sm:w-auto bg-primary text-white px-12 py-6 rounded-4xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-primary/40 hover:scale-105 active:scale-95 transition-all"
              >
                Trải nghiệm miễn phí
              </button>
              
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3].map(i => (
                    <img key={i} src={`https://i.pravatar.cc/100?u=${i+10}`} className="w-12 h-12 rounded-full border-4 border-white shadow-sm shadow-slate-200" alt="user" />
                  ))}
                </div>
                <div className="leading-tight">
                  <p className="text-slate-900 font-black text-sm">2,000+ Students</p>
                  <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest">Joined this week</p>
                </div>
              </div>
            </div>
          </div>

          {/* FLOATING CARD DECOR */}
          <div className="lg:col-span-5 relative animate-in zoom-in duration-1000 delay-200">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 rounded-full blur-[120px]"></div>
            
            <div className="relative bg-white p-10 rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border border-slate-50 rotate-3 hover:rotate-0 transition-transform duration-700 group">
               <div className="flex justify-between items-center mb-16">
                  <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center text-2xl group-hover:animate-bounce">🧠</div>
                  <div className="space-y-2">
                    <div className="w-20 h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="w-2/3 h-full bg-primary animate-pulse"></div>
                    </div>
                    <div className="w-12 h-2 bg-slate-50 rounded-full"></div>
                  </div>
               </div>
               
               <div className="space-y-6 mb-12 text-center">
                  <h3 className="text-3xl font-black tracking-tight text-slate-900">Kỹ thuật SM-2</h3>
                  <p className="text-slate-400 font-medium italic">"Lặp lại ngắt quãng giúp não bộ tối ưu hóa việc lưu trữ thông tin."</p>
               </div>

               <div className="grid grid-cols-2 gap-4">
                  <div className="bg-orange-50 text-orange-500 p-5 rounded-3xl text-center">
                    <p className="text-[10px] font-black uppercase tracking-widest">Khó quá</p>
                  </div>
                  <div className="bg-emerald-50 text-emerald-500 p-5 rounded-3xl text-center">
                    <p className="text-[10px] font-black uppercase tracking-widest">Đã thuộc</p>
                  </div>
               </div>
            </div>
          </div>
        </section>

        {/* ================= FEATURES ================= */}
        <section className="bg-slate-50/50 py-32 px-8">
          <div className="max-w-7xl mx-auto">
            <div className="mb-20 text-center space-y-4">
               <h2 className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Tính năng cốt lõi</h2>
               <p className="text-4xl font-black text-slate-900 tracking-tight md:text-5xl">Mọi thứ bạn cần để thông thái hơn</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {features.map((f, i) => (
                <FeatureCard key={i} {...f} />
              ))}
            </div>
          </div>
        </section>

        {/* ================= CTA BANNER ================= */}
        <section className="px-8 py-32">
          <div className="max-w-6xl mx-auto bg-slate-900 rounded-[4rem] p-16 md:p-24 relative overflow-hidden group">
            {/* Background Decor */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -mr-48 -mt-48 transition-all group-hover:bg-primary/30"></div>
            
            <div className="relative z-10 text-center space-y-12">
              <h2 className="text-5xl md:text-7xl font-black text-white leading-tight tracking-tight">
                Sẵn sàng bứt phá <br />
                <span className="text-primary italic">giới hạn trí nhớ?</span>
              </h2>
              <div className="flex flex-col sm:flex-row justify-center gap-6">
                <button onClick={() => setAuthMode('register')} className="bg-primary text-white px-12 py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                  Đăng ký miễn phí
                </button>
                <button className="bg-white/10 backdrop-blur-md text-white border border-white/10 px-12 py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-white/20 transition-all">
                  Xem bản Demo
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ================= MODAL AUTH ================= */}
      {authMode && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-6 backdrop-blur-xl bg-slate-900/40 animate-in fade-in duration-300">
          <div className="absolute inset-0" onClick={closeAuth} />
          
          <div className="relative bg-white w-full max-w-lg rounded-[3.5rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.3)] overflow-hidden animate-in zoom-in-95 duration-500 border border-white">
            <div className="h-3 bg-primary w-full"></div>
            
            <div className="p-10 md:p-14">
              <div className="text-center mb-10 space-y-2">
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">
                  {authMode === 'login' ? 'Chào trở lại!' : 'Chào bạn mới!'}
                </h2>
                <p className="text-slate-400 font-medium">Bắt đầu hành trình học tập cùng Memo.Space</p>
              </div>

              {/* Toggle Login/Register */}
              <div className="bg-slate-50 p-1.5 rounded-2xl flex mb-10">
                <button 
                  onClick={() => setAuthMode('login')}
                  className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${authMode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
                >
                  Đăng nhập
                </button>
                <button 
                  onClick={() => setAuthMode('register')}
                  className={`flex-1 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${authMode === 'register' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'}`}
                >
                  Đăng ký
                </button>
              </div>

              <div className="space-y-6">
                {authMode === 'login' ? <Login /> : <Register />}
              </div>

              <div className="relative py-8 flex items-center">
                <div className="flex-1 border-t border-slate-100"></div>
                <span className="px-4 text-[10px] font-black text-slate-300 uppercase tracking-widest">Hoặc đăng nhập qua</span>
                <div className="flex-1 border-t border-slate-100"></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button className="flex items-center justify-center gap-3 py-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-all font-bold text-sm">
                  <FcGoogle className="text-xl" /> Google
                </button>
                <button className="flex items-center justify-center gap-3 py-4 rounded-2xl border border-slate-100 hover:bg-slate-50 transition-all font-bold text-sm">
                  <div className="bg-[#1877F2] p-1 rounded-md text-white text-[10px]"><FaFacebookF /></div> Facebook
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER */}
      <footer className="py-20 border-t border-slate-50 bg-white text-center space-y-8">
          <div className="font-black text-2xl tracking-tighter grayscale opacity-20 hover:opacity-100 hover:grayscale-0 transition-all cursor-pointer">Memo.Space</div>
          <div className="flex justify-center gap-10 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <a href="#" className="hover:text-primary transition-colors">Facebook</a>
            <a href="#" className="hover:text-primary transition-colors">GitHub</a>
            <a href="#" className="hover:text-primary transition-colors">Contact</a>
          </div>
          <p className="text-[10px] font-bold text-slate-200 uppercase tracking-[0.4em]">© 2026 Minimalist Learning System</p>
      </footer>
    </div>
  );
};

export default LandingPage;