import { useEffect, useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShieldCheck, ShieldAlert, Shield, ArrowRight, RefreshCw } from "lucide-react";
import { scrollToTop } from "@/lib/scrollTo";
import { safeSessionStorage } from "@/lib/safeStorage";
import TurnstileWidget, { TurnstileWidgetRef } from "./TurnstileWidget";

export default function BootScreen() {
  const [isVerified, setIsVerified] = useState<boolean>(() => {
    return safeSessionStorage.getItem("tasc_turnstile_verified") === "true";
  });
  const [isVisible, setIsVisible] = useState<boolean>(() => {
    const verified = safeSessionStorage.getItem("tasc_turnstile_verified") === "true";
    return !verified;
  });
  const [verificationStatus, setVerificationStatus] = useState<"idle" | "verifying" | "success" | "error">("idle");
  const [token, setToken] = useState<string>("");
  const [showBypass, setShowBypass] = useState<boolean>(false);
  const turnstileRef = useRef<TurnstileWidgetRef>(null);

  const unlockScroll = useCallback(() => {
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
  }, []);

  const finishBoot = useCallback(() => {
    setIsVisible(false);
    safeSessionStorage.setItem("booted", "true");
    safeSessionStorage.setItem("tasc_turnstile_verified", "true");
    unlockScroll();
  }, [unlockScroll]);

  // Handle successful Turnstile verification
  const handleVerify = useCallback(async (verifiedToken: string) => {
    setToken(verifiedToken);
    setVerificationStatus("success");
    setIsVerified(true);

    // Verify token with backend in background
    try {
      fetch("/api/turnstile/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          "cf-turnstile-response": verifiedToken,
          action: "landing"
        })
      }).catch((e) => {
        console.warn("Backend pre-landing verification check:", e);
      });
    } catch (_) {}

    // Allow user to see "Clearance Granted" confirmation for a split second before unlocking
    setTimeout(() => {
      finishBoot();
    }, 750);
  }, [finishBoot]);

  const handleExpire = useCallback(() => {
    setVerificationStatus("error");
    setToken("");
  }, []);

  const handleError = useCallback((err: any) => {
    console.warn("Turnstile pre-landing error event:", err);
    setVerificationStatus("error");
    setShowBypass(true);
  }, []);

  useEffect(() => {
    if (!isVisible) {
      unlockScroll();
      return;
    }

    // Lock scroll during pre-landing verification
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    if (typeof window !== "undefined") {
      scrollToTop(true);
    }

    // Check for SEO crawlers / Lighthouse / search bots
    const isBot = typeof navigator !== "undefined" && /Lighthouse|bot|crawler|spider|Googlebot|bingbot/i.test(navigator.userAgent);
    if (isBot) {
      finishBoot();
      return;
    }

    // Show fallback bypass option after 7 seconds if Cloudflare Turnstile script is blocked by an adblocker
    const timer = setTimeout(() => {
      setShowBypass(true);
    }, 7000);

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
          exit={{ opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-tasc-bg px-4 select-none overflow-y-auto"
        >
          {/* Subtle background tech grid */}
          <div
            aria-hidden
            className="pointer-events-none fixed inset-0 bp-grid opacity-[0.25] z-0"
          />

          <div className="relative z-10 w-full max-w-md mx-auto flex flex-col items-center text-center">
            {/* Logo animation container */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, filter: "blur(4px)" }}
              animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative px-4 mb-6"
            >
              <img
                src="/brand/tasc-logo-dark.png"
                alt="TASC Automation"
                className="w-56 sm:w-64 md:w-80 brand-logo mx-auto"
              />
              {/* Cyan scanline sweep effect overlaying the logo */}
              <motion.div
                initial={{ left: "-40%", opacity: 0 }}
                animate={{ left: "120%", opacity: 1 }}
                transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
                className="absolute top-0 bottom-0 w-28 bg-gradient-to-r from-transparent via-tasc-cyan to-transparent skew-x-[-20deg]"
                style={{ mixBlendMode: "overlay" }}
              />
            </motion.div>

            {/* Security Clearance Gate Container */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="w-full border border-tasc-border bg-tasc-bg/90 p-5 md:p-6 relative shadow-2xl"
            >
              {/* Corner accent decorations */}
              <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t border-l border-tasc-cyan" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t border-r border-tasc-cyan" />
              <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b border-l border-tasc-cyan" />
              <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b border-r border-tasc-cyan" />

              {/* Status Header */}
              <div className="flex items-center justify-between border-b border-tasc-border pb-3 mb-4 text-left">
                <div className="flex items-center gap-2">
                  {verificationStatus === "success" ? (
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : verificationStatus === "error" ? (
                    <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                  ) : (
                    <Shield className="w-4 h-4 text-tasc-cyan shrink-0 animate-pulse" />
                  )}
                  <span className="font-[Orbitron] text-[10px] tracking-[0.2em] text-tasc-text/90">
                    PRE-LANDING SECURITY CLEARANCE
                  </span>
                </div>
                <span className="font-mono text-[9px] text-tasc-cyan tracking-widest uppercase">
                  [ 00.1 ]
                </span>
              </div>

              <p className="text-xs text-tasc-text/70 mb-4 text-left font-mono leading-relaxed">
                Verifying your browser connection before granting landing access to TASC Automation systems.
              </p>

              {/* Cloudflare Turnstile Widget */}
              <div className="w-full flex flex-col items-center justify-center my-2">
                <TurnstileWidget
                  ref={turnstileRef}
                  id="cf-turnstile-prelanding"
                  title="CLOUDFLARE BOT DEFENSE"
                  action="landing"
                  theme="dark"
                  onVerify={handleVerify}
                  onExpire={handleExpire}
                  onError={handleError}
                  className="w-full bg-slate-950/40 border border-tasc-border"
                />
              </div>

              {/* Status bar */}
              <div className="mt-4 pt-3 border-t border-tasc-border flex items-center justify-between text-left">
                {verificationStatus === "success" ? (
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-mono">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span className="font-[Orbitron] text-[10px] tracking-widest uppercase">
                      CLEARANCE GRANTED // ENTERING...
                    </span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-tasc-text/50 text-xs font-mono">
                    <span className="w-1.5 h-1.5 rounded-full bg-tasc-cyan animate-ping" />
                    <span className="font-mono text-[10px] tracking-wider">
                      Awaiting Cloudflare verification...
                    </span>
                  </div>
                )}

                {/* Graceful fallback/bypass if browser adblocker or network prevents Turnstile */}
                {showBypass && verificationStatus !== "success" && (
                  <button
                    type="button"
                    onClick={finishBoot}
                    className="inline-flex items-center gap-1 font-[Orbitron] text-[9px] tracking-widest text-tasc-cyan hover:text-white transition-colors"
                  >
                    CONTINUE <ArrowRight className="w-3 h-3" />
                  </button>
                )}
              </div>
            </motion.div>

            {/* Industrial footnote */}
            <div className="mt-6 flex flex-col items-center gap-1.5">
              <span className="font-[Orbitron] text-[9px] tracking-[0.25em] text-tasc-text/40 uppercase">
                TENACIOUS AUTOMATION SOLUTIONS &amp; CONSULTING
              </span>
              <span className="font-mono text-[9px] tracking-widest text-tasc-text/30">
                SECURE END-TO-END INDUSTRIAL ARCHITECTURE
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
