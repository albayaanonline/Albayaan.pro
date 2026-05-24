import { useLanguage } from "@/lib/contexts/LanguageContext";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-full p-1">
      {(["en", "ar", "so"] as const).map((lang) => (
        <button
          key={lang}
          onClick={() => setLanguage(lang)}
          className={`px-2 py-1 text-xs font-semibold rounded-full transition-all ${
            language === lang
              ? "bg-primary text-white shadow-[0_0_10px_rgba(59,130,246,0.5)]"
              : "text-muted-foreground hover:text-white"
          }`}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
