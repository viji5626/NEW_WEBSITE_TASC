import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeader } from "./Capabilities";

const VERTICALS = [
  {
    id: "mining",
    code: "//04.01",
    name: "Mining & Beneficiation",
    body: "Iron and quartz beneficiation plants — crushing, screening, grinding, classification, magnetic separation and dewatering — coordinated through MELSEC iQ-R or S7-1500 architectures with load-sharing and sequence interlocks.",
    items: ["Beneficiation sequence control", "Crusher / screen / mill interlocks", "Magnetic separator coordination", "Dewatering & thickener logic"],
    photo: "/brand/vert-mining.jpg",
  },
  {
    id: "substation",
    code: "//04.02",
    name: "Substation & SAS",
    body: "IEC 61850-based Switchyard Automation Systems with bay controllers, IEDs and station HMIs. Remote breaker control, safe momentary paralleling and SCADA integration to dispatch.",
    items: ["IEC 61850 SAS architecture", "Bay controllers + IEDs", "Remote breaker / isolator control", "Safe momentary paralleling logic"],
    photo: "/brand/vert-substation.jpg",
  },
  {
    id: "auto",
    code: "//04.03",
    name: "Automotive & Assembly",
    body: "Shop-floor automation across dedicated machines, milling, turning and SPM stations — through to full assembly-line automation with traceability and fail-safe monitoring.",
    items: [
      "Shop floor & dedicated machines",
      "Milling / turning / SPM",
      "Assembly line automation",
      "Assembly line traceability",
      "Fail-safe monitoring",
      "Wrong-part feed detection",
      "Operator live training stations",
    ],
    photo: "/brand/vert-auto.jpg",
  },
  {
    id: "water",
    code: "//04.04",
    name: "Water & Environmental",
    body: "Comprehensive automation for ETP, STP, WTP, MEE and ZLD plants. Blower optimization, pump lead/lag, dosing logic, evaporator/crystallizer interlocks and long-term compliance reporting.",
    items: ["ETP / STP / WTP control", "MEE & ZLD evaporator interlocks", "Blower & pump optimization", "Compliance & audit trail"],
    photo: "/brand/vert-water.jpg",
  },
  {
    id: "conveyor",
    code: "//04.05",
    name: "Conveyor & Wide-Belt Automation",
    body: "Conveyor, wide-belt and industrial conveyor automation for automotive and whitegoods lines — traffic management, FIFO, even-gap maintenance and throughput control.",
    items: ["Traffic management", "First-In-First-Out (FIFO) logic", "Even-gap maintenance", "Throughput control"],
    photo: "/brand/vert-conveyor.jpg",
  },
  {
    id: "bms",
    code: "//04.06",
    name: "BMS & CMS",
    body: "Integrated Building Management and Central Monitoring — HVAC, lighting, access, fire and lifts under one supervisory layer; water, air and energy monitored across campuses with actionable alerts.",
    items: ["BMS — HVAC / lighting / access", "Fire & life-safety integration", "CMS — water / air / energy", "Cross-site benchmarking"],
    photo: "/brand/vert-bms.jpg",
  },
  {
    id: "material",
    code: "//04.07",
    name: "Material Handling",
    body: "Ash, coal and fuel handling systems with redundant PLCs, redundant networks and robust interlocks to ensure uninterrupted conveying for power and process plants.",
    items: ["Ash handling (dry / wet)", "Coal handling plant", "Fuel handling & storage", "S7-400H redundant pairs"],
    photo: "/brand/vert-material.jpg",
  },
  {
    id: "hvac",
    code: "//04.08",
    name: "HVAC & Climate",
    body: "Chiller plants, AHU/FCU networks and precision atmospheric control for hatcheries and mission-critical rooms — tight temperature, humidity, CO₂ and pressure setpoints with redundant sensing.",
    items: ["Chiller plant manager", "AHU / FCU sequencing", "Precision T / RH / CO₂ control", "Hatchery & critical-room climate"],
    photo: "/brand/vert-hvac.jpg",
  },
  {
    id: "paper",
    code: "//04.09",
    name: "Pulp & Paper",
    body: "Kraft paper mill process synchronization — pulping, stock prep, machine drives and finishing — designed for continuous operation and minimal break events.",
    items: ["Stock prep automation", "Sectional drive coordination", "Steam & condensate logic", "Quality / moisture loops"],
    photo: "/brand/vert-paper.jpg",
  },
  {
    id: "panel",
    code: "//04.10",
    name: "Panel Engineering",
    body: "Custom MCC, PCC and PLC panel manufacturing along with full VFD lineup solutions. Wiring discipline, thermal management and serviceability built in.",
    items: ["MCC / PCC / PLC panels", "VFD lineup integration", "Thermal & cable management", "Factory acceptance testing"],
    photo: "/brand/vert-panel.jpg",
  },
  {
    id: "sustain",
    code: "//04.11",
    name: "Sustainability Ops",
    body: "Carbon footprint tracking, energy KPI dashboards and condition-based maintenance built on top of the historian and EMS layer.",
    items: ["Scope 1/2/3 telemetry", "Energy intensity KPIs", "Condition-based maintenance", "Audit-grade reporting"],
    photo: "/brand/vert-sustain.jpg",
  },
];

