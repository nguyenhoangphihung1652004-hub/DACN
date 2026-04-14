const Footer = () => {
  return (
    <footer className="border-t border-slate-100 py-8 px-8 flex justify-between items-center bg-white/50">
      <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
        © {new Date().getFullYear()} <span className="text-slate-500">Focused Admin Console</span>
      </p>
      <div className="flex gap-4">
        <div className="h-1.5 w-1.5 rounded-full bg-slate-200"></div>
        <div className="h-1.5 w-1.5 rounded-full bg-slate-200"></div>
        <div className="h-1.5 w-1.5 rounded-full bg-slate-200"></div>
      </div>
    </footer>
  );
};

export default Footer;