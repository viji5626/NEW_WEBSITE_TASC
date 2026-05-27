import { useEffect } from "react";
import "@/App.css";
import { Toaster } from "sonner";
import Lenis from "lenis";

import Header from "@/components/site/Header";
import Hero from "@/components/site/Hero";
import Capabilities from "@/components/site/Capabilities";
import SoftwareExpertise from "@/components/site/SoftwareExpertise";
import Interoperability from "@/components/site/Interoperability";
import Industries from "@/components/site/Industries";
import Cases from "@/components/site/Cases";
import Method from "@/components/site/Method";
import Amc from "@/components/site/Amc";
import Founder from "@/components/site/Founder";
import Contact from "@/components/site/Contact";
import Footer from "@/components/site/Footer";
import { TechBackground } from "@/components/site/TechBackground";

function App() {
  useEffect(() => {
    document.title = "TASC Automation // Industrial Command Center";
    // Force scroll to top on mount/refresh
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);

    // Initialize Lenis
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <div className="App relative bg-background min-h-screen text-foreground selection:bg-tasc-cyan selection:text-tasc-bg overflow-hidden" data-testid="tasc-app">
      <TechBackground />
      {/* Noise Overlay */}
      <div 
        className="pointer-events-none fixed inset-0 z-50 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          mixBlendMode: 'screen'
        }}
      />
      {/* Fixed background blueprint grid */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 bp-grid opacity-[0.35] z-10"
      />
      {/* Cyan scanning line */}
      <div aria-hidden className="scan-line pointer-events-none z-10" />

      <Header />

      <main className="relative z-10 pt-20">
        <Hero />
        <Capabilities />
        <SoftwareExpertise />
        <Interoperability />
        <Industries />
        <Cases />
        <Method />
        <Amc />
        <Founder />
        <Contact />
      </main>

      <Footer />

      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'var(--tasc-bg)',
            color: 'var(--tasc-text)',
            border: "1px solid #2B313A",
            borderRadius: 2,
            fontFamily: "Orbitron, sans-serif",
            letterSpacing: "0.1em",
            fontSize: 12,
          },
        }}
      />
    </div>
  );
}

export default App;
