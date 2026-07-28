import { logout } from '@/actions/auth';

export default function Header() {
  return (
    <header className="bg-surface/40 backdrop-blur-[20px] shadow-sm flex justify-between items-center w-full px-margin-desktop h-16 docked full-width top-0 sticky z-50 border-b border-white/5">
      <div className="flex items-center gap-md">
        {/* Mobile Menu Toggle (Visible only on mobile) */}
        <button className="md:hidden text-on-surface-variant hover:text-primary transition-colors">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <div className="md:hidden font-headline-lg-mobile text-[24px] font-semibold text-primary tracking-tighter italic">FLOW</div>
        {/* Search Bar */}
        <div className="hidden md:flex items-center bg-surface-container/50 border border-white/10 rounded-full px-sm py-xs focus-within:border-primary-fixed-dim focus-within:shadow-[0_0_10px_rgba(153,203,255,0.2)] transition-all w-64">
          <span className="material-symbols-outlined text-on-surface-variant text-[18px] mr-xs">search</span>
          <input className="bg-transparent border-none text-data-mono font-data-mono text-on-surface focus:ring-0 w-full placeholder:text-on-surface-variant/50 text-sm outline-none" placeholder="Search insights..." type="text" />
        </div>
      </div>
      <div className="flex items-center gap-md">
        <button className="text-on-surface-variant hover:text-primary transition-all duration-300 relative group">
          <span className="material-symbols-outlined">notifications</span>
          <span className="absolute top-0 right-0 w-2 h-2 bg-secondary rounded-full shadow-[0_0_5px_#ebb2ff]"></span>
        </button>
        <form action={logout}>
          <button type="submit" className="text-on-surface-variant hover:text-error transition-all duration-300">
            <span className="material-symbols-outlined">logout</span>
          </button>
        </form>
        <div className="w-8 h-8 rounded-full overflow-hidden border border-white/20">
          <img alt="User Profile Avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8mjwcET0fw2jjuiL4WwhA_OVsuungFpHlVZtBTQp6YF46Rf9tE1Gty6isKLnOGeWfyjjI2-HploqdjUtth4gSMxT3fh-CmKh9NEtvuhWaHQcJboB6D7FGXKS1gD9K_2K6yHtNGxElkj5RypPd68Zq0fkDfrHLNoJYTdDeHNy9PdMw1K2x1boUckRNxRLkVFh7oYLfd7Mn6DMUGO_LfZY037-JVwFH7FG5cg1nD6cD0Dpx6H1bbEw4Pv9DODJeYepxL_oDdcNGZmc" />
        </div>
      </div>
    </header>
  );
}
