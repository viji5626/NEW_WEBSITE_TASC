import { useState } from 'react';
import { Download, FileText, BookOpen } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import ProfileDownloadModal from '@/components/site/ProfileDownloadModal';

interface ResourceDoc {
  id: string;
  name: string;
  type: string;
  description: string;
  url: string;
  icon: typeof FileText;
}

const RESOURCES: ResourceDoc[] = [
  {
    id: "profile",
    name: "TASC Company Profile",
    type: "PORTFOLIO & CAPABILITIES",
    description: "Our complete B2B corporate profile, engineering credentials, case study matrix, and micro-services service-level agreement framework.",
    url: "https://drive.usercontent.google.com/u/0/uc?id=1HJFg-OQfWMqw0hLmOiB3vL5w_NjUhtWA&export=download",
    icon: FileText
  },
  {
    id: "whitepaper",
    name: "TASC White Paper",
    type: "METHODOLOGY & ARCHITECTURE",
    description: "Deep technical insight into ultra-quick microservices, autonomous agent pipelines, secure industrial network security, and AI era orchestration.",
    url: "https://drive.usercontent.google.com/u/0/uc?id=1-tG176z254uEIuWYOLzZGAHQxn_2QQTL&export=download",
    icon: BookOpen
  }
];

export default function DownloadProfile() {
  const [selectedDoc, setSelectedDoc] = useState<ResourceDoc | null>(null);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  const handleOpenModal = (doc: ResourceDoc) => {
    setSelectedDoc(doc);
    setIsDownloadModalOpen(true);
  };

  return (
    <section className="relative min-h-[90vh] py-32 px-6 md:px-10 lg:px-16 mx-auto max-w-[1440px] z-10 flex flex-col justify-center items-center">
      {selectedDoc && (
        <ProfileDownloadModal 
          isOpen={isDownloadModalOpen} 
          onClose={() => setIsDownloadModalOpen(false)} 
          documentName={selectedDoc.name}
          downloadUrl={selectedDoc.url}
          documentId={selectedDoc.id}
        />
      )}
      
      <ScrollReveal>
        <div className="max-w-4xl text-center flex flex-col items-center mb-16">
          <h2 className="font-[Orbitron] tracking-widest text-tasc-cyan text-sm uppercase mb-6 flex items-center gap-4 justify-center">
            <span className="w-8 h-px bg-tasc-cyan" />
            12.00 // DOCUMENTATION GATE
            <span className="w-8 h-px bg-tasc-cyan" />
          </h2>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-8">
            TASC Resource Directory
          </h1>
          
          <div className="space-y-6 text-lg text-tasc-text/70 leading-relaxed font-light max-w-3xl">
            <p>
              Access our complete engineering documentation, service briefs, and technical frameworks. 
              These documents are prepared for <strong>offline review</strong>, <strong>procurement evaluation</strong>, or <strong>internal board briefings</strong>.
            </p>
          </div>
        </div>
      </ScrollReveal>

      {/* Bento Grid layout for Documents */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl mb-16 relative z-10">
        {RESOURCES.map((doc, idx) => {
          const IconComponent = doc.icon;
          return (
            <ScrollReveal key={doc.id} delay={idx * 0.1}>
              <div 
                className="group relative border border-tasc-border bg-slate-950/40 p-8 sm:p-10 flex flex-col h-full transition-all duration-300 hover:border-tasc-cyan/40 hover:bg-slate-950/70"
              >
                {/* Subtle visual accent line */}
                <div className="absolute top-0 left-0 w-full h-[2px] bg-tasc-border group-hover:bg-tasc-cyan transition-colors" />
                
                <div className="flex items-center justify-between mb-8">
                  <span className="font-[Orbitron] text-[10px] tracking-[0.2em] text-tasc-cyan">
                    {doc.type}
                  </span>
                  <div className="p-2.5 border border-tasc-border bg-tasc-bg/50 text-tasc-cyan group-hover:border-tasc-cyan/30 transition-colors">
                    <IconComponent className="w-5 h-5" strokeWidth={1.5} />
                  </div>
                </div>

                <h3 className="text-2xl font-display font-light text-white mb-4 group-hover:text-tasc-cyan transition-colors">
                  {doc.name}
                </h3>

                <p className="text-sm text-tasc-text/60 leading-relaxed font-light mb-10 flex-grow">
                  {doc.description}
                </p>

                <button
                  onClick={() => handleOpenModal(doc)}
                  className="w-full relative font-[Orbitron] text-[10px] tracking-[0.2em] py-4 text-slate-900 bg-tasc-cyan hover:bg-tasc-cyan/85 transition-all duration-300 flex items-center justify-center gap-2 overflow-hidden border border-tasc-cyan font-bold"
                  style={{ borderRadius: '0' }}
                >
                  <span>[ ACCESS DOCUMENT ]</span>
                  <Download className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
                </button>
              </div>
            </ScrollReveal>
          );
        })}
      </div>

      {/* Secure Gateway info footer bar */}
      <ScrollReveal delay={0.2}>
        <div className="border border-tasc-cyan/25 bg-tasc-cyan/[0.03] p-6 text-sm text-tasc-text/80 leading-relaxed font-light text-left max-w-3xl">
          <div className="flex items-center gap-2.5 text-tasc-cyan font-semibold font-[Orbitron] text-[10px] tracking-widest mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-tasc-cyan animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.6)]" />
            B2B SECURE GATEWAY // GOOGLE IDENTITY SERVICE
          </div>
          <p className="mb-2">
            Our files are securely served from our enterprise Google Drive. To protect proprietary methods and verify download intent, a quick standard Google Account authorization is required.
          </p>
          <p className="text-tasc-text/50 text-xs">
            <strong>Security Guarantee:</strong> This is a secure read-only identity verification. We never store, read, or modify your personal emails, files, passwords, or contacts.
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
}
