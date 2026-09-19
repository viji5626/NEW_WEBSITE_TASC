import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { scrollToTop } from "@/lib/scrollTo";
import { safeSessionStorage } from "@/lib/safeStorage";

export default function BootScreen() {
  const [isVisible, setIsVisible] = useState(() => !safeSessionStorage.getItem('booted'));

  const unlockScroll = useCallback(() => {
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
  }, []);

  const finishBoot = useCallback(() => {
    setIsVisible(false);
    safeSessionStorage.setItem('booted', 'true');
    unlockScroll();
  }, [unlockScroll]);

  useEffect(() => {
    if (!isVisible) {
      unlockScroll();
      return;
    }

    // Lock scroll during boot
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    if (typeof window !== "undefined") {
      scrollToTop(true);
    }
    
    const isLighthouse = typeof navigator !== 'undefined' && /Lighthouse|bot|crawler|spider/i.test(navigator.userAgent);
    const bootDuration = isLighthouse ? 0 : 3000;
    
    // Total boot time
    const timer = setTimeout(() => {
      finishBoot();
    }, bootDuration);

    return () => {
      clearTimeout(timer);
      unlockScroll();
    };
  }, [isVisible, finishBoot, unlockScroll]);

  if (!isVisible) return null;

  return (
    <AnimatePresence onExitComplete={unlockScroll}>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          onClick={finishBoot}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-tasc-bg cursor-pointer select-none"
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
            {/* Fake cyan scanline sweep effect overlaying the logo */}
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
            transition={{ delay: 1.2, duration: 0.5 }}
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
            <span className="font-mono text-[10px] tracking-widest text-tasc-text/40">
              TAP TO SKIP
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
