export type CourseLanguage = "english" | "arabic";
export type CourseLevel = "beginner";

type LocalizedText = Record<"en" | "ar" | "so", string>;

export interface YouTubeCourse {
  slug: string;
  playlistId: string;
  title: LocalizedText;
  description: LocalizedText;
  sourceTitle: string;
  sourceChannel: string;
  language: CourseLanguage;
  level: CourseLevel;
  lessonCount?: number;
}

export const YOUTUBE_COURSES: YouTubeCourse[] = [
  {
    slug: "beginner-english-comprehensible-input",
    playlistId: "PLqE81DRO-TpHB0YabMgRBBax7sWhK9hgm",
    title: {
      en: "Beginner English: Intro Course",
      ar: "الإنجليزية للمبتدئين: دورة تمهيدية",
      so: "Ingiriisi Bilow ah: Koorso Hordhac ah",
    },
    description: {
      en: "An 18-video beginner series using comprehensible input to build English understanding.",
      ar: "سلسلة من 18 فيديو للمبتدئين تستخدم المدخلات المفهومة لبناء فهم اللغة الإنجليزية.",
      so: "Taxane 18 muuqaal ah oo bilowga Ingiriisiga ku bara faham iyo dhageysi fudud.",
    },
    sourceTitle: "Beginner English Intro Course Lessons | ALG-style Comprehensible Input",
    sourceChannel: "English Comprehensible Input for ESL Beginners",
    language: "english",
    level: "beginner",
    lessonCount: 18,
  },
  {
    slug: "arabic-modern-standard-beginners",
    playlistId: "PLIWWfmpa2UFceqaKES2PqJi7v4CmEKmHp",
    title: {
      en: "Modern Standard Arabic: Beginner Courses 1 & 2",
      ar: "العربية الفصحى الحديثة: دورتا المبتدئين 1 و2",
      so: "Carabi Fusha: Koorsooyinka Bilowga 1 & 2",
    },
    description: {
      en: "Beginner MSA lessons covering useful expressions, pronouns, numbers, and vocabulary.",
      ar: "دروس للمبتدئين في العربية الفصحى تشمل عبارات مفيدة والضمائر والأرقام والمفردات.",
      so: "Casharro Carabiga Fusha ah oo bilow ah: weedho waxtar leh, magac-u-yaallo, tirooyin iyo ereyo.",
    },
    sourceTitle: "Learn Arabic (MSA) - Beginner Courses (1&2)",
    sourceChannel: "Learn Arabic with Frazely",
    language: "arabic",
    level: "beginner",
  },
  {
    slug: "arabic-complete-beginners-stories",
    playlistId: "PLUHDV_xXMUq0AJulrPfc8XQx_v3TBZ10b",
    title: {
      en: "Arabic for Complete Beginners: MSA Stories",
      ar: "العربية للمبتدئين تماماً: قصص بالفصحى",
      so: "Carabi Bilow ah: Sheekooyin Fusha ah",
    },
    description: {
      en: "A 24-video beginner playlist that uses short, comprehensible stories in Modern Standard Arabic.",
      ar: "قائمة من 24 فيديو للمبتدئين تستخدم قصصاً قصيرة ومفهومة باللغة العربية الفصحى الحديثة.",
      so: "Liis 24 muuqaal ah oo bilowga Carabiga ku bara sheekooyin gaagaaban oo Fusha ah.",
    },
    sourceTitle: "complete beginners - MSA",
    sourceChannel: "Arabic Comprehensible",
    language: "arabic",
    level: "beginner",
    lessonCount: 24,
  },
];
