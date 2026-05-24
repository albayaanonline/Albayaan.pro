import { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { AIChat } from "./AIChat";
import { WhatsAppButton } from "./WhatsAppButton";
import { useLanguage } from "@/lib/contexts/LanguageContext";

export function MainLayout({ children }: { children: ReactNode }) {
  const { dir } = useLanguage();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col" dir={dir}>
      <Navbar />
      <main className="flex-1 w-full pt-16">
        {children}
      </main>
      <AIChat />
      <WhatsAppButton />
    </div>
  );
}
