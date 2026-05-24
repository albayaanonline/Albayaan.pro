import { useState } from "react";
import { useParams, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useGetLesson, useGetLessonQuiz, useMarkLessonComplete, useSubmitQuiz } from "@workspace/api-client-react";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import { CheckCircle2, ArrowLeft, ArrowRight, BookOpen, HelpCircle, Loader2, Trophy, XCircle } from "lucide-react";
import { Link } from "wouter";

export default function Learn() {
  const { courseId, lessonId } = useParams();
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { t, language } = useLanguage();

  const [tab, setTab] = useState<"lesson" | "quiz">("lesson");
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResult, setQuizResult] = useState<any>(null);
  const [lessonDone, setLessonDone] = useState(false);

  const { data: lesson, isLoading: lessonLoading } = useGetLesson(Number(courseId), Number(lessonId), {
    query: { enabled: !!courseId && !!lessonId }
  });

  const { data: quiz, isLoading: quizLoading } = useGetLessonQuiz(Number(courseId), Number(lessonId), {
    query: { enabled: !!courseId && !!lessonId && tab === "quiz" }
  });

  const { mutate: markComplete, isPending: markingComplete } = useMarkLessonComplete({
    mutation: {
      onSuccess: () => setLessonDone(true),
    },
  });

  const { mutate: submitQuiz, isPending: submittingQuiz } = useSubmitQuiz({
    mutation: {
      onSuccess: (data: any) => {
        setQuizResult(data);
        setQuizSubmitted(true);
      },
    },
  });

  const handleMarkComplete = () => {
    if (!user) { setLocation("/auth/login"); return; }
    markComplete({ courseId: Number(courseId), lessonId: Number(lessonId), data: {} as any });
  };

  const handleSubmitQuiz = () => {
    if (!quiz || !(quiz as any).questions?.length) return;
    const answers = (quiz as any).questions.map((_: any, i: number) => selectedAnswers[i] ?? -1);
    submitQuiz({ courseId: Number(courseId), lessonId: Number(lessonId), data: { answers } });
  };

  const getContent = (item: any) => {
    if (!item) return "";
    return language === "ar" ? (item.contentAr || item.content) : language === "so" ? (item.contentSo || item.content) : item.content;
  };
  const getTitle = (item: any) => {
    if (!item) return "";
    return language === "ar" ? (item.titleAr || item.title) : language === "so" ? (item.titleSo || item.title) : item.title;
  };

  if (lessonLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background flex-col gap-4">
        <p className="text-muted-foreground">{t("Lesson not found", "الدرس غير موجود", "Casharka lama helin")}</p>
        <Link href={`/courses/${courseId}`} className="text-primary hover:underline">
          {t("Back to Course", "العودة إلى الدورة", "Ku noqo Koorsaha")}
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] pt-16 bg-background">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <Link href={`/courses/${courseId}`} className="flex items-center gap-2 text-muted-foreground hover:text-white transition-colors text-sm">
            <ArrowLeft className="w-4 h-4" /> {t("Back to Course", "العودة إلى الدورة", "Ku noqo Koorsaha")}
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <h1 className="text-2xl md:text-3xl font-black text-white mb-2">{getTitle(lesson)}</h1>
              <div className="flex items-center gap-3 text-sm text-muted-foreground mb-6">
                <span className="flex items-center gap-1"><BookOpen className="w-4 h-4" /> {(lesson as any).duration}</span>
                {(lesson as any).hasQuiz && <span className="flex items-center gap-1 text-purple-400"><HelpCircle className="w-4 h-4" /> {t("Has Quiz", "يحتوي على اختبار", "Waxaa ku jira Quiz")}</span>}
              </div>
            </motion.div>

            <div className="flex gap-2 mb-6 border-b border-white/10 pb-1">
              {(["lesson", "quiz"] as const).map(tabId => (
                tabId === "quiz" && !(lesson as any).hasQuiz ? null : (
                  <button
                    key={tabId}
                    onClick={() => setTab(tabId)}
                    className={`px-5 py-2 rounded-t-lg text-sm font-medium transition-all ${tab === tabId ? "text-white border-b-2 border-primary" : "text-muted-foreground hover:text-white"}`}
                  >
                    {tabId === "lesson" ? t("Lesson", "الدرس", "Casharka") : t("Quiz", "الاختبار", "Imtixaanka")}
                  </button>
                )
              ))}
            </div>

            <AnimatePresence mode="wait">
              {tab === "lesson" ? (
                <motion.div
                  key="lesson"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="space-y-6"
                >
                  <div className="p-6 rounded-2xl bg-card border border-white/10 prose prose-invert max-w-none">
                    {getContent(lesson).split('\n').map((para: string, i: number) => (
                      para.trim() ? <p key={i} className="text-gray-300 leading-relaxed mb-4">{para}</p> : null
                    ))}
                  </div>

                  {!lessonDone ? (
                    <button
                      onClick={handleMarkComplete}
                      disabled={markingComplete}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl bg-green-600/20 border border-green-500/30 text-green-400 hover:bg-green-600/30 transition-all font-medium disabled:opacity-50"
                    >
                      {markingComplete ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                      {t("Mark as Complete", "وضع علامة مكتمل", "Ku Calaamadee Dhammaystiran")}
                    </button>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl bg-green-500/20 border border-green-500/30 text-green-400 font-medium"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      {t("Lesson Complete!", "اكتمل الدرس!", "Casharka Dhammaystay!")}
                    </motion.div>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="quiz"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="space-y-6"
                >
                  {quizLoading ? (
                    <div className="flex items-center justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
                  ) : !quiz || !(quiz as any).questions?.length ? (
                    <p className="text-muted-foreground text-center py-12">{t("No quiz available for this lesson.", "لا يوجد اختبار لهذا الدرس.", "Imtixaan kuma jiro casharkan.")}</p>
                  ) : quizSubmitted && quizResult ? (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-8 rounded-2xl bg-card border border-white/10 text-center">
                      {quizResult.passed ? (
                        <>
                          <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                          <h3 className="text-2xl font-black text-white mb-2">{t("Excellent!", "ممتاز!", "Aad baad u fiicantahay!")}</h3>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                          <h3 className="text-2xl font-black text-white mb-2">{t("Keep Trying!", "استمر في المحاولة!", "Sii wad tijaabinta!")}</h3>
                        </>
                      )}
                      <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
                        {quizResult.score} / {quizResult.total}
                      </p>
                      <p className="text-muted-foreground mb-6">
                        {Math.round((quizResult.score / quizResult.total) * 100)}% {t("correct", "صحيح", "saxan")}
                      </p>
                      <button
                        onClick={() => { setQuizSubmitted(false); setSelectedAnswers({}); setQuizResult(null); }}
                        className="px-6 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors text-sm font-medium"
                      >
                        {t("Try Again", "حاول مرة أخرى", "Isku day mar kale")}
                      </button>
                    </motion.div>
                  ) : (
                    <>
                      {(quiz as any).questions?.map((q: any, qi: number) => (
                        <motion.div
                          key={qi}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: qi * 0.05 }}
                          className="p-6 rounded-2xl bg-card border border-white/10"
                        >
                          <p className="font-semibold text-white mb-4">{qi + 1}. {q.question}</p>
                          <div className="space-y-2">
                            {q.options?.map((opt: string, oi: number) => (
                              <button
                                key={oi}
                                onClick={() => setSelectedAnswers(prev => ({ ...prev, [qi]: oi }))}
                                className={`w-full text-left px-4 py-3 rounded-xl border transition-all text-sm ${selectedAnswers[qi] === oi
                                  ? "border-primary bg-primary/10 text-white"
                                  : "border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:border-white/20"}`}
                              >
                                <span className="font-bold text-primary mr-3">{String.fromCharCode(65 + oi)}.</span>
                                {opt}
                              </button>
                            ))}
                          </div>
                        </motion.div>
                      ))}

                      <button
                        onClick={handleSubmitQuiz}
                        disabled={submittingQuiz || Object.keys(selectedAnswers).length < ((quiz as any).questions?.length ?? 0)}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {submittingQuiz && <Loader2 className="w-4 h-4 animate-spin" />}
                        {t("Submit Quiz", "إرسال الاختبار", "Gudbi Imtixaanka")}
                      </button>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="space-y-4">
            <div className="p-5 rounded-2xl bg-card border border-white/10 sticky top-24">
              <h3 className="font-semibold text-white mb-4 text-sm">{t("Lesson Info", "معلومات الدرس", "Macluumaadka Casharka")}</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span>{t("Duration", "المدة", "Muddada")}</span>
                  <span className="text-white">{(lesson as any).duration}</span>
                </div>
                {(lesson as any).hasQuiz && (
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>{t("Quiz", "اختبار", "Quiz")}</span>
                    <span className="text-purple-400">{t("Available", "متاح", "La heli karo")}</span>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 space-y-2">
                <Link href={`/courses/${courseId}`} className="flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors">
                  <ArrowLeft className="w-4 h-4" /> {t("Course Overview", "نظرة عامة على الدورة", "Dulmar Koorsaha")}
                </Link>
                {lessonDone && (lesson as any).hasQuiz && tab !== "quiz" && (
                  <button onClick={() => setTab("quiz")} className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors">
                    <ArrowRight className="w-4 h-4" /> {t("Take Quiz", "أخذ الاختبار", "Qaado Imtixaanka")}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
