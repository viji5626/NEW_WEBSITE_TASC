import { motion } from "framer-motion";
import { Monitor, Cpu, Server, Network, Plug, Database } from "lucide-react";
import { SectionHeader } from "./Capabilities";

const STACK = [
  {
    id: "scada",
    code: "//02B.1",
    icon: Monitor,
    title: "SCADA — GENESIS64",
    vendor: "ICONICS (by MEIDS, formerly Microsoft)",
    body: "GENESIS64 Advanced SCADA suite — Hyper Historian for sub-second logging, AnalytiX for OEE/energy/yield, MobileHMI for secure mobile access. Single pane of glass across multi-OEM plants.",
    bullets: ["GENESIS64 visualization", "Hyper Historian (sub-second)", "AnalytiX (OEE / EMS)", "MobileHMI (secure)"],
    image: "/brand/genesis64.png",
    imageFit: "contain",
    imageBg: 'var(--tasc-bg)',
  },
  {
    id: "dcs",
    code: "//02B.2",
    icon: Server,
    title: "DCS — Siemens PCS 7",
    vendor: "Siemens · S7-400 / S7-400H controller family",
    body: "Core competency in PCS 7 — Siemens' DCS environment built on S7-400 and S7-400H redundant controller pairs. Used for process-heavy plants like paper, power and substations where availability is non-negotiable.",
    bullets: ["PCS 7 engineering", "S7-400 / S7-400H redundancy", "CFC / SFC charts", "OS / ES server pairs"],
    image: "/brand/siemens.png",
    imageFit: "contain",
    imageBg: "#F4F5F7",
  },
  {
    id: "plc",
    code: "//02B.3",
    icon: Cpu,
    title: "PLC Engineering",
    vendor: "Siemens · Mitsubishi",
    body: "Day-to-day fluency in TIA Portal (S7-1500 / 1200 / 400) and Mitsubishi GX Works 2 & 3 (MELSEC iQ-R / iQ-F / FX5U). Compact machines through high-availability plant CPUs.",
    bullets: ["TIA Portal (S7-1500/1200)", "GX Works 2 & 3 (MELSEC iQ-R/iQ-F)", "Safety blocks & libraries", "Versioned, auditable projects"],
    image: "/brand/mitsubishi.jpg",
    imageFit: "contain",
    imageBg: "#F4F5F7",
  },
  {
    id: "conn",
    code: "//02B.4",
    icon: Plug,
    title: "Connectivity Layer",
    vendor: "Takebishi · PTC",
    body: "Production-grade OPC gateways: DeviceXPlorer (Takebishi) for Mitsubishi/Omron/Yokogawa endpoints, Kepware (PTC) for broad multi-vendor bridging into historian and IT.",
    bullets: ["DeviceXPlorer (Takebishi)", "Kepware (PTC) OPC server", "OPC DA / UA", "Tag tunnelling & redundancy"],
    image: "/brand/connectivity.png",
    imageFit: "cover",
    imageBg: 'var(--tasc-bg)',
  },
  {
    id: "protocols",
    code: "//02B.5",
    icon: Network,
    title: "Industrial Protocols",
    vendor: "Standards-based — vendor-neutral",
    body: "Comfortable across the full OT protocol surface — from substation IEC 61850 down to serial Modbus RTU on a legacy panel. We don't smuggle in proprietary tricks.",
    bullets: [
      "IEC 61850 (SAS)",
      "Profinet · Profibus",
      "CC-Link IE Field / Control",
      "Modbus RTU / Modbus TCP-IP",
      "RS-232 Serial · SLMP",
      "OPC DA / UA",
    ],
    image: "/brand/protocols.png",
    imageFit: "contain",
    imageBg: "#FFFFFF",
  },
  {
    id: "data",
    code: "//02B.6",
    icon: Database,
    title: "Data, MES & Integration",
    vendor: "Historian · SQL · MES",
    body: "Production data lands cleanly into Hyper Historian, SQL / time-series stores and MES modules — with REST / DB connectors out to ERP and BI, retention up to 10+ years.",
    bullets: ["Hyper Historian", "SQL / time-series DBs", "MES modules", "REST / ERP connectors"],
    image: "/brand/data-mes.png",
    imageFit: "contain",
    imageBg: "#FFFFFF",
  },
];

