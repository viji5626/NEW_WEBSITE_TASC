import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User, Sparkles, Trash2, Download, Linkedin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => {
    try {
      const saved = localStorage.getItem("tenacious_chat_messages");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Failed to retrieve chat history:", e);
    }
    return [
      { role: "assistant", content: "Hello! I am the TASC AI Assistant. Ask me anything about our automation services, consulting, or technologies." }
    ];
  });
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      localStorage.setItem("tenacious_chat_messages", JSON.stringify(messages));
    } catch (e) {
      console.warn("Failed to persist chat history:", e);
    }
  }, [messages]);

  useEffect(() => {
    return () => {
      (window as any).lenis?.start();
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      (window as any).lenis?.stop();
    } else {
      (window as any).lenis?.start();
    }
  }, [isOpen]);

  const handleClearHistory = () => {
    setMessages([
      { role: "assistant", content: "Hello! I am the TASC AI Assistant. Ask me anything about our automation services, consulting, or technologies." }
    ]);
  };


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendUserMessage = async (historyToSend: Message[]) => {
    setIsLoading(true);

    const maxAttempts = 3;
    let attempt = 0;
    let success = false;
    let assistantMsg = "";
    let appendedAssistant = false;

    while (attempt < maxAttempts && !success) {
      attempt++;
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: historyToSend })
        });

        if (!response.ok) {
          let errBody = "";
          try { errBody = await response.text(); } catch(e) {}
          throw new Error(`Network error: ${response.status} ${errBody}`);
        }
        if (!response.body) throw new Error("No body");

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        
        if (!appendedAssistant) {
          setMessages(prev => [...prev, { role: "assistant", content: "" }]);
          appendedAssistant = true;
        } else {
          setMessages(prev => {
            const newMessages = [...prev];
            if (newMessages.length > 0 && newMessages[newMessages.length - 1].role === "assistant") {
              newMessages[newMessages.length - 1].content = "";
            }
            return newMessages;
          });
        }

        assistantMsg = "";
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          assistantMsg += decoder.decode(value, { stream: true });
          setMessages(prev => {
            const newMessages = [...prev];
            if (newMessages.length > 0 && newMessages[newMessages.length - 1].role === "assistant") {
              newMessages[newMessages.length - 1].content = assistantMsg;
            }
            return newMessages;
          });
        }

        if (!assistantMsg.trim()) {
          throw new Error("Empty response from AI system stream");
        }

        success = true;
      } catch (error) {
        console.error(`Chatbot response error (attempt ${attempt}/${maxAttempts}):`, error);
        if (attempt < maxAttempts) {
          // Wait 1 second before retrying automatically
          await new Promise(resolve => setTimeout(resolve, 1000));
        } else {
          // All automated attempts failed. Provide custom manual retry and TASC team support option.
          const fallbackErrorMsg = "Our AI system is temporarily experiencing heavy load. Please try sending your message again, or contact our team if the issue persists.\n\n[RETRY_LAST_MESSAGE]";
          if (appendedAssistant) {
            setMessages(prev => {
              const newMessages = [...prev];
              if (newMessages.length > 0 && newMessages[newMessages.length - 1].role === "assistant") {
                newMessages[newMessages.length - 1].content = fallbackErrorMsg;
              }
              return newMessages;
            });
          } else {
            setMessages(prev => [...prev, { role: "assistant", content: fallbackErrorMsg }]);
          }
        }
      }
    }
    
    setIsLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput("");
    
    const nextMessages: Message[] = [...messages, { role: "user", content: userMsg }];
    setMessages(nextMessages);

    // Client-side interceptor for founder contact/linkedin questions
    const norm = userMsg.toLowerCase().trim();
    
    const isFounderLinkedin = !norm.includes("monika") && !norm.includes("chauhan") && (
      ((norm.includes("founder") || norm.includes("vijay") || norm.includes("shankar")) && norm.includes("linkedin")) ||
      (norm.includes("linkedin") && (norm.includes("link") || norm.includes("profile") || norm.includes("page") || norm.includes("account") || norm.includes("connect")))
    );

    if (isFounderLinkedin) {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "You can view Mr. Vijay Shankar's professional profile and connect with him on LinkedIn:\n\n[FOUNDER_LINKEDIN]"
      }]);
      setIsLoading(false);
      return;
    }

    const mentionsFounder = !norm.includes("monika") && !norm.includes("chauhan") && (norm.includes("founder") || norm.includes("vijay") || norm.includes("shankar"));
    const mentionsContact = norm.includes("contact") || norm.includes("phone") || norm.includes("email") || norm.includes("mobile") || norm.includes("vcard") || norm.includes("vcf") || norm.includes("qr") || norm.includes("save") || norm.includes("add") || norm.includes("reach") || norm.includes("call") || norm.includes("card") || norm.includes("address") || norm.includes("number");
    
    const isFounderContact = (
      (mentionsFounder && mentionsContact) ||
      norm.includes("how to contact him") ||
      norm.includes("add to contact") ||
      norm.includes("save to contact") ||
      norm.includes("save contact") ||
      norm.includes("add contact") ||
      norm.includes("vcard") ||
      norm.includes("vcf") ||
      norm.includes("his contact") ||
      norm.includes("his number") ||
      norm.includes("his phone") ||
      norm.includes("his mobile") ||
      norm.includes("his email") ||
      (norm.includes("his") && norm.includes("contact")) ||
      (norm.includes("how") && norm.includes("contact") && (norm.includes("founder") || norm.includes("vijay") || norm.includes("him")))
    );

    if (isFounderContact) {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "You can download Mr. Vijay Shankar's direct contact card (vCard) or scan his QR code below to save his details directly to your mobile contacts:\n\n[FOUNDER_CONTACT]"
      }]);
      setIsLoading(false);
      return;
    }

    await sendUserMessage(nextMessages);
  };

  const handleRetryLastMessage = async () => {
    // Find the last user message
    const userMessages = messages.filter(m => m.role === "user");
    if (userMessages.length === 0) return;
    const lastUserMsg = userMessages[userMessages.length - 1].content;
    
    // Construct the history without the last assistant error message
    const cleanHistory = [...messages];
    if (cleanHistory.length > 0 && cleanHistory[cleanHistory.length - 1].role === "assistant") {
      cleanHistory.pop(); // remove the error message
    }
    
    setMessages(cleanHistory);

    const norm = lastUserMsg.toLowerCase().trim();
    
    const isFounderLinkedin = !norm.includes("monika") && !norm.includes("chauhan") && (
      ((norm.includes("founder") || norm.includes("vijay") || norm.includes("shankar")) && norm.includes("linkedin")) ||
      (norm.includes("linkedin") && (norm.includes("link") || norm.includes("profile") || norm.includes("page") || norm.includes("account") || norm.includes("connect")))
    );

    if (isFounderLinkedin) {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "You can view Mr. Vijay Shankar's professional profile and connect with him on LinkedIn:\n\n[FOUNDER_LINKEDIN]"
      }]);
      setIsLoading(false);
      return;
    }

    const mentionsFounder = !norm.includes("monika") && !norm.includes("chauhan") && (norm.includes("founder") || norm.includes("vijay") || norm.includes("shankar"));
    const mentionsContact = norm.includes("contact") || norm.includes("phone") || norm.includes("email") || norm.includes("mobile") || norm.includes("vcard") || norm.includes("vcf") || norm.includes("qr") || norm.includes("save") || norm.includes("add") || norm.includes("reach") || norm.includes("call") || norm.includes("card") || norm.includes("address") || norm.includes("number");
    
    const isFounderContact = (
      (mentionsFounder && mentionsContact) ||
      norm.includes("how to contact him") ||
      norm.includes("add to contact") ||
      norm.includes("save to contact") ||
      norm.includes("save contact") ||
      norm.includes("add contact") ||
      norm.includes("vcard") ||
      norm.includes("vcf") ||
      norm.includes("his contact") ||
      norm.includes("his number") ||
      norm.includes("his phone") ||
      norm.includes("his mobile") ||
      norm.includes("his email") ||
      (norm.includes("his") && norm.includes("contact")) ||
      (norm.includes("how") && norm.includes("contact") && (norm.includes("founder") || norm.includes("vijay") || norm.includes("him")))
    );

    if (isFounderContact) {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800));
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "You can download Mr. Vijay Shankar's direct contact card (vCard) or scan his QR code below to save his details directly to your mobile contacts:\n\n[FOUNDER_CONTACT]"
      }]);
      setIsLoading(false);
      return;
    }

    await sendUserMessage(cleanHistory);
  };

  const parseMessage = (content: string) => {
    if (content.includes("[FOUNDER_LINKEDIN]")) {
      const cleanedContent = content.replace(/\[FOUNDER_LINKEDIN\]/g, "");
      return (
        <div className="flex flex-col gap-3">
          <div className="markdown-body text-sm prose prose-invert prose-p:leading-relaxed max-w-none">
            <ReactMarkdown>{cleanedContent}</ReactMarkdown>
          </div>
          <a
            href="https://www.linkedin.com/in/vijay-shankar-TASC"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative w-full font-[Orbitron] text-[10px] tracking-[0.2em] py-2.5 border border-tasc-cyan bg-tasc-cyan/10 hover:bg-tasc-cyan text-tasc-text hover:text-slate-900 overflow-hidden transition-all duration-300 inline-flex items-center justify-center gap-2 self-start rounded font-bold"
          >
            <Linkedin size={12} className="relative shrink-0 text-tasc-cyan group-hover:text-slate-900 transition-colors" />
            <span className="relative">[ VIEW FOUNDER LINKEDIN ]</span>
          </a>
        </div>
      );
    }

    if (content.includes("[FOUNDER_CONTACT]")) {
      const cleanedContent = content.replace(/\[FOUNDER_CONTACT\]/g, "");
      return (
        <div className="flex flex-col gap-3">
          <div className="markdown-body text-sm prose prose-invert prose-p:leading-relaxed max-w-none">
            <ReactMarkdown>{cleanedContent}</ReactMarkdown>
          </div>
          <div className="flex flex-col items-center gap-3 p-4 bg-tasc-bg border border-tasc-cyan/20 relative mt-2">
            {/* TASC Industrial corner ticks */}
            <div className="absolute top-0 left-0 w-2 h-2 border-l border-t border-tasc-cyan" />
            <div className="absolute top-0 right-0 w-2 h-2 border-r border-t border-tasc-cyan" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-l border-b border-tasc-cyan" />
            <div className="absolute bottom-0 right-0 w-2 h-2 border-r border-b border-tasc-cyan" />
            
            <div className="font-[Orbitron] text-[8px] tracking-[0.25em] text-tasc-cyan font-semibold">
              MR. VIJAY SHANKAR · vCARD
            </div>
            
            <div className="relative w-24 h-24 bg-white p-1 shrink-0 border border-tasc-border">
              <img
                src="/brand/vcard-qr.svg"
                alt="vCard QR Code"
                loading="lazy"
                className="w-full h-full object-contain"
                draggable={false}
              />
            </div>
            
            <div className="text-center">
              <div className="font-[Orbitron] text-[7.5px] tracking-[0.2em] text-tasc-text/50 uppercase leading-none">
                Scan with phone camera
              </div>
              <div className="font-[Montserrat] text-[10px] text-tasc-text/40 mt-1">
                to save contact instantly
              </div>
            </div>

            <a
              href="/brand/vijay-shankar.vcf"
              download="Vijay-Shankar-TASC.vcf"
              className="group relative w-full font-[Orbitron] text-[10px] tracking-[0.2em] py-2.5 border border-tasc-border text-tasc-text overflow-hidden hover:border-tasc-cyan hover:bg-tasc-cyan hover:text-slate-900 transition-all duration-300 inline-flex items-center justify-center gap-2"
            >
              <Download size={12} strokeWidth={1.5} className="relative shrink-0" />
              <span className="relative">[ ADD TO CONTACTS ]</span>
            </a>
          </div>
        </div>
      );
    }

    if (content.includes("[RETRY_LAST_MESSAGE]")) {
      const cleanedContent = content.replace(/\[RETRY_LAST_MESSAGE\]/, "");
      return (
        <div className="flex flex-col gap-3">
          <div className="markdown-body text-sm prose prose-invert prose-p:leading-relaxed max-w-none">
            <ReactMarkdown>{cleanedContent}</ReactMarkdown>
          </div>
          <button 
            type="button"
            onClick={() => {
              handleRetryLastMessage();
            }}
            className="group relative font-[Orbitron] text-[11px] tracking-[0.25em] px-4 py-2 border border-tasc-cyan text-tasc-cyan overflow-hidden hover:bg-tasc-cyan/10 transition-all self-start whitespace-normal text-left"
          >
            [ RETRY SENDING MESSAGE ]
          </button>
        </div>
      );
    }

    // If we receive the custom token [TALK_TO_TASC: Heading | Scope]
    const match = content.match(/\[TALK_TO_TASC:\s*(.*?)(?:\s*\|\s*(.*?))?\]/);
    if (match || content.includes("[TALK_TO_TASC]")) {
      const headline = match ? match[1].trim() : "Talk to TASC Team";
      const scope = match && match[2] ? match[2].trim() : "";
      const cleanedContent = content.replace(/\[TALK_TO_TASC.*?\]/, "");
      return (
        <div className="flex flex-col gap-3">
          <div className="markdown-body text-sm prose prose-invert prose-p:leading-relaxed max-w-none">
            <ReactMarkdown>{cleanedContent}</ReactMarkdown>
          </div>
          <button 
            onClick={() => {
              window.dispatchEvent(
                new CustomEvent("tasc:open-contact-modal", {
                  detail: { headline, scope }
                })
              );
              setIsOpen(false);
            }}
            className="group relative font-[Orbitron] text-[11px] tracking-[0.25em] px-4 py-2 border border-tasc-border text-tasc-text overflow-hidden hover:border-tasc-cyan hover:bg-tasc-cyan/10 transition-all self-start whitespace-normal text-left"
          >
            [ CONTACT OUR ENGINEERING TEAM ]
          </button>
        </div>
      );
    }
    return (
      <div className="markdown-body text-sm prose prose-invert prose-p:leading-relaxed max-w-none">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    );
  };

  return (
    <>
      <div className={`fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2.5 transition-all duration-300 ${isOpen ? 'scale-0 pointer-events-none' : 'scale-100'}`}>
        {/* Inviting Badge Tooltip - Stacking vertically above the button */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="relative hidden md:flex flex-col items-center bg-black/95 backdrop-blur-md border border-tasc-cyan/40 px-2.5 py-1.5 shadow-[0_0_15px_rgba(0,194,255,0.25)] rounded pointer-events-none select-none w-max max-w-[150px] mr-1 text-center"
        >
          <div className="flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-tasc-cyan shadow-[0_0_6px_#00c2ff] animate-pulse" />
            <span className="text-[7.5px] uppercase font-[Orbitron] tracking-[0.1em] text-tasc-cyan font-bold leading-none">AI ONLINE</span>
          </div>
          <span className="text-[9.5px] font-sans text-white/95 font-medium mt-0.5 whitespace-nowrap leading-tight">Ask TASC AI</span>
          
          {/* Subtle little down arrowhead pointing to the bot icon */}
          <div className="absolute top-full right-6 -mt-[1px] w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[4px] border-t-tasc-cyan/40" />
          <div className="absolute top-full right-6 w-0 h-0 border-l-[3px] border-l-transparent border-r-[3px] border-r-transparent border-t-[3px] border-t-black/95" />
        </motion.div>

        <button
          onClick={() => setIsOpen(true)}
          className="relative group p-4 bg-tasc-bg hover:bg-black border-2 border-tasc-cyan text-tasc-[#00c2ff] shadow-[0_0_20px_rgba(0,194,255,0.4)] hover:shadow-[0_0_35px_rgba(0,194,255,0.75)] transition-all duration-300 rounded-full flex items-center justify-center cursor-pointer h-14 w-14"
          aria-label="Open TASC AI System Chat"
        >
          {/* Animated pulsing outer waves */}
          <span className="absolute inset-0 rounded-full border-2 border-tasc-cyan/60 opacity-50 group-hover:scale-125 transition-transform duration-500 animate-[ping_2s_infinite]"></span>
          <span className="absolute inset-0 rounded-full border border-tasc-cyan/30 opacity-20 group-hover:scale-150 transition-transform duration-500 animate-[ping_2s_infinite_1s]"></span>
          
          <motion.div
            animate={{
              y: [0, -3, 0],
              rotate: [0, -6, 6, 0]
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="text-tasc-cyan group-hover:scale-110 flex items-center justify-center shrink-0"
          >
            <Bot size={26} />
          </motion.div>
          <Sparkles size={11} className="absolute -top-0.5 -right-0.5 text-tasc-cyan animate-pulse bg-tasc-bg rounded-full p-0.5" />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onMouseEnter={() => { if ((window as any).lenis) (window as any).lenis.stop(); }}
            onMouseLeave={() => { if ((window as any).lenis) (window as any).lenis.start(); }}
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-[335px] max-w-[calc(100vw-32px)] sm:w-[400px] h-[460px] sm:h-[550px] max-h-[82vh] sm:max-h-[85vh] bg-tasc-bg border-2 border-tasc-cyan shadow-[0_0_25px_rgba(0,194,255,0.45)] flex flex-col font-sans"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 sm:py-3 [@media(max-height:550px)]:py-1.5 border-b border-tasc-border bg-black/40 shrink-0">
              <div className="flex items-center gap-2 sm:gap-3 justify-start flex-1 min-w-0">
                <span className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 rounded-full bg-tasc-cyan shadow-[0_0_10px_var(--tasc-glow)] animate-pulse shrink-0" />
                <span className="font-[Orbitron] text-[10px] sm:text-[11px] tracking-widest text-[#00c2ff] uppercase font-bold select-none leading-none truncate">
                  TASC AI SYSTEM
                </span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={handleClearHistory}
                  className="p-1 sm:p-2 text-tasc-text/50 hover:text-red-400 transition-colors"
                  title="Clear chat history"
                  aria-label="Clear Chat History"
                >
                  <Trash2 size={14} className="sm:w-[18px] sm:h-[18px]" />
                </button>
                <button 
                  onClick={() => setIsOpen(false)} 
                  className="p-1 sm:p-2 text-tasc-text/50 hover:text-tasc-cyan transition-colors"
                  aria-label="Close Chat"
                >
                  <X size={16} className="sm:w-[20px] sm:h-[20px]" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto overscroll-contain p-3 sm:p-4 space-y-3 sm:space-y-4 [@media(max-height:550px)]:p-2 [@media(max-height:550px)]:space-y-2 font-light" data-lenis-prevent>
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-2 sm:gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded shrink-0 flex items-center justify-center border ${msg.role === "user" ? "bg-tasc-text/5 border-tasc-text/10 text-tasc-text/70" : "bg-tasc-cyan/10 border-tasc-cyan/30 text-tasc-cyan"}`}>
                    {msg.role === "user" ? <User size={14} className="sm:w-[16px] sm:h-[16px]" /> : <Bot size={14} className="sm:w-[16px] sm:h-[16px]" />}
                  </div>
                  <div className={`p-2.5 sm:p-3 rounded max-w-[85%] sm:max-w-[80%] text-xs sm:text-sm ${msg.role === "user" ? "bg-tasc-text/5 border border-tasc-text/10" : "bg-transparent border border-tasc-cyan/10"}`}>
                    {parseMessage(msg.content)}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-2 sm:gap-3 flex-row">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded shrink-0 flex items-center justify-center border bg-tasc-cyan/10 border-tasc-cyan/30 text-tasc-cyan">
                    <Bot size={14} className="sm:w-[16px] sm:h-[16px]" />
                  </div>
                  <div className="p-2.5 sm:p-3 rounded max-w-[80%] bg-transparent border border-tasc-cyan/10 flex items-center gap-1 text-tasc-cyan">
                    <span className="w-1.5 h-1.5 rounded-full bg-tasc-cyan animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-tasc-cyan animate-bounce delay-100" />
                    <span className="w-1.5 h-1.5 rounded-full bg-tasc-cyan animate-bounce delay-200" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-2 sm:p-3 border-t border-tasc-border flex gap-2 bg-black/20 pb-safe-bottom shrink-0 [@media(max-height:550px)]:p-1.5">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask about Tenacious..."
                className="flex-1 bg-transparent border border-tasc-border px-3 py-2 sm:p-2 focus:outline-none focus:border-tasc-cyan text-sm sm:text-sm text-tasc-text placeholder:text-tasc-border/60 [@media(max-height:550px)]:py-1 [@media(max-height:550px)]:px-2 rounded-none"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="p-2 sm:p-2 border border-tasc-border text-tasc-text hover:border-tasc-cyan hover:text-tasc-cyan disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center shrink-0 [@media(max-height:550px)]:p-1.5"
              >
                <Send size={16} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
