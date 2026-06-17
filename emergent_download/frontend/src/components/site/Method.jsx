import { motion } from "framer-motion";
import { SectionHeader } from "./Capabilities";

const STEPS = [
  {
    n: "01",
    title: "Assess",
    body: "Process study, instrumentation survey, network and panel audit. Document the actual plant — not the as-drawn one.",
    span: [0, 24],
  },
  {
    n: "02",
    title: "Architect",
    body: "PLC, SCADA and OT-network design with redundancy, vendor-neutral selection and clear migration paths.",
    span: [18, 52],
  },
  {
    n: "03",
    title: "Deploy",
    body: "Panel build, site commissioning, controlled migration and rigorous documentation for the operations team.",
    span: [44, 78],
  },
  {
    n: "04",
    title: "Monitor & Optimize",
    body: "Historian, EMS, KPIs, lifecycle support — and continuous tuning to keep uptime where it should be.",
    span: [70, 100],
  },
];

export default function Method() {
  return (
    <section
      id="how-we-build"
      data-testid="section-method"
      className="relative py-24 md:py-32 border-t border-[#2B313A]"
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-10 lg:px-16">
        <SectionHeader code="// 07" kicker="HOW WE BUILD" title="Engineering, by method." />

        {/* Gantt-style timeline (desktop only — too narrow on phones) */}
        <div className="mt-16 border border-[#2B313A] bg-[#0D1117] hidden md:block" data-testid="method-gantt">
          <div className="flex items-center justify-between px-4 py-2 border-b border-[#2B313A]">
            <div className="font-[Orbitron] text-[10px] tracking-[0.25em] text-[#E6EDF3]/50">
              PROJECT TIMELINE · STANDARD ENGAGEMENT
            </div>
            <div className="font-[Orbitron] text-[10px] tracking-[0.25em] text-[#2B313A]">[ 06.A ]</div>
          </div>

          <div className="relative">
            {/* Tick header */}
            <div className="grid grid-cols-10 border-b border-[#2B313A]">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="border-r border-[#2B313A] last:border-r-0 h-7 flex items-end pb-1 pl-2">
                  <span className="font-[Orbitron] text-[8px] tracking-[0.2em] text-[#E6EDF3]/30">
                    W{i + 1}
                  </span>
                </div>
              ))}
            </div>

            {/* Bars */}
            <div className="relative">
              {STEPS.map((s, i) => {
                const left = s.span[0];
                const width = s.span[1] - s.span[0];
                return (
                  <div
                    key={s.n}
                    className="relative h-14 border-b border-[#2B313A] last:border-b-0"
                  >
                    {/* Track gridlines */}
                    <div className="absolute inset-0 grid grid-cols-10 pointer-events-none">
                      {Array.from({ length: 10 }).map((_, k) => (
                        <div key={k} className="border-r border-[#2B313A]/40 last:border-r-0" />
                      ))}
                    </div>
                    {/* Bar — always visible, with a one-shot CSS wipe-in animation */}
                    <motion.div
                      initial={{ clipPath: "inset(0 100% 0 0)" }}
                      whileInView={{ clipPath: "inset(0 0% 0 0)" }}
                      animate={{ clipPath: "inset(0 0% 0 0)" }}
                      viewport={{ once: true, amount: 0.05 }}
                      transition={{ duration: 0.7, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute top-1/2 -translate-y-1/2 h-6 bg-[#1F8FFF]/10 border border-[#00C2FF]"
                      style={{ left: `${left}%`, width: `${width}%` }}
                    >
                      <div className="absolute inset-y-0 left-0 w-1 bg-[#00C2FF]" />
                      <div className="px-3 h-full flex items-center gap-3">
                        <span className="font-[Orbitron] text-[9px] tracking-[0.25em] text-[#00C2FF]">
                          {s.n}
                        </span>
                        <span className="font-[Montserrat] text-sm text-[#E6EDF3] truncate">
                          {s.title}
                        </span>
                      </div>
                    </motion.div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Step descriptions */}
        <div className="mt-12 md:mt-12 grid grid-cols-1 md:grid-cols-4 gap-px bg-[#2B313A]/60 border border-[#2B313A]">
          {STEPS.map((s) => (
            <div key={s.n} className="bg-[#0D1117] p-6">
              <div className="font-[Orbitron] text-[10px] tracking-[0.3em] text-[#00C2FF]">
                STEP {s.n}
              </div>
              <h3 className="font-[Montserrat] text-xl mt-3 text-[#E6EDF3]">{s.title}</h3>
              <p className="mt-3 text-[#E6EDF3]/55 text-sm font-light leading-relaxed">{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
