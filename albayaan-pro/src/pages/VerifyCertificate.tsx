import { useState } from "react";
import { useParams, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useVerifyCertificateById } from "@/lib/api-client/admin-hooks";
import { Shield, CheckCircle, XCircle, Loader2, Search, ArrowLeft, Award } from "lucide-react";

function CertificateDisplay({ cert }: { cert: { certId: string; studentName: string; courseName: string; issuedAt: string } }) {
  const issued = new Date(cert.issuedAt).toLocaleDateString("en-US", {
    year: "numeric", month: "long", day: "numeric",
  });

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="p-6 rounded-3xl border border-green-500/30 bg-green-500/5"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-green-500/10 border border-green-500/20 flex items-center justify-center">
          <CheckCircle className="w-6 h-6 text-green-400" />
        </div>
        <div>
          <h3 className="font-bold text-green-400">Certificate Verified</h3>
          <p className="text-sm text-muted-foreground">This is an authentic Al-Bayaan College certificate</p>
        </div>
      </div>

      <div className="space-y-4">
        <div className="p-4 rounded-2xl bg-card border border-white/10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Student Name</p>
              <p className="font-bold text-white text-lg" style={{ fontFamily: "Georgia, serif" }}>{cert.studentName}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Course Completed</p>
              <p className="font-semibold text-foreground">{cert.courseName}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Date Issued</p>
              <p className="text-foreground">{issued}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wider">Certificate ID</p>
              <p className="font-mono text-xs text-primary tracking-widest">{cert.certId}</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
          <Shield className="w-4 h-4 text-blue-400 shrink-0" />
          <p className="text-xs text-blue-300">Issued by Al-Bayaan College · albayaan.pro</p>
        </div>
      </div>
    </motion.div>
  );
}

function ManualSearch() {
  const [input, setInput] = useState("");
  const [searchId, setSearchId] = useState<string | null>(null);
  const { data: cert, isLoading, isError } = useVerifyCertificateById(searchId);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim().toUpperCase();
    if (trimmed) setSearchId(trimmed);
  };

  return (
    <div className="space-y-5">
      <form onSubmit={handleSearch} className="flex gap-3">
        <input
          value={input}
          onChange={e => setInput(e.target.value.toUpperCase())}
          placeholder="ALBAYAAN-XXXX-XXXX-2026"
          className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/30 transition-all text-sm font-mono"
        />
        <button
          type="submit"
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-sm hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all whitespace-nowrap"
        >
          <Search className="w-4 h-4" /> Verify
        </button>
      </form>

      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-3 p-4 rounded-xl bg-card border border-white/10">
            <Loader2 className="w-5 h-5 animate-spin text-primary" />
            <span className="text-muted-foreground text-sm">Verifying certificate...</span>
          </motion.div>
        )}

        {isError && searchId && !isLoading && (
          <motion.div key="error" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
            <XCircle className="w-5 h-5 text-red-400 shrink-0" />
            <div>
              <p className="text-red-400 font-medium text-sm">Certificate Not Found</p>
              <p className="text-muted-foreground text-xs mt-0.5">No certificate with ID <span className="font-mono">{searchId}</span> exists in our records.</p>
            </div>
          </motion.div>
        )}

        {cert && !isLoading && (
          <CertificateDisplay key="cert" cert={cert} />
        )}
      </AnimatePresence>
    </div>
  );
}

export default function VerifyCertificate() {
  const { certId: urlCertId } = useParams<{ certId?: string }>();
  const { data: cert, isLoading, isError } = useVerifyCertificateById(urlCertId || null);

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>

          <div className="flex items-center gap-4 mb-2">
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Award className="w-7 h-7 text-blue-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-white">Certificate Verification</h1>
              <p className="text-muted-foreground text-sm">Al-Bayaan College · albayaan.pro</p>
            </div>
          </div>
          <p className="text-muted-foreground text-sm mt-3">
            Verify the authenticity of any Al-Bayaan College certificate using its unique ID.
          </p>
        </motion.div>

        {/* If URL has a certId, show lookup result directly */}
        {urlCertId ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {isLoading && (
              <div className="flex items-center gap-3 p-6 rounded-2xl bg-card border border-white/10">
                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                <span className="text-muted-foreground">Looking up certificate <span className="font-mono text-xs">{urlCertId}</span>…</span>
              </div>
            )}

            {isError && !isLoading && (
              <div className="p-6 rounded-2xl bg-red-500/10 border border-red-500/20">
                <div className="flex items-center gap-3 mb-3">
                  <XCircle className="w-6 h-6 text-red-400" />
                  <h3 className="font-bold text-red-400">Certificate Not Found</h3>
                </div>
                <p className="text-muted-foreground text-sm">
                  No certificate with ID <span className="font-mono text-xs text-foreground">{urlCertId}</span> exists in our records.
                  It may have been issued before the verification system was active or the ID may be incorrect.
                </p>
              </div>
            )}

            {cert && !isLoading && <CertificateDisplay cert={cert} />}

            <div className="mt-6 pt-6 border-t border-white/10">
              <p className="text-sm text-muted-foreground mb-4">Verify a different certificate:</p>
              <ManualSearch />
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="p-6 rounded-2xl bg-card border border-white/10">
              <h2 className="font-semibold text-white mb-1 flex items-center gap-2">
                <Shield className="w-4 h-4 text-blue-400" /> Enter Certificate ID
              </h2>
              <p className="text-muted-foreground text-sm mb-5">
                The certificate ID is found at the bottom of any Al-Bayaan College certificate.
              </p>
              <ManualSearch />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
