import { useEffect, useState } from "react";
import { scrollToId, scrollToTop } from "@/lib/scrollTo";
import { Sun, Moon, LogOut, User as UserIcon, ChevronDown, ExternalLink, ArrowRight } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { auth, logout } from '@/lib/firebase';
import { User } from 'firebase/auth';
import { safeLocalStorage } from "@/lib/safeStorage";

interface NavItem {
  code: string;
  label: string;
  id: string;
  hasDropdown?: boolean;
}

const NAV: NavItem[] = [
  { code: "//01", label: "HOME", id: "command-center" },
  { code: "//02", label: "PRODUCT", id: "product", hasDropdown: true },
  { code: "//03", label: "CAPABILITIES", id: "the-arsenal" },
  { code: "//04", label: "STACK", id: "technical-stack" },
  { code: "//05", label: "INDUSTRIES", id: "rugged-reliability" },
  { code: "//06", label: "CASES", id: "case-studies" },
  { code: "//07", label: "METHOD", id: "how-we-build" },
  { code: "//08", label: "AMC", id: "amc-model" },
  { code: "//09", label: "CONSULTING", id: "we-consult" },
  { code: "//10", label: "ABOUT", id: "tenacious-by-design" },
  { code: "//11", label: "CONTACT", id: "terminal-interface" },
  { code: "//12", label: "MICRO SERVICES", id: "micro-services" },
  { code: "//13", label: "DOWNLOAD PROFILE", id: "download-profile" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [productDropdownOpen, setProductDropdownOpen] = useState(false);
  const [time, setTime] = useState("");
  const [isLightMode, setIsLightMode] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
       setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleThemeChange = () => {
      if (document.documentElement.classList.contains('light') || safeLocalStorage.getItem('theme') === 'light') {
        setIsLightMode(true);
      } else {
        setIsLightMode(false);
      }
    };

    // Check initial preference
    if (safeLocalStorage.getItem('theme') === 'light' || (!safeLocalStorage.has('theme') && window.matchMedia('(prefers-color-scheme: light)').matches)) {
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
      safeLocalStorage.setItem('theme', 'dark');
      setIsLightMode(false);
    } else {
      document.documentElement.classList.add('light');
      safeLocalStorage.setItem('theme', 'light');
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
    if (n.label === "PRODUCT") {
      navigate('/products/tasc-iiot-studio');
      setProductDropdownOpen(false);
      return;
    }

    if (n.label === "MICRO SERVICES") {
      navigate('/micro-services');
      return;
    }

    if (n.label === "DOWNLOAD PROFILE") {
      navigate('/download-profile');
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
          <nav className="hidden lg:flex flex-1 items-center justify-center lg:gap-0 xl:gap-0.5 2xl:gap-1.5">
            {NAV.map((n) => {
              if (n.hasDropdown) {
                return (
                  <div
                    key={n.id}
                    className="relative"
                    onMouseEnter={() => setProductDropdownOpen(true)}
                    onMouseLeave={() => setProductDropdownOpen(false)}
                  >
                    <button
                      data-testid={`nav-${n.label.toLowerCase()}`}
                      onClick={() => handleNavClick(n)}
                      className={`px-1.5 xl:px-2 py-2 font-[Orbitron] text-[8px] lg:text-[8.5px] xl:text-[9.5px] 2xl:text-[10px] tracking-[0.1em] xl:tracking-[0.15em] transition-colors whitespace-nowrap flex items-center gap-1 ${
                        location.pathname.startsWith('/product')
                          ? 'text-tasc-cyan font-bold'
                          : 'text-tasc-text/70 hover:text-tasc-cyan'
                      }`}
                      title={`${n.code} · ${n.label}`}
                    >
                      <span>{n.label}</span>
                      <ChevronDown size={11} className={`transition-transform duration-200 ${productDropdownOpen ? 'rotate-180 text-tasc-cyan' : ''}`} />
                    </button>

                    {/* Line-wise Product Dropdown */}
                    {productDropdownOpen && (
                      <div
                        className="absolute top-full left-0 w-80 bg-tasc-surface border border-tasc-cyan/40 shadow-2xl p-3 z-[120] text-left"
                        data-testid="products-dropdown-menu"
                      >
                        <div className="font-[Orbitron] text-[8.5px] tracking-[0.2em] text-tasc-text/60 uppercase pb-2 mb-2 border-b border-tasc-border flex items-center justify-between">
                          <span>COMMERCIAL SOFTWARE</span>
                          <span className="text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse" />
                            LIVE SUITE
                          </span>
                        </div>

                        {/* Line 1: TASC IIoT Studio */}
                        <button
                          onClick={() => {
                            navigate('/products/tasc-iiot-studio');
                            setProductDropdownOpen(false);
                          }}
                          className="w-full text-left p-3 bg-slate-50 dark:bg-slate-900/90 hover:bg-sky-50 dark:hover:bg-slate-800 border border-tasc-border/70 hover:border-tasc-cyan transition-all group block"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-[Orbitron] text-xs font-bold text-tasc-text group-hover:text-tasc-cyan transition-colors">
                              TASC IIoT Studio
                            </span>
                            <span className="font-[Orbitron] text-[8px] px-1.5 py-0.5 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/30 font-semibold">
                              V2.4 ENTERPRISE
                            </span>
                          </div>
                          <p className="text-[11px] text-tasc-text/70 font-light leading-snug">
                            Web SCADA, 3D Canvas &amp; Standalone IPC. Native Multivendor Driver Engine (no 3rd-party OPC server required).
                          </p>
                          <div className="mt-2 flex items-center justify-between font-[Orbitron] text-[9px]">
                            <span className="text-tasc-cyan flex items-center gap-1 font-semibold">
                              SPECS &amp; OFFLINE INSTALLER <ArrowRight size={10} />
                            </span>
                            <span className="text-emerald-700 dark:text-emerald-400 font-semibold">BUILT-IN DRIVERS</span>
                          </div>
                        </button>

                        {/* Direct App Link */}
                        <div className="mt-2 pt-2 border-t border-tasc-border flex items-center justify-between text-[10px] font-[Orbitron]">
                          <a
                            href="https://app.tascautomation.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setProductDropdownOpen(false)}
                            className="text-tasc-cyan hover:underline flex items-center gap-1.5 py-1 font-semibold"
                          >
                            <span>LAUNCH APP.TASCAUTOMATION.COM</span>
                            <ExternalLink size={11} />
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <button
                  key={n.id}
                  data-testid={`nav-${n.label.toLowerCase()}`}
                  onClick={() => handleNavClick(n)}
                  className={`px-1.5 xl:px-2 py-2 font-[Orbitron] text-[8px] lg:text-[8.5px] xl:text-[9.5px] 2xl:text-[10px] tracking-[0.1em] xl:tracking-[0.15em] transition-colors whitespace-nowrap ${
                    location.pathname === '/' && n.label === 'HOME' ? 'text-tasc-cyan' : 'text-tasc-text/70 hover:text-tasc-cyan'
                  }`}
                  title={`${n.code} · ${n.label}`}
                >
                  {n.label}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 xl:gap-4 shrink-0">
            {user && (
              <div className="flex items-center gap-2 mr-0 xl:mr-2 border-r border-tasc-border/50 pr-2 xl:pr-4">
                 <div className="w-6 h-6 rounded-full overflow-hidden bg-tasc-border flex items-center justify-center border border-tasc-cyan/30 shrink-0">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName || "User"} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <UserIcon size={14} className="text-tasc-cyan" />
                    )}
                 </div>
                 <span className="font-[Orbitron] text-[9px] xl:text-[10px] tracking-wider text-tasc-text/80 hidden sm:block whitespace-nowrap overflow-hidden text-ellipsis max-w-[80px] xl:max-w-[120px]">
                   HELLO, {user.displayName ? user.displayName.split(' ')[0].toUpperCase() : "USER"}
                 </span>
                 <button onClick={() => logout()} title="Sign Out" className="p-1.5 text-tasc-text/50 hover:text-red-400 transition-colors shrink-0">
                   <LogOut size={14} />
                 </button>
              </div>
            )}

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
           <div className="lg:hidden border-t border-tasc-border py-4 grid grid-cols-1 sm:grid-cols-2 gap-2 bg-tasc-bg" data-testid="mobile-nav-panel">
            {NAV.map((n) => {
              if (n.hasDropdown) {
                return (
                  <div key={n.id} className="border border-tasc-border/60 p-2.5 bg-tasc-surface col-span-1 sm:col-span-2">
                    <button
                      onClick={() => {
                        handleNavClick(n);
                        setOpen(false);
                      }}
                      className="w-full text-left font-[Orbitron] text-[10px] tracking-[0.25em] text-tasc-cyan font-bold flex items-center justify-between mb-1"
                    >
                      <span><span className="text-tasc-border mr-2">{n.code}</span>{n.label}</span>
                      <span className="text-[9px] text-emerald-700 dark:text-emerald-400">● LIVE PRODUCT</span>
                    </button>
                    <div className="pl-4 space-y-1.5 pt-1">
                      <button
                        onClick={() => {
                          navigate('/products/tasc-iiot-studio');
                          setOpen(false);
                        }}
                        className="block w-full text-left font-[Montserrat] text-xs text-tasc-text/90 hover:text-tasc-cyan py-1"
                      >
                        → TASC IIoT Studio (v2.4 Enterprise &amp; Community)
                      </button>
                      <a
                        href="https://app.tascautomation.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 font-[Montserrat] text-[11px] text-tasc-cyan hover:underline py-0.5"
                      >
                        <span>↗ Launch app.tascautomation.com</span>
                        <ExternalLink size={11} />
                      </a>
                    </div>
                  </div>
                );
              }

              return (
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
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}
