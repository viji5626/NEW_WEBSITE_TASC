import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from "react";
import { ShieldCheck, ShieldAlert, Shield, RefreshCw } from "lucide-react";

export interface TurnstileWidgetRef {
  reset: () => void;
  remove: () => void;
  getResponse: () => string | undefined;
}

interface TurnstileWidgetProps {
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: (error?: any) => void;
  theme?: "dark" | "light" | "auto";
  action?: string;
  className?: string;
  id?: string;
  title?: string;
}

// Configured Cloudflare Turnstile site key
export const CONFIGURED_SITE_KEY = "0x4AAAAAAExngSt5D0NoAlM0";

export const TurnstileWidget = forwardRef<TurnstileWidgetRef, TurnstileWidgetProps>(
  ({ onVerify, onExpire, onError, theme = "dark", action = "contact", className = "", id, title = "CLOUDFLARE TURNSTILE" }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const widgetIdRef = useRef<string | null>(null);
    const [status, setStatus] = useState<"loading" | "ready" | "verified" | "expired" | "error">("loading");
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const siteKey =
      (import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined)?.trim() ||
      CONFIGURED_SITE_KEY;

    const isTestKey = siteKey.startsWith("1x") || siteKey.startsWith("2x") || siteKey.startsWith("3x");

    useImperativeHandle(ref, () => ({
      reset: () => {
        if (widgetIdRef.current && window.turnstile) {
          try {
            window.turnstile.reset(widgetIdRef.current);
            setStatus("ready");
            setErrorMessage(null);
          } catch (e) {
            console.warn("Turnstile reset error:", e);
          }
        }
      },
      remove: () => {
        if (widgetIdRef.current && window.turnstile) {
          try {
            window.turnstile.remove(widgetIdRef.current);
            widgetIdRef.current = null;
          } catch (e) {
            console.warn("Turnstile remove error:", e);
          }
        }
      },
      getResponse: () => {
        if (widgetIdRef.current && window.turnstile) {
          return window.turnstile.getResponse(widgetIdRef.current);
        }
        return undefined;
      }
    }));

    useEffect(() => {
      let isMounted = true;

      const renderWidget = () => {
        if (!containerRef.current || !window.turnstile || widgetIdRef.current !== null) {
          return;
        }

        try {
          // Clear any leftover child nodes
          containerRef.current.innerHTML = "";

          const id = window.turnstile.render(containerRef.current, {
            sitekey: siteKey,
            action,
            theme,
            size: "flexible",
            callback: (token: string) => {
              if (!isMounted) return;
              setStatus("verified");
              setErrorMessage(null);
              onVerify(token);
            },
            "expired-callback": () => {
              if (!isMounted) return;
              setStatus("expired");
              onExpire?.();
            },
            "error-callback": (err: any) => {
              if (!isMounted) return;
              console.warn("Turnstile execution event:", err);
              setStatus("error");
              setErrorMessage("Verification challenge encountered an issue. Please retry.");
              onError?.(err);
            }
          });

          widgetIdRef.current = id;
          if (isMounted) {
            setStatus("ready");
          }
        } catch (err) {
          console.error("Failed to render Turnstile widget:", err);
          if (isMounted) {
            setStatus("error");
            setErrorMessage("Could not initialize security verification widget.");
          }
        }
      };

      // Ensure Cloudflare Turnstile script is loaded
      if (typeof window !== "undefined") {
        if (window.turnstile) {
          renderWidget();
        } else {
          const SCRIPT_ID = "cf-turnstile-script";
          let script = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

          if (!script) {
            script = document.createElement("script");
            script.id = SCRIPT_ID;
            script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
            script.async = true;
            script.defer = true;
            document.head.appendChild(script);
          }

          const checkInterval = setInterval(() => {
            if (window.turnstile) {
              clearInterval(checkInterval);
              if (isMounted) {
                renderWidget();
              }
            }
          }, 100);

          const timeoutId = setTimeout(() => {
            clearInterval(checkInterval);
            if (isMounted && !window.turnstile) {
              setStatus("error");
              setErrorMessage("Turnstile script timed out. Check network or ad blocker.");
            }
          }, 10000);

          return () => {
            isMounted = false;
            clearInterval(checkInterval);
            clearTimeout(timeoutId);
            if (widgetIdRef.current && window.turnstile) {
              try {
                window.turnstile.remove(widgetIdRef.current);
              } catch (_) {}
              widgetIdRef.current = null;
            }
          };
        }
      }

      return () => {
        isMounted = false;
        if (widgetIdRef.current && window.turnstile) {
          try {
            window.turnstile.remove(widgetIdRef.current);
          } catch (_) {}
          widgetIdRef.current = null;
        }
      };
    }, [siteKey, action, theme]);

    const handleRetry = () => {
      if (widgetIdRef.current && window.turnstile) {
        try {
          window.turnstile.reset(widgetIdRef.current);
          setStatus("ready");
          setErrorMessage(null);
        } catch (_) {
          // If reset fails, re-render
          if (containerRef.current && window.turnstile) {
            window.turnstile.remove(widgetIdRef.current);
            widgetIdRef.current = null;
            setStatus("loading");
            setTimeout(() => {
              if (containerRef.current && window.turnstile) {
                const id = window.turnstile.render(containerRef.current, {
                  sitekey: siteKey,
                  action,
                  theme,
                  size: "flexible",
                  callback: (token) => {
                    setStatus("verified");
                    onVerify(token);
                  }
                });
                widgetIdRef.current = id;
                setStatus("ready");
              }
            }, 100);
          }
        }
      }
    };

    return (
      <div
        id={id || "cloudflare-turnstile-container"}
        className={`border border-tasc-border bg-tasc-bg/60 p-4 transition-all duration-300 ${
          status === "verified"
            ? "border-emerald-500/50 bg-emerald-950/10"
            : status === "error"
            ? "border-amber-500/40 bg-amber-950/10"
            : "border-tasc-border"
        } ${className}`}
      >
        <div className="flex items-center justify-between gap-3 mb-2.5">
          <div className="flex items-center gap-2">
            {status === "verified" ? (
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : status === "error" ? (
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
            ) : (
              <Shield className="w-4 h-4 text-tasc-cyan shrink-0 animate-pulse" />
            )}
            <span className="font-[Orbitron] text-[10px] tracking-[0.2em] text-tasc-text/90">
              {title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isTestKey && (
              <span className="font-mono text-[9px] px-1.5 py-0.5 border border-tasc-border/60 text-tasc-text/50 uppercase tracking-widest">
                Demo Key
              </span>
            )}
            <span
              className={`font-[Orbitron] text-[9px] tracking-widest px-2 py-0.5 uppercase ${
                status === "verified"
                  ? "text-emerald-400 bg-emerald-500/10 border border-emerald-500/30"
                  : status === "ready"
                  ? "text-tasc-cyan bg-tasc-cyan/10 border border-tasc-cyan/20"
                  : status === "expired"
                  ? "text-amber-400 bg-amber-500/10 border border-amber-500/30"
                  : status === "error"
                  ? "text-red-400 bg-red-500/10 border border-red-500/30"
                  : "text-tasc-text/40"
              }`}
            >
              {status === "verified"
                ? "VERIFIED"
                : status === "ready"
                ? "CHALLENGE READY"
                : status === "expired"
                ? "EXPIRED"
                : status === "error"
                ? "RETRY REQUIRED"
                : "LOADING SHIELD"}
            </span>
          </div>
        </div>

        {/* Cloudflare Turnstile Target Element */}
        <div className="min-h-[65px] flex items-center justify-start overflow-hidden my-1">
          <div ref={containerRef} className="w-full" />
        </div>

        {/* Status message or error guidance */}
        {errorMessage && (
          <div className="mt-2 flex items-center justify-between text-xs text-amber-400/90 font-mono">
            <span>{errorMessage}</span>
            <button
              type="button"
              onClick={handleRetry}
              className="inline-flex items-center gap-1 text-[10px] font-[Orbitron] text-tasc-cyan hover:underline ml-2"
            >
              <RefreshCw className="w-3 h-3" /> [ RETRY ]
            </button>
          </div>
        )}

        {status === "verified" && (
          <p className="mt-1 text-[10px] font-mono text-emerald-400/80">
            [ PROTOCOL CLEARANCE GRANTED · BOT DEFENSE PASSED ]
          </p>
        )}
      </div>
    );
  }
);

TurnstileWidget.displayName = "TurnstileWidget";
export default TurnstileWidget;
