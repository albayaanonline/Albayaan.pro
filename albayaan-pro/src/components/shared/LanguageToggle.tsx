import { useLanguage } from "@/lib/contexts/LanguageContext";

interface LanguageToggleProps {
  compact?: boolean;
}

export function LanguageToggle({ compact = false }: LanguageToggleProps) {
  const { language, setLanguage } = useLanguage();
  const langs = (["en", "ar", "so"] as const);

  if (compact) {
    return (
      <div className="flex items-center gap-0.5 bg-white/5 border border-white/10 rounded-full p-0.5">
        {langs.map((lang) => (
          <button
            key={lang}
            onClick={() => setLanguage(lang)}
            className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full transition-all ${
              language === lang
                ? "bg-primary text-white"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {lang.toUpperCase()}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1 bg-white/5 border border-white/10 rounded-full p-1">
      {langs.map((lang) => (
        <button
          key={lang}
          onClick={() => setLanguage(lang)}
          className={`px-2 py-1 text-xs font-semibold rounded-full transition-all ${
            language === lang
              ? "bg-primary text-white shadow-[0_0_10px_rgba(59,130,246,0.5)]"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {lang.toUpperCase()}
        </button>
      ))}
    </div>
  );
}
