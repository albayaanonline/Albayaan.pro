import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useGetAdminStats, useGetAdminUsers, useGetAdminPayments,
  useGetAdminCodes, useConfirmPayment, useCreateCode, useDeactivateCode
} from "@/lib/api-client";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import {
  Users, BookOpen, CreditCard, Key, CheckCircle, XCircle, Loader2,
  Plus, TrendingUp, Clock, Search, Edit2, Trash2, Eye, BarChart2,
  Shield, Star, Save, X, Award, RefreshCw, AlertCircle, Globe,
  GraduationCap, DollarSign, Zap
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getApiUrl } from "@/lib/env";

type AdminTab = "overview" | "courses" | "users" | "payments" | "codes" | "analytics" | "certificates";

interface CourseFormData {
  title: string;
  titleAr: string;
  titleSo: string;
  language: "english" | "arabic" | "multilingual";
  level: "beginner" | "intermediate" | "advanced";
  price: number;
  duration: string;
  description: string;
  descriptionAr: string;
  descriptionSo: string;
  thumbnailUrl: string;
}

const DEFAULT_FORM: CourseFormData = {
  title: "", titleAr: "", titleSo: "", language: "english", level: "beginner",
  price: 15, duration: "8 weeks", description: "", descriptionAr: "", descriptionSo: "", thumbnailUrl: "",
};

async function adminFetch(path: string, opts: RequestInit = {}) {
  const res = await fetch(getApiUrl(path), {
    ...opts,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...opts.headers },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

function useAdminCourses() {
  return useQuery({
    queryKey: ["admin-courses"],
    queryFn: () => adminFetch("/admin/courses"),
    staleTime: 0,
  });
}

function useCreateCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: CourseFormData) => adminFetch("/admin/courses", { method: "POST", body: JSON.stringify(data) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-courses"] }),
  });
}

function useUpdateCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CourseFormData> }) =>
      adminFetch(`/admin/courses/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-courses"] }),
  });
}

function useDeleteCourse() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => adminFetch(`/admin/courses/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-courses"] }),
  });
}

function useAdminAnalytics() {
  return useQuery({
    queryKey: ["admin-analytics"],
    queryFn: () => adminFetch("/admin/analytics"),
    staleTime: 30_000,
  });
}

