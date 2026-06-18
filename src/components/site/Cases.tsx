import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SectionHeader } from "./Capabilities";

const CASES = [
  {
    id: "ems",
    code: "//05.01",
    tag: "DIGITALIZATION · EMS",
    title: "Energy Management & Digitalization — Daikin Neemrana",
    client: "Daikin · Neemrana, Rajasthan",
    image: "/brand/cases/ems.jpg",
    summary:
      "Plant-wide Energy Management System and digitalization on ICONICS GENESIS64 Advanced SCADA, integrated with Mitsubishi Electric controllers and meters. Real-time and historical energy visibility across plant areas — energy-balance diagrams, single-line diagrams, group-wise KPIs and a full alarm history viewer.",
    stack: ["ICONICS GENESIS64", "Mitsubishi MELSEC PLCs", "Hyper Historian", "Modbus / MQTT", "Energy meters · sub-metering"],
    outcomes: [
      "Single pane of glass for energy across the factory",
      "Energy-balance & SLD-driven analysis",
      "Group-wise KPI dashboards & trends",
      "Real-time + historical alarm viewer with filters",
    ],
  },
  {
    id: "sas",
    code: "//05.02",
    tag: "SUBSTATION · SAS",
    title: "132 KV Switchyard Automation System",
    client: "Hero MotoCorp · Haridwar",
    image: "/brand/cases/sas.jpg",
    summary:
      "End-to-end 132 KV SAS on a Mitsubishi MELSEC iQ-R backbone — R16CPU master concentrator + 6 × R04ENCPU bay/ESS PLCs + 108 × FX5S-30MR breaker controllers — over a redundant optical ring (MRP, OM2 multimode). ICONICS GENESIS64 Advanced SCADA 5000-tag licence with hardware key for switchyard monitoring and control.",
    stack: [
      "Mitsubishi R16CPU + RJ71EN71 master",
      "R04ENCPU + RJ71EN71/PB91/C24-R4 (×6 ESS / DBB)",
      "FX5S-30MR + FX5-485ADP (×108 breakers)",
      "ICONICS GENESIS64 (5000 tags + dongle)",
      "MRP redundant optical ring · IE switches",
      "Profibus to ACB ET-units · IEC-60870-5-101/104",
    ],
    outcomes: [
      "Retrofit on live 11 KV VCB / 415 V ACB panels — week-day testing, Sunday cut-overs",
      "132 KV SF6 + isolator operations integrated and tested",
      "Check-sync relays + bus-PT logic for safe momentary paralleling",
      "Auto-tap change with live transformer load-shifting between 132/11 KV",
      "Mitsubishi proposed over Siemens — won on architecture & commercials",
    ],
  },
  {
    id: "quartz-ben",
    code: "//05.03",
    tag: "PROCESS PLANT · BENEFICIATION",
    title: "Quartz Beneficiation Plant",
    client: "Geetanjali Industrial Minerals Pvt. Ltd.\n· Shishvi, Rajasthan",
    image: "/brand/cases/quartz-ben.jpg",
    summary:
      "Process automation for a quartz beneficiation line — crushing, scrubbing/washing, screening, optical colour sorting, VSI, micron collection and bagging — visualised on GENESIS64 with material-flow architecture, faceplate trends, recovery-rate totalizers and shift-wise tonnage reports.",
    stack: [
      "MELSEC iQ-R + CC-Link IE Field",
      "ICONICS GENESIS64 (~5000 tags)",
      "Hyper Historian + GridWorx reports",
      "Tomra optical colour sorters",
      "KICE micron collection · magnetic separation",
    ],
    outcomes: [
      "Premium SiO₂ grits & powder, 0.1 mm – 5 mm size bands",
      "Final product purity 94–96% (grits slabs), 98.7% (glass), 99.8% (semiconductor)",
      "Runtime + historian alarming with corrective measures",
      "Hourly / shift / day-wise tonnage reporting over GridWorx",
    ],
  },
  {
    id: "iron-ore",
    code: "//05.04",
    tag: "PROCESS PLANT · BENEFICIATION",
    title: "Iron Ore Beneficiation Plant",
    client: "Pacific Iron Manufacturing Ltd. · MP",
    image: "/brand/cases/iron-ore.jpg",
    summary:
      "Greenfield iron-ore beneficiation plant built on Siemens PCS 7 v8.2 with an S7-400 410-5H hot-redundant pair and 9 × ET200M IM153-2DP RIO panels (~4,620 I/O). 36 × Siemens G120 VFDs + 16 × Mitsubishi A840 VFDs over Profibus, with WinCC OS pairs and engineering station.",
    stack: [
      "S7-400 410-5H hot-redundant CPU",
      "IM153-2DP Profibus RIO (×9 panels, ~4620 I/O)",
      "Siemens G120 VFD (30–315 kW, ×36)",
      "Mitsubishi A840 VFD (90 kW, ×16)",
      "PCS 7 v8.2 · WinCC Runtime 5000 tags ×2 (OS)",
      "Modbus RTU to EMS · in-house PCC/MCC/VFD/desk panels",
    ],
    outcomes: [
      "Hot-redundant PCS 7 architecture — zero single point of failure",
      "Crushing, scrubbing, grinding and concentrate-thickener loops on a single SCADA",
      "Engineering + Operator stations with full alarm and historian",
      "PCC, MCC, VFD and control-desk panels built in-house",
    ],
  },
  {
    id: "quartz-slab",
    code: "//05.05",
    tag: "MANUFACTURING · ENGINEERED STONE",
    title: "Quartz Slab Manufacturing Plant",
    client: "Taanj Quartz.— Engineered Stone & Grit\n· Udaipur, Rajasthan",
    image: "/brand/cases/quartz-slab.jpg",
    summary:
      "Full-line automation for engineered-stone slab manufacturing on a Mitsubishi Q06UDV CPU with 2 × LJ72GF15-T2 remote heads (384 DI/DO + 32 AI per panel). CC-Link IE Field backbone, Profibus for load cells, Modbus RTU for 41 VFDs and 3 × GS2107 control-desk HMIs. InduSoft SCADA 5000-tag visualization.",
    stack: [
      "Q06UDV CPU · LJ72GF15-T2 remote heads",
      "CC-Link IE Field PLC ↔ RIO",
      "E740 VFDs ×32 · A840 VFDs ×9",
      "Profibus to load cells & 3rd-party devices",
      "GS2107 HMI ×3 (control desks)",
      "InduSoft SCADA 5000 tags",
    ],
    outcomes: [
      "3 × 2 m / 50 mm slabs with ±1 kg distributor accuracy across 8 sectors",
      "Beat KEDA (Chinese OEM) — technically and commercially",
      "250+ slab formulas (grits + glass + powder + resin)",
      "Project delivered through the pandemic",
    ],
  },
];

