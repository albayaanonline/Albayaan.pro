import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useGetAdminStats, useGetAdminUsers, useGetAdminPayments,
  useGetAdminCodes, useConfirmPayment, useCreateCode, useDeactivateCode
} from "@/lib/api-client";
import {
  useGetAdminCourses, useAdminCreateCourse, useAdminUpdateCourse, useAdminDeleteCourse,
  useAdminGetCourseLessons, useAdminDeleteLesson,
  useGetAdminAnalytics, useGetAdminCertificates, useVerifyCertificateById,
  useAdminDeleteUser, useAdminUpdateUserRole,
  type AdminCourseInput,
} from "@/lib/api-client/admin-hooks";
import { MediaUrlInput } from "@/components/admin/MediaUrlInput";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import {
  Users, BookOpen, CreditCard, Key, CheckCircle, XCircle, Loader2,
  Plus, TrendingUp, Clock, Search, Edit2, Trash2, Eye, BarChart2,
  Upload, Globe, Shield, Star, ChevronDown, ChevronUp, Save, X, Award, RefreshCw,
  AlertCircle, Settings
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type AdminTab = "overview" | "courses" | "users" | "payments" | "codes" | "analytics" | "certificates";

interface CourseFormData {
  title: string;
  titleAr: string;
  language: "english" | "arabic";
  level: "beginner" | "intermediate" | "advanced";
  price: number;
  duration: string;
  description: string;
  descriptionAr: string;
  thumbnailUrl: string;
}

const DEFAULT_FORM: CourseFormData = {
  title: "", titleAr: "", language: "english", level: "beginner",
  price: 15, duration: "8 weeks", description: "", descriptionAr: "", thumbnailUrl: "",
};

function StatCard({ icon: Icon, label, value, color, bg }: { icon: any; label: string; value: any; color: string; bg: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-5 rounded-2xl bg-card border border-white/10">
      <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div className="text-2xl font-black text-white">{value ?? "—"}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </motion.div>
  );
}

function CourseForm({
  initial, onSave, onCancel, loading,
}: { initial?: Partial<CourseFormData>; onSave: (d: CourseFormData) => void; onCancel: () => void; loading?: boolean }) {
  const [form, setForm] = useState<CourseFormData>({ ...DEFAULT_FORM, ...initial });
  const set = (k: keyof CourseFormData, v: any) => setForm(f => ({ ...f, [k]: v }));

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-2xl bg-card border border-primary/30 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Title (English) *</label>
          <input value={form.title} onChange={e => set("title", e.target.value)} required
            className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 text-sm"
            placeholder="Course title in English" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Title (Arabic)</label>
          <input value={form.titleAr} onChange={e => set("titleAr", e.target.value)} dir="rtl"
            className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 text-sm"
            placeholder="عنوان الدورة بالعربية" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Language</label>
          <select value={form.language} onChange={e => set("language", e.target.value as any)}
            className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary/50 text-sm">
            <option value="english">🇬🇧 English</option>
            <option value="arabic">🇸🇦 Arabic</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Level</label>
          <select value={form.level} onChange={e => set("level", e.target.value as any)}
            className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary/50 text-sm">
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Price ($)</label>
          <input type="number" value={form.price} onChange={e => set("price", Number(e.target.value))} min={0}
            className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary/50 text-sm" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Duration</label>
          <input value={form.duration} onChange={e => set("duration", e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 text-sm"
            placeholder="e.g. 8 weeks" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Description (English)</label>
        <textarea value={form.description} onChange={e => set("description", e.target.value)} rows={3}
          className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 text-sm resize-none"
          placeholder="Course description..." />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Description (Arabic)</label>
        <textarea value={form.descriptionAr} onChange={e => set("descriptionAr", e.target.value)} rows={3} dir="rtl"
          className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 text-sm resize-none"
          placeholder="وصف الدورة..." />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Thumbnail Image</label>
        <MediaUrlInput
          value={form.thumbnailUrl}
          onChange={v => set("thumbnailUrl", v)}
          type="image"
          placeholder="https://example.com/thumbnail.jpg"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button onClick={() => onSave(form)} disabled={loading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-sm hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all disabled:opacity-50">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Course
        </button>
        <button onClick={onCancel}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-muted-foreground font-medium text-sm hover:bg-white/10 transition-all">
          <X className="w-4 h-4" /> Cancel
        </button>
      </div>
    </motion.div>
  );
}

function CourseLessonList({ courseId }: { courseId: number }) {
  const { data: lessons, isLoading } = useAdminGetCourseLessons(courseId);
  const { mutate: deleteLesson } = useAdminDeleteLesson();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 py-4 px-3 text-muted-foreground text-sm">
        <Loader2 className="w-4 h-4 animate-spin" /> Loading lessons…
      </div>
    );
  }

  if (!lessons || lessons.length === 0) {
    return (
      <div className="py-4 px-3 text-muted-foreground text-sm text-center">
        No lessons yet. Add lessons through the course management API.
      </div>
    );
  }

  return (
    <div className="space-y-1 mt-3">
      <p className="text-xs text-muted-foreground font-medium px-1 mb-2 uppercase tracking-wider">
        {lessons.length} Lessons
      </p>
      {lessons.map((lesson, j) => (
        <div key={lesson.id} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-colors group">
          <span className="text-xs text-muted-foreground font-mono w-5 shrink-0">{j + 1}</span>
          <div className="flex-1 min-w-0">
            <span className="text-sm text-foreground truncate block">{lesson.title}</span>
            <span className="text-xs text-muted-foreground">{lesson.duration} • {lesson.isLocked ? "🔒 Locked" : "🔓 Free"} {lesson.hasQuiz ? "• Quiz" : ""}</span>
          </div>
          <button
            onClick={() => deleteLesson({ lessonId: lesson.id, courseId })}
            className="p-1 rounded text-red-400 hover:bg-red-500/20 transition-colors opacity-0 group-hover:opacity-100"
            title="Delete lesson"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}

function CertVerifyWidget() {
  const [inputId, setInputId] = useState("");
  const [searchId, setSearchId] = useState<string | null>(null);
  const { data: cert, isLoading, isError } = useVerifyCertificateById(searchId);

  const handleVerify = () => {
    const trimmed = inputId.trim().toUpperCase();
    if (trimmed) setSearchId(trimmed);
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
          placeholder="ALBAYAAN-XXXX-XXXX-2026"
          className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 text-sm font-mono"
          onKeyDown={e => e.key === "Enter" && handleVerify()}
        />
        <button
          onClick={handleVerify}
          disabled={isLoading}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-sm flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />} Verify
        </button>
      </div>

      {isError && searchId && !isLoading && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          <XCircle className="w-4 h-4 shrink-0" />
          Certificate <span className="font-mono text-xs ml-1">{searchId}</span> not found in database.
        </div>
      )}

      {cert && !isLoading && (
        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 space-y-2">
          <div className="flex items-center gap-2 text-green-400 font-semibold text-sm">
            <CheckCircle className="w-4 h-4" /> Valid Certificate
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div><span className="text-muted-foreground">Student:</span> <span className="text-white ml-1">{cert.studentName}</span></div>
            <div><span className="text-muted-foreground">Course:</span> <span className="text-white ml-1">{cert.courseName}</span></div>
            <div><span className="text-muted-foreground">Issued:</span> <span className="text-white ml-1">{new Date(cert.issuedAt).toLocaleDateString()}</span></div>
            <div><span className="text-muted-foreground">ID:</span> <span className="font-mono text-white ml-1 text-[10px]">{cert.certId}</span></div>
          </div>
        </div>
      )}

      <p className="text-xs text-muted-foreground mt-3">
        Enter a certificate ID to verify its authenticity and view student details.
      </p>
    </div>
  );
}

export default function AdminDashboard() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const [tab, setTab] = useState<AdminTab>("overview");
  const [newCodeCourseId, setNewCodeCourseId] = useState<string>("");
  const [courseSearch, setCourseSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<number | null>(null);
  const [deletingCourseId, setDeletingCourseId] = useState<number | null>(null);
  const [expandedCourseId, setExpandedCourseId] = useState<number | null>(null);

  const { data: stats, isLoading: statsLoading } = useGetAdminStats();
  const { data: users, isLoading: usersLoading }    = useGetAdminUsers();
  const { data: payments, refetch: refetchPayments } = useGetAdminPayments();
  const { data: codes, refetch: refetchCodes } = useGetAdminCodes();
  const { data: adminCourses, isLoading: coursesLoading } = useGetAdminCourses();
  const { data: analyticsData } = useGetAdminAnalytics();
  const { data: adminCerts, refetch: refetchCerts } = useGetAdminCertificates();

  const { mutate: confirmPayment, isPending: confirmingPayment } = useConfirmPayment({
    mutation: { onSuccess: () => refetchPayments() },
  });
  const { mutate: createCode, isPending: creatingCode } = useCreateCode({
    mutation: { onSuccess: () => { refetchCodes(); } },
  });
  const { mutate: deactivateCode } = useDeactivateCode({
    mutation: { onSuccess: () => refetchCodes() },
  });
  const { mutate: createCourse, isPending: creatingCourse } = useAdminCreateCourse();
  const { mutate: updateCourse, isPending: updatingCourse } = useAdminUpdateCourse();
  const { mutate: deleteCourse, isPending: deletingCourse } = useAdminDeleteCourse();
  const { mutate: deleteUser } = useAdminDeleteUser();
  const { mutate: updateRole } = useAdminUpdateUserRole();

  const savingCourse = creatingCourse || updatingCourse;

  const TABS: { id: AdminTab; label: string; icon: any }[] = [
    { id: "overview",      label: t("Overview",      "نظرة عامة",      "Dulmar"),               icon: TrendingUp },
    { id: "courses",       label: t("Courses",       "الدورات",         "Koorsooyinka"),          icon: BookOpen },
    { id: "users",         label: t("Users",         "المستخدمون",      "Isticmaalayaasha"),       icon: Users },
    { id: "payments",      label: t("Payments",      "المدفوعات",       "Lacag Bixinta"),          icon: CreditCard },
    { id: "codes",         label: t("Codes",         "الرموز",          "Koodhada"),               icon: Key },
    { id: "analytics",     label: t("Analytics",     "التحليلات",       "Falanqaynta"),            icon: BarChart2 },
    { id: "certificates",  label: t("Certificates",  "الشهادات",        "Shahaadooyinka"),          icon: Award },
  ];

  const filteredCourses = (adminCourses ?? []).filter(c =>
    !courseSearch || c.title.toLowerCase().includes(courseSearch.toLowerCase()) ||
    (c.titleAr && c.titleAr.includes(courseSearch))
  );

  const handleSaveCourse = (data: CourseFormData) => {
    const payload: AdminCourseInput = {
      title: data.title,
      titleAr: data.titleAr,
      description: data.description,
      descriptionAr: data.descriptionAr,
      language: data.language,
      level: data.level,
      price: data.price,
      duration: data.duration,
      thumbnailUrl: data.thumbnailUrl || undefined,
    };

    if (editingCourseId !== null) {
      updateCourse(
        { courseId: editingCourseId, data: payload },
        {
          onSuccess: () => {
            toast({ title: "Course updated", description: `"${data.title}" has been saved.` });
            setShowAddForm(false);
            setEditingCourseId(null);
          },
          onError: () => toast({ title: "Update failed", variant: "destructive" }),
        }
      );
    } else {
      createCourse(payload, {
        onSuccess: () => {
          toast({ title: "Course created", description: `"${data.title}" has been added.` });
          setShowAddForm(false);
        },
        onError: () => toast({ title: "Create failed", variant: "destructive" }),
      });
    }
  };

  const handleDeleteCourse = (id: number) => {
    deleteCourse(id, {
      onSuccess: () => {
        toast({ title: "Course deleted" });
        setDeletingCourseId(null);
      },
      onError: () => toast({ title: "Delete failed", variant: "destructive" }),
    });
  };

  const levelColors: Record<string, string> = {
    beginner: "bg-green-500/20 text-green-400 border-green-500/30",
    intermediate: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    advanced: "bg-red-500/20 text-red-400 border-red-500/30",
  };

  const coursesForCodes = adminCourses ?? [];

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
              <StatCard icon={Users}      label={t("Total Users", "إجمالي المستخدمين", "Wadarta Isticmaalayaasha")} value={(stats as any)?.totalUsers ?? "—"}       color="text-blue-400"   bg="bg-blue-500/10" />
              <StatCard icon={BookOpen}   label={t("Courses",     "الدورات",            "Koorsooyinka")}           value={(stats as any)?.totalCourses ?? adminCourses?.length ?? "—"} color="text-purple-400" bg="bg-purple-500/10" />
              <StatCard icon={CreditCard} label={t("Pending",     "المعلقة",            "Sugaya")}                 value={(stats as any)?.pendingPayments ?? "—"}    color="text-yellow-400" bg="bg-yellow-500/10" />
              <StatCard icon={Award}      label={t("Certs Issued","الشهادات",           "Shahaadooyinka")}          value={adminCerts?.length ?? "—"}                 color="text-green-400"  bg="bg-green-500/10" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="p-6 rounded-2xl bg-card border border-white/10">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-400" /> Language Distribution
                </h3>
                {(["english", "arabic"] as const).map((lang) => {
                  const count = (adminCourses ?? []).filter(c => c.language === lang).length;
                  const total = (adminCourses ?? []).length || 1;
                  return (
                    <div key={lang} className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground">{lang === "english" ? "🇬🇧 English" : "🇸🇦 Arabic"}</span>
                        <span className="text-white font-medium">{count} courses</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className={`h-full ${lang === "english" ? "bg-blue-500" : "bg-green-500"} rounded-full transition-all`} style={{ width: `${(count / total) * 100}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-6 rounded-2xl bg-card border border-white/10">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-purple-400" /> Level Distribution
                </h3>
                {(["beginner", "intermediate", "advanced"] as const).map((lvl, i) => {
                  const count = (adminCourses ?? []).filter(c => c.level === lvl).length;
                  const total = (adminCourses ?? []).length || 1;
                  const colors = ["bg-green-500", "bg-yellow-500", "bg-red-500"];
                  return (
                    <div key={lvl} className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground capitalize">{lvl}</span>
                        <span className="text-white font-medium">{count} courses</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className={`h-full ${colors[i]} rounded-full transition-all`} style={{ width: `${(count / total) * 100}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-white/10">
              <h3 className="font-semibold text-white mb-3">{t("Quick Actions", "إجراءات سريعة", "Tallaabooyin Deg-deg ah")}</h3>
              <div className="flex flex-wrap gap-3">
                <button onClick={() => { setTab("courses"); setShowAddForm(true); }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20 text-primary text-sm font-medium hover:bg-primary/20 transition-colors">
                  <Plus className="w-4 h-4" /> Add Course
                </button>
                <button onClick={() => setTab("payments")}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm font-medium hover:bg-yellow-500/20 transition-colors">
                  <CreditCard className="w-4 h-4" /> Review Payments
                </button>
                <button onClick={() => setTab("codes")}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm font-medium hover:bg-green-500/20 transition-colors">
                  <Key className="w-4 h-4" /> Generate Codes
                </button>
                <button onClick={() => setTab("certificates")}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-medium hover:bg-purple-500/20 transition-colors">
                  <Award className="w-4 h-4" /> View Certificates
                </button>
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
              <button onClick={() => { setShowAddForm(!showAddForm); setEditingCourseId(null); }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-sm hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all whitespace-nowrap">
                <Plus className="w-4 h-4" /> {showAddForm && editingCourseId === null ? "Cancel" : "Add Course"}
              </button>
            </div>

            {showAddForm && editingCourseId === null && (
              <CourseForm
                onSave={handleSaveCourse}
                onCancel={() => setShowAddForm(false)}
                loading={savingCourse}
              />
            )}

            {coursesLoading && (
              <div className="flex items-center gap-3 p-6 rounded-2xl bg-card border border-white/10 text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin" /> Loading courses…
              </div>
            )}

            {!coursesLoading && filteredCourses.length === 0 && (
              <div className="p-10 rounded-2xl bg-card border border-white/10 text-center">
                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
                <p className="text-muted-foreground">{courseSearch ? "No courses match your search." : "No courses yet. Add your first course."}</p>
              </div>
            )}

            <div className="space-y-3">
              {filteredCourses.map((course, i) => (
                <motion.div key={course.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                  <div className="p-4 rounded-xl bg-card border border-white/10 hover:border-white/20 transition-colors">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-black text-base shrink-0">
                        {course.title.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-white text-sm">{course.title}</span>
                          {course.titleAr && <span className="text-xs text-muted-foreground" dir="rtl">{course.titleAr}</span>}
                          <span className={`px-2 py-0.5 rounded-full text-xs border capitalize ${levelColors[course.level] ?? ""}`}>{course.level}</span>
                          <span className="text-xs text-muted-foreground">{course.language === "english" ? "🇬🇧" : "🇸🇦"}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-muted-foreground mt-1">
                          <span>{course.lessonCount} lessons</span>
                          <span>${course.price}</span>
                          <span className="hidden sm:inline">{course.enrolledCount.toLocaleString()} enrolled</span>
                          <span>{course.duration}</span>
                        </div>
                        {/* Mobile actions */}
                        <div className="flex items-center gap-2 mt-2 sm:hidden">
                          <button onClick={() => setExpandedCourseId(expandedCourseId === course.id ? null : course.id)}
                            className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-muted-foreground hover:text-white hover:bg-white/10 transition-all">
                            {expandedCourseId === course.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                          <button onClick={() => { setEditingCourseId(course.id); setShowAddForm(true); }}
                            className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition-all">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => setDeletingCourseId(course.id)}
                            className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      {/* Desktop actions */}
                      <div className="hidden sm:flex items-center gap-2 shrink-0">
                        <button onClick={() => setExpandedCourseId(expandedCourseId === course.id ? null : course.id)}
                          className="p-2 rounded-lg bg-white/5 border border-white/10 text-muted-foreground hover:text-white hover:bg-white/10 transition-all">
                          {expandedCourseId === course.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        <button onClick={() => { setEditingCourseId(course.id); setShowAddForm(true); }}
                          className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition-all">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeletingCourseId(course.id)}
                          className="p-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Delete confirmation */}
                    {deletingCourseId === course.id && (
                      <div className="mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-between gap-4">
                        <p className="text-red-300 text-sm">Delete "{course.title}"? This will also remove all lessons.</p>
                        <div className="flex gap-2 shrink-0">
                          <button onClick={() => handleDeleteCourse(course.id)} disabled={deletingCourse}
                            className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center gap-1.5">
                            {deletingCourse && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Delete
                          </button>
                          <button onClick={() => setDeletingCourseId(null)}
                            className="px-3 py-1.5 rounded-lg bg-white/10 text-muted-foreground text-sm hover:bg-white/20 transition-colors">
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Edit form */}
                    {editingCourseId === course.id && showAddForm && (
                      <div className="mt-4">
                        <CourseForm
                          initial={{
                            title: course.title, titleAr: course.titleAr ?? "",
                            language: course.language, level: course.level,
                            price: course.price, duration: course.duration,
                            description: course.description ?? "",
                            descriptionAr: course.descriptionAr ?? "",
                            thumbnailUrl: course.thumbnailUrl ?? "",
                          }}
                          onSave={handleSaveCourse}
                          onCancel={() => { setShowAddForm(false); setEditingCourseId(null); }}
                          loading={savingCourse}
                        />
                      </div>
                    )}

                    {/* Lessons expansion */}
                    <AnimatePresence>
                      {expandedCourseId === course.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <CourseLessonList courseId={course.id} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── USERS ── */}
        {tab === "users" && (
          <motion.div key="users" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="p-6 rounded-2xl bg-card border border-white/10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <h3 className="font-semibold text-white">{t("Registered Users", "المستخدمون المسجلون", "Isticmaalayaasha Diiwaan Galiyay")}</h3>
              </div>
              {usersLoading ? (
                <div className="flex items-center gap-3 py-8 text-muted-foreground">
                  <Loader2 className="w-5 h-5 animate-spin" /> Loading users…
                </div>
              ) : !users || (users as any[]).length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground">{t("No users found", "لا يوجد مستخدمون", "Ma jiraan isticmaalayaal")}</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        {["Name", "Email", "Role", "Enrolled", "Joined", "Actions"].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(users as any[]).map((u: any, i: number) => (
                        <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                {(u.name || "U")[0].toUpperCase()}
                              </div>
                              <span className="text-white text-sm font-medium">{u.name || "—"}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground text-sm">{u.email}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                              u.role === "admin"
                                ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
                                : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                            }`}>{u.role}</span>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground text-sm">{u.enrolledCourses ?? 0}</td>
                          <td className="px-4 py-3 text-muted-foreground text-sm">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "—"}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => updateRole({ userId: u.id, role: u.role === "admin" ? "user" : "admin" })}
                                className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-colors"
                                title={u.role === "admin" ? "Demote to user" : "Promote to admin"}
                              >
                                <Settings className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => deleteUser(u.id)}
                                className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                                title="Delete user"
                              >
                                <XCircle className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
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
          <motion.div key="payments" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="p-6 rounded-2xl bg-card border border-white/10">
              <h3 className="font-semibold text-white mb-5 flex items-center gap-2">
                <Clock className="w-4 h-4 text-yellow-400" />
                {t("Pending Payment Verifications", "التحقق من المدفوعات المعلقة", "Xaqiijinta Lacag Bixinta Sugaysa")}
              </h3>
              {!payments || (payments as any[]).length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground">{t("No pending payments", "لا توجد مدفوعات معلقة", "Ma jiraan lacag bixin sugeynaysa")}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {(payments as any[]).map((p: any, i: number) => (
                    <div key={i} className={`flex items-center justify-between gap-4 p-4 rounded-xl border ${
                      p.status === "confirmed" ? "bg-green-500/5 border-green-500/20" :
                      p.status === "rejected"  ? "bg-red-500/5 border-red-500/20 opacity-60" :
                      "bg-yellow-500/5 border-yellow-500/20"
                    }`}>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-white text-sm">{p.userName || p.user?.name || "Unknown User"}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {p.userEmail && <span className="mr-2">{p.userEmail}</span>}
                          WhatsApp: {p.whatsappNumber} {p.notes && `• ${p.notes}`}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {p.courseName || `Course #${p.courseId}`} • {new Date(p.createdAt).toLocaleDateString()} •{" "}
                          <span className={`font-medium ${p.status === "confirmed" ? "text-green-400" : p.status === "rejected" ? "text-red-400" : "text-yellow-400"}`}>
                            {p.status}
                          </span>
                        </div>
                        {p.accessCode && (
                          <div className="text-xs text-green-400 mt-1 font-mono">Access code: {p.accessCode}</div>
                        )}
                      </div>
                      {p.status === "pending" && (
                        <div className="flex gap-2 shrink-0">
                          <button
                            onClick={() => confirmPayment({ paymentId: p.id, data: { status: "confirmed", generateCode: true } } as any)}
                            disabled={confirmingPayment}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                          >
                            <CheckCircle className="w-3.5 h-3.5" /> Confirm + Code
                          </button>
                          <button
                            onClick={() => confirmPayment({ paymentId: p.id, data: { status: "rejected" } } as any)}
                            disabled={confirmingPayment}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600/80 text-white text-xs font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
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
            <div className="p-6 rounded-2xl bg-card border border-white/10">
              <h3 className="font-semibold text-white mb-4">{t("Generate New Access Code", "إنشاء رمز وصول جديد", "Abuur Koodh Galitaan Cusub")}</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <select
                  value={newCodeCourseId}
                  onChange={e => setNewCodeCourseId(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary/40 text-sm"
                >
                  <option value="">— Select a course —</option>
                  {coursesForCodes.map(c => (
                    <option key={c.id} value={String(c.id)}>{c.title}</option>
                  ))}
                </select>
                <button
                  onClick={() => {
                    if (!newCodeCourseId) return;
                    createCode({ data: { courseId: Number(newCodeCourseId) } } as any);
                  }}
                  disabled={creatingCode || !newCodeCourseId}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-sm hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all disabled:opacity-50 whitespace-nowrap"
                >
                  {creatingCode ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  Generate
                </button>
              </div>
              {coursesForCodes.length === 0 && (
                <p className="text-xs text-muted-foreground mt-2">Add courses first before generating access codes.</p>
              )}
            </div>

            <div className="p-6 rounded-2xl bg-card border border-white/10">
              <h3 className="font-semibold text-white mb-4">{t("All Access Codes", "جميع رموز الوصول", "Dhammaan Koodhada Galitaanka")}</h3>
              {!codes || (codes as any[]).length === 0 ? (
                <div className="text-center py-12">
                  <Key className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground">{t("No codes created yet", "لا توجد رموز بعد", "Koodhad wali ma abuurin")}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {(codes as any[]).map((code: any, i: number) => (
                    <div key={i} className={`flex items-center justify-between gap-4 p-4 rounded-xl border ${code.isUsed || !code.isActive ? "bg-white/5 border-white/5 opacity-60" : "bg-green-500/5 border-green-500/20"}`}>
                      <div>
                        <code className="font-mono font-bold text-white text-sm tracking-widest">{code.code}</code>
                        <div className="text-xs text-muted-foreground mt-0.5">
                          {code.courseName || `Course #${code.courseId}`} •{" "}
                          {code.isUsed ? `Used${code.usedByEmail ? ` by ${code.usedByEmail}` : ""}` : code.isActive ? "Available" : "Deactivated"}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard label="Total Users"       value={analyticsData?.totalUsers ?? "—"}        icon={Users}      color="text-blue-400"   bg="bg-blue-500/10" />
              <StatCard label="Total Courses"     value={analyticsData?.totalCourses ?? "—"}      icon={BookOpen}   color="text-purple-400" bg="bg-purple-500/10" />
              <StatCard label="Total Enrollments" value={analyticsData?.totalEnrollments ?? "—"}  icon={TrendingUp} color="text-green-400"  bg="bg-green-500/10" />
              <StatCard label="Confirmed Payments" value={analyticsData?.confirmedPayments ?? "—"} icon={CreditCard} color="text-yellow-400" bg="bg-yellow-500/10" />
            </div>

            {analyticsData?.topCourses && analyticsData.topCourses.length > 0 && (
              <div className="p-6 rounded-2xl bg-card border border-white/10">
                <h3 className="font-semibold text-white mb-5">Top Courses by Enrollment</h3>
                <div className="space-y-4">
                  {analyticsData.topCourses.map((c, i) => {
                    const max = Math.max(...analyticsData.topCourses.map(x => x.enrolledCount), 1);
                    return (
                      <div key={c.id} className="flex items-center gap-4">
                        <span className="text-muted-foreground text-sm font-mono w-5 shrink-0">#{i + 1}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-foreground truncate">{c.title}</span>
                            <span className="text-sm text-muted-foreground shrink-0 ml-2">{c.enrolledCount.toLocaleString()} students</span>
                          </div>
                          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all"
                              style={{ width: `${(c.enrolledCount / max) * 100}%` }}
                            />
                          </div>
                        </div>
                        <span className="text-sm text-muted-foreground shrink-0">${c.price}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {analyticsData?.recentUsers && analyticsData.recentUsers.length > 0 && (
              <div className="p-6 rounded-2xl bg-card border border-white/10">
                <h3 className="font-semibold text-white mb-4">Recent Registrations</h3>
                <div className="space-y-2">
                  {analyticsData.recentUsers.map((u, i) => (
                    <div key={u.id} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/8 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {(u.name || "U")[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-white font-medium truncate">{u.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{u.email}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${
                          u.role === "admin"
                            ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
                            : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                        }`}>{u.role}</span>
                        <p className="text-xs text-muted-foreground mt-1">{new Date(u.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!analyticsData && (
              <div className="flex items-center gap-3 p-6 rounded-2xl bg-card border border-white/10 text-muted-foreground">
                <AlertCircle className="w-5 h-5 text-yellow-400" />
                <span className="text-sm">Analytics data not available. Make sure you are authenticated as admin.</span>
              </div>
            )}
          </motion.div>
        )}

        {/* ── CERTIFICATES ── */}
        {tab === "certificates" && (
          <motion.div key="certificates" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Certificate Management</h3>
                <p className="text-sm text-muted-foreground mt-0.5">View, verify and manage student certificates</p>
              </div>
              <button onClick={() => refetchCerts()} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-white transition-colors">
                <RefreshCw className="w-3.5 h-3.5" /> Refresh
              </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Total Issued"     value={adminCerts?.length ?? "—"}                              icon={Award}        color="text-yellow-400" bg="bg-yellow-500/10" />
              <StatCard label="Unique Students"  value={adminCerts ? new Set(adminCerts.map(c => c.userId)).size : "—"} icon={Users}   color="text-blue-400"   bg="bg-blue-500/10" />
              <StatCard label="Courses Covered"  value={adminCerts ? new Set(adminCerts.map(c => c.courseId)).size : "—"} icon={BookOpen} color="text-purple-400" bg="bg-purple-500/10" />
              <StatCard label="Latest"           value={adminCerts?.[0] ? new Date(adminCerts[0].issuedAt).toLocaleDateString() : "—"} icon={CheckCircle} color="text-green-400" bg="bg-green-500/10" />
            </div>

            {/* Certificates list */}
            <div className="p-6 rounded-2xl bg-card border border-white/10">
              <h4 className="font-semibold text-white mb-4">All Issued Certificates</h4>
              {!adminCerts || adminCerts.length === 0 ? (
                <div className="text-center py-12">
                  <Award className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
                  <p className="text-muted-foreground text-sm">No certificates issued yet. Certificates are created when students complete courses.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        {["Student", "Email", "Course", "Issued", "Certificate ID"].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {adminCerts.map((cert, i) => (
                        <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="px-4 py-3 text-white text-sm font-medium">{cert.studentName}</td>
                          <td className="px-4 py-3 text-muted-foreground text-sm">{cert.studentEmail}</td>
                          <td className="px-4 py-3 text-muted-foreground text-sm truncate max-w-[160px]">{cert.courseName}</td>
                          <td className="px-4 py-3 text-muted-foreground text-sm">{new Date(cert.issuedAt).toLocaleDateString()}</td>
                          <td className="px-4 py-3">
                            <code className="font-mono text-[10px] text-primary tracking-widest">{cert.certId}</code>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Verify widget */}
            <CertVerifyWidget />
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
