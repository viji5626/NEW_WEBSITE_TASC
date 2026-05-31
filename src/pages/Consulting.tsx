import { CheckCircle, ShieldCheck, FileSearch, Network, GitPullRequest, Workflow, HardHat, FileText } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 40, rotateX: -15 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 100
    }
  }
};

const SERVICES = [
  {
    title: "Feasibility Study for Digitalization",
    description: "Comprehensive audits of existing facilities to map out practical roadmaps for digital transformation.",
    outcome: "Clear ROI projections and technology validation before capital commitment.",
    icon: <FileSearch className="text-tasc-cyan mb-4" size={32} />
  },
  {
    title: "Industrial Communication Feasibility Check",
    description: "Evaluating protocols and infrastructure to ensure reliable data flow between field devices and enterprise systems.",
    outcome: "Elimination of bottlenecks and seamless protocol interoperability.",
    icon: <Network className="text-tasc-cyan mb-4" size={32} />
  },
  {
    title: "I/O Studies for Control System and SCADA",
    description: "Detailed system architecture planning, right-sizing PLC hardware, and mapping precise I/O requirements.",
    outcome: "Accurate hardware sizing, optimized licensing, and future-proof expansion capability.",
    icon: <GitPullRequest className="text-tasc-cyan mb-4" size={32} />
  },
  {
    title: "Scope Studies",
    description: "Translating high-level business objectives into strict engineering specifications and functional design documents.",
    outcome: "Rigid project boundaries that prevent scope creep and ensure timely delivery.",
    icon: <FileText className="text-tasc-cyan mb-4" size={32} />
  },
  {
    title: "Industrial Network Topology Design",
    description: "Architecting resilient ring, star, and hybrid topologies optimized for deterministic industrial control.",
    outcome: "High-availability networks with guaranteed uptime for mission-critical operations.",
    icon: <Workflow className="text-tasc-cyan mb-4" size={32} />
  },
  {
    title: "OT Networking Design and Development",
    description: "Building secure boundaries between IT and OT, implementing robust firewalls, and establishing safe remote access.",
    outcome: "Cyber-secure operations compliant with international industrial standards.",
    icon: <ShieldCheck className="text-tasc-cyan mb-4" size={32} />
  }
];

export default function Consulting() {
  return (
    <section className="relative min-h-[100vh] py-32 px-6 md:px-10 lg:px-16 mx-auto max-w-[1440px] z-10 flex flex-col justify-center">
      <ScrollReveal>
        <div className="mb-16 md:mb-24 mt-16 max-w-3xl">
          <h2 className="font-[Orbitron] tracking-widest text-tasc-cyan text-sm uppercase mb-6 flex items-center gap-4">
            <span className="w-8 h-px bg-tasc-cyan" />
            0X.01 // Engineering Strategy
          </h2>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-8">
            Industrial Consulting & <br />
            <span className="text-tasc-text/50">Engineering Strategy</span>
          </h1>
          <p className="text-lg text-tasc-text/70 leading-relaxed font-light mb-6">
            We bring real-world project mindset and PMP-oriented planning to your facility. Our execution-oriented approach ensures that every study translates into practical, reliable, and scalable infrastructure.
          </p>
          <p className="text-lg text-tasc-text/70 leading-relaxed font-light">
            <strong className="text-tasc-text font-normal">Greenfield & Brownfield Expertise:</strong> Whether defining secure network perimeters for new greenfield sites or auditing integration limits within legacy brownfield environments, our consulting brings clarity and actionable roadmaps to complex environments.
          </p>
        </div>
      </ScrollReveal>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10% 0px" }}
        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
      >
        {SERVICES.map((service, idx) => (
          <motion.div 
            key={idx}
            variants={itemVariants}
            style={{ transformOrigin: "bottom center", willChange: "transform, opacity" }}
            className="p-8 border border-tasc-border bg-tasc-bg hover:border-tasc-cyan/50 transition-all duration-300 group h-full flex flex-col relative overflow-hidden"
          >
              <div className="absolute inset-0 bg-tasc-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <div className="relative z-10 flex flex-col h-full">
                {service.icon}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-medium pr-4">{service.title}</h3>
                </div>
                
                <p className="text-tasc-text/60 leading-relaxed mb-6 flex-grow text-sm">
                  {service.description}
                </p>

                <div className="pt-6 border-t border-tasc-border/50 mt-auto">
                  <span className="text-[10px] font-[Orbitron] text-tasc-text/40 tracking-widest uppercase w-full block mb-2">Key Outcome</span>
                  <p className="text-sm font-medium text-tasc-cyan/90 leading-tight">
                    {service.outcome}
                  </p>
                </div>
              </div>
          </motion.div>
        ))}
      </motion.div>
      
      <ScrollReveal delay={0.3}>
        <div className="mt-20 grid md:grid-cols-2 gap-12 border-t border-tasc-border/50 pt-16">
          <div>
             <h3 className="text-2xl font-medium text-tasc-text mb-6 flex items-center gap-3">
               <HardHat className="text-tasc-cyan" />
               Why Clients Work With Us
             </h3>
             <ul className="space-y-4">
               {[
                 "Practical industrial experience over theoretical models",
                 "Real project understanding across diverse verticals",
                 "Engineering judgment refined by execution",
                 "PMP-oriented planning mindset for strict timelines"
               ].map((point, i) => (
                 <li key={i} className="flex items-start gap-3">
                   <div className="w-1.5 h-1.5 rounded-full bg-tasc-cyan mt-2 shrink-0" />
                   <span className="text-tasc-text/70">{point}</span>
                 </li>
               ))}
             </ul>
          </div>

          <div>
             <h3 className="text-2xl font-medium text-tasc-text mb-6 flex items-center gap-3">
               <ShieldCheck className="text-tasc-cyan" />
               Confidentiality & NDAs
             </h3>
             <p className="text-tasc-text/70 leading-relaxed mb-4">
               We handle strategic consulting assignments with absolute strictness regarding confidentiality. We seamlessly integrate into your early-stage planning phases under fully executed Non-Disclosure Agreements.
             </p>
             <p className="text-tasc-text/70 leading-relaxed">
               All project discussions, technical constraints, plant data topologies, and business information remain private and aggressively protected.
             </p>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.4}>
         <div className="mt-16 p-8 border border-tasc-cyan/30 bg-tasc-cyan/5 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
             <div className="absolute -right-16 -top-16 opacity-20 transform rotate-45 pointer-events-none">
                <div className="w-64 h-[1px] bg-tasc-cyan mb-4" />
                <div className="w-64 h-[1px] bg-tasc-cyan mb-4" />
                <div className="w-64 h-[1px] bg-tasc-cyan" />
             </div>
             
             <div className="max-w-2xl relative z-10">
                 <h4 className="text-xl font-medium text-tasc-cyan mb-2">Ready to align your project vision with engineering truth?</h4>
                 <p className="text-tasc-text/70">Secure your operational strategy with a confidential discovery session.</p>
             </div>
             
             <a href="/#terminal-interface" onClick={(e) => {
                 e.preventDefault();
                 window.location.href = "/#terminal-interface";
             }} className="whitespace-nowrap px-8 py-3 bg-tasc-cyan text-tasc-bg font-[Orbitron] text-[10px] tracking-[0.2em] hover:bg-tasc-text hover:text-tasc-bg transition-colors relative z-10">
                 [ INITIATE A DISCOVERY SESSION ]
             </a>
         </div>
      </ScrollReveal>
    </section>
  );
}
