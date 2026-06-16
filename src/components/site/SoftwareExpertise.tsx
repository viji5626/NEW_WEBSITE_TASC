import { motion } from "framer-motion";
import { Monitor, Cpu, Server, Network, Plug, Database } from "lucide-react";
import { SectionHeader } from "./Capabilities";

const STACK = [
  {
    id: "scada",
    code: "//03.01",
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
    code: "//03.02",
    icon: Server,
    title: "DCS & Hybrid System",
    vendor: "Siemens PCS 7 · Mitsubishi Hybrid DCS",
    body: "Core competency in Siemens PCS 7 (built on S7-400H redundant controllers) and Mitsubishi Hybrid DCS (iQ-R Redundant PLC & ICONICS Redundant SCADA). Used for process-heavy plants like paper, power, and substations where availability is non-negotiable.",
    bullets: ["Siemens PCS 7 (S7-400H)", "CFC / SFC charts", "OS / ES server pairs", "Mitsubishi Hybrid DCS (iQ-R)", "ICONICS Redundant SCADA"],
    image: "/brand/siemens.png",
    imageFit: "contain",
    imageBg: "#F4F5F7",
  },
  {
    id: "plc",
    code: "//03.03",
    icon: Cpu,
    title: "PLC Engineering",
    vendor: "Mitsubishi · Siemens",
    body: "Day-to-day fluency in Mitsubishi GX Works 2 & 3 (MELSEC iQ-R / iQ-F / FX5U) and TIA Portal (S7-1500 / 1200 / 400). Compact machines through high-availability plant CPUs.",
    bullets: ["GX Works 2 & 3 (MELSEC iQ-R/iQ-F)", "TIA Portal (S7-1500/1200)", "Safety blocks & libraries", "Versioned, auditable projects"],
    image: "/brand/mitsubishi.jpg",
    imageFit: "contain",
    imageBg: "#F4F5F7",
  },
  {
    id: "conn",
    code: "//03.04",
    icon: Plug,
    title: "Connectivity Layer",
    vendor: "Takebishi · PTC",
    body: "Production-grade OPC gateways: DeviceXPlorer (Takebishi) for Mitsubishi/Omron/Yokogawa endpoints, KepserverEX for broad multi-vendor bridging into historian and IT.",
    bullets: ["DeviceXPlorer (Takebishi)", "KepserverEX OPC server", "OPC DA / UA", "Tag tunnelling & redundancy"],
    image: "/brand/connectivity.png",
    imageFit: "cover",
    imageBg: 'var(--tasc-bg)',
  },
  {
    id: "protocols",
    code: "//03.05",
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
    code: "//03.06",
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
                tabIndex={0}
                role="article"
                aria-labelledby={`stack-title-${s.id}`}
                aria-describedby={`stack-desc-${s.id}`}
              >
                {/* Hero image (if provided) */}
                {s.image && (
                  <div
                    className="relative w-full overflow-hidden border-b border-tasc-border"
                    style={{ background: s.imageBg, aspectRatio: "16 / 9" }}
                    aria-hidden="true"
                  >
                    <img
                      src={s.image}
                      alt={`${s.title} platform architecture overview`}
                      loading="lazy"
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
                  <div className="flex items-start justify-between mb-6" aria-hidden="true">
                    <div className="w-12 h-12 border border-tasc-border flex items-center justify-center group-hover:border-tasc-cyan transition-colors">
                      <Icon size={22} strokeWidth={1.25} className="text-tasc-text/80 group-hover:text-tasc-cyan transition-colors" aria-hidden="true" />
                    </div>
                    {/* Removed [ + ] toggle */}
                  </div>
                  {!s.image && (
                    <div className="font-[Orbitron] text-[9px] tracking-[0.3em] text-tasc-text/40 mb-2" aria-hidden="true">{s.code}</div>
                  )}
                  <h3 id={`stack-title-${s.id}`} className="font-[Montserrat] text-xl font-medium text-tasc-text leading-tight">{s.title}</h3>
                  <div className="mt-1 font-[Orbitron] text-[9px] tracking-[0.2em] text-tasc-cyan/80">{s.vendor}</div>
                  
                  <div className="mt-4 pt-4 border-t border-tasc-border/50">
                    <p id={`stack-desc-${s.id}`} className="text-tasc-text/55 text-sm leading-relaxed font-light">{s.body}</p>
                    <ul className="mt-5 space-y-1.5" aria-label={`Features of ${s.title}`}>
                      {s.bullets.map((b) => (
                        <li key={b} className="flex items-center gap-3 text-tasc-text/75 text-xs">
                          <span className="w-2 h-px bg-tasc-cyan" />
                          <span className="font-[Inter] font-light">{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* New Brand Expertise Section */}
        <div className="mt-24 pt-16 border-t border-tasc-border">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
            <div className="lg:col-span-6">
              <div className="font-[Orbitron] text-[10px] tracking-[0.3em] text-tasc-cyan">
                BRAND EXPERTISE
              </div>
              <h3 className="mt-4 font-[Montserrat] text-3xl md:text-4xl font-medium text-tasc-text leading-tight">
                Engineering excellence across multiple technology ecosystems.
              </h3>
              <p className="mt-6 text-tasc-text/80 text-base md:text-lg font-light leading-relaxed">
                We provide comprehensive integration services tailored to your preferred hardware
                platforms. From conceptualizing control architectures to panel assembly and site
                commissioning, our expertise spans across top-tier manufacturers. We adapt to
                your facility's operational requirements seamlessly.
              </p>
            </div>
            
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-4">
              {[
                "VFD (Variable Frequency Drive) panels",
                "PLC programming & I/O integration",
                "LT switchgear up to 6300 A",
                "Multi-brand retrofits & spares",
                "Drawing review & BoM in any standard",
                "On-site commissioning support",
              ].map((bullet) => (
                <div key={bullet} className="flex items-start gap-3">
                  <div className="mt-1 shrink-0 w-3.5 h-3.5 rounded-full border border-tasc-cyan flex items-center justify-center bg-tasc-cyan/10">
                    <svg className="w-2 h-2 text-tasc-cyan" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                  </div>
                  <span className="text-tasc-text/80 text-sm font-light leading-snug">{bullet}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Brands Grid */}
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 gap-px bg-tasc-border/60 border border-tasc-border">
            {[
              { 
                brand: "MITSUBISHI ELECTRIC", 
                imagePath: "/brand/MEI.jpg",
                stack: "MELSEC PLC · FR-Series VFD · Servo Systems",
                tags: ["VFD", "PLC", "SWITCHGEAR", "HMI", "SCADA"]
              },
              { 
                brand: "SIEMENS", 
                imagePath: "/brand/siemens.jpg",
                stack: "SIMATIC PLC · SINAMICS Drives · SIRIUS Switchgear",
                tags: ["VFD", "PLC", "SWITCHGEAR", "HMI", "SCADA"]
              },
              { 
                brand: "Schneider Electric", 
                imagePath: "/brand/Schneider.jpg",
                stack: "Modicon PLC · Altivar Drives · TeSys Switchgear",
                tags: ["VFD", "PLC", "SWITCHGEAR"]
              },
              { 
                brand: "ABB", 
                imagePath: "/brand/ABB.jpg",
                stack: "AC500 PLC · ACS Drives · Tmax Switchgear",
                tags: ["VFD", "PLC", "SWITCHGEAR"]
              },
            ].map((b) => (
              <div 
                key={b.brand} 
                className="bg-tasc-bg p-8 flex flex-col items-start border border-transparent hover:border-tasc-cyan transition-colors group"
                tabIndex={0}
                role="article"
                aria-labelledby={`brand-title-${b.brand.replace(/\s+/g, '-')}`}
              >
                <div className="h-16 flex items-center justify-start mb-6 w-full shrink-0" aria-hidden="true">
                  <div className="relative w-full max-w-[140px] h-full bg-white flex items-center justify-start p-2">
                    <img
                      src={b.imagePath}
                      alt={`${b.brand} industrial automation and control hardware logo`}
                      loading="lazy"
                      className="w-full h-full object-contain grayscale-0 opacity-100 md:grayscale md:opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                      draggable={false}
                    />
                  </div>
                </div>
                
                <div className="font-[Orbitron] text-[9px] tracking-[0.2em] text-tasc-text/50 uppercase mb-3" id={`brand-title-${b.brand.replace(/\s+/g, '-')}`}>
                  <span className="sr-only">{b.brand} - </span>STACK WE DELIVER
                </div>
                <div className="text-sm text-tasc-text font-medium flex-1 leading-snug">
                  {b.stack}
                </div>
                
                <div className="mt-8 flex flex-wrap gap-2" aria-label={`Technologies delivered for ${b.brand}`}>
                  {b.tags.map((tag) => (
                    <div key={tag} className="px-2 py-1 bg-tasc-border/40 text-tasc-text/60 text-[9px] font-[Orbitron] tracking-wider rounded-sm">
                      {tag}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 bg-tasc-bg border border-tasc-border p-6 shadow-sm">
            <p className="text-tasc-text/80 text-[15px] font-light leading-relaxed">
              <strong className="font-medium text-tasc-text">Vendor-Independent Architecture.</strong> We are committed to building the right solution for your specific operational constraints rather than pushing a singular proprietary ecosystem. Our engineers are proficient in interlocking disparate control environments, allowing us to combine specialized field devices from multiple vendors into one unified, high-availability architecture.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
