import React, { useState } from "react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FAQS = [
  {
    question: "How long does a typical control system integration or migration take?",
    answer: "Lead times depend on system scale and whether it is a greenfield build or a brownfield upgrade. A standard medium-scale PLC/SCADA migration typically spans 8 to 12 weeks—from footprint analysis and code conversion to Site Acceptance Testing (SAT) and final commissioning."
  },
  {
    question: "What is your support availability and AMC (Annual Maintenance Contract) structure?",
    answer: "We offer comprehensive AMCs with tiered Service Level Agreements (SLAs). Top-tier plans include 24/7 remote diagnostic support via secure VPN, rapid on-site response for critical machine faults, and scheduled preventive maintenance visits to minimize unplanned downtime."
  },
  {
    question: "Are you tied to a single vendor for PLC and SCADA hardware?",
    answer: "We are an independent, brand-agnostic system integrator. While we possess deep core competencies in Siemens (TIA Portal, PCS 7) and Mitsubishi Electric (GX Works, ICONICS), we architect solutions using the optimal hardware for your operational constraints, natively supporting Rockwell/Allen-Bradley, Schneider, and Omron ecosystems."
  },
  {
    question: "Do you supply custom MCC, PCC, VFD, and PLC panels?",
    answer: "Yes, we provide turnkey panel engineering. Our team handles complete end-to-end manufacturing—from thermal calculations, component sizing, and CAD wiring schematics to assembly, rigorous Factory Acceptance Testing (FAT), and dispatch."
  },
  {
    question: "How do you integrate Industrial AI into existing brownfield plants?",
    answer: "We deploy secure Edge AI gateways and localized LLMs (like Ollama) directly within your OT network. This allows the AI models to ingest real-time OPC DA/UA data from existing SCADA/Historians, providing predictive maintenance and anomaly detection without exposing sensitive operational data to public cloud infrastructure."
  },
  {
    question: "Can your team build full-stack web applications for our manufacturing data?",
    answer: "Absolutely. Leveraging modern tech stacks alongside AI orchestration (Vibe Coding), we rapidly develop robust internal web portals, dashboards, and Microservices. We bridge the gap between plant-floor SQL/Historian databases and top-floor ERP/MES systems for real-time visibility."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleOpen = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="relative min-h-[100vh] py-32 px-6 md:px-10 lg:px-16 mx-auto max-w-[1000px] z-10 flex flex-col justify-center">
      <ScrollReveal>
        <div className="mb-16 md:mb-20 mt-16 text-center">
          <h2 className="font-[Orbitron] tracking-widest text-tasc-cyan text-sm uppercase mb-6 flex items-center justify-center gap-4">
            <span className="w-8 h-px bg-tasc-cyan" />
            12.01 // Technical Inquiries
            <span className="w-8 h-px bg-tasc-cyan" />
          </h2>
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight mb-8 leading-tight">
            Frequently Asked <br className="md:hidden" />
            <span className="text-tasc-text/50">Questions</span>
          </h1>
          <p className="text-lg text-tasc-text/70 leading-relaxed font-light max-w-2xl mx-auto">
            Find technical insights regarding our integration processes, lead times, post-commissioning support, and technology agnostic capabilities.
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.2}>
        <div className="flex flex-col gap-4">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div 
                key={index} 
                className={`border border-tasc-border bg-tasc-bg overflow-hidden transition-colors duration-300 ${isOpen ? 'border-tasc-cyan/50' : 'hover:border-tasc-border/80'}`}
              >
                <button
                  onClick={() => toggleOpen(index)}
                  className="w-full text-left px-6 py-5 md:px-8 md:py-6 flex items-center justify-between gap-4 focus:outline-none"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${index}`}
                >
                  <h3 className="font-[Montserrat] text-base md:text-lg font-medium text-tasc-text pr-4">
                    {faq.question}
                  </h3>
                  <div className={`shrink-0 w-8 h-8 flex items-center justify-center border transition-all duration-300 ${isOpen ? 'border-tasc-cyan text-tasc-cyan rotate-180' : 'border-tasc-border text-tasc-text/50'}`}>
                    <ChevronDown size={18} />
                  </div>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-answer-${index}`}
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 md:px-8 md:pb-8 pt-0 border-t border-tasc-border/30 mt-2">
                        <p className="text-tasc-text/60 leading-relaxed text-sm md:text-base font-light pt-6">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </ScrollReveal>
    </section>
  );
}
