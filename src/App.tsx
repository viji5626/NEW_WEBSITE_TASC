import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "@/App.css";
import { Toaster } from "sonner";
import Lenis from "lenis";

import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import { TechBackground } from "@/components/site/TechBackground";
import BootScreen from "@/components/site/BootScreen";
import Home from "@/pages/Home";
import MicroServices from "@/pages/MicroServices";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

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
    <BrowserRouter>
      <BootScreen />
      <ScrollToTop />
      <div className="App relative bg-tasc-bg min-h-screen text-tasc-text selection:bg-tasc-cyan selection:text-tasc-bg overflow-hidden" data-testid="tasc-app">
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

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/micro-services" element={<MicroServices />} />
        </Routes>

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
    </BrowserRouter>
  );
}

export default App;
