import { useEffect, Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import "@/App.css";
import { Toaster } from "sonner";
import Lenis from "lenis";

import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import { TechBackground } from "@/components/site/TechBackground";
import BootScreen from "@/components/site/BootScreen";

const Home = lazy(() => import("@/pages/Home"));
const MicroServices = lazy(() => import("@/pages/MicroServices"));
const Consulting = lazy(() => import("@/pages/Consulting"));
const FAQ = lazy(() => import("@/pages/FAQ"));

import { scrollToId, scrollToTop } from "@/lib/scrollTo";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      setTimeout(() => {
        const id = hash.replace('#', '');
        scrollToId(id);
      }, 300);
    } else {
      // Force scroll immediately
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
      if ((window as any).lenis) {
         (window as any).lenis.scrollTo(0, { immediate: true });
      }
      
      // And again after a tiny delay for safety when React renders
      setTimeout(() => {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
        if ((window as any).lenis) {
           (window as any).lenis.scrollTo(0, { immediate: true });
        }
      }, 50);
    }
  }, [pathname, hash]);
  return null;
}

function App() {
  useEffect(() => {
    document.title = "TASC Automation // Industrial Command Center";
    // Force scroll to top on mount/refresh
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    scrollToTop(true);

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

    // Expose lenis globally for accurate smooth scrolling
    (window as any).lenis = lenis;

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
      <div className="App relative bg-tasc-bg min-h-screen text-tasc-text selection:bg-tasc-cyan selection:text-slate-900 overflow-hidden" data-testid="tasc-app">
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
        
        <Breadcrumbs />

        <Suspense fallback={
          <div className="min-h-[80vh] flex items-center justify-center relative z-20">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-2 border-tasc-border border-t-tasc-cyan rounded-full animate-spin" />
              <div className="font-[Orbitron] text-tasc-cyan/80 tracking-widest text-[10px] uppercase animate-pulse">
                Loading Module...
              </div>
            </div>
          </div>
        }>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/micro-services" element={<MicroServices />} />
            <Route path="/consulting" element={<Consulting />} />
            <Route path="/faq" element={<FAQ />} />
          </Routes>
        </Suspense>

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
