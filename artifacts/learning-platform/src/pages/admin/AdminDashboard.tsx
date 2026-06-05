
import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "wouter";
import {
  useGetAdminStats, useGetAdminUsers, useGetAdminPayments,
  useGetAdminCodes, useConfirmPayment, useCreateCode, useDeactivateCode
} from "@/lib/api-client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { adminFetch } from "@/lib/adminFetch";
import { FileUploader } from "@/components/admin/FileUploader";
import { MediaUrlInput } from "@/components/admin/MediaUrlInput";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import {
  Users, BookOpen, CreditCard, Key, CheckCircle, XCircle, Loader2,
  Plus, TrendingUp, Clock, Search, Edit2, Trash2, Eye, BarChart2,
  Upload, Globe, Shield, Star, ChevronDown, ChevronUp, Save, X, Award, Download, RefreshCw,
  AlertTriangle, UserX, Radio, EyeOff, Settings, Video, FileText, Lock, Unlock,
  Image as ImageIcon, Link as LinkIcon, Play, Send, ChevronRight, Hash,
  Copy, CheckSquare
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

type AdminTab = "overview" | "courses" | "users" | "payments" | "codes" | "analytics" | "certificates" | "content";

const PATH_TO_TAB: Record<string, AdminTab> = {
  "/management-portal":              "overview",
  "/management-portal/courses":      "courses",
  "/management-portal/users":        "users",
  "/management-portal/payments":     "payments",
  "/management-portal/codes":        "codes",
  "/management-portal/analytics":    "analytics",
  "/management-portal/certificates": "certificates",
  "/management-portal/content":      "content",
};

interface CourseFormData {
  title: string; titleAr: string; titleSo: string;
  language: "english" | "arabic" | "multilingual";
  level: "beginner" | "intermediate" | "advanced";
  price: number;
  duration: string;
  description: string;
  descriptionAr: string;
  descriptionSo: string;
  thumbnailUrl: string;
}

interface LessonFormData {
  title: string; titleAr: string;
  content: string; contentAr: string;
  videoUrl: string;
  duration: string;
  isLocked: boolean;
  order: number;
}

const DEFAULT_COURSE: CourseFormData = {
  title: "", titleAr: "", titleSo: "", language: "english", level: "beginner",
  price: 15, duration: "8 weeks", description: "", descriptionAr: "", descriptionSo: "", thumbnailUrl: "",
};

const DEFAULT_LESSON: LessonFormData = {
  title: "", titleAr: "", content: "", contentAr: "", videoUrl: "", duration: "10 min", isLocked: true, order: 1,
};

// ─── Helpers ───────────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-400 mb-1.5 uppercase tracking-wide">{label}</label>
      {children}
    </div>
  );
}

const inp = "w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-primary/50 text-sm transition-colors";
const sel = inp + " cursor-pointer";

function toast(msg: string, type: "ok" | "err" = "ok") {
  const el = document.createElement("div");
  el.className = `fixed bottom-6 right-6 z-[9999] px-4 py-3 rounded-xl text-sm font-medium shadow-2xl transition-all ${
    type === "ok" ? "bg-green-600 text-white" : "bg-red-600 text-white"
  }`;
  el.textContent = msg;
  document.body.appendChild(el);
  setTimeout(() => { el.style.opacity = "0"; setTimeout(() => el.remove(), 300); }, 2500);
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).catch(() => {});
  toast("Copied to clipboard");
}

// ─── StatCard ──────────────────────────────────────────────────────────────

function StatCard({ icon: Icon, label, value, color, bg }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="p-5 rounded-2xl bg-card border border-white/10">
      <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div className="text-2xl font-black text-white">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </motion.div>
  );
}

// ─── CourseForm ────────────────────────────────────────────────────────────

function CourseForm({ initial, onSave, onCancel, saving }: {
  initial?: Partial<CourseFormData>;
  onSave: (d: CourseFormData) => void;
  onCancel: () => void;
  saving?: boolean;
}) {
  const [form, setForm] = useState<CourseFormData>({ ...DEFAULT_COURSE, ...initial });
  const set = (k: keyof CourseFormData, v: any) => setForm(f => ({ ...f, [k]: v }));

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="p-6 rounded-2xl bg-card border border-primary/30 space-y-4">
      <h4 className="text-sm font-bold text-white uppercase tracking-widest text-primary/80 mb-1">
        {initial?.title ? "Edit Course" : "New Course"}
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Field label="Title (English) *">
          <input value={form.title} onChange={e => set("title", e.target.value)} className={inp} placeholder="Course title in English" />
        </Field>
        <Field label="Title (Arabic)">
          <input value={form.titleAr} onChange={e => set("titleAr", e.target.value)} dir="rtl" className={inp} placeholder="عنوان الدورة بالعربية" />
        </Field>
        <Field label="Language">
          <select value={form.language} onChange={e => set("language", e.target.value as any)} className={sel}>
            <option value="english">🇬🇧 English</option>
            <option value="arabic">🇸🇦 Arabic</option>
            <option value="multilingual">🌐 Multilingual</option>
          </select>
        </Field>
        <Field label="Level">
          <select value={form.level} onChange={e => set("level", e.target.value as any)} className={sel}>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </Field>
        <Field label="Price ($)">
          <input type="number" value={form.price} onChange={e => set("price", Number(e.target.value))} min={0} className={inp} />
        </Field>
        <Field label="Duration">
          <input value={form.duration} onChange={e => set("duration", e.target.value)} className={inp} placeholder="e.g. 8 weeks" />
        </Field>
      </div>

      <Field label="Thumbnail Image — URL or Upload">
        <MediaUrlInput
          value={form.thumbnailUrl}
          onChange={v => set("thumbnailUrl", v)}
          type="image"
          placeholder="https://example.com/thumbnail.jpg"
        />
      </Field>

      <Field label="Description (English)">
        <textarea value={form.description} onChange={e => set("description", e.target.value)} rows={3} className={inp + " resize-none"} placeholder="Course description..." />
      </Field>
      <Field label="Description (Arabic)">
        <textarea value={form.descriptionAr} onChange={e => set("descriptionAr", e.target.value)} rows={3} dir="rtl" className={inp + " resize-none"} placeholder="وصف الدورة..." />
      </Field>

      <div className="flex gap-3 pt-2">
        <button onClick={() => { if (!form.title) { toast("Title is required", "err"); return; } onSave(form); }}
          disabled={saving}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-sm hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all disabled:opacity-50">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Course
        </button>
        <button onClick={onCancel} className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-muted-foreground font-medium text-sm hover:bg-white/10 transition-all">
          <X className="w-4 h-4" /> Cancel
        </button>
      </div>
    </motion.div>
  );
}

// ─── LessonForm ────────────────────────────────────────────────────────────

