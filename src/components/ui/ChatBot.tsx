import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Bot, User, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Markdown from "react-markdown";

type Message = {
  role: "user" | "bot";
  content: string;
};

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      content: "Hello! I am the TASC AI Assistant. Ask me anything about our services, expertise, or operation.",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const submitMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(data?.error || `Server Error ${response.status} - check network tab for details`);
      }

      setMessages((prev) => [...prev, { role: "bot", content: data.reply }]);
    } catch (error: any) {
      console.error("Chat error:", error);
      let errorMessage = "I'm sorry, I'm having trouble connecting right now. Please try again later or contact info@tascautomation.com.";
      
      if (error && error.message) {
        if (error.message.includes("API key not configured")) {
           errorMessage = "API key is not configured in this environment. Please ensure the GEMINI_API_KEY is added in **Settings > Environment Variables**.";
        } else {
           errorMessage = `Connection Error: ${error.message}. Please check your deployment logs or network tab.`;
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          content: errorMessage,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    submitMessage(input);
  };

  const suggestions = [
    "What services do you offer?",
    "Tell me about your AMCs",
    "Where are you located?"
  ];

  return (
    <>
      <div className="fixed bottom-6 right-6 z-[100]">
        <button
          onClick={() => setIsOpen(true)}
          className={`w-14 h-14 bg-tasc-cyan text-black rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(45,212,191,0.3)] hover:scale-105 transition-transform ${isOpen ? "hidden" : "flex"}`}
          aria-label="Open Chatbot"
        >
          <MessageSquare size={24} />
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-[100] w-[350px] max-w-[calc(100vw-3rem)] h-[500px] max-h-[calc(100vh-6rem)] bg-tasc-bg border border-tasc-border flex flex-col shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="h-16 border-b border-tasc-border bg-tasc-bg/50 flex items-center justify-between px-4 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded bg-tasc-cyan/10 border border-tasc-cyan/30 flex items-center justify-center text-tasc-cyan">
                  <Bot size={18} />
                </div>
                <div>
                  <h3 className="font-[Montserrat] font-medium text-sm text-tasc-text">TASC AI</h3>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                    <span className="text-[10px] text-tasc-text/50 font-[Orbitron] uppercase tracking-wider">Online</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-8 h-8 flex items-center justify-center text-tasc-text/50 hover:text-tasc-text transition-colors"
                aria-label="Close Chatbot"
              >
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div 
              className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-4"
              data-lenis-prevent
            >
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`flex flex-col ${m.role === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] text-sm leading-relaxed p-3 ${
                      m.role === "user"
                        ? "bg-tasc-cyan text-tasc-bg rounded-tl-xl rounded-tr-xl rounded-bl-xl font-medium"
                        : "bg-tasc-bg border border-tasc-border rounded-tr-xl rounded-br-xl rounded-bl-xl text-tasc-text"
                    }`}
                  >
                    {m.role === "bot" ? (
                      <div className="markdown-body prose prose-sm max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0 text-tasc-text/90 prose-headings:text-tasc-text prose-a:text-tasc-cyan prose-strong:text-tasc-text">
                        <Markdown>{m.content}</Markdown>
                      </div>
                    ) : (
                      m.content
                    )}
                  </div>
                  
                  {/* Quick Suggestions */}
                  {i === 0 && m.role === "bot" && messages.length === 1 && !isLoading && (
                    <div className="mt-4 flex flex-wrap gap-2">
                       {suggestions.map((suggestion, idx) => (
                          <button
                            key={idx}
                            onClick={() => submitMessage(suggestion)}
                            className="text-xs bg-tasc-border/30 hover:bg-tasc-border/60 transition-colors border border-tasc-border text-tasc-text/90 px-3 py-1.5 rounded-full"
                          >
                            {suggestion}
                          </button>
                       ))}
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start items-start">
                  <div className="bg-tasc-bg border border-tasc-border rounded-tr-xl rounded-br-xl rounded-bl-xl p-3 flex items-center gap-1.5 h-10 px-4">
                    <span className="w-1.5 h-1.5 bg-tasc-cyan/60 rounded-full animate-bounce" style={{ animationDelay: '0ms', animationDuration: '1s' }}></span>
                    <span className="w-1.5 h-1.5 bg-tasc-cyan/60 rounded-full animate-bounce" style={{ animationDelay: '150ms', animationDuration: '1s' }}></span>
                    <span className="w-1.5 h-1.5 bg-tasc-cyan/60 rounded-full animate-bounce" style={{ animationDelay: '300ms', animationDuration: '1s' }}></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-tasc-border bg-tasc-bg/50 shrink-0">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about TASC services..."
                  className="w-full bg-tasc-bg border border-tasc-border/50 text-sm text-tasc-text px-4 py-3 pr-12 focus:outline-none focus:border-tasc-cyan/50 transition-colors placeholder:text-tasc-text/40"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || isLoading}
                  className="absolute right-2 w-8 h-8 flex items-center justify-center text-tasc-cyan hover:text-tasc-cyan/80 disabled:opacity-50 disabled:hover:text-tasc-cyan transition-colors"
                >
                  <Send size={16} />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
