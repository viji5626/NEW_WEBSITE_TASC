import { useState } from 'react';
import { Download } from 'lucide-react';
import { ScrollReveal } from '@/components/ui/ScrollReveal';
import ProfileDownloadModal from '@/components/site/ProfileDownloadModal';

export default function DownloadProfile() {
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  return (
    <section className="relative min-h-[85vh] py-32 px-6 md:px-10 lg:px-16 mx-auto max-w-[1440px] z-10 flex flex-col justify-center items-center">
      <ProfileDownloadModal isOpen={isDownloadModalOpen} onClose={() => setIsDownloadModalOpen(false)} />
      
      <ScrollReveal>
        <div className="max-w-3xl text-center flex flex-col items-center">
          <h2 className="font-[Orbitron] tracking-widest text-tasc-cyan text-sm uppercase mb-6 flex items-center gap-4 justify-center">
            <span className="w-8 h-px bg-tasc-cyan" />
            12.00 // DOCUMENTATION GATE
            <span className="w-8 h-px bg-tasc-cyan" />
          </h2>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-8">
            Download Company Profile
          </h1>
          
          <div className="space-y-6 text-lg text-tasc-text/70 leading-relaxed font-light mb-8 max-w-2xl">
            <p>
              The TASC website provides a comprehensive overview of our services, capabilities, industry expertise, and solutions.
            </p>
            <p>
              For <strong>offline review</strong>, <strong>internal circulation</strong>, or <strong>procurement/vendor evaluation</strong> purposes, you may download the complete TASC Company Profile and Service Portfolio.
            </p>
          </div>

          <div className="border border-tasc-cyan/25 bg-tasc-cyan/[0.03] p-5 text-sm text-tasc-text/80 leading-relaxed font-light text-left max-w-2xl mb-10">
            <div className="flex items-center gap-2 text-tasc-cyan font-semibold font-[Orbitron] text-[10px] tracking-wider mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-tasc-cyan animate-pulse" />
              B2B SECURE GATEWAY // GOOGLE AUTH
            </div>
            <p className="mb-2">
              Our portfolio is served securely from our corporate Google Drive. To protect IP and ensure <strong>verified professional access</strong>, a quick Google identity sign-in is required to authorize the download.
            </p>
            <p className="text-tasc-text/50 text-xs">
              <strong>Security Notice:</strong> This standard identity check is read-only. We never access, store, or modify any personal emails, contacts, or private files on your account.
            </p>
          </div>

          <button
            onClick={() => setIsDownloadModalOpen(true)}
            className="group relative font-[Orbitron] text-[11px] tracking-[0.25em] px-10 py-5 text-slate-900 bg-tasc-cyan hover:bg-tasc-cyan/80 transition-all duration-300 flex items-center gap-3 overflow-hidden border border-tasc-cyan shadow-[0_0_20px_rgba(0,194,255,0.2)] hover:shadow-[0_0_30px_rgba(0,194,255,0.4)]"
            style={{ borderRadius: '0' }}
          >
            <span className="relative z-10 flex items-center gap-3 font-bold">
              [ DOWNLOAD COMPANY PROFILE ]
              <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
            </span>
          </button>
        </div>
      </ScrollReveal>
    </section>
  );
}