const CaseDetail = ({ c, active, total }: { c: any; active: number; total: number }) => (
  <div
    className="grid grid-cols-1 lg:grid-cols-12 gap-px bg-tasc-border/40"
    data-testid={`case-detail-${c.id}`}
  >
    {/* Image */}
    <div className="lg:col-span-7 bg-tasc-bg relative">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={c.image}
          alt={c.title}
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />
        {/* Industrial overlay */}
        <div className="absolute inset-0 bg-tasc-bg/45 mix-blend-multiply pointer-events-none" />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(180deg, rgba(0,194,255,0.06) 0%, transparent 30%, transparent 70%, rgba(13,17,23,0.85) 100%)" }}
        />
        
        {/* Diagonal Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 overflow-hidden select-none">
          <span className="font-[Orbitron] font-bold text-2xl sm:text-3xl lg:text-4xl rotate-[-35deg] tracking-[0.15em] text-tasc-cyan opacity-[0.08] uppercase border-y border-tasc-cyan/20 px-8 py-3 text-center whitespace-nowrap">
            FOUNDER'S TRACK RECORD
          </span>
        </div>
        {/* HUD */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between font-[Orbitron] text-[9px] tracking-[0.3em] text-tasc-text/80">
            <span>CASE · {c.code}</span>
            <span className="text-tasc-cyan">● COMMISSIONED</span>
          </div>
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between font-[Orbitron] text-[9px] tracking-[0.3em] text-tasc-text/80">
            <span className="uppercase whitespace-pre-line leading-[1.4] max-w-[75%]">{c.client}</span>
            <span className="text-tasc-cyan tabular shrink-0">REF · {String(active + 1).padStart(2, "0")}/{String(total).padStart(2, "0")}</span>
          </div>
          <div className="absolute top-0 left-0 w-3 h-3 border-l border-t border-tasc-cyan" />
          <div className="absolute top-0 right-0 w-3 h-3 border-r border-t border-tasc-cyan" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-l border-b border-tasc-cyan" />
          <div className="absolute bottom-0 right-0 w-3 h-3 border-r border-b border-tasc-cyan" />
        </div>
      </div>
    </div>

    {/* Copy */}
    <div className="lg:col-span-5 bg-tasc-bg p-8 lg:p-10">
      <div className="font-[Orbitron] text-[10px] tracking-[0.3em] text-tasc-cyan">
        {c.tag}
      </div>
      <h3 className="mt-3 font-[Montserrat] text-2xl md:text-3xl text-tasc-text font-medium leading-tight">
        {c.title}
      </h3>
      <div className="mt-2 font-[Orbitron] text-[10px] tracking-[0.2em] text-tasc-text/50 whitespace-pre-line leading-relaxed">
        {c.client}
      </div>
      <p className="mt-5 text-tasc-text/65 text-sm leading-relaxed font-light">
        {c.summary}
      </p>

      {/* Stack */}
      <div className="mt-7">
        <div className="font-[Orbitron] text-[9px] tracking-[0.3em] text-tasc-text/40 mb-3">
          STACK
        </div>
        <div className="flex flex-wrap gap-1.5">
          {c.stack.map((s: string) => (
            <span
              key={s}
              className="font-[Orbitron] text-[9px] tracking-[0.15em] text-tasc-text/75 border border-tasc-border px-2.5 py-1 hover:border-tasc-cyan hover:text-tasc-cyan transition-colors"
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Outcomes */}
      <div className="mt-7">
        <div className="font-[Orbitron] text-[9px] tracking-[0.3em] text-tasc-text/40 mb-3">
          OUTCOMES
        </div>
        <ul className="space-y-1.5">
          {c.outcomes.map((o: string) => (
            <li key={o} className="flex items-start gap-3 text-tasc-text/75 text-sm">
              <span className="w-2 h-px bg-tasc-cyan mt-2.5 shrink-0" />
              <span className="font-[Inter] font-light leading-relaxed">{o}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

export default function Cases() {
  const [active, setActive] = useState(0);
  const c = CASES[active];

  return (
    <section
      id="case-studies"
      data-testid="section-cases"
      className="relative py-24 md:py-32 border-t border-tasc-border"
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-10 lg:px-16">
        <SectionHeader code="// 05" kicker="FIELD RECORD" title="Case studies — real plants, real PLCs." />
        <div className="mt-6 w-full flex flex-col md:flex-row md:items-end justify-between gap-6">
          <p className="max-w-2xl text-tasc-text/55 text-base font-light leading-relaxed">
            We have featured 5 cornerstone projects from our founder’s extensive track record of delivering 20+ industrial automation systems. Each represents battle-tested expertise in full-scale deployment, detailed documentation, panel workmanship, and live-plant cut-overs.
          </p>
          <button
            onClick={() => {
              window.dispatchEvent(
                new CustomEvent("tasc:open-contact-modal", {
                  detail: { headline: "Request More Case Studies" }
                })
              );
            }}
            className="group relative shrink-0 font-[Orbitron] text-[11px] tracking-[0.25em] px-6 py-3 border border-tasc-border text-tasc-text/80 overflow-hidden hover:border-tasc-cyan hover:text-tasc-cyan transition-colors self-start md:self-auto"
          >
            [ MORE CASE STUDIES ]
          </button>
        </div>

        {/* Selector tabs */}
        <div className="mt-12 flex flex-col md:grid md:grid-cols-5 gap-px bg-tasc-border/60 border border-tasc-border">
          {CASES.map((cs, i) => {
            const on = i === active;
            return (
              <React.Fragment key={cs.id}>
                <button
                  data-testid={`case-tab-${cs.id}`}
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  className="text-left bg-tasc-bg p-4 md:p-5 relative transition-colors group"
                  style={{ background: on ? "rgba(31,143,255,0.06)" : "transparent" }}
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-px"
                    style={{ background: on ? 'var(--tasc-cyan)' : "transparent", boxShadow: on ? "0 0 12px #1F8FFF" : "none" }}
                  />
                  <div
                    className="font-[Orbitron] text-[9px] tracking-[0.25em] mb-1"
                    style={{ color: on ? 'var(--tasc-cyan)' : 'var(--tasc-border)' }}
                  >
                    {cs.code}
                  </div>
                  <div
                    className="font-[Orbitron] text-[9px] tracking-[0.25em] mb-2"
                    style={{ color: on ? 'var(--tasc-text)' : 'var(--tasc-text-dim)' }}
                  >
                    {cs.tag}
                  </div>
                  <div className="font-[Montserrat] text-sm md:text-base text-tasc-text leading-snug">
                    {cs.title.split(" — ")[0]}
                  </div>
                </button>
                
                {/* Mobile Detail View */}
                <div className="md:hidden">
                  <AnimatePresence>
                    {on && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden bg-tasc-bg border-b border-tasc-border last:border-b-0"
                      >
                        <CaseDetail c={cs} active={i} total={CASES.length} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </React.Fragment>
            );
          })}
        </div>

        {/* Desktop Detail View */}
        <div className="hidden md:block mt-px border border-tasc-border bg-tasc-bg">
          <AnimatePresence mode="wait">
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <CaseDetail c={c} active={active} total={CASES.length} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
