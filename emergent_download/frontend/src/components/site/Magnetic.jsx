import { useRef, useEffect } from "react";
import { gsap } from "gsap";

/**
 * Magnetic hover wrapper — translates its child toward the cursor on hover
 * and snaps back on leave. Inspired by high-end agency sites
 * (hashgraphvc, rbxgc).
 *
 * Uses gsap.quickTo for high-performance cursor tracking.
 */
export default function Magnetic({ children, strength = 0.35, className = "" }) {
  const wrapRef = useRef(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;

    // Disable on coarse pointers (touch)
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    if (isCoarse) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "elastic.out(1, 0.5)" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "elastic.out(1, 0.5)" });

    const onMove = (e) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      xTo((e.clientX - cx) * strength);
      yTo((e.clientY - cy) * strength);
    };
    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
    };
  }, [strength]);

  return (
    <div ref={wrapRef} className={`inline-block will-change-transform ${className}`}>
      {children}
    </div>
  );
}
