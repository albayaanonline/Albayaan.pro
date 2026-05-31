import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useGetAdminStats, useGetAdminUsers, useGetAdminPayments,
  useGetAdminCodes, useConfirmPayment, useCreateCode, useDeactivateCode
} from "@/lib/api-client";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import {
  Users, BookOpen, CreditCard, Key, CheckCircle, XCircle, Loader2,
  Plus, TrendingUp, Clock, Search, Edit2, Trash2, Eye, BarChart2,
  Upload, Globe, Shield, Star, ChevronDown, ChevronUp, Save, X, Award, Download, RefreshCw,
  AlertTriangle, UserX, Radio, EyeOff, UserCog
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from "recharts";

type AdminTab = "overview" | "courses" | "users" | "payments" | "codes" | "analytics" | "certificates";

interface CourseFormData {
  title: string;
  titleAr: string;
  language: "english" | "arabic" | "multilingual";
  level: "beginner" | "intermediate" | "advanced";
  price: number;
  duration: string;
  description: string;
  descriptionAr: string;
}

const DEFAULT_FORM: CourseFormData = {
  title: "", titleAr: "", language: "english", level: "beginner",
  price: 15, duration: "8 weeks", description: "", descriptionAr: "",
};

function StatCard({ icon: Icon, label, value, color, bg }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-5 rounded-2xl bg-card border border-white/10">
      <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div className="text-2xl font-black text-white">{value}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
    </motion.div>
  );
}

function CourseForm({
  initial, onSave, onCancel
}: { initial?: Partial<CourseFormData>; onSave: (d: CourseFormData) => void; onCancel: () => void }) {
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
            <option value="multilingual">🌐 Multilingual</option>
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
            className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary/50 text-sm"
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

      <div className="flex gap-3 pt-2">
        <button onClick={() => onSave(form)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-sm hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all">
          <Save className="w-4 h-4" /> Save Course
        </button>
        <button onClick={onCancel}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-muted-foreground font-medium text-sm hover:bg-white/10 transition-all">
          <X className="w-4 h-4" /> Cancel
        </button>
      </div>
    </motion.div>
  );
}

