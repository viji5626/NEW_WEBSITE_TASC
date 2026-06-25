import { scrollToId } from "@/lib/scrollTo";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Linkedin } from "lucide-react";

const COLS = [
  {
    title: "STACK",
    links: [
      ["Automation & PLC", "the-arsenal"],
      ["SCADA & Visualization", "the-arsenal"],
      ["OT Networking", "the-arsenal"],
      ["EMS", "the-arsenal"],
      ["Digitalization & IIoT", "the-arsenal"],
    ],
  },
  {
    title: "PIPELINE",
    links: [
      ["Technical Stack", "technical-stack"],
      ["Industries", "rugged-reliability"],
      ["Case Studies", "case-studies"],
      ["Method", "how-we-build"],
      ["AMC / Support", "amc-model"],
    ],
  },
  {
    title: "FIRM",
    links: [
      ["Consulting", "we-consult"],
      ["Micro Services", "micro-services"],
      ["Technical FAQ", "faq"],
      ["About", "tenacious-by-design"],
      ["Contact", "terminal-interface"],
    ],
  },
];

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: null,
      email: null,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export default function Footer() {
  const navigate = useNavigate();
  const location = useLocation();
  const [visitorCount, setVisitorCount] = useState<number | null>(null);

  useEffect(() => {
    async function initVisitorCounter() {
      const path = "site_stats/global";
      try {
        const counterRef = doc(db, "site_stats", "global");
        
        // 1. Check if we have counted this session's visit
        const sessionVisited = sessionStorage.getItem("tasc_visited");
        
        if (!sessionVisited) {
          sessionStorage.setItem("tasc_visited", "true");
          // Increment or initialize the count in a single robust call
          try {
            await setDoc(counterRef, {
              count: increment(1)
            }, { merge: true });
          } catch (writeErr) {
            handleFirestoreError(writeErr, OperationType.WRITE, path);
          }
        }
        
        // 2. Fetch the current count
        try {
          const docSnap = await getDoc(counterRef);
          if (docSnap.exists()) {
            setVisitorCount(docSnap.data().count);
          } else {
            setVisitorCount(1);
          }
        } catch (readErr) {
          handleFirestoreError(readErr, OperationType.GET, path);
        }
      } catch (err) {
        console.error("Error with visitor counter:", err);
      }
    }

    initVisitorCounter();
  }, []);

  const handleLinkClick = (title: string, id: string) => {
    if (id === "micro-services") {
      navigate('/micro-services');
      return;
    }
    if (id === "consulting") {
      navigate('/consulting');
      return;
    }
    if (id === "faq") {
      navigate('/faq');
      return;
    }
    
    if (location.pathname !== "/") {
      navigate('/');
      setTimeout(() => {
        scrollToId(id);
      }, 300);
    } else {
      scrollToId(id);
    }
  };

  return (
    <footer
      data-testid="site-footer"
      className="relative border-t border-tasc-border mt-20 bg-tasc-bg z-10"
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-10 lg:px-16 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <img
              src="/brand/tasc-logo-dark.png"
              alt="TASC — Tenacious Automation Solutions & Consulting"
              className="h-10 md:h-12 w-auto object-contain mb-4 brand-logo"
              draggable={false}
            />
            <div className="font-display text-lg md:text-xl font-bold text-tasc-text mb-5 leading-tight tracking-tight whitespace-nowrap">
              Tenacious Automation<br/><span className="text-tasc-cyan">Solutions & Consulting</span>
            </div>
            <p className="text-tasc-text/55 text-sm font-light leading-relaxed max-w-md">
              Transforming Industrial Logix. Engineering intelligent, high-availability PLC,
              SCADA, EMS, Digitalization, and IIoT solutions. We deliver complete plant-level digital transformation projects for mission-critical industrial operations.
            </p>

            <div className="mt-8 flex items-center gap-4 font-[Orbitron] text-[10px] tracking-[0.25em] text-tasc-text/40">
              <span className="w-1.5 h-1.5 rounded-full bg-tasc-cyan animate-pulse shadow-[0_0_8px_var(--tasc-glow)]" />
              <span>SYSTEM ONLINE</span>
            </div>
          </div>

          {COLS.map((c) => (
            <div key={c.title} className="md:col-span-2">
              <div className="font-[Orbitron] text-[10px] tracking-[0.3em] text-tasc-text/40 mb-4">
                {c.title}
              </div>
              <ul className="space-y-2">
                {c.links.map(([t, id]) => (
                  <li key={t + id}>
                    <button
                      data-testid={`footer-link-${t.toLowerCase().replace(/\s|&/g, "-")}`}
                      onClick={() => handleLinkClick(t, id)}
                      className="text-tasc-text/70 hover:text-tasc-cyan text-sm transition-colors text-left"
                    >
                      {t}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="md:col-span-2">
            <div className="font-[Orbitron] text-[10px] tracking-[0.3em] text-tasc-text/40 mb-4">
              REACH
            </div>
            <div className="flex flex-col gap-3">
              <a
                data-testid="footer-email"
                href="mailto:info@tascautomation.com"
                className="text-tasc-text/70 hover:text-tasc-cyan text-sm transition-colors break-all"
              >
                info@tascautomation.com
              </a>
              <a
                href="https://www.linkedin.com/in/vijay-shankar-TASC"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-tasc-text/70 hover:text-tasc-cyan text-sm transition-colors group mt-1"
              >
                <Linkedin size={15} strokeWidth={1.5} className="text-tasc-cyan shrink-0 transition-transform group-hover:scale-110" />
                <span className="font-sans">LinkedIn</span>
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-tasc-border flex flex-wrap items-center justify-between gap-6">
          <div className="font-[Orbitron] text-[10px] tracking-[0.3em] text-tasc-border">
            © {new Date().getFullYear()} TASC AUTOMATION · ALL SYSTEMS RIGHTS RESERVED
          </div>
          
          <div className="flex items-center gap-2.5 border border-tasc-border bg-slate-950/80 px-3 py-1.5 rounded text-[9px] tracking-[0.2em] font-[Orbitron] text-tasc-cyan">
            <span className="w-1.5 h-1.5 rounded-full bg-tasc-cyan animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
            <span>VISIT TELEMETRY:</span>
            <span className="text-white font-mono text-[11px] font-bold tracking-widest bg-tasc-bg/80 px-2 py-0.5 border border-tasc-cyan/20 rounded">
              {visitorCount !== null ? String(visitorCount).padStart(6, "0") : "------"}
            </span>
          </div>

          <div className="font-[Orbitron] text-[10px] tracking-[0.3em] text-tasc-border">
            Website Developed & Deployed by TASC Automation
          </div>
        </div>
      </div>
    </footer>
  );
}
