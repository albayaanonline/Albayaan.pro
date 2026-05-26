import { useState, useRef, useEffect } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, Sparkles, ArrowRight } from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { COURSES } from "@/data/courses";

type Message = { role: "user" | "assistant"; content: string; courses?: { id: string; title: string }[] };

function buildReply(msg: string): { content: string; courses?: { id: string; title: string }[] } {
  const lower = msg.toLowerCase();

  if (lower.includes("ai") || lower.includes("machine learning") || lower.includes("chatgpt")) {
    return {
      content: "🤖 Our **AI & Machine Learning Mastery** course is perfect for you! It covers ChatGPT, Midjourney, prompt engineering, and automation — all from scratch.",
      courses: [{ id: "ai-mastery", title: "AI & Machine Learning Mastery" }],
    };
  }
  if (lower.includes("python") || lower.includes("programming") || lower.includes("code")) {
    return {
      content: "🐍 Check out **Python Programming – Zero to Hero** (12 weeks, 3,200+ students) or **Full-Stack Web Development** if you want to build websites!",
      courses: [
        { id: "python-programming", title: "Python – Zero to Hero" },
        { id: "web-development", title: "Full-Stack Web Development" },
      ],
    };
  }
  if (lower.includes("english")) {
    return {
      content: "📚 We have 3 English levels: Beginner ($15), Intermediate ($25), and Advanced ($35). All with certificates and AI tutoring!",
      courses: [
        { id: "en-beginner", title: "English for Beginners" },
        { id: "en-intermediate", title: "Intermediate English" },
      ],
    };
  }
  if (lower.includes("arabic") || lower.includes("carabi") || lower.includes("quran") || lower.includes("islamic")) {
    return {
      content: "🌙 We have **Arabic for Beginners**, **Intermediate Arabic**, and a full **Islamic Studies – University Level** course covering Quran, Hadith, Fiqh, and more!",
      courses: [
        { id: "ar-beginner", title: "Arabic for Beginners" },
        { id: "islamic-studies", title: "Islamic Studies – University" },
      ],
    };
  }
  if (lower.includes("certificate") || lower.includes("shahaad")) {
    return {
      content: "🏆 Every course includes a verified PDF certificate! Complete all lessons → pass the quiz → download instantly from your Dashboard. Employers can verify at albayaan.pro/verify.",
    };
  }
  if (lower.includes("freelanc") || lower.includes("earn") || lower.includes("money") || lower.includes("kasub")) {
    return {
      content: "💰 For earning online, I recommend: **Freelancing Mastery** (earn $1K+/month on Upwork/Fiverr) + **Digital Business** for scaling!",
      courses: [
        { id: "freelancing-mastery", title: "Freelancing Mastery: Earn Online" },
        { id: "digital-business", title: "Digital Business & Entrepreneurship" },
      ],
    };
  }
  if (lower.includes("price") || lower.includes("cost") || lower.includes("cheap") || lower.includes("qiime")) {
    return {
      content: "💸 Courses range from **$15–$49** with lifetime access. Cheapest: English for Beginners ($15), Arabic for Beginners ($15). All include a certificate! No subscriptions ever.",
    };
  }
  if (lower.includes("design") || lower.includes("canva") || lower.includes("figma")) {
    return {
      content: "🎨 **Graphic Design & Visual Branding** covers Canva, Figma, logo design, brand identity, and social media design — perfect for freelancers!",
      courses: [{ id: "graphic-design", title: "Graphic Design & Visual Branding" }],
    };
  }
  if (lower.includes("hello") || lower.includes("hi") || lower.includes("salaam") || lower.includes("marhaba")) {
    return {
      content: "👋 Hello! I'm your Albayaan AI Assistant. I can help you find the right course, explain certificates, pricing, or anything about our learning programs. What would you like to learn? 🎓",
    };
  }
  if (lower.includes("school") || lower.includes("curriculum") || lower.includes("math") || lower.includes("science")) {
    return {
      content: "🏫 Our **School & University Curriculum** includes Math, Science, English (3 levels), Arabic (2 levels), Computer Science, and Islamic Studies — all structured for school and university students!",
      courses: [
        { id: "math-school", title: "Mathematics – School Level" },
        { id: "cs-university", title: "Computer Science – University" },
      ],
    };
  }

  const matched = COURSES.filter(c =>
    c.title.toLowerCase().includes(lower) || c.category.toLowerCase().includes(lower)
  ).slice(0, 2);

  if (matched.length > 0) {
    return {
      content: "Here are the most relevant courses for you:",
      courses: matched.map(c => ({ id: c.id, title: c.title })),
    };
  }

  return {
    content: "Great question! 🎓 We offer 18 courses across **School/University Curriculum** and **Skills & Career** tracks — AI, Python, Web Dev, Design, Marketing, Freelancing, and more. For detailed guidance, visit our **AI Tutor** page!",
  };
}

