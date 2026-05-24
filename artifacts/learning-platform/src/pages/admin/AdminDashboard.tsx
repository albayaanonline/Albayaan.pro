import { useState } from "react";
import { motion } from "framer-motion";
import { useGetAdminStats, useGetAdminUsers, useGetAdminPayments, useGetAdminCodes, useConfirmPayment, useCreateCode, useDeactivateCode } from "@/lib/api-client";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { Users, BookOpen, CreditCard, Key, CheckCircle, XCircle, Loader2, Plus, TrendingUp, Clock } from "lucide-react";

type AdminTab = "overview" | "users" | "payments" | "codes";

export default function AdminDashboard() {
  const { t } = useLanguage();
  const [tab, setTab] = useState<AdminTab>("overview");
  const [newCode, setNewCode] = useState("");
  const [newCodeCourseId, setNewCodeCourseId] = useState("1");

  const { data: stats } = useGetAdminStats();
  const { data: users } = useGetAdminUsers({ query: { enabled: tab === "users" } });
  const { data: payments, refetch: refetchPayments } = useGetAdminPayments({ query: { enabled: tab === "payments" } });
  const { data: codes, refetch: refetchCodes } = useGetAdminCodes({ query: { enabled: tab === "codes" } });

  const { mutate: confirmPayment, isPending: confirmingPayment } = useConfirmPayment({
    mutation: { onSuccess: () => refetchPayments() },
  });

  const { mutate: createCode, isPending: creatingCode } = useCreateCode({
    mutation: { onSuccess: () => { refetchCodes(); setNewCode(""); } },
  });

  const { mutate: deactivateCode } = useDeactivateCode({
    mutation: { onSuccess: () => refetchCodes() },
  });

  const TABS: { id: AdminTab; label: string; icon: any }[] = [
    { id: "overview", label: t("Overview", "نظرة عامة", "Dulmar"), icon: TrendingUp },
    { id: "users", label: t("Users", "المستخدمون", "Isticmaalayaasha"), icon: Users },
    { id: "payments", label: t("Payments", "المدفوعات", "Lacag Bixinta"), icon: CreditCard },
    { id: "codes", label: t("Access Codes", "رموز الدخول", "Koodhada Galitaanka"), icon: Key },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-black text-white">{t("Admin Dashboard", "لوحة تحكم المسؤول", "Xafiiska Maamulka")}</h1>
        <p className="text-muted-foreground mt-1">{t("Manage your platform", "إدارة منصتك", "Maamul madalkaaaga")}</p>
      </motion.div>

      <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${tab === id ? "bg-primary text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]" : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-white"}`}
          >
            <Icon className="w-4 h-4" /> {label}
          </button>
        ))}
      </div>

      {tab === "overview" && (
        <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Users, label: t("Total Users", "إجمالي المستخدمين", "Wadarta Isticmaalayaasha"), value: (stats as any)?.totalUsers ?? 0, color: "text-blue-400", bg: "bg-blue-500/10" },
              { icon: BookOpen, label: t("Courses", "الدورات", "Koorsooyinka"), value: (stats as any)?.totalCourses ?? 0, color: "text-purple-400", bg: "bg-purple-500/10" },
              { icon: CreditCard, label: t("Pending Payments", "المدفوعات المعلقة", "Lacag Bixin Sugaya"), value: (stats as any)?.pendingPayments ?? 0, color: "text-yellow-400", bg: "bg-yellow-500/10" },
              { icon: Key, label: t("Active Codes", "الرموز النشطة", "Koodhada Firfircoon"), value: ((stats as any)?.totalCodes ?? 0) - ((stats as any)?.usedCodes ?? 0), color: "text-green-400", bg: "bg-green-500/10" },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="p-5 rounded-2xl bg-card border border-white/10">
                <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
                <div className="text-2xl font-black text-white">{s.value}</div>
                <div className="text-xs text-muted-foreground mt-1">{s.label}</div>
              </motion.div>
            ))}
          </div>

          <div className="p-6 rounded-2xl bg-card border border-white/10">
            <h3 className="font-semibold text-white mb-4">{t("Recent Activity", "النشاط الأخير", "Waxqabadka Dhowaan")}</h3>
            <p className="text-muted-foreground text-sm">{t("Visit Payments tab to confirm pending payments.", "انتقل إلى علامة المدفوعات لتأكيد الدفعات المعلقة.", "Tag Lacag Bixinta si aad u xaqiijiso lacag bixinta sugaysa.")}</p>
          </div>
        </motion.div>
      )}

      {tab === "users" && (
        <motion.div key="users" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="rounded-2xl bg-card border border-white/10 overflow-hidden">
            <div className="p-5 border-b border-white/10">
              <h3 className="font-semibold text-white">{t("All Users", "جميع المستخدمين", "Dhammaan Isticmaalayaasha")}</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-muted-foreground text-xs uppercase tracking-wider">
                    <th className="text-left px-5 py-3">{t("Name", "الاسم", "Magaca")}</th>
                    <th className="text-left px-5 py-3">{t("Email", "البريد", "Email")}</th>
                    <th className="text-left px-5 py-3">{t("Role", "الدور", "Doorka")}</th>
                    <th className="text-left px-5 py-3">{t("Joined", "انضم", "Ku biiray")}</th>
                  </tr>
                </thead>
                <tbody>
                  {(users as any[])?.map((u: any, i: number) => (
                    <tr key={u.id} className={`border-b border-white/5 hover:bg-white/3 transition-colors ${i % 2 === 0 ? "bg-white/[0.01]" : ""}`}>
                      <td className="px-5 py-3 text-white font-medium">{u.name}</td>
                      <td className="px-5 py-3 text-muted-foreground">{u.email}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${u.role === "admin" ? "bg-purple-500/20 text-purple-400" : "bg-blue-500/20 text-blue-400"}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-muted-foreground text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {tab === "payments" && (
        <motion.div key="payments" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="rounded-2xl bg-card border border-white/10 overflow-hidden">
            <div className="p-5 border-b border-white/10">
              <h3 className="font-semibold text-white">{t("Payment Submissions", "طلبات الدفع", "Codsiyada Lacag Bixinta")}</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-muted-foreground text-xs uppercase tracking-wider">
                    <th className="text-left px-5 py-3">{t("User", "المستخدم", "Isticmaalaha")}</th>
                    <th className="text-left px-5 py-3">{t("Method", "الطريقة", "Habka")}</th>
                    <th className="text-left px-5 py-3">{t("Phone", "الهاتف", "Taleefanka")}</th>
                    <th className="text-left px-5 py-3">{t("Amount", "المبلغ", "Qadarka")}</th>
                    <th className="text-left px-5 py-3">{t("Status", "الحالة", "Xaaladda")}</th>
                    <th className="text-left px-5 py-3">{t("Action", "الإجراء", "Tallaabada")}</th>
                  </tr>
                </thead>
                <tbody>
                  {(payments as any[])?.map((pay: any, i: number) => (
                    <tr key={pay.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                      <td className="px-5 py-3 text-white">{pay.userName || pay.userId}</td>
                      <td className="px-5 py-3 text-blue-400 font-medium uppercase">{pay.method?.replace("_", " ")}</td>
                      <td className="px-5 py-3 text-muted-foreground font-mono text-xs">{pay.phone}</td>
                      <td className="px-5 py-3 text-green-400 font-bold">${pay.amount}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${pay.status === "confirmed" ? "bg-green-500/20 text-green-400" : pay.status === "rejected" ? "bg-red-500/20 text-red-400" : "bg-yellow-500/20 text-yellow-400"}`}>
                          {pay.status}
                        </span>
                      </td>
                      <td className="px-5 py-3">
                        {pay.status === "pending" && (
                          <div className="flex gap-2">
                            <button
                              onClick={() => confirmPayment({ paymentId: pay.id, data: { status: "confirmed" } })}
                              disabled={confirmingPayment}
                              className="flex items-center gap-1 px-3 py-1 rounded-lg bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors text-xs"
                            >
                              <CheckCircle className="w-3 h-3" /> {t("Confirm", "تأكيد", "Xaqiiji")}
                            </button>
                            <button
                              onClick={() => confirmPayment({ paymentId: pay.id, data: { status: "rejected" } })}
                              className="flex items-center gap-1 px-3 py-1 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors text-xs"
                            >
                              <XCircle className="w-3 h-3" /> {t("Reject", "رفض", "Diibi")}
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                  {!(payments as any[])?.length && (
                    <tr><td colSpan={6} className="px-5 py-8 text-center text-muted-foreground">{t("No payments yet", "لا توجد مدفوعات بعد", "Wali lacag bixin ma jirto")}</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}

      {tab === "codes" && (
        <motion.div key="codes" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
          <div className="p-6 rounded-2xl bg-card border border-white/10">
            <h3 className="font-semibold text-white mb-4">{t("Generate New Code", "توليد رمز جديد", "Samee Koodh Cusub")}</h3>
            <div className="flex gap-3 flex-wrap">
              <input
                type="text"
                value={newCode}
                onChange={e => setNewCode(e.target.value.toUpperCase())}
                placeholder="CODE-XXXX"
                className="flex-1 min-w-[180px] px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 font-mono"
              />
              <select
                value={newCodeCourseId}
                onChange={e => setNewCodeCourseId(e.target.value)}
                className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-primary/50"
              >
                <option value="1">English Course</option>
                <option value="2">Arabic Course</option>
              </select>
              <button
                onClick={() => createCode({ data: { code: newCode, courseId: Number(newCodeCourseId) } })}
                disabled={creatingCode || !newCode.trim()}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium hover:shadow-[0_0_15px_rgba(59,130,246,0.4)] transition-all disabled:opacity-50"
              >
                {creatingCode ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                {t("Create", "إنشاء", "Samee")}
              </button>
            </div>
          </div>

          <div className="rounded-2xl bg-card border border-white/10 overflow-hidden">
            <div className="p-5 border-b border-white/10">
              <h3 className="font-semibold text-white">{t("All Access Codes", "جميع رموز الدخول", "Dhammaan Koodhada Galitaanka")}</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-muted-foreground text-xs uppercase tracking-wider">
                    <th className="text-left px-5 py-3">{t("Code", "الرمز", "Koodhka")}</th>
                    <th className="text-left px-5 py-3">{t("Course", "الدورة", "Koorsaha")}</th>
                    <th className="text-left px-5 py-3">{t("Status", "الحالة", "Xaaladda")}</th>
                    <th className="text-left px-5 py-3">{t("Used By", "مستخدم من قبل", "Loo Isticmaalo")}</th>
                    <th className="text-left px-5 py-3">{t("Action", "الإجراء", "Tallaabada")}</th>
                  </tr>
                </thead>
                <tbody>
                  {(codes as any[])?.map((code: any) => (
                    <tr key={code.id} className="border-b border-white/5 hover:bg-white/3 transition-colors">
                      <td className="px-5 py-3 font-mono text-white font-medium">{code.code}</td>
                      <td className="px-5 py-3 text-muted-foreground">{code.courseId === 1 ? "English" : "Arabic"}</td>
                      <td className="px-5 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${!code.isActive ? "bg-red-500/20 text-red-400" : code.isUsed ? "bg-gray-500/20 text-gray-400" : "bg-green-500/20 text-green-400"}`}>
                          {!code.isActive ? t("Inactive", "غير نشط", "Firfircoon ma aha") : code.isUsed ? t("Used", "مستخدم", "La isticmaalay") : t("Active", "نشط", "Firfircoon")}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-muted-foreground text-xs">{code.usedByUserId ? `User #${code.usedByUserId}` : "—"}</td>
                      <td className="px-5 py-3">
                        {code.isActive && !code.isUsed && (
                          <button
                            onClick={() => deactivateCode({ codeId: code.id })}
                            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors text-xs"
                          >
                            <XCircle className="w-3 h-3" /> {t("Deactivate", "إلغاء التنشيط", "Jooji")}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                  {!(codes as any[])?.length && (
                    <tr><td colSpan={5} className="px-5 py-8 text-center text-muted-foreground">{t("No codes yet", "لا توجد رموز بعد", "Wali koodh ma jiro")}</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
