import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { MagneticWrapper } from '@/components/ui/MagneticWrapper';
import { TextReveal } from '@/components/ui/TextReveal';

const Hero = () => {
  const scrollToContact = () => document.getElementById('terminal-interface')?.scrollIntoView({ behavior: 'smooth' });
  const scrollToVerticals = () => document.getElementById('the-arsenal')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <section className="relative min-h-[80vh] flex items-center justify-center pt-32 pb-16 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto w-full text-center z-10 mt-8">
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
                  className="group relative font-[Orbitron] text-[11px] tracking-[0.25em] px-8 py-4 border border-tasc-cyan bg-tasc-bg text-tasc-cyan overflow-hidden hover:bg-tasc-cyan hover:text-white transition-all duration-300"
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
                  className="group relative font-[Orbitron] text-[11px] tracking-[0.25em] px-8 py-4 text-tasc-text hover:text-white hover:bg-tasc-cyan/80 transition-all duration-300 flex items-center gap-3 overflow-hidden border border-tasc-border hover:border-tasc-cyan"
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
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
