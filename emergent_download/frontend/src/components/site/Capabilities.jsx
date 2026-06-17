import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Cpu, Activity, Network, Zap, Cloud, Layers } from "lucide-react";

gsap.registerPlugin(ScrollTrigger, SplitText);

const CARDS = [
  {
    id: "plc",
    code: "//02.1",
    icon: Cpu,
    title: "Automation & PLC Systems",
    body: "PLC, HMI, VFD and panel architectures for machines, utilities, and process units. Mitsubishi MELSEC iQ-R/iQ-F, Siemens S7-1500 / S7-400H.",
  },
  {
    id: "scada",
    code: "//02.2",
    icon: Activity,
    title: "SCADA & Visualization",
    body: "GENESIS64, WinCC Unified and PCS 7 dashboards with alarm handling, historian-linked screens and operator-grade UX.",
  },
  {
    id: "net",
    code: "//02.3",
    icon: Network,
    title: "OT Networking & Security",
    body: "Profinet, EtherNet/IP, Modbus, IEC 61850, CC-Link IE. VLANs, DMZs, secure remote access and protocol diagnostics.",
  },
  {
    id: "ems",
    code: "//02.4",
    icon: Zap,
    title: "Energy Management Systems",
    body: "Power, water, steam, compressed air and ZLD utilities — monitored, sub-metered and continuously optimized.",
  },
  {
    id: "iiot",
    code: "//02.5",
    icon: Cloud,
    title: "IIoT & Industry 4.0",
    body: "OPC UA, MQTT over TLS, LoRaWAN, edge gateways and cloud integrations bridging OT to IT cleanly.",
  },
  {
    id: "arch",
    code: "//02.6",
    icon: Layers,
    title: "Interoperability & Architecture",
    body: "Vendor-neutral L0–L4 ISA-95 design for greenfield builds and brownfield modernization across multi-OEM stacks.",
  },
];

export default function Capabilities() {
  return (
    <section
      id="the-arsenal"
      data-testid="section-capabilities"
      className="relative py-24 md:py-32 border-t border-[#2B313A]"
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-10 lg:px-16">
        <SectionHeader code="// 02" kicker="THE ARSENAL" title="Core Capabilities" />

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-[#2B313A]/60 border border-[#2B313A]">
          {CARDS.map((c, i) => (
            <CapabilityCard key={c.id} card={c} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CapabilityCard({ card, index }) {
  const Icon = card.icon;
  return (
    <motion.div
      data-testid={`capability-card-${card.id}`}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="relative bg-[#0D1117] p-8 md:p-10 trace-border group cursor-default"
    >
      <div className="flex items-start justify-between mb-8">
        <div className="w-12 h-12 border border-[#2B313A] flex items-center justify-center group-hover:border-[#00C2FF] transition-colors">
          <Icon size={22} strokeWidth={1.25} className="text-[#E6EDF3]/80 group-hover:text-[#00C2FF] transition-colors" />
        </div>
        <div className="font-[Orbitron] text-[10px] tracking-[0.25em] text-[#2B313A] group-hover:text-[#00C2FF] transition-colors">
          [ + ]
        </div>
      </div>

      <div className="font-[Orbitron] text-[9px] tracking-[0.3em] text-[#E6EDF3]/40 mb-3">
        {card.code}
      </div>
      <h3 className="font-[Montserrat] text-xl md:text-2xl font-medium text-[#E6EDF3] mb-4 leading-tight">
        {card.title}
      </h3>
      <p className="text-[#E6EDF3]/55 text-sm md:text-[15px] leading-relaxed font-light">
        {card.body}
      </p>
    </motion.div>
  );
}

export function SectionHeader({ code, kicker, title, align = "left" }) {
  const a = align === "center" ? "items-center text-center" : "items-start";
  const titleRef = useRef(null);

  useEffect(() => {
    const el = titleRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      const split = new SplitText(el, {
        type: "lines,words",
        linesClass: "split-line overflow-hidden",
      });
      gsap.set(split.lines, { yPercent: 110, opacity: 0 });
      gsap.to(split.lines, {
        yPercent: 0,
        opacity: 1,
        duration: 1.0,
        ease: "expo.out",
        stagger: 0.08,
        scrollTrigger: { trigger: el, start: "top 85%", once: true },
      });
      return () => split.revert();
    }, el);
    return () => ctx.revert();
  }, [title]);

  return (
    <div className={`flex flex-col ${a} gap-4`}>
      <div className="flex items-center gap-3 font-[Orbitron] text-[10px] tracking-[0.3em] text-[#00C2FF]">
        <span className="w-6 h-px bg-[#00C2FF]" />
        <span>{code}</span>
        <span className="text-[#E6EDF3]/40">/</span>
        <span className="text-[#E6EDF3]/40">{kicker}</span>
      </div>
      <h2
        ref={titleRef}
        className="font-[Montserrat] font-medium text-3xl md:text-5xl text-[#E6EDF3] tracking-tight leading-[1.05] max-w-3xl"
      >
        {title}
      </h2>
    </div>
  );
}
