import { Link } from "wouter";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { MessageCircle, Mail, Globe, BookOpen, LayoutDashboard, Key, ShieldCheck, DollarSign } from "lucide-react";

const BRAND = "Albayaan.pro";

export function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border/50 bg-background mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-3 inline-flex">
              <img src="/logo-48.png" alt="Albayaan.pro" className="h-10 w-10 object-contain" />
              <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                {BRAND}
              </span>
            </Link>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">
              {t(
                "A premium AI-powered language learning platform in English, Arabic & Somali.",
                "منصة تعليم لغات متميزة بالذكاء الاصطناعي باللغتين الإنجليزية والعربية والصومالية.",
                "Madal waxbarasho luuqadeed oo heer sare ah oo AI ah ee Ingiriisi, Carabi iyo Soomaali."
              )}
            </p>
            <div className="flex gap-3">
              <a
                href="https://wa.me/252656042512"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center text-green-400 hover:bg-green-500/30 transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href="mailto:support@albayaan.pro"
                className="w-9 h-9 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 hover:bg-blue-500/30 transition-colors"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Platform */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">
              {t("Platform", "المنصة", "Madasha")}
            </h4>
            <ul className="space-y-2.5">
              {[
                { href: "/courses",    icon: BookOpen,      label: t("Courses",    "الدورات",         "Koorsooyinka") },
                { href: "/pricing",    icon: DollarSign,    label: t("Pricing",    "الأسعار",         "Qiimaha") },
                { href: "/access-code",icon: Key,           label: t("Redeem Code","استرداد الرمز",   "Furo Koodhka") },
                { href: "/dashboard",  icon: LayoutDashboard,label: t("Dashboard", "لوحة التحكم",     "Dhaq-dhaqaaqa") },
                { href: "/admin/login",icon: ShieldCheck,   label: "Admin Panel" },
              ].map((item, i) => (
                <li key={i}>
                  <Link
                    href={item.href}
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <item.icon className="w-3.5 h-3.5 shrink-0" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Payment */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">
              {t("Payment", "الدفع", "Lacag Bixinta")}
            </h4>
            <ul className="space-y-3">
              {[
                { name: "Zaad",    number: "0636042512",    color: "text-green-400",  emoji: "📱" },
                { name: "Waafi",   number: "0636042512",    color: "text-blue-400",   emoji: "💰" },
                { name: "Visa/MC", number: "Via WhatsApp",  color: "text-purple-400", emoji: "💳" },
              ].map((pm, i) => (
                <li key={i} className="text-sm">
                  <div className="flex items-center gap-1.5">
                    <span>{pm.emoji}</span>
                    <span className={`font-semibold ${pm.color}`}>{pm.name}</span>
                  </div>
                  <span className="text-muted-foreground font-mono text-xs ml-6">{pm.number}</span>
                </li>
              ))}
            </ul>
            <a
              href="https://wa.me/252656042512"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-green-400 hover:text-green-300 transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              +252 65 6042512
            </a>
          </div>
        </div>

        <div className="border-t border-border/50 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <span>© {year} {BRAND}. {t("All rights reserved.", "جميع الحقوق محفوظة.", "Dhammaan xuquuqaha way ilaalisan yihiin.")}</span>
          <div className="flex items-center gap-1">
            <Globe className="w-3.5 h-3.5" />
            <span>{t("English · Arabic · Somali", "الإنجليزية · العربية · الصومالية", "Ingiriisi · Carabi · Soomaali")}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
