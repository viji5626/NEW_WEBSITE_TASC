import { Server, Globe, Mail, Zap, Database, Code, Bot, CheckCircle, Rocket, ShieldCheck, Cpu } from "lucide-react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 40, rotateX: -15 },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 100
    }
  }
};

const SERVICES = [
  {
    title: "Static Website & Landing Page Designing",
    description: "High-performance structural websites tailored to conversion. Elevate your brand with responsive designs.",
    logos: [
      { name: "HTML5", url: "https://cdn.simpleicons.org/html5/E34F26" },
      { name: "CSS3", url: "https://cdn.simpleicons.org/css/1572B6" },
      { name: "JavaScript", url: "https://cdn.simpleicons.org/javascript/F7DF1E" },
      { name: "Tailwind CSS", url: "https://cdn.simpleicons.org/tailwindcss/06B6D4" },
      { name: "Bootstrap", url: "https://cdn.simpleicons.org/bootstrap/7952B3" },
    ],
    icon: <Globe className="text-tasc-cyan mb-4" size={32} />
  },
  {
    title: "Domain Purchase & Digital Identity",
    description: "End-to-end domain procurement and digital identity management.",
    logos: [
      { name: "Google Domains", url: "https://cdn.simpleicons.org/google/4285F4" },
      { name: "Squarespace", url: "https://cdn.simpleicons.org/squarespace/white" },
    ],
    icon: <Server className="text-tasc-cyan mb-4" size={32} />
  },
  {
    title: "Dedicated Company Email Workspace",
    description: "Dedicated enterprise email environments featuring robust spam filtering, custom domains, and yearly maintenance packages.",
    logos: [
      { name: "Google Workspace", url: "https://cdn.simpleicons.org/google/4285F4" },
      { name: "Microsoft 365", url: "/brand/microsoft.svg" },
    ],
    icon: <Mail className="text-tasc-cyan mb-4" size={32} />
  },
  {
    title: "Full Stack App Development",
    description: "Rapid Full-Stack deployment utilizing modern TypeScript, React, and SQL architectures.",
    logos: [
      { name: "TypeScript", url: "https://cdn.simpleicons.org/typescript/3178C6" },
      { name: "React.js", url: "https://cdn.simpleicons.org/react/61DAFB" },
      { name: "JavaScript", url: "https://cdn.simpleicons.org/javascript/F7DF1E" },
      { name: "SQL Server", url: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/microsoftsqlserver/microsoftsqlserver-plain.svg" },
    ],
    icon: <Code className="text-tasc-cyan mb-4" size={32} />
  },
  {
    title: "AI Orchestration & Vibe Coding",
    description: "We leverage ultra-fast AI-driven orchestration to compile production-ready architectures from scratch.",
    logos: [
      { name: "AI Orchestration", url: "/brand/ai-orchestration.svg" },
      { name: "Vercel", url: "https://cdn.simpleicons.org/vercel/white" },
    ],
    icon: <img src="/brand/ai-orchestration.svg" alt="AI Orchestration" className="w-8 h-8 mb-4 object-contain" />
  },
  {
    title: "Agentic AI & AI Agents",
    description: "Intelligent autonomous agents powered by leading LLMs and integrated through robust orchestration pipelines.",
    logos: [
      { name: "OpenAI", url: "/brand/openai-white.svg" },
      { name: "Ollama", url: "https://cdn.simpleicons.org/ollama/white" },
      { name: "LM Studio", url: "https://cdn.simpleicons.org/lmstudio/white" },
      { name: "Hermes", url: "/brand/hermes-white.svg" },
      { name: "PostgreSQL", url: "https://cdn.simpleicons.org/postgresql/4169E1" },
      { name: "LangChain", url: "https://cdn.simpleicons.org/langchain/white" },
      { name: "n8n", url: "https://cdn.simpleicons.org/n8n/EA4B71" },
    ],
    icon: <Bot className="text-tasc-cyan mb-4" size={32} />
  },
  {
    title: "LLM (Ollama & LM Studio)",
    description: "Deployment of offline, localized large language models trained on your proprietary operational data for local tasks and databases.",
    logos: [
      { name: "Ollama", url: "https://cdn.simpleicons.org/ollama/white" },
      { name: "PostgreSQL", url: "https://cdn.simpleicons.org/postgresql/4169E1" },
      { name: "Vector DB", url: "https://cdn.simpleicons.org/databricks/FF3621" },
    ],
    icon: <Database className="text-tasc-cyan mb-4" size={32} />
  }
];

export default function MicroServices() {
  const navigate = useNavigate();
  return (
    <section className="relative min-h-[100vh] py-32 px-6 md:px-10 lg:px-16 mx-auto max-w-[1440px] z-10 flex flex-col justify-center">
      <ScrollReveal>
        <div className="mb-16 md:mb-24 mt-16 max-w-3xl">
          <h2 className="font-[Orbitron] tracking-widest text-tasc-cyan text-sm uppercase mb-6 flex items-center gap-4">
            <span className="w-8 h-px bg-tasc-cyan" />
            0X.00 // Micro Services & Rapid Deployment
          </h2>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-8">
            Our UltraQuick Micro Services – <br />
            <span className="text-tasc-text/50">Powered by AI & Vibe Coding</span>
          </h1>
          <p className="text-lg text-tasc-text/70 leading-relaxed font-light">
            Thanks to AI era and Vibe coding, we deliver production-ready digital solutions in record time.
            Through the precise application of <strong className="text-tasc-text font-normal">Vibe Coding</strong> and <strong className="text-tasc-text font-normal">Agentic AI</strong> orchestration, we deliver highly complex microservices, full-stack applications, and localized LLM architectures in fractions of traditional development timelines. 
          </p>
        </div>
      </ScrollReveal>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10% 0px" }}
        className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 lg:gap-8"
      >
        {SERVICES.map((service, idx) => (
          <motion.div 
            key={idx}
            variants={itemVariants}
            style={{ transformOrigin: "bottom center", willChange: "transform, opacity" }}
            className="p-8 border border-tasc-border bg-tasc-bg hover:border-tasc-cyan/50 transition-all duration-300 group h-full flex flex-col relative overflow-hidden"
            tabIndex={0}
            role="article"
            aria-labelledby={`service-title-${idx}`}
            aria-describedby={`service-desc-${idx}`}
          >
              {/* Subtle hover background glow */}
              <div className="absolute inset-0 bg-tasc-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
              
              <div className="relative z-10 flex flex-col h-full">
                <div aria-hidden="true" className="contents">
                  {service.icon}
                </div>
                <div className="flex items-center justify-between mb-4">
                  <h3 id={`service-title-${idx}`} className="text-xl font-medium pr-4">{service.title}</h3>
                </div>
                
                <div className="md:opacity-0 md:max-h-0 md:group-hover:opacity-100 md:group-hover:max-h-[500px] overflow-hidden transition-all duration-300 ease-in-out hidden md:flex md:flex-col md:flex-grow">
                  <p id={`service-desc-${idx}-desktop`} className="text-tasc-text/60 leading-relaxed mb-8 flex-grow text-sm">
                    {service.description}
                  </p>
  
                  <div className="flex flex-wrap items-center gap-2 pt-6 border-t border-tasc-border/50 mt-auto" aria-label={`Tech stack for ${service.title}`}>
                    <span className="text-[10px] font-[Orbitron] text-tasc-text/40 tracking-widest uppercase w-full block mb-2" aria-hidden="true">Tech Stack</span>
                    {service.logos.map(logo => (
                      <div key={logo.name} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-tasc-border/50 bg-tasc-bg/50" title={logo.name}>
                        <img 
                          src={logo.url} 
                          alt={`${logo.name} logo representation`} 
                          className={`w-3.5 h-3.5 opacity-100 md:opacity-80 group-hover:opacity-100 transition-opacity grayscale-0 md:grayscale group-hover:grayscale-0 filter ${logo.url.includes('white') ? 'invert-on-light' : ''}`}
                        />
                        <span className="text-[10px] text-tasc-text/70 whitespace-nowrap">{logo.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <details className="md:hidden group/details">
                  <summary className="font-[Orbitron] text-[10px] tracking-[0.2em] text-tasc-cyan cursor-pointer list-none flex items-center gap-2 mb-4">
                     <span className="text-tasc-border group-open/details:hidden">[ + ]</span>
                     <span className="text-tasc-cyan hidden group-open/details:inline">[ - ]</span>
                     <span>EXPAND</span>
                  </summary>
                  <div className="pt-4 border-t border-tasc-border/50 flex flex-col">
                    <p id={`service-desc-${idx}-mobile`} className="text-tasc-text/60 leading-relaxed mb-8 flex-grow text-sm">
                      {service.description}
                    </p>
    
                    <div className="flex flex-wrap items-center gap-2 pt-6 border-t border-tasc-border/50 mt-auto" aria-label={`Tech stack for ${service.title}`}>
                      <span className="text-[10px] font-[Orbitron] text-tasc-text/40 tracking-widest uppercase w-full block mb-2" aria-hidden="true">Tech Stack</span>
                      {service.logos.map(logo => (
                        <div key={logo.name} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-tasc-border/50 bg-tasc-bg/50" title={logo.name}>
                          <img 
                            src={logo.url} 
                            alt={`${logo.name} logo representation`} 
                            className={`w-3.5 h-3.5 opacity-100 md:opacity-80 group-hover:opacity-100 transition-opacity grayscale-0 md:grayscale group-hover:grayscale-0 filter ${logo.url.includes('white') ? 'invert-on-light' : ''}`}
                          />
                          <span className="text-[10px] text-tasc-text/70 whitespace-nowrap">{logo.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </details>
              </div>
          </motion.div>
        ))}
      </motion.div>
      
      {/* Footer Features matching the image bottom bar */}
      <ScrollReveal delay={0.3}>
        <div className="mt-12 flex flex-wrap justify-between gap-6 py-8 border-y border-tasc-border/50">
          <div className="flex items-center gap-3">
            <Zap className="text-green-500" size={24} />
            <span className="text-sm font-medium text-tasc-text/80">UltraQuick<br/>Delivery</span>
          </div>
          <div className="flex items-center gap-3">
            <Rocket className="text-blue-500" size={24} />
            <span className="text-sm font-medium text-tasc-text/80">AI Powered<br/>Development</span>
          </div>
          <div className="flex items-center gap-3">
            <CheckCircle className="text-blue-400" size={24} />
            <span className="text-sm font-medium text-tasc-text/80">High Quality<br/>& Scalable</span>
          </div>
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-green-600" size={24} />
            <span className="text-sm font-medium text-tasc-text/80">Secure<br/>& Reliable</span>
          </div>
          <div className="flex items-center gap-3">
            <Bot className="text-indigo-400" size={24} />
            <span className="text-sm font-medium text-tasc-text/80">Vibe Coding<br/>Driven</span>
          </div>
          <div className="flex items-center gap-3">
            <Cpu className="text-yellow-500" size={24} />
            <span className="text-sm font-medium text-tasc-text/80">Future<br/>Ready</span>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.4}>
         <div className="mt-12 p-8 border border-tasc-cyan/30 bg-tasc-cyan/5 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
             {/* Diagonal accent lines */}
             <div className="absolute -right-16 -top-16 opacity-20 transform rotate-45 pointer-events-none">
                <div className="w-64 h-[1px] bg-tasc-cyan mb-4" />
                <div className="w-64 h-[1px] bg-tasc-cyan mb-4" />
                <div className="w-64 h-[1px] bg-tasc-cyan" />
             </div>
             
             <div className="max-w-2xl relative z-10">
                 <h4 className="text-xl font-medium text-tasc-cyan mb-2">Concept to Deployment – Faster Than Ever.</h4>
                 <p className="text-tasc-text/70">Our rapid turnaround is ideal for highly urgent and highly sensitive projects. Speak to an engineer to authorize your request.</p>
             </div>
             
             <a href="#terminal-interface" onClick={(e) => {
                 e.preventDefault();
                 navigate("/#terminal-interface");
             }} className="whitespace-nowrap px-8 py-3 bg-tasc-cyan text-slate-900 font-[Orbitron] text-[10px] tracking-[0.2em] hover:bg-tasc-text hover:text-tasc-bg transition-colors relative z-10">
                 [ INITIATE SECURE LINE ]
             </a>
         </div>
      </ScrollReveal>
    </section>
  );
}