export default function SoftwareExpertise() {
  return (
    <section
      id="technical-stack"
      data-testid="section-stack"
      className="relative py-24 md:py-32 border-t border-tasc-border"
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-10 lg:px-16">
        <SectionHeader code="// 03" kicker="TECHNICAL STACK" title="Software, protocols, integration." />
        <p className="mt-6 max-w-2xl text-tasc-text/55 text-base font-light leading-relaxed">
          Logic-level fluency across the platforms that actually run plants — SCADA, DCS, PLC,
          connectivity and data layers — designed for high redundancy and integrated engineering.
        </p>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-tasc-border/60 border border-tasc-border">
          {STACK.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.id}
                data-testid={`stack-card-${s.id}`}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
                className="relative bg-tasc-bg trace-border group flex flex-col"
              >
                {/* Hero image (if provided) */}
                {s.image && (
                  <div
                    className="relative w-full overflow-hidden border-b border-tasc-border"
                    style={{ background: s.imageBg, aspectRatio: "16 / 9" }}
                  >
                    <img
                      src={s.image}
                      alt={s.title}
                      className="absolute inset-0 w-full h-full transition-transform duration-700 group-hover:scale-[1.04]"
                      style={{ objectFit: (s.imageFit as 'cover' | 'contain' | 'fill' | 'none' | 'scale-down') || "cover" }}
                      draggable={false}
                    />
                    {/* Faint scan + corner ticks */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(13,17,23,0) 60%, rgba(13,17,23,0.85) 100%)",
                      }}
                    />
                    <div className="absolute top-2 left-2 right-2 flex items-center justify-between font-[Orbitron] text-[9px] tracking-[0.3em] text-tasc-text/80">
                      <span>{s.code}</span>
                      <span className="text-tasc-cyan">● ACTIVE</span>
                    </div>
                    <div className="absolute top-0 left-0 w-3 h-3 border-l border-t border-tasc-cyan" />
                    <div className="absolute top-0 right-0 w-3 h-3 border-r border-t border-tasc-cyan" />
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-l border-b border-tasc-cyan" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-r border-b border-tasc-cyan" />
                  </div>
                )}

                <div className="p-8 md:p-9 flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-12 h-12 border border-tasc-border flex items-center justify-center group-hover:border-tasc-cyan transition-colors">
                      <Icon size={22} strokeWidth={1.25} className="text-tasc-text/80 group-hover:text-tasc-cyan transition-colors" />
                    </div>
                    <div className="font-[Orbitron] text-[10px] tracking-[0.25em] text-tasc-border group-hover:text-tasc-cyan transition-colors">
                      [ + ]
                    </div>
                  </div>
                  {!s.image && (
                    <div className="font-[Orbitron] text-[9px] tracking-[0.3em] text-tasc-text/40 mb-2">{s.code}</div>
                  )}
                  <h3 className="font-[Montserrat] text-xl font-medium text-tasc-text leading-tight">{s.title}</h3>
                  <div className="mt-1 font-[Orbitron] text-[9px] tracking-[0.2em] text-tasc-cyan/80">{s.vendor}</div>
                  <p className="mt-4 text-tasc-text/55 text-sm leading-relaxed font-light">{s.body}</p>
                  <ul className="mt-5 space-y-1.5">
                    {s.bullets.map((b) => (
                      <li key={b} className="flex items-center gap-3 text-tasc-text/75 text-xs">
                        <span className="w-2 h-px bg-tasc-cyan" />
                        <span className="font-[Inter] font-light">{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
