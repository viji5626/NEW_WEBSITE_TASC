import { scrollToId } from "@/lib/scrollTo";

const COLS = [
  {
    title: "STACK",
    links: [
      ["Automation & PLC", "the-arsenal"],
      ["SCADA & Visualization", "the-arsenal"],
      ["OT Networking", "the-arsenal"],
      ["EMS", "the-arsenal"],
      ["IIoT", "the-arsenal"],
    ],
  },
  {
    title: "PIPELINE",
    links: [
      ["Technical Stack", "technical-stack"],
      ["Interoperability", "data-flow-pipeline"],
      ["Industries", "rugged-reliability"],
      ["Case Studies", "case-studies"],
      ["Method", "how-we-build"],
      ["AMC / Support", "amc-model"],
    ],
  },
  {
    title: "FIRM",
    links: [
      ["About", "tenacious-by-design"],
      ["Contact", "terminal-interface"],
    ],
  },
];

export default function Footer() {
  return (
    <footer
      data-testid="site-footer"
      className="relative border-t border-[#2B313A] mt-20 bg-[#0D1117] z-10"
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-10 lg:px-16 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-5">
            <img
              src="/brand/tasc-logo-dark.png"
              alt="TASC — Tenacious Automation Solutions & Consulting"
              className="h-16 md:h-20 w-auto object-contain mb-5"
              draggable={false}
            />
            <p className="text-[#E6EDF3]/55 text-sm font-light leading-relaxed max-w-md">
              Transforming Industrial Logix. Engineering intelligent, high-availability PLC,
              SCADA, EMS and IIoT architectures for mission-critical industrial operations.
            </p>

            <div className="mt-8 flex items-center gap-4 font-[Orbitron] text-[10px] tracking-[0.25em] text-[#E6EDF3]/40">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00C2FF] animate-pulse shadow-[0_0_8px_#00C2FF]" />
              <span>TASC · ENGINEERING ONLINE</span>
            </div>
          </div>

          {COLS.map((c) => (
            <div key={c.title} className="md:col-span-2">
              <div className="font-[Orbitron] text-[10px] tracking-[0.3em] text-[#E6EDF3]/40 mb-4">
                {c.title}
              </div>
              <ul className="space-y-2">
                {c.links.map(([t, id]) => (
                  <li key={t + id}>
                    <button
                      data-testid={`footer-link-${t.toLowerCase().replace(/\s|&/g, "-")}`}
                      onClick={() => scrollToId(id)}
                      className="text-[#E6EDF3]/70 hover:text-[#00C2FF] text-sm transition-colors text-left"
                    >
                      {t}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          <div className="md:col-span-1">
            <div className="font-[Orbitron] text-[10px] tracking-[0.3em] text-[#E6EDF3]/40 mb-4">
              REACH
            </div>
            <a
              data-testid="footer-email"
              href="mailto:info@tascautomation.com"
              className="text-[#E6EDF3]/70 hover:text-[#00C2FF] text-sm transition-colors break-all"
            >
              info@tascautomation.com
            </a>
          </div>
        </div>

        <div className="mt-14 pt-6 border-t border-[#2B313A] flex flex-wrap items-center justify-between gap-3">
          <div className="font-[Orbitron] text-[10px] tracking-[0.3em] text-[#2B313A]">
            © {new Date().getFullYear()} TASC AUTOMATION · ALL SYSTEMS RIGHTS RESERVED
          </div>
          <div className="font-[Orbitron] text-[10px] tracking-[0.3em] text-[#2B313A]">
            BUILD · 03.07.A
          </div>
        </div>
      </div>
    </footer>
  );
}