export default function AdminDashboard() {
  const { t } = useLanguage();
  const [tab, setTab] = useState<AdminTab>("overview");
  const [newCode, setNewCode] = useState("");
  const [newCodeCourseId, setNewCodeCourseId] = useState("1");
  const [courseSearch, setCourseSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<number | null>(null);
  const [deletingCourse, setDeletingCourse] = useState<number | null>(null);
  const [expandedLesson, setExpandedLesson] = useState<number | null>(null);
  const [userSearch, setUserSearch] = useState("");
  const [deletingUser, setDeletingUser] = useState<number | null>(null);
  const [togglingPublish, setTogglingPublish] = useState<number | null>(null);

  const queryClient = useQueryClient();
  const { data: stats }    = useGetAdminStats();
  const { data: users, refetch: refetchUsers }    = useGetAdminUsers();
  const { data: payments, refetch: refetchPayments } = useGetAdminPayments();
  const { data: codes,    refetch: refetchCodes }    = useGetAdminCodes();

  const { mutate: confirmPayment, isPending: confirmingPayment } = useConfirmPayment({
    mutation: { onSuccess: () => refetchPayments() },
  });
  const { mutate: createCode, isPending: creatingCode } = useCreateCode({
    mutation: { onSuccess: () => { refetchCodes(); setNewCode(""); } },
  });
  const { mutate: deactivateCode } = useDeactivateCode({
    mutation: { onSuccess: () => refetchCodes() },
  });

  const { data: adminCoursesData, refetch: refetchCourses } = useQuery({
    queryKey: ["admin-courses"],
    queryFn: async () => {
      const res = await fetch("/api/admin/courses", { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
  });
  const apiCourses: any[] = adminCoursesData ?? [];

  const { data: adminCertsData, refetch: refetchCerts } = useQuery({
    queryKey: ["admin-certificates"],
    queryFn: async () => {
      const res = await fetch("/api/admin/certificates", { credentials: "include" });
      if (!res.ok) return [];
      return res.json();
    },
    enabled: tab === "certificates",
  });
  const adminCerts: any[] = adminCertsData ?? [];

  const handleDeleteUser = async (userId: number) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE", credentials: "include" });
      if (res.ok) { setDeletingUser(null); refetchUsers(); }
    } catch {}
  };

  const filteredUsers = useMemo(() => {
    const list = (users as any[]) || [];
    if (!userSearch) return list;
    const q = userSearch.toLowerCase();
    return list.filter((u: any) => u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q));
  }, [users, userSearch]);

  const TABS: { id: AdminTab; label: string; icon: any }[] = [
    { id: "overview",      label: t("Overview",      "نظرة عامة",      "Dulmar"),             icon: TrendingUp },
    { id: "courses",       label: t("Courses",       "الدورات",        "Koorsooyinka"),       icon: BookOpen },
    { id: "users",         label: t("Users",         "المستخدمون",     "Isticmaalayaasha"),   icon: Users },
    { id: "payments",      label: t("Payments",      "المدفوعات",      "Lacag Bixinta"),      icon: CreditCard },
    { id: "codes",         label: t("Codes",         "الرموز",         "Koodhada"),           icon: Key },
    { id: "analytics",     label: t("Analytics",     "التحليلات",      "Falanqaynta"),        icon: BarChart2 },
    { id: "certificates",  label: t("Certificates",  "الشهادات",       "Shahaadooyinka"),     icon: Award },
  ];

  const filteredCourses = apiCourses.filter((c: any) =>
    !courseSearch ||
    (c.title ?? "").toLowerCase().includes(courseSearch.toLowerCase()) ||
    (c.titleAr ?? "").includes(courseSearch)
  );

  const handleSaveCourse = async (data: CourseFormData) => {
    try {
      const method = editingCourse ? "PUT" : "POST";
      const url = editingCourse ? `/api/admin/courses/${editingCourse}` : "/api/admin/courses";
      await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });
      await refetchCourses();
    } catch {}
    setShowAddForm(false);
    setEditingCourse(null);
  };

  const handleDeleteCourse = async (id: number) => {
    try {
      await fetch(`/api/admin/courses/${id}`, { method: "DELETE", credentials: "include" });
      await refetchCourses();
    } catch {}
    setDeletingCourse(null);
  };

  const handleTogglePublish = async (course: any) => {
    setTogglingPublish(course.id);
    try {
      await fetch(`/api/admin/courses/${course.id}/publish`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ isPublished: !course.isPublished }),
      });
      await refetchCourses();
    } catch {}
    setTogglingPublish(null);
  };

  const statsData = stats as any;

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
              <StatCard icon={Users}      label={t("Total Users", "إجمالي المستخدمين", "Wadarta Isticmaalayaasha")} value={statsData?.totalUsers ?? 0}       color="text-blue-400"   bg="bg-blue-500/10" />
              <StatCard icon={BookOpen}   label={t("Courses",     "الدورات",            "Koorsooyinka")}           value={statsData?.totalCourses ?? apiCourses.length} color="text-purple-400" bg="bg-purple-500/10" />
              <StatCard icon={CreditCard} label={t("Pending",     "المعلقة",            "Sugaya")}                 value={statsData?.pendingPayments ?? 0}    color="text-yellow-400" bg="bg-yellow-500/10" />
              <StatCard icon={Award}      label={t("Certificates","الشهادات",           "Shahaadooyinka")}         value={statsData?.totalCertificates ?? 0}  color="text-green-400"  bg="bg-green-500/10" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <StatCard icon={BookOpen}   label={t("Published",   "المنشورة",           "La Daabacay")}            value={statsData?.publishedCourses ?? 0}   color="text-cyan-400"   bg="bg-cyan-500/10" />
              <StatCard icon={Star}       label={t("Lessons",     "الدروس",             "Casharrada")}             value={statsData?.totalLessons ?? 0}       color="text-orange-400" bg="bg-orange-500/10" />
              <StatCard icon={CheckCircle} label={t("Confirmed",  "المؤكدة",            "La Xaqiijiyay")}          value={statsData?.confirmedPayments ?? 0}  color="text-green-400"  bg="bg-green-500/10" />
              <StatCard icon={TrendingUp} label={t("Enrollments", "التسجيلات",          "Diiwaangelinta")}         value={statsData?.totalEnrollments ?? 0}   color="text-violet-400" bg="bg-violet-500/10" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {/* Course language distribution */}
              <div className="p-6 rounded-2xl bg-card border border-white/10">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-400" /> Language Distribution
                </h3>
                {[
                  { lang: "🇬🇧 English", count: apiCourses.filter((c: any) => c.language === "english").length, color: "bg-blue-500" },
                  { lang: "🇸🇦 Arabic",  count: apiCourses.filter((c: any) => c.language === "arabic").length,  color: "bg-green-500" },
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

              {/* Level distribution */}
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
                  className="flex items-center gap-2 px-4 py-2 rounded-xl bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 text-sm font-medium hover:bg-yellow-500/20 transition-colors">
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
              <button onClick={() => { setShowAddForm(!showAddForm); setEditingCourse(null); }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-sm hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all whitespace-nowrap">
                <Plus className="w-4 h-4" /> {showAddForm ? "Cancel" : "Add Course"}
              </button>
            </div>

            {showAddForm && !editingCourse && (
              <CourseForm onSave={handleSaveCourse} onCancel={() => setShowAddForm(false)} />
            )}

            {/* Published / Draft filter summary */}
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
            </div>

            <div className="space-y-3">
              {filteredCourses.length === 0 && (
                <div className="text-center py-16">
                  <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
                  <p className="text-muted-foreground">No courses found.</p>
                  <button onClick={() => { setShowAddForm(true); setEditingCourse(null); }} className="mt-3 text-primary text-sm hover:underline">+ Add your first course</button>
                </div>
              )}
              {filteredCourses.map((course, i) => (
                <motion.div key={course.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                  {/* Course row */}
                  <div className={`p-4 rounded-xl border transition-colors ${course.isPublished ? "bg-card border-white/10 hover:border-white/20" : "bg-white/2 border-white/5 hover:border-white/10"}`}>
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 ${
                        course.language === "arabic" ? "bg-gradient-to-br from-green-500 to-emerald-600" :
                        course.level === "advanced" ? "bg-gradient-to-br from-red-500 to-orange-600" :
                        course.level === "intermediate" ? "bg-gradient-to-br from-purple-500 to-indigo-600" :
                        "bg-gradient-to-br from-blue-500 to-cyan-600"
                      }`}>
                        {course.thumbnailUrl
                          ? <img src={course.thumbnailUrl} alt="" className="w-full h-full object-cover rounded-xl" />
                          : <BookOpen className="w-5 h-5 text-white" />
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-white text-sm">{course.title}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs border capitalize ${
                            course.level === "beginner" ? "bg-green-500/20 text-green-400 border-green-500/30"
                            : course.level === "intermediate" ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                            : "bg-red-500/20 text-red-400 border-red-500/30"
                          }`}>{course.level}</span>
                          {/* Published badge */}
                          <span className={`px-2 py-0.5 rounded-full text-xs border font-medium flex items-center gap-1 ${
                            course.isPublished
                              ? "bg-green-500/15 text-green-400 border-green-500/25"
                              : "bg-gray-500/15 text-gray-400 border-gray-500/20"
                          }`}>
                            {course.isPublished
                              ? <><Radio className="w-2.5 h-2.5" /> Published</>
                              : <><EyeOff className="w-2.5 h-2.5" /> Draft</>
                            }
                          </span>
                          <span className="text-xs text-muted-foreground">{course.language === "english" ? "🇬🇧" : course.language === "arabic" ? "🇸🇦" : "🌐"}</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-muted-foreground mt-1">
                          <span>{course.lessonCount ?? 0} lessons</span>
                          <span>${course.price ?? 0}</span>
                          <span className="hidden sm:inline">{(course.enrolledCount ?? 0).toLocaleString()} enrolled</span>
                          {course.duration && <span>{course.duration}</span>}
                        </div>
                        {/* Mobile actions */}
                        <div className="flex items-center gap-2 mt-2 sm:hidden flex-wrap">
                          <button
                            onClick={() => handleTogglePublish(course)}
                            disabled={togglingPublish === course.id}
                            className={`flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium border transition-all ${
                              course.isPublished
                                ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20 hover:bg-yellow-500/20"
                                : "bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20"
                            } disabled:opacity-50`}
                          >
                            {togglingPublish === course.id ? <Loader2 className="w-3 h-3 animate-spin" /> : course.isPublished ? <EyeOff className="w-3 h-3" /> : <Radio className="w-3 h-3" />}
                            {course.isPublished ? "Unpublish" : "Publish"}
                          </button>
                          <button
                            onClick={() => setExpandedLesson(expandedLesson === course.id ? null : course.id)}
                            className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-muted-foreground hover:text-white hover:bg-white/10 transition-all"
                          >
                            {expandedLesson === course.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                          </button>
                          <button
                            onClick={() => { setEditingCourse(course.id); setShowAddForm(true); }}
                            className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition-all"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeletingCourse(course.id)}
                            className="p-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      {/* Desktop right actions */}
                      <div className="hidden sm:flex items-center gap-2 shrink-0">
                        {/* Publish/Unpublish toggle */}
                        <button
                          onClick={() => handleTogglePublish(course)}
                          disabled={togglingPublish === course.id}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                            course.isPublished
                              ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20 hover:bg-yellow-500/20"
                              : "bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20"
                          } disabled:opacity-50 whitespace-nowrap`}
                        >
                          {togglingPublish === course.id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : course.isPublished ? (
                            <><EyeOff className="w-3.5 h-3.5" /> Unpublish</>
                          ) : (
                            <><Radio className="w-3.5 h-3.5" /> Publish</>
                          )}
                        </button>
                        <button
                          onClick={() => setExpandedLesson(expandedLesson === course.id ? null : course.id)}
                          className="p-2 rounded-lg bg-white/5 border border-white/10 text-muted-foreground hover:text-white hover:bg-white/10 transition-all"
                          title="View lessons"
                        >
                          {expandedLesson === course.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={() => { setEditingCourse(course.id); setShowAddForm(true); }}
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
                          initial={{ title: course.title, titleAr: course.titleAr, language: course.language, level: course.level, price: course.price, duration: course.duration, description: course.description, descriptionAr: course.descriptionAr }}
                          onSave={handleSaveCourse}
                          onCancel={() => { setEditingCourse(null); setShowAddForm(false); }}
                        />
                      </div>
                    )}

                    {/* Lesson count summary */}
                    <AnimatePresence>
                      {expandedLesson === course.id && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                          <div className="mt-4 p-4 rounded-xl bg-white/3 border border-white/10 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <BookOpen className="w-4 h-4 text-blue-400" />
                              <span>{course.lessonCount ?? 0} lessons in this course</span>
                            </div>
                          </div>
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
          <motion.div key="users" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
            {/* Summary stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard icon={Users} label="Total Users" value={(users as any[])?.length ?? 0} color="text-blue-400" bg="bg-blue-500/10" />
              <StatCard icon={Shield} label="Admins" value={(users as any[])?.filter((u:any) => u.role === "admin").length ?? 0} color="text-purple-400" bg="bg-purple-500/10" />
              <StatCard icon={BookOpen} label="Avg. Courses" value={Math.round(((users as any[])?.reduce((s:number,u:any) => s + (u.enrolledCourses||0), 0) ?? 0) / Math.max((users as any[])?.length ?? 1, 1))} color="text-green-400" bg="bg-green-500/10" />
              <StatCard icon={TrendingUp} label="This Week" value={(users as any[])?.filter((u:any) => new Date(u.createdAt) > new Date(Date.now() - 7 * 86400000)).length ?? 0} color="text-yellow-400" bg="bg-yellow-500/10" />
            </div>

            <div className="p-6 rounded-2xl bg-card border border-white/10">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                <h3 className="font-semibold text-white flex items-center gap-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  {t("Registered Users", "المستخدمون المسجلون", "Isticmaalayaasha Diiwaan Galiyay")}
                  {(users as any[])?.length > 0 && <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold">{(users as any[]).length}</span>}
                </h3>
                <div className="relative w-full sm:w-60">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    value={userSearch}
                    onChange={e => setUserSearch(e.target.value)}
                    className="pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary/40 text-sm w-full"
                    placeholder="Search by name or email…"
                  />
                </div>
              </div>

              {filteredUsers.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground">
                    {userSearch ? t("No users match your search", "لا يوجد مستخدمون يطابقون بحثك", "Ma jiraan isticmaalayaal ku habboon") : t("No users found", "لا يوجد مستخدمون", "Ma jiraan isticmaalayaal")}
                  </p>
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
                    <tbody>
                      {filteredUsers.map((u: any) => (
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
                              u.role === "admin"
                                ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
                                : "bg-blue-500/20 text-blue-400 border-blue-500/30"
                            }`}>{u.role}</span>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground text-sm whitespace-nowrap">
                            {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "-"}
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button
                                onClick={async () => {
                                  const newRole = u.role === "admin" ? "user" : "admin";
                                  await fetch(`/api/admin/users/${u.id}/role`, { method: "PATCH", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ role: newRole }) });
                                  refetchUsers();
                                }}
                                className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 transition-colors"
                                title={u.role === "admin" ? "Demote to user" : "Promote to admin"}
                              >
                                <UserCog className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setDeletingUser(deletingUser === u.id ? null : u.id)}
                                className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                                title="Delete user"
                              >
                                <UserX className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {filteredUsers.map((u: any) => deletingUser === u.id ? (
                        <tr key={`del-${u.id}`}>
                          <td colSpan={6} className="px-4 pb-3">
                            <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                              <div className="flex items-center gap-2 text-red-300 text-sm">
                                <AlertTriangle className="w-4 h-4 shrink-0" />
                                Delete <strong>{u.name || u.email}</strong>? This action cannot be undone.
                              </div>
                              <div className="flex gap-2 shrink-0">
                                <button
                                  onClick={() => handleDeleteUser(u.id)}
                                  className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors"
                                >
                                  Delete
                                </button>
                                <button
                                  onClick={() => setDeletingUser(null)}
                                  className="px-3 py-1.5 rounded-lg bg-white/10 text-muted-foreground text-xs hover:bg-white/20 transition-colors"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ) : null
                            <tr key={`del-${u.id}`}>
                              <td colSpan={6} className="px-4 pb-3">
                                <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                                  <div className="flex items-center gap-2 text-red-300 text-sm">
                                    <AlertTriangle className="w-4 h-4 shrink-0" />
                                    Delete <strong>{u.name || u.email}</strong>? This action cannot be undone.
                                  </div>
                                  <div className="flex gap-2 shrink-0">
                                    <button
                                      onClick={() => handleDeleteUser(u.id)}
                                      className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700 transition-colors"
                                    >
                                      Delete
                                    </button>
                                    <button
                                      onClick={() => setDeletingUser(null)}
                                      className="px-3 py-1.5 rounded-lg bg-white/10 text-muted-foreground text-xs hover:bg-white/20 transition-colors"
                                    >
                                      Cancel
                                    </button>
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
          <motion.div key="payments" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="p-6 rounded-2xl bg-card border border-white/10">
              <h3 className="font-semibold text-white mb-5 flex items-center gap-2">
                <Clock className="w-4 h-4 text-yellow-400" />
                {t("Pending Payment Verifications", "التحقق من المدفوعات المعلقة", "Xaqiijinta Lacag Bixinta Sugaysa")}
              </h3>
              {!payments || (payments as any[]).filter((p: any) => p.status === "pending").length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground">{t("No pending payments", "لا توجد مدفوعات معلقة", "Ma jiraan lacag bixin sugeynaysa")}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {(payments as any[]).filter((p: any) => p.status === "pending").map((p: any, i: number) => (
                    <div key={i} className="flex items-center justify-between gap-4 p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-white text-sm">{p.userName || "Unknown User"}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          WhatsApp: {p.whatsappNumber} {p.notes && `• ${p.notes}`}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {p.courseName || `Course #${p.courseId}`} • {new Date(p.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => confirmPayment({ paymentId: p.id, data: { status: "confirmed" } } as any)}
                          disabled={confirmingPayment}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Confirm
                        </button>
                        <button
                          onClick={() => confirmPayment({ paymentId: p.id, data: { status: "rejected" } } as any)}
                          disabled={confirmingPayment}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-600/80 text-white text-xs font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                          <XCircle className="w-3.5 h-3.5" /> Reject
                        </button>
                      </div>
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
                <select value={newCodeCourseId} onChange={e => setNewCodeCourseId(e.target.value)}
                  className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary/40 text-sm flex-1">
                  {apiCourses.length === 0 && <option value="">No courses yet</option>}
                  {apiCourses.map((c: any) => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
                <button
                  onClick={() => createCode({ data: { courseId: Number(newCodeCourseId) } } as any)}
                  disabled={creatingCode || apiCourses.length === 0}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-sm hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all disabled:opacity-50 whitespace-nowrap"
                >
                  {creatingCode ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  Generate Code
                </button>
              </div>
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
                    <div key={i} className={`flex items-center justify-between gap-4 p-4 rounded-xl border ${code.isUsed ? "bg-white/5 border-white/5 opacity-60" : "bg-green-500/5 border-green-500/20"}`}>
                      <div>
                        <code className="font-mono font-bold text-white text-sm tracking-widest">{code.code}</code>
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
              {[
                { label: "Est. Revenue", value: "$" + apiCourses.reduce((s: number, c: any) => s + (c.enrolledCount ?? 0) * (c.price ?? 0), 0).toLocaleString(), icon: CreditCard, color: "text-green-400", bg: "bg-green-500/10" },
                { label: "Total Students", value: apiCourses.reduce((s: number, c: any) => s + (c.enrolledCount ?? 0), 0).toLocaleString(), icon: Users, color: "text-blue-400", bg: "bg-blue-500/10" },
                { label: "Total Lessons", value: apiCourses.reduce((s: number, c: any) => s + (c.lessonCount ?? 0), 0), icon: BookOpen, color: "text-purple-400", bg: "bg-purple-500/10" },
                { label: "Total Courses", value: apiCourses.length, icon: Star, color: "text-yellow-400", bg: "bg-yellow-500/10" },
              ].map((s, i) => <StatCard key={i} {...s} />)}
            </div>

            {/* Enrollment bar chart */}
            <div className="p-6 rounded-2xl bg-card border border-white/10">
              <h3 className="font-semibold text-white mb-5 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-blue-400" /> Top Courses by Enrollment
              </h3>
              {apiCourses.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground text-sm">No courses to display</div>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={[...apiCourses].sort((a: any, b: any) => (b.enrolledCount ?? 0) - (a.enrolledCount ?? 0)).slice(0, 8).map((c: any) => ({ name: c.title.length > 20 ? c.title.slice(0, 18) + "…" : c.title, students: c.enrolledCount ?? 0 }))} margin={{ top: 4, right: 4, left: -20, bottom: 4 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} interval={0} angle={-20} textAnchor="end" height={48} />
                    <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#fff", fontSize: 12 }} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                    <Bar dataKey="students" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Students" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Category distribution + Level bars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-6 rounded-2xl bg-card border border-white/10">
                <h3 className="font-semibold text-white mb-5 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-purple-400" /> Language Breakdown
                </h3>
                {(() => {
                  const cats: Record<string, number> = {};
                  apiCourses.forEach((c: any) => { const key = c.language ?? "other"; cats[key] = (cats[key] || 0) + 1; });
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
                    margin={{ top: 4, right: 4, left: -20, bottom: 4 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                    <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fill: "#6b7280", fontSize: 10 }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ backgroundColor: "#0f172a", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", color: "#fff", fontSize: 12 }} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
                    <Bar dataKey="courses" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="Courses" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top courses performance */}
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
                <p className="text-sm text-muted-foreground mt-0.5">View and verify student certificates</p>
              </div>
              <button onClick={() => refetchCerts()}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-white transition-colors px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                <RefreshCw className="w-3.5 h-3.5" /> Refresh
              </button>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard label="Total Issued"    value={adminCerts.length}        icon={Award}        color="text-yellow-400" bg="bg-yellow-500/10" />
              <StatCard label="Courses Covered" value={new Set(adminCerts.map((c: any) => c.courseId)).size} icon={BookOpen} color="text-purple-400" bg="bg-purple-500/10" />
              <StatCard label="Students"        value={new Set(adminCerts.map((c: any) => c.userId)).size}   icon={Users}    color="text-blue-400"   bg="bg-blue-500/10" />
              <StatCard label="Unique Courses"  value={apiCourses.length}        icon={TrendingUp}   color="text-green-400"  bg="bg-green-500/10" />
            </div>

            {/* Certificate list */}
            <div className="p-6 rounded-2xl bg-card border border-white/10">
              <h4 className="font-semibold text-white mb-4">All Issued Certificates</h4>
              {adminCerts.length === 0 ? (
                <div className="text-center py-12">
                  <Award className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-40" />
                  <p className="text-muted-foreground text-sm">No certificates have been issued yet.</p>
                  <p className="text-muted-foreground text-xs mt-1">Certificates are auto-issued when students complete a course.</p>
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
                        <div className="font-mono text-xs text-muted-foreground/60 mt-0.5">{cert.certId}</div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-xs text-muted-foreground">{new Date(cert.issuedAt).toLocaleDateString()}</div>
                        <a
                          href={`/verify/${cert.certId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline mt-0.5 inline-block"
                        >
                          Verify →
                        </a>
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
