import { useState } from "react";
import { motion } from "framer-motion";
import { SectionHeader } from "./Capabilities";
import { scrollToId } from "@/lib/scrollTo";

const SCOPES = [
  {
    id: "process",
    label: "Full Process Plant",
    body: "End-to-end coverage of process units — PLC, SCADA, network, panels, instrumentation and historian as one auditable system.",
  },
  {
    id: "machine",
    label: "Standalone Machine",
    body: "Single-machine cover for dedicated machines, SPMs, packaging lines and OEM equipment — predictable response on every breakdown.",
  },
  {
    id: "utility",
    label: "Plant Utility Control System",
    body: "Power, water, compressed air, steam, HVAC and effluent utilities — the systems your plant cannot run without.",
  },
  {
    id: "health",
    label: "PLC · VFD · SCADA Health",
    body: "Periodic health monitoring reports — diagnostics, scan time, comms quality, drive faults, alarm overrun and SCADA performance.",
  },
  {
    id: "db",
    label: "Database Optimization",
    body: "Historian, SQL and time-series database tuning — index hygiene, retention enforcement, backup verification and query performance.",
  },
];

const PLANS = [
  {
    id: "non-comp",
    code: "//08.A",
    name: "Non-Comprehensive",
    blurb: "Pay-per-incident with guaranteed response. You hold spares; we hold the engineering.",
    bestFor: "Plants with strong in-house electrical / instrumentation teams who need TASC only for engineering escalations.",
    features: [
      { t: "Remote diagnostics", v: true },
      { t: "Engineering escalation", v: true },
      { t: "On-call site visits", v: "Per-visit" },
      { t: "Spare parts", v: "Customer scope" },
      { t: "Health monitoring reports", v: "Quarterly" },
      { t: "DB optimization", v: "Annual" },
      { t: "Backup of PLC / SCADA / HMI projects", v: "Once / year" },
      { t: "Cyber / patch advisories", v: "Reactive" },
      { t: "Response time (P1 incidents)", v: "≤ 8 working hrs" },
      { t: "Spare PLC / VFD ready stock", v: false },
    ],
    cta: "[ REQUEST NON-COMPREHENSIVE PROPOSAL ]",
    accent: "#E6EDF3",
  },
  {
    id: "comp",
    code: "//08.B",
    name: "Comprehensive (All-Inclusive)",
    blurb: "Predictable annual outlay — engineering, response, spares, optimization, all-inclusive.",
    bestFor: "Mission-critical lines — substations, beneficiation, ZLD, automotive assembly — where downtime is expensive and predictable cost matters.",
    features: [
      { t: "Remote diagnostics", v: true },
      { t: "Engineering escalation", v: true },
      { t: "On-call site visits", v: "Unlimited (in SLA)" },
      { t: "Spare parts", v: "Included (per BOM)" },
      { t: "Health monitoring reports", v: "Monthly" },
      { t: "DB optimization", v: "Quarterly" },
      { t: "Backup of PLC / SCADA / HMI projects", v: "Quarterly + version-tagged" },
      { t: "Cyber / patch advisories", v: "Proactive + scheduled" },
      { t: "Response time (P1 incidents)", v: "≤ 4 working hrs" },
      { t: "Spare PLC / VFD ready stock", v: "Critical items pre-staged" },
    ],
    cta: "[ REQUEST COMPREHENSIVE PROPOSAL ]",
    accent: "#00C2FF",
    featured: true,
  },
];

