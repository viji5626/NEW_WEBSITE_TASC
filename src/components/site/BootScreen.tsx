import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import { scrollToTop } from "@/lib/scrollTo";
import { safeSessionStorage } from "@/lib/safeStorage";

export default function BootScreen() {
  const [isVisible, setIsVisible] = useState<boolean>(() => {
    // Only show once per session; if previously booted, skip instantly
    return safeSessionStorage.getItem("booted") !== "true";
  });

  const unlockScroll = useCallback(() => {
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
  }, []);

  const finishBoot = useCallback(() => {
    setIsVisible(false);
    safeSessionStorage.setItem("booted", "true");
    unlockScroll();
  }, [unlockScroll]);

  useEffect(() => {
    if (!isVisible) {
      unlockScroll();
      return;
    }

    // Temporarily lock scroll during the brief intro presentation
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    if (typeof window !== "undefined") {
      scrollToTop(true);
    }

    // Auto-advance into site after 1.2s animation
    const timer = setTimeout(() => {
      finishBoot();
    }, 1200);

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
          exit={{ opacity: 0, transition: { duration: 0.5, ease: "easeInOut" } }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-tasc-bg px-4 select-none cursor-pointer"
          onClick={finishBoot}
        >
          {/* Subtle background tech grid */}
          <div
            aria-hidden
            className="pointer-events-none fixed inset-0 bp-grid opacity-[0.25] z-0"
          />

          <div className="relative z-10 flex flex-col items-center text-center">
            {/* Logo animation */}
            <motion.div
              initial={{ scale: 0.92, opacity: 0, filter: "blur(4px)" }}
              animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="relative px-4"
            >
              <img
                src="/brand/tasc-logo-dark.png"
                alt="TASC Automation"
                className="w-64 sm:w-80 md:w-96 brand-logo"
              />
              {/* Cyan scanline sweep effect */}
              <motion.div
                initial={{ left: "-40%", opacity: 0 }}
                animate={{ left: "120%", opacity: 1 }}
                transition={{ duration: 1.2, ease: "easeInOut", delay: 0.2 }}
                className="absolute top-0 bottom-0 w-28 bg-gradient-to-r from-transparent via-tasc-cyan to-transparent skew-x-[-20deg]"
                style={{ mixBlendMode: "overlay" }}
              />
            </motion.div>

            {/* Industrial loading indicator line */}
            <motion.div
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: "160px", opacity: 1 }}
              transition={{ duration: 0.9, delay: 0.3, ease: "easeInOut" }}
              className="h-[2px] bg-gradient-to-r from-transparent via-tasc-cyan to-transparent mt-6 mb-3"
            />

            {/* Status ticker */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center gap-2 font-[Orbitron] text-[10px] tracking-[0.25em] text-tasc-text/60"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-tasc-cyan animate-ping" />
              <span>INITIALIZING INDUSTRIAL LOGIX</span>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