function LessonForm({ initial, onSave, onCancel, saving }: {
  initial?: Partial<LessonFormData>;
  onSave: (d: LessonFormData) => void;
  onCancel: () => void;
  saving?: boolean;
}) {
  const [form, setForm] = useState<LessonFormData>({ ...DEFAULT_LESSON, ...initial });
  const set = (k: keyof LessonFormData, v: any) => setForm(f => ({ ...f, [k]: v }));

  return (
    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden">
      <div className="p-4 mt-3 rounded-xl bg-white/3 border border-blue-500/20 space-y-3">
        <h5 className="text-xs font-bold text-blue-400 uppercase tracking-widest">
          {initial?.title ? "Edit Lesson" : "New Lesson"}
        </h5>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Title (English) *">
            <input value={form.title} onChange={e => set("title", e.target.value)} className={inp} placeholder="Lesson title" />
          </Field>
          <Field label="Title (Arabic)">
            <input value={form.titleAr} onChange={e => set("titleAr", e.target.value)} dir="rtl" className={inp} placeholder="عنوان الدرس" />
          </Field>
          <Field label="Duration">
            <input value={form.duration} onChange={e => set("duration", e.target.value)} className={inp} placeholder="e.g. 15 min" />
          </Field>
          <Field label="Order">
            <input type="number" value={form.order} onChange={e => set("order", Number(e.target.value))} min={1} className={inp} />
          </Field>
        </div>

        <Field label="Video — URL or Upload">
          <MediaUrlInput
            value={form.videoUrl}
            onChange={v => set("videoUrl", v)}
            type="video"
            placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
          />
        </Field>

        <Field label="Content / Notes (Markdown supported)">
          <textarea value={form.content} onChange={e => set("content", e.target.value)} rows={4}
            className={inp + " resize-y font-mono text-xs"} placeholder="# Lesson Title&#10;&#10;Write lesson content here (Markdown)..." />
        </Field>
        <Field label="Content (Arabic)">
          <textarea value={form.contentAr} onChange={e => set("contentAr", e.target.value)} rows={3} dir="rtl"
            className={inp + " resize-y font-mono text-xs"} placeholder="محتوى الدرس..." />
        </Field>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => set("isLocked", !form.isLocked)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              form.isLocked
                ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                : "bg-green-500/10 text-green-400 border-green-500/20"
            }`}
          >
            {form.isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
            {form.isLocked ? "Locked (requires access)" : "Free / Unlocked"}
          </button>
        </div>

        <div className="flex gap-2 pt-1">
          <button onClick={() => { if (!form.title) { toast("Title is required", "err"); return; } onSave(form); }}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-xs hover:opacity-90 transition-opacity disabled:opacity-50">
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />} Save Lesson
          </button>
          <button onClick={onCancel} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-muted-foreground text-xs font-medium hover:bg-white/10 transition-all">
            <X className="w-3.5 h-3.5" /> Cancel
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── LessonManagerSection ──────────────────────────────────────────────────

function LessonManagerSection({ courseId, courseName }: { courseId: number; courseName: string }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [savingLesson, setSavingLesson] = useState(false);

  const { data: lessonsData, refetch } = useQuery({
    queryKey: ["admin-lessons", courseId],
    queryFn: async () => {
      const res = await adminFetch(`/api/admin/courses/${courseId}/lessons`);
      if (!res.ok) return [];
      return res.json();
    },
  });
  const lessons: any[] = lessonsData ?? [];

  const handleAddLesson = async (data: LessonFormData) => {
    setSavingLesson(true);
    try {
      const res = await adminFetch(`/api/admin/courses/${courseId}/lessons`, {
        method: "POST",
        body: JSON.stringify({ ...data, videoUrl: data.videoUrl || null }),
      });
      if (!res.ok) { const e = await res.json(); toast(e.error || "Failed to add lesson", "err"); return; }
      toast("Lesson added");
      setShowAddForm(false);
      refetch();
    } catch { toast("Network error", "err"); } finally { setSavingLesson(false); }
  };

  const handleEditLesson = async (lessonId: number, data: LessonFormData) => {
    setSavingLesson(true);
    try {
      const res = await adminFetch(`/api/admin/lessons/${lessonId}`, {
        method: "PUT",
        body: JSON.stringify({ ...data, videoUrl: data.videoUrl || null }),
      });
      if (!res.ok) { const e = await res.json(); toast(e.error || "Failed to update lesson", "err"); return; }
      toast("Lesson updated");
      setEditingId(null);
      refetch();
    } catch { toast("Network error", "err"); } finally { setSavingLesson(false); }
  };

  const handleDeleteLesson = async (lessonId: number) => {
    try {
      const res = await adminFetch(`/api/admin/lessons/${lessonId}`, { method: "DELETE" });
      if (!res.ok) { toast("Failed to delete lesson", "err"); return; }
      toast("Lesson deleted");
      setDeletingId(null);
      refetch();
    } catch { toast("Network error", "err"); }
  };

  return (
    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
      className="overflow-hidden">
      <div className="mt-4 border-t border-white/5 pt-4">
        <div className="flex items-center justify-between mb-3">
          <h5 className="text-sm font-semibold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-400" />
            Lessons
            <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold">{lessons.length}</span>
          </h5>
          <button
            onClick={() => { setShowAddForm(v => !v); setEditingId(null); }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium hover:bg-blue-500/20 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add Lesson
          </button>
        </div>

        <AnimatePresence>
          {showAddForm && (
            <LessonForm
              initial={{ order: lessons.length + 1 }}
              onSave={handleAddLesson}
              onCancel={() => setShowAddForm(false)}
              saving={savingLesson}
            />
          )}
        </AnimatePresence>

        {lessons.length === 0 && !showAddForm && (
          <div className="text-center py-6">
            <BookOpen className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-30" />
            <p className="text-muted-foreground text-xs">No lessons yet. Add your first lesson above.</p>
          </div>
        )}

        <div className="space-y-2 mt-2">
          {lessons.map((lesson: any) => (
            <div key={lesson.id}>
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/8 hover:border-white/15 transition-colors group">
                <span className="w-6 h-6 rounded-lg bg-white/5 flex items-center justify-center text-xs font-mono text-muted-foreground shrink-0">
                  {lesson.order}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-white truncate">{lesson.title}</span>
                    {lesson.videoUrl && <Video className="w-3.5 h-3.5 text-blue-400 shrink-0" aria-label="Has video" />}
                    <span className={`flex items-center gap-1 text-xs px-1.5 py-0.5 rounded-full ${
                      lesson.isLocked ? "bg-yellow-500/10 text-yellow-400" : "bg-green-500/10 text-green-400"
                    }`}>
                      {lesson.isLocked ? <Lock className="w-2.5 h-2.5" /> : <Unlock className="w-2.5 h-2.5" />}
                      {lesson.isLocked ? "Locked" : "Free"}
                    </span>
                    <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                  <button
                    onClick={() => { setEditingId(editingId === lesson.id ? null : lesson.id); setShowAddForm(false); }}
                    className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"
                    title="Edit lesson"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeletingId(deletingId === lesson.id ? null : lesson.id)}
                    className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                    title="Delete lesson"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <AnimatePresence>
                {editingId === lesson.id && (
                  <LessonForm
                    initial={{ title: lesson.title, titleAr: lesson.titleAr, content: lesson.content, contentAr: lesson.contentAr, videoUrl: lesson.videoUrl || "", duration: lesson.duration, isLocked: lesson.isLocked, order: lesson.order }}
                    onSave={data => handleEditLesson(lesson.id, data)}
                    onCancel={() => setEditingId(null)}
                    saving={savingLesson}
                  />
                )}
                {deletingId === lesson.id && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="mt-1 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-between gap-3">
                    <p className="text-red-300 text-xs flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      Delete "<strong>{lesson.title}</strong>"? Cannot be undone.
                    </p>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => handleDeleteLesson(lesson.id)} className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors">Delete</button>
                      <button onClick={() => setDeletingId(null)} className="px-3 py-1.5 rounded-lg bg-white/10 text-muted-foreground text-xs hover:bg-white/20 transition-colors">Cancel</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── CertVerifyWidget ──────────────────────────────────────────────────────

function CertVerifyWidget() {
  const [inputId, setInputId] = useState("");
  const [result, setResult] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [searchId, setSearchId] = useState("");

  const handleVerify = async () => {
    const trimmed = inputId.trim().toUpperCase();
    if (!trimmed) return;
    setSearchId(trimmed);
    setIsLoading(true);
    setIsError(false);
    setResult(null);
    try {
      const res = await adminFetch(`/api/certificates/${encodeURIComponent(trimmed)}`);
      if (!res.ok) { setIsError(true); return; }
      const data = await res.json();
      setResult(data);
    } catch { setIsError(true); } finally { setIsLoading(false); }
  };

  return (
    <div className="p-6 rounded-2xl bg-card border border-white/10">
      <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
        <Shield className="w-4 h-4 text-blue-400" />
        Verify Certificate by ID
      </h4>
      <div className="flex gap-3 mb-4">
        <input
          value={inputId}
          onChange={e => setInputId(e.target.value.toUpperCase())}
          placeholder="ALBAYAAN-XXXX-XXXX"
          className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 text-sm font-mono"
          onKeyDown={e => e.key === "Enter" && handleVerify()}
        />
        <button onClick={handleVerify} disabled={isLoading}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-sm flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50">
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />} Verify
        </button>
      </div>
      {isError && searchId && !isLoading && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          <XCircle className="w-4 h-4 shrink-0" />
          Certificate <span className="font-mono text-xs ml-1">{searchId}</span> not found.
        </div>
      )}
      {result && !isLoading && (
        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 space-y-2">
          <div className="flex items-center gap-2 text-green-400 font-semibold text-sm">
            <CheckCircle className="w-4 h-4" /> Valid Certificate
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div><span className="text-muted-foreground">Student:</span> <span className="text-white ml-1">{result.studentName}</span></div>
            <div><span className="text-muted-foreground">Course:</span> <span className="text-white ml-1">{result.courseName}</span></div>
            <div><span className="text-muted-foreground">Issued:</span> <span className="text-white ml-1">{new Date(result.issuedAt).toLocaleDateString()}</span></div>
            <div><span className="text-muted-foreground">ID:</span> <span className="font-mono text-white ml-1 text-[10px]">{result.certId}</span></div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── CertificateIssueWidget ────────────────────────────────────────────────

function CertificateIssueWidget({ users, courses, onIssued }: { users: any[]; courses: any[]; onIssued: () => void }) {
  const [userId, setUserId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [courseName, setCourseName] = useState("");
  const [saving, setSaving] = useState(false);

  const handleUserChange = (uid: string) => {
    setUserId(uid);
    const u = users.find((u: any) => String(u.id) === uid);
    if (u) setStudentName(u.name || u.email);
  };

  const handleCourseChange = (cid: string) => {
    setCourseId(cid);
    const c = courses.find((c: any) => String(c.id) === cid);
    if (c) setCourseName(c.title);
  };

  const handleIssue = async () => {
    if (!userId || !courseId || !studentName || !courseName) {
      toast("Please fill all fields", "err"); return;
    }
    setSaving(true);
    try {
      const res = await adminFetch("/api/admin/certificates/issue", {
        method: "POST",
        body: JSON.stringify({ userId: Number(userId), courseId: Number(courseId), studentName, courseName }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 409) toast(`Already issued: ${data.certId}`, "err");
        else toast(data.error || "Failed to issue", "err");
        return;
      }
      toast(`Certificate issued: ${data.certId}`);
      setUserId(""); setCourseId(""); setStudentName(""); setCourseName("");
      onIssued();
    } catch { toast("Network error", "err"); } finally { setSaving(false); }
  };

  return (
    <div className="p-6 rounded-2xl bg-card border border-white/10">
      <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
        <Send className="w-4 h-4 text-yellow-400" />
        Issue Certificate Manually
      </h4>
      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Field label="Student">
            <select value={userId} onChange={e => handleUserChange(e.target.value)} className={sel}>
              <option value="">Select student...</option>
              {users.map((u: any) => (
                <option key={u.id} value={u.id}>{u.name || u.email} — {u.email}</option>
              ))}
            </select>
          </Field>
          <Field label="Course">
            <select value={courseId} onChange={e => handleCourseChange(e.target.value)} className={sel}>
              <option value="">Select course...</option>
              {courses.map((c: any) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </Field>
          <Field label="Student Name (on certificate)">
            <input value={studentName} onChange={e => setStudentName(e.target.value)} className={inp} placeholder="Full name as shown on certificate" />
          </Field>
          <Field label="Course Name (on certificate)">
            <input value={courseName} onChange={e => setCourseName(e.target.value)} className={inp} placeholder="Course name as shown on certificate" />
          </Field>
        </div>
        <button onClick={handleIssue} disabled={saving || !userId || !courseId || !studentName}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-yellow-600 to-orange-600 text-white font-bold text-sm hover:opacity-90 transition-opacity disabled:opacity-50">
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Award className="w-4 h-4" />} Issue Certificate
        </button>
      </div>
    </div>
  );
}

// ─── AdminDashboard ────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const { t } = useLanguage();
  const [location] = useLocation();
  const queryClient = useQueryClient();

  const initialTab: AdminTab = PATH_TO_TAB[location] ?? "overview";
  const [tab, setTab] = useState<AdminTab>(initialTab);

  useEffect(() => {
    const mapped = PATH_TO_TAB[location];
    if (mapped) setTab(mapped);
  }, [location]);

  const [courseSearch, setCourseSearch] = useState("");
  const [showAddCourseForm, setShowAddCourseForm] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<number | null>(null);
  const [deletingCourse, setDeletingCourse] = useState<number | null>(null);
  const [expandedCourse, setExpandedCourse] = useState<number | null>(null);
  const [togglingPublish, setTogglingPublish] = useState<number | null>(null);
  const [savingCourse, setSavingCourse] = useState(false);

  const [userSearch, setUserSearch] = useState("");
  const [deletingUser, setDeletingUser] = useState<number | null>(null);

  const [paymentFilter, setPaymentFilter] = useState<"all" | "pending" | "confirmed" | "rejected">("all");
  const [newCodeCourseId, setNewCodeCourseId] = useState("");

  const { data: stats } = useGetAdminStats();
  const { data: users, refetch: refetchUsers } = useGetAdminUsers();
  const { data: payments, refetch: refetchPayments } = useGetAdminPayments();
  const { data: codes, refetch: refetchCodes } = useGetAdminCodes();

  const { mutate: confirmPayment, isPending: confirmingPayment } = useConfirmPayment({
    mutation: { onSuccess: () => { refetchPayments(); toast("Payment confirmed"); } },
  });
  const { mutate: createCode, isPending: creatingCode } = useCreateCode({
    mutation: { onSuccess: () => { refetchCodes(); toast("Access code generated"); } },
  });
  const { mutate: deactivateCode } = useDeactivateCode({
    mutation: { onSuccess: () => { refetchCodes(); toast("Code deactivated"); } },
  });

  const { data: adminCoursesData, refetch: refetchCourses } = useQuery({
    queryKey: ["admin-courses"],
    queryFn: async () => {
      const res = await adminFetch("/api/admin/courses");
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    },
  });
  const apiCourses: any[] = Array.isArray(adminCoursesData) ? adminCoursesData : [];

  const { data: adminCertsData, refetch: refetchCerts } = useQuery({
    queryKey: ["admin-certificates"],
    queryFn: async () => {
      const res = await adminFetch("/api/admin/certificates");
      if (!res.ok) return [];
      const data = await res.json();
      return Array.isArray(data) ? data : [];
    },
    enabled: tab === "certificates",
  });
  const adminCerts: any[] = Array.isArray(adminCertsData) ? adminCertsData : [];

  const { data: analyticsData } = useQuery({
    queryKey: ["admin-analytics"],
    queryFn: async () => {
      const res = await adminFetch("/api/admin/analytics");
      if (!res.ok) return null;
      return res.json();
    },
    enabled: tab === "analytics",
  });

  const statsData = stats as any;
  const usersList: any[] = Array.isArray(users) ? users : [];
  const paymentsList: any[] = Array.isArray(payments) ? payments : [];
  const codesList: any[] = Array.isArray(codes) ? codes : [];

  const filteredUsers = useMemo(() => {
    if (!userSearch) return usersList;
    const q = userSearch.toLowerCase();
    return usersList.filter((u: any) => u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q));
  }, [usersList, userSearch]);

  const filteredPayments = useMemo(() => {
    if (paymentFilter === "all") return paymentsList;
    return paymentsList.filter((p: any) => p.status === paymentFilter);
  }, [paymentsList, paymentFilter]);

  const filteredCourses = useMemo(() => {
    if (!courseSearch) return apiCourses;
    const q = courseSearch.toLowerCase();
    return apiCourses.filter((c: any) =>
      (c.title ?? "").toLowerCase().includes(q) || (c.titleAr ?? "").includes(courseSearch)
    );
  }, [apiCourses, courseSearch]);

  const handleSaveCourse = async (data: CourseFormData) => {
    setSavingCourse(true);
    try {
      const method = editingCourse ? "PUT" : "POST";
      const url = editingCourse ? `/api/admin/courses/${editingCourse}` : "/api/admin/courses";
      const res = await adminFetch(url, { method, body: JSON.stringify(data) });
      if (!res.ok) { const e = await res.json(); toast(e.error || "Failed to save course", "err"); return; }
      toast(editingCourse ? "Course updated" : "Course created — publish it to show on the website");
      await refetchCourses();
      queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
    } catch { toast("Network error", "err"); } finally {
      setSavingCourse(false);
      setShowAddCourseForm(false);
      setEditingCourse(null);
    }
  };

  const handleDeleteCourse = async (id: number) => {
    try {
      const res = await adminFetch(`/api/admin/courses/${id}`, { method: "DELETE" });
      if (!res.ok) { toast("Failed to delete course", "err"); return; }
      toast("Course deleted");
      await refetchCourses();
      queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
    } catch { toast("Network error", "err"); }
    setDeletingCourse(null);
  };

  const handleTogglePublish = async (course: any) => {
    setTogglingPublish(course.id);
    try {
      const res = await adminFetch(`/api/admin/courses/${course.id}/publish`, {
        method: "PATCH",
        body: JSON.stringify({ isPublished: !course.isPublished }),
      });
      if (!res.ok) { toast("Failed to update publish status", "err"); return; }
      toast(course.isPublished ? "Course unpublished (hidden from website)" : "Course published! Now visible on website");
      await refetchCourses();
      queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
    } catch { toast("Network error", "err"); } finally { setTogglingPublish(null); }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      const res = await adminFetch(`/api/admin/users/${userId}`, { method: "DELETE" });
      if (!res.ok) { toast("Failed to delete user", "err"); return; }
      toast("User deleted");
      setDeletingUser(null);
      refetchUsers();
    } catch { toast("Network error", "err"); }
  };

  const handleToggleUserRole = async (u: any) => {
    const newRole = u.role === "admin" ? "user" : "admin";
    try {
      const res = await adminFetch(`/api/admin/users/${u.id}/role`, {
        method: "PATCH",
        body: JSON.stringify({ role: newRole }),
      });
      if (!res.ok) { toast("Failed to change role", "err"); return; }
      toast(`Role changed to ${newRole}`);
      refetchUsers();
    } catch { toast("Network error", "err"); }
  };

  const handleRejectPayment = async (paymentId: number) => {
    try {
      const res = await adminFetch(`/api/admin/payments/${paymentId}/reject`, { method: "PATCH" });
      if (!res.ok) { toast("Failed to reject payment", "err"); return; }
      toast("Payment rejected");
      refetchPayments();
    } catch { toast("Network error", "err"); }
  };

  const TABS: { id: AdminTab; label: string; icon: any }[] = [
    { id: "overview",      label: t("Overview",      "نظرة عامة",       "Dulmar"),             icon: TrendingUp },
    { id: "courses",       label: t("Courses",       "الدورات",         "Koorsooyinka"),       icon: BookOpen },
    { id: "content",       label: t("Content",       "المحتوى",         "Waxa"),               icon: Upload },
    { id: "users",         label: t("Users",         "المستخدمون",      "Isticmaalayaasha"),   icon: Users },
    { id: "payments",      label: t("Payments",      "المدفوعات",       "Lacag Bixinta"),      icon: CreditCard },
    { id: "codes",         label: t("Codes",         "الرموز",          "Koodhada"),           icon: Key },
    { id: "analytics",     label: t("Analytics",     "التحليلات",       "Falanqaynta"),        icon: BarChart2 },
    { id: "certificates",  label: t("Certificates",  "الشهادات",        "Shahaadooyinka"),     icon: Award },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl sm:text-3xl font-black text-white">{t("Admin Dashboard", "لوحة تحكم المسؤول", "Xafiiska Maamulka")}</h1>
            <p className="text-muted-foreground mt-1 text-sm">{t("Manage your platform", "إدارة منصتك", "Maamul madalkaaaga")}</p>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-green-500/10 border border-green-500/20 shrink-0">
            <Shield className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm font-medium hidden sm:inline">Admin</span>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              tab === id
                ? "bg-primary text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]"
                : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white"
            }`}>
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">

        {/* ── OVERVIEW ── */}
        {tab === "overview" && (
          <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard icon={Users}      label="Total Users"    value={statsData?.totalUsers ?? 0}            color="text-blue-400"   bg="bg-blue-500/10" />
              <StatCard icon={BookOpen}   label="Courses"        value={statsData?.totalCourses ?? apiCourses.length} color="text-purple-400" bg="bg-purple-500/10" />
              <StatCard icon={CreditCard} label="Pending"        value={statsData?.pendingPayments ?? 0}       color="text-yellow-400" bg="bg-yellow-500/10" />
              <StatCard icon={Award}      label="Certificates"   value={statsData?.totalCertificates ?? 0}     color="text-green-400"  bg="bg-green-500/10" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard icon={BookOpen}   label="Published"      value={statsData?.publishedCourses ?? 0}      color="text-cyan-400"   bg="bg-cyan-500/10" />
              <StatCard icon={Star}       label="Lessons"        value={statsData?.totalLessons ?? 0}          color="text-orange-400" bg="bg-orange-500/10" />
              <StatCard icon={CheckCircle} label="Confirmed Pays" value={statsData?.confirmedPayments ?? 0}    color="text-green-400"  bg="bg-green-500/10" />
              <StatCard icon={TrendingUp} label="Enrollments"    value={statsData?.totalEnrollments ?? 0}      color="text-violet-400" bg="bg-violet-500/10" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="p-6 rounded-2xl bg-card border border-white/10">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-400" /> Language Distribution
                </h3>
                {[
                  { lang: "🇬🇧 English", count: apiCourses.filter((c: any) => c.language === "english").length,      color: "bg-blue-500" },
                  { lang: "🇸🇦 Arabic",  count: apiCourses.filter((c: any) => c.language === "arabic").length,       color: "bg-green-500" },
                  { lang: "🌍 Multi",    count: apiCourses.filter((c: any) => c.language === "multilingual").length, color: "bg-purple-500" },
                ].map((row, i) => (
                  <div key={i} className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">{row.lang}</span>
                      <span className="text-white font-medium">{row.count} courses</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className={`h-full ${row.color} rounded-full`} style={{ width: apiCourses.length > 0 ? `${(row.count / apiCourses.length) * 100}%` : "0%" }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-6 rounded-2xl bg-card border border-white/10">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-purple-400" /> Level Distribution
                </h3>
                {(["beginner", "intermediate", "advanced"] as const).map((lvl, i) => {
                  const count = apiCourses.filter((c: any) => c.level === lvl).length;
                  const colors = ["bg-green-500", "bg-yellow-500", "bg-red-500"];
                  return (
                    <div key={lvl} className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground capitalize">{lvl}</span>
                        <span className="text-white font-medium">{count} courses</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className={`h-full ${colors[i]} rounded-full`} style={{ width: apiCourses.length > 0 ? `${(count / apiCourses.length) * 100}%` : "0%" }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-card border border-white/10">
              <h3 className="font-semibold text-white mb-3">Quick Actions</h3>
              <div className="flex flex-wrap gap-3">
                {[
                  { label: "Add Course",       icon: Plus,       onClick: () => { setTab("courses"); setShowAddCourseForm(true); }, cls: "bg-primary/10 border-primary/20 text-primary" },
                  { label: "Review Payments",  icon: CreditCard, onClick: () => setTab("payments"), cls: "bg-yellow-500/10 border-yellow-500/20 text-yellow-400" },
                  { label: "Generate Codes",   icon: Key,        onClick: () => setTab("codes"),    cls: "bg-green-500/10 border-green-500/20 text-green-400" },
                  { label: "Issue Certificate",icon: Award,      onClick: () => setTab("certificates"), cls: "bg-orange-500/10 border-orange-500/20 text-orange-400" },
                  { label: "Manage Content",   icon: Upload,     onClick: () => setTab("content"),  cls: "bg-blue-500/10 border-blue-500/20 text-blue-400" },
                ].map(({ label, icon: Icon, onClick, cls }) => (
                  <button key={label} onClick={onClick}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium hover:opacity-80 transition-opacity ${cls}`}>
                    <Icon className="w-4 h-4" /> {label}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── COURSES ── */}
        {tab === "courses" && (
          <motion.div key="courses" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
            <div className="flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input value={courseSearch} onChange={e => setCourseSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary/40 text-sm"
                  placeholder="Search courses..." />
              </div>
              <button
                onClick={() => { setShowAddCourseForm(v => !v); setEditingCourse(null); }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-sm hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all whitespace-nowrap">
                <Plus className="w-4 h-4" /> {showAddCourseForm && !editingCourse ? "Cancel" : "Add Course"}
              </button>
            </div>

            {showAddCourseForm && !editingCourse && (
              <CourseForm onSave={handleSaveCourse} onCancel={() => setShowAddCourseForm(false)} saving={savingCourse} />
            )}

            <div className="flex items-center gap-3 text-sm">
              <span className="flex items-center gap-1.5 text-green-400">
                <Radio className="w-3.5 h-3.5" />
                {apiCourses.filter((c: any) => c.isPublished).length} published
              </span>
              <span className="text-muted-foreground/40">|</span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <EyeOff className="w-3.5 h-3.5" />
                {apiCourses.filter((c: any) => !c.isPublished).length} drafts
              </span>
              <span className="text-muted-foreground/40">|</span>
              <span className="text-muted-foreground">{apiCourses.length} total</span>
            </div>

            <div className="space-y-3">
              {filteredCourses.length === 0 && (
                <div className="text-center py-16">
                  <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
                  <p className="text-muted-foreground">No courses found.</p>
                  <button onClick={() => { setShowAddCourseForm(true); setEditingCourse(null); }}
                    className="mt-3 text-primary text-sm hover:underline">+ Add your first course</button>
                </div>
              )}

              {filteredCourses.map((course, i) => (
                <motion.div key={course.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  className={`p-4 rounded-xl border transition-colors ${course.isPublished ? "bg-card border-white/10 hover:border-white/20" : "bg-white/2 border-white/5 hover:border-white/10"}`}>

                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 overflow-hidden ${
                      course.language === "arabic" ? "bg-gradient-to-br from-green-500 to-emerald-600" :
                      course.level === "advanced" ? "bg-gradient-to-br from-red-500 to-orange-600" :
                      course.level === "intermediate" ? "bg-gradient-to-br from-purple-500 to-indigo-600" :
                      "bg-gradient-to-br from-blue-500 to-cyan-600"
                    }`}>
                      {course.thumbnailUrl
                        ? <img src={course.thumbnailUrl} alt="" className="w-full h-full object-cover" onError={e => { (e.currentTarget as any).style.display = "none"; }} />
                        : <BookOpen className="w-5 h-5 text-white" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-white text-sm">{course.title}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs border capitalize ${
                          course.level === "beginner" ? "bg-green-500/20 text-green-400 border-green-500/30"
                          : course.level === "intermediate" ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                          : "bg-red-500/20 text-red-400 border-red-500/30"
                        }`}>{course.level}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs border font-medium flex items-center gap-1 ${
                          course.isPublished ? "bg-green-500/15 text-green-400 border-green-500/25" : "bg-gray-500/15 text-gray-400 border-gray-500/20"
                        }`}>
                          {course.isPublished ? <><Radio className="w-2.5 h-2.5" /> Published</> : <><EyeOff className="w-2.5 h-2.5" /> Draft</>}
                        </span>
                        <span className="text-xs text-muted-foreground">{course.language === "english" ? "🇬🇧" : course.language === "arabic" ? "🇸🇦" : "🌐"}</span>
                      </div>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-muted-foreground mt-1">
                        <span>{course.lessonCount ?? 0} lessons</span>
                        <span>${course.price ?? 0}</span>
                        <span className="hidden sm:inline">{(course.enrolledCount ?? 0).toLocaleString()} enrolled</span>
                        {course.duration && <span>{course.duration}</span>}
                      </div>
                    </div>

                    {/* Delete confirmation */}
                    {deletingCourse === course.id && (
                      <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-between gap-4">
                        <p className="text-red-300 text-sm">Are you sure you want to delete "{course.title}"?</p>
                        <div className="flex gap-2 shrink-0">
                          <button onClick={() => handleDeleteCourse(course.id)}
                            className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors">
                            Delete
                          </button>
                          <button onClick={() => setDeletingCourse(null)}
                            className="px-3 py-1.5 rounded-lg bg-white/10 text-muted-foreground text-sm hover:bg-white/20 transition-colors">
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Edit form */}
                    {editingCourse === course.id && showAddForm && (
                      <div className="mt-4">
                        <CourseForm
                          initial={{ title: course.title, titleAr: course.titleAr, language: course.language, level: course.level, price: course.price, duration: course.duration, description: course.description, descriptionAr: course.descriptionAr, thumbnailUrl: course.thumbnailUrl ?? "" }}
                          onSave={handleSaveCourse}
                          onCancel={() => { setEditingCourse(null); setShowAddForm(false); }}
                        />
                      </div>
                    )}

                    {/* Lesson manager */}
                    <AnimatePresence>
                      {expandedCourse === course.id && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                          <LessonManagerSection courseId={course.id} courseName={course.title ?? ""} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <div className="flex items-center gap-1.5 shrink-0 flex-wrap justify-end">
                      <button
                        onClick={() => handleTogglePublish(course)}
                        disabled={togglingPublish === course.id}
                        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                          course.isPublished ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20 hover:bg-yellow-500/20" : "bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20"
                        } disabled:opacity-50 whitespace-nowrap`}
                      >
                        {togglingPublish === course.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : course.isPublished ? <><EyeOff className="w-3.5 h-3.5" /> Unpublish</> : <><Radio className="w-3.5 h-3.5" /> Publish</>}
                      </button>
                      <button
                        onClick={() => setExpandedCourse(expandedCourse === course.id ? null : course.id)}
                        className="p-2 rounded-lg bg-white/5 border border-white/10 text-muted-foreground hover:text-white hover:bg-white/10 transition-all"
                        title="Manage lessons"
                      >
                        {expandedCourse === course.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                      <button
                        onClick={() => { setEditingCourse(course.id); setShowAddForm(true); setExpandedCourse(null); }}
                        className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition-all"
                        title="Edit course"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeletingCourse(course.id)}
                        className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all"
                        title="Delete course"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Delete confirmation */}
                  {deletingCourse === course.id && (
                    <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-between gap-4">
                      <p className="text-red-300 text-sm flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        Delete "<strong>{course.title}</strong>" and all its lessons?
                      </p>
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => handleDeleteCourse(course.id)} className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors">Delete</button>
                        <button onClick={() => setDeletingCourse(null)} className="px-3 py-1.5 rounded-lg bg-white/10 text-muted-foreground text-sm hover:bg-white/20 transition-colors">Cancel</button>
                      </div>
                    </div>
                  )}

                  {/* Inline edit form */}
                  {editingCourse === course.id && showAddCourseForm && (
                    <div className="mt-4">
                      <CourseForm
                        initial={{ title: course.title, titleAr: course.titleAr, titleSo: course.titleSo, language: course.language, level: course.level, price: course.price, duration: course.duration, description: course.description, descriptionAr: course.descriptionAr, thumbnailUrl: course.thumbnailUrl || "" }}
                        onSave={handleSaveCourse}
                        onCancel={() => { setEditingCourse(null); setShowAddCourseForm(false); }}
                        saving={savingCourse}
                      />
                    </div>
                  )}

                  {/* Lesson manager */}
                  <AnimatePresence>
                    {expandedCourse === course.id && (
                      <LessonManagerSection courseId={course.id} courseName={course.title} />
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── CONTENT ── */}
        {tab === "content" && (
          <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
            <div>
              <h2 className="text-lg font-bold text-white">Content & File Uploads</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Upload videos, PDFs, images, and other course materials directly. Files are stored securely and the URL is automatically generated for you to attach to lessons.
              </p>
            </div>

            {/* Upload sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

              {/* Video Upload */}
              <div className="p-5 rounded-2xl bg-card border border-blue-500/20">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/10 flex items-center justify-center">
                    <Video className="w-4 h-4 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">Upload Video</h3>
                    <p className="text-xs text-muted-foreground">MP4, MOV, WEBM, AVI — no size limit</p>
                  </div>
                </div>
                <FileUploader
                  accept="video/mp4,video/quicktime,video/webm,video/x-msvideo,.mp4,.mov,.webm,.avi"
                  label="Click or drag a video file here"
                  onUploaded={(f) => toast(`Video uploaded: ${f.name}`)}
                />
                <p className="text-xs text-muted-foreground mt-3">Or paste a YouTube / Vimeo URL directly into the lesson's Video URL field.</p>
              </div>

              {/* PDF Upload */}
              <div className="p-5 rounded-2xl bg-card border border-green-500/20">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-green-500/10 flex items-center justify-center">
                    <FileText className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">Upload PDF / Document</h3>
                    <p className="text-xs text-muted-foreground">PDF, DOCX, PPTX — no size limit</p>
                  </div>
                </div>
                <FileUploader
                  accept=".pdf,.doc,.docx,.ppt,.pptx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  label="Click or drag a document here"
                  onUploaded={(f) => toast(`Document uploaded: ${f.name}`)}
                />
              </div>

              {/* Image Upload */}
              <div className="p-5 rounded-2xl bg-card border border-purple-500/20">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-purple-500/10 flex items-center justify-center">
                    <ImageIcon className="w-4 h-4 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">Upload Image / Thumbnail</h3>
                    <p className="text-xs text-muted-foreground">JPG, PNG, WebP, GIF — no size limit</p>
                  </div>
                </div>
                <FileUploader
                  accept="image/jpeg,image/jpg,image/png,image/webp,image/gif,.jpg,.jpeg,.png,.webp,.gif"
                  label="Click or drag an image here"
                  onUploaded={(f) => toast(`Image uploaded: ${f.name}`)}
                />
              </div>

              {/* General Files */}
              <div className="p-5 rounded-2xl bg-card border border-orange-500/20">
                <div className="flex items-center gap-2.5 mb-4">
                  <div className="w-9 h-9 rounded-xl bg-orange-500/10 flex items-center justify-center">
                    <Upload className="w-4 h-4 text-orange-400" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white text-sm">Upload Any File</h3>
                    <p className="text-xs text-muted-foreground">ZIP, audio, spreadsheets — no size limit</p>
                  </div>
                </div>
                <FileUploader
                  accept="*/*"
                  label="Click or drag any file here"
                  onUploaded={(f) => toast(`File uploaded: ${f.name}`)}
                />
              </div>
            </div>

            {/* How to use uploaded URLs */}
            <div className="p-5 rounded-2xl bg-blue-500/5 border border-blue-500/15">
              <div className="flex items-start gap-3">
                <LinkIcon className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium text-white">How to attach uploaded files to lessons</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    After uploading, copy the generated URL. Then go to <button className="text-primary hover:underline" onClick={() => setTab("courses")}>Courses</button>, expand a course, open a lesson for editing, and paste the URL into the <strong className="text-white">Video URL</strong> or <strong className="text-white">Content</strong> field.
                  </p>
                </div>
              </div>
            </div>

            {/* Course selector for content management */}
            <div className="p-6 rounded-2xl bg-card border border-white/10">
              <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-400" />
                Quick Access — Manage Lesson Content
              </h3>
              {apiCourses.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="w-8 h-8 text-muted-foreground mx-auto mb-2 opacity-30" />
                  <p className="text-sm text-muted-foreground">No courses yet. Create a course first.</p>
                  <button onClick={() => setTab("courses")} className="mt-2 text-primary text-sm hover:underline">→ Go to Courses</button>
                </div>
              ) : (
                <div className="space-y-2">
                  {apiCourses.map((course: any) => (
                    <div key={course.id} className="flex items-center justify-between gap-4 p-4 rounded-xl bg-white/3 border border-white/8 hover:border-white/15 transition-colors">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0 overflow-hidden">
                          {course.thumbnailUrl
                            ? <img src={course.thumbnailUrl} alt="" className="w-full h-full object-cover" onError={e => { (e.currentTarget as any).style.display = "none"; }} />
                            : <BookOpen className="w-4 h-4 text-white" />}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium text-white text-sm truncate">{course.title}</div>
                          <div className="text-xs text-muted-foreground">{course.lessonCount ?? 0} lessons</div>
                        </div>
                      </div>
                      <button
                        onClick={() => { setTab("courses"); setExpandedCourse(course.id); }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium hover:bg-blue-500/20 transition-colors shrink-0"
                      >
                        <Edit2 className="w-3.5 h-3.5" /> Manage Lessons
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ── USERS ── */}
        {tab === "users" && (
          <motion.div key="users" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard icon={Users}    label="Total Users"  value={usersList.length}                                                          color="text-blue-400"   bg="bg-blue-500/10" />
              <StatCard icon={Shield}   label="Admins"       value={usersList.filter((u:any) => u.role === "admin").length}                     color="text-purple-400" bg="bg-purple-500/10" />
              <StatCard icon={BookOpen} label="Avg. Courses" value={Math.round(usersList.reduce((s:number,u:any) => s+(u.enrolledCourses||0),0) / Math.max(usersList.length,1))} color="text-green-400"  bg="bg-green-500/10" />
              <StatCard icon={TrendingUp} label="This Week"  value={usersList.filter((u:any) => new Date(u.createdAt) > new Date(Date.now()-7*86400000)).length} color="text-yellow-400" bg="bg-yellow-500/10" />
            </div>

            <div className="p-6 rounded-2xl bg-card border border-white/10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  Registered Users
                  {usersList.length > 0 && <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold">{usersList.length}</span>}
                </h3>
                <div className="relative w-full sm:w-60">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input value={userSearch} onChange={e => setUserSearch(e.target.value)}
                    className="pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary/40 text-sm w-full"
                    placeholder="Search by name or email…" />
                </div>
              </div>

              {filteredUsers.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground">{userSearch ? "No users match your search" : "No users found"}</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        {["User", "Email", "Courses", "Role", "Joined", "Actions"].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredUsers.map((u: any) => (
                        <>
                          <tr key={u.id}>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                  {(u.name || "U")[0].toUpperCase()}
                                </div>
                                <span className="text-white text-sm font-medium">{u.name || "-"}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-muted-foreground text-sm max-w-[160px] truncate">{u.email}</td>
                            <td className="px-4 py-3 text-center">
                              <span className="px-2 py-1 rounded-full text-xs font-bold bg-white/5 text-muted-foreground">{u.enrolledCourses ?? 0}</span>
                            </td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                                u.role === "admin" ? "bg-purple-500/20 text-purple-400 border-purple-500/30" : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                              }`}>{u.role}</span>
                            </td>
                            <td className="px-4 py-3 text-muted-foreground text-sm whitespace-nowrap">
                              {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "-"}
                            </td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                <button onClick={() => handleToggleUserRole(u)}
                                  className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-colors"
                                  title={u.role === "admin" ? "Demote to user" : "Promote to admin"}>
                                  <Settings className="w-3.5 h-3.5" />
                                </button>
                                <button onClick={() => setDeletingUser(deletingUser === u.id ? null : u.id)}
                                  className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                                  title="Delete user">
                                  <UserX className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                          {deletingUser === u.id && (
                            <tr key={`del-${u.id}`}>
                              <td colSpan={6} className="px-4 pb-3">
                                <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                                  <div className="flex items-center gap-2 text-red-300 text-sm">
                                    <AlertTriangle className="w-4 h-4 shrink-0" />
                                    Delete <strong>{u.name || u.email}</strong>? This cannot be undone.
                                  </div>
                                  <div className="flex gap-2 shrink-0">
                                    <button onClick={() => handleDeleteUser(u.id)} className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors">Delete</button>
                                    <button onClick={() => setDeletingUser(null)} className="px-3 py-1.5 rounded-lg bg-white/10 text-muted-foreground text-xs hover:bg-white/20 transition-colors">Cancel</button>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ── PAYMENTS ── */}
        {tab === "payments" && (
          <motion.div key="payments" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard icon={Clock}        label="Pending"   value={paymentsList.filter((p:any)=>p.status==="pending").length}   color="text-yellow-400" bg="bg-yellow-500/10" />
              <StatCard icon={CheckCircle}  label="Confirmed" value={paymentsList.filter((p:any)=>p.status==="confirmed").length} color="text-green-400"  bg="bg-green-500/10" />
              <StatCard icon={XCircle}      label="Rejected"  value={paymentsList.filter((p:any)=>p.status==="rejected").length}  color="text-red-400"    bg="bg-red-500/10" />
              <StatCard icon={CreditCard}   label="Total"     value={paymentsList.length}                                          color="text-blue-400"   bg="bg-blue-500/10" />
            </div>

            <div className="p-6 rounded-2xl bg-card border border-white/10">
              <div className="flex items-center justify-between mb-5 gap-4 flex-wrap">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-yellow-400" /> Payments
                </h3>
                <div className="flex gap-2">
                  {(["all", "pending", "confirmed", "rejected"] as const).map(f => (
                    <button key={f} onClick={() => setPaymentFilter(f)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors ${
                        paymentFilter === f ? "bg-primary text-white" : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white"
                      }`}>{f}</button>
                  ))}
                </div>
              </div>

              {filteredPayments.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground">No {paymentFilter !== "all" ? paymentFilter : ""} payments found.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredPayments.map((p: any, i: number) => (
                    <div key={i} className={`flex items-center justify-between gap-4 p-4 rounded-xl border ${
                      p.status === "pending" ? "bg-yellow-500/5 border-yellow-500/20"
                      : p.status === "confirmed" ? "bg-green-500/5 border-green-500/15"
                      : "bg-red-500/5 border-red-500/15"
                    }`}>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-white text-sm">{p.userName || "Unknown User"}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                            p.status === "pending" ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                            : p.status === "confirmed" ? "bg-green-500/20 text-green-400 border-green-500/30"
                            : "bg-red-500/20 text-red-400 border-red-500/30"
                          }`}>{p.status}</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {p.courseName || `Course #${p.courseId}`} • WhatsApp: {p.whatsappNumber}
                          {p.notes && ` • ${p.notes}`}
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {new Date(p.createdAt).toLocaleDateString()}
                          {p.accessCode && <span className="ml-2 font-mono text-green-400">Code: {p.accessCode}</span>}
                        </div>
                      </div>
                      {p.status === "pending" && (
                        <div className="flex gap-2 shrink-0">
                          <button
                            onClick={() => confirmPayment({ paymentId: p.id, data: { status: "confirmed" } } as any)}
                            disabled={confirmingPayment}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                          >
                            <CheckCircle className="w-3.5 h-3.5" /> Confirm
                          </button>
                          <button
                            onClick={() => handleRejectPayment(p.id)}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600/80 text-white text-xs font-medium hover:bg-red-700 transition-colors"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Reject
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ── ACCESS CODES ── */}
        {tab === "codes" && (
          <motion.div key="codes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <StatCard icon={Key}         label="Total Codes"  value={codesList.length}                                     color="text-blue-400"   bg="bg-blue-500/10" />
              <StatCard icon={CheckSquare} label="Used"         value={codesList.filter((c:any) => c.isUsed).length}         color="text-green-400"  bg="bg-green-500/10" />
              <StatCard icon={Hash}        label="Available"    value={codesList.filter((c:any) => !c.isUsed && c.isActive).length} color="text-yellow-400" bg="bg-yellow-500/10" />
            </div>

            <div className="p-6 rounded-2xl bg-card border border-white/10">
              <h3 className="font-semibold text-white mb-4">Generate New Access Code</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <select
                  value={newCodeCourseId || (apiCourses[0]?.id ?? "")}
                  onChange={e => setNewCodeCourseId(e.target.value)}
                  className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary/40 text-sm flex-1">
                  {apiCourses.length === 0 && <option value="">No courses yet — add a course first</option>}
                  {apiCourses.map((c: any) => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
                <button
                  onClick={() => {
                    const courseId = Number(newCodeCourseId || apiCourses[0]?.id);
                    if (!courseId) return;
                    createCode({ data: { courseId } } as any);
                  }}
                  disabled={creatingCode || apiCourses.length === 0}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-sm hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all disabled:opacity-50 whitespace-nowrap">
                  {creatingCode ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  Generate Code
                </button>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-white/10">
              <h3 className="font-semibold text-white mb-4">All Access Codes</h3>
              {codesList.length === 0 ? (
                <div className="text-center py-12">
                  <Key className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground">No codes created yet.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {codesList.map((code: any, i: number) => (
                    <div key={i} className={`flex items-center justify-between gap-4 p-4 rounded-xl border ${code.isUsed ? "bg-white/5 border-white/5 opacity-60" : "bg-green-500/5 border-green-500/20"}`}>
                      <div>
                        <div className="flex items-center gap-2">
                          <code className="font-mono font-bold text-white text-sm tracking-widest">{code.code}</code>
                          <button onClick={() => copyToClipboard(code.code)} className="p-1 rounded text-muted-foreground hover:text-white transition-colors">
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {code.courseName || `Course #${code.courseId}`} • {code.isUsed ? `Used${code.usedByEmail ? " by " + code.usedByEmail : ""}` : "Available"}
                        </div>
                      </div>
                      {!code.isUsed && code.isActive && (
                        <button onClick={() => deactivateCode({ codeId: code.id } as any)}
                          className="px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-colors">
                          Deactivate
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ── ANALYTICS ── */}
        {tab === "analytics" && (
          <motion.div key="analytics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard icon={Users}      label="Total Users"    value={analyticsData?.totalUsers ?? statsData?.totalUsers ?? 0}              color="text-blue-400"   bg="bg-blue-500/10" />
              <StatCard icon={BookOpen}   label="Total Lessons"  value={analyticsData?.totalLessons ?? statsData?.totalLessons ?? 0}           color="text-purple-400" bg="bg-purple-500/10" />
              <StatCard icon={CreditCard} label="Confirmed Pays" value={analyticsData?.confirmedPayments ?? statsData?.confirmedPayments ?? 0} color="text-green-400"  bg="bg-green-500/10" />
              <StatCard icon={Award}      label="Certificates"   value={analyticsData?.totalCertificates ?? statsData?.totalCertificates ?? 0} color="text-yellow-400" bg="bg-yellow-500/10" />
            </div>

            <div className="p-6 rounded-2xl bg-card border border-white/10">
              <h3 className="font-semibold text-white mb-5 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-blue-400" /> Top Courses by Enrollment
              </h3>
              {apiCourses.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-sm">No courses to display</div>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart
                    data={[...apiCourses].sort((a: any, b: any) => (b.enrolledCount ?? 0) - (a.enrolledCount ?? 0)).slice(0, 8).map((c: any) => ({
                      name: c.title.length > 20 ? c.title.slice(0, 18) + "…" : c.title,
                      students: c.enrolledCount ?? 0,
                    }))}
                    margin={{ top: 4, right: 4, left: -20, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} interval={0} angle={-20} textAnchor="end" height={48} />
                    <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#fff", fontSize: 12 }} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                    <Bar dataKey="students" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Students" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-6 rounded-2xl bg-card border border-white/10">
                <h3 className="font-semibold text-white mb-5 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-purple-400" /> Language Breakdown
                </h3>
                {(() => {
                  const cats: Record<string, number> = {};
                  apiCourses.forEach((c: any) => { const k = c.language ?? "other"; cats[k] = (cats[k] || 0) + 1; });
                  const COLORS = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b"];
                  const data = Object.entries(cats).map(([name, value]) => ({ name, value }));
                  if (data.length === 0) return <div className="text-center py-8 text-muted-foreground text-sm">No data</div>;
                  return (
                    <>
                      <ResponsiveContainer width="100%" height={160}>
                        <PieChart>
                          <Pie data={data} cx="50%" cy="50%" innerRadius={44} outerRadius={68} paddingAngle={3} dataKey="value">
                            {data.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                          </Pie>
                          <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#fff", fontSize: 12 }} />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {data.map((d, i) => (
                          <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                            {d.name} ({d.value})
                          </div>
                        ))}
                      </div>
                    </>
                  );
                })()}
              </div>

              <div className="p-6 rounded-2xl bg-card border border-white/10">
                <h3 className="font-semibold text-white mb-5 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-green-400" /> Level Distribution
                </h3>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart
                    data={["beginner", "intermediate", "advanced"].map(lvl => ({
                      name: lvl.charAt(0).toUpperCase() + lvl.slice(1),
                      courses: apiCourses.filter((c: any) => c.level === lvl).length,
                    }))}
                    margin={{ top: 4, right: 4, left: -20, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#fff", fontSize: 12 }} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                    <Bar dataKey="courses" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Courses" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent Users */}
            {analyticsData?.recentUsers && analyticsData.recentUsers.length > 0 && (
              <div className="p-6 rounded-2xl bg-card border border-white/10">
                <h3 className="font-semibold text-white mb-4">Recent Registrations</h3>
                <div className="space-y-3">
                  {analyticsData.recentUsers.map((u: any) => (
                    <div key={u.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/3 border border-white/8">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {(u.name || "U")[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white truncate">{u.name || "—"}</div>
                        <div className="text-xs text-muted-foreground truncate">{u.email}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          u.role === "admin" ? "bg-purple-500/20 text-purple-400" : "bg-blue-500/20 text-blue-400"
                        }`}>{u.role}</div>
                        <div className="text-xs text-muted-foreground mt-1">{new Date(u.createdAt).toLocaleDateString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Course performance */}
            <div className="p-6 rounded-2xl bg-card border border-white/10">
              <h3 className="font-semibold text-white mb-5">Course Performance</h3>
              {apiCourses.length === 0 ? (
                <p className="text-center py-8 text-muted-foreground text-sm">No courses yet</p>
              ) : (
                <div className="space-y-3">
                  {[...apiCourses].sort((a: any, b: any) => (b.enrolledCount ?? 0) - (a.enrolledCount ?? 0)).slice(0, 10).map((c: any, i: number) => {
                    const maxEnrolled = Math.max(...apiCourses.map((x: any) => x.enrolledCount ?? 0), 1);
                    return (
                      <div key={c.id} className="flex items-center gap-4">
                        <span className="text-muted-foreground text-sm font-mono w-6 shrink-0 text-right">#{i + 1}</span>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-gradient-to-br from-blue-500 to-purple-600">
                          <BookOpen className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-foreground truncate">{c.title}</span>
                            <span className="text-xs text-muted-foreground shrink-0 ml-2">{(c.enrolledCount ?? 0).toLocaleString()} students</span>
                          </div>
                          <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" style={{ width: `${((c.enrolledCount ?? 0) / maxEnrolled) * 100}%` }} />
                          </div>
                        </div>
                        <div className="shrink-0 text-right">
                          <div className="text-xs text-green-400 font-bold">${((c.enrolledCount ?? 0) * (c.price ?? 0)).toLocaleString()}</div>
                          <div className="text-[10px] text-muted-foreground">revenue</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ── CERTIFICATES ── */}
        {tab === "certificates" && (
          <motion.div key="certificates" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Certificate Management</h3>
                <p className="text-sm text-muted-foreground mt-0.5">View, verify, and issue student certificates</p>
              </div>
              <button onClick={() => refetchCerts()}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-white transition-colors px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                <RefreshCw className="w-3.5 h-3.5" /> Refresh
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Total Issued"    value={adminCerts.length}                                             icon={Award}      color="text-yellow-400" bg="bg-yellow-500/10" />
              <StatCard label="Courses Covered" value={new Set(adminCerts.map((c: any) => c.courseId)).size}          icon={BookOpen}   color="text-purple-400" bg="bg-purple-500/10" />
              <StatCard label="Students"        value={new Set(adminCerts.map((c: any) => c.userId)).size}            icon={Users}      color="text-blue-400"   bg="bg-blue-500/10" />
              <StatCard label="This Month"      value={adminCerts.filter((c:any) => new Date(c.issuedAt) > new Date(Date.now() - 30*86400000)).length} icon={TrendingUp} color="text-green-400"  bg="bg-green-500/10" />
            </div>

            {/* Manual issue */}
            <CertificateIssueWidget
              users={usersList}
              courses={apiCourses}
              onIssued={() => refetchCerts()}
            />

            {/* Verify widget */}
            <CertVerifyWidget />

            {/* Certificate list */}
            <div className="p-6 rounded-2xl bg-card border border-white/10">
              <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                <Award className="w-4 h-4 text-yellow-400" />
                All Issued Certificates
                {adminCerts.length > 0 && <span className="px-2 py-0.5 rounded-full bg-yellow-500/20 text-yellow-400 text-xs font-bold">{adminCerts.length}</span>}
              </h4>
              {adminCerts.length === 0 ? (
                <div className="text-center py-12">
                  <Award className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
                  <p className="text-muted-foreground text-sm">No certificates issued yet.</p>
                  <p className="text-muted-foreground text-xs mt-1">Use the form above to manually issue one, or certificates are auto-issued when students complete a course.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {adminCerts.map((cert: any, i: number) => (
                    <div key={cert.id} className="flex items-center gap-4 p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/10 hover:border-yellow-500/20 transition-colors">
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-yellow-500 to-orange-600 shrink-0">
                        <Award className="w-4 h-4 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-white text-sm">{cert.studentName}</div>
                        <div className="text-xs text-muted-foreground mt-0.5">{cert.courseName}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-xs text-muted-foreground/60">{cert.certId}</span>
                          <button onClick={() => copyToClipboard(cert.certId)} className="p-0.5 rounded text-muted-foreground/40 hover:text-muted-foreground transition-colors">
                            <Copy className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                      <div className="text-right shrink-0 space-y-1.5">
                        <div className="text-xs text-muted-foreground">{new Date(cert.issuedAt).toLocaleDateString()}</div>
                        <div className="flex items-center gap-2 justify-end">
                          <a href={`/verify/${cert.certId}`} target="_blank" rel="noopener noreferrer"
                            className="text-xs text-primary hover:underline inline-flex items-center gap-1">
                            View <ChevronRight className="w-3 h-3" />
                          </a>
                          <button
                            onClick={() => {
                              const win = window.open(`/verify/${cert.certId}`, "_blank");
                              if (win) {
                                win.addEventListener("load", () => { setTimeout(() => win.print(), 500); });
                              }
                            }}
                            className="text-xs text-yellow-400 hover:text-yellow-300 inline-flex items-center gap-1 transition-colors">
                            Print
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
