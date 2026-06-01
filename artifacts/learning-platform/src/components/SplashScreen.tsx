import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function SplashScreen({ onDone }: { onDone: () => void }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => {
        document.body.style.overflow = "";
        onDone();
      }, 500);
    }, 1800);
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, [onDone]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#030712]"
        >
          {/* Ambient glow layers */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[120px]" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-blue-500/15 rounded-full blur-[60px]" />
          </div>

          {/* Logo */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
            className="relative mb-8"
          >
            <motion.img
              src="/logo-256.png"
              alt="Albayaan.pro"
              className="h-36 w-36 object-contain"
              style={{
                filter: "drop-shadow(0 0 32px rgba(59,130,246,0.9)) drop-shadow(0 0 8px rgba(147,197,253,0.6))",
              }}
              animate={{
                filter: [
                  "drop-shadow(0 0 32px rgba(59,130,246,0.9)) drop-shadow(0 0 8px rgba(147,197,253,0.6))",
                  "drop-shadow(0 0 48px rgba(59,130,246,1)) drop-shadow(0 0 16px rgba(147,197,253,0.9))",
                  "drop-shadow(0 0 32px rgba(59,130,246,0.9)) drop-shadow(0 0 8px rgba(147,197,253,0.6))",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>

          {/* Brand name */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-center"
          >
            <div className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-300 to-purple-400 tracking-tight">
              Albayaan.pro
            </div>
            <div className="text-sm text-blue-400/70 mt-1 tracking-widest uppercase font-medium">
              Al-Bayaan College
            </div>
          </motion.div>

          {/* Loading dots */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="flex gap-1.5 mt-10"
          >
            {[0, 1, 2].map(i => (
              <motion.span
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-blue-400"
                animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
