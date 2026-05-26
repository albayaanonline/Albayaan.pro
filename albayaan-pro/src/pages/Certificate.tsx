import { useRef, useState } from "react";
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useGetCourses, useGetUserProgress } from "@/lib/api-client";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { Download, Shield, CheckCircle, ArrowLeft, Loader2, Share2 } from "lucide-react";

function generateCertId(userId: string, courseId: string): string {
  let hash = 0;
  const str = (userId + courseId + "albayaan").toUpperCase();
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).toUpperCase().padStart(8, "0");
  return `ALBAYAAN-${hex.slice(0, 4)}-${hex.slice(4, 8)}-${new Date().getFullYear()}`;
}

export default function Certificate() {
  const { courseId } = useParams<{ courseId: string }>();
  const { user } = useAuth();
  const { language } = useLanguage();
  const { data: courses } = useGetCourses();
  const { data: progress } = useGetUserProgress();
  const certRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  const course = courses?.find((c: any) => String(c.id) === String(courseId));
  const courseProgress = (progress as any[])?.find((p: any) => String(p.courseId) === String(courseId));
  const isCompleted = (courseProgress?.percentComplete ?? 0) >= 100;

  const certId = user
    ? generateCertId(user.email || String(user.id) || "user", courseId || "")
    : "ALBAYAAN-XXXX-XXXX-2026";

  const completionDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const courseTitle =
    language === "ar" ? course?.titleAr : language === "so" ? course?.titleSo : course?.title;

  const downloadPDF = async () => {
    if (!certRef.current) return;
    setDownloading(true);
    try {
      const html2canvas = (await import("html2canvas")).default;
      const { jsPDF } = await import("jspdf");
      const canvas = await html2canvas(certRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#020817",
        logging: false,
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      const w = pdf.internal.pageSize.getWidth();
      const h = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, "PNG", 0, 0, w, h);
      pdf.save(`Albayaan-Certificate-${certId}.pdf`);
    } finally {
      setDownloading(false);
    }
  };

  const shareCertId = () => {
    navigator.clipboard.writeText(`https://albayaan.pro/verify/${certId}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!course || !isCompleted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-sm"
        >
          <div className="w-20 h-20 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-5">
            <Shield className="w-10 h-10 text-blue-400" />
          </div>
          <h2 className="text-2xl font-black text-foreground mb-2">Certificate Not Available</h2>
          <p className="text-muted-foreground mb-6 text-sm">
            Complete 100% of the course to unlock your Al-Bayaan College certificate.
          </p>
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold hover:opacity-90 transition-opacity"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-5xl mx-auto">

        {/* Action bar */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8 flex-wrap gap-3"
        >
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <button
              onClick={shareCertId}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-border text-sm text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all"
            >
              <Share2 className="w-4 h-4" />
              {copied ? "Link Copied!" : "Share"}
            </button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={downloadPDF}
              disabled={downloading}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
            >
              {downloading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Generating…</>
              ) : (
                <><Download className="w-4 h-4" /> Download PDF</>
              )}
            </motion.button>
          </div>
        </motion.div>

        {/* Certificate card — horizontally scrollable on small screens */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.34, 1.2, 0.64, 1] }}
          className="overflow-x-auto -mx-4 px-4"
        >
          <div style={{ minWidth: "480px" }}>
          <div
            ref={certRef}
            className="relative w-full overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #020817 0%, #0a1628 45%, #0d1f3c 100%)",
              aspectRatio: "1.414 / 1",
              boxShadow: "0 0 120px rgba(59,130,246,0.25), 0 0 40px rgba(59,130,246,0.1)",
              borderRadius: "24px",
            }}
          >
            {/* Decorative borders */}
            <div className="absolute inset-3 pointer-events-none" style={{ border: "1px solid rgba(59,130,246,0.35)", borderRadius: "16px" }} />
            <div className="absolute inset-[18px] pointer-events-none" style={{ border: "1px solid rgba(59,130,246,0.15)", borderRadius: "12px" }} />

            {/* Corner ornaments */}
            <div className="absolute top-6 left-6 w-10 h-10 pointer-events-none" style={{ borderTop: "2px solid rgba(59,130,246,0.5)", borderLeft: "2px solid rgba(59,130,246,0.5)", borderRadius: "4px 0 0 0" }} />
            <div className="absolute top-6 right-6 w-10 h-10 pointer-events-none" style={{ borderTop: "2px solid rgba(59,130,246,0.5)", borderRight: "2px solid rgba(59,130,246,0.5)", borderRadius: "0 4px 0 0" }} />
            <div className="absolute bottom-6 left-6 w-10 h-10 pointer-events-none" style={{ borderBottom: "2px solid rgba(59,130,246,0.5)", borderLeft: "2px solid rgba(59,130,246,0.5)", borderRadius: "0 0 0 4px" }} />
            <div className="absolute bottom-6 right-6 w-10 h-10 pointer-events-none" style={{ borderBottom: "2px solid rgba(59,130,246,0.5)", borderRight: "2px solid rgba(59,130,246,0.5)", borderRadius: "0 0 4px 0" }} />

            {/* Ambient glow blobs */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] pointer-events-none" style={{ background: "radial-gradient(ellipse, rgba(59,130,246,0.08) 0%, transparent 70%)" }} />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] pointer-events-none" style={{ background: "radial-gradient(ellipse, rgba(139,92,246,0.06) 0%, transparent 70%)" }} />

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-between h-full p-8 sm:p-12 text-center">

              {/* Top section */}
              <div className="flex flex-col items-center">
                <img
                  src="/logo-96.png"
                  alt="Al-Bayaan College"
                  className="h-16 w-16 sm:h-20 sm:w-20 object-contain mb-3"
                  style={{ filter: "drop-shadow(0 0 24px rgba(59,130,246,0.9)) drop-shadow(0 0 8px rgba(147,197,253,0.5))" }}
                />
                <div style={{ color: "rgba(147,197,253,0.7)", fontSize: "10px", letterSpacing: "0.3em", textTransform: "uppercase", fontWeight: 600 }}>
                  Al-Bayaan College &nbsp;·&nbsp; Albayaan.pro
                </div>
              </div>

              {/* Middle — main certificate body */}
              <div className="flex flex-col items-center gap-2 sm:gap-3 flex-1 justify-center">
                <div style={{ color: "rgba(96,165,250,0.6)", fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase", fontWeight: 600 }}>
                  Certificate of Completion
                </div>
                <div className="w-20 sm:w-28" style={{ height: "1px", background: "linear-gradient(to right, transparent, rgba(96,165,250,0.5), transparent)" }} />

                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "12px", fontStyle: "italic" }}>
                  This is to certify that
                </p>

                <div
                  style={{
                    fontSize: "clamp(22px, 5vw, 44px)",
                    fontWeight: 900,
                    fontFamily: "Georgia, 'Times New Roman', serif",
                    background: "linear-gradient(135deg, #93c5fd, #ffffff, #c4b5fd)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    letterSpacing: "-0.5px",
                    lineHeight: 1.1,
                  }}
                >
                  {user?.name || "Student Name"}
                </div>

                <div className="w-24 sm:w-36" style={{ height: "1px", background: "linear-gradient(to right, transparent, rgba(255,255,255,0.25), transparent)" }} />

                <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "12px", fontStyle: "italic" }}>
                  has successfully completed the course
                </p>

                <div
                  style={{
                    fontSize: "clamp(14px, 2.5vw, 22px)",
                    fontWeight: 700,
                    background: "linear-gradient(135deg, #60a5fa, #a78bfa)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    maxWidth: "480px",
                    lineHeight: 1.3,
                  }}
                >
                  {courseTitle}
                </div>
              </div>

              {/* Bottom section */}
              <div className="w-full">
                {/* Signature row */}
                <div className="flex items-end justify-between w-full max-w-lg mx-auto mb-4">
                  <div className="text-center">
                    <div className="w-24 sm:w-32" style={{ height: "1px", background: "rgba(255,255,255,0.2)", marginBottom: "4px" }} />
                    <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "10px" }}>Date Issued</div>
                    <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "10px", marginTop: "2px" }}>{completionDate}</div>
                  </div>

                  <div className="flex flex-col items-center gap-1">
                    <CheckCircle
                      style={{
                        width: "32px",
                        height: "32px",
                        color: "#60a5fa",
                        filter: "drop-shadow(0 0 10px rgba(59,130,246,0.9))",
                      }}
                    />
                    <div style={{ color: "rgba(96,165,250,0.5)", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase" }}>Verified</div>
                  </div>

                  <div className="text-center">
                    <div className="w-24 sm:w-32" style={{ height: "1px", background: "rgba(255,255,255,0.2)", marginBottom: "4px" }} />
                    <div style={{ color: "rgba(255,255,255,0.35)", fontSize: "10px" }}>Director</div>
                    <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "10px", marginTop: "2px" }}>Al-Bayaan College</div>
                  </div>
                </div>

                {/* Certificate ID */}
                <div
                  className="inline-flex items-center gap-2 px-3 py-1"
                  style={{
                    background: "rgba(59,130,246,0.08)",
                    border: "1px solid rgba(59,130,246,0.2)",
                    borderRadius: "999px",
                  }}
                >
                  <span style={{ color: "rgba(96,165,250,0.6)", fontSize: "9px", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "monospace" }}>
                    ID: {certId}
                  </span>
                </div>
              </div>
            </div>
          </div>
          </div>
        </motion.div>

        {/* Verification info card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-5 p-4 rounded-2xl bg-card border border-border flex items-center justify-between flex-wrap gap-2"
        >
          <p className="text-sm text-muted-foreground">
            Verify this certificate at{" "}
            <span className="text-primary font-mono text-xs">albayaan.pro/verify/{certId}</span>
          </p>
          <button
            onClick={shareCertId}
            className="text-xs text-primary hover:text-primary/80 transition-colors font-medium"
          >
            {copied ? "✓ Copied!" : "Copy verification link"}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
