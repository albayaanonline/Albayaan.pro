import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/contexts/AuthContext";
import { adminFetch } from "@/lib/adminFetch";
import {
  Lock, Eye, EyeOff, CheckCircle, AlertTriangle, Loader2,
  Shield, User, Mail, Calendar, Key, Save,
} from "lucide-react";

function PasswordInput({
  label, value, onChange, placeholder, id,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; id: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-gray-300 mb-1.5">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder ?? "••••••••"}
          autoComplete="new-password"
          className="w-full px-4 py-2.5 pr-11 rounded-xl bg-white/5 border border-white/10 text-white
            placeholder-gray-600 focus:outline-none focus:border-primary/60 focus:ring-1
            focus:ring-primary/30 transition-all text-sm"
        />
        <button
          type="button"
          onClick={() => setShow(s => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
        >
          {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

function StrengthBar({ password }: { password: string }) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;
  const labels = ["", "Weak", "Fair", "Strong", "Very Strong"];
  const colors = ["", "bg-red-500", "bg-yellow-500", "bg-blue-500", "bg-green-500"];
  const textColors = ["", "text-red-400", "text-yellow-400", "text-blue-400", "text-green-400"];

  if (!password) return null;
  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3, 4].map(i => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
              i <= score ? colors[score] : "bg-white/10"
            }`}
          />
        ))}
      </div>
      <p className={`text-xs font-medium ${textColors[score]}`}>{labels[score]}</p>
    </div>
  );
}

export default function AdminSettings() {
  const { user } = useAuth();

  const [currentPw, setCurrentPw]   = useState("");
  const [newPw, setNewPw]           = useState("");
  const [confirmPw, setConfirmPw]   = useState("");
  const [loading, setLoading]       = useState(false);
  const [success, setSuccess]       = useState(false);
  const [error, setError]           = useState("");

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!currentPw) { setError("Please enter your current password."); return; }
    if (newPw.length < 8) { setError("New password must be at least 8 characters."); return; }
    if (newPw !== confirmPw) { setError("New passwords do not match."); return; }
    if (newPw === currentPw) { setError("New password must be different from your current password."); return; }

    setLoading(true);
    try {
      const res = await adminFetch("/api/admin/change-password", {
        method: "POST",
        body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to change password.");
        return;
      }
      setSuccess(true);
      setCurrentPw("");
      setNewPw("");
      setConfirmPw("");
      setTimeout(() => setSuccess(false), 5000);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const joinedDate = user?.id
    ? new Date().toLocaleDateString("en-US", { year: "numeric", month: "long" })
    : "—";

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-black text-white mb-1 flex items-center gap-2">
          <Shield className="w-6 h-6 text-purple-400" />
          Admin Settings
        </h1>
        <p className="text-sm text-muted-foreground">Manage your admin account and security preferences.</p>
      </motion.div>

      {/* Account info card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="p-6 rounded-2xl bg-card border border-white/10 space-y-4"
      >
        <h2 className="font-bold text-white text-sm uppercase tracking-widest text-muted-foreground mb-4">
          Account Information
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { icon: User,     label: "Full Name",   value: user?.name  || "—" },
            { icon: Mail,     label: "Email",        value: user?.email || "—" },
            { icon: Shield,   label: "Role",         value: "Administrator" },
            { icon: Calendar, label: "Member Since", value: joinedDate },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-start gap-3 p-3 rounded-xl bg-white/3 border border-white/5">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <div className="min-w-0">
                <div className="text-xs text-muted-foreground mb-0.5">{label}</div>
                <div className="text-sm font-semibold text-white truncate">{value}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Change password card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="p-6 rounded-2xl bg-card border border-white/10"
      >
        <div className="flex items-center gap-2.5 mb-6">
          <div className="w-9 h-9 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
            <Key className="w-4 h-4 text-purple-400" />
          </div>
          <div>
            <h2 className="font-bold text-white text-base">Change Password</h2>
            <p className="text-xs text-muted-foreground">Update your admin account password.</p>
          </div>
        </div>

        {success && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-2.5 p-3 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm mb-5"
          >
            <CheckCircle className="w-4 h-4 shrink-0" />
            <span className="font-medium">Password changed successfully!</span>
          </motion.div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="flex items-start gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-5"
          >
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{error}</span>
          </motion.div>
        )}

        <form onSubmit={handleChangePassword} className="space-y-4">
          <PasswordInput
            id="current-pw"
            label="Current Password"
            value={currentPw}
            onChange={v => { setCurrentPw(v); setError(""); }}
            placeholder="Enter your current password"
          />

          <div>
            <PasswordInput
              id="new-pw"
              label="New Password"
              value={newPw}
              onChange={v => { setNewPw(v); setError(""); }}
              placeholder="At least 8 characters"
            />
            <StrengthBar password={newPw} />
          </div>

          <PasswordInput
            id="confirm-pw"
            label="Confirm New Password"
            value={confirmPw}
            onChange={v => { setConfirmPw(v); setError(""); }}
            placeholder="Repeat new password"
          />

          {confirmPw && newPw && confirmPw !== newPw && (
            <p className="text-xs text-red-400 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Passwords do not match
            </p>
          )}
          {confirmPw && newPw && confirmPw === newPw && newPw.length >= 8 && (
            <p className="text-xs text-green-400 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" /> Passwords match
            </p>
          )}

          <div className="pt-2">
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-600
                text-white font-bold text-sm hover:shadow-[0_0_20px_rgba(139,92,246,0.4)]
                transition-all disabled:opacity-50"
            >
              {loading
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Updating…</>
                : <><Save className="w-4 h-4" /> Update Password</>
              }
            </motion.button>
          </div>
        </form>

        {/* Tips */}
        <div className="mt-6 pt-5 border-t border-white/5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Password Requirements
          </p>
          <ul className="space-y-1.5">
            {[
              { check: newPw.length >= 8,           text: "At least 8 characters" },
              { check: /[A-Z]/.test(newPw),         text: "At least one uppercase letter" },
              { check: /[0-9]/.test(newPw),         text: "At least one number" },
              { check: /[^A-Za-z0-9]/.test(newPw), text: "At least one special character" },
            ].map(({ check, text }) => (
              <li key={text} className={`flex items-center gap-2 text-xs transition-colors ${
                newPw ? (check ? "text-green-400" : "text-muted-foreground") : "text-muted-foreground"
              }`}>
                <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                  newPw && check
                    ? "bg-green-500/20 border-green-500/40"
                    : "border-white/10"
                }`}>
                  {newPw && check && <CheckCircle className="w-2.5 h-2.5" />}
                </div>
                {text}
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* Security notice */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
        className="flex items-start gap-3 p-4 rounded-2xl bg-blue-500/5 border border-blue-500/15"
      >
        <Lock className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          After changing your password, you will need to use the new password on your next login.
          Make sure to store it in a safe place.
        </p>
      </motion.div>

    </div>
  );
}
