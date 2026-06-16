import { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! I am the TASC AI Assistant. Ask me anything about our automation services, consulting, or technologies." }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  

  useEffect(() => {
    return () => {
      (window as any).lenis?.start();
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      (window as any).lenis?.start();
    }
  }, [isOpen]);


  const scrollToBottom = () => {

    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = input.trim();
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMsg }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, { role: "user", content: userMsg }] })
      });

      if (!response.ok) throw new Error("Network error");
      if (!response.body) throw new Error("No body");

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMsg = "";
      
      setMessages(prev => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        assistantMsg += decoder.decode(value, { stream: true });
        // We might get chunked text
        setMessages(prev => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1].content = assistantMsg;
          return newMessages;
        });
      }
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: "assistant", content: "Sorry, I am currently unable to process your request." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const parseMessage = (content: string) => {
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
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 p-4 bg-tasc-bg border border-tasc-border text-tasc-text shadow-[0_0_20px_theme(colors.tasc.cyan/20)] hover:border-tasc-cyan hover:text-tasc-cyan transition-all duration-300 rounded-none ${isOpen ? 'scale-0' : 'scale-100'}`}
      >
        <MessageSquare size={24} />
      </button>

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
            className="fixed bottom-6 right-6 z-50 w-[350px] sm:w-[400px] h-[500px] max-h-[80vh] bg-tasc-bg border border-tasc-border shadow-2xl flex flex-col font-sans"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-tasc-border bg-black/20">
              <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full bg-tasc-cyan shadow-[0_0_8px_var(--tasc-glow)] animate-pulse" />
                <span className="font-[Orbitron] text-xs tracking-widest text-tasc-text uppercase">
                  TASC AI System
                </span>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-tasc-text/50 hover:text-tasc-cyan transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-4 font-light" data-lenis-prevent>
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                  <div className={`w-8 h-8 rounded shrink-0 flex items-center justify-center border ${msg.role === "user" ? "bg-tasc-text/5 border-tasc-text/10 text-tasc-text/70" : "bg-tasc-cyan/10 border-tasc-cyan/30 text-tasc-cyan"}`}>
                    {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
                  </div>
                  <div className={`p-3 rounded max-w-[80%] ${msg.role === "user" ? "bg-tasc-text/5 border border-tasc-text/10" : "bg-transparent border border-tasc-cyan/10"}`}>
                    {parseMessage(msg.content)}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 flex-row">
                  <div className="w-8 h-8 rounded shrink-0 flex items-center justify-center border bg-tasc-cyan/10 border-tasc-cyan/30 text-tasc-cyan">
                    <Bot size={16} />
                  </div>
                  <div className="p-3 rounded max-w-[80%] bg-transparent border border-tasc-cyan/10 flex items-center gap-1 text-tasc-cyan">
                    <span className="w-1.5 h-1.5 rounded-full bg-tasc-cyan animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-tasc-cyan animate-bounce delay-100" />
                    <span className="w-1.5 h-1.5 rounded-full bg-tasc-cyan animate-bounce delay-200" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-3 border-t border-tasc-border flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                placeholder="Ask about TASC..."
                className="flex-1 bg-transparent border border-tasc-border p-2 focus:outline-none focus:border-tasc-cyan text-sm text-tasc-text placeholder:text-tasc-border"
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="p-2 border border-tasc-border text-tasc-text hover:border-tasc-cyan hover:text-tasc-cyan disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send size={18} />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