export default function Amc() {
  const [tab, setTab] = useState(0);
  const p = PLANS[tab];

  const requestAMC = (planName) => {
    // Pre-fill scope on the contact form via a custom event the Contact section can consume.
    window.dispatchEvent(
      new CustomEvent("tasc:prefill-contact", {
        detail: { scope: `AMC enquiry — ${planName} plan.\n\nPlant / asset coverage:\n- \n\nApprox. tag count / I/O size:\n- \n\nIncumbent OEM stack:\n- ` },
      })
    );
    scrollToId("terminal-interface");
  };

  return (
    <section
      id="amc-model"
      data-testid="section-amc"
      className="relative py-24 md:py-32 border-t border-[#2B313A]"
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-10 lg:px-16">
        <SectionHeader code="// 08" kicker="LIFECYCLE SUPPORT" title="AMC model — keep the plant running." />
        <p className="mt-6 max-w-2xl text-[#E6EDF3]/55 text-base font-light leading-relaxed">
          Two contract shapes for industrial OT support — built around the realities of process
          plants, standalone machines, plant utility control systems, and the health of your PLC,
          VFD, SCADA and database layer.
        </p>

        {/* Coverage scopes */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-px bg-[#2B313A]/60 border border-[#2B313A]">
          {SCOPES.map((s, i) => (
            <motion.div
              key={s.id}
              data-testid={`amc-scope-${s.id}`}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.45, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#0D1117] p-5 trace-border"
            >
              <div className="font-[Orbitron] text-[9px] tracking-[0.3em] text-[#00C2FF] mb-2">
                //{String(i + 1).padStart(2, "0")}
              </div>
              <div className="font-[Montserrat] text-sm md:text-base text-[#E6EDF3] leading-snug">
                {s.label}
              </div>
              <p className="mt-2 text-[#E6EDF3]/55 text-xs font-light leading-relaxed">{s.body}</p>
            </motion.div>
          ))}
        </div>

        {/* Plan selector tabs (mobile) */}
        <div className="mt-12 md:hidden grid grid-cols-2 gap-px bg-[#2B313A]/60 border border-[#2B313A]">
          {PLANS.map((pl, i) => (
            <button
              key={pl.id}
              data-testid={`amc-tab-${pl.id}`}
              onClick={() => setTab(i)}
              className="text-left bg-[#0D1117] p-4"
              style={{ background: i === tab ? "rgba(31,143,255,0.06)" : "transparent" }}
            >
              <div className="font-[Orbitron] text-[9px] tracking-[0.25em]" style={{ color: i === tab ? "#00C2FF" : "#2B313A" }}>
                {pl.code}
              </div>
              <div className="font-[Montserrat] text-sm text-[#E6EDF3] mt-1">{pl.name}</div>
            </button>
          ))}
        </div>

        {/* Plans grid (desktop) + active panel (mobile) */}
        <div className="mt-12 hidden md:grid grid-cols-2 gap-px bg-[#2B313A]/60 border border-[#2B313A]">
          {PLANS.map((pl) => (
            <PlanCard key={pl.id} plan={pl} onRequest={() => requestAMC(pl.name)} />
          ))}
        </div>
        <div className="mt-px md:hidden border border-[#2B313A] bg-[#0D1117]">
          <PlanCard plan={p} onRequest={() => requestAMC(p.name)} />
        </div>
      </div>
    </section>
  );
}

function PlanCard({ plan, onRequest }) {
  return (
    <div
      data-testid={`amc-plan-${plan.id}`}
      className="relative bg-[#0D1117] p-8 md:p-10 flex flex-col"
      style={{
        boxShadow: plan.featured ? "inset 0 0 0 1px rgba(0,194,255,0.35)" : "none",
      }}
    >
      {plan.featured && (
        <div className="absolute -top-px left-0 right-0 h-px bg-[#00C2FF]" style={{ boxShadow: "0 0 14px #1F8FFF" }} />
      )}
      <div className="flex items-start justify-between">
        <div className="font-[Orbitron] text-[10px] tracking-[0.3em] text-[#00C2FF]">{plan.code}</div>
        {plan.featured && (
          <div className="font-[Orbitron] text-[9px] tracking-[0.3em] text-[#0D1117] bg-[#00C2FF] px-2 py-1">
            RECOMMENDED
          </div>
        )}
      </div>
      <h3 className="mt-3 font-[Montserrat] text-2xl md:text-3xl text-[#E6EDF3] font-medium leading-tight">
        {plan.name}
      </h3>
      <p className="mt-3 text-[#E6EDF3]/65 text-sm leading-relaxed font-light">{plan.blurb}</p>

      <div className="mt-5 font-[Orbitron] text-[9px] tracking-[0.3em] text-[#E6EDF3]/40">BEST FOR</div>
      <p className="mt-1 text-[#E6EDF3]/70 text-sm font-light leading-relaxed">{plan.bestFor}</p>

      <div className="mt-7 font-[Orbitron] text-[9px] tracking-[0.3em] text-[#E6EDF3]/40 mb-3">INCLUDES</div>
      <ul className="space-y-2 flex-1">
        {plan.features.map((f) => (
          <li key={f.t} className="grid grid-cols-[20px_1fr_auto] items-baseline gap-3 border-b border-[#2B313A] pb-2">
            {f.v === false ? (
              <span className="font-[Orbitron] text-[#2B313A]">×</span>
            ) : (
              <span className="font-[Orbitron] text-[#00C2FF]">●</span>
            )}
            <span className={`text-sm font-light ${f.v === false ? "text-[#E6EDF3]/35 line-through" : "text-[#E6EDF3]/85"}`}>
              {f.t}
            </span>
            {f.v !== true && f.v !== false && (
              <span className="font-[Orbitron] text-[10px] tracking-[0.15em] text-[#E6EDF3]/60 text-right">
                {f.v}
              </span>
            )}
          </li>
        ))}
      </ul>

      <button
        data-testid={`amc-cta-${plan.id}`}
        onClick={onRequest}
        className="group relative mt-8 self-start font-[Orbitron] text-[11px] tracking-[0.25em] px-6 py-4 border border-[#2B313A] text-[#E6EDF3] overflow-hidden hover:border-[#00C2FF] hover:text-[#0D1117] transition-colors"
      >
        <span className="absolute inset-0 bg-[#00C2FF] translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)]" />
        <span className="relative">{plan.cta}</span>
      </button>
    </div>
  );
}
