import { useState, useEffect, useRef } from "react";
import { useParams, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { useGetLesson, useGetLessonQuiz, useMarkLessonComplete, useSubmitQuiz, getGetLessonQueryKey, getGetLessonQuizQueryKey } from "@/lib/api-client";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useLanguage } from "@/lib/contexts/LanguageContext";
import {
  CheckCircle2, ArrowLeft, ArrowRight, BookOpen, HelpCircle, Loader2, Trophy,
  XCircle, Zap, Brain, RotateCcw, CheckCircle, Target, Flame,
} from "lucide-react";
import { Link } from "wouter";
import { XPToast } from "@/components/shared/XPBar";

type TabId = "lesson" | "practice" | "quiz";

interface Exercise {
  id: number; type: string; question: string; questionAr: string; questionSo: string;
  options: string[] | null; correctAnswer: string; explanation: string;
  xpReward: number; order: number; attempted: boolean; wasCorrect: boolean | null; userAnswer: string | null;
}

interface ExerciseResult { isCorrect: boolean; correctAnswer: string; explanation: string; xpGained: number; alreadyAttempted: boolean; }

function MCQExercise({ ex, lang, onSubmit, disabled }: {
  ex: Exercise; lang: string; onSubmit: (a: string) => void; disabled: boolean;
}) {
  const [selected, setSelected] = useState<string | null>(ex.userAnswer ?? null);
  const question = lang === "ar" ? (ex.questionAr || ex.question) : lang === "so" ? (ex.questionSo || ex.question) : ex.question;

  return (
    <div className="space-y-3">
      <p className="font-semibold text-white text-base leading-relaxed">{question}</p>
      <div className="space-y-2">
        {(ex.options ?? []).map((opt, i) => {
          const letter = String.fromCharCode(65 + i);
          const isSelected = selected === letter;
          const isCorrect = ex.wasCorrect !== null && letter === ex.correctAnswer;
          const isWrong   = ex.wasCorrect !== null && isSelected && !ex.wasCorrect;
          return (
            <button
              key={i}
              disabled={disabled || ex.attempted}
              onClick={() => setSelected(letter)}
              className={`w-full text-left px-4 py-3 rounded-xl border transition-all text-sm flex items-center gap-3 ${
                isCorrect ? "border-green-500/60 bg-green-500/10 text-green-300" :
                isWrong   ? "border-red-500/60 bg-red-500/10 text-red-300" :
                isSelected ? "border-primary bg-primary/10 text-white" :
                "border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:border-white/20"
              }`}
            >
              <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black shrink-0 ${
                isSelected ? "bg-primary text-white" : "bg-white/10 text-muted-foreground"
              }`}>{letter}</span>
              {opt}
              {isCorrect && <CheckCircle className="w-4 h-4 text-green-400 ml-auto" />}
              {isWrong   && <XCircle    className="w-4 h-4 text-red-400 ml-auto" />}
            </button>
          );
        })}
      </div>
      {!ex.attempted && (
        <button
          disabled={!selected || disabled}
          onClick={() => selected && onSubmit(selected)}
          className="mt-2 px-5 py-2 rounded-xl bg-primary text-white text-sm font-bold disabled:opacity-40 hover:bg-primary/80 transition-colors"
        >Check Answer</button>
      )}
    </div>
  );
}

function TrueFalseExercise({ ex, lang, onSubmit, disabled }: {
  ex: Exercise; lang: string; onSubmit: (a: string) => void; disabled: boolean;
}) {
  const [selected, setSelected] = useState<string | null>(ex.userAnswer ?? null);
  const question = lang === "ar" ? (ex.questionAr || ex.question) : lang === "so" ? (ex.questionSo || ex.question) : ex.question;
  const opts = ["True", "False"];

  return (
    <div className="space-y-3">
      <p className="font-semibold text-white text-base leading-relaxed">{question}</p>
      <div className="flex gap-3">
        {opts.map(opt => {
          const isSelected = selected === opt;
          const isCorrect = ex.wasCorrect !== null && opt.toLowerCase() === ex.correctAnswer.toLowerCase();
          const isWrong   = ex.wasCorrect !== null && isSelected && !ex.wasCorrect;
          return (
            <button
              key={opt}
              disabled={disabled || ex.attempted}
              onClick={() => setSelected(opt)}
              className={`flex-1 py-3 rounded-xl border font-bold text-sm transition-all ${
                isCorrect ? "border-green-500/60 bg-green-500/10 text-green-300" :
                isWrong   ? "border-red-500/60 bg-red-500/10 text-red-300" :
                isSelected ? "border-primary bg-primary/10 text-white" :
                "border-white/10 bg-white/5 text-gray-300 hover:bg-white/10"
              }`}
            >{opt === "True" ? "✅ True" : "❌ False"}</button>
          );
        })}
      </div>
      {!ex.attempted && (
        <button
          disabled={!selected || disabled}
          onClick={() => selected && onSubmit(selected)}
          className="px-5 py-2 rounded-xl bg-primary text-white text-sm font-bold disabled:opacity-40 hover:bg-primary/80 transition-colors"
        >Check Answer</button>
      )}
    </div>
  );
}

function FillBlankExercise({ ex, lang, onSubmit, disabled }: {
  ex: Exercise; lang: string; onSubmit: (a: string) => void; disabled: boolean;
}) {
  const [val, setVal] = useState(ex.userAnswer ?? "");
  const question = lang === "ar" ? (ex.questionAr || ex.question) : lang === "so" ? (ex.questionSo || ex.question) : ex.question;
  const isCorrect = ex.wasCorrect === true;
  const isWrong   = ex.wasCorrect === false;

  return (
    <div className="space-y-3">
      <p className="font-semibold text-white text-base leading-relaxed">{question}</p>
      <div className="flex gap-2">
        <input
          type="text"
          value={val}
          disabled={disabled || ex.attempted}
          onChange={e => setVal(e.target.value)}
          onKeyDown={e => e.key === "Enter" && val.trim() && !ex.attempted && onSubmit(val.trim())}
          placeholder="Type your answer…"
          className={`flex-1 px-4 py-2.5 rounded-xl border bg-white/5 text-white placeholder-gray-600 focus:outline-none text-sm transition-all ${
            isCorrect ? "border-green-500/60" : isWrong ? "border-red-500/60" : "border-white/10 focus:border-primary/60"
          }`}
        />
        {!ex.attempted && (
          <button
            disabled={!val.trim() || disabled}
            onClick={() => val.trim() && onSubmit(val.trim())}
            className="px-4 py-2.5 rounded-xl bg-primary text-white text-sm font-bold disabled:opacity-40 hover:bg-primary/80 transition-colors"
          >Check</button>
        )}
      </div>
    </div>
  );
}

function WordMatchExercise({ ex, lang, onSubmit, disabled }: {
  ex: Exercise; lang: string; onSubmit: (a: string) => void; disabled: boolean;
}) {
  const question = lang === "ar" ? (ex.questionAr || ex.question) : lang === "so" ? (ex.questionSo || ex.question) : ex.question;
  const opts = ex.options ?? [];
  const [selected, setSelected] = useState<string | null>(ex.userAnswer ?? null);

  return (
    <div className="space-y-3">
      <p className="font-semibold text-white text-base leading-relaxed">{question}</p>
      <div className="flex flex-wrap gap-2">
        {opts.map(opt => {
          const isSelected = selected === opt;
          const isCorrect = ex.wasCorrect !== null && opt.toLowerCase() === ex.correctAnswer.toLowerCase();
          const isWrong   = ex.wasCorrect !== null && isSelected && !ex.wasCorrect;
          return (
            <button
              key={opt}
              disabled={disabled || ex.attempted}
              onClick={() => setSelected(opt)}
              className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                isCorrect ? "border-green-500/60 bg-green-500/10 text-green-300" :
                isWrong   ? "border-red-500/60 bg-red-500/10 text-red-300" :
                isSelected ? "border-primary bg-primary/10 text-white" :
                "border-white/10 bg-white/5 text-gray-300 hover:bg-white/10"
              }`}
            >{opt}</button>
          );
        })}
      </div>
      {!ex.attempted && (
        <button
          disabled={!selected || disabled}
          onClick={() => selected && onSubmit(selected)}
          className="px-5 py-2 rounded-xl bg-primary text-white text-sm font-bold disabled:opacity-40 hover:bg-primary/80 transition-colors"
        >Check Answer</button>
      )}
    </div>
  );
}

