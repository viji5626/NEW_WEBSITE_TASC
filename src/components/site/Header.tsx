import { useEffect, useState } from "react";
import { scrollToId, scrollToTop } from "@/lib/scrollTo";
import { Sun, Moon } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const NAV = [
  { code: "//01", label: "HOME", id: "command-center" },
  { code: "//02", label: "CAPABILITIES", id: "the-arsenal" },
  { code: "//03", label: "STACK", id: "technical-stack" },
  { code: "//04", label: "INTEROPERABILITY", id: "data-flow-pipeline" },
  { code: "//05", label: "INDUSTRIES", id: "rugged-reliability" },
  { code: "//06", label: "CASES", id: "case-studies" },
  { code: "//07", label: "METHOD", id: "how-we-build" },
  { code: "//08", label: "AMC", id: "amc-model" },
  { code: "//09", label: "CONSULTING", id: "we-consult" },
  { code: "//10", label: "ABOUT", id: "tenacious-by-design" },
  { code: "//11", label: "CONTACT", id: "terminal-interface" },
  { code: "//12", label: "MICRO SERVICES", id: "micro-services" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState("");
  const [isLightMode, setIsLightMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleThemeChange = () => {
      if (document.documentElement.classList.contains('light') || localStorage.theme === 'light') {
        setIsLightMode(true);
      } else {
        setIsLightMode(false);
      }
    };

    // Check initial preference
    if (localStorage.theme === 'light' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: light)').matches)) {
      document.documentElement.classList.add('light');
      setIsLightMode(true);
    } else {
      document.documentElement.classList.remove('light');
    }

    window.addEventListener('theme-changed', handleThemeChange);
    return () => window.removeEventListener('theme-changed', handleThemeChange);
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.add('theme-transition');
    
    if (isLightMode) {
      document.documentElement.classList.remove('light');
      localStorage.theme = 'dark';
      setIsLightMode(false);
    } else {
      document.documentElement.classList.add('light');
      localStorage.theme = 'light';
      setIsLightMode(true);
    }
    
    setTimeout(() => {
      document.documentElement.classList.remove('theme-transition');
    }, 500);
  };

  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en-GB", {
      timeZone: "Asia/Kolkata",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const tick = () => setTime(`${fmt.format(new Date())} IST`);
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, []);

  const handleNavClick = (n: typeof NAV[0]) => {
    if (n.label === "MICRO SERVICES") {
      navigate('/micro-services');
      return;
    }
    
    if (location.pathname !== "/") {
      navigate('/');
      setTimeout(() => {
        if (n.label === "HOME") {
          scrollToTop();
        } else {
          scrollToId(n.id);
        }
      }, 300);
    } else {
      if (n.label === "HOME") {
        scrollToTop();
      } else {
        scrollToId(n.id);
      }
    }
  };

  return (
    <header
      data-testid="site-header"
      className={`fixed top-0 left-0 right-0 z-[100] backdrop-blur-md border-b border-tasc-border ${isLightMode ? 'bg-white/60' : 'bg-tasc-bg/85'}`}
    >
      <div className="w-full max-w-[1920px] mx-auto px-4 md:px-6 lg:px-8 xl:px-12">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Logo wordmark */}
          <div className="flex items-center gap-3 xl:gap-4 shrink-0">
            <button
              data-testid="logo-button"
              onClick={() => {
                if (location.pathname !== "/") {
                  navigate('/');
                }
                setTimeout(() => {
                  scrollToTop();
                }, 50);
              }}
              className="flex items-center group shrink-0"
              aria-label="TASC home"
              style={{ minWidth: 100 }}
            >
              <img
                src="/brand/tasc-logo-dark.png"
                alt="TASC"
                width={132}
                height={52}
                className="select-none transition-all duration-300 brand-logo"
                style={{ height: 38, width: "auto", display: "block" }}
                draggable={false}
              />
            </button>
            <div className="hidden lg:block font-display text-[9px] xl:text-xs font-bold text-tasc-text leading-[1.1] uppercase tracking-normal xl:tracking-tighter opacity-90 border-l border-tasc-border pl-2 xl:pl-3 whitespace-nowrap">
              Tenacious Automation<br/><span className="text-tasc-cyan">Solutions & Consulting</span>
            </div>
          </div>

          {/* Desktop nav */}
          <nav className="hidden lg:flex flex-1 items-center justify-center lg:gap-0 xl:gap-1 2xl:gap-2">
            {NAV.map((n) => (
              <button
                key={n.id}
                data-testid={`nav-${n.label.toLowerCase()}`}
                onClick={() => handleNavClick(n)}
                className="px-1.5 xl:px-2 py-2 font-[Orbitron] text-[8px] lg:text-[9px] xl:text-[10px] tracking-[0.1em] xl:tracking-[0.15em] text-tasc-text/70 hover:text-tasc-cyan transition-colors whitespace-nowrap"
                title={`${n.code} · ${n.label}`}
              >
                {n.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2 xl:gap-4 shrink-0">
            <button
              onClick={toggleTheme}
              className="p-2 mr-1 xl:mr-0 text-tasc-text/70 hover:text-tasc-cyan transition-colors border border-transparent hover:border-tasc-cyan rounded-none flex items-center justify-center"
              aria-label="Toggle theme"
            >
              {isLightMode ? <Moon size={16} /> : <Sun size={16} />}
            </button>

            {/* Status readout — only at very wide viewports so the nav has room */}
            <div className="hidden 2xl:flex items-center gap-2 font-[Orbitron] text-[10px] tracking-[0.2em] text-tasc-text/50">
              <span className="w-1.5 h-1.5 rounded-full bg-tasc-cyan shadow-[0_0_8px_var(--tasc-cyan)] animate-pulse" />
              <span className="tabular">{time}</span>
            </div>

            {/* Mobile menu */}
            <button
              data-testid="mobile-menu-toggle"
              onClick={() => setOpen((o) => !o)}
              className="lg:hidden font-[Orbitron] text-[10px] tracking-[0.25em] text-tasc-text/80 border border-tasc-border px-3 py-2 hover:border-tasc-cyan hover:text-tasc-cyan transition-colors"
            >
              {open ? "[ CLOSE ]" : "[ MENU ]"}
            </button>
          </div>
        </div>

        {open && (
           <div className="lg:hidden border-t border-tasc-border py-4 grid grid-cols-2 gap-2 bg-tasc-bg" data-testid="mobile-nav-panel">
            {NAV.map((n) => (
              <button
                key={n.id}
                data-testid={`nav-mobile-${n.label.toLowerCase()}`}
                onClick={() => {
                  handleNavClick(n);
                  setOpen(false);
                }}
                className="text-left px-3 py-2 font-[Orbitron] text-[10px] tracking-[0.25em] text-tasc-text/70 hover:text-tasc-cyan"
              >
                <span className="text-tasc-border mr-2">{n.code}</span>
                {n.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
