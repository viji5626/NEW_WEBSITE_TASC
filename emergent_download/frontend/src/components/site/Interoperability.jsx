import { useEffect, useRef, useState } from "react";
import { SectionHeader } from "./Capabilities";

const NODES = [
  {
    code: "L1",
    title: "Edge / Field Devices",
    body: "Sensors, smart instruments, VFDs, actuators and starters across the physical layer.",
  },
  {
    code: "L2",
    title: "Control Layer",
    body: "PLCs, PACs and remote I/O running safety interlocks, sequence control and local HMIs.",
  },
  {
    code: "L3",
    title: "Supervisory Layer",
    body: "SCADA, operator stations and faceplates with full alarm management and station HMIs.",
  },
  {
    code: "L3.5",
    title: "Historian & Databases",
    body: "Hyper Historian, SQL and time-series stores. Sub-second logging with 10+ year retention.",
  },
  {
    code: "L4",
    title: "Enterprise & Analytics",
    body: "EMS dashboards, OEE, carbon and production KPIs delivered to operations and the C-suite.",
  },
];

export default function Interoperability() {
  const ref = useRef(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      const vh = window.innerHeight;
      const total = r.height - vh;
      const scrolled = Math.min(Math.max(-r.top, 0), total);
      setProgress(total > 0 ? scrolled / total : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section
      id="data-flow-pipeline"
      data-testid="section-interoperability"
      className="relative py-24 md:py-32 border-t border-[#2B313A]"
      ref={ref}
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-10 lg:px-16">
        <SectionHeader code="// 04" kicker="DATA-FLOW PIPELINE" title="The Interoperability Engine" />
        <p className="mt-6 max-w-2xl text-[#E6EDF3]/55 text-base font-light leading-relaxed">
          From physical instruments to enterprise dashboards — TASC architects the full L0–L4
          ISA‑95 stack on standard OT protocols, not proprietary tricks.
        </p>

        <div className="mt-20 relative">
          {/* Central line */}
          <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-px bg-[#2B313A]" />
          <div
            className="absolute left-1/2 top-0 -translate-x-1/2 w-px bg-[#00C2FF]"
            style={{
              height: `${progress * 100}%`,
              boxShadow: "0 0 12px #1F8FFF",
              transition: "height 0.15s linear",
            }}
          />

          <div className="space-y-20 md:space-y-32 relative">
            {NODES.map((n, i) => {
              const isLeft = i % 2 === 0;
              const lit = progress * NODES.length > i + 0.2;
              return (
                <div
                  key={n.code}
                  data-testid={`pipeline-node-${i}`}
                  className="grid grid-cols-2 gap-6 md:gap-12 items-center"
                >
                  <div className={isLeft ? "order-1 text-right pr-6 md:pr-10" : "order-1 invisible"}>
                    {isLeft && <NodeContent node={n} lit={lit} align="right" />}
                  </div>

                  <NodeMarker code={n.code} lit={lit} />

                  <div className={!isLeft ? "order-3 text-left pl-6 md:pl-10" : "order-3 invisible"}>
                    {!isLeft && <NodeContent node={n} lit={lit} align="left" />}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function NodeMarker({ code, lit }) {
  return (
    <div className="order-2 col-span-0 flex items-center justify-center relative">
      <div className="absolute left-1/2 -translate-x-1/2 w-12 h-12 border border-[#2B313A] bg-[#0D1117] flex items-center justify-center transition-all duration-500"
        style={{
          borderColor: lit ? "#00C2FF" : "#2B313A",
          boxShadow: lit ? "0 0 24px -4px rgba(31,143,255,0.6)" : "none",
        }}
      >
        <span
          className="font-[Orbitron] text-[10px] tracking-[0.2em] transition-colors"
          style={{ color: lit ? "#00C2FF" : "#E6EDF3" }}
        >
          {code}
        </span>
      </div>
    </div>
  );
}

function NodeContent({ node, lit, align }) {
  return (
    <div className={align === "right" ? "ml-auto max-w-md" : "mr-auto max-w-md"}>
      <h3 className="font-[Montserrat] text-xl md:text-2xl font-medium text-[#E6EDF3] leading-tight">
        {node.title}
      </h3>
      <p className="mt-3 text-[#E6EDF3]/55 text-sm leading-relaxed font-light">
        {node.body}
      </p>
    </div>
  );
}
