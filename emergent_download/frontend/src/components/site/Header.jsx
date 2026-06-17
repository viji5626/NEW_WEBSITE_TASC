import { useEffect, useState } from "react";
import { scrollToId } from "@/lib/scrollTo";

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
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-[#0D1117]/85 border-b border-[#2B313A]"
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-10 lg:px-16">
        <div className="flex items-center justify-between h-16">
          {/* Logo wordmark */}
          <button
            data-testid="logo-button"
            onClick={() => scrollToId("command-center")}
            className="flex items-center group shrink-0"
            aria-label="TASC home"
            style={{ minWidth: 120 }}
          >
            <img
              src="/brand/tasc-logo-dark.png"
              alt="TASC — Tenacious Automation Solutions & Consulting"
              width={132}
              height={52}
              className="select-none"
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
                onClick={() => scrollToId(n.id)}
                className="px-1.5 xl:px-2 py-2 font-[Orbitron] text-[9px] xl:text-[10px] tracking-[0.15em] xl:tracking-[0.2em] text-[#E6EDF3]/70 hover:text-[#00C2FF] transition-colors whitespace-nowrap"
                title={`${n.code} · ${n.label}`}
              >
                {n.label}
              </button>
            ))}
          </nav>

          {/* Status readout — only at very wide viewports so the nav has room */}
          <div className="hidden 2xl:flex items-center gap-2 font-[Orbitron] text-[10px] tracking-[0.2em] text-[#E6EDF3]/50">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00C2FF] shadow-[0_0_8px_#00C2FF] animate-pulse" />
            <span className="tabular">{time}</span>
          </div>

          {/* Mobile menu */}
          <button
            data-testid="mobile-menu-toggle"
            onClick={() => setOpen((o) => !o)}
            className="lg:hidden font-[Orbitron] text-[10px] tracking-[0.25em] text-[#E6EDF3]/80 border border-[#2B313A] px-3 py-2 hover:border-[#00C2FF] hover:text-[#00C2FF] transition-colors"
          >
            {open ? "[ CLOSE ]" : "[ MENU ]"}
          </button>
        </div>

        {open && (
          <div className="lg:hidden border-t border-[#2B313A] py-3 grid grid-cols-1 sm:grid-cols-2 gap-1" data-testid="mobile-nav-panel">
            {NAV.map((n) => (
              <button
                key={n.id}
                data-testid={`nav-mobile-${n.label.toLowerCase()}`}
                onClick={() => {
                  scrollToId(n.id);
                  setOpen(false);
                }}
                className="text-left px-3 py-2 font-[Orbitron] text-[10px] tracking-[0.25em] text-[#E6EDF3]/70 hover:text-[#00C2FF]"
              >
                <span className="text-[#2B313A] mr-2">{n.code}</span>
                {n.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
