import React, { Suspense } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { MagneticWrapper } from '@/components/ui/MagneticWrapper';
import { TextReveal } from '@/components/ui/TextReveal';
import { scrollToId } from '@/lib/scrollTo';

const HeroBackground3D = React.lazy(() => 
  import('@/components/ui/HeroBackground3D').then(m => ({ default: m.HeroBackground3D }))
);

const Hero = () => {
  const scrollToContact = () => scrollToId('terminal-interface');
  const scrollToVerticals = () => scrollToId('the-arsenal');

  return (
    <section id="command-center" className="relative min-h-[70vh] flex flex-col items-center justify-center pt-24 pb-16 px-6 overflow-hidden">
      <Suspense fallback={null}>
        <HeroBackground3D />
      </Suspense>
      <div className="max-w-7xl mx-auto w-full text-center z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <TextReveal 
            text="Tenacious Automation"
            className="text-5xl md:text-7xl lg:text-[100px] font-display font-bold leading-[0.85] mb-2 uppercase max-w-6xl mx-auto tracking-tighter justify-center text-center pt-1 overflow-visible"
            as="h1"
          />
          <TextReveal 
            text="Solutions & Consulting"
            className="text-3xl md:text-5xl lg:text-[60px] font-display font-bold leading-[0.85] mb-6 uppercase max-w-6xl mx-auto tracking-tighter justify-center text-center text-tasc-cyan pt-1 pb-3 overflow-visible"
            as="h2"
          />
          
          <p className="text-lg md:text-xl text-soft-white/60 max-w-3xl mx-auto mb-10 font-light leading-relaxed">
            Architecting the Industrial Nervous System. We engineer high-availability SCADA, PLC, and IIoT architectures for the world's most demanding industries.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <MagneticWrapper>
                <button
                  onClick={scrollToContact}
                  className="group relative font-[Orbitron] text-[11px] tracking-[0.25em] px-8 py-4 border border-tasc-cyan bg-tasc-bg text-tasc-cyan overflow-hidden hover:bg-tasc-cyan hover:text-slate-900 transition-all duration-300"
                  style={{ borderRadius: '0' }}
                >
                  <span className="relative z-10">[ INITIATE CONSULTATION ]</span>
                </button>
              </MagneticWrapper>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <MagneticWrapper>
                <button
                  onClick={scrollToVerticals}
                  className="group relative font-[Orbitron] text-[11px] tracking-[0.25em] px-8 py-4 text-tasc-text hover:text-slate-900 hover:bg-tasc-cyan/80 transition-all duration-300 flex items-center gap-3 overflow-hidden border border-tasc-border hover:border-tasc-cyan"
                  style={{ borderRadius: '0' }}
                >
                  <span className="relative z-10 flex items-center gap-3">
                    EXPLORE SOLUTIONS
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </MagneticWrapper>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-20 md:mt-32 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 text-left"
          >
            <div className="p-6 md:p-8 border border-tasc-border/50 bg-tasc-bg/50 backdrop-blur-sm relative group overflow-hidden">
              <div className="absolute inset-0 bg-tasc-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="font-[Orbitron] text-[9px] tracking-[0.3em] text-tasc-cyan mb-5 uppercase">
                // WHY TASC
              </div>
              <p className="text-[15px] text-tasc-text/75 leading-relaxed font-light relative z-10">
                TASC (Tenacious Automation Solutions & Consulting) combines <u className="underline-offset-[3px] decoration-tasc-cyan/40 font-normal">automation</u>, <u className="underline-offset-[3px] decoration-tasc-cyan/40 font-normal">industrial data</u>, and <u className="underline-offset-[3px] decoration-tasc-cyan/40 font-normal">operational intelligence</u> to help manufacturers <u className="underline-offset-[3px] decoration-tasc-cyan/40 font-normal">reduce downtime</u>, <u className="underline-offset-[3px] decoration-tasc-cyan/40 font-normal">improve energy efficiency</u>, and gain <u className="underline-offset-[3px] decoration-tasc-cyan/40 font-normal">complete visibility</u> across their operations. By bridging the gap between plant-floor systems and business-level decision-making, we deliver <u className="underline-offset-[3px] decoration-tasc-cyan/40 font-normal">measurable operational and financial impact</u>.
              </p>
            </div>
            
            <div className="p-6 md:p-8 border border-tasc-border/50 bg-tasc-bg/50 backdrop-blur-sm relative group overflow-hidden">
              <div className="absolute inset-0 bg-tasc-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="font-[Orbitron] text-[9px] tracking-[0.3em] text-tasc-cyan mb-5 uppercase">
                // OUR APPROACH
              </div>
              <p className="text-[15px] text-tasc-text/75 leading-relaxed font-light relative z-10">
                We believe automation should deliver <u className="underline-offset-[3px] decoration-tasc-cyan/40 font-normal">business outcomes</u>—not just system integration. By connecting plant-floor systems with <u className="underline-offset-[3px] decoration-tasc-cyan/40 font-normal">actionable data</u> and <u className="underline-offset-[3px] decoration-tasc-cyan/40 font-normal">actionable insights</u>, we help organizations <u className="underline-offset-[3px] decoration-tasc-cyan/40 font-normal">improve productivity</u>, <u className="underline-offset-[3px] decoration-tasc-cyan/40 font-normal">optimize resources</u>, and make <u className="underline-offset-[3px] decoration-tasc-cyan/40 font-normal">faster, data-driven decisions</u>.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
