import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useGetAdminStats, useGetAdminUsers, getGetAdminUsersQueryKey,
  useGetAdminPayments, getGetAdminPaymentsQueryKey,
  useGetAdminCodes, getGetAdminCodesQueryKey,
  useConfirmPayment, useCreateCode, useDeactivateCode,
  type Payment, type AccessCode,
} from "@/lib/api-client";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import {
  Users, BookOpen, CreditCard, Key, CheckCircle, XCircle, Loader2,
  Plus, TrendingUp, Clock, Search, Edit2, Trash2, Eye, BarChart2,
  Upload, Globe, Shield, Star, ChevronDown, ChevronUp, Save, X
} from "lucide-react";
import { COURSES, type Course, type Lesson } from "@/data/courses";

type AdminTab = "overview" | "courses" | "users" | "payments" | "codes" | "analytics";

interface CourseFormData {
  title: string;
  titleAr: string;
  language: "english" | "arabic";
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

function StatCard({ icon: Icon, label, value, color, bg }: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string | number;
  color: string;
  bg: string;
}) {
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
  const set = <K extends keyof CourseFormData>(k: K, v: CourseFormData[K]) => setForm(f => ({ ...f, [k]: v }));

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
          <select value={form.language} onChange={e => set("language", e.target.value as CourseFormData["language"])}
            className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary/50 text-sm">
            <option value="english">🇬🇧 English</option>
            <option value="arabic">🇸🇦 Arabic</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Level</label>
          <select value={form.level} onChange={e => set("level", e.target.value as CourseFormData["level"])}
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

      <div className="border-2 border-dashed border-white/20 rounded-xl p-6 text-center hover:border-primary/40 transition-colors cursor-pointer">
        <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">Click to upload thumbnail / video</p>
        <p className="text-xs text-muted-foreground mt-1">PNG, JPG, MP4 up to 500MB</p>
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
  const [editingCourse, setEditingCourse] = useState<string | null>(null);
  const [deletingCourse, setDeletingCourse] = useState<string | null>(null);
  const [expandedLesson, setExpandedLesson] = useState<string | null>(null);

  const { data: stats } = useGetAdminStats();
  const { data: users } = useGetAdminUsers({
    query: { queryKey: getGetAdminUsersQueryKey(), enabled: tab === "users" },
  });
  const { data: payments, refetch: refetchPayments } = useGetAdminPayments({
    query: { queryKey: getGetAdminPaymentsQueryKey(), enabled: tab === "payments" },
  });
  const { data: codes, refetch: refetchCodes } = useGetAdminCodes({
    query: { queryKey: getGetAdminCodesQueryKey(), enabled: tab === "codes" },
  });

  const { mutate: confirmPayment, isPending: confirmingPayment } = useConfirmPayment({
    mutation: { onSuccess: () => { void refetchPayments(); } },
  });
  const { mutate: createCode, isPending: creatingCode } = useCreateCode({
    mutation: { onSuccess: () => { void refetchCodes(); setNewCode(""); } },
  });
  const { mutate: deactivateCode } = useDeactivateCode({
    mutation: { onSuccess: () => { void refetchCodes(); } },
  });

  const adminStats = stats as { totalUsers?: number; pendingPayments?: number } | undefined;
  const userList = (users ?? []) as Array<{ name?: string; email: string; role: string; createdAt?: string }>;
  const paymentList = (payments ?? []) as Payment[];
  const codeList = (codes ?? []) as AccessCode[];

  const TABS: { id: AdminTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "overview",  label: t("Overview",    "نظرة عامة",         "Dulmar"),           icon: TrendingUp },
    { id: "courses",   label: t("Courses",     "الدورات",           "Koorsooyinka"),     icon: BookOpen },
    { id: "users",     label: t("Users",       "المستخدمون",        "Isticmaalayaasha"), icon: Users },
    { id: "payments",  label: t("Payments",    "المدفوعات",         "Lacag Bixinta"),    icon: CreditCard },
    { id: "codes",     label: t("Codes",       "الرموز",            "Koodhada"),         icon: Key },
    { id: "analytics", label: t("Analytics",   "التحليلات",         "Falanqaynta"),      icon: BarChart2 },
  ];

  const filteredCourses = COURSES.filter((c: Course) =>
    !courseSearch || c.title.toLowerCase().includes(courseSearch.toLowerCase()) || c.titleAr.includes(courseSearch)
  );

  const handleSaveCourse = (data: CourseFormData) => {
    console.log("Save course:", data);
    setShowAddForm(false);
    setEditingCourse(null);
  };

  const handleDeleteCourse = (id: string) => {
    setDeletingCourse(null);
    console.log("Delete course:", id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-white">{t("Admin Dashboard", "لوحة تحكم المسؤول", "Xafiiska Maamulka")}</h1>
            <p className="text-muted-foreground mt-1">{t("Manage your platform", "إدارة منصتك", "Maamul madalkaaaga")}</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20">
            <Shield className="w-4 h-4 text-green-400" />
            <span className="text-green-400 text-sm font-medium">Admin</span>
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
              <StatCard icon={Users}      label={t("Total Users", "إجمالي المستخدمين", "Wadarta Isticmaalayaasha")} value={adminStats?.totalUsers ?? 0}       color="text-blue-400"   bg="bg-blue-500/10" />
              <StatCard icon={BookOpen}   label={t("Courses",     "الدورات",            "Koorsooyinka")}           value={COURSES.length}                      color="text-purple-400" bg="bg-purple-500/10" />
              <StatCard icon={CreditCard} label={t("Pending",     "المعلقة",            "Sugaya")}                 value={adminStats?.pendingPayments ?? 0}    color="text-yellow-400" bg="bg-yellow-500/10" />
              <StatCard icon={Star}       label={t("Avg Rating",  "متوسط التقييم",      "Celceliska Qiimaynta")}   value="4.9★"                                color="text-green-400"  bg="bg-green-500/10" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="p-6 rounded-2xl bg-card border border-white/10">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-blue-400" /> Language Distribution
                </h3>
                {[
                  { lang: "🇬🇧 English", count: COURSES.filter((c: Course) => c.language === "english").length, color: "bg-blue-500" },
                  { lang: "🇸🇦 Arabic",  count: COURSES.filter((c: Course) => c.language === "arabic").length,  color: "bg-green-500" },
                ].map((row, i) => (
                  <div key={i} className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-muted-foreground">{row.lang}</span>
                      <span className="text-white font-medium">{row.count} courses</span>
                    </div>
                    <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className={`h-full ${row.color} rounded-full`} style={{ width: `${(row.count / COURSES.length) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 rounded-2xl bg-card border border-white/10">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <BarChart2 className="w-4 h-4 text-purple-400" /> Level Distribution
                </h3>
                {(["beginner", "intermediate", "advanced"] as const).map((lvl, i) => {
                  const count = COURSES.filter((c: Course) => c.level === lvl).length;
                  const colors = ["bg-green-500", "bg-yellow-500", "bg-red-500"];
                  return (
                    <div key={lvl} className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-muted-foreground capitalize">{lvl}</span>
                        <span className="text-white font-medium">{count} courses</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className={`h-full ${colors[i]} rounded-full`} style={{ width: `${(count / COURSES.length) * 100}%` }} />
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

            <div className="space-y-3">
              {filteredCourses.map((course: Course, i: number) => (
                <motion.div key={course.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                  <div className="p-4 rounded-xl bg-card border border-white/10 hover:border-white/20 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${course.color} flex items-center justify-center text-2xl shrink-0`}>
                        {course.thumbnail}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-bold text-white text-sm">{course.title}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs border capitalize ${
                            course.level === "beginner" ? "bg-green-500/20 text-green-400 border-green-500/30"
                            : course.level === "intermediate" ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                            : "bg-red-500/20 text-red-400 border-red-500/30"
                          }`}>{course.level}</span>
                          <span className="text-xs text-muted-foreground">{course.language === "english" ? "🇬🇧" : "🇸🇦"}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1">
                          <span>{course.lessonCount} lessons</span>
                          <span>${course.price}</span>
                          <span>{course.enrolledCount.toLocaleString()} enrolled</span>
                          <span className="flex items-center gap-0.5"><Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />{course.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
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

                    {editingCourse === course.id && showAddForm && (
                      <div className="mt-4">
                        <CourseForm
                          initial={{
                            title: course.title,
                            titleAr: course.titleAr,
                            language: course.language,
                            level: course.level,
                            price: course.price,
                            duration: course.duration,
                            description: course.description,
                            descriptionAr: course.descriptionAr,
                          }}
                          onSave={handleSaveCourse}
                          onCancel={() => { setEditingCourse(null); setShowAddForm(false); }}
                        />
                      </div>
                    )}

                    <AnimatePresence>
                      {expandedLesson === course.id && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                          <div className="mt-4 space-y-2">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-sm font-semibold text-white">{course.lessonCount} Lessons</h4>
                              <button className="flex items-center gap-1 text-xs text-primary px-3 py-1 rounded-lg bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors">
                                <Plus className="w-3 h-3" /> Add Lesson
                              </button>
                            </div>
                            {course.lessons.map((lesson: Lesson, j: number) => (
                              <div key={lesson.id} className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5 border border-white/5 hover:border-white/10 transition-colors group">
                                <span className="text-xs text-muted-foreground font-mono w-5 shrink-0">{j + 1}</span>
                                <div className="flex-1 min-w-0">
                                  <span className="text-sm text-foreground truncate block">{lesson.title}</span>
                                  <span className="text-xs text-muted-foreground">{lesson.duration} • {lesson.isLocked ? "🔒 Locked" : "🔓 Free"} {lesson.hasQuiz ? "• Quiz" : ""}</span>
                                </div>
                                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <button className="p-1 rounded text-blue-400 hover:bg-blue-500/20 transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
                                  <button className="p-1 rounded text-red-400 hover:bg-red-500/20 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                                </div>
                              </div>
                            ))}
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
          <motion.div key="users" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="p-6 rounded-2xl bg-card border border-white/10">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-white">{t("Registered Users", "المستخدمون المسجلون", "Isticmaalayaasha Diiwaan Galiyay")}</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input className="pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary/40 text-sm w-48" placeholder="Search users..." />
                </div>
              </div>
              {userList.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground">{t("No users found", "لا يوجد مستخدمون", "Ma jiraan isticmaalayaal")}</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        {["Name", "Email", "Role", "Joined", "Actions"].map(h => (
                          <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {userList.map((u, i) => (
                        <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                                {(u.name || "U")[0].toUpperCase()}
                              </div>
                              <span className="text-white text-sm font-medium">{u.name || "-"}</span>
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
                          <td className="px-4 py-3 text-muted-foreground text-sm">{u.createdAt ? new Date(u.createdAt).toLocaleDateString() : "-"}</td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-colors"><Eye className="w-3.5 h-3.5" /></button>
                              <button className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"><XCircle className="w-3.5 h-3.5" /></button>
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
              {paymentList.length === 0 ? (
                <div className="text-center py-12">
                  <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground">{t("No pending payments", "لا توجد مدفوعات معلقة", "Ma jiraan lacag bixin sugeynaysa")}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {paymentList.map((p, i) => (
                    <div key={i} className="flex items-center justify-between gap-4 p-4 rounded-xl bg-yellow-500/5 border border-yellow-500/20">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-white text-sm">{p.userName || "Unknown User"}</div>
                        <div className="text-xs text-muted-foreground mt-1">
                          WhatsApp: {p.whatsappNumber} {p.notes && `• ${p.notes}`}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Course #{p.courseId} • {new Date(p.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button
                          onClick={() => confirmPayment({ paymentId: p.id, data: { generateCode: true } })}
                          disabled={confirmingPayment}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                          <CheckCircle className="w-3.5 h-3.5" /> Confirm
                        </button>
                        <button
                          onClick={() => confirmPayment({ paymentId: p.id, data: { generateCode: false } })}
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
                <input
                  value={newCode}
                  onChange={e => setNewCode(e.target.value.toUpperCase())}
                  placeholder={t("Code (leave blank to auto-generate)", "الرمز (اتركه فارغاً للإنشاء التلقائي)", "Koodhka (ka tag madhan si toos ah u samee)")}
                  className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary/40 text-sm"
                />
                <select value={newCodeCourseId} onChange={e => setNewCodeCourseId(e.target.value)}
                  className="px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary/40 text-sm">
                  {COURSES.map((c: Course) => <option key={c.id} value={c.id}>{c.title}</option>)}
                </select>
                <button
                  onClick={() => createCode({ data: { courseId: Number(newCodeCourseId) } })}
                  disabled={creatingCode}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-sm hover:shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all disabled:opacity-50 whitespace-nowrap"
                >
                  {creatingCode ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                  Generate
                </button>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-white/10">
              <h3 className="font-semibold text-white mb-4">{t("All Access Codes", "جميع رموز الوصول", "Dhammaan Koodhada Galitaanka")}</h3>
              {codeList.length === 0 ? (
                <div className="text-center py-12">
                  <Key className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                  <p className="text-muted-foreground">{t("No codes created yet", "لا توجد رموز بعد", "Koodhad wali ma abuurin")}</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {codeList.map((code, i) => (
                    <div key={i} className={`flex items-center justify-between gap-4 p-4 rounded-xl border ${code.isUsed ? "bg-white/5 border-white/5 opacity-60" : "bg-green-500/5 border-green-500/20"}`}>
                      <div>
                        <code className="font-mono font-bold text-white text-sm tracking-widest">{code.code}</code>
                        <div className="text-xs text-muted-foreground mt-0.5">Course #{code.courseId} • {code.isUsed ? "Used" : "Available"}</div>
                      </div>
                      {!code.isUsed && (
                        <button onClick={() => deactivateCode({ codeId: code.id })}
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
              {[
                { label: "Total Revenue", value: "$" + COURSES.reduce((s: number, c: Course) => s + c.enrolledCount * c.price, 0).toLocaleString(), icon: CreditCard, color: "text-green-400", bg: "bg-green-500/10" },
                { label: "Total Students", value: COURSES.reduce((s: number, c: Course) => s + c.enrolledCount, 0).toLocaleString(), icon: Users, color: "text-blue-400", bg: "bg-blue-500/10" },
                { label: "Total Lessons", value: COURSES.reduce((s: number, c: Course) => s + c.lessonCount, 0), icon: BookOpen, color: "text-purple-400", bg: "bg-purple-500/10" },
                { label: "Avg Rating", value: (COURSES.reduce((s: number, c: Course) => s + c.rating, 0) / COURSES.length).toFixed(1) + "★", icon: Star, color: "text-yellow-400", bg: "bg-yellow-500/10" },
              ].map((s, i) => <StatCard key={i} {...s} />)}
            </div>

            <div className="p-6 rounded-2xl bg-card border border-white/10">
              <h3 className="font-semibold text-white mb-5">Course Performance</h3>
              <div className="space-y-4">
                {[...COURSES].sort((a: Course, b: Course) => b.enrolledCount - a.enrolledCount).map((c: Course, i: number) => (
                  <div key={c.id} className="flex items-center gap-4">
                    <span className="text-muted-foreground text-sm font-mono w-5 shrink-0">#{i + 1}</span>
                    <span className="text-xl shrink-0">{c.thumbnail}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-foreground truncate">{c.title}</span>
                        <span className="text-sm text-muted-foreground shrink-0 ml-2">{c.enrolledCount.toLocaleString()} students</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className={`h-full bg-gradient-to-r ${c.color} rounded-full transition-all`}
                          style={{ width: `${(c.enrolledCount / Math.max(...COURSES.map((x: Course) => x.enrolledCount))) * 100}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground shrink-0">${c.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
