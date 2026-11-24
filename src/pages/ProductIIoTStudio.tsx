import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Cpu, 
  Layers, 
  ExternalLink, 
  Activity, 
  Radio, 
  ShieldCheck, 
  Bell, 
  Zap, 
  Lock, 
  Eye, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  Terminal,
  Download,
  HardDrive,
  Database,
  Brain,
  Boxes,
  FileSpreadsheet,
  Wrench
} from "lucide-react";
import { scrollToId } from "@/lib/scrollTo";

const PRODUCT_VIEWS = [
  {
    id: "landing",
    label: "LANDING / MODES",
    badge: "V2.4 MULTI-MODE",
    src: "/assets/aistudio/image_03f816b0.png",
    alt: "TASC IIoT Studio V2.4 Enterprise - Industrial Automation & HMI Runtime Architecture",
    caption: "TASC IIoT Studio v2.4 Enterprise · Community, Client & Engineering Execution Modes"
  },
  {
    id: "studio3d",
    label: "3D SCADA STUDIO",
    badge: "3D CAD & TELEMETRY",
    src: "/assets/aistudio/image_77b520b2.png",
    alt: "TASC IIoT Studio 3D Equipment Library & CAD SCADA Workspace",
    caption: "TASC IIoT Studio · 3D Equipment Library, CAD Importer & Real-Time SCADA Bindings"
  }
] as const;

