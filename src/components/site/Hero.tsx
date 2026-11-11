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
          
          <p className="text-lg md:text-xl text-soft-white/60 max-w-4xl mx-auto mb-10 font-light leading-relaxed">
            Tenacious Automation (TASC Automation) architects the Industrial Nervous System. We engineer high-availability SCADA, PLC programming, custom power &amp; control panel manufacturing, and Industrial AI solutions for modern manufacturing plants.
          </p>
          
          <div className="flex flex-wrap items-center justify-center gap-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              <MagneticWrapper>
                <button
                  onClick={scrollToVerticals}
                  className="group relative font-[Orbitron] text-[11px] tracking-[0.25em] px-8 py-4 text-slate-900 bg-tasc-cyan hover:bg-tasc-cyan/80 transition-all duration-300 flex items-center gap-3 overflow-hidden border border-tasc-cyan"
                  style={{ borderRadius: '0' }}
                >
                  <span className="relative z-10 flex items-center gap-3 font-semibold">
                    EXPLORE SOLUTIONS
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </button>
              </MagneticWrapper>
            </motion.div>
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
                // WHAT IS TENACIOUS AUTOMATION
              </div>
              <p className="text-[15px] text-tasc-text/75 leading-relaxed font-light relative z-10">
                <strong>Tenacious Automation (TASC Automation)</strong> is an industrial automation systems integrator and certified power &amp; control panel manufacturer. We combine <u className="underline-offset-[3px] decoration-tasc-cyan/40 font-normal">automation engineering</u>, <u className="underline-offset-[3px] decoration-tasc-cyan/40 font-normal">custom panel fabrication</u>, and <u className="underline-offset-[3px] decoration-tasc-cyan/40 font-normal">operational intelligence</u> to help manufacturers reduce downtime, improve energy efficiency, and gain complete visibility across modern plant operations.
              </p>
            </div>
            
            <div className="p-6 md:p-8 border border-tasc-border/50 bg-tasc-bg/50 backdrop-blur-sm relative group overflow-hidden">
              <div className="absolute inset-0 bg-tasc-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="font-[Orbitron] text-[9px] tracking-[0.3em] text-tasc-cyan mb-5 uppercase">
                // KEY CAPABILITIES &amp; FEATURES
              </div>
              <p className="text-[15px] text-tasc-text/75 leading-relaxed font-light relative z-10">
                Key capabilities of Tenacious Automation include: <u className="underline-offset-[3px] decoration-tasc-cyan/40 font-normal">Turnkey PLC/SCADA integration</u> (Siemens, Mitsubishi), <u className="underline-offset-[3px] decoration-tasc-cyan/40 font-normal">Power &amp; Control Panel Manufacturing</u> (custom fabrication &amp; modular enclosures like Rittal and nVent Hoffman), <u className="underline-offset-[3px] decoration-tasc-cyan/40 font-normal">Industrial AI Telemetry</u>, and <u className="underline-offset-[3px] decoration-tasc-cyan/40 font-normal">24/7 SLA Support</u>.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
