import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function BootScreen() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // 3.5 seconds total boot time to match the video
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-tasc-bg"
        >
          {/* Logo animation container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, filter: "blur(5px)" }}
            animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative px-8"
          >
            <img 
              src="/brand/tasc-logo-dark.png" 
              alt="TASC Boot Logo" 
              className="w-72 md:w-96 lg:w-[480px] brand-logo"
            />
            {/* Fake cyan scanline sweep effect overlaying the logo, recreating the video energy pulse */}
            <motion.div
              initial={{ left: "-40%", opacity: 0 }}
              animate={{ left: "120%", opacity: 1 }}
              transition={{ duration: 2, ease: "easeInOut", delay: 0.8 }}
              className="absolute top-0 bottom-0 w-32 bg-gradient-to-r from-transparent via-tasc-cyan to-transparent skew-x-[-20deg]"
              style={{ mixBlendMode: 'overlay' }}
            />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.5 }}
            className="absolute bottom-16 flex flex-col items-center gap-4 w-full"
          >
            <div className="w-1/2 md:w-64 h-px bg-tasc-border relative overflow-hidden">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 1.5, ease: "easeInOut", repeat: Infinity }}
                className="absolute inset-0 w-1/2 bg-tasc-cyan shadow-[0_0_10px_var(--tasc-cyan)]"
              />
            </div>
            <span className="font-[Orbitron] text-xs tracking-[0.2em] text-tasc-cyan animate-pulse">
              INITIALIZING SYSTEMS...
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
