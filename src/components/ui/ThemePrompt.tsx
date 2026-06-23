import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Moon, Sun } from 'lucide-react';
import { safeLocalStorage } from '@/lib/safeStorage';

export const ThemePrompt = ({ onComplete }: { onComplete: () => void }) => {
  const [timeLeft, setTimeLeft] = useState(3);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Lock scroll during prompt
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleAutoTheme();
      return;
    }

    const countdown = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(countdown);
  }, [timeLeft]);

  const setTheme = (isLight: boolean) => {
    if (isLight) {
      document.documentElement.classList.add('light');
      safeLocalStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.remove('light');
      safeLocalStorage.setItem('theme', 'dark');
    }
    
    // Dispatch event so Header can catch the change
    window.dispatchEvent(new Event('theme-changed'));
    closePrompt();
  };

  const handleAutoTheme = () => {
    setTheme(false); // Default to Dark mode
  };

  const closePrompt = () => {
    setIsVisible(false);
    document.body.style.overflow = "";
    setTimeout(onComplete, 500); // give time for exit animation
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[99998] flex flex-col items-center justify-center bg-tasc-bg/95 backdrop-blur-md"
        >
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="flex flex-col items-center max-w-md w-full px-6"
          >
            <div className="font-[Orbitron] text-tasc-cyan text-sm tracking-[0.2em] mb-8 text-center uppercase">
              [ Select Interface Mode ]
            </div>
            
            <div className="flex gap-6 w-full justify-center mb-8">
              <button
                onClick={() => setTheme(true)}
                className="group flex flex-col items-center justify-center p-6 border border-tasc-border hover:border-tasc-cyan bg-white/5 transition-all w-32"
              >
                <Sun className="mb-4 text-tasc-text/70 group-hover:text-tasc-cyan" size={32} />
                <span className="font-[Orbitron] text-[10px] tracking-widest text-tasc-text/80 group-hover:text-tasc-cyan">LIGHT</span>
              </button>
              <button
                onClick={() => setTheme(false)}
                className="group flex flex-col items-center justify-center p-6 border border-tasc-border hover:border-tasc-cyan bg-black/50 transition-all w-32"
              >
                <Moon className="mb-4 text-tasc-text/70 group-hover:text-tasc-cyan" size={32} />
                <span className="font-[Orbitron] text-[10px] tracking-widest text-tasc-text/80 group-hover:text-tasc-cyan">DARK</span>
              </button>
            </div>
            
            <div className="text-tasc-text/60 font-light text-sm text-center mb-6">
              You can switch later using the icon in the menu bar.
            </div>

            <div className="w-full h-[1px] bg-tasc-border relative mb-4">
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 3, ease: "linear" }}
                className="absolute inset-y-0 left-0 bg-tasc-cyan"
              />
            </div>
            <div className="font-[Orbitron] text-[10px] text-tasc-text/40 tracking-widest uppercase">
              Auto selection in {timeLeft}s (Defaulting to Dark)
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
