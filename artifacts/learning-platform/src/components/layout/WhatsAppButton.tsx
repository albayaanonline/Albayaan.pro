import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

export function WhatsAppButton() {
  return (
    <motion.a
      href="https://wa.me/252656042512"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 right-6 z-50 p-4 bg-green-500 rounded-full shadow-[0_0_20px_rgba(34,197,94,0.6)] text-white hover:scale-110 transition-transform"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
    >
      <MessageCircle className="w-6 h-6" />
    </motion.a>
  );
}