export function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "👋 Hi! I'm your Albayaan AI Assistant. Ask me anything about our courses, certificates, or pricing! 🎓" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;
    const newMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    await new Promise(r => setTimeout(r, 600 + Math.random() * 400));
    const reply = buildReply(text);
    setMessages(prev => [...prev, { role: "assistant", content: reply.content, courses: reply.courses }]);
    setLoading(false);
  };

  const formatContent = (text: string) => {
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) =>
      i % 2 === 1 ? <strong key={i} className="font-bold">{part}</strong> : part
    );
  };

  return (
    <>
      {/* Toggle button */}
      <motion.button
        onClick={() => setIsOpen(v => !v)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 left-6 z-50 w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full shadow-[0_0_25px_rgba(59,130,246,0.5)] text-white flex items-center justify-center hover:shadow-[0_0_35px_rgba(59,130,246,0.7)] transition-shadow"
        style={{ transform: "translateZ(0)" }}
        aria-label="Open AI chat"
      >
        <AnimatePresence mode="wait">
          {isOpen
            ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}><X className="w-5 h-5" /></motion.div>
            : <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}><Bot className="w-6 h-6" /></motion.div>
          }
        </AnimatePresence>
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-green-400 border-2 border-background animate-pulse" />
        )}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.34, 1.2, 0.64, 1] }}
            className="fixed bottom-24 left-6 z-50 w-[calc(100vw-3rem)] sm:w-96 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            style={{
              transform: "translateZ(0)",
              background: "rgba(8,15,32,0.97)",
              border: "1px solid rgba(59,130,246,0.25)",
              maxHeight: "min(520px, 70vh)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-[0_0_12px_rgba(59,130,246,0.5)]">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Albayaan AI</h3>
                  <div className="flex items-center gap-1 text-xs text-green-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    Online · Always available
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Link href="/ai-tutor" onClick={() => setIsOpen(false)}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="flex items-center gap-1 px-2 py-1 rounded-lg bg-primary/10 border border-primary/20 text-xs text-primary hover:bg-primary/20 transition-colors"
                  >
                    <Sparkles className="w-3 h-3" />
                    Full Tutor
                  </motion.div>
                </Link>
                <button
                  onClick={() => setIsOpen(false)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-muted-foreground hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 px-4 py-3 overflow-y-auto space-y-3" style={{ WebkitOverflowScrolling: "touch" }}>
              {messages.map((m, i) => (
                <div key={i} className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  {m.role === "assistant" && (
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                      <Bot className="text-white" style={{ width: "12px", height: "12px" }} />
                    </div>
                  )}
                  <div className="max-w-[80%] space-y-1.5">
                    <div className={`px-3 py-2 rounded-2xl text-xs leading-relaxed ${
                      m.role === "user"
                        ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-tr-sm"
                        : "bg-white/8 border border-white/10 text-gray-200 rounded-tl-sm"
                    }`}>
                      {formatContent(m.content)}
                    </div>
                    {m.courses && m.courses.length > 0 && (
                      <div className="space-y-1">
                        {m.courses.map(c => (
                          <Link key={c.id} href={`/courses/${c.id}`} onClick={() => setIsOpen(false)}>
                            <div className="flex items-center gap-2 px-2.5 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/30 transition-all cursor-pointer group">
                              <div className="w-1.5 h-5 rounded-full bg-gradient-to-b from-blue-400 to-purple-500 shrink-0" />
                              <span className="text-xs text-white flex-1 truncate group-hover:text-primary transition-colors">{c.title}</span>
                              <ArrowRight className="w-3 h-3 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex gap-2 justify-start">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shrink-0">
                    <Bot className="text-white" style={{ width: "12px", height: "12px" }} />
                  </div>
                  <div className="px-3 py-2 rounded-2xl rounded-tl-sm bg-white/8 border border-white/10 flex items-center gap-1">
                    {[0, 1, 2].map(i => (
                      <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-blue-400"
                        animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                        transition={{ duration: 0.7, delay: i * 0.15, repeat: Infinity }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="px-3 py-3 border-t border-white/10">
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-3 py-2 focus-within:border-primary/40 transition-colors">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && !e.shiftKey && handleSend()}
                  placeholder={t("Ask about any course...", "اسألني عن أي دورة...", "Koorso ku saabsan wax weydii...")}
                  className="flex-1 bg-transparent text-xs text-white placeholder-gray-500 focus:outline-none"
                />
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={handleSend}
                  disabled={!input.trim() || loading}
                  className="w-7 h-7 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_10px_rgba(59,130,246,0.4)]"
                >
                  <Send style={{ width: "12px", height: "12px" }} />
                </motion.button>
              </div>
              <Link href="/ai-tutor" onClick={() => setIsOpen(false)} className="flex items-center justify-center gap-1 mt-2 text-[10px] text-muted-foreground/50 hover:text-primary transition-colors">
                <Sparkles style={{ width: "10px", height: "10px" }} />
                Open full AI Tutor experience
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