function ExerciseCard({ ex, lang, onResult }: {
  ex: Exercise; lang: string; onResult: (result: ExerciseResult, exerciseId: number) => void;
}) {
  const [result, setResult]   = useState<ExerciseResult | null>(null);
  const [loading, setLoading] = useState(false);

  const localAttempted = result !== null || ex.attempted;

  const submit = async (answer: string) => {
    setLoading(true);
    try {
      const r = await fetch(`/api/exercises/${ex.id}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ answer }),
      });
      const data: ExerciseResult = await r.json();
      setResult(data);
      onResult(data, ex.id);
    } finally {
      setLoading(false);
    }
  };

  const feedback = result ?? (ex.attempted ? {
    isCorrect: ex.wasCorrect ?? false,
    correctAnswer: ex.correctAnswer,
    explanation: ex.explanation,
    xpGained: 0, alreadyAttempted: true,
  } : null);

  const exWithMerge: Exercise = result ? {
    ...ex,
    attempted: true,
    wasCorrect: result.isCorrect,
    userAnswer: null,
  } : ex;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-5 rounded-2xl border transition-all ${
        feedback?.isCorrect ? "bg-green-500/5 border-green-500/20" :
        feedback && !feedback.isCorrect ? "bg-red-500/5 border-red-500/20" :
        "bg-card border-white/10"
      }`}
    >
      <div className="flex items-center gap-2 mb-3">
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wide ${
          ex.type === "mcq"        ? "bg-blue-500/15 text-blue-400" :
          ex.type === "true_false" ? "bg-purple-500/15 text-purple-400" :
          ex.type === "fill_blank" ? "bg-cyan-500/15 text-cyan-400" :
          "bg-pink-500/15 text-pink-400"
        }`}>
          {ex.type === "mcq" ? "Multiple Choice" :
           ex.type === "true_false" ? "True / False" :
           ex.type === "fill_blank" ? "Fill in Blank" :
           ex.type === "word_match" ? "Word Match" : ex.type}
        </span>
        <span className="ml-auto flex items-center gap-1 text-xs text-yellow-400 font-bold">
          <Zap className="w-3 h-3" /> +{ex.xpReward} XP
        </span>
        {localAttempted && (
          feedback?.isCorrect
            ? <CheckCircle className="w-4 h-4 text-green-400" />
            : <XCircle     className="w-4 h-4 text-red-400" />
        )}
      </div>

      {ex.type === "mcq"        && <MCQExercise      ex={exWithMerge} lang={lang} onSubmit={submit} disabled={loading} />}
      {ex.type === "true_false" && <TrueFalseExercise ex={exWithMerge} lang={lang} onSubmit={submit} disabled={loading} />}
      {ex.type === "fill_blank" && <FillBlankExercise ex={exWithMerge} lang={lang} onSubmit={submit} disabled={loading} />}
      {ex.type === "word_match"  && <WordMatchExercise ex={exWithMerge} lang={lang} onSubmit={submit} disabled={loading} />}

      <AnimatePresence>
        {feedback && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-3 overflow-hidden"
          >
            <div className={`p-3 rounded-xl text-sm ${
              feedback.isCorrect ? "bg-green-500/10 text-green-300" : "bg-red-500/10 text-red-300"
            }`}>
              <p className="font-bold mb-0.5">{feedback.isCorrect ? "✅ Correct!" : "❌ Incorrect"}</p>
              {!feedback.isCorrect && <p className="text-xs opacity-80">Correct answer: <strong>{feedback.correctAnswer}</strong></p>}
              {feedback.explanation && <p className="text-xs opacity-80 mt-1">{feedback.explanation}</p>}
              {feedback.xpGained > 0 && (
                <p className="text-xs font-bold text-yellow-400 mt-1">+{feedback.xpGained} XP earned!</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function Learn() {
  const { courseId, lessonId } = useParams();
  const [, setLocation] = useLocation();
  const { user } = useAuth();
  const { t, language } = useLanguage();

  const [tab, setTab] = useState<TabId>("lesson");
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizResult, setQuizResult]       = useState<any>(null);
  const [lessonDone, setLessonDone]       = useState(false);
  const [exercises, setExercises]         = useState<Exercise[]>([]);
  const [exercisesLoading, setExercisesLoading] = useState(false);
  const [xpToast, setXpToast]             = useState<number | null>(null);
  const toastTimeout                       = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { data: lesson, isLoading: lessonLoading } = useGetLesson(Number(lessonId), {
    query: { enabled: !!courseId && !!lessonId, queryKey: getGetLessonQueryKey(Number(lessonId)) },
  });

  const { data: quiz, isLoading: quizLoading } = useGetLessonQuiz(Number(lessonId), {
    query: { enabled: !!courseId && !!lessonId && tab === "quiz", queryKey: getGetLessonQuizQueryKey(Number(lessonId)) },
  });

  const { mutate: markComplete, isPending: markingComplete } = useMarkLessonComplete({
    mutation: { onSuccess: () => setLessonDone(true) },
  });

  const { mutate: submitQuiz, isPending: submittingQuiz } = useSubmitQuiz({
    mutation: { onSuccess: (data: any) => { setQuizResult(data); setQuizSubmitted(true); } },
  });

  useEffect(() => {
    if (tab !== "practice" || !lessonId) return;
    setExercisesLoading(true);
    fetch(`/api/lessons/${lessonId}/exercises`, { credentials: "include" })
      .then(r => r.ok ? r.json() : [])
      .then(setExercises)
      .finally(() => setExercisesLoading(false));
  }, [tab, lessonId]);

  const handleExerciseResult = (result: ExerciseResult, exerciseId: number) => {
    setExercises(prev => prev.map(e => e.id === exerciseId
      ? { ...e, attempted: true, wasCorrect: result.isCorrect, userAnswer: result.isCorrect ? e.correctAnswer : null }
      : e
    ));
    if (result.xpGained > 0) {
      if (toastTimeout.current) clearTimeout(toastTimeout.current);
      setXpToast(result.xpGained);
    }
  };

  const handleMarkComplete = () => {
    if (!user) { setLocation("/auth/login"); return; }
    markComplete({ data: { lessonId: Number(lessonId) } });
    fetch("/api/gamification/award", {
      method: "POST", credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ xp: 20, reason: "lesson_complete" }),
    }).then(r => r.json()).then(d => {
      if (d.gained > 0) setXpToast(20);
    }).catch(() => {});
  };

  const handleSubmitQuiz = () => {
    if (!quiz || !(quiz as any).questions?.length) return;
    const answers = (quiz as any).questions.map((_: any, i: number) => ({
      questionId: (quiz as any).questions[i].id,
      answer: selectedAnswers[i] ?? -1,
    }));
    submitQuiz({ lessonId: Number(lessonId), data: { answers } });
  };

  const getContent = (item: any) => {
    if (!item) return "";
    return language === "ar" ? (item.contentAr || item.content) : language === "so" ? (item.contentSo || item.content) : item.content;
  };
  const getTitle = (item: any) => {
    if (!item) return "";
    return language === "ar" ? (item.titleAr || item.title) : language === "so" ? (item.titleSo || item.title) : item.title;
  };

  const completedExercises = exercises.filter(e => e.attempted).length;
  const correctExercises   = exercises.filter(e => e.wasCorrect).length;

  const TABS: { id: TabId; label: string; icon: any; show?: boolean }[] = [
    { id: "lesson",   label: t("Lesson",   "الدرس",     "Casharka"),      icon: BookOpen, show: true },
    { id: "practice", label: t("Practice", "التدريب",   "Tababar"),       icon: Brain,    show: true },
    { id: "quiz",     label: t("Quiz",     "الاختبار",  "Imtixaanka"),    icon: HelpCircle, show: !!(lesson as any)?.hasQuiz },
  ];

  if (lessonLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  if (!lesson) return (
    <div className="min-h-screen flex items-center justify-center bg-background flex-col gap-4">
      <p className="text-muted-foreground">{t("Lesson not found", "الدرس غير موجود", "Casharka lama helin")}</p>
      <Link href={`/courses/${courseId}`} className="text-primary hover:underline">
        {t("Back to Course", "العودة إلى الدورة", "Ku noqo Koorsaha")}
      </Link>
    </div>
  );

  return (
    <div className="min-h-[100dvh] pt-16 bg-background">
      <AnimatePresence>
        {xpToast !== null && (
          <XPToast xp={xpToast} onDone={() => setXpToast(null)} />
        )}
      </AnimatePresence>

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

            <div className="flex gap-1 mb-6 border-b border-white/10 pb-0">
              {TABS.filter(t => t.show !== false).map(tabDef => (
                <button
                  key={tabDef.id}
                  onClick={() => setTab(tabDef.id)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium transition-all border-b-2 -mb-px ${
                    tab === tabDef.id
                      ? "text-white border-primary"
                      : "text-muted-foreground border-transparent hover:text-white"
                  }`}
                >
                  <tabDef.icon className="w-3.5 h-3.5" />
                  {tabDef.label}
                  {tabDef.id === "practice" && exercises.length > 0 && (
                    <span className="text-xs px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-400 font-bold ml-1">
                      {completedExercises}/{exercises.length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {tab === "lesson" && (
                <motion.div key="lesson" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-6">
                  {(lesson as any).videoUrl && (() => {
                    const url: string = (lesson as any).videoUrl;

                    // YouTube: watch?v=, youtu.be/, /embed/
                    const ytMatch =
                      url.match(/[?&]v=([a-zA-Z0-9_-]{11})/) ||
                      url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/) ||
                      url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);

                    // Vimeo: vimeo.com/12345 or player.vimeo.com/video/12345
                    const vimeoMatch =
                      url.match(/vimeo\.com\/video\/(\d+)/) ||
                      url.match(/vimeo\.com\/(\d+)/);

                    if (ytMatch) {
                      const embedUrl = `https://www.youtube.com/embed/${ytMatch[1]}?rel=0&modestbranding=1`;
                      return (
                        <div className="rounded-2xl overflow-hidden bg-black border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] aspect-video">
                          <iframe
                            src={embedUrl}
                            className="w-full h-full"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                            title="YouTube video"
                          />
                        </div>
                      );
                    }

                    if (vimeoMatch) {
                      const embedUrl = `https://player.vimeo.com/video/${vimeoMatch[1]}?byline=0&portrait=0`;
                      return (
                        <div className="rounded-2xl overflow-hidden bg-black border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] aspect-video">
                          <iframe
                            src={embedUrl}
                            className="w-full h-full"
                            allow="autoplay; fullscreen; picture-in-picture"
                            allowFullScreen
                            title="Vimeo video"
                          />
                        </div>
                      );
                    }

                    // Direct MP4 / any other URL
                    return (
                      <div className="rounded-2xl overflow-hidden bg-black border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                        <video
                          src={url}
                          controls
                          controlsList="nodownload"
                          className="w-full max-h-[480px] outline-none"
                          preload="metadata"
                          playsInline
                        >
                          {t("Your browser does not support the video tag.", "متصفحك لا يدعم تشغيل الفيديو.", "Browserkaagu kuma taageero fiidiyowga.")}
                        </video>
                      </div>
                    );
                  })()}
                  <div className="p-6 rounded-2xl bg-card border border-white/10 prose prose-invert max-w-none">
                    {getContent(lesson).split('\n').map((para: string, i: number) => (
                      para.trim() ? <p key={i} className="text-gray-300 leading-relaxed mb-4">{para}</p> : null
                    ))}
                  </div>

                  {!lessonDone ? (
                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={handleMarkComplete}
                        disabled={markingComplete}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-green-600/20 border border-green-500/30 text-green-400 hover:bg-green-600/30 transition-all font-medium disabled:opacity-50"
                      >
                        {markingComplete ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                        {t("Mark as Complete", "وضع علامة مكتمل", "Ku Calaamadee Dhammaystiran")}
                        <span className="text-xs text-green-300/70 ml-1">(+20 XP)</span>
                      </button>
                      <button
                        onClick={() => setTab("practice")}
                        className="flex items-center gap-2 px-6 py-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500/20 transition-all font-medium"
                      >
                        <Brain className="w-4 h-4" />
                        {t("Practice Exercises", "تمارين تدريبية", "Tababar Ku Samee")}
                      </button>
                    </div>
                  ) : (
                    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl bg-green-500/20 border border-green-500/30 text-green-400 font-medium">
                      <CheckCircle2 className="w-4 h-4" />
                      {t("Lesson Complete!", "اكتمل الدرس!", "Casharka Dhammaystay!")}
                    </motion.div>
                  )}
                </motion.div>
              )}

              {tab === "practice" && (
                <motion.div key="practice" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} className="space-y-4">
                  {exercisesLoading ? (
                    <div className="flex items-center justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
                  ) : exercises.length === 0 ? (
                    <div className="text-center py-16 space-y-3">
                      <Brain className="w-12 h-12 text-muted-foreground mx-auto opacity-40" />
                      <p className="text-muted-foreground">{t("No exercises yet for this lesson.", "لا توجد تمارين لهذا الدرس بعد.", "Wali tababar kuma jiro casharkaan.")}</p>
                      <p className="text-xs text-muted-foreground/60">{t("Check back soon!", "تحقق قريباً!", "Soo noqo dhawaan!")}</p>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between p-3 rounded-xl bg-card border border-white/10 text-sm">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1.5 text-muted-foreground">
                            <Target className="w-4 h-4" />
                            {completedExercises}/{exercises.length} {t("done", "مكتمل", "dhammaystay")}
                          </span>
                          <span className="flex items-center gap-1.5 text-green-400">
                            <CheckCircle className="w-4 h-4" />
                            {correctExercises} {t("correct", "صحيح", "saxan")}
                          </span>
                        </div>
                        <span className="flex items-center gap-1 text-yellow-400 font-bold">
                          <Zap className="w-4 h-4" />
                          {exercises.filter(e => e.wasCorrect).reduce((s, e) => s + e.xpReward, 0)} XP {t("earned", "مكتسب", "la helay")}
                        </span>
                      </div>

                      {exercises.map(ex => (
                        <ExerciseCard key={ex.id} ex={ex} lang={language} onResult={handleExerciseResult} />
                      ))}

                      {completedExercises === exercises.length && exercises.length > 0 && (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                          className="p-6 rounded-2xl bg-gradient-to-br from-purple-900/40 to-blue-900/40 border border-purple-500/20 text-center">
                          <Trophy className="w-10 h-10 text-yellow-400 mx-auto mb-2" />
                          <p className="font-black text-white text-lg">{t("All done!", "أحسنت!", "Aad baad u fiicantahay!")}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {correctExercises}/{exercises.length} {t("correct", "صحيح", "saxan")} · {exercises.filter(e => e.wasCorrect).reduce((s, e) => s + e.xpReward, 0)} XP {t("earned", "مكتسب", "la helay")}
                          </p>
                          {(lesson as any).hasQuiz && (
                            <button onClick={() => setTab("quiz")}
                              className="mt-4 flex items-center gap-2 mx-auto px-5 py-2 rounded-xl bg-primary text-white text-sm font-bold hover:bg-primary/80 transition-colors">
                              <ArrowRight className="w-4 h-4" /> {t("Take the Quiz", "خذ الاختبار", "Qaado Imtixaanka")}
                            </button>
                          )}
                        </motion.div>
                      )}
                    </>
                  )}
                </motion.div>
              )}

              {tab === "quiz" && (
                <motion.div key="quiz" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-6">
                  {quizLoading ? (
                    <div className="flex items-center justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
                  ) : !quiz || !(quiz as any).questions?.length ? (
                    <p className="text-muted-foreground text-center py-12">{t("No quiz available for this lesson.", "لا يوجد اختبار لهذا الدرس.", "Imtixaan kuma jiro casharkan.")}</p>
                  ) : quizSubmitted && quizResult ? (
                    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="p-8 rounded-2xl bg-card border border-white/10 text-center">
                      {quizResult.passed ? (
                        <><Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" /><h3 className="text-2xl font-black text-white mb-2">{t("Excellent!", "ممتاز!", "Aad baad u fiicantahay!")}</h3></>
                      ) : (
                        <><XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" /><h3 className="text-2xl font-black text-white mb-2">{t("Keep Trying!", "استمر في المحاولة!", "Sii wad tijaabinta!")}</h3></>
                      )}
                      <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
                        {quizResult.score} / {quizResult.total}
                      </p>
                      <p className="text-muted-foreground mb-6">{Math.round((quizResult.score / quizResult.total) * 100)}% {t("correct", "صحيح", "saxan")}</p>
                      <button onClick={() => { setQuizSubmitted(false); setSelectedAnswers({}); setQuizResult(null); }}
                        className="px-6 py-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors text-sm font-medium flex items-center gap-2 mx-auto">
                        <RotateCcw className="w-4 h-4" /> {t("Try Again", "حاول مرة أخرى", "Isku day mar kale")}
                      </button>
                    </motion.div>
                  ) : (
                    <>
                      {(quiz as any).questions?.map((q: any, qi: number) => (
                        <motion.div key={qi} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: qi * 0.05 }}
                          className="p-6 rounded-2xl bg-card border border-white/10">
                          <p className="font-semibold text-white mb-4">{qi + 1}. {q.question}</p>
                          <div className="space-y-2">
                            {q.options?.map((opt: string, oi: number) => (
                              <button key={oi} onClick={() => setSelectedAnswers(prev => ({ ...prev, [qi]: oi }))}
                                className={`w-full text-left px-4 py-3 rounded-xl border transition-all text-sm ${selectedAnswers[qi] === oi
                                  ? "border-primary bg-primary/10 text-white"
                                  : "border-white/10 bg-white/5 text-gray-300 hover:bg-white/10 hover:border-white/20"}`}>
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
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all disabled:opacity-50 flex items-center justify-center gap-2">
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
                {exercises.length > 0 && (
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>{t("Exercises", "تمارين", "Tababarrada")}</span>
                    <span className="text-blue-400">{exercises.length} {t("available", "متاح", "la heli karo")}</span>
                  </div>
                )}
              </div>

              {exercises.length > 0 && (
                <div className="mt-4 pt-4 border-t border-white/10">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
                    <span>{t("Practice", "تدريب", "Tababar")}</span>
                    <span>{completedExercises}/{exercises.length}</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                    <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                      style={{ width: `${exercises.length > 0 ? (completedExercises / exercises.length) * 100 : 0}%` }} />
                  </div>
                </div>
              )}

              <div className="mt-4 pt-4 border-t border-white/10 space-y-2">
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
