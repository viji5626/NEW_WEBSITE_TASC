import { useNavigate } from "react-router-dom";
import { SectionHeader } from "./Capabilities";

const SERVICES = [
  "Digitalization Feasibility",
  "Communication Audits",
  "I/O Control & SCADA Studies",
  "Greenfield Scope Definition",
  "Network Topology Design",
  "Secure OT Infrastructure"
];

export default function ConsultingSection() {
  const navigate = useNavigate();

  return (
    <section
      id="we-consult"
      className="relative py-24 md:py-32 border-t border-tasc-border"
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-10 lg:px-16">
        <SectionHeader code="// 09" kicker="WE CONSULT" title="Expert industrial consulting for greenfield and brownfield projects." />

        <div className="mt-12 md:mt-16 grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
          <div>
            <p className="text-tasc-text/70 leading-relaxed font-light text-lg">
              We provide strategic industrial consulting grounded in practical engineering judgment. 
              Our execution-oriented approach ensures that your digital transformation, control 
              system design, and network topologies are practical, reliable, and scalable.
            </p>
            <p className="mt-6 text-tasc-text/70 leading-relaxed font-light text-lg text-tasc-cyan">
              All project discussions, technical constraints, and strategic roadmaps are kept strictly 
              confidential, supported by comprehensive NDA agreements.
            </p>

            <button
              onClick={() => {
                navigate('/consulting');
              }}
              className="mt-10 font-[Orbitron] text-xs tracking-[0.2em] px-8 py-4 bg-tasc-bg text-tasc-cyan border border-tasc-cyan hover:bg-tasc-cyan hover:text-slate-900 transition-colors uppercase"
            >
              Explore Consulting Services
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-px border border-tasc-border bg-tasc-border/60">
            {SERVICES.map((service, i) => (
              <div key={i} className="bg-tasc-bg p-6 flex flex-col justify-center" tabIndex={0} role="listitem" aria-label={`Consulting service: ${service}`}>
                <div className="w-1.5 h-1.5 rounded-full bg-tasc-cyan shadow-[0_0_8px_var(--tasc-cyan)] mb-4" aria-hidden="true" />
                <span className="font-[Montserrat] text-tasc-text leading-tight font-medium text-sm">
                  {service}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
