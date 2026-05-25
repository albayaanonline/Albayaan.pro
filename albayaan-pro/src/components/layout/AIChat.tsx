import { useState, useRef, useEffect } from "react";
import { useSendChatMessage } from "@/lib/api-client";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";

type Message = { role: "user" | "assistant"; content: string };

export function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hi! I'm your Albayaan.pro assistant. How can I help you learn today? 🎓" }
  ]);
  const [input, setInput] = useState("");
  const chatMutation = useSendChatMessage();
  const { t } = useLanguage();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
    }
  }, [messages, isOpen]);

  const handleSend = () => {
    const text = input.trim();
    if (!text || chatMutation.isPending) return;
    const newMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");

    chatMutation.mutate(
      { data: { message: text, history: messages } },
      {
        onSuccess: (res: any) => {
          setMessages(prev => [...prev, { role: "assistant", content: res.reply }]);
        },
        onError: () => {
          setMessages(prev => [...prev, { role: "assistant", content: t("Sorry, I couldn't connect. Please try again.", "آسف، لم أتمكن من الاتصال. حاول مرة أخرى.", "Waan ka xumahay, xiriirku ma shaqayn. Isku day mar kale.") }]);
        },
      }
    );
  };

  return (
    <>
      {/* Toggle Button — simplified, no spring animation or permanent glow */}
      <button
        onClick={() => setIsOpen(v => !v)}
        className="fixed bottom-6 left-6 z-50 w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full shadow-lg text-white flex items-center justify-center hover:opacity-90 transition-opacity"
        style={{ transform: "translateZ(0)" }}
        aria-label="Open AI chat"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>

      {/* Chat Panel — solid bg instead of backdrop-blur for Android stability */}
      {isOpen && (
        <div
          className="fixed bottom-24 left-6 z-50 w-[calc(100vw-3rem)] sm:w-96 bg-background border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[70vh]"
          style={{ transform: "translateZ(0)" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-card">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-foreground text-sm">Albayaan Assistant</h3>
                <div className="flex items-center gap-1.5 text-xs text-green-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  Online
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 p-4 overflow-y-auto min-h-[250px] space-y-3" style={{ WebkitOverflowScrolling: "touch" }}>
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {m.role === "assistant" && (
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mr-2 mt-1 shrink-0">
                    <Sparkles className="w-3 h-3 text-white" />
                  </div>
                )}
                <div className={`max-w-[78%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  m.role === "user"
                    ? "bg-primary text-white rounded-br-sm"
                    : "bg-card border border-border text-foreground rounded-bl-sm"
                }`}>
                  {m.content}
                </div>
              </div>
            ))}

            {chatMutation.isPending && (
              <div className="flex justify-start">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center mr-2 mt-1 shrink-0">
                  <Sparkles className="w-3 h-3 text-white" />
                </div>
                <div className="bg-card border border-border px-4 py-3 rounded-2xl rounded-bl-sm flex gap-1.5 items-center">
                  <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-border bg-card">
            <div className="flex items-center gap-2 bg-background border border-border rounded-xl px-4 py-2 focus-within:border-primary/50 transition-colors">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
                placeholder={t("Ask me anything...", "اسألني أي شيء...", "Wax kasta weydii...")}
                className="flex-1 bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || chatMutation.isPending}
                className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center text-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-primary/90 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