function StatCard({ icon: Icon, label, value, sub, color, bg }: any) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="p-5 rounded-2xl bg-card border border-white/10 hover:border-white/20 transition-colors">
      <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center mb-3`}>
        <Icon className={`w-5 h-5 ${color}`} />
      </div>
      <div className="text-2xl font-black text-white">{value ?? "—"}</div>
      <div className="text-xs text-muted-foreground mt-1">{label}</div>
      {sub && <div className="text-xs text-green-400 mt-0.5">{sub}</div>}
    </motion.div>
  );
}

function CourseForm({ initial, onSave, onCancel, isSaving }: {
  initial?: Partial<CourseFormData>;
  onSave: (d: CourseFormData) => void;
  onCancel: () => void;
  isSaving?: boolean;
}) {
  const [form, setForm] = useState<CourseFormData>({ ...DEFAULT_FORM, ...initial });
  const set = (k: keyof CourseFormData, v: any) => setForm(f => ({ ...f, [k]: v }));

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-2xl bg-card border border-primary/30 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1">Title (English) *</label>
          <input value={form.title} onChange={e => set("title", e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 text-sm"
            placeholder="Course title in English" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1">Title (Arabic)</label>
          <input value={form.titleAr} onChange={e => set("titleAr", e.target.value)} dir="rtl"
            className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 text-sm"
            placeholder="عنوان الدورة بالعربية" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1">Language</label>
          <select value={form.language} onChange={e => set("language", e.target.value as any)}
            className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary/50 text-sm">
            <option value="english">🇬🇧 English</option>
            <option value="arabic">🇸🇦 Arabic</option>
            <option value="multilingual">🌐 Multilingual</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1">Level</label>
          <select value={form.level} onChange={e => set("level", e.target.value as any)}
            className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary/50 text-sm">
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1">Price (USD)</label>
          <input type="number" value={form.price} onChange={e => set("price", Number(e.target.value))} min={0}
            className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary/50 text-sm" />
        </div>
        <div>
          <label className="block text-xs font-semibold text-muted-foreground mb-1">Duration</label>
          <input value={form.duration} onChange={e => set("duration", e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 text-sm"
            placeholder="e.g. 8 weeks" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-muted-foreground mb-1">Thumbnail URL (Unsplash or image URL)</label>
        <input value={form.thumbnailUrl} onChange={e => set("thumbnailUrl", e.target.value)}
          className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 text-sm"
          placeholder="https://images.unsplash.com/photo-...?w=800&q=80" />
        {form.thumbnailUrl && (
          <img src={form.thumbnailUrl} alt="Preview" className="mt-2 w-full h-24 object-cover rounded-xl opacity-80" />
        )}
      </div>
      <div>
        <label className="block text-xs font-semibold text-muted-foreground mb-1">Description (English)</label>
        <textarea value={form.description} onChange={e => set("description", e.target.value)} rows={3}
          className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 text-sm resize-none"
          placeholder="Course description..." />
      </div>
      <div>
        <label className="block text-xs font-semibold text-muted-foreground mb-1">Description (Arabic)</label>
        <textarea value={form.descriptionAr} onChange={e => set("descriptionAr", e.target.value)} rows={3} dir="rtl"
          className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 text-sm resize-none"
          placeholder="وصف الدورة..." />
      </div>
      <div className="flex gap-3 pt-2">
        <button onClick={() => onSave(form)} disabled={isSaving || !form.title}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-sm hover:opacity-90 transition-all disabled:opacity-50">
          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Course
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
  const [newCodeCourseId, setNewCodeCourseId] = useState("1");
  const [courseSearch, setCourseSearch] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<number | null>(null);
  const [deletingCourseId, setDeletingCourseId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  const showToast = useCallback((msg: string, type: "success" | "error" = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const { data: stats, refetch: refetchStats } = useGetAdminStats();
  const { data: users }    = useGetAdminUsers({ query: { enabled: tab === "users" } });
  const { data: payments, refetch: refetchPayments } = useGetAdminPayments({ query: { enabled: tab === "payments" } });
  const { data: codes, refetch: refetchCodes } = useGetAdminCodes({ query: { enabled: tab === "codes" } });
  const { data: adminCourses, isLoading: loadingCourses, refetch: refetchCourses } = useAdminCourses();
  const { data: analytics } = useAdminAnalytics();

  const { mutate: confirmPayment, isPending: confirmingPayment } = useConfirmPayment({
    mutation: { onSuccess: () => { refetchPayments(); showToast("Payment confirmed!"); } },
  });
  const { mutate: createCode, isPending: creatingCode } = useCreateCode({
    mutation: { onSuccess: () => { refetchCodes(); showToast("Access code generated!"); } },
  });
  const { mutate: deactivateCode } = useDeactivateCode({
    mutation: { onSuccess: () => { refetchCodes(); showToast("Code deactivated."); } },
  });

  const { mutate: createCourse, isPending: creatingCourse } = useCreateCourse();
  const { mutate: updateCourse, isPending: updatingCourse } = useUpdateCourse();
  const { mutate: deleteCourse, isPending: deletingCourse } = useDeleteCourse();

  const TABS: { id: AdminTab; label: string; icon: any }[] = [
    { id: "overview",      label: "Overview",      icon: TrendingUp },
    { id: "courses",       label: "Courses",       icon: BookOpen },
    { id: "users",         label: "Users",         icon: Users },
    { id: "payments",      label: "Payments",      icon: CreditCard },
    { id: "codes",         label: "Codes",         icon: Key },
    { id: "analytics",     label: "Analytics",     icon: BarChart2 },
    { id: "certificates",  label: "Certificates",  icon: Award },
  ];

  const filteredCourses = (adminCourses ?? []).filter((c: any) =>
    !courseSearch || c.title.toLowerCase().includes(courseSearch.toLowerCase()) || (c.titleAr || "").includes(courseSearch)
  );

  const editingCourse = editingCourseId ? (adminCourses ?? []).find((c: any) => c.id === editingCourseId) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: "50%" }}
            animate={{ opacity: 1, y: 0, x: "50%" }}
            exit={{ opacity: 0, y: -20, x: "50%" }}
            className={`fixed top-4 right-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-bold shadow-2xl ${
              toast.type === "success" ? "bg-green-600 text-white" : "bg-red-600 text-white"
            }`}
          >
            {toast.type === "success" ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-black text-white">Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">Al-Bayaan College — Platform Management</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => { refetchStats(); refetchCourses(); }} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-sm text-muted-foreground hover:bg-white/10 transition-all">
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-green-500/10 border border-green-500/20">
              <Shield className="w-4 h-4 text-green-400" />
              <span className="text-green-400 text-sm font-bold">Admin</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button key={id} onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              tab === id
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]"
                : "bg-white/5 border border-white/10 text-muted-foreground hover:bg-white/10"
            }`}>
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {tab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={Users}      label="Total Students"     value={stats?.totalUsers}     color="text-blue-400"   bg="bg-blue-500/10"   />
            <StatCard icon={BookOpen}   label="Courses in DB"      value={stats?.totalCourses}   color="text-purple-400" bg="bg-purple-500/10" />
            <StatCard icon={CreditCard} label="Confirmed Payments" value={stats?.confirmedPayments} sub={`$${Math.round(stats?.revenueEstimate ?? 0)} revenue est.`} color="text-green-400" bg="bg-green-500/10" />
            <StatCard icon={Key}        label="Access Codes"       value={stats?.totalCodes}     color="text-yellow-400" bg="bg-yellow-500/10"  />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard icon={Clock}        label="Pending Payments"  value={stats?.pendingPayments} color="text-orange-400" bg="bg-orange-500/10" />
            <StatCard icon={Zap}          label="Used Codes"        value={stats?.usedCodes}       color="text-cyan-400"   bg="bg-cyan-500/10"   />
            <StatCard icon={GraduationCap} label="Enrollments"      value={stats?.totalEnrollments} color="text-pink-400"  bg="bg-pink-500/10"   />
          </div>

          {/* Quick navigation cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-2">
            {[
              { id: "courses", label: "Manage Courses", icon: BookOpen, color: "from-blue-600 to-indigo-600" },
              { id: "payments", label: "Review Payments", icon: CreditCard, color: "from-green-600 to-emerald-600" },
              { id: "codes", label: "Generate Codes", icon: Key, color: "from-yellow-600 to-orange-600" },
              { id: "analytics", label: "View Analytics", icon: BarChart2, color: "from-purple-600 to-pink-600" },
            ].map(card => (
              <button key={card.id} onClick={() => setTab(card.id as AdminTab)}
                className={`flex flex-col items-center gap-3 p-5 rounded-2xl bg-gradient-to-br ${card.color} text-white font-bold text-sm hover:opacity-90 hover:scale-105 transition-all`}>
                <card.icon className="w-7 h-7" />
                {card.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── COURSES ── */}
      {tab === "courses" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="relative flex-1 min-w-[200px] max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={courseSearch} onChange={e => setCourseSearch(e.target.value)}
                placeholder="Search courses..."
                className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-card border border-white/10 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50 text-sm"
              />
            </div>
            <button onClick={() => { setShowAddForm(v => !v); setEditingCourseId(null); }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-sm hover:opacity-90 transition-all">
              <Plus className="w-4 h-4" /> Add Course
            </button>
          </div>

          <AnimatePresence>
            {showAddForm && !editingCourseId && (
              <CourseForm
                onSave={data => createCourse(data, {
                  onSuccess: () => { setShowAddForm(false); showToast("Course created!"); },
                  onError: (e: any) => showToast(e.message, "error"),
                })}
                onCancel={() => setShowAddForm(false)}
                isSaving={creatingCourse}
              />
            )}
          </AnimatePresence>

          {loadingCourses ? (
            <div className="flex items-center justify-center py-20 text-muted-foreground">
              <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading courses...
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="text-center py-20">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-muted-foreground">No courses in database yet. Add courses via the button above or seed the DB.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredCourses.map((course: any) => (
                <motion.div key={course.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                  <AnimatePresence>
                    {editingCourseId === course.id ? (
                      <CourseForm
                        initial={{ ...course, thumbnailUrl: course.thumbnailUrl || "" }}
                        onSave={data => updateCourse({ id: course.id, data }, {
                          onSuccess: () => { setEditingCourseId(null); showToast("Course updated!"); },
                          onError: (e: any) => showToast(e.message, "error"),
                        })}
                        onCancel={() => setEditingCourseId(null)}
                        isSaving={updatingCourse}
                      />
                    ) : (
                      <div className="flex items-center justify-between p-4 rounded-2xl bg-card border border-white/10 hover:border-white/20 transition-all gap-4">
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                          {course.thumbnailUrl ? (
                            <img src={course.thumbnailUrl} alt="" className="w-16 h-12 rounded-xl object-cover shrink-0" />
                          ) : (
                            <div className="w-16 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shrink-0">
                              <BookOpen className="w-5 h-5 text-white" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="font-bold text-foreground truncate">{course.title}</div>
                            <div className="flex items-center gap-3 text-xs text-muted-foreground mt-0.5 flex-wrap">
                              <span className="capitalize">{course.language}</span>
                              <span className="capitalize">{course.level}</span>
                              <span className="font-semibold text-green-400">${course.price}</span>
                              <span>{course.duration}</span>
                              <span>{course.lessonCount} lessons</span>
                              <span className="text-blue-400">{course.enrolledCount} enrolled</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button onClick={() => { setEditingCourseId(course.id); setShowAddForm(false); }}
                            className="p-2 rounded-xl bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 transition-all">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          {deletingCourseId === course.id ? (
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-red-400 whitespace-nowrap">Delete?</span>
                              <button onClick={() => deleteCourse(course.id, {
                                onSuccess: () => { setDeletingCourseId(null); showToast("Course deleted."); },
                                onError: (e: any) => { setDeletingCourseId(null); showToast(e.message, "error"); },
                              })} disabled={deletingCourse}
                                className="p-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-all">
                                {deletingCourse ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />}
                              </button>
                              <button onClick={() => setDeletingCourseId(null)} className="p-1.5 rounded-lg bg-white/5 text-muted-foreground hover:bg-white/10 transition-all">
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          ) : (
                            <button onClick={() => setDeletingCourseId(course.id)}
                              className="p-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          )}

          <div className="pt-2 p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 text-xs text-muted-foreground">
            <strong className="text-blue-400">Note:</strong> The main course catalog uses static data in <code>src/data/courses.ts</code> for rich lesson content. Courses created here are stored in the database and can be used for access code assignment and enrollment tracking.
          </div>
        </div>
      )}

      {/* ── USERS ── */}
      {tab === "users" && (
        <div className="space-y-3">
          <div className="text-sm text-muted-foreground mb-4">{(users as any[])?.length ?? 0} registered users</div>
          {!(users as any[])?.length ? (
            <div className="text-center py-20 text-muted-foreground"><Users className="w-12 h-12 mx-auto mb-3 opacity-30" /><p>No users yet.</p></div>
          ) : (
            <div className="space-y-2">
              {(users as any[]).map((user: any) => (
                <div key={user.id} className="flex items-center justify-between p-4 rounded-2xl bg-card border border-white/10 hover:border-white/20 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                      {user.name?.[0]?.toUpperCase() ?? "?"}
                    </div>
                    <div>
                      <div className="font-semibold text-foreground text-sm">{user.name}</div>
                      <div className="text-xs text-muted-foreground">{user.email}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{user.enrolledCourses} courses</span>
                    <span className={`px-2.5 py-1 rounded-full font-semibold ${user.role === "admin" ? "bg-purple-500/20 text-purple-400" : "bg-white/10 text-muted-foreground"}`}>
                      {user.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── PAYMENTS ── */}
      {tab === "payments" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-4">
            <div className="text-sm text-muted-foreground">{(payments as any[])?.length ?? 0} total payments</div>
            <button onClick={() => refetchPayments()} className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <RefreshCw className="w-3.5 h-3.5" /> Refresh
            </button>
          </div>
          {!(payments as any[])?.length ? (
            <div className="text-center py-20 text-muted-foreground"><CreditCard className="w-12 h-12 mx-auto mb-3 opacity-30" /><p>No payments yet.</p></div>
          ) : (
            <div className="space-y-2">
              {(payments as any[]).map((p: any) => (
                <div key={p.id} className="p-4 rounded-2xl bg-card border border-white/10 hover:border-white/20 transition-all">
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div>
                      <div className="font-semibold text-foreground text-sm">{p.userName || p.userEmail}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {p.courseName} · WhatsApp: {p.whatsappNumber}
                        {p.accessCode && <span className="ml-2 text-blue-400 font-mono">Code: {p.accessCode}</span>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        p.status === "confirmed" ? "bg-green-500/20 text-green-400 border border-green-500/30" :
                        p.status === "rejected" ? "bg-red-500/20 text-red-400 border border-red-500/30" :
                        "bg-yellow-500/20 text-yellow-400 border border-yellow-500/30"
                      }`}>
                        {p.status}
                      </span>
                      {p.status === "pending" && (
                        <button
                          onClick={() => confirmPayment({ params: { paymentId: p.id }, data: { notes: "", generateCode: true } })}
                          disabled={confirmingPayment}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-green-600/20 border border-green-500/30 text-green-400 text-xs font-bold hover:bg-green-600/30 transition-all disabled:opacity-50"
                        >
                          {confirmingPayment ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />}
                          Confirm + Generate Code
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── CODES ── */}
      {tab === "codes" && (
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-card border border-white/10">
            <h3 className="font-bold text-foreground mb-4">Generate New Access Code</h3>
            <div className="flex gap-3 flex-wrap">
              <div className="flex-1 min-w-[140px]">
                <label className="block text-xs text-muted-foreground mb-1">Course ID</label>
                <input
                  type="number" value={newCodeCourseId} onChange={e => setNewCodeCourseId(e.target.value)} min={1}
                  className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary/50 text-sm"
                  placeholder="Course ID"
                />
              </div>
              <button
                onClick={() => createCode({ data: { courseId: Number(newCodeCourseId) } })}
                disabled={creatingCode || !newCodeCourseId}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-sm mt-5 hover:opacity-90 disabled:opacity-50"
              >
                {creatingCode ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                Generate Code
              </button>
            </div>
          </div>

          {!(codes as any[])?.length ? (
            <div className="text-center py-20 text-muted-foreground"><Key className="w-12 h-12 mx-auto mb-3 opacity-30" /><p>No access codes yet.</p></div>
          ) : (
            <div className="space-y-2">
              {(codes as any[]).map((code: any) => (
                <div key={code.id} className="flex items-center justify-between p-4 rounded-2xl bg-card border border-white/10 hover:border-white/20 transition-all flex-wrap gap-3">
                  <div>
                    <div className="font-mono font-bold text-foreground">{code.code}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {code.courseName}
                      {code.usedByEmail && <span className="ml-2 text-blue-400">Used by: {code.usedByEmail}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      code.isUsed ? "bg-gray-500/20 text-gray-400" :
                      code.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"
                    }`}>
                      {code.isUsed ? "Used" : code.isActive ? "Active" : "Inactive"}
                    </span>
                    {code.isActive && !code.isUsed && (
                      <button onClick={() => deactivateCode({ params: { codeId: code.id } })}
                        className="px-3 py-1 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-all">
                        Deactivate
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── ANALYTICS ── */}
      {tab === "analytics" && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={Users}        label="Total Users"        value={analytics?.totalUsers}       color="text-blue-400"   bg="bg-blue-500/10"   />
            <StatCard icon={BookOpen}     label="Total Courses"      value={analytics?.totalCourses}     color="text-purple-400" bg="bg-purple-500/10" />
            <StatCard icon={GraduationCap} label="Total Enrollments" value={analytics?.totalEnrollments} color="text-green-400"  bg="bg-green-500/10"  />
            <StatCard icon={DollarSign}   label="Confirmed Sales"    value={analytics?.confirmedPayments} color="text-yellow-400" bg="bg-yellow-500/10" />
          </div>

          {analytics?.topCourses?.length > 0 && (
            <div className="p-6 rounded-2xl bg-card border border-white/10">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2"><Star className="w-4 h-4 text-yellow-400" /> Top Courses by Enrollment</h3>
              <div className="space-y-3">
                {analytics.topCourses.map((c: any, i: number) => (
                  <div key={c.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-black text-muted-foreground w-5">{i + 1}.</span>
                      <span className="font-semibold text-foreground text-sm">{c.title}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="text-green-400 font-bold">${c.price}</span>
                      <span>{c.enrolledCount} enrolled</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {analytics?.recentUsers?.length > 0 && (
            <div className="p-6 rounded-2xl bg-card border border-white/10">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2"><Users className="w-4 h-4 text-blue-400" /> Recent Users</h3>
              <div className="space-y-2">
                {analytics.recentUsers.map((u: any) => (
                  <div key={u.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {u.name?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-foreground">{u.name}</div>
                        <div className="text-xs text-muted-foreground">{u.email}</div>
                      </div>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${u.role === "admin" ? "bg-purple-500/20 text-purple-400" : "bg-white/10 text-muted-foreground"}`}>
                      {u.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── CERTIFICATES ── */}
      {tab === "certificates" && (
        <div className="space-y-4">
          <div className="p-8 rounded-2xl bg-card border border-white/10 text-center">
            <Award className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            <h3 className="text-xl font-black text-foreground mb-2">Certificate Management</h3>
            <p className="text-muted-foreground text-sm mb-6 max-w-md mx-auto">
              Certificates are automatically generated when students complete a course. Use the verification page to confirm certificate authenticity.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-left">
                <div className="text-sm font-bold text-foreground mb-1">Certificate Format</div>
                <div className="text-xs text-muted-foreground">ALBAYAAN-XXXX-XXXX-YEAR</div>
              </div>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-left">
                <div className="text-sm font-bold text-foreground mb-1">Verify Certificate</div>
                <a href="/verify" className="text-xs text-blue-400 hover:underline">albayaan.pro/verify</a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
