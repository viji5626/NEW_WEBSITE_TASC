import { useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { gsap } from "gsap";
import { SplitText } from "gsap/SplitText";
import { scrollToId } from "@/lib/scrollTo";
import NetworkMap from "./NetworkMap";
import Magnetic from "./Magnetic";

gsap.registerPlugin(SplitText);

export default function Hero() {
  const sectionRef = useRef(null);
  const headlineRef = useRef(null);
  const subRef = useRef(null);
  const ctaRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Cinematic moves
  const mapScale = useTransform(scrollYProgress, [0, 1], [1, 1.18]);
  const mapY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const mapOpacity = useTransform(scrollYProgress, [0, 0.7, 1], [1, 0.85, 0.3]);
  const headlineY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const subY = useTransform(scrollYProgress, [0, 1], [0, -20]);

  // GSAP SplitText entrance — char-by-char reveal on the hero headline
  useEffect(() => {
    if (!headlineRef.current) return;
    const ctx = gsap.context(() => {
      const split = new SplitText(headlineRef.current, {
        type: "chars,words,lines",
        linesClass: "split-line overflow-hidden",
      });

      gsap.set(split.chars, { yPercent: 110, opacity: 0 });
      gsap.set(subRef.current, { opacity: 0, y: 18 });
      gsap.set(ctaRef.current?.children || [], { opacity: 0, y: 12 });

      const tl = gsap.timeline({ delay: 0.15 });
      tl.to(split.chars, {
        yPercent: 0,
        opacity: 1,
        duration: 1.1,
        ease: "expo.out",
        stagger: 0.018,
      })
        .to(
          subRef.current,
          { opacity: 1, y: 0, duration: 0.9, ease: "expo.out" },
          "-=0.55",
        )
        .to(
          ctaRef.current?.children || [],
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: "expo.out" },
          "-=0.6",
        );

      return () => split.revert();
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      id="command-center"
      data-testid="section-hero"
      ref={sectionRef}
      className="relative min-h-screen pt-24 pb-20 overflow-hidden"
    >
      <div className="mx-auto max-w-[1440px] px-6 md:px-10 lg:px-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left: copy */}
          <motion.div style={{ y: headlineY }} className="lg:col-span-6">
            <h1
              ref={headlineRef}
              data-testid="hero-headline"
              className="font-[Montserrat] font-semibold text-[#E6EDF3] text-4xl sm:text-5xl lg:text-6xl xl:text-7xl leading-[1.02] tracking-tight"
            >
              Architecting the<br />
              <span className="text-[#E6EDF3]">Industrial</span>{" "}
              <span className="relative inline-block">
                Nervous System.
                <span className="absolute -bottom-2 left-0 right-0 h-px bg-[#00C2FF]" />
              </span>
            </h1>

            <motion.p
              ref={subRef}
              style={{ y: subY }}
              className="mt-8 max-w-xl text-[#E6EDF3]/70 text-base md:text-lg leading-relaxed font-light"
            >
              Tenacious Automation Solutions &amp; Consulting — transforming industrial logix.
              Engineering intelligent, high-availability PLC, SCADA, EMS and IIoT architectures
              for mission-critical industrial operations.
            </motion.p>

            <div ref={ctaRef} className="mt-10 flex flex-wrap items-center gap-4">
              <Magnetic strength={0.4}>
                <button
                  data-testid="cta-initiate-consultation"
                  onClick={() => scrollToId("terminal-interface")}
                  className="group relative font-[Orbitron] text-[11px] tracking-[0.25em] px-7 py-4 border border-[#2B313A] text-[#E6EDF3] overflow-hidden hover:border-[#00C2FF] hover:text-[#0D1117] transition-colors duration-300"
                >
                  <span className="absolute inset-0 bg-[#00C2FF] translate-x-[-101%] group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)]" />
                  <span className="relative">[ INITIATE CONSULTATION ]</span>
                </button>
              </Magnetic>
              <Magnetic strength={0.3}>
                <button
                  data-testid="cta-explore-solutions"
                  onClick={() => scrollToId("the-arsenal")}
                  className="font-[Orbitron] text-[11px] tracking-[0.25em] text-[#E6EDF3]/70 hover:text-[#00C2FF] transition-colors px-2 py-2"
                >
                  EXPLORE SOLUTIONS →
                </button>
              </Magnetic>
            </div>
          </motion.div>

          {/* Right: network map with dolly + parallax */}
          <motion.div
            style={{ scale: mapScale, y: mapY, opacity: mapOpacity }}
            className="lg:col-span-6 relative"
          >
            <div className="relative aspect-square max-w-[640px] mx-auto">
              <div className="absolute inset-0 bp-grid-fine opacity-40" />
              <NetworkMap />
            </div>
          </motion.div>
        </div>
      </div>

      {/* corner ticks */}
      <CornerTicks />
    </section>
  );
}

function CornerTicks() {
  return (
    <>
      {["top-20 left-4", "top-20 right-4", "bottom-4 left-4", "bottom-4 right-4"].map((p, i) => (
        <div
          key={i}
          className={`absolute ${p} font-[Orbitron] text-[9px] tracking-[0.3em] text-[#2B313A] z-10`}
        >
          {["[ // 01.A ]", "[ // 01.B ]", "[ // 01.C ]", "[ // 01.D ]"][i]}
        </div>
      ))}
    </>
  );
}
