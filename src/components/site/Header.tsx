import { useEffect, useState } from "react";
import { scrollToId } from "@/lib/scrollTo";
import { Sun, Moon } from "lucide-react";

const NAV = [
  { code: "//01", label: "HOME", id: "command-center" },
  { code: "//02", label: "CAPABILITIES", id: "the-arsenal" },
  { code: "//03", label: "STACK", id: "technical-stack" },
  { code: "//04", label: "INTEROPERABILITY", id: "data-flow-pipeline" },
  { code: "//05", label: "INDUSTRIES", id: "rugged-reliability" },
  { code: "//06", label: "CASES", id: "case-studies" },
  { code: "//07", label: "METHOD", id: "how-we-build" },
  { code: "//08", label: "AMC", id: "amc-model" },
  { code: "//09", label: "ABOUT", id: "tenacious-by-design" },
  { code: "//10", label: "CONTACT", id: "terminal-interface" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [time, setTime] = useState("");
  const [isLightMode, setIsLightMode] = useState(false);

  useEffect(() => {
    // Check initial preference
    if (localStorage.theme === 'light' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: light)').matches)) {
      document.documentElement.classList.add('light');
      setIsLightMode(true);
    } else {
      document.documentElement.classList.remove('light');
    }
  }, []);

  const toggleTheme = () => {
    if (isLightMode) {
      document.documentElement.classList.remove('light');
      localStorage.theme = 'dark';
      setIsLightMode(false);
    } else {
      document.documentElement.classList.add('light');
      localStorage.theme = 'light';
      setIsLightMode(true);
    }
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

  return (
    <header
      data-testid="site-header"
      className="fixed top-0 left-0 right-0 z-[100] backdrop-blur-md bg-tasc-bg/85 border-b border-tasc-border"
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-10 lg:px-16">
        <div className="flex items-center justify-between h-16">
          {/* Logo wordmark */}
          <button
            data-testid="logo-button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center group shrink-0"
            aria-label="TASC home"
            style={{ minWidth: 120 }}
          >
            <img
              src="/brand/tasc-logo-dark.png"
              alt="TASC — Tenacious Automation Solutions & Consulting"
              width={132}
              height={52}
              className="select-none transition-all duration-300 brand-logo"
              style={{ height: 44, width: "auto", display: "block" }}
              draggable={false}
            />
          </button>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center">
            {NAV.map((n) => (
              <button
                key={n.id}
                data-testid={`nav-${n.label.toLowerCase()}`}
                onClick={() => {
                  if (n.label === "HOME") {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  } else {
                    scrollToId(n.id);
                  }
                }}
                className="px-1 xl:px-2 py-2 font-[Orbitron] text-[9px] xl:text-[10px] tracking-[0.15em] xl:tracking-[0.2em] text-tasc-text/70 hover:text-tasc-cyan transition-colors whitespace-nowrap"
                title={`${n.code} · ${n.label}`}
              >
                {n.label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 text-tasc-text/70 hover:text-tasc-cyan transition-colors border border-transparent hover:border-tasc-cyan rounded-none"
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
                  if (n.label === "HOME") {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  } else {
                    scrollToId(n.id);
                  }
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
