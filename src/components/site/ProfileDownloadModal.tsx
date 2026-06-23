import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Download, Loader2, ShieldCheck, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { loginWithGoogle, auth, logout } from '@/lib/firebase';
import { User } from 'firebase/auth';

export default function ProfileDownloadModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<User | null>(null);

  // Sync auth state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
       setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Lock scroll of body and custom Lenis smooth scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';

      const lenis = (window as any).lenis;
      if (lenis) {
        lenis.stop();
      }

      return () => {
        document.body.style.overflow = originalOverflow;
        if (lenis) {
          lenis.start();
        }
      };
    }
  }, [isOpen]);

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      await loginWithGoogle();
      // user state will automatically update via onAuthStateChanged
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/unauthorized-domain') {
        setError("Domain not authorized in Firebase. Please add this domain in the Firebase Console -> Authentication -> Settings -> Authorized domains.");
      } else {
        setError("Failed to sign in. Please try again or check console for details.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    if (user) {
      try {
        const { collection, addDoc, serverTimestamp } = await import('firebase/firestore');
        const { db } = await import('@/lib/firebase');
        await addDoc(collection(db, 'profile_downloads'), {
          email: user.email,
          displayName: user.displayName || null,
          uid: user.uid,
          downloadedAt: serverTimestamp()
        });
      } catch (err: any) {
        // Fallback or silent catch for missing permissions, to avoid breaking the UI for the user.
        if (!err.message?.includes('Missing or insufficient permissions')) {
          console.warn("Issue logging download to DB:", err);
        }
        
        // Ensure tracking happens even if DB rules aren't deployed yet
        try {
          const formPayload = new FormData();
          formPayload.append("access_key", "cc7c2810-6da6-4d9b-b2cc-f3ebc28759d0");
          formPayload.append("subject", `[DOWNLOAD LOG] Company Profile - Auth: ${user.email}`);
          formPayload.append("name", user.displayName || 'Authenticated User');
          formPayload.append("email", user.email || 'no-email@example.com');
          formPayload.append("message", `UID: ${user.uid}\nGoogle Auth profile downloaded the profile document.`);
          fetch("https://api.web3forms.com/submit", { method: "POST", body: formPayload }).catch(() => {});
        } catch (weberr) {}
      }
    }
    // Direct Google Drive download link
    window.location.href = 'https://drive.usercontent.google.com/u/0/uc?id=1HJFg-OQfWMqw0hLmOiB3vL5w_NjUhtWA&export=download';
    onClose();
  };

  // Close modal when Escape key is pressed
  useEffect(() => {
      if (!isOpen) return;
      const handleEscape = (e: KeyboardEvent) => {
          if (e.key === 'Escape') onClose();
      };
      window.addEventListener('keydown', handleEscape);
      return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (typeof window === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/30 backdrop-blur-lg"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-md bg-tasc-bg border border-tasc-border p-6 sm:p-8 relative z-[99999]"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-tasc-text hover:text-tasc-cyan transition-colors"
              disabled={loading}
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <h3 className="text-2xl font-display font-light text-tasc-cyan mb-2">Company Profile</h3>
              <p className="text-sm text-tasc-text/70 font-light pr-4 mb-4">
                {user 
                  ? "Authentication successful. You can now access the comprehensive TASC Company Profile document."
                  : "Please sign in securely with Google to access the comprehensive TASC Company Profile document."
                }
              </p>

              {!user && (
                <div className="border border-tasc-cyan/20 bg-tasc-cyan/[0.03] p-4 text-xs text-tasc-text/80 leading-relaxed font-light text-left">
                  <div className="flex items-center gap-2 text-tasc-cyan font-semibold font-[Orbitron] text-[9px] tracking-wider mb-1.5">
                    <ShieldCheck className="w-4 h-4 shrink-0" /> B2B SECURE GATEWAY
                  </div>
                  <p className="mb-1">
                    To deliver this file directly from our corporate Google Drive, a standard Google OAuth check is used to authorize download permissions.
                  </p>
                  <p className="text-tasc-text/50">
                    <strong>Notice:</strong> This is a simple identity verification to ensure <strong>verified professional access</strong>. We never read or modify your private emails, contacts, or files.
                  </p>
                </div>
              )}
            </div>

            {user ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                  <ShieldCheck className="w-8 h-8 text-green-400" />
                </div>
                <h4 className="text-xl font-light text-white mb-2">Identity Verified</h4>
                <p className="text-sm text-tasc-text/60 mb-6 font-mono text-[10px] break-all">{user.email}</p>
                
                <button
                  onClick={handleDownload}
                  className="w-full py-3 px-4 bg-tasc-cyan text-slate-900 font-[Orbitron] text-xs tracking-[0.2em] hover:bg-tasc-cyan/90 transition-colors flex items-center justify-center gap-2 group"
                >
                  <FileText className="w-4 h-4" /> DOWNLOAD DOCUMENT
                </button>
                <button
                  onClick={() => logout()}
                  className="mt-4 text-xs tracking-wider text-tasc-text/50 hover:text-tasc-text underline"
                >
                   Sign Out
                </button>
              </div>
            ) : (
              <div className="space-y-4 text-center py-4">
                <div className="w-16 h-16 bg-tasc-cyan/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-tasc-cyan/30">
                  <ShieldCheck className="w-8 h-8 text-tasc-cyan" />
                </div>

                {error && <div className="text-red-400 text-sm mb-4">{error}</div>}

                <button
                  onClick={handleLogin}
                  disabled={loading}
                  className="w-full py-3 px-4 bg-white text-black font-[Orbitron] text-[11px] tracking-[0.15em] border hover:bg-slate-100 transition-colors flex items-center justify-center gap-3 font-bold"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> AUTHENTICATING...</>
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" className="w-5 h-5">
                         <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                         <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                         <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                         <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                      CONTINUE WITH GOOGLE
                    </>
                  )}
                </button>
                <p className="text-[10px] text-tasc-text/40 pt-4 uppercase tracking-widest font-mono">
                  Authentication requires Google Account
                </p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
