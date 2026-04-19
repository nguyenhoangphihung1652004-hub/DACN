const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-slate-100 bg-white/50 py-8 px-8 flex flex-col md:flex-row items-center justify-between gap-4 transition-all duration-300">

      {/* Phần Bản quyền */}
      <div className="flex items-center gap-3">
        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></div>
        <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">
          © {currentYear} <span className="text-slate-900">Memo.Space</span> — Hệ thống học tập thông minh
        </p>
      </div>

      {/* Phần Mạng xã hội / Liên hệ */}
      <div className="flex items-center gap-8">
        {[
          { label: 'Facebook', path: 'https://web.facebook.com/adminpro21223' },
          { label: 'GitHub', path: 'https://github.com/HuyQuocNewBie/DACN' },
          { label: 'Zalo', path: 'https://zalo.me/0817095875' }
        ].map((link) => (
          <a 
            key={link.label}
            href={link.path}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-primary hover:-translate-y-px transition-all duration-300"
          >
            {link.label}
          </a>
        ))}
      </div>

    </footer>
  );
};

export default Footer;