export default function ProductIIoTStudio() {
  const [activeTab, setActiveTab] = useState<"community" | "client" | "engineering" | "thickClient">("engineering");
  const [activePreview, setActivePreview] = useState<"landing" | "studio3d">("landing");
  const [showImageZoom, setShowImageZoom] = useState(false);
  const currentPreview = PRODUCT_VIEWS.find((v) => v.id === activePreview) || PRODUCT_VIEWS[0];

  const scrollToSpecs = () => scrollToId("product-specs");
  const scrollToArchitecture = () => scrollToId("product-architecture");
  const scrollToModes = () => scrollToId("product-modes");

  const openContactForInstaller = () => {
    window.dispatchEvent(new CustomEvent("tasc:open-contact-modal", { 
      detail: { 
        headline: "Request Offline SCADA Installer for IPC",
        scope: "We would like to request the Standalone Offline Thick Client Installer of TASC IIoT Studio for our Industrial Grade PCs (IPCs), including local long-term historian, archiving, and offline GGUF AI diagnostics."
      } 
    }));
  };

  const openContactForBridge = () => {
    window.dispatchEvent(new CustomEvent("tasc:open-contact-modal", { 
      detail: { 
        headline: "Request TASC Bridge (.exe) for Web Client OT Connectivity",
        scope: "We would like to request the TASC Bridge (.exe) portable agent software to connect the Web Client (app.tascautomation.com) to our plant OT layer (PLCs and field controllers)."
      } 
    }));
  };

  return (
    <div className="relative pt-24 pb-20 overflow-hidden min-h-screen">
      {/* Background radial glow */}
      <div 
        className="pointer-events-none absolute top-12 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-tasc-cyan/10 blur-[140px] rounded-full -z-10" 
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb / Top kicker */}
        <div className="flex flex-wrap items-center gap-2 font-[Orbitron] text-[10px] tracking-[0.25em] text-tasc-text/50 uppercase mb-6">
          <span>PRODUCTS</span>
          <span>/</span>
          <span className="text-tasc-cyan">COMMERCIAL SOFTWARE</span>
          <span>/</span>
          <span className="text-tasc-text">TASC IIOT STUDIO</span>
          <span className="ml-auto inline-flex items-center gap-1.5 px-2.5 py-0.5 border border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[9px] tracking-wider font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-pulse" />
            LIVE COMMERCIAL // V2.4 ENTERPRISE &amp; THICK CLIENT
          </span>
        </div>

        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16 lg:mb-24">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 border border-tasc-cyan/40 bg-tasc-cyan/5 text-tasc-cyan font-[Orbitron] text-[10px] tracking-[0.2em] uppercase">
              <Sparkles size={12} className="animate-spin" />
              <span>COMMERCIAL SCADA · WEB HOSTED &amp; ON-PREMISE IPC</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold uppercase tracking-tight text-tasc-text leading-[1.05]">
              TASC <span className="text-tasc-cyan">IIoT Studio</span>
            </h1>

            <p className="text-xl sm:text-2xl font-[Montserrat] text-tasc-text/80 font-light leading-snug">
              Web SCADA, 3D Canvas, Native Driver Ingestion &amp; Industrial AI Decision Engine.
            </p>

            <p className="text-sm sm:text-base text-tasc-text/65 font-light leading-relaxed max-w-2xl">
              Engineered by Tenacious Automation, <strong>TASC IIoT Studio</strong> is a complete industrial telemetry and SCADA ecosystem. Featuring our <strong>&ldquo;As simple as Hammer&rdquo;</strong> design philosophy, it requires <strong>no extra middleware or 3rd-party OPC servers</strong> (such as Kepware or Takebishi), integrating all multivendor industrial drivers directly into the platform. Available as a cloud/web-hosted platform at <strong>app.tascautomation.com</strong> and as a <strong>Standalone Offline Installer (Thick Client)</strong> for Industrial PCs with long-term historian archiving, built-in offline GGUF AI models, and enterprise BYOK support.
            </p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-3 border-y border-tasc-border/60">
              <div>
                <div className="font-[Orbitron] text-xl font-bold text-tasc-cyan">100,000+</div>
                <div className="font-[Orbitron] text-[9px] text-tasc-text/50 uppercase tracking-wider">Live Tag Scale</div>
              </div>
              <div>
                <div className="font-[Orbitron] text-xl font-bold text-emerald-700 dark:text-emerald-400">Native Drivers</div>
                <div className="font-[Orbitron] text-[9px] text-tasc-text/50 uppercase tracking-wider">No Extra OPC Server</div>
              </div>
              <div>
                <div className="font-[Orbitron] text-xl font-bold text-tasc-text">Thick Client IPC</div>
                <div className="font-[Orbitron] text-[9px] text-tasc-text/50 uppercase tracking-wider">On-Premise Runtime</div>
              </div>
              <div>
                <div className="font-[Orbitron] text-xl font-bold text-tasc-cyan">Dual AI Stack</div>
                <div className="font-[Orbitron] text-[9px] text-tasc-text/50 uppercase tracking-wider">GGUF Offline + BYOK</div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href="https://app.tascautomation.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative font-[Orbitron] text-[11px] tracking-[0.2em] px-7 py-3.5 text-slate-900 bg-tasc-cyan hover:bg-tasc-cyan/80 transition-all flex items-center gap-3 font-semibold border border-tasc-cyan shadow-sm"
              >
                <span>LAUNCH WEB PLATFORM</span>
                <ExternalLink className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>

              <button
                onClick={scrollToArchitecture}
                className="group font-[Orbitron] text-[11px] tracking-[0.2em] px-6 py-3.5 text-tasc-text hover:text-tasc-cyan border border-tasc-border hover:border-tasc-cyan bg-tasc-bg transition-all flex items-center gap-2"
              >
                <span>SYSTEM ARCHITECTURE ↓</span>
              </button>

              <button
                onClick={scrollToModes}
                className="font-[Orbitron] text-[10px] tracking-[0.15em] text-tasc-text/60 hover:text-tasc-text underline underline-offset-4 transition-colors"
              >
                [ EXPLORE 4 RUNTIME MODES ]
              </button>
            </div>
          </div>

          {/* Live Preview Display / Hero Graphic */}
          <div className="lg:col-span-5 relative">
            <div className="relative border border-tasc-cyan/40 bg-tasc-surface p-2 shadow-2xl group overflow-hidden">
              {/* Corner ticks */}
              <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-tasc-cyan z-20" />
              <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-tasc-cyan z-20" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-tasc-cyan z-20" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-tasc-cyan z-20" />

              {/* HUD Header */}
              <div className="flex items-center justify-between px-3 py-1.5 border-b border-tasc-border bg-slate-100 dark:bg-slate-900/90 font-[Orbitron] text-[9px] tracking-widest text-tasc-text/75">
                <span className="flex items-center gap-2 font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-ping" />
                  APP.TASCAUTOMATION.COM
                </span>
                <span className="text-tasc-cyan font-semibold">{currentPreview.badge}</span>
              </div>

              {/* View Selector Bar */}
              <div className="flex items-center gap-1.5 px-2 py-1.5 border-b border-tasc-border bg-slate-50 dark:bg-slate-950/90 font-[Orbitron] text-[9px] tracking-wider">
                {PRODUCT_VIEWS.map((view) => (
                  <button
                    key={view.id}
                    type="button"
                    onClick={() => setActivePreview(view.id)}
                    className={`flex-1 py-1.5 px-2 border transition-colors font-semibold whitespace-nowrap ${
                      activePreview === view.id
                        ? "bg-tasc-cyan text-white dark:text-slate-950 border-tasc-cyan"
                        : "bg-tasc-surface text-tasc-text/70 border-tasc-border/70 hover:border-tasc-cyan hover:text-tasc-cyan"
                    }`}
                  >
                    {view.label}
                  </button>
                ))}
              </div>

              {/* Screenshot preview */}
              <div 
                className="relative cursor-pointer overflow-hidden aspect-[16/10] bg-slate-950 flex items-center justify-center"
                onClick={() => setShowImageZoom(true)}
                title="Click to enlarge product view"
              >
                <img
                  src={currentPreview.src}
                  alt={currentPreview.alt}
                  className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                  loading="eager"
                  referrerPolicy="no-referrer"
                />
                
                {/* Overlay hover prompt */}
                <div className="absolute inset-0 bg-slate-950/55 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="inline-flex items-center gap-2 px-4 py-2 bg-slate-950/90 border border-tasc-cyan text-white font-[Orbitron] text-xs tracking-wider shadow-lg">
                    <Eye size={16} className="text-tasc-cyan" />
                    <span>CLICK TO ENLARGE VIEW</span>
                  </span>
                </div>
              </div>

              {/* HUD Footer */}
              <div className="p-3 bg-slate-100 dark:bg-slate-900/90 border-t border-tasc-border flex items-center justify-between font-[Orbitron] text-[9px] text-tasc-text/80">
                <span className="font-semibold">WEB · OPERATOR KIOSK · THICK CLIENT IPC</span>
                <a 
                  href="https://app.tascautomation.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-tasc-cyan hover:underline flex items-center gap-1 font-semibold"
                >
                  OPEN LIVE APP <ExternalLink size={10} />
                </a>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-tasc-text/60 font-[Orbitron] tracking-wider">
              <span>● MULTI-ENVIRONMENT READY</span>
              <span>AIR-GAPPED IPC OR CLOUD WEB</span>
            </div>
          </div>
        </div>

        {/* Modal for Image Zoom */}
        <AnimatePresence>
          {showImageZoom && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowImageZoom(false)}
              className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-md p-4 sm:p-8 flex flex-col items-center justify-center"
            >
              <div
                className="relative max-w-6xl w-full border border-tasc-cyan/50 bg-tasc-surface p-2 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between px-2 pb-2 gap-2">
                  <div className="flex items-center gap-2">
                    {PRODUCT_VIEWS.map((view) => (
                      <button
                        key={view.id}
                        type="button"
                        onClick={() => setActivePreview(view.id)}
                        className={`font-[Orbitron] text-[10px] tracking-wider px-3 py-1.5 border transition-colors font-semibold ${
                          activePreview === view.id
                            ? "bg-tasc-cyan text-white dark:text-slate-950 border-tasc-cyan"
                            : "border-tasc-border text-tasc-text/75 hover:border-tasc-cyan hover:text-tasc-cyan"
                        }`}
                      >
                        {view.label}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setShowImageZoom(false)}
                    className="font-[Orbitron] text-xs tracking-widest text-tasc-text hover:text-tasc-cyan font-semibold px-2 py-1"
                  >
                    [ CLOSE X ]
                  </button>
                </div>
                <img
                  src={currentPreview.src}
                  alt={currentPreview.alt}
                  className="w-full h-auto max-h-[78vh] object-contain bg-slate-950"
                  referrerPolicy="no-referrer"
                />
                <div className="p-3 bg-slate-100 dark:bg-slate-900 text-center font-[Orbitron] text-xs text-tasc-cyan tracking-wider font-semibold">
                  {currentPreview.caption} · https://app.tascautomation.com
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* "As simple as Hammer" Philosophy Banner */}
        <div className="my-16 border border-tasc-cyan/30 bg-gradient-to-r from-tasc-cyan/10 via-tasc-bg to-tasc-cyan/10 dark:from-tasc-cyan/5 dark:via-slate-950/70 dark:to-tasc-cyan/5 p-6 sm:p-8 shadow-sm">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-3xl">
              <div className="flex items-center gap-2 font-[Orbitron] text-xs text-tasc-cyan tracking-widest uppercase">
                <Wrench size={14} />
                <span>ENGINEERING PHILOSOPHY // &ldquo;AS SIMPLE AS HAMMER&rdquo;</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-display uppercase tracking-tight text-tasc-text font-bold">
                Zero Script Fatigue · Immediate Shop-Floor Productivity
              </h3>
              <p className="text-xs sm:text-sm text-tasc-text/70 font-light leading-relaxed">
                Industrial engineers don&apos;t have time to write thousands of lines of web glue code or manage complex software runtimes. 
                TASC IIoT Studio was designed from day one to be <strong>&ldquo;As simple as Hammer&rdquo;</strong>: rugged, immediate, intuitive, and built for harsh plant realities. Drag symbols, point to PLC addresses, configure your multi-channel alerts, and run.
              </p>
            </div>
            <div className="shrink-0">
              <button
                onClick={scrollToArchitecture}
                className="font-[Orbitron] text-[10px] tracking-[0.2em] px-5 py-3 border border-tasc-cyan text-tasc-cyan bg-tasc-cyan/5 hover:bg-tasc-cyan hover:text-slate-950 transition-colors uppercase font-semibold"
              >
                SEE ARCHITECTURE ↓
              </button>
            </div>
          </div>
        </div>

        {/* Direct Native Communication vs Middleware Section */}
        <div id="product-architecture" className="my-20 lg:my-32 border-t border-tasc-border pt-16">
          <div className="max-w-3xl mb-12">
            <div className="flex items-center gap-3 font-[Orbitron] text-[10px] tracking-[0.3em] text-tasc-cyan mb-3">
              <span className="w-6 h-px bg-tasc-cyan" />
              <span>// 01 PROTOCOL ARCHITECTURE &amp; DIRECT DRIVERS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display uppercase tracking-tight text-tasc-text font-bold">
              Native Multivendor Drivers <span className="text-tasc-cyan">— No External OPC Server Needed</span>
            </h2>
            <p className="mt-4 text-tasc-text/70 text-base font-light leading-relaxed">
              Industrial facilities often rely on multivendor OPC servers (such as Kepware or Takebishi) to interface with diverse controller brands. TASC IIoT Studio eliminates the need for separate 3rd-party OPC servers or extra middleware software licenses with its <strong>comprehensive built-in native driver library</strong>, communicating directly to plant controllers over industrial Ethernet and serial fieldbuses.
            </p>
          </div>

          {/* 4-Step Pipeline */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
            <div className="border border-tasc-border bg-tasc-bg/70 p-6 flex flex-col justify-between relative group hover:border-tasc-cyan/50 transition-colors">
              <div className="font-[Orbitron] text-xs text-tasc-cyan tracking-widest mb-3">01 / DIRECT PLC INGESTION</div>
              <h3 className="font-display text-lg uppercase text-tasc-text mb-2">Native Multivendor Drivers</h3>
              <p className="text-xs text-tasc-text/60 font-light leading-relaxed mb-4">
                Native protocol drivers interface directly with Siemens (Profinet/S7), Mitsubishi (MELSEC/SLMP), Rockwell (EtherNet/IP CIP), Omron (FINS), Schneider (Modbus TCP), and IEC 61850 without requiring third-party OPC servers.
              </p>
              <div className="font-[Orbitron] text-[9px] text-tasc-text/40 tracking-wider">NO EXTRA OPC SERVER REQUIRED</div>
            </div>

            <div className="border border-tasc-cyan/40 bg-tasc-cyan/5 p-6 flex flex-col justify-between relative group">
              <div>
                <div className="font-[Orbitron] text-xs text-tasc-cyan tracking-widest mb-3">02 / PORTABLE OT AGENT</div>
                <h3 className="font-display text-lg uppercase text-tasc-cyan mb-2">TASC Bridge (.exe)</h3>
                <p className="text-xs text-tasc-text/70 font-light leading-relaxed mb-4">
                  A lightweight, portable executable that acts as the real-time link between the Web client (<code className="text-tasc-cyan font-mono text-[11px]">app.tascautomation.com</code>) and the physical OT layer (PLCs &amp; plant controllers). It empowers the browser client to interface with plant fieldbuses deterministically.
                </p>
                <div className="font-[Orbitron] text-[9px] text-tasc-cyan/80 tracking-wider">WEB TO OT LAYER LINK</div>
              </div>
              <div className="mt-4 pt-3 border-t border-tasc-cyan/20">
                <button
                  onClick={openContactForBridge}
                  className="w-full font-[Orbitron] text-[10px] tracking-widest px-3 py-2.5 border border-tasc-cyan text-tasc-cyan bg-tasc-cyan/10 hover:bg-tasc-cyan hover:text-slate-950 transition-colors uppercase font-semibold text-center"
                >
                  REQUEST TASC BRIDGE (.EXE)
                </button>
              </div>
            </div>

            <div className="border border-tasc-border bg-tasc-bg/70 p-6 flex flex-col justify-between relative group hover:border-tasc-cyan/50 transition-colors">
              <div className="font-[Orbitron] text-xs text-tasc-cyan tracking-widest mb-3">03 / TIME-SERIES &amp; AI</div>
              <h3 className="font-display text-lg uppercase text-tasc-text mb-2">Historian &amp; GGUF AI</h3>
              <p className="text-xs text-tasc-text/70 font-light leading-relaxed mb-4">
                Embedded high-frequency time-series logging, multi-year alarm archives, integrated local <strong>GGUF text AI model</strong> for offline diagnostics, plus cloud BYOK support.
              </p>
              <div className="font-[Orbitron] text-[9px] text-tasc-cyan/70 tracking-wider">OFFLINE &amp; HYBRID ANALYTICS</div>
            </div>

            <div className="border border-tasc-border bg-tasc-bg/70 p-6 flex flex-col justify-between relative group hover:border-tasc-cyan/50 transition-colors">
              <div className="font-[Orbitron] text-xs text-emerald-700 dark:text-emerald-400 tracking-widest mb-3">04 / VISUAL CANVAS</div>
              <h3 className="font-display text-lg uppercase text-tasc-text mb-2">2D / 3D Canvas</h3>
              <p className="text-xs text-tasc-text/60 font-light leading-relaxed mb-4">
                Rich industrial SVG graphics library, 3D model importer (GLTF/GLB) straight to SCADA canvas, automated AI reports, and multi-channel SMS/Email notifications.
              </p>
              <div className="font-[Orbitron] text-[9px] text-emerald-700/80 dark:text-emerald-400/70 tracking-wider">FULL SCADA ORCHESTRATION</div>
            </div>
          </div>
        </div>

        {/* 12 Feature Pillars */}
        <div className="my-20 lg:my-28 border-t border-tasc-border pt-16">
          <div className="max-w-3xl mb-12">
            <div className="flex items-center gap-3 font-[Orbitron] text-[10px] tracking-[0.3em] text-tasc-cyan mb-3">
              <span className="w-6 h-px bg-tasc-cyan" />
              <span>// 02 ADVANCED CAPABILITIES MATRIX</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display uppercase tracking-tight text-tasc-text font-bold">
              Engineered for <span className="text-tasc-cyan">Modern Industrial Enterprises</span>
            </h2>
            <p className="mt-4 text-tasc-text/70 text-base font-light">
              Explore the complete suite of visual, operational, diagnostic, and communication tools integrated into TASC IIoT Studio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Pillar 1: No Middleware / Native Drivers */}
            <div className="p-6 border border-tasc-border bg-tasc-bg/60 hover:border-tasc-cyan/40 transition-colors">
              <div className="w-10 h-10 border border-tasc-cyan/30 flex items-center justify-center text-tasc-cyan mb-5">
                <Radio size={20} />
              </div>
              <h3 className="font-[Montserrat] font-semibold text-lg text-tasc-text mb-2">No Middleware Needed</h3>
              <p className="text-xs text-tasc-text/60 leading-relaxed font-light">
                Direct native communication drivers for <strong>Profinet, IEC 61850, Mitsubishi Melsec &amp; SLMP, EtherNet/IP, Modbus TCP/IP, and OPC UA/DA</strong>. Zero dependency on Kepware or Takebishi.
              </p>
            </div>

            {/* Pillar 2: Standalone Thick Client */}
            <div className="p-6 border border-emerald-500/40 bg-emerald-500/5 hover:border-emerald-500 transition-colors">
              <div className="w-10 h-10 border border-emerald-500/30 flex items-center justify-center text-emerald-700 dark:text-emerald-400 mb-5">
                <HardDrive size={20} />
              </div>
              <h3 className="font-[Montserrat] font-semibold text-lg text-emerald-700 dark:text-emerald-400 mb-2">Standalone Thick Client</h3>
              <p className="text-xs text-tasc-text/60 leading-relaxed font-light">
                Full-featured offline installer available on request for Industrial Grade PCs (IPCs). Provided as a self-contained ~2.5 GB package with bundled local dependencies for air-gapped plants.
              </p>
            </div>

            {/* Pillar 3: Long-Term Historian & Archiving */}
            <div className="p-6 border border-tasc-border bg-tasc-bg/60 hover:border-tasc-cyan/40 transition-colors">
              <div className="w-10 h-10 border border-tasc-cyan/30 flex items-center justify-center text-tasc-cyan mb-5">
                <Database size={20} />
              </div>
              <h3 className="font-[Montserrat] font-semibold text-lg text-tasc-text mb-2">Long-Term Historian</h3>
              <p className="text-xs text-tasc-text/60 leading-relaxed font-light">
                High-speed time-series logging engine with automatic archiving of trends, process telemetry, setpoints, and historical alarms for multi-year regulatory audits.
              </p>
            </div>

            {/* Pillar 4: Dual AI Stack: GGUF + BYOK */}
            <div className="p-6 border border-tasc-border bg-tasc-bg/60 hover:border-tasc-cyan/40 transition-colors">
              <div className="w-10 h-10 border border-tasc-cyan/30 flex items-center justify-center text-tasc-cyan mb-5">
                <Brain size={20} />
              </div>
              <h3 className="font-[Montserrat] font-semibold text-lg text-tasc-text mb-2">Offline GGUF + BYOK AI</h3>
              <p className="text-xs text-tasc-text/60 leading-relaxed font-light">
                A lightweight text-based <strong>GGUF model</strong> is integrated inside the offline installer for local air-gapped intelligence, alongside <strong>BYOK (Bring Your Own Key)</strong> support for cloud LLMs.
              </p>
            </div>

            {/* Pillar 5: AI Diagnostics & Decision Model */}
            <div className="p-6 border border-tasc-border bg-tasc-bg/60 hover:border-tasc-cyan/40 transition-colors">
              <div className="w-10 h-10 border border-tasc-cyan/30 flex items-center justify-center text-tasc-cyan mb-5">
                <Cpu size={20} />
              </div>
              <h3 className="font-[Montserrat] font-semibold text-lg text-tasc-text mb-2">AI Diagnostic &amp; Decision</h3>
              <p className="text-xs text-tasc-text/60 leading-relaxed font-light">
                Machine learning anomaly detection coupled with an industrial decision model that delivers immediate troubleshooting playbooks to operators when alarms trip.
              </p>
            </div>

            {/* Pillar 6: Manual & AI-Generated Reports */}
            <div className="p-6 border border-tasc-border bg-tasc-bg/60 hover:border-tasc-cyan/40 transition-colors">
              <div className="w-10 h-10 border border-tasc-cyan/30 flex items-center justify-center text-tasc-cyan mb-5">
                <FileSpreadsheet size={20} />
              </div>
              <h3 className="font-[Montserrat] font-semibold text-lg text-tasc-text mb-2">Manual &amp; AI Reports</h3>
              <p className="text-xs text-tasc-text/60 leading-relaxed font-light">
                Generate production shift summaries on demand or automatically. AI analyzes batch variance and equipment uptime, outputting polished PDF, CSV, and Excel reports.
              </p>
            </div>

            {/* Pillar 7: Huge Graphics Library */}
            <div className="p-6 border border-tasc-border bg-tasc-bg/60 hover:border-tasc-cyan/40 transition-colors">
              <div className="w-10 h-10 border border-tasc-cyan/30 flex items-center justify-center text-tasc-cyan mb-5">
                <Layers size={20} />
              </div>
              <h3 className="font-[Montserrat] font-semibold text-lg text-tasc-text mb-2">Huge Graphics Library</h3>
              <p className="text-xs text-tasc-text/60 leading-relaxed font-light">
                Extensive collection of industrial SVG symbols: centrifugal pumps, control valves, tanks, agitators, piping with animated flow, conveyors, switchgear, and live gauges.
              </p>
            </div>

            {/* Pillar 8: 3D Studio & Model Importer */}
            <div className="p-6 border border-tasc-border bg-tasc-bg/60 hover:border-tasc-cyan/40 transition-colors">
              <div className="w-10 h-10 border border-tasc-cyan/30 flex items-center justify-center text-tasc-cyan mb-5">
                <Boxes size={20} />
              </div>
              <h3 className="font-[Montserrat] font-semibold text-lg text-tasc-text mb-2">3D SCADA &amp; Importer</h3>
              <p className="text-xs text-tasc-text/60 leading-relaxed font-light">
                Full 3D spatial scene development with an integrated 3D model importer (GLTF/GLB/OBJ) directly onto the SCADA canvas. Bind live PLC telemetry to 3D meshes.
              </p>
            </div>

            {/* Pillar 9: 1 Lac Tag Scalability */}
            <div className="p-6 border border-tasc-border bg-tasc-bg/60 hover:border-tasc-cyan/40 transition-colors">
              <div className="w-10 h-10 border border-tasc-cyan/30 flex items-center justify-center text-tasc-cyan mb-5">
                <Activity size={20} />
              </div>
              <h3 className="font-[Montserrat] font-semibold text-lg text-tasc-text mb-2">1 Lac (100K) Tags</h3>
              <p className="text-xs text-tasc-text/60 leading-relaxed font-light">
                Engineered for massive continuous plants, monitoring up to 1,00,000 active tags concurrently with sub-second update cycles and minimal memory footprint.
              </p>
            </div>

            {/* Pillar 10: Multi-Zone Alarms & SMS/Email */}
            <div className="p-6 border border-tasc-border bg-tasc-bg/60 hover:border-tasc-cyan/40 transition-colors">
              <div className="w-10 h-10 border border-tasc-cyan/30 flex items-center justify-center text-tasc-cyan mb-5">
                <Bell size={20} />
              </div>
              <h3 className="font-[Montserrat] font-semibold text-lg text-tasc-text mb-2">SMS &amp; Email Alarms</h3>
              <p className="text-xs text-tasc-text/60 leading-relaxed font-light">
                Real-time LOW, MID, HIGH threshold alarms with operator acknowledgment logs and automated SMS &amp; Email alert dispatching directly to plant supervisors.
              </p>
            </div>

            {/* Pillar 11: Headless Broker & Topic Editor */}
            <div className="p-6 border border-tasc-border bg-tasc-bg/60 hover:border-tasc-cyan/40 transition-colors">
              <div className="w-10 h-10 border border-tasc-cyan/30 flex items-center justify-center text-tasc-cyan mb-5">
                <Terminal size={20} />
              </div>
              <h3 className="font-[Montserrat] font-semibold text-lg text-tasc-text mb-2">Built-in Topic Editor</h3>
              <p className="text-xs text-tasc-text/60 leading-relaxed font-light">
                Comprehensive tag management and hierarchical topic editor. Easily configure custom telemetry structures, payload paths, and telemetry testing tools.
              </p>
            </div>

            {/* Pillar 12: Defense-in-Depth Cybersecurity */}
            <div className="p-6 border border-tasc-border bg-tasc-bg/60 hover:border-tasc-cyan/40 transition-colors">
              <div className="w-10 h-10 border border-tasc-cyan/30 flex items-center justify-center text-tasc-cyan mb-5">
                <ShieldCheck size={20} />
              </div>
              <h3 className="font-[Montserrat] font-semibold text-lg text-tasc-text mb-2">VPN, Audit &amp; Master PIN</h3>
              <p className="text-xs text-tasc-text/60 leading-relaxed font-light">
                Enterprise security controls: Built-in VPN connection hooks, timestamped operator audit trails, SHA-256 HMAC integrity, and Master PIN-protected engineering access.
              </p>
            </div>
          </div>
        </div>

        {/* Four Execution Modes (Interactive Tab Section) */}
        <div id="product-modes" className="my-20 lg:my-28 border border-tasc-border bg-tasc-bg p-8 sm:p-12 relative overflow-hidden">
          <div className="max-w-3xl mb-8">
            <div className="font-[Orbitron] text-[10px] tracking-[0.3em] text-tasc-cyan mb-2">// 03 SOFTWARE EXECUTION MODES</div>
            <h2 className="text-2xl sm:text-3xl font-display uppercase tracking-tight text-tasc-text font-bold">
              Choose Your Deployment Architecture
            </h2>
            <p className="text-sm text-tasc-text/65 font-light mt-2">
              From free exploratory web access to a heavy-duty standalone offline installer for air-gapped industrial PCs.
            </p>
          </div>

          {/* Mode Selector Tabs */}
          <div className="flex flex-wrap gap-2 mb-8 border-b border-tasc-border pb-4">
            <button
              onClick={() => setActiveTab("thickClient")}
              className={`font-[Orbitron] text-xs tracking-wider px-5 py-2.5 transition-all border ${
                activeTab === "thickClient"
                  ? "bg-emerald-500/10 border-emerald-500 text-emerald-700 dark:text-emerald-400 font-bold"
                  : "border-transparent text-tasc-text/60 hover:text-emerald-700 dark:hover:text-emerald-400"
              }`}
            >
              [ THICK CLIENT (IPC) ]
            </button>
            <button
              onClick={() => setActiveTab("engineering")}
              className={`font-[Orbitron] text-xs tracking-wider px-5 py-2.5 transition-all border ${
                activeTab === "engineering"
                  ? "bg-tasc-cyan/10 border-tasc-cyan text-tasc-cyan font-bold"
                  : "border-transparent text-tasc-text/60 hover:text-tasc-text"
              }`}
            >
              [ ENGINEERING STUDIO ]
            </button>
            <button
              onClick={() => setActiveTab("client")}
              className={`font-[Orbitron] text-xs tracking-wider px-5 py-2.5 transition-all border ${
                activeTab === "client"
                  ? "bg-blue-500/10 border-blue-500 text-blue-700 dark:text-blue-400 font-bold"
                  : "border-transparent text-tasc-text/60 hover:text-tasc-text"
              }`}
            >
              [ CLIENT RUNTIME ]
            </button>
            <button
              onClick={() => setActiveTab("community")}
              className={`font-[Orbitron] text-xs tracking-wider px-5 py-2.5 transition-all border ${
                activeTab === "community"
                  ? "bg-purple-500/10 border-purple-500 text-purple-700 dark:text-purple-400 font-bold"
                  : "border-transparent text-tasc-text/60 hover:text-tasc-text"
              }`}
            >
              [ COMMUNITY EDITION ]
            </button>
          </div>

          {/* Tab Content Display */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            <div className="md:col-span-7 space-y-4">
              {activeTab === "thickClient" && (
                <>
                  <div className="inline-block px-3 py-1 bg-emerald-500/10 border border-emerald-500/40 text-emerald-700 dark:text-emerald-400 font-[Orbitron] text-[10px] tracking-wider uppercase font-semibold">
                    ON-REQUEST STANDALONE INSTALLER
                  </div>
                  <h3 className="text-2xl font-display uppercase text-tasc-text font-bold">
                    Thick Client for Industrial Grade PCs (IPCs)
                  </h3>
                  <p className="text-sm text-tasc-text/70 leading-relaxed font-light">
                    Engineered for mission-critical plants, high-security control rooms, and air-gapped environments. Installs as a standalone heavy desktop SCADA runtime on Windows/Linux industrial computers with complete local persistence.
                  </p>
                  <ul className="space-y-2 pt-2 text-sm text-tasc-text/80">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span><strong>Long-Term Historian &amp; Deep Archiving</strong>: High-frequency trend logging and multi-year alarm databases stored locally</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span><strong>Integrated Offline GGUF AI Model</strong>: Runs lightweight on-premise LLMs on CPU/GPU without cloud access</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span><strong>BYOK Model</strong>: Bring Your Own Key support for connecting cloud AI (OpenAI, Anthropic, Gemini) if desired</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span><strong>Manual &amp; Automated Reports</strong>: AI-powered shift summaries, OEE logs, and custom PDF/Excel exports</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                      <span><strong>Native Direct PLC Drivers</strong>: Direct connection to Siemens, Mitsubishi, Rockwell, Schneider, and Omron</span>
                    </li>
                  </ul>
                  <div className="pt-4">
                    <button
                      onClick={openContactForInstaller}
                      className="inline-flex items-center gap-2 font-[Orbitron] text-xs tracking-wider px-6 py-3.5 bg-emerald-600 dark:bg-emerald-500 text-white dark:text-slate-950 font-bold hover:bg-emerald-500 dark:hover:bg-emerald-400 transition-colors shadow-lg shadow-emerald-500/20"
                    >
                      <Download size={14} />
                      <span>REQUEST OFFLINE INSTALLER</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </>
              )}

              {activeTab === "engineering" && (
                <>
                  <div className="inline-block px-3 py-1 bg-amber-500/10 border border-amber-500/40 text-amber-700 dark:text-amber-400 font-[Orbitron] text-[10px] tracking-wider uppercase font-semibold">
                    FULL ENGINEERING SUITE
                  </div>
                  <h3 className="text-2xl font-display uppercase text-tasc-text font-bold">
                    Engineering Studio
                  </h3>
                  <p className="text-sm text-tasc-text/70 leading-relaxed font-light">
                    The complete design station for industrial automation engineers and enterprise system integrators. Design complex multi-screen plants, configure tag mappings, import 3D models to SCADA canvas, program widget scripts, and build deployment packages.
                  </p>
                  <ul className="space-y-2 pt-2 text-sm text-tasc-text/80">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-amber-600 dark:text-amber-400 shrink-0" />
                      <span>Unlimited screens, unlimited widgets, and multi-dashboard layouts</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-amber-600 dark:text-amber-400 shrink-0" />
                      <span>Huge Graphics Library + 3D Model Importer (GLTF/GLB) directly to SCADA Canvas</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-amber-600 dark:text-amber-400 shrink-0" />
                      <span>AI Diagnostic &amp; Decision Model with automated root cause analysis</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-amber-600 dark:text-amber-400 shrink-0" />
                      <span>Export signed, tamper-proof packages with custom cryptographic keys</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-amber-600 dark:text-amber-400 shrink-0" />
                      <span>Master PIN authentication &amp; role auditing</span>
                    </li>
                  </ul>
                  <div className="pt-4">
                    <a
                      href="https://app.tascautomation.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 font-[Orbitron] text-xs tracking-wider px-6 py-3 bg-gradient-to-r from-amber-500 to-amber-400 text-slate-950 font-bold hover:brightness-110 transition-all shadow-lg shadow-amber-500/20"
                    >
                      <Lock size={14} />
                      <span>ADMIN &amp; ENGINEERING LOGIN</span>
                      <ExternalLink size={14} />
                    </a>
                  </div>
                </>
              )}

              {activeTab === "client" && (
                <>
                  <div className="inline-block px-3 py-1 bg-blue-500/10 border border-blue-500/40 text-blue-700 dark:text-blue-400 font-[Orbitron] text-[10px] tracking-wider uppercase font-semibold">
                    OPERATOR RUNTIME MODE
                  </div>
                  <h3 className="text-2xl font-display uppercase text-tasc-text font-bold">
                    Client Edition (Kiosk / Terminal)
                  </h3>
                  <p className="text-sm text-tasc-text/70 leading-relaxed font-light">
                    Hardened operator interface deployed onto shop-floor touchscreens, industrial panel PCs, and field operator stations. Loads pre-compiled `.tasc` and `.json` HMI packages with tamper-proof security.
                  </p>
                  <ul className="space-y-2 pt-2 text-sm text-tasc-text/80">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-blue-600 dark:text-blue-400 shrink-0" />
                      <span>Auto-loads pre-configured brokers, dashboards, and tag bindings</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-blue-600 dark:text-blue-400 shrink-0" />
                      <span>Operate machine setpoints, sliders, switches &amp; trend charts securely</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-blue-600 dark:text-blue-400 shrink-0" />
                      <span>Locked Operator Mode: Endpoints, topic trees, and schemas are write-protected</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-blue-600 dark:text-blue-400 shrink-0" />
                      <span>SHA-256 HMAC package integrity verification prevents unauthorized alteration</span>
                    </li>
                  </ul>
                  <div className="pt-4">
                    <a
                      href="https://app.tascautomation.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 font-[Orbitron] text-xs tracking-wider px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white dark:text-slate-950 font-bold hover:bg-blue-500 dark:hover:bg-blue-400 transition-colors"
                    >
                      <span>LOAD CLIENT EDITION (.TASC / .JSON)</span>
                      <ArrowRight size={14} />
                    </a>
                  </div>
                </>
              )}

              {activeTab === "community" && (
                <>
                  <div className="inline-block px-3 py-1 bg-purple-500/10 border border-purple-500/40 text-purple-700 dark:text-purple-400 font-[Orbitron] text-[10px] tracking-wider uppercase font-semibold">
                    FREE · SELF-SERVE
                  </div>
                  <h3 className="text-2xl font-display uppercase text-tasc-text font-bold">
                    Community Edition
                  </h3>
                  <p className="text-sm text-tasc-text/70 leading-relaxed font-light">
                    Designed for students, automation apprentices, and system integrators testing proof-of-concept SCADA telemetry dashboards. Immediate, barrier-free access directly inside modern web browsers.
                  </p>
                  <ul className="space-y-2 pt-2 text-sm text-tasc-text/80">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-purple-600 dark:text-purple-400 shrink-0" />
                      <span>Connect to custom local or remote data endpoints</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-purple-600 dark:text-purple-400 shrink-0" />
                      <span>Unlocked 2D Web HMI Canvas &amp; 3D SCADA Studio</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-purple-600 dark:text-purple-400 shrink-0" />
                      <span>Configure real-time gauges, trend charts &amp; SVG indicators</span>
                    </li>
                    <li className="flex items-center gap-2 text-tasc-text/60 text-xs font-[Orbitron]">
                      <span>Limit: 1 Single Dashboard Screen · Up to 10 Panel Widgets</span>
                    </li>
                  </ul>
                  <div className="pt-4">
                    <a
                      href="https://app.tascautomation.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 font-[Orbitron] text-xs tracking-wider px-6 py-3 bg-purple-600 dark:bg-purple-500 text-white dark:text-slate-950 font-bold hover:bg-purple-500 dark:hover:bg-purple-400 transition-colors"
                    >
                      <span>START COMMUNITY EDITION</span>
                      <ArrowRight size={14} />
                    </a>
                  </div>
                </>
              )}
            </div>

            {/* Mode Preview Visual Card */}
            <div className="md:col-span-5 border border-tasc-border bg-tasc-bg/95 dark:bg-slate-950/80 p-6 font-[Orbitron] text-xs space-y-4 shadow-sm">
              <div className="flex items-center justify-between text-tasc-cyan pb-2 border-b border-tasc-border/60">
                <span>SYSTEM MODE STATUS</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">[ ONLINE ]</span>
              </div>
              <div className="space-y-2.5 text-tasc-text/75">
                <div className="flex justify-between">
                  <span className="text-tasc-text/60">ACTIVE RUNTIME:</span>
                  <span className="text-tasc-text font-bold uppercase">{activeTab === "thickClient" ? "THICK CLIENT IPC" : `${activeTab} EDITION`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-tasc-text/60">OPC DRIVERS:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">BUILT-IN (ZERO KEPWARE)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-tasc-text/60">OT LAYER LINK:</span>
                  <span className="text-tasc-cyan font-bold">{activeTab === "thickClient" ? "DIRECT EMBEDDED" : "TASC BRIDGE (.EXE)"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-tasc-text/60">TAG CAPABILITY:</span>
                  <span className="text-tasc-text font-semibold">UP TO 1,00,000 TAGS</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-tasc-text/60">HISTORIAN / ARCHIVE:</span>
                  <span className="text-tasc-cyan font-semibold">{activeTab === "thickClient" ? "LOCAL EMBEDDED" : "CLOUD / LOCAL"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-tasc-text/60">AI DIAGNOSTICS:</span>
                  <span className="text-tasc-text font-semibold">OFFLINE GGUF + BYOK</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-tasc-text/60">SMS/EMAIL DISPATCH:</span>
                  <span className="text-tasc-text font-semibold">INTEGRATED</span>
                </div>
              </div>
              <div className="p-3 bg-tasc-cyan/5 border border-tasc-cyan/20 text-[10px] text-tasc-text/80 leading-relaxed font-mono">
                Web Host: https://app.tascautomation.com<br />
                OT Connectivity: TASC Bridge portable agent<br />
                Standalone IPC: Thick Client on Request<br />
                Philosophy: As simple as Hammer
              </div>
            </div>
          </div>
        </div>

        {/* Technical Specifications Table */}
        <div id="product-specs" className="my-20 lg:my-28 border-t border-tasc-border pt-16">
          <div className="max-w-3xl mb-12">
            <div className="flex items-center gap-3 font-[Orbitron] text-[10px] tracking-[0.3em] text-tasc-cyan mb-3">
              <span className="w-6 h-px bg-tasc-cyan" />
              <span>// 04 TECHNICAL SPECIFICATIONS</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display uppercase tracking-tight text-tasc-text font-bold">
              Product Specifications &amp; Compatibility
            </h2>
            <p className="mt-4 text-tasc-text/70 text-base font-light">
              Full technical breakdown of the TASC IIoT Studio platform architecture.
            </p>
          </div>

          <div className="border border-tasc-border bg-tasc-bg/50 overflow-x-auto">
            <table className="w-full text-left font-[Montserrat] text-sm">
              <thead className="bg-tasc-bg border-b border-tasc-border font-[Orbitron] text-[10px] tracking-wider text-tasc-cyan uppercase">
                <tr>
                  <th className="p-4">SPECIFICATION DOMAIN</th>
                  <th className="p-4">SUPPORTED STANDARDS &amp; IMPLEMENTATION</th>
                  <th className="p-4">REMARKS / PERFORMANCE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-tasc-border/60 text-tasc-text/80 text-xs sm:text-sm">
                <tr>
                  <td className="p-4 font-semibold text-tasc-text font-[Orbitron]">Multivendor OPC Drivers</td>
                  <td className="p-4 text-emerald-700 dark:text-emerald-400 font-semibold">100% Native Built-in Drivers (No Kepware or Takebishi Needed)</td>
                  <td className="p-4 text-tasc-text/60">Eliminates 3rd-party OPC server licenses; Web Client connects to OT via TASC Bridge (.exe)</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-tasc-text font-[Orbitron]">Thick Client Installer</td>
                  <td className="p-4 text-tasc-cyan">Standalone Offline Installer on Request (~2.5 GB package)</td>
                  <td className="p-4 text-tasc-text/60">Built for Industrial Grade PCs (IPCs), offline air-gapped control rooms &amp; high security</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-tasc-text font-[Orbitron]">Historian &amp; Archiving</td>
                  <td className="p-4">High-speed time-series engine with long-term trend &amp; alarm archiving</td>
                  <td className="p-4 text-tasc-text/60">Multi-year circular or disk archive logging with fast retrieval &amp; zero cloud dependency</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-tasc-text font-[Orbitron]">Industrial AI Stack</td>
                  <td className="p-4">Integrated Offline GGUF Text Model + BYOK (Bring Your Own Key) Support</td>
                  <td className="p-4 text-tasc-text/60">Air-gapped local AI diagnostics on IPC CPU/GPU; optional cloud LLM bridge (OpenAI/Gemini/Anthropic)</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-tasc-text font-[Orbitron]">AI Diagnostics &amp; Decision</td>
                  <td className="p-4">Automated pattern anomaly detection &amp; structured industrial decision model</td>
                  <td className="p-4 text-tasc-text/60">Generates instant corrective action playbooks for operators when process limits are exceeded</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-tasc-text font-[Orbitron]">Reporting Engine</td>
                  <td className="p-4">Manual on-demand &amp; Automated AI-Generated Shift Reports</td>
                  <td className="p-4 text-tasc-text/60">Automated shift summaries, downtime breakdowns, batch logs; export to PDF, CSV &amp; Excel</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-tasc-text font-[Orbitron]">Graphics Library &amp; 3D</td>
                  <td className="p-4">Huge Industrial SVG Library + 3D SCADA Studio with integrated 3D Model Importer</td>
                  <td className="p-4 text-tasc-text/60">Pumps, valves, pipes with flow animation; import GLTF/GLB/OBJ models directly onto canvas</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-tasc-text font-[Orbitron]">Tag Capacity</td>
                  <td className="p-4 text-tasc-cyan">1,00,000 (100K) Tags Concurrent</td>
                  <td className="p-4 text-tasc-text/60">Optimized ring-buffers, delta compression &amp; high-frequency multi-channel streaming</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-tasc-text font-[Orbitron]">Fieldbus &amp; PLC Drivers</td>
                  <td className="p-4">Profinet, IEC 61850, Melsec, SLMP, EtherNet/IP, Modbus TCP/IP, OPC UA, OPC DA</td>
                  <td className="p-4 text-tasc-text/60">Tested with Siemens S7, Mitsubishi, Rockwell, Omron, Schneider, ABB, and RTUs</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-tasc-text font-[Orbitron]">OT Bridge Architecture</td>
                  <td className="p-4">TASC Bridge Agent (TCP-to-WebSocket bi-directional tunnel)</td>
                  <td className="p-4 text-tasc-text/60">No inbound open ports required on plant firewall; runs on edge gateway/PC</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-tasc-text font-[Orbitron]">Alarm System</td>
                  <td className="p-4">LOW, MID, HIGH multi-zone threshold monitoring with SMS &amp; Email alerts</td>
                  <td className="p-4 text-tasc-text/60">Operator acknowledgment workflows, audible alerts, and permanent historical logs</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-tasc-text font-[Orbitron]">Cybersecurity &amp; Audit</td>
                  <td className="p-4">SHA-256 HMAC integrity, Built-in VPN, Master PIN authentication, Audit Trail</td>
                  <td className="p-4 text-tasc-text/60">Tamper-proof package signing, timestamped operator event logs</td>
                </tr>
                <tr>
                  <td className="p-4 font-semibold text-tasc-text font-[Orbitron]">Deployment Models</td>
                  <td className="p-4">Cloud Hosted (app.tascautomation.com) or Thick Client on Industrial PCs</td>
                  <td className="p-4 text-tasc-text/60">Runs on modern web browsers or standalone on Windows &amp; Linux IPCs</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Enterprise Bottom Banner & CTA */}
        <div className="mt-20 border border-tasc-cyan/40 bg-gradient-to-r from-tasc-cyan/10 via-tasc-bg to-tasc-cyan/5 dark:via-slate-900/60 dark:to-tasc-bg p-8 sm:p-12 relative overflow-hidden shadow-sm">
          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 font-[Orbitron] text-xs text-tasc-cyan tracking-widest uppercase">
              <Zap size={14} />
              <span>DEPLOY TASC IIOT STUDIO FOR YOUR FACILITY</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display uppercase tracking-tight text-tasc-text font-bold">
              Ready to modernise your plant telemetry?
            </h2>
            <p className="text-sm sm:text-base text-tasc-text/75 font-light leading-relaxed">
              Experience the web platform live right now at <strong>app.tascautomation.com</strong>, or request the <strong>Standalone Thick Client Installer</strong> for your on-premise Industrial Grade PCs with local historian, offline GGUF AI, and direct driver communications.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <a
                href="https://app.tascautomation.com"
                target="_blank"
                rel="noopener noreferrer"
                className="font-[Orbitron] text-xs tracking-wider px-8 py-4 bg-tasc-cyan text-slate-900 font-bold hover:bg-tasc-cyan/80 transition-all flex items-center gap-3 shadow-sm"
              >
                <span>OPEN APP.TASCAUTOMATION.COM</span>
                <ExternalLink size={16} />
              </a>
              <button
                onClick={openContactForInstaller}
                className="font-[Orbitron] text-xs tracking-wider px-8 py-4 border border-emerald-600 dark:border-emerald-400 text-emerald-700 dark:text-emerald-300 bg-emerald-500/10 hover:bg-emerald-600 hover:text-white dark:hover:bg-emerald-400 dark:hover:text-slate-950 font-semibold transition-all flex items-center gap-2"
              >
                <Download size={16} />
                <span>[ REQUEST OFFLINE INSTALLER ]</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
