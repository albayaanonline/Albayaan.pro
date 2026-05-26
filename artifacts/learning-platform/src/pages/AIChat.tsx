import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { useAuth } from "@/lib/contexts/AuthContext";
import { COURSES } from "@/data/courses";
import {
  Bot, Send, Sparkles, BookOpen, ArrowRight, RefreshCw,
  GraduationCap, Brain, Code2, Briefcase, Zap, Lightbulb,
  MessageSquare, User, Clock,
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  courses?: { id: string; title: string; color: string }[];
  timestamp: Date;
}

const QUICK_PROMPTS = [
  { icon: Brain,       label: "Which AI course should I start?",    labelAr: "من أين أبدأ في الذكاء الاصطناعي؟", labelSo: "Kooorsaha AI-ga ee ugu fiican?" },
  { icon: Code2,       label: "Best programming course for me?",    labelAr: "أفضل دورة برمجة لي؟",               labelSo: "Koorshaha barnaamijka ugu fiican?" },
  { icon: GraduationCap, label: "School curriculum options?",       labelAr: "خيارات المنهج المدرسي؟",            labelSo: "Manhajka dugsiga?" },
  { icon: Briefcase,   label: "How do I earn a certificate?",       labelAr: "كيف أحصل على شهادة؟",              labelSo: "Shahaadada sidaan u helaa?" },
  { icon: Zap,         label: "What's the cheapest course?",        labelAr: "ما هي أرخص دورة؟",                 labelSo: "Koorshaha ugu roon qiimaha?" },
  { icon: Lightbulb,   label: "Freelancing tips for beginners",     labelAr: "نصائح العمل الحر للمبتدئين",       labelSo: "Talooyin freelancing bilowga" },
];

