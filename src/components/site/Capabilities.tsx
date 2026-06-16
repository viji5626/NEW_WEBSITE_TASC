import React from "react";
import { motion } from "framer-motion";
import { Cpu, Activity, Network, Zap, Cloud, Layers, Package, Power, Server } from "lucide-react";
import { TextReveal } from "@/components/ui/TextReveal";

const CARDS = [
  {
    id: "plc",
    code: "//02.01",
    icon: Cpu,
    title: "Automation & PLC Systems",
    body: "PLC, HMI, VFD and panel architectures for machines, utilities, and process units. Mitsubishi MELSEC iQ-R/iQ-F, Siemens S7-1500 / S7-400H.",
  },
  {
    id: "scada",
    code: "//02.02",
    icon: Activity,
    title: "SCADA & Visualization",
    body: "GENESIS64, WinCC Unified and PCS 7 dashboards with alarm handling, historian-linked screens and operator-grade UX.",
  },
  {
    id: "net",
    code: "//02.03",
    icon: Network,
    title: "OT Networking & Security",
    body: "Profinet, EtherNet/IP, Modbus, IEC 61850, CC-Link IE. VLANs, DMZs, secure remote access and protocol diagnostics.",
  },
  {
    id: "ems",
    code: "//02.04",
    icon: Zap,
    title: "Energy Management Systems",
    body: "Power, water, steam, compressed air and ZLD utilities — monitored, sub-metered and continuously optimized.",
  },
  {
    id: "iiot",
    code: "//02.05",
    icon: Cloud,
    title: "IIoT & Industry 4.0",
    body: "OPC UA, MQTT over TLS, LoRaWAN, edge gateways and cloud integrations bridging OT to IT cleanly.",
  },
  {
    id: "arch",
    code: "//02.06",
    icon: Layers,
    title: "Interoperability & Architecture",
    body: "Vendor-neutral L0–L4 ISA-95 design for greenfield builds and brownfield modernization across multi-OEM stacks.",
  },
  {
    id: "plc-sales",
    code: "//02.07",
    icon: Package,
    title: "PLC Hardware Sales",
    body: "Turnkey supply of programmable controllers from Siemens, Mitsubishi, and leading OEMs. Scalable from compact brick PLCs to redundant high-availability plant controllers.",
  },
  {
    id: "vfd-sales",
    code: "//02.08",
    icon: Power,
    title: "VFD Sales",
    body: "Complete portfolio of Variable Frequency Drives for discrete manufacturing and process control. We provide drive sizing, parameterization logic, and on-site integration support.",
  },
  {
    id: "web-hosting",
    code: "//02.09",
    icon: Server,
    title: "Web Hosting Services",
    body: "Industrial-grade website development, domain procurement, and robust web hosting solutions. We ensure your corporate digital identities remain secure and fast.",
  },
];

export default function Capabilities() {
  return (
    <section
      id="the-arsenal"
      data-testid="section-capabilities"
      className="relative py-24 md:py-32 border-t border-tasc-border"
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-10 lg:px-16">
        <SectionHeader code="// 02" kicker="THE ARSENAL" title="Core Capabilities" />

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-tasc-border/60 border border-tasc-border">
          {CARDS.map((c, i) => (
            <CapabilityCard key={c.id} card={c} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

const CapabilityCard: React.FC<{ card: any; index: any }> = ({ card, index }) => {
  const Icon = card.icon;
  return (
    <motion.div
      data-testid={`capability-card-${card.id}`}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="relative bg-tasc-bg p-8 md:p-10 trace-border group transition-colors hover:border-tasc-cyan/30 flex flex-col h-full"
      tabIndex={0}
      role="article"
      aria-labelledby={`capability-title-${card.id}`}
      aria-describedby={`capability-desc-${card.id}`}
    >
      <div className="flex items-start justify-between mb-8" aria-hidden="true">
        <div className="w-12 h-12 border border-tasc-border flex items-center justify-center group-hover:border-tasc-cyan transition-colors shrink-0">
          <Icon size={22} strokeWidth={1.25} className="text-tasc-text/80 group-hover:text-tasc-cyan transition-colors" aria-hidden="true" />
        </div>
      </div>

      <div className="font-[Orbitron] text-[9px] tracking-[0.3em] text-tasc-text/40 mb-3" aria-hidden="true">
        {card.code}
      </div>
      <h3 id={`capability-title-${card.id}`} className="font-[Montserrat] text-xl md:text-2xl font-medium text-tasc-text mb-4 leading-tight">
        {card.title}
      </h3>
      <div className="mt-auto pt-4 border-t border-tasc-border/50">
        <p id={`capability-desc-${card.id}`} className="text-tasc-text/55 text-sm md:text-[15px] leading-relaxed font-light">
          {card.body}
        </p>
      </div>
    </motion.div>
  );
}

export function SectionHeader({ code, kicker, title, align = "left" }: { code: string, kicker: string, title: string, align?: "left" | "center" }) {
  const a = align === "center" ? "items-center text-center" : "items-start";
  return (
    <div className={`flex flex-col ${a} gap-4`}>
      <div className="flex items-center gap-3 font-[Orbitron] text-[10px] tracking-[0.3em]">
        <span className="w-6 h-px bg-tasc-cyan" />
        <span className="text-tasc-cyan">{code}</span>
        <span className="text-tasc-text/40">/</span>
        <span className="text-tasc-text font-bold text-xs tracking-[0.2em]">{kicker}</span>
      </div>
      <TextReveal 
        text={title}
        as="h2"
        className="font-[Montserrat] font-medium text-3xl md:text-5xl text-tasc-text tracking-tight leading-[1.05] max-w-3xl pt-1 pb-3 overflow-visible"
      />
    </div>
  );
}
