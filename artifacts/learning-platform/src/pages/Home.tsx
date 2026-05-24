import { motion } from "framer-motion";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { Link } from "wouter";
import { BookOpen, Users, Trophy, Zap, Globe, ShieldCheck, Star, ArrowRight, CheckCircle, Sparkles, Brain, Target } from "lucide-react";

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
};

const stagger = {
  animate: { transition: { staggerChildren: 0.1 } }
};

export default function Home() {
  const { t } = useLanguage();

  const stats = [
    { value: "10K+", label: t("Active Students", "طالب نشط", "Ardayda Firfircoon") },
    { value: "50+", label: t("Expert Courses", "دورة متخصصة", "Koorso Khubradi ah") },
    { value: "95%", label: t("Completion Rate", "معدل الإتمام", "Heerka Dhamaystirka") },
    { value: "4.9★", label: t("Average Rating", "متوسط التقييم", "Celceliska Qiimaynta") },
  ];

  const features = [
    {
      icon: Brain,
      color: "from-blue-500 to-blue-600",
      bg: "bg-blue-500/10 border-blue-500/20",
      title: t("AI-Powered Learning", "التعلم بالذكاء الاصطناعي", "Waxbarasho AI ah"),
      desc: t("Our AI assistant helps you understand complex topics instantly.", "مساعدنا الذكي يساعدك على فهم المواضيع المعقدة فوراً.", "Kaaliyahaaga AI-ga ayaa kaa caawiya si aad si deg-deg ah u fahamto mawduucyada adag."),
    },
    {
      icon: Globe,
      color: "from-purple-500 to-purple-600",
      bg: "bg-purple-500/10 border-purple-500/20",
      title: t("Multi-language Support", "دعم متعدد اللغات", "Taageero Luuqaddo Badan"),
      desc: t("Learn in English, Arabic, or Somali — your choice.", "تعلم بالإنجليزية أو العربية أو الصومالية — اختيارك.", "Ku baro Ingiriisi, Carabi, ama Soomaali — doorashadaada."),
    },
    {
      icon: Target,
      color: "from-green-500 to-emerald-600",
      bg: "bg-green-500/10 border-green-500/20",
      title: t("Structured Curriculum", "منهج منظم", "Manhajka Nidaamsan"),
      desc: t("Step-by-step lessons designed for real-world fluency.", "دروس خطوة بخطوة مصممة للطلاقة في العالم الحقيقي.", "Casharro tallaabooyinka ku saleysan ee loogu talagalay shaqaynta adduunka."),
    },
    {
      icon: Trophy,
      color: "from-yellow-500 to-orange-500",
      bg: "bg-yellow-500/10 border-yellow-500/20",
      title: t("Certificates", "شهادات", "Shahaadooyinka"),
      desc: t("Earn verified certificates upon completing your courses.", "احصل على شهادات موثقة عند إتمام دوراتك.", "Hel shahaadooyinka la xaqiijiyay marka aad dhamayso koorsooyinkaaga."),
    },
    {
      icon: Zap,
      color: "from-pink-500 to-rose-500",
      bg: "bg-pink-500/10 border-pink-500/20",
      title: t("Interactive Quizzes", "اختبارات تفاعلية", "Imtixaanno Isdhexgal ah"),
      desc: t("Reinforce your learning with quizzes after every lesson.", "عزز تعلمك باختبارات بعد كل درس.", "Xooji waxbarashadaada adoo imtixaannada ka dib casharro kasta qaadan."),
    },
    {
      icon: ShieldCheck,
      color: "from-cyan-500 to-teal-500",
      bg: "bg-cyan-500/10 border-cyan-500/20",
      title: t("Access Code System", "نظام رموز الدخول", "Nidaamka Koodhka Galitaanka"),
      desc: t("Flexible enrollment — pay once, learn forever.", "تسجيل مرن — ادفع مرة وتعلم إلى الأبد.", "Diiwaangelinta fudud — hal mar bixi, weligaa baro."),
    },
  ];

  const howItWorks = [
    {
      step: "01",
      icon: BookOpen,
      title: t("Browse Courses", "تصفح الدورات", "Baadh Koorsooyinka"),
      desc: t("Explore our curated catalog of language courses.", "استكشف فهرسنا المنتقى من دورات اللغة.", "Sahminta taxanaha koorsooyinkeena luuqadda."),
    },
    {
      step: "02",
      icon: ShieldCheck,
      title: t("Enroll & Access", "سجل وادخل", "Diiwaangeli & Gal"),
      desc: t("Pay via mobile money or redeem an access code.", "ادفع عبر النقود المحمولة أو استرد رمز الوصول.", "Bixi lacag gacanta ama koodh geli."),
    },
    {
      step: "03",
      icon: Brain,
      title: t("Learn & Practice", "تعلم وتمرن", "Baro & Tababar"),
      desc: t("Study at your pace with AI assistance anytime.", "ادرس بوتيرتك مع مساعدة الذكاء الاصطناعي في أي وقت.", "Si raaxo leh ugu baro caawimaad AI ah oo goor kasta ah."),
    },
    {
      step: "04",
      icon: Trophy,
      title: t("Get Certified", "احصل على شهادة", "Shahaado Hel"),
      desc: t("Complete courses and earn your certificate.", "أكمل الدورات واحصل على شهادتك.", "Koorsooyinka dhamays oo shahaadadaada hel."),
    },
  ];

  const testimonials = [
    {
      name: "Ahmed Mohamed",
      role: t("English Student", "طالب اللغة الإنجليزية", "Ardayga Ingiriisiga"),
      content: t("IlmAI transformed my English in just 3 months. The AI assistant is like having a personal tutor 24/7.", "غيّر IlmAI لغتي الإنجليزية في 3 أشهر فقط. المساعد الذكي يشبه وجود مدرس خاص على مدار الساعة.", "IlmAI ayaa Ingiriiskayga ku baddalay 3 bilood gudahood. Kaaliyaha AI-ga wuxuu la mid yahay macallin gaar ah 24/7."),
      stars: 5,
    },
    {
      name: "Faadumo Hassan",
      role: t("Arabic Student", "طالبة اللغة العربية", "Ardayda Carabiga"),
      content: t("The multi-language support is amazing. I could learn Arabic while reading in Somali!", "دعم اللغات المتعددة رائع. يمكنني تعلم العربية أثناء القراءة بالصومالية!", "Taageerada luuqadaha badan ayaa cajiib ah. Waxaan ku baran karay Carabiga anigoo Soomaali ku akhrinaayo!"),
      stars: 5,
    },
    {
      name: "Omar Abdullah",
      role: t("Business Professional", "محترف أعمال", "Xirfadlaha Ganacsiga"),
      content: t("The access code system made it easy to gift courses to my team. Highly recommended!", "نظام رموز الوصول جعل من السهل إهداء الدورات لفريقي. أوصي به بشدة!", "Nidaamka koodhka galitaanka ayaa fududeeyay in aan koorsooyinka kooxdayda u hadiyeeyo. Aad baan u talinaayaa!"),
      stars: 5,
    },
  ];

  return (
    <div className="min-h-[100dvh] pt-16 flex flex-col relative overflow-hidden bg-background">
      {/* Hero Background Effects */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/20 dark:bg-blue-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-purple-600/20 dark:bg-purple-600/20 rounded-full blur-[150px]" />
      </div>

      {/* ── Hero ── */}
      <section className="flex-1 max-w-7xl mx-auto px-4 w-full flex flex-col items-center justify-center text-center z-10 py-24 md:py-32">
        <motion.div
          variants={stagger}
          initial="initial"
          animate="animate"
          className="space-y-6 max-w-4xl"
        >
          <motion.div variants={fadeUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary mb-2">
            <Sparkles className="w-4 h-4" />
            {t("Next-gen AI learning platform", "منصة التعلم بالذكاء الاصطناعي من الجيل القادم", "Madal waxbarasho AI ah oo casri ah")}
          </motion.div>

          <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1]">
            <span className="text-foreground">{t("Master Languages", "أتقن اللغات", "Luuqadaha Sii Barashada")}</span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              {t("at the Speed of AI", "بسرعة الذكاء الاصطناعي", "Xawliga AI ah")}
            </span>
          </motion.h1>

          <motion.p variants={fadeUp} className="text-lg md:text-xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed">
            {t(
              "A premium AI-powered learning experience in English, Arabic & Somali. Enter your access code or enroll now.",
              "تجربة تعلم متميزة بالذكاء الاصطناعي بالإنجليزية والعربية والصومالية. أدخل رمزك أو سجل الآن.",
              "Khibrad waxbarasho oo AI ah oo heer sarena ku jirta Ingiriisi, Carabi iyo Soomaali. Geli koodhkaaga ama hadda is diiwaangeli."
            )}
          </motion.p>

          <motion.div variants={fadeUp} className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/courses" className="group w-full sm:w-auto px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all duration-300 flex items-center justify-center gap-2">
              {t("Explore Courses", "استكشف الدورات", "Sahmi Koorsooyinka")}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="/access-code" className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 border border-white/20 text-foreground font-bold text-lg hover:bg-white/10 transition-colors backdrop-blur-sm flex items-center justify-center gap-2">
              {t("Redeem Code", "استرداد الرمز", "Furo Koodhka")}
            </Link>
          </motion.div>

          <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-6 pt-6 text-sm text-muted-foreground">
            {[
              t("No subscription required", "لا اشتراك مطلوب", "Rumeyn ma loo baahna"),
              t("Lifetime access", "وصول مدى الحياة", "Galitaan weligeed ah"),
              t("AI-assisted learning", "تعلم بمساعدة الذكاء الاصطناعي", "Waxbarasho AI la caawiso"),
            ].map((item, i) => (
              <span key={i} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-400" />
                {item}
              </span>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* ── Stats ── */}
      <section className="relative z-10 border-y border-white/10 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="relative z-10 py-24 max-w-7xl mx-auto px-4 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-sm font-medium text-purple-400 mb-4">
            <Zap className="w-4 h-4" />
            {t("Why IlmAI?", "لماذا IlmAI؟", "Maxay IlmAI u koobaantahay?")}
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-foreground mb-4">
            {t("Everything you need to", "كل ما تحتاجه", "Waxkasta oo aad u baahan tahay")}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
              {t("succeed in language learning", "النجاح في تعلم اللغة", "in aad luuqadda ku guulaysato")}
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            {t("Built for modern learners who demand results, not just content.", "مصمم للمتعلمين العصريين الذين يطلبون النتائج، وليس فقط المحتوى.", "Loogu talagalay ardayda casriga ah ee dalbada natiijooyinka, maaha kaliya nuxurka.")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className={`p-6 rounded-2xl border ${feature.bg} hover:scale-[1.02] transition-transform duration-300`}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-5 shadow-lg`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="relative z-10 py-24 bg-white/[0.02] border-y border-white/10 w-full">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-black text-foreground mb-4">
              {t("How it works", "كيف يعمل", "Sida uu u shaqeeyo")}
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              {t("Go from zero to fluent in 4 simple steps.", "من الصفر إلى الطلاقة في 4 خطوات بسيطة.", "Eber ilaa shuruud 4 tallaabo fudud.")}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative text-center"
              >
                {i < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[calc(50%+2.5rem)] w-[calc(100%-5rem)] h-px bg-gradient-to-r from-white/20 to-transparent" />
                )}
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center mx-auto mb-4 relative">
                  <step.icon className="w-7 h-7 text-primary" />
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-white text-xs font-black flex items-center justify-center">
                    {i + 1}
                  </span>
                </div>
                <h3 className="font-bold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="relative z-10 py-24 max-w-7xl mx-auto px-4 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-black text-foreground mb-4">
            {t("Loved by students", "يحبه الطلاب", "Ardaydu waxay jeclayaan")}
          </h2>
          <p className="text-muted-foreground">
            {t("Join thousands who've transformed their language skills.", "انضم إلى آلاف الأشخاص الذين غيروا مهاراتهم اللغوية.", "Ku biir kumannaan qof oo xirfadahooda luuqadda bedelay.")}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t2, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-2xl bg-card border border-white/10 hover:border-primary/30 transition-colors"
            >
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t2.stars }).map((_, s) => (
                  <Star key={s} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">"{t2.content}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                  {t2.name[0]}
                </div>
                <div>
                  <div className="font-semibold text-foreground text-sm">{t2.name}</div>
                  <div className="text-xs text-muted-foreground">{t2.role}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Pricing Teaser ── */}
      <section className="relative z-10 py-16 bg-white/[0.02] border-y border-white/10 w-full">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-black text-foreground mb-3">
              {t("Simple, one-time pricing", "تسعير بسيط لمرة واحدة", "Qiime fudud oo hal mar ah")}
            </h2>
            <p className="text-muted-foreground">{t("Pay once, learn forever. No subscriptions.", "ادفع مرة وتعلم للأبد. بلا اشتراكات.", "Hal mar bixi, weligaa baro. Rumeyn malaha.")}</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { name: t("Starter", "المبتدئ", "Bilowga"), price: "$15", desc: t("1 course, lifetime access", "دورة واحدة، وصول مدى الحياة", "1 koorso, weligeed galitaan"), color: "from-blue-500 to-cyan-400", popular: false },
              { name: t("Pro Bundle", "الحزمة الاحترافية", "Xidhmo Xirfadeed"), price: "$45", desc: t("3 courses + AI tutoring", "3 دورات + تدريب ذكي", "3 koorso + tababar AI"), color: "from-purple-500 to-indigo-400", popular: true },
              { name: t("All Access", "الوصول الكامل", "Dhammaan Galitaanka"), price: "$79", desc: t("All 6 courses forever", "جميع الـ6 دورات للأبد", "Dhammaan 6-da koorso weligeed"), color: "from-amber-500 to-orange-400", popular: false },
            ].map((plan, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className={`relative p-6 rounded-2xl bg-card border text-center hover:scale-[1.02] transition-transform duration-300 ${plan.popular ? "border-purple-500/50" : "border-white/10"}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div className="px-3 py-1 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold">⭐ {t("Most Popular", "الأكثر شعبية", "Ugu Caansan")}</div>
                  </div>
                )}
                <div className={`text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r ${plan.color} mb-1`}>{plan.price}</div>
                <div className="font-bold text-foreground mb-1">{plan.name}</div>
                <div className="text-sm text-muted-foreground mb-4">{plan.desc}</div>
                <Link href="/pricing" className={`w-full py-2.5 rounded-xl bg-gradient-to-r ${plan.color} text-white font-bold text-sm flex items-center justify-center gap-1 hover:opacity-90 transition-opacity`}>
                  {t("Get Started", "ابدأ الآن", "Bilow")} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Trust / Partners ── */}
      <section className="relative z-10 py-14 w-full">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center">
            <p className="text-muted-foreground text-xs uppercase tracking-widest font-semibold mb-8">
              {t("Trusted Payment Partners", "شركاء الدفع الموثوق بهم", "Wadaagayaasha Lacag Bixinta La Aaminsan")}
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
              {[
                { name: "Zaad",       emoji: "📱", desc: t("Mobile Money", "نقود موبايل", "Lacagta Mobilka"),    color: "text-green-400",  bg: "bg-green-500/10  border-green-500/20" },
                { name: "Waafi Pay",  emoji: "💰", desc: t("Mobile Wallet", "محفظة موبايل", "Khiisnaha Mobilka"), color: "text-blue-400",   bg: "bg-blue-500/10   border-blue-500/20" },
                { name: "VISA",       emoji: "💳", desc: t("Credit Card",   "بطاقة ائتمان",  "Kaarka Deynta"),     color: "text-sky-400",    bg: "bg-sky-500/10    border-sky-500/20" },
                { name: "Mastercard", emoji: "🔴", desc: t("Debit Card",    "بطاقة خصم",     "Kaarka Lacagta"),    color: "text-red-400",    bg: "bg-red-500/10    border-red-500/20" },
                { name: "PayPal",     emoji: "🅿️", desc: t("Global Pay",   "دفع عالمي",     "Bixinta Caalamiga"), color: "text-indigo-400", bg: "bg-indigo-500/10 border-indigo-500/20" },
                { name: "Stripe",     emoji: "⚡", desc: t("Secure Pay",   "دفع آمن",       "Bixin Ammaan ah"),   color: "text-purple-400", bg: "bg-purple-500/10 border-purple-500/20" },
              ].map((p, i) => (
                <motion.div key={p.name} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                  className={`flex flex-col items-center gap-2 px-5 py-4 rounded-2xl border ${p.bg} hover:scale-105 transition-transform duration-200 min-w-[90px]`}>
                  <span className="text-2xl">{p.emoji}</span>
                  <span className={`font-black text-sm ${p.color}`}>{p.name}</span>
                  <span className="text-xs text-muted-foreground text-center">{p.desc}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative z-10 py-24 w-full">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-10 md:p-16 rounded-3xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/10 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-purple-600/5 pointer-events-none" />
            <Users className="w-12 h-12 text-primary mx-auto mb-6" />
            <h2 className="text-3xl md:text-5xl font-black text-foreground mb-4">
              {t("Start learning today", "ابدأ التعلم اليوم", "Maanta bilow waxbarasho")}
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
              {t("Join thousands of students mastering English and Arabic with IlmAI.", "انضم إلى آلاف الطلاب الذين يتقنون الإنجليزية والعربية مع IlmAI.", "Ku biir kumannaan arday oo Ingiriisiga iyo Carabiga la bartay oo IlmAI la adeegsada.")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/courses" className="px-8 py-4 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-lg hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] transition-all duration-300 inline-flex items-center gap-2">
                {t("Browse Courses", "تصفح الدورات", "Baadh Koorsooyinka")}
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link href="/pricing" className="px-8 py-4 rounded-full border border-white/20 text-foreground font-bold text-lg hover:bg-white/5 transition-colors inline-flex items-center gap-2">
                {t("View Pricing", "عرض الأسعار", "Arag Qiimaha")}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