function buildReply(msg: string): { content: string; courses?: { id: string; title: string; color: string }[] } {
  const lower = msg.toLowerCase();

  if (lower.includes("ai") || lower.includes("machine learning") || lower.includes("chatgpt") || lower.includes("artificial")) {
    return {
      content: "Great choice! 🤖 For AI, I recommend starting with our **AI & Machine Learning Mastery** course. It covers ChatGPT, Midjourney, prompt engineering, automation tools, and even basic ML concepts — all from scratch. If you already have Python skills, also check out our **Data Science & Analytics** course which goes deeper into machine learning algorithms.",
      courses: [
        { id: "ai-mastery", title: "AI & Machine Learning Mastery", color: "from-violet-600 to-blue-500" },
        { id: "data-science", title: "Data Science & Analytics", color: "from-cyan-500 to-blue-600" },
      ],
    };
  }

  if (lower.includes("python") || lower.includes("programming") || lower.includes("code") || lower.includes("developer")) {
    return {
      content: "Awesome! 🐍 For programming, the **Python Programming – Zero to Hero** course is our most popular choice. It goes from basics to real projects in 12 weeks. If you want to build websites, check out **Full-Stack Web Development** — it covers HTML, CSS, JavaScript, React, Node.js, and deployment. Both come with a certificate!",
      courses: [
        { id: "python-programming", title: "Python Programming – Zero to Hero", color: "from-yellow-500 to-green-500" },
        { id: "web-development", title: "Full-Stack Web Development", color: "from-orange-500 to-red-500" },
      ],
    };
  }

  if (lower.includes("english") || lower.includes("ingiriisi") || lower.includes("إنجليزية")) {
    return {
      content: "📚 We have 3 levels of English courses! Start with **English for Beginners** if you're just starting out — it covers the alphabet, basic vocabulary, greetings, and simple conversations. Already know some English? Try **Intermediate English** for grammar, writing, and business English. Our **Advanced English** course covers academic writing and professional communication.",
      courses: [
        { id: "en-beginner", title: "English for Beginners", color: "from-blue-500 to-cyan-400" },
        { id: "en-intermediate", title: "Intermediate English", color: "from-indigo-500 to-blue-400" },
        { id: "en-advanced", title: "Advanced English Mastery", color: "from-purple-500 to-indigo-400" },
      ],
    };
  }

  if (lower.includes("arabic") || lower.includes("carabi") || lower.includes("عربية") || lower.includes("quran")) {
    return {
      content: "🌙 Excellent! We offer Arabic courses for all levels. **Arabic for Beginners** is perfect if you want to learn to read and write Arabic from scratch. **Intermediate Arabic** builds on that with grammar and conversation. We also have a comprehensive **Islamic Studies** university-level course that includes Quran sciences, Hadith, Fiqh, and Arabic for Quranic studies.",
      courses: [
        { id: "ar-beginner", title: "Arabic for Beginners", color: "from-green-500 to-emerald-400" },
        { id: "ar-intermediate", title: "Intermediate Arabic", color: "from-teal-500 to-green-400" },
        { id: "islamic-studies", title: "Islamic Studies – University Level", color: "from-amber-500 to-yellow-400" },
      ],
    };
  }

  if (lower.includes("certificate") || lower.includes("shahaada") || lower.includes("شهادة")) {
    return {
      content: "🏆 Great news — every course at Al-Bayaan College includes a **PDF Certificate of Completion**! Here's how to earn yours:\n\n1. Enroll in any course\n2. Complete all lessons (100%)\n3. Pass the final quiz\n4. Download your certificate from the Dashboard\n5. Share it with the unique verification link\n\nAll certificates are verifiable at **albayaan.pro/verify** using the certificate ID. Employers and institutions can verify your certificate instantly!",
    };
  }

  if (lower.includes("freelanc") || lower.includes("earn") || lower.includes("money") || lower.includes("income") || lower.includes("kasub")) {
    return {
      content: "💰 Want to earn online? I recommend a 3-course stack for maximum income potential:\n\n**Step 1:** Learn a skill (AI, Python, Design, or Web Dev)\n**Step 2:** Take **Freelancing Mastery: Earn Online** — learn to set up Upwork/Fiverr profiles, write proposals, and find clients\n**Step 3:** Scale with **Digital Business & Entrepreneurship**\n\nOur students are earning $1,000–$5,000/month after completing these courses!",
      courses: [
        { id: "freelancing-mastery", title: "Freelancing Mastery: Earn Online", color: "from-blue-500 to-indigo-600" },
        { id: "digital-business", title: "Digital Business & Entrepreneurship", color: "from-emerald-500 to-teal-600" },
      ],
    };
  }

  if (lower.includes("design") || lower.includes("canva") || lower.includes("figma") || lower.includes("graphic")) {
    return {
      content: "🎨 For design, our **Graphic Design & Visual Branding** course covers Canva, Figma, logo design, brand identity, social media design, and how to build your design portfolio. It's beginner-friendly and you'll complete a full brand identity project. Perfect for freelancers and entrepreneurs!",
      courses: [
        { id: "graphic-design", title: "Graphic Design & Visual Branding", color: "from-pink-500 to-rose-600" },
        { id: "digital-marketing", title: "Digital Marketing & Social Media", color: "from-pink-500 to-purple-500" },
      ],
    };
  }

  if (lower.includes("school") || lower.includes("curriculum") || lower.includes("math") || lower.includes("science") || lower.includes("dugsiga")) {
    return {
      content: "🏫 Our School & University Curriculum section has structured academic courses:\n\n**School Level:** Mathematics (Algebra, Geometry, Calculus), General Science (Biology, Chemistry, Physics), English (3 levels), Arabic (2 levels)\n\n**University Level:** Computer Science, Islamic Studies\n\nAll curriculum courses are taught in English, Arabic, and Somali, making them perfect for students across East Africa and the Arab world.",
      courses: [
        { id: "math-school", title: "Mathematics – School Level", color: "from-blue-500 to-cyan-400" },
        { id: "science-school", title: "General Science – School Level", color: "from-green-600 to-teal-400" },
        { id: "cs-university", title: "Computer Science – University Level", color: "from-violet-600 to-purple-400" },
      ],
    };
  }

  if (lower.includes("price") || lower.includes("cost") || lower.includes("cheap") || lower.includes("expensive") || lower.includes("qiime") || lower.includes("سعر")) {
    const cheapest = [...COURSES].sort((a, b) => a.price - b.price).slice(0, 3);
    return {
      content: `💸 Our courses range from **$15 to $49** — with lifetime access and a certificate included in every price. Here are our most affordable options:\n\n• **English for Beginners** — $15\n• **Arabic for Beginners** — $15\n• **Self-Development & Leadership** — $25\n\nAll courses give you **lifetime access**, so you can learn at your own pace with no monthly fees!`,
      courses: cheapest.map(c => ({ id: c.id, title: c.title, color: c.color })),
    };
  }

  if (lower.includes("data science") || lower.includes("analytics") || lower.includes("sql") || lower.includes("xogta")) {
    return {
      content: "📊 Our **Data Science & Analytics** course is perfect for you! It covers Python (NumPy, Pandas), SQL, data visualization (Matplotlib, Seaborn, Plotly), machine learning with scikit-learn, and Business Intelligence tools like Power BI and Tableau. Taught at intermediate level in 10 weeks.",
      courses: [
        { id: "data-science", title: "Data Science & Analytics", color: "from-cyan-500 to-blue-600" },
        { id: "python-programming", title: "Python Programming – Zero to Hero", color: "from-yellow-500 to-green-500" },
      ],
    };
  }

  if (lower.includes("marketing") || lower.includes("seo") || lower.includes("social media") || lower.includes("suuqgeynta")) {
    return {
      content: "📈 For marketing, check out **Digital Marketing & Social Media** — it covers SEO, Instagram/TikTok strategy, email marketing, paid advertising (Meta Ads, Google Ads), and analytics. Combined with **Digital Business & Entrepreneurship**, you'll have everything to grow any business online!",
      courses: [
        { id: "digital-marketing", title: "Digital Marketing & Social Media", color: "from-pink-500 to-purple-500" },
        { id: "digital-business", title: "Digital Business & Entrepreneurship", color: "from-emerald-500 to-teal-600" },
      ],
    };
  }

  if (lower.includes("hello") || lower.includes("hi") || lower.includes("salaam") || lower.includes("مرحبا")) {
    return {
      content: "👋 Hello! I'm your Al-Bayaan College AI Tutor. I'm here to help you find the perfect course, answer questions about our programs, and guide your learning journey!\n\nYou can ask me about:\n• **Course recommendations** based on your goals\n• **Curriculum details** for any subject\n• **Certificate information**\n• **Pricing and enrollment**\n• **Career advice** and skill paths\n\nWhat would you like to learn today? 🎓",
    };
  }

  if (lower.includes("thank") || lower.includes("shukran") || lower.includes("mahadsanid")) {
    return {
      content: "You're very welcome! 😊 It's my pleasure to help you on your learning journey. Remember, at Al-Bayaan College, every course includes a verified certificate and lifetime access. Is there anything else I can help you with?",
    };
  }

  if (lower.includes("self") || lower.includes("mindset") || lower.includes("habit") || lower.includes("leader")) {
    return {
      content: "🚀 For personal growth, **Self-Development & Leadership** is our highest-rated course (4.9⭐)! Coach Nasra covers the growth mindset, SMART goals, habit formation (Atomic Habits method), time management, emotional intelligence, public speaking, financial intelligence, and leadership skills. 3,100+ students enrolled!",
      courses: [
        { id: "self-development", title: "Self-Development & Leadership", color: "from-orange-500 to-amber-600" },
      ],
    };
  }

  const matchedCourses = COURSES.filter(c =>
    c.title.toLowerCase().includes(lower) ||
    c.description.toLowerCase().includes(lower) ||
    c.category.toLowerCase().includes(lower)
  ).slice(0, 2);

  if (matchedCourses.length > 0) {
    return {
      content: `I found some courses that match your interest! Here are the most relevant options from our catalog:`,
      courses: matchedCourses.map(c => ({ id: c.id, title: c.title, color: c.color })),
    };
  }

  return {
    content: "That's a great question! 🤔 At Al-Bayaan College, we offer 18 courses across two main sections:\n\n**📚 School & University Curriculum:**\nMath, Science, English (3 levels), Arabic (2 levels), Computer Science, Islamic Studies\n\n**💡 Skills & Career Courses:**\nAI, Python, Web Dev, Data Science, Design, Digital Marketing, Business, Freelancing, Self-Development\n\nAll courses include certificates, AI tutoring, and are available in English, Arabic & Somali. Would you like me to recommend a specific course based on your goals?",
  };
}

