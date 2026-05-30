import { useState } from "react";
import { motion } from "framer-motion";
import { Shield, Search, CheckCircle, XCircle, Loader2, Award } from "lucide-react";
import { useLanguage } from "@/lib/contexts/LanguageContext";

interface VerifyResult {
  valid: boolean;
  studentName?: string;
  courseName?: string;
  completionDate?: string;
  certId?: string;
}

export default function Verify() {
  const { t } = useLanguage();
  const [code, setCode] = useState("");
  const [result, setResult] = useState<VerifyResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    const normalized = code.trim().toUpperCase();
    if (!normalized) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`/api/certificates/${encodeURIComponent(normalized)}`, {
        credentials: "include",
      });
      if (res.ok) {
        const cert = await res.json();
        setResult({
          valid: true,
          studentName: cert.studentName,
          courseName: cert.courseName,
          certId: cert.certId,
          completionDate: new Date(cert.issuedAt).toLocaleDateString("en-US", {
            year: "numeric", month: "long", day: "numeric",
          }),
        });
      } else {
        setResult({ valid: false });
      }
    } catch {
      setResult({ valid: false });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16 px-4">
      <div className="max-w-2xl mx-auto">

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mx-auto mb-5 shadow-[0_0_40px_rgba(59,130,246,0.5)]">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-foreground mb-3">
            {t("Certificate Verification", "التحقق من الشهادة", "Xaqiijinta Shahaadada")}
          </h1>
          <p className="text-muted-foreground text-lg">
            {t("Enter a certificate ID to verify its authenticity.", "أدخل معرف الشهادة للتحقق من صحتها.", "Geli ID-ga shahaadada si aad u xaqiijiso saxnaanteeda.")}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-8 rounded-3xl bg-card border border-border mb-6"
        >
          <label className="block text-sm font-medium text-foreground mb-3">
            {t("Certificate ID", "معرف الشهادة", "ID-ga Shahaadada")}
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={code}
              onChange={e => setCode(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleVerify()}
              placeholder="ALBAYAAN-XXXX-XXXX-2026"
              className="flex-1 px-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 font-mono text-sm"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              onClick={handleVerify}
              disabled={loading || !code.trim()}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              {t("Verify", "تحقق", "Xaqiiji")}
            </motion.button>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            {t("Certificate IDs start with ALBAYAAN- and can be found at the bottom of any certificate.", "تبدأ معرفات الشهادات بـ ALBAYAAN- ويمكن العثور عليها في أسفل أي شهادة.", "ID-yada shahaadadu waxay ku bilaabmaan ALBAYAAN- waxaana laga heli karaa hoosta shahaadada kasta.")}
          </p>
        </motion.div>

        {result && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, ease: [0.34, 1.2, 0.64, 1] }}
          >
            {result.valid ? (
              <div className="p-8 rounded-3xl bg-gradient-to-br from-green-600/10 to-emerald-600/5 border border-green-500/30">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-400" />
                  </div>
                  <div>
                    <div className="font-black text-green-400 text-lg">{t("Certificate Valid ✓", "الشهادة صالحة ✓", "Shahaadadu Waa Saxan ✓")}</div>
                    <div className="text-xs text-muted-foreground">{t("This is an authentic Al-Bayaan College certificate", "هذه شهادة أصلية من كلية البيان", "Tani waa shahaadad dhab ah oo Kulliyadda Al-Bayaan")}</div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                    <Award className="w-5 h-5 text-yellow-400 shrink-0" />
                    <div>
                      <div className="text-xs text-muted-foreground">{t("Certificate ID", "معرف الشهادة", "ID-ga Shahaadada")}</div>
                      <div className="font-mono text-sm text-foreground font-bold">{result.certId}</div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { label: t("Student", "الطالب", "Ardayga"), value: result.studentName },
                      { label: t("Course", "الدورة", "Koorso"), value: result.courseName },
                      { label: t("Issued", "تاريخ الإصدار", "Bixinta"), value: result.completionDate },
                    ].map((item, i) => (
                      <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/10">
                        <div className="text-xs text-muted-foreground mb-1">{item.label}</div>
                        <div className="text-sm font-semibold text-foreground">{item.value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 rounded-3xl bg-gradient-to-br from-red-600/10 to-rose-600/5 border border-red-500/30">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center">
                    <XCircle className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <div className="font-black text-red-400 text-lg">{t("Certificate Not Found", "الشهادة غير موجودة", "Shahaadada Lama Helin")}</div>
                    <div className="text-xs text-muted-foreground">{t("This certificate ID is invalid or does not exist in our system.", "معرف الشهادة هذا غير صالح أو غير موجود في نظامنا.", "ID-ga shahaadadan waa khaldoon ama kuma jirto nidaamkeenna.")}</div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-8 p-6 rounded-2xl bg-card/50 border border-border text-center"
        >
          <p className="text-xs text-muted-foreground">
            {t(
              "Al-Bayaan College certificates are permanently stored and verifiable. For support contact us.",
              "شهادات كلية البيان مخزنة بشكل دائم وقابلة للتحقق. للدعم تواصل معنا.",
              "Shahaadooyinka Kulliyadda Al-Bayaan waa la kaydiyay oo la xaqiijin karaa weligood."
            )}
          </p>
        </motion.div>
      </div>
    </div>
  );
}
