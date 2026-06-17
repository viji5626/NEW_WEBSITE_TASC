import { useEffect } from "react";
import "@/App.css";
import { Toaster } from "sonner";

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
import ShaderBg from "@/components/site/ShaderBg";
import useLenis from "@/lib/useLenis";

function App() {
  useLenis();

  useEffect(() => {
    document.title = "TASC Automation // Industrial Command Center";
  }, []);

  return (
    <div className="App relative" data-testid="tasc-app">
      {/* WebGL plasma backdrop */}
      <ShaderBg />

      {/* Fixed background blueprint grid */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 bp-grid opacity-[0.10] z-0"
      />
      {/* Cyan scanning line */}
      <div aria-hidden className="scan-line" />

      <Header />

      <main className="relative z-10">
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
            background: "#0D1117",
            color: "#E6EDF3",
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