export default function AIChat() {
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "👋 Assalamu Alaykum! I'm your **Al-Bayaan College AI Tutor**.\n\nI can help you:\n• Find the perfect course for your goals\n• Explain course content and certificates\n• Guide your learning path\n• Answer any questions about our programs\n\nWhat would you like to learn today? 🎓",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: msg, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    await new Promise(r => setTimeout(r, 700 + Math.random() * 500));

    const reply = buildReply(msg);
    const assistantMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: reply.content,
      courses: reply.courses,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, assistantMsg]);
    setLoading(false);
  };

  const formatContent = (text: string) => {
    return text.split("\n").map((line, i) => {
      const parts = line.split(/\*\*(.*?)\*\*/g);
      return (
        <span key={i}>
          {parts.map((part, j) =>
            j % 2 === 1 ? <strong key={j} className="font-bold text-white">{part}</strong> : part
          )}
          {i < text.split("\n").length - 1 && <br />}
        </span>
      );
    });
  };

  return (
    <div className="min-h-screen flex flex-col pt-16" style={{ background: "linear-gradient(135deg, #020817 0%, #0a1628 60%, #0d1f3c 100%)" }}>

      {/* Ambient glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/8 rounded-full blur-[80px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/8 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 flex flex-col flex-1 max-w-4xl mx-auto w-full px-4 py-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-6 pb-5 border-b border-white/10"
        >
          <div className="relative">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.5)]">
              <Bot className="w-7 h-7 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-green-400 border-2 border-background" />
          </div>
          <div>
            <h1 className="text-xl font-black text-white flex items-center gap-2">
              Al-Bayaan AI Tutor
              <Sparkles className="w-4 h-4 text-yellow-400" />
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("Your personal learning guide — always available", "مرشدك التعليمي الشخصي — متاح دائماً", "Hanunahaaga waxbarasho ee shakhsiga — had iyo jeer la heli karo")}
            </p>
          </div>
          <div className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-green-400 font-medium">{t("Online", "متصل", "Online")}</span>
          </div>
        </motion.div>

        {/* Quick prompts — show when no user messages yet */}
        {messages.length === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6"
          >
            {QUICK_PROMPTS.map((p, i) => (
              <motion.button
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => sendMessage(p.label)}
                className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/30 text-left text-xs text-muted-foreground hover:text-white transition-all duration-200 group"
              >
                <p.icon className="w-4 h-4 text-primary shrink-0 group-hover:scale-110 transition-transform" />
                {language === "ar" ? p.labelAr : language === "so" ? p.labelSo : p.label}
              </motion.button>
            ))}
          </motion.div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-5 mb-5 min-h-0 pr-1" style={{ maxHeight: "calc(100vh - 340px)" }}>
          <AnimatePresence initial={false}>
            {messages.map(msg => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.role === "assistant" && (
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shrink-0 mt-0.5 shadow-[0_0_15px_rgba(59,130,246,0.4)]">
                    <Bot className="w-4.5 h-4.5 text-white" style={{ width: "18px", height: "18px" }} />
                  </div>
                )}
                <div className={`max-w-[80%] space-y-3 ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col`}>
                  <div
                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-tr-sm"
                        : "bg-white/8 border border-white/10 text-gray-200 rounded-tl-sm"
                    }`}
                  >
                    {formatContent(msg.content)}
                  </div>
                  {msg.courses && msg.courses.length > 0 && (
                    <div className="space-y-2 w-full">
                      {msg.courses.map(course => (
                        <Link key={course.id} href={`/courses/${course.id}`}>
                          <motion.div
                            whileHover={{ x: 4 }}
                            className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/30 transition-all cursor-pointer group"
                          >
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-8 rounded-full bg-gradient-to-b ${course.color}`} />
                              <span className="text-xs font-semibold text-white group-hover:text-primary transition-colors">
                                {course.title}
                              </span>
                            </div>
                            <ArrowRight className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
                          </motion.div>
                        </Link>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-1 text-[10px] text-muted-foreground/50">
                    <Clock style={{ width: "10px", height: "10px" }} />
                    {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
                {msg.role === "user" && (
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-gray-600 to-gray-700 flex items-center justify-center shrink-0 mt-0.5">
                    {user?.name ? (
                      <span className="text-white text-xs font-bold">{user.name[0].toUpperCase()}</span>
                    ) : (
                      <User style={{ width: "16px", height: "16px" }} className="text-white" />
                    )}
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Loading dots */}
          {loading && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 justify-start"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center shrink-0">
                <Bot style={{ width: "18px", height: "18px" }} className="text-white" />
              </div>
              <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-white/8 border border-white/10">
                <div className="flex items-center gap-1.5">
                  {[0, 1, 2].map(i => (
                    <motion.div
                      key={i}
                      className="w-2 h-2 rounded-full bg-blue-400"
                      animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 0.8, delay: i * 0.15, repeat: Infinity }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          <div className="flex items-end gap-3 p-3 rounded-2xl bg-white/5 border border-white/10 focus-within:border-primary/40 transition-colors">
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder={t(
                "Ask me anything about courses, certificates, or your learning goals...",
                "اسألني عن الدورات والشهادات وأهدافك التعليمية...",
                "I waydiiso wax ku saabsan koorsooyinka, shahaadooyinka, ama yoolashaada..."
              )}
              rows={1}
              className="flex-1 bg-transparent text-white placeholder-gray-500 text-sm resize-none focus:outline-none leading-relaxed"
              style={{ maxHeight: "120px" }}
              onInput={e => {
                const el = e.target as HTMLTextAreaElement;
                el.style.height = "auto";
                el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
              }}
            />
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  setMessages([{
                    id: "welcome",
                    role: "assistant",
                    content: "👋 Assalamu Alaykum! I'm your **Al-Bayaan College AI Tutor**.\n\nI can help you:\n• Find the perfect course for your goals\n• Explain course content and certificates\n• Guide your learning path\n• Answer any questions about our programs\n\nWhat would you like to learn today? 🎓",
                    timestamp: new Date(),
                  }]);
                }}
                className="p-2 rounded-xl text-muted-foreground hover:text-white hover:bg-white/10 transition-all"
                title="New conversation"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                className="p-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_15px_rgba(59,130,246,0.4)] hover:shadow-[0_0_25px_rgba(59,130,246,0.6)] transition-shadow"
              >
                <Send className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
          <p className="text-center text-[10px] text-muted-foreground/40 mt-2">
            {t("AI Tutor — course guidance & learning support", "المعلم الذكي — إرشاد الدورات ودعم التعلم", "Bare AI-ga — hanunaynta koorsooyinka & taageerada waxbarashada")}
          </p>
        </motion.div>

        {/* Footer links */}
        <div className="flex items-center justify-center gap-6 mt-4 text-xs text-muted-foreground">
          <Link href="/courses" className="flex items-center gap-1.5 hover:text-primary transition-colors">
            <BookOpen className="w-3.5 h-3.5" />
            {t("Browse Courses", "تصفح الدورات", "Baadh Koorsooyinka")}
          </Link>
          <Link href="/curriculum" className="flex items-center gap-1.5 hover:text-primary transition-colors">
            <GraduationCap className="w-3.5 h-3.5" />
            {t("Curriculum", "المنهج", "Manhajka")}
          </Link>
          <Link href="/dashboard" className="flex items-center gap-1.5 hover:text-primary transition-colors">
            <MessageSquare className="w-3.5 h-3.5" />
            {t("Dashboard", "لوحة التحكم", "Dhaq-dhaqaaqa")}
          </Link>
        </div>
      </div>
    </div>
  );
}