export default function Industries() {
  const [active, setActive] = useState(0);
  const [userInteracted, setUserInteracted] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!userInteracted) return;
    const el = sidebarRef.current?.querySelector(`[data-idx="${active}"]`);
    if (el) el.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [active, userInteracted]);

  const v = VERTICALS[active];

  return (
    <section
      id="rugged-reliability"
      data-testid="section-industries"
      className="relative py-24 md:py-32 border-t border-tasc-border"
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-10 lg:px-16">
        <SectionHeader code="// 04" kicker="RUGGED RELIABILITY" title="Industries we run with." />
        <p className="mt-6 max-w-2xl text-tasc-text/55 text-base font-light leading-relaxed">
          Eleven verticals where TASC has hands inside the panels — from beneficiation plants
          to assembly lines, substations to ZLD evaporators.
        </p>

        {/* Desktop master-detail */}
        <div className="mt-14 hidden md:grid grid-cols-12 gap-px bg-tasc-border/60 border border-tasc-border min-h-[560px]">
          {/* Sidebar */}
          <aside
            ref={sidebarRef}
            className="col-span-4 lg:col-span-3 bg-tasc-bg overflow-y-auto max-h-[560px] industrial-scroll"
          >
            <div className="px-4 py-3 border-b border-tasc-border flex items-center justify-between">
              <span className="font-[Orbitron] text-[10px] tracking-[0.3em] text-tasc-text/40">VERTICALS</span>
              <span className="font-[Orbitron] text-[10px] tracking-[0.25em] text-tasc-cyan tabular">{String(VERTICALS.length).padStart(2, "0")}</span>
            </div>
            <ul>
              {VERTICALS.map((vert, i) => {
                const isOn = i === active;
                return (
                  <li key={vert.id} data-idx={i}>
                    <button
                      data-testid={`industry-${vert.id}`}
                      onMouseEnter={() => { setActive(i); setUserInteracted(true); }}
                      onFocus={() => { setActive(i); setUserInteracted(true); }}
                      onClick={() => { setActive(i); setUserInteracted(true); }}
                      className="w-full text-left px-4 py-3 flex items-center gap-3 border-b border-tasc-border group transition-colors"
                      style={{
                        background: isOn ? "rgba(31,143,255,0.06)" : "transparent",
                        color: isOn ? 'var(--tasc-text)' : 'var(--tasc-text-dim)',
                      }}
                    >
                      <span className="w-1 h-6 transition-colors" style={{ background: isOn ? 'var(--tasc-cyan)' : 'var(--tasc-border)' }} />
                      <span className="font-[Orbitron] text-[9px] tracking-[0.25em] w-12 shrink-0" style={{ color: isOn ? 'var(--tasc-cyan)' : 'var(--tasc-border)' }}>
                        {vert.code.replace("//06.", "")}
                      </span>
                      <span className="font-[Montserrat] text-[13px] flex-1">{vert.name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </aside>

          {/* Detail */}
          <div className="col-span-8 lg:col-span-9 bg-tasc-bg relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={v.id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -8 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="grid grid-cols-12 gap-8 p-8 lg:p-12 h-full"
              >
                <div className="col-span-7 flex flex-col">
                  <div className="font-[Orbitron] text-[10px] tracking-[0.3em] text-tasc-cyan">{v.code}</div>
                  <h3 className="font-[Montserrat] text-2xl lg:text-3xl font-medium text-tasc-text mt-3 leading-tight">
                    {v.name}
                  </h3>
                  <p className="mt-5 text-tasc-text/65 text-sm lg:text-base font-light leading-relaxed">
                    {v.body}
                  </p>
                  <ul className="mt-7 space-y-1.5">
                    {v.items.map((it) => (
                      <li key={it} className="flex items-center gap-3 text-tasc-text/75 text-sm">
                        <span className="w-2 h-px bg-tasc-cyan" />
                        <span className="font-[Inter] font-light">{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="col-span-5 relative">
                  <div className="absolute inset-0 bp-grid-fine opacity-30 pointer-events-none" />
                  <div className="relative w-full h-full min-h-[280px] border border-tasc-border overflow-hidden">
                    <motion.img
                      key={v.photo}
                      src={v.photo}
                      alt={v.name}
                      loading="lazy"
                      initial={{ opacity: 0, scale: 1.06 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute inset-0 w-full h-full object-cover"
                      draggable={false}
                    />
                    {/* Industrial overlay: cyan tint + scanline */}
                    <div className="absolute inset-0 bg-tasc-bg/45 mix-blend-multiply pointer-events-none" />
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(0,194,255,0.06) 0%, transparent 40%, transparent 70%, rgba(13,17,23,0.65) 100%)",
                      }}
                    />
                    {/* HUD frame */}
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-2 left-2 right-2 flex items-center justify-between font-[Orbitron] text-[9px] tracking-[0.3em] text-tasc-text/70">
                        <span>VERTICAL · {v.code}</span>
                        <span className="text-tasc-cyan">● LIVE</span>
                      </div>
                      <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between font-[Orbitron] text-[9px] tracking-[0.3em] text-tasc-text/70">
                        <span className="truncate uppercase">{v.name}</span>
                        <span className="text-tasc-cyan">REF · {String(active + 1).padStart(2, "0")}/{VERTICALS.length}</span>
                      </div>
                      {/* Corner ticks */}
                      <div className="absolute top-0 left-0 w-3 h-3 border-l border-t border-tasc-cyan" />
                      <div className="absolute top-0 right-0 w-3 h-3 border-r border-t border-tasc-cyan" />
                      <div className="absolute bottom-0 left-0 w-3 h-3 border-l border-b border-tasc-cyan" />
                      <div className="absolute bottom-0 right-0 w-3 h-3 border-r border-b border-tasc-cyan" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile stacked details with photo */}
        <div className="mt-10 md:hidden space-y-px bg-tasc-border/60 border border-tasc-border">
          {VERTICALS.map((vert) => (
            <div key={vert.id} className="bg-tasc-bg" data-testid={`industry-mobile-${vert.id}`}>
              <div className="p-5 flex items-center justify-between">
                <div>
                  <div className="font-[Orbitron] text-[9px] tracking-[0.3em] text-tasc-text/40">{vert.code}</div>
                  <div className="font-[Montserrat] text-base mt-1 text-tasc-text">{vert.name}</div>
                </div>
              </div>
              <div className="p-5 pt-0 space-y-4">
                <div className="relative aspect-video border border-tasc-border overflow-hidden">
                  <img src={vert.photo} alt={vert.name} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-tasc-bg/45 mix-blend-multiply" />
                </div>
                <p className="text-tasc-text/60 text-sm font-light leading-relaxed">{vert.body}</p>
                <ul className="space-y-1.5">
                  {vert.items.map((it) => (
                    <li key={it} className="flex items-center gap-2 text-tasc-text/70 text-xs">
                      <span className="w-2 h-px bg-tasc-cyan" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
