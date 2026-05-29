export interface Lesson {
  id: string;
  title: string;
  titleAr: string;
  titleSo: string;
  duration: string;
  content: string;
  contentAr: string;
  contentSo: string;
  isLocked: boolean;
  hasQuiz: boolean;
  videoUrl?: string;
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  titleAr: string;
  titleSo: string;
  description: string;
  descriptionAr: string;
  descriptionSo: string;
  language: "english" | "arabic" | "somali" | "multilingual";
  level: "beginner" | "intermediate" | "advanced";
  price: number;
  duration: string;
  lessonCount: number;
  enrolledCount: number;
  thumbnail: string;
  imageUrl: string;
  color: string;
  gradient: string;
  lessons: Lesson[];
  category: string;
  section: "curriculum" | "skills";
  subSection?: "school" | "primary" | "secondary" | "university";
  rating: number;
  ratingCount: number;
  certificate: boolean;
  instructor?: string;
  popular?: boolean;
  featured?: boolean;
  isNew?: boolean;
}

const englishBeginner: Course = {
  id: "en-beginner", slug: "english-beginner",
  title: "English for Beginners", titleAr: "الإنجليزية للمبتدئين", titleSo: "Ingiriisi Bilowga",
  description: "Start your English journey from zero. Learn the alphabet, basic words, greetings, numbers, and everyday conversations — all in an AI-powered environment.",
  descriptionAr: "ابدأ رحلتك في تعلم الإنجليزية من الصفر.", descriptionSo: "Bilow safar Ingiriisi ah eber.",
  language: "english", level: "beginner", price: 15, duration: "8 weeks", lessonCount: 12, enrolledCount: 2847,
  thumbnail: "🇬🇧", imageUrl: "https://images.unsplash.com/photo-1546521343-4eb2c01aa44b?w=800&q=80",
  color: "from-blue-500 to-cyan-400", gradient: "bg-gradient-to-br from-blue-600/20 to-cyan-500/20",
  category: "English", section: "curriculum", subSection: "school", rating: 4.9, ratingCount: 412,
  certificate: true, instructor: "Dr. Sarah Ahmed", popular: true, featured: true,
  lessons: [
    { id: "en-b-1", title: "The English Alphabet", titleAr: "الأبجدية الإنجليزية", titleSo: "Xarfaha Ingiriisiga", duration: "12 min", isLocked: false, hasQuiz: true, content: "Learn all 26 letters of the English alphabet with proper pronunciation.", contentAr: "تعلم جميع الـ 26 حرفاً في الأبجدية الإنجليزية.", contentSo: "Baro dhammaan 26 xaraf ee alifbeetada Ingiriisiga." },
    { id: "en-b-2", title: "Greetings & Introductions", titleAr: "التحيات والمقدمات", titleSo: "Salaamaha & Is-barashada", duration: "15 min", isLocked: false, hasQuiz: true, content: "Hello, Hi, Good morning, Good afternoon. How are you? My name is...", contentAr: "مرحبا، صباح الخير، كيف حالك؟", contentSo: "Salaan, Subax wanaagsan, Galab wanaagsan." },
    { id: "en-b-3", title: "Numbers 1–100", titleAr: "الأرقام من 1 إلى 100", titleSo: "Tirooyin 1-100", duration: "18 min", isLocked: false, hasQuiz: true, content: "Count from 1 to 100. Practice counting money, ages, and phone numbers.", contentAr: "العد من 1 إلى 100.", contentSo: "Tirada 1 ilaa 100." },
    { id: "en-b-4", title: "Basic Vocabulary: Colors & Objects", titleAr: "المفردات الأساسية", titleSo: "Ereybaareedka Aasaasiga", duration: "20 min", isLocked: true, hasQuiz: true, content: "Colors: red, blue, green. Objects: book, pen, table, chair.", contentAr: "الألوان والأشياء اليومية.", contentSo: "Midabada iyo walxaha maalinlaha." },
    { id: "en-b-5", title: "Family Members", titleAr: "أفراد العائلة", titleSo: "Xubnaha Qoyska", duration: "15 min", isLocked: true, hasQuiz: true, content: "Mother, father, brother, sister, son, daughter, grandfather, grandmother.", contentAr: "الأم، الأب، الأخ، الأخت، الجد، الجدة.", contentSo: "Hooyo, Aabe, Walaal, Awoowe, Ayeeyo." },
    { id: "en-b-6", title: "Days, Months & Seasons", titleAr: "الأيام والأشهر والفصول", titleSo: "Maalin, Bilaha & Xilliyadda", duration: "22 min", isLocked: true, hasQuiz: true, content: "Days: Monday to Sunday. Months: January through December. Seasons: Spring, Summer, Autumn, Winter.", contentAr: "الأيام والأشهر والفصول الأربعة.", contentSo: "Maalinta, bilaha, xilliyadda." },
    { id: "en-b-7", title: "Daily Routines", titleAr: "الروتين اليومي", titleSo: "Caadooyinka Maalinlaha", duration: "25 min", isLocked: true, hasQuiz: true, content: "Wake up, brush teeth, have breakfast, go to school, have lunch, go home.", contentAr: "الاستيقاظ، تنظيف الأسنان، الإفطار، المدرسة.", contentSo: "Toosid, caleen cadayn, quraac, dugsi." },
    { id: "en-b-8", title: "Food & Drinks", titleAr: "الطعام والمشروبات", titleSo: "Cuntada & Cabitaanka", duration: "20 min", isLocked: true, hasQuiz: true, content: "Breakfast foods, lunch, dinner. Water, tea, coffee, juice.", contentAr: "وجبات الطعام والمشروبات.", contentSo: "Cuntada iyo cabitaanka." },
    { id: "en-b-9", title: "Simple Present Tense", titleAr: "المضارع البسيط", titleSo: "Wakhtiga Hadda Fudud", duration: "30 min", isLocked: true, hasQuiz: true, content: "I work, You work, He/She works. Negatives and questions.", contentAr: "أنا أعمل، أنت تعمل، هو يعمل.", contentSo: "Aniga waxaan shaqeeyaa, Adiga waxaad shaqaysaa." },
    { id: "en-b-10", title: "Basic Conversation Practice", titleAr: "ممارسة المحادثة الأساسية", titleSo: "Tababarka Sheekada Aasaasiga", duration: "35 min", isLocked: true, hasQuiz: false, content: "Dialogue practice: At a shop, At a restaurant, Meeting someone new.", contentAr: "تدريب على الحوار في المتجر والمطعم.", contentSo: "Tababarka sheekada dhamaystiran." },
    { id: "en-b-11", title: "Pronunciation & Phonics", titleAr: "النطق والصوتيات", titleSo: "Dhawaaqa & Phonics", duration: "28 min", isLocked: true, hasQuiz: true, content: "Vowel sounds, consonant clusters, silent letters.", contentAr: "أصوات الحروف المتحركة والساكنة.", contentSo: "Codadka shaqiilayaasha." },
    { id: "en-b-12", title: "Final Review & Certificate", titleAr: "المراجعة النهائية والشهادة", titleSo: "Dib-u-eegista & Shahaadada", duration: "45 min", isLocked: true, hasQuiz: true, content: "Comprehensive review. Final quiz. Pass to earn your Beginner certificate!", contentAr: "مراجعة شاملة واختبار نهائي للشهادة.", contentSo: "Dib-u-eeg dhamaanba si aad shahaadada u hesho." },
  ],
};

const englishIntermediate: Course = {
  id: "en-intermediate", slug: "english-intermediate",
  title: "Intermediate English", titleAr: "الإنجليزية المتوسطة", titleSo: "Ingiriisi Dhexe",
  description: "Level up your English with intermediate grammar, speaking practice, writing skills, business English, and real-world conversation scenarios.",
  descriptionAr: "طوّر مستواك في الإنجليزية بقواعد متوسطة وممارسة المحادثة.", descriptionSo: "Kor u qaad Ingiriisigaaga naxwe dhexe.",
  language: "english", level: "intermediate", price: 25, duration: "10 weeks", lessonCount: 12, enrolledCount: 1924,
  thumbnail: "🇬🇧", imageUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80",
  color: "from-indigo-500 to-blue-400", gradient: "bg-gradient-to-br from-indigo-600/20 to-blue-500/20",
  category: "English", section: "curriculum", subSection: "school", rating: 4.8, ratingCount: 287,
  certificate: true, instructor: "Prof. Omar Hassan",
  lessons: [
    { id: "en-i-1", title: "Past Tense & Past Continuous", titleAr: "الماضي البسيط والمستمر", titleSo: "Wakhtiga Hore", duration: "30 min", isLocked: false, hasQuiz: true, content: "Simple past and past continuous. Irregular verbs.", contentAr: "الماضي البسيط والمستمر. الأفعال الشاذة.", contentSo: "Wakhtiga hore fudud iyo joogta." },
    { id: "en-i-2", title: "Future Tense", titleAr: "المستقبل", titleSo: "Wakhtiga Mustaqbalka", duration: "28 min", isLocked: false, hasQuiz: true, content: "Will and going to. Present continuous for schedules.", contentAr: "will وgoing to للمستقبل.", contentSo: "Will iyo going to mustaqbalka." },
    { id: "en-i-3", title: "Conditionals", titleAr: "الجمل الشرطية", titleSo: "Shuruudaha", duration: "35 min", isLocked: false, hasQuiz: true, content: "First and second conditional sentences.", contentAr: "الشرط الأول والثاني.", contentSo: "Shuruudaha 1aad iyo 2aad." },
    { id: "en-i-4", title: "Business English Basics", titleAr: "أساسيات اللغة الإنجليزية للأعمال", titleSo: "Ingiriisiga Ganacsiga", duration: "40 min", isLocked: true, hasQuiz: true, content: "Professional emails, meeting language, presentations.", contentAr: "البريد الإلكتروني المهني ولغة الاجتماعات.", contentSo: "Emailada xirfadlaha, luuqadda kulanka." },
    { id: "en-i-5", title: "Reading Comprehension", titleAr: "فهم المقروء", titleSo: "Fahanka Akhris", duration: "35 min", isLocked: true, hasQuiz: true, content: "Scanning, skimming, detailed reading strategies.", contentAr: "استراتيجيات القراءة المختلفة.", contentSo: "Xeeladaha akhriska." },
    { id: "en-i-6", title: "Writing Skills", titleAr: "مهارات الكتابة", titleSo: "Xirfadaha Qorista", duration: "40 min", isLocked: true, hasQuiz: true, content: "Paragraph structure, essays, descriptive writing.", contentAr: "هيكل الفقرة والمقالات.", contentSo: "Qaab-dhismeedka xigashada." },
    { id: "en-i-7", title: "Listening Skills & Accents", titleAr: "مهارات الاستماع", titleSo: "Xirfadaha Dhegaysiga", duration: "30 min", isLocked: true, hasQuiz: false, content: "American vs British pronunciation differences.", contentAr: "الاختلافات بين النطق الأمريكي والبريطاني.", contentSo: "Farqiga dhawaaqa Ameerika iyo Ingiriiska." },
    { id: "en-i-8", title: "Real Conversations", titleAr: "محادثات حقيقية", titleSo: "Sheekooyin Dhabta ah", duration: "45 min", isLocked: true, hasQuiz: false, content: "At a job interview, doctor, bank. Making complaints.", contentAr: "مقابلة عمل، طبيب، بنك.", contentSo: "Wareysiga shaqada, dhakhtarka, bangiga." },
    { id: "en-i-9", title: "Phrasal Verbs & Idioms", titleAr: "الأفعال المركبة والتعابير", titleSo: "Feer-ficileedka", duration: "35 min", isLocked: true, hasQuiz: true, content: "Common phrasal verbs and English idioms.", contentAr: "الأفعال المركبة والتعابير الاصطلاحية.", contentSo: "Feer-ficileedka guud iyo tixraacyada." },
    { id: "en-i-10", title: "Present Perfect Tense", titleAr: "المضارع التام", titleSo: "Wakhtiga Hadda Dhamaystiran", duration: "30 min", isLocked: true, hasQuiz: true, content: "Have/has + past participle. Uses and examples.", contentAr: "have/has + المصدر الماضي.", contentSo: "Dhisidda iyo isticmaalka." },
    { id: "en-i-11", title: "Vocabulary Building", titleAr: "بناء المفردات", titleSo: "Dhisidda Ereybaareedka", duration: "25 min", isLocked: true, hasQuiz: true, content: "Word families, prefixes and suffixes.", contentAr: "عائلات الكلمات والبوادئ واللواحق.", contentSo: "Qoysaska ereyga." },
    { id: "en-i-12", title: "Final Project & Certificate", titleAr: "المشروع النهائي والشهادة", titleSo: "Mashruuca & Shahaadada", duration: "50 min", isLocked: true, hasQuiz: true, content: "Write a formal email, mock interview, 2-minute presentation. Earn your certificate!", contentAr: "اكتب بريداً إلكترونياً وشارك في مقابلة.", contentSo: "Qor email, wareysiga, muqaal. Hel shahaadadaada!" },
  ],
};

const englishAdvanced: Course = {
  id: "en-advanced", slug: "english-advanced",
  title: "Advanced English Mastery", titleAr: "إتقان الإنجليزية المتقدمة", titleSo: "Ingiriisi Heer-sare",
  description: "Achieve fluency with advanced grammar, academic writing, public speaking, professional communication, and interview preparation.",
  descriptionAr: "حقق الطلاقة بالقواعد المتقدمة والكتابة الأكاديمية والخطابة.", descriptionSo: "Gaar xirfad dhab ah iyadoo naxwaha sare.",
  language: "english", level: "advanced", price: 35, duration: "12 weeks", lessonCount: 12, enrolledCount: 1203,
  thumbnail: "🇬🇧", imageUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80",
  color: "from-purple-500 to-indigo-400", gradient: "bg-gradient-to-br from-purple-600/20 to-indigo-500/20",
  category: "English", section: "curriculum", subSection: "university", rating: 4.9, ratingCount: 198,
  certificate: true, instructor: "Dr. James Wilson",
  lessons: [
    { id: "en-a-1", title: "Advanced Grammar: Subjunctive & Inversion", titleAr: "القواعد المتقدمة", titleSo: "Naxwaha Sare", duration: "40 min", isLocked: false, hasQuiz: true, content: "Subjunctive mood, inversion for emphasis.", contentAr: "المضارع الاقتراني والقلب.", contentSo: "Subjunctive iyo inversion." },
    { id: "en-a-2", title: "Academic Writing & Research", titleAr: "الكتابة الأكاديمية", titleSo: "Qorista Cilmiga", duration: "50 min", isLocked: false, hasQuiz: true, content: "Thesis statements, argumentation, citing sources.", contentAr: "أطروحات والجدل والاستشهاد.", contentSo: "Bayaanka qoddbaca iyo doodda." },
    { id: "en-a-3", title: "Public Speaking & Presentations", titleAr: "الخطابة العامة", titleSo: "Hadlidda Dadweynaha", duration: "45 min", isLocked: false, hasQuiz: false, content: "Structure, storytelling, body language.", contentAr: "هيكل الخطابة ولغة الجسد.", contentSo: "Qaab-dhismeedka iyo luuqadda jirka." },
    { id: "en-a-4", title: "Advanced Vocabulary", titleAr: "المفردات المتقدمة", titleSo: "Ereybaareedka Sare", duration: "35 min", isLocked: true, hasQuiz: true, content: "Formal vs informal, connotations, word choice.", contentAr: "الرسمي مقابل غير الرسمي، الدلالات.", contentSo: "Rasmiga vs meel kasta, macnaha." },
    { id: "en-a-5", title: "Professional Writing", titleAr: "الكتابة المهنية", titleSo: "Qorista Xirfadlaha", duration: "45 min", isLocked: true, hasQuiz: true, content: "Reports, proposals, executive summaries.", contentAr: "التقارير والمقترحات والملخصات.", contentSo: "Warbixinta, talooyinka, koobbiyada." },
    { id: "en-a-6", title: "Interview Preparation", titleAr: "التحضير للمقابلات", titleSo: "Diyaarinta Wareysiga", duration: "50 min", isLocked: true, hasQuiz: false, content: "STAR method, common questions, salary negotiation.", contentAr: "طريقة STAR والأسئلة الشائعة.", contentSo: "Habka STAR, su'aalaha guud." },
    { id: "en-a-7", title: "Advanced Listening", titleAr: "الاستماع المتقدم", titleSo: "Dhegaysiga Sare", duration: "40 min", isLocked: true, hasQuiz: false, content: "Note-taking, TED talks, identifying bias.", contentAr: "تدوين الملاحظات وخطابات TED.", contentSo: "Qorista xusuusinta, khudbadaha TED." },
    { id: "en-a-8", title: "Discourse & Cohesion", titleAr: "الخطاب والتماسك", titleSo: "Isku-xidhka", duration: "35 min", isLocked: true, hasQuiz: true, content: "Cohesive devices, linkers, discourse markers.", contentAr: "أدوات التماسك والروابط.", contentSo: "Qaababka isku-xidhka." },
    { id: "en-a-9", title: "Culture & Authentic Communication", titleAr: "التواصل الأصيل", titleSo: "Xiriirka Dhab ah", duration: "30 min", isLocked: true, hasQuiz: false, content: "British sarcasm, American humor, cultural references.", contentAr: "الفكاهة البريطانية والأمريكية.", contentSo: "Fakaahnimada Ingiriisiga." },
    { id: "en-a-10", title: "Critical Thinking in English", titleAr: "التفكير النقدي", titleSo: "Fikir-dhexgalka", duration: "40 min", isLocked: true, hasQuiz: true, content: "Analyzing arguments, evaluating sources.", contentAr: "تحليل الحجج وتقييم المصادر.", contentSo: "Falanqaynta doodda." },
    { id: "en-a-11", title: "Media & News English", titleAr: "إنجليزية الإعلام", titleSo: "Ingiriisiga Warbaahinta", duration: "35 min", isLocked: true, hasQuiz: true, content: "News vocabulary, headline grammar, reporting verbs.", contentAr: "مفردات الأخبار وقواعد العناوين.", contentSo: "Ereybaareedka wararka." },
    { id: "en-a-12", title: "Capstone Project & Certificate", titleAr: "مشروع التخرج والشهادة", titleSo: "Mashruuca & Shahaadada", duration: "60 min", isLocked: true, hasQuiz: true, content: "Presentation, analytical essay, debate. Earn your Advanced Certificate!", contentAr: "عرض تقديمي ومقال تحليلي ونقاش.", contentSo: "Muqaal, maqaal falanqayn ah. Hel Shahaadadaada Sare!" },
  ],
};

const arabicBeginner: Course = {
  id: "ar-beginner", slug: "arabic-beginner",
  title: "Arabic for Beginners", titleAr: "العربية للمبتدئين", titleSo: "Carabi Bilowga",
  description: "Start your Arabic journey with the alphabet, basic vocabulary, greetings, numbers, and simple conversations — guided step by step.",
  descriptionAr: "ابدأ رحلتك في تعلم العربية بالأبجدية والمفردات الأساسية.", descriptionSo: "Bilow safarkaaga Carabiga iyadoo lagu socodsiinaayo.",
  language: "arabic", level: "beginner", price: 15, duration: "8 weeks", lessonCount: 12, enrolledCount: 3412,
  thumbnail: "🇸🇦", imageUrl: "https://images.unsplash.com/photo-1585079374502-415f8516dcc3?w=800&q=80",
  color: "from-green-500 to-emerald-400", gradient: "bg-gradient-to-br from-green-600/20 to-emerald-500/20",
  category: "Arabic", section: "curriculum", subSection: "school", rating: 4.9, ratingCount: 521,
  certificate: true, instructor: "Sheikh Abdullah Al-Farsi", popular: true, featured: true,
  lessons: [
    { id: "ar-b-1", title: "The Arabic Alphabet (Part 1)", titleAr: "الأبجدية العربية (الجزء الأول)", titleSo: "Xarfaha Carabiga (Qaybta 1)", duration: "20 min", isLocked: false, hasQuiz: true, content: "Learn the first 14 Arabic letters and how they connect.", contentAr: "تعلم أول 14 حرفاً عربياً.", contentSo: "Baro 14-kii xaraf ee hore." },
    { id: "ar-b-2", title: "The Arabic Alphabet (Part 2)", titleAr: "الأبجدية العربية (الجزء الثاني)", titleSo: "Xarfaha Carabiga (Qaybta 2)", duration: "20 min", isLocked: false, hasQuiz: true, content: "Learn the remaining 14 Arabic letters and form simple words.", contentAr: "تعلم الـ 14 حرفاً المتبقية.", contentSo: "Baro 14-ka xaraf ee kale." },
    { id: "ar-b-3", title: "Vowels (Harakat)", titleAr: "الحركات", titleSo: "Xarfaha Sawirka", duration: "25 min", isLocked: false, hasQuiz: true, content: "Fatha, Damma, Kasra — short vowels. Long vowels.", contentAr: "الفتحة والضمة والكسرة.", contentSo: "Fatha, Damma, Kasra." },
    { id: "ar-b-4", title: "Greetings & Islamic Phrases", titleAr: "التحيات والعبارات الإسلامية", titleSo: "Salaamaha & Ereyada Islaamiga", duration: "15 min", isLocked: true, hasQuiz: true, content: "السلام عليكم، كيف حالك؟ الحمد لله، إن شاء الله.", contentAr: "السلام عليكم وعبارات إسلامية شائعة.", contentSo: "Assalaamu calaykum, Alhamdulillah." },
    { id: "ar-b-5", title: "Arabic Numbers & Counting", titleAr: "الأرقام العربية", titleSo: "Tirada Carabiga", duration: "20 min", isLocked: true, hasQuiz: true, content: "Numbers 1-100 in Arabic.", contentAr: "الأرقام من 1 إلى 100.", contentSo: "Tirada 1-100 ee Carabiga." },
    { id: "ar-b-6", title: "Home & Family Nouns", titleAr: "أسماء المنزل والعائلة", titleSo: "Magacyada Guriga & Qoyska", duration: "25 min", isLocked: true, hasQuiz: true, content: "بيت، غرفة، مطبخ. أب، أم، أخ، أخت.", contentAr: "مفردات المنزل والعائلة.", contentSo: "Guri, qol, jiko. Aabe, hooyo, walaal." },
    { id: "ar-b-7", title: "Daily Life Vocabulary", titleAr: "مفردات الحياة اليومية", titleSo: "Ereybaareedka Maalinlaha", duration: "30 min", isLocked: true, hasQuiz: true, content: "Food, clothing, colors in Arabic.", contentAr: "الطعام والملابس والألوان.", contentSo: "Cunto, dharka, midabada." },
    { id: "ar-b-8", title: "Simple Nominal Sentences", titleAr: "الجمل الاسمية البسيطة", titleSo: "Jumlada Aasaasiga", duration: "35 min", isLocked: true, hasQuiz: true, content: "هذا كتاب. البيت كبير.", contentAr: "الجمل الاسمية البسيطة.", contentSo: "Jumlada magaca fudud." },
    { id: "ar-b-9", title: "Present Tense Verbs", titleAr: "أفعال المضارع", titleSo: "Ficilada Hadda", duration: "35 min", isLocked: true, hasQuiz: true, content: "يذهب، يأكل، يشرب، يقرأ, يكتب.", contentAr: "الأفعال المضارعة وتصريفها.", contentSo: "Ficilada hadda iyo astaanta." },
    { id: "ar-b-10", title: "Basic Conversations", titleAr: "محادثات أساسية", titleSo: "Sheekooyin Aasaasiga", duration: "40 min", isLocked: true, hasQuiz: false, content: "At the market, mosque, meeting someone new.", contentAr: "في السوق والمسجد.", contentSo: "Suuqa, masjidka, kulanku cusub." },
    { id: "ar-b-11", title: "Reading Short Texts", titleAr: "قراءة نصوص قصيرة", titleSo: "Akhriska Qoraalada Gaagaaban", duration: "30 min", isLocked: true, hasQuiz: true, content: "Read simple Arabic texts: short story, prayer, Quran verse.", contentAr: "قراءة نصوص عربية بسيطة.", contentSo: "Akhriso qoraalada Carabiga fudud." },
    { id: "ar-b-12", title: "Final Review & Certificate", titleAr: "المراجعة والشهادة", titleSo: "Dib-u-eeg & Shahaadada", duration: "45 min", isLocked: true, hasQuiz: true, content: "Full review. Pass the final quiz to earn your certificate!", contentAr: "مراجعة شاملة واختبار نهائي للشهادة.", contentSo: "Dib-u-eeg dhamaanba si aad shahaadada u hesho!" },
  ],
};

const arabicIntermediate: Course = {
  id: "ar-intermediate", slug: "arabic-intermediate",
  title: "Intermediate Arabic", titleAr: "العربية المتوسطة", titleSo: "Carabi Dhexe",
  description: "Strengthen your Arabic with intermediate grammar, Quran reading skills, conversational fluency, and Modern Standard Arabic.",
  descriptionAr: "تعزيز العربية بالقواعد المتوسطة ومهارات قراءة القرآن.", descriptionSo: "Xooji Carabigaaga naxwe dhexe.",
  language: "arabic", level: "intermediate", price: 25, duration: "10 weeks", lessonCount: 12, enrolledCount: 2156,
  thumbnail: "🇸🇦", imageUrl: "https://images.unsplash.com/photo-1609743522653-52354461eb27?w=800&q=80",
  color: "from-teal-500 to-green-400", gradient: "bg-gradient-to-br from-teal-600/20 to-green-500/20",
  category: "Arabic", section: "curriculum", subSection: "university", rating: 4.8, ratingCount: 334,
  certificate: true, instructor: "Sheikh Yusuf Al-Makki",
  lessons: [
    { id: "ar-i-1", title: "Arabic Verb Forms & Conjugation", titleAr: "أوزان الفعل العربي", titleSo: "Qaababka Ficilka Carabiga", duration: "40 min", isLocked: false, hasQuiz: true, content: "Three-letter root system. Verb forms I, II, III.", contentAr: "نظام الجذر الثلاثي وأوزان الفعل.", contentSo: "Nidaamka xididdiga saddex-xarfood." },
    { id: "ar-i-2", title: "Noun Cases (I'rab)", titleAr: "إعراب الأسماء", titleSo: "Xaalladaha Magaca", duration: "45 min", isLocked: false, hasQuiz: true, content: "Nominative, Accusative, Genitive cases.", contentAr: "المرفوع والمنصوب والمجرور.", contentSo: "Xaalladaha magaca." },
    { id: "ar-i-3", title: "Definiteness & Indefiniteness", titleAr: "التعريف والتنكير", titleSo: "Gaar-noocnimada", duration: "30 min", isLocked: false, hasQuiz: true, content: "Al- prefix, tanwin, solar and lunar letters.", contentAr: "أل التعريف والتنوين.", contentSo: "Hordhaca al- iyo tanwiin." },
    { id: "ar-i-4", title: "Quranic Arabic Essentials", titleAr: "أساسيات اللغة القرآنية", titleSo: "Aasaaska Luuqadda Qur'aaniga", duration: "50 min", isLocked: true, hasQuiz: true, content: "Key Quranic vocabulary, tajweed basics.", contentAr: "المفردات القرآنية وأساسيات التجويد.", contentSo: "Ereybaareedka Qur'aaniga." },
    { id: "ar-i-5", title: "Modern Standard Arabic (MSA)", titleAr: "اللغة العربية الفصحى", titleSo: "Carabiga Caadiga ah", duration: "40 min", isLocked: true, hasQuiz: true, content: "MSA vs colloquial. Reading newspapers.", contentAr: "الفصحى مقابل العامية.", contentSo: "MSA vs Carabiga Carrada." },
    { id: "ar-i-6", title: "Arabic Writing Styles", titleAr: "أساليب الكتابة العربية", titleSo: "Hababka Qoraalka", duration: "35 min", isLocked: true, hasQuiz: true, content: "Naskh, Ruq'a scripts. Formal letter writing.", contentAr: "خط النسخ والرقعة. كتابة الرسائل.", contentSo: "Qoraalka Naskh, Ruq'a." },
    { id: "ar-i-7", title: "Arabic Literature & Poetry", titleAr: "الأدب العربي والشعر", titleSo: "Suugaanta Carabiga", duration: "45 min", isLocked: true, hasQuiz: false, content: "Classical Arabic poetry and prose.", contentAr: "الشعر العربي الكلاسيكي والنثر.", contentSo: "Gabayada iyo suugaanta Carabiga." },
    { id: "ar-i-8", title: "Conversational Arabic", titleAr: "محادثة بالعربية", titleSo: "Sheekada Carabiga", duration: "50 min", isLocked: true, hasQuiz: false, content: "Airport, shopping, medical situations.", contentAr: "المطار والتسوق والعيادة.", contentSo: "Garoonka, suuqa, rugta caafimaadka." },
    { id: "ar-i-9", title: "Arabic Media & News", titleAr: "الإعلام العربي", titleSo: "Warbaahinta Carabiga", duration: "40 min", isLocked: true, hasQuiz: true, content: "Al Jazeera vocabulary, news reading.", contentAr: "مفردات الجزيرة وقراءة الأخبار.", contentSo: "Ereybaareedka Al Jazeera." },
    { id: "ar-i-10", title: "Business Arabic", titleAr: "العربية التجارية", titleSo: "Carabiga Ganacsiga", duration: "45 min", isLocked: true, hasQuiz: true, content: "Contracts, meetings, professional emails.", contentAr: "العقود والاجتماعات والبريد الإلكتروني.", contentSo: "Heshiisyada, kulannada." },
    { id: "ar-i-11", title: "Advanced Reading Practice", titleAr: "ممارسة القراءة المتقدمة", titleSo: "Tababarka Akhriska Sare", duration: "40 min", isLocked: true, hasQuiz: true, content: "Long texts, articles, comprehension exercises.", contentAr: "نصوص طويلة ومقالات وتمارين.", contentSo: "Qoraalada dhaadheer." },
    { id: "ar-i-12", title: "Final Review & Certificate", titleAr: "المراجعة والشهادة", titleSo: "Dib-u-eeg & Shahaadada", duration: "55 min", isLocked: true, hasQuiz: true, content: "Comprehensive final exam. Earn your Intermediate Arabic Certificate!", contentAr: "اختبار نهائي شامل للشهادة.", contentSo: "Imtixaan kama-dambeysta. Hel shahaadadaada!" },
  ],
};

const mathSchool: Course = {
  id: "math-school", slug: "mathematics-school",
  title: "Mathematics – School Level", titleAr: "الرياضيات – المستوى المدرسي", titleSo: "Xisaabta – Heerka Dugsiga",
  description: "Master school mathematics from basic arithmetic to algebra, geometry, and statistics. Perfect for students grades 5–12.",
  descriptionAr: "أتقن رياضيات المدرسة من الحساب الأساسي إلى الجبر والهندسة والإحصاء.", descriptionSo: "Soo xifdiso xisaabta dugsiga eber ilaa algebra, geometry, iyo statistics.",
  language: "multilingual", level: "beginner", price: 20, duration: "12 weeks", lessonCount: 10, enrolledCount: 1876,
  thumbnail: "📐", imageUrl: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&q=80",
  color: "from-blue-600 to-blue-400", gradient: "bg-gradient-to-br from-blue-700/20 to-blue-500/20",
  category: "Mathematics", section: "curriculum", subSection: "school", rating: 4.7, ratingCount: 312,
  certificate: true, instructor: "Dr. Aisha Mohamed", popular: true,
  lessons: [
    { id: "math-1", title: "Numbers & Operations", titleAr: "الأرقام والعمليات", titleSo: "Tirooyin & Hawlgallada", duration: "30 min", isLocked: false, hasQuiz: true, content: "Whole numbers, fractions, decimals, operations.", contentAr: "الأعداد الصحيحة والكسور والعمليات الأساسية.", contentSo: "Tirada dhamaystiran, jajab, hawlgallada." },
    { id: "math-2", title: "Algebra Fundamentals", titleAr: "أساسيات الجبر", titleSo: "Aasaaska Algebra", duration: "40 min", isLocked: false, hasQuiz: true, content: "Variables, equations, inequalities, linear functions.", contentAr: "المتغيرات والمعادلات وعدم المساواة.", contentSo: "Doorsoomayaasha, jidhaafyada, functions-ka." },
    { id: "math-3", title: "Geometry & Shapes", titleAr: "الهندسة والأشكال", titleSo: "Geometry & Qaababka", duration: "35 min", isLocked: false, hasQuiz: true, content: "Triangles, circles, area, volume, Pythagorean theorem.", contentAr: "المثلثات والدوائر والمساحة والحجم.", contentSo: "Saddex-xagalka, gooska, baaxadda, cufnaanta." },
    { id: "math-4", title: "Statistics & Probability", titleAr: "الإحصاء والاحتمالات", titleSo: "Statistics & Suurtogalnimada", duration: "35 min", isLocked: true, hasQuiz: true, content: "Mean, median, mode, probability, data interpretation.", contentAr: "المتوسط والوسيط والمنوال والاحتمال.", contentSo: "Celceliska, dhexdhexaadka, xoogga, suurtogalnimada." },
    { id: "math-5", title: "Quadratic Equations", titleAr: "المعادلات التربيعية", titleSo: "Jidhaafyada Labajibaaranaha", duration: "40 min", isLocked: true, hasQuiz: true, content: "Factoring, quadratic formula, graphing parabolas.", contentAr: "التحليل إلى عوامل وصيغة الحل التربيعي.", contentSo: "Kala-saarka, qaacidada labajibaaranaha." },
    { id: "math-6", title: "Trigonometry Basics", titleAr: "أساسيات علم المثلثات", titleSo: "Aasaaska Trigonometry", duration: "45 min", isLocked: true, hasQuiz: true, content: "Sine, cosine, tangent. Unit circle. Solving triangles.", contentAr: "الجيب وجيب التمام والظل.", contentSo: "Sine, cosine, tangent." },
    { id: "math-7", title: "Functions & Graphs", titleAr: "الدوال والرسوم البيانية", titleSo: "Functions-ka & Graafyada", duration: "40 min", isLocked: true, hasQuiz: true, content: "Linear, quadratic, exponential functions and their graphs.", contentAr: "الدوال الخطية والتربيعية والأسية.", contentSo: "Functions-ka xariijiga, labajibaaranaha, koritaanka." },
    { id: "math-8", title: "Calculus Introduction", titleAr: "مقدمة في حساب التفاضل والتكامل", titleSo: "Hordhaca Calculus", duration: "50 min", isLocked: true, hasQuiz: true, content: "Limits, derivatives, basic integration.", contentAr: "الحدود والمشتقات والتكامل الأساسي.", contentSo: "Xaddiga, la-saarka, tibaaxaha." },
    { id: "math-9", title: "Problem Solving Strategies", titleAr: "استراتيجيات حل المسائل", titleSo: "Xeeladaha Xalka Dhibaatada", duration: "40 min", isLocked: true, hasQuiz: false, content: "Word problems, logical reasoning, exam preparation.", contentAr: "المسائل النصية والمنطق الرياضي.", contentSo: "Dhibaatooyinka ereyga, caqli-galka." },
    { id: "math-10", title: "Final Exam & Certificate", titleAr: "الامتحان النهائي والشهادة", titleSo: "Imtixaanka & Shahaadada", duration: "60 min", isLocked: true, hasQuiz: true, content: "Comprehensive math exam. Earn your Mathematics Certificate!", contentAr: "امتحان رياضيات شامل للشهادة.", contentSo: "Imtixaanka xisaabta dhamaystiran. Hel shahaadadaada!" },
  ],
};

const scienceSchool: Course = {
  id: "science-school", slug: "general-science-school",
  title: "General Science – School Level", titleAr: "العلوم العامة – المستوى المدرسي", titleSo: "Sayniska Guud – Heerka Dugsiga",
  description: "Explore biology, chemistry, physics, and earth sciences with engaging lessons, experiments, and real-world examples.",
  descriptionAr: "استكشف الأحياء والكيمياء والفيزياء وعلوم الأرض.", descriptionSo: "Sahmi biology, chemistry, physics, iyo cilmiga dhulka.",
  language: "multilingual", level: "beginner", price: 20, duration: "10 weeks", lessonCount: 8, enrolledCount: 1543,
  thumbnail: "🔬", imageUrl: "https://images.unsplash.com/photo-1532094349884-543559c8d6a0?w=800&q=80",
  color: "from-green-600 to-teal-400", gradient: "bg-gradient-to-br from-green-700/20 to-teal-500/20",
  category: "Science", section: "curriculum", subSection: "school", rating: 4.6, ratingCount: 224,
  certificate: true, instructor: "Dr. Hamdi Ibrahim",
  lessons: [
    { id: "sci-1", title: "Biology: Cells & Life", titleAr: "الأحياء: الخلايا والحياة", titleSo: "Biology: Unugyada & Nolosha", duration: "35 min", isLocked: false, hasQuiz: true, content: "Cell structure, photosynthesis, respiration, classification of living things.", contentAr: "بنية الخلية والتمثيل الضوئي والتنفس.", contentSo: "Qaab-dhismeedka unugga, sawir-guurka." },
    { id: "sci-2", title: "Chemistry: Matter & Reactions", titleAr: "الكيمياء: المادة والتفاعلات", titleSo: "Chemistry: Maadada & Falcelinta", duration: "40 min", isLocked: false, hasQuiz: true, content: "Atoms, elements, compounds, chemical reactions, periodic table.", contentAr: "الذرات والعناصر والمركبات والتفاعلات.", contentSo: "Atomiyada, curiyeyaasha, falcelinta kiimikada." },
    { id: "sci-3", title: "Physics: Forces & Motion", titleAr: "الفيزياء: القوى والحركة", titleSo: "Physics: Xoogaga & Dhaqdhaqaaqa", duration: "40 min", isLocked: false, hasQuiz: true, content: "Newton's laws, gravity, friction, speed, acceleration.", contentAr: "قوانين نيوتن والجاذبية والاحتكاك.", contentSo: "Sharciyada Newton, jiidada dhulka, xawaare." },
    { id: "sci-4", title: "Earth Sciences", titleAr: "علوم الأرض", titleSo: "Cilmiga Dhulka", duration: "35 min", isLocked: true, hasQuiz: true, content: "Geology, plate tectonics, atmosphere, weather, ecosystems.", contentAr: "الجيولوجيا وحركة القشرة الأرضية والمناخ.", contentSo: "Geology, tectonics, jawiga, cimilada." },
    { id: "sci-5", title: "Human Body & Health", titleAr: "جسم الإنسان والصحة", titleSo: "Jirka Bini'aadamka & Caafimaadka", duration: "35 min", isLocked: true, hasQuiz: true, content: "Body systems: digestive, respiratory, circulatory, nervous.", contentAr: "أجهزة الجسم: الهضمي والتنفسي والدوري.", contentSo: "Nidaamyada jirka: dheefka, neefsiga, dhiigga." },
    { id: "sci-6", title: "Energy & Environment", titleAr: "الطاقة والبيئة", titleSo: "Tamarida & Deegaanka", duration: "40 min", isLocked: true, hasQuiz: true, content: "Renewable vs non-renewable energy, climate change, conservation.", contentAr: "الطاقة المتجددة وغير المتجددة وتغير المناخ.", contentSo: "Tamarida la cusboonaysiin karo vs. ma-cusboonaysiisan." },
    { id: "sci-7", title: "Scientific Method & Experiments", titleAr: "المنهج العلمي والتجارب", titleSo: "Habka Sayniska & Tijaaboyinka", duration: "30 min", isLocked: true, hasQuiz: false, content: "Hypothesis, experiment design, data collection, conclusions.", contentAr: "الفرضية وتصميم التجربة وجمع البيانات.", contentSo: "Faradhiga, naqshadeynta tijaabooyinka." },
    { id: "sci-8", title: "Final Science Review & Certificate", titleAr: "المراجعة والشهادة", titleSo: "Dib-u-eeg & Shahaadada", duration: "50 min", isLocked: true, hasQuiz: true, content: "Comprehensive science review. Final exam. Earn your Science Certificate!", contentAr: "مراجعة شاملة للعلوم. اختبار نهائي.", contentSo: "Dib-u-eeg guud. Hel shahaadadaada!" },
  ],
};

const computerScienceUni: Course = {
  id: "cs-university", slug: "computer-science-university",
  title: "Computer Science – University Level", titleAr: "علوم الحاسوب – مستوى الجامعة", titleSo: "Sayniska Kombiyuutarka – Heerka Jaamacadda",
  description: "University-level computer science covering algorithms, data structures, operating systems, databases, and software engineering principles.",
  descriptionAr: "علوم حاسوب على مستوى الجامعة تشمل الخوارزميات وهياكل البيانات.", descriptionSo: "Sayniska kombiyuutarka heerka jaamacadda: algorithms, data structures, databases.",
  language: "multilingual", level: "advanced", price: 49, duration: "16 weeks", lessonCount: 12, enrolledCount: 987,
  thumbnail: "🎓", imageUrl: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&q=80",
  color: "from-violet-600 to-purple-400", gradient: "bg-gradient-to-br from-violet-700/20 to-purple-500/20",
  category: "Computer Science", section: "curriculum", subSection: "university", rating: 4.8, ratingCount: 178,
  certificate: true, instructor: "Prof. Abdullahi Ahmed", featured: true, isNew: true,
  lessons: [
    { id: "cs-1", title: "Introduction to Computer Science", titleAr: "مقدمة في علوم الحاسوب", titleSo: "Hordhac Sayniska Kombiyuutarka", duration: "40 min", isLocked: false, hasQuiz: true, content: "History, binary, logic gates, how computers work.", contentAr: "التاريخ والثنائي والبوابات المنطقية.", contentSo: "Taariikhda, binary, logic gates." },
    { id: "cs-2", title: "Programming Fundamentals", titleAr: "أساسيات البرمجة", titleSo: "Aasaaska Barnaamijka", duration: "50 min", isLocked: false, hasQuiz: true, content: "Variables, loops, conditionals, functions in Python.", contentAr: "المتغيرات والحلقات والشروط والدوال.", contentSo: "Doorsoomayaasha, wareegyada, shuruudaha, functions-ka." },
    { id: "cs-3", title: "Data Structures", titleAr: "هياكل البيانات", titleSo: "Qaab-dhismeedka Xogta", duration: "55 min", isLocked: false, hasQuiz: true, content: "Arrays, linked lists, stacks, queues, trees, graphs.", contentAr: "المصفوفات والقوائم المرتبطة والأشجار.", contentSo: "Arrays, linked lists, stacks, queues, trees." },
    { id: "cs-4", title: "Algorithms & Complexity", titleAr: "الخوارزميات والتعقيد", titleSo: "Algorithms & Kakan", duration: "60 min", isLocked: true, hasQuiz: true, content: "Sorting, searching, Big-O notation, recursion.", contentAr: "الترتيب والبحث وتعقيد الخوارزمية.", contentSo: "Sorting, searching, Big-O." },
    { id: "cs-5", title: "Databases & SQL", titleAr: "قواعد البيانات وSQL", titleSo: "Xogaha & SQL", duration: "55 min", isLocked: true, hasQuiz: true, content: "Relational databases, SQL queries, normalization.", contentAr: "قواعد البيانات العلائقية واستعلامات SQL.", contentSo: "Xogaha xidiidhsan, su'aalaha SQL." },
    { id: "cs-6", title: "Operating Systems", titleAr: "أنظمة التشغيل", titleSo: "Nidaamyada Hawlgelinta", duration: "50 min", isLocked: true, hasQuiz: true, content: "Processes, memory management, file systems, scheduling.", contentAr: "العمليات وإدارة الذاكرة وأنظمة الملفات.", contentSo: "Hawlaha, maareynta xasuusta." },
    { id: "cs-7", title: "Networking & Internet", titleAr: "الشبكات والإنترنت", titleSo: "Shabakadaha & Internet", duration: "45 min", isLocked: true, hasQuiz: true, content: "TCP/IP, HTTP, DNS, client-server architecture.", contentAr: "TCP/IP وHTTP وDNS والشبكات.", contentSo: "TCP/IP, HTTP, DNS, qaab-dhismeedka." },
    { id: "cs-8", title: "Software Engineering", titleAr: "هندسة البرمجيات", titleSo: "Injineerada Barnaamijka", duration: "50 min", isLocked: true, hasQuiz: true, content: "SDLC, Agile, version control, testing, documentation.", contentAr: "دورة حياة تطوير البرمجيات وAgile.", contentSo: "SDLC, Agile, version control." },
    { id: "cs-9", title: "Web Development Overview", titleAr: "نظرة عامة على تطوير الويب", titleSo: "Hordhaca Horumarinta Web-ka", duration: "45 min", isLocked: true, hasQuiz: false, content: "HTML, CSS, JavaScript, frontend vs backend, frameworks.", contentAr: "HTML وCSS وJavaScript والويب.", contentSo: "HTML, CSS, JavaScript, web-ka." },
    { id: "cs-10", title: "Cybersecurity Fundamentals", titleAr: "أساسيات الأمن السيبراني", titleSo: "Aasaaska Amniga Saybarka", duration: "45 min", isLocked: true, hasQuiz: true, content: "Threats, encryption, authentication, ethical hacking basics.", contentAr: "التهديدات والتشفير والمصادقة.", contentSo: "Khatarada, sirta, xaqiijinta." },
    { id: "cs-11", title: "Artificial Intelligence Intro", titleAr: "مقدمة في الذكاء الاصطناعي", titleSo: "Hordhaca AI", duration: "50 min", isLocked: true, hasQuiz: true, content: "ML, neural networks, NLP, computer vision, AI applications.", contentAr: "التعلم الآلي والشبكات العصبية ومعالجة اللغة.", contentSo: "ML, shabakadaha neerfaha, AI codsiyada." },
    { id: "cs-12", title: "Capstone Project & Degree Certificate", titleAr: "مشروع التخرج وشهادة الدرجة", titleSo: "Mashruuca & Shahaadada", duration: "90 min", isLocked: true, hasQuiz: true, content: "Final project: Build and present a software application. Earn your CS Certificate!", contentAr: "مشروع نهائي: بناء تطبيق برمجي. احصل على شهادتك!", contentSo: "Mashruuca kama-dambeysta. Hel shahaadadaada CS!" },
  ],
};

const islamicStudiesUni: Course = {
  id: "islamic-studies", slug: "islamic-studies-university",
  title: "Islamic Studies – University Level", titleAr: "الدراسات الإسلامية – مستوى الجامعة", titleSo: "Cilmiga Islaamiga – Heerka Jaamacadda",
  description: "Comprehensive university-level Islamic studies covering Quran, Hadith, Fiqh, Aqeedah, Islamic history, and contemporary issues.",
  descriptionAr: "دراسات إسلامية جامعية شاملة تشمل القرآن والحديث والفقه والعقيدة.", descriptionSo: "Cilmiga Islaamiga oo dhammaystiran: Qur'aan, Xadiis, Fiqh, Caqiido.",
  language: "arabic", level: "intermediate", price: 35, duration: "14 weeks", lessonCount: 10, enrolledCount: 2341,
  thumbnail: "🕌", imageUrl: "https://images.unsplash.com/photo-1545987796-200677ee1011?w=800&q=80",
  color: "from-amber-500 to-yellow-400", gradient: "bg-gradient-to-br from-amber-600/20 to-yellow-500/20",
  category: "Islamic Studies", section: "curriculum", subSection: "university", rating: 4.9, ratingCount: 445,
  certificate: true, instructor: "Sheikh Dr. Mahad Hassan", popular: true, featured: true,
  lessons: [
    { id: "isl-1", title: "Quran Sciences (Uloom al-Quran)", titleAr: "علوم القرآن", titleSo: "Cilmiga Qur'aanka", duration: "50 min", isLocked: false, hasQuiz: true, content: "Revelation, compilation, preservation, tafsir methodology.", contentAr: "الوحي والجمع والحفظ ومنهج التفسير.", contentSo: "Waxyiga, ururinta, ilaalinta, manhajka tafseerka." },
    { id: "isl-2", title: "Hadith Sciences", titleAr: "علوم الحديث", titleSo: "Cilmiga Xadiiska", duration: "50 min", isLocked: false, hasQuiz: true, content: "Classification of hadith, isnad, narrators, major hadith collections.", contentAr: "تصنيف الحديث والسند والرواة.", contentSo: "Kala-soocista xadiiska, sanad, riwaayadaha." },
    { id: "isl-3", title: "Fiqh – Islamic Jurisprudence", titleAr: "الفقه الإسلامي", titleSo: "Fiqhiga Islaamiga", duration: "60 min", isLocked: false, hasQuiz: true, content: "Four madhabs, usul al-fiqh, ijtihad, contemporary rulings.", contentAr: "المذاهب الأربعة وأصول الفقه والاجتهاد.", contentSo: "Afarta madhab, usulul-fiqh, ijtihaadka." },
    { id: "isl-4", title: "Aqeedah – Islamic Theology", titleAr: "العقيدة الإسلامية", titleSo: "Caqiidada Islaamiga", duration: "55 min", isLocked: true, hasQuiz: true, content: "Six pillars of iman, divine attributes, prophethood, eschatology.", contentAr: "أركان الإيمان الستة وصفات الله.", contentSo: "Tijaabada imaan, sifooyinka Alle." },
    { id: "isl-5", title: "Seerah – Life of the Prophet", titleAr: "السيرة النبوية", titleSo: "Seerada Nabiga ﷺ", duration: "60 min", isLocked: true, hasQuiz: true, content: "Birth, mission, migration, battles, character, legacy.", contentAr: "الولادة والبعثة والهجرة والغزوات والشخصية.", contentSo: "Dhalashada, risaalada, hijrada, dagaaladaha." },
    { id: "isl-6", title: "Islamic History & Civilization", titleAr: "التاريخ الإسلامي والحضارة", titleSo: "Taariikhda & Badhtamaha Islaamiga", duration: "55 min", isLocked: true, hasQuiz: true, content: "Rightly-guided caliphs, Umayyad, Abbasid, Ottoman empires.", contentAr: "الخلفاء الراشدون والأموية والعباسية والعثمانية.", contentSo: "Khaliifadii rashida, Umawiyiin, Cabbaasiyiin." },
    { id: "isl-7", title: "Islamic Ethics & Character", titleAr: "الأخلاق الإسلامية", titleSo: "Akhlaaqa Islaamiga", duration: "45 min", isLocked: true, hasQuiz: false, content: "Akhlaq, tawbah, patience, gratitude, honesty, generosity.", contentAr: "الأخلاق والتوبة والصبر والشكر والأمانة.", contentSo: "Akhlaaqa, tawbada, sabrida, mahadnaqida." },
    { id: "isl-8", title: "Contemporary Islamic Issues", titleAr: "القضايا الإسلامية المعاصرة", titleSo: "Arrimaha Islaamiga ee Casriga", duration: "50 min", isLocked: true, hasQuiz: true, content: "Islam and modernity, bioethics, finance, interfaith dialogue.", contentAr: "الإسلام والحداثة والأخلاقيات الحيوية.", contentSo: "Islaamka iyo casriyaynta, dhaqaalaha, wada-hadallada." },
    { id: "isl-9", title: "Arabic for Quranic Studies", titleAr: "العربية للدراسات القرآنية", titleSo: "Carabiga Daraasaadka Qur'aaniga", duration: "45 min", isLocked: true, hasQuiz: true, content: "Quranic grammar, morphology, understanding Arabic revelation.", contentAr: "نحو القرآن وصرفه وفهم الوحي العربي.", contentSo: "Naxwaha Qur'aaniga, sarafka." },
    { id: "isl-10", title: "Final Comprehensive Exam & Certificate", titleAr: "الاختبار الشامل والشهادة", titleSo: "Imtixaanka Guud & Shahaadada", duration: "90 min", isLocked: true, hasQuiz: true, content: "Comprehensive Islamic Studies examination. Earn your University Certificate!", contentAr: "اختبار شامل للدراسات الإسلامية. احصل على شهادتك!", contentSo: "Imtixaan guud. Hel shahaadadaada Jaamacadda!" },
  ],
};

const aiCourse: Course = {
  id: "ai-mastery", slug: "ai-mastery",
  title: "AI & Machine Learning Mastery", titleAr: "إتقان الذكاء الاصطناعي والتعلم الآلي", titleSo: "AI & Machine Learning Soo Xifdiso",
  description: "Learn AI from scratch. Master ChatGPT, Midjourney, automation tools, prompt engineering, and build your own AI-powered projects.",
  descriptionAr: "تعلم الذكاء الاصطناعي من الصفر. أتقن ChatGPT وMidjourney وأدوات الأتمتة.", descriptionSo: "Baro AI eber. Soo xifdiso ChatGPT, Midjourney, automation tools.",
  language: "multilingual", level: "beginner", price: 39, duration: "10 weeks", lessonCount: 12, enrolledCount: 4521,
  thumbnail: "🤖", imageUrl: "https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=800&q=80",
  color: "from-violet-600 to-blue-500", gradient: "bg-gradient-to-br from-violet-700/20 to-blue-600/20",
  category: "AI & Technology", section: "skills", rating: 4.9, ratingCount: 867, certificate: true,
  instructor: "Dr. Abdi Tech", popular: true, featured: true, isNew: true,
  lessons: [
    { id: "ai-1", title: "Introduction to AI & ChatGPT", titleAr: "مقدمة في AI وChatGPT", titleSo: "Hordhaca AI & ChatGPT", duration: "25 min", isLocked: false, hasQuiz: true, content: "What is AI? Large Language Models, ChatGPT, Gemini, Claude basics.", contentAr: "ما هو الذكاء الاصطناعي؟ نماذج اللغة الكبيرة وChatGPT.", contentSo: "AI waa maxay? Moodeelasha luuqadda ee weyn, ChatGPT." },
    { id: "ai-2", title: "Prompt Engineering Masterclass", titleAr: "أسلوب Prompt الاحترافي", titleSo: "Prompt Engineering Soo Xifdiso", duration: "35 min", isLocked: false, hasQuiz: true, content: "Prompt techniques: chain-of-thought, few-shot, zero-shot, role-play, structured output.", contentAr: "تقنيات Prompt: سلسلة الأفكار والأمثلة القليلة.", contentSo: "Farsamooyinka Prompt: chain-of-thought, few-shot." },
    { id: "ai-3", title: "AI Image Generation", titleAr: "توليد الصور بالذكاء الاصطناعي", titleSo: "Abuurista Sawirrada AI", duration: "30 min", isLocked: false, hasQuiz: true, content: "Midjourney, DALL-E, Stable Diffusion. Prompt crafting for images.", contentAr: "Midjourney وDALL-E وStable Diffusion.", contentSo: "Midjourney, DALL-E, Stable Diffusion." },
    { id: "ai-4", title: "AI Automation & Workflows", titleAr: "أتمتة الذكاء الاصطناعي", titleSo: "Automation-ka AI", duration: "40 min", isLocked: true, hasQuiz: true, content: "Zapier, Make (Integromat), n8n. AI agents, autonomous workflows.", contentAr: "Zapier وMake وn8n. وكلاء الذكاء الاصطناعي.", contentSo: "Zapier, Make, n8n. Wakiilada AI." },
    { id: "ai-5", title: "Build AI-Powered Apps (No Code)", titleAr: "بناء تطبيقات مدعومة بالذكاء الاصطناعي", titleSo: "Dhis Apps AI (Koodh La'aan)", duration: "45 min", isLocked: true, hasQuiz: true, content: "Bubble.io, Glide, FlutterFlow with AI APIs. Build your first AI app.", contentAr: "Bubble.io وGlide مع واجهات برمجة الذكاء الاصطناعي.", contentSo: "Bubble.io, Glide, FlutterFlow apps AI ah." },
    { id: "ai-6", title: "AI for Content Creation", titleAr: "الذكاء الاصطناعي لإنشاء المحتوى", titleSo: "AI Abuurista Nuxurka", duration: "35 min", isLocked: true, hasQuiz: false, content: "Write blog posts, social media, scripts with AI. Jasper, Copy.ai, Writesonic.", contentAr: "كتابة المدونات ووسائل التواصل والسيناريوهات.", contentSo: "Qor blogs, baraha bulshada, scriptka AI la." },
    { id: "ai-7", title: "Machine Learning Fundamentals", titleAr: "أساسيات التعلم الآلي", titleSo: "Aasaaska Machine Learning", duration: "50 min", isLocked: true, hasQuiz: true, content: "Supervised, unsupervised learning. Training, testing, evaluation. Python sklearn.", contentAr: "التعلم المُشرف وغير المُشرف. التدريب والاختبار.", contentSo: "Waxbarashada la kormeerto vs la-la koormereyno." },
    { id: "ai-8", title: "Neural Networks & Deep Learning", titleAr: "الشبكات العصبية والتعلم العميق", titleSo: "Neural Networks & Deep Learning", duration: "55 min", isLocked: true, hasQuiz: true, content: "How neural networks work. CNNs, RNNs, transformers. TensorFlow basics.", contentAr: "كيف تعمل الشبكات العصبية. CNNs وRNNs.", contentSo: "Sida shabakadaha neerfaha u shaqeyso." },
    { id: "ai-9", title: "Natural Language Processing (NLP)", titleAr: "معالجة اللغة الطبيعية", titleSo: "Tacaabul-bixinta Luuqadda Dabiiciga", duration: "50 min", isLocked: true, hasQuiz: true, content: "Text classification, sentiment analysis, named entity recognition, LLMs.", contentAr: "تصنيف النص وتحليل المشاعر.", contentSo: "Kala-soocista qoraalka, falanqaynta dareenka." },
    { id: "ai-10", title: "AI Ethics & Responsible AI", titleAr: "أخلاقيات الذكاء الاصطناعي", titleSo: "Akhlaaqa AI & Mas'uuliyadda", duration: "30 min", isLocked: true, hasQuiz: true, content: "Bias, fairness, privacy, deepfakes, AI regulations.", contentAr: "التحيز والعدالة والخصوصية وتنظيم الذكاء الاصطناعي.", contentSo: "Khiyaano, caddaalad, sirta, xeerarka AI." },
    { id: "ai-11", title: "AI Freelancing & Business", titleAr: "العمل الحر والأعمال بالذكاء الاصطناعي", titleSo: "Freelancing & Ganacsi AI", duration: "40 min", isLocked: true, hasQuiz: false, content: "Selling AI services, AI agency, AI consulting. Top AI skills in demand.", contentAr: "بيع خدمات الذكاء الاصطناعي ووكالة الذكاء الاصطناعي.", contentSo: "Iib adeegyada AI, hay'adda AI." },
    { id: "ai-12", title: "Capstone: AI Project & Certificate", titleAr: "المشروع النهائي وشهادة الذكاء الاصطناعي", titleSo: "Mashruuca & Shahaadada AI", duration: "80 min", isLocked: true, hasQuiz: true, content: "Build a full AI-powered project. Present and document. Earn your AI Mastery Certificate!", contentAr: "بناء مشروع كامل مدعوم بالذكاء الاصطناعي.", contentSo: "Dhis mashruuc AI oo dhamaystiran. Hel shahaadadaada!" },
  ],
};

const pythonCourse: Course = {
  id: "python-programming", slug: "python-programming",
  title: "Python Programming – Zero to Hero", titleAr: "برمجة Python – من الصفر إلى الاحتراف", titleSo: "Barnaamijka Python – Eber ilaa Khabiir",
  description: "Learn Python from scratch and build real projects: web apps, automation scripts, data analysis, and APIs. Your gateway to software jobs.",
  descriptionAr: "تعلم Python من الصفر وابنِ مشاريع حقيقية: تطبيقات ويب وسكريبتات أتمتة.", descriptionSo: "Baro Python eber oo dhis mashaaariic dhab ah: apps, automation, xogta.",
  language: "multilingual", level: "beginner", price: 35, duration: "12 weeks", lessonCount: 12, enrolledCount: 3245,
  thumbnail: "🐍", imageUrl: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=800&q=80",
  color: "from-yellow-500 to-green-500", gradient: "bg-gradient-to-br from-yellow-600/20 to-green-600/20",
  category: "Programming", section: "skills", rating: 4.8, ratingCount: 621, certificate: true,
  instructor: "Eng. Farhan Ali", popular: true, isNew: true,
  lessons: [
    { id: "py-1", title: "Python Basics: Setup & Syntax", titleAr: "أساسيات Python", titleSo: "Aasaaska Python", duration: "30 min", isLocked: false, hasQuiz: true, content: "Install Python, variables, data types, print, input.", contentAr: "تثبيت Python والمتغيرات وأنواع البيانات.", contentSo: "Rakibidda Python, doorsoomayaasha, noocyada xogta." },
    { id: "py-2", title: "Control Flow: If/Else & Loops", titleAr: "تدفق التحكم", titleSo: "Xukumida Socodka", duration: "35 min", isLocked: false, hasQuiz: true, content: "if/elif/else, for loops, while loops, break, continue.", contentAr: "if/elif/else وحلقات for وwhile.", contentSo: "if/elif/else, wareegyada for iyo while." },
    { id: "py-3", title: "Functions & Modules", titleAr: "الدوال والوحدات", titleSo: "Functions-ka & Unugyada", duration: "40 min", isLocked: false, hasQuiz: true, content: "Define functions, parameters, return values, import modules.", contentAr: "تعريف الدوال والمعلمات وقيم الإرجاع.", contentSo: "Qeexida functions-ka, cabbirrada, qiyamka lagu soo celiyo." },
    { id: "py-4", title: "Lists, Tuples & Dictionaries", titleAr: "القوائم والأزواج والقواميس", titleSo: "Liisaska, Tuples & Qaamuusyada", duration: "40 min", isLocked: true, hasQuiz: true, content: "Data structures: lists, tuples, sets, dictionaries and their methods.", contentAr: "هياكل البيانات: القوائم والأزواج والمجموعات والقواميس.", contentSo: "Qaab-dhismeedka xogta: liisaska, tuples, qaamuusyada." },
    { id: "py-5", title: "Object-Oriented Programming (OOP)", titleAr: "البرمجة كائنية التوجه", titleSo: "Barnaamijka OOP", duration: "50 min", isLocked: true, hasQuiz: true, content: "Classes, objects, inheritance, encapsulation, polymorphism.", contentAr: "الفئات والكائنات والوراثة والتغليف.", contentSo: "Classes, objects, inheritance, encapsulation." },
    { id: "py-6", title: "File Handling & Exceptions", titleAr: "معالجة الملفات والاستثناءات", titleSo: "Maareynta Faylasha & Khaladaadka", duration: "35 min", isLocked: true, hasQuiz: true, content: "Read/write files, try/except, custom exceptions.", contentAr: "قراءة وكتابة الملفات وأخطاء الاستثناء.", contentSo: "Akhris/qor faylasha, try/except." },
    { id: "py-7", title: "Python for Data Analysis", titleAr: "Python لتحليل البيانات", titleSo: "Python Falanqaynta Xogta", duration: "55 min", isLocked: true, hasQuiz: true, content: "NumPy, Pandas, Matplotlib. Load, clean, visualize datasets.", contentAr: "NumPy وPandas وMatplotlib. تحليل البيانات.", contentSo: "NumPy, Pandas, Matplotlib. Xogtii oo falanqee." },
    { id: "py-8", title: "Web Scraping & Automation", titleAr: "استخراج البيانات من الويب والأتمتة", titleSo: "Web Scraping & Automation", duration: "45 min", isLocked: true, hasQuiz: false, content: "BeautifulSoup, Selenium, requests. Automate repetitive tasks.", contentAr: "BeautifulSoup وSelenium وrequests.", contentSo: "BeautifulSoup, Selenium, requests." },
    { id: "py-9", title: "Flask Web Development", titleAr: "تطوير الويب باستخدام Flask", titleSo: "Horumarinta Web Flask", duration: "60 min", isLocked: true, hasQuiz: true, content: "Build REST APIs, routes, templates, SQLite database.", contentAr: "بناء REST APIs والمسارات والقوالب.", contentSo: "Dhis REST APIs, routes, templates." },
    { id: "py-10", title: "APIs & JSON", titleAr: "APIs وJSON", titleSo: "APIs & JSON", duration: "40 min", isLocked: true, hasQuiz: true, content: "Consuming REST APIs, requests library, JSON parsing, OAuth.", contentAr: "استخدام REST APIs ومكتبة requests.", contentSo: "Isticmaalka REST APIs, JSON." },
    { id: "py-11", title: "Intro to Machine Learning with Python", titleAr: "مقدمة في التعلم الآلي", titleSo: "Hordhaca Machine Learning Python", duration: "55 min", isLocked: true, hasQuiz: true, content: "scikit-learn, regression, classification, model training.", contentAr: "scikit-learn والانحدار والتصنيف وتدريب النماذج.", contentSo: "scikit-learn, regression, classification." },
    { id: "py-12", title: "Capstone Project & Certificate", titleAr: "المشروع النهائي والشهادة", titleSo: "Mashruuca & Shahaadada", duration: "80 min", isLocked: true, hasQuiz: true, content: "Build a complete Python project: web app or data tool. Earn your Python Certificate!", contentAr: "بناء مشروع Python كامل. احصل على شهادتك!", contentSo: "Dhis mashruuc Python oo dhamaystiran. Hel shahaadadaada!" },
  ],
};

const webDevCourse: Course = {
  id: "web-development", slug: "web-development",
  title: "Full-Stack Web Development", titleAr: "تطوير الويب الشامل", titleSo: "Horumarinta Web-ka Dhammaystiran",
  description: "Build real websites from scratch. Master HTML, CSS, JavaScript, React, Node.js, and databases to become a full-stack developer.",
  descriptionAr: "ابنِ مواقع ويب حقيقية. أتقن HTML وCSS وJavaScript وReact وNode.js.", descriptionSo: "Dhis websaydhyo dhab ah eber. Soo xifdiso HTML, CSS, JavaScript, React.",
  language: "multilingual", level: "beginner", price: 45, duration: "16 weeks", lessonCount: 12, enrolledCount: 2876,
  thumbnail: "💻", imageUrl: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=80",
  color: "from-orange-500 to-red-500", gradient: "bg-gradient-to-br from-orange-600/20 to-red-600/20",
  category: "Programming", section: "skills", rating: 4.8, ratingCount: 534, certificate: true,
  instructor: "Eng. Ahmed Coder", featured: true, isNew: true,
  lessons: [
    { id: "web-1", title: "HTML5 Fundamentals", titleAr: "أساسيات HTML5", titleSo: "Aasaaska HTML5", duration: "35 min", isLocked: false, hasQuiz: true, content: "HTML structure, tags, forms, semantic HTML5.", contentAr: "هيكل HTML والعلامات والنماذج.", contentSo: "Qaab-dhismeedka HTML, tags, forms." },
    { id: "web-2", title: "CSS3 & Responsive Design", titleAr: "CSS3 والتصميم المتجاوب", titleSo: "CSS3 & Naqshadeynta Jawaabta", duration: "45 min", isLocked: false, hasQuiz: true, content: "Flexbox, Grid, media queries, animations, Tailwind CSS.", contentAr: "Flexbox وGrid واستعلامات الوسائط.", contentSo: "Flexbox, Grid, media queries, Tailwind." },
    { id: "web-3", title: "JavaScript Essentials", titleAr: "أساسيات JavaScript", titleSo: "Aasaaska JavaScript", duration: "50 min", isLocked: false, hasQuiz: true, content: "Variables, functions, DOM, events, fetch API, ES6+.", contentAr: "المتغيرات والدوال والـDOM والأحداث.", contentSo: "Doorsoomayaasha, functions-ka, DOM, events." },
    { id: "web-4", title: "React.js – Build Modern UIs", titleAr: "React.js – بناء واجهات مستخدم حديثة", titleSo: "React.js – Dhis UI-yada Casriga", duration: "60 min", isLocked: true, hasQuiz: true, content: "Components, state, props, hooks, routing with React.", contentAr: "المكونات والحالة والخصائص والخطافات.", contentSo: "Components, state, props, hooks, routing." },
    { id: "web-5", title: "Node.js & Express Backend", titleAr: "Node.js وExpress للخلفية", titleSo: "Node.js & Express Backend", duration: "55 min", isLocked: true, hasQuiz: true, content: "REST APIs, middleware, authentication, Express routing.", contentAr: "REST APIs والوسيطة والمصادقة.", contentSo: "REST APIs, middleware, xaqiijinta." },
    { id: "web-6", title: "Databases: SQL & MongoDB", titleAr: "قواعد البيانات: SQL وMongoDB", titleSo: "Xogaha: SQL & MongoDB", duration: "50 min", isLocked: true, hasQuiz: true, content: "PostgreSQL, MySQL basics. MongoDB NoSQL. CRUD operations.", contentAr: "PostgreSQL وMySQL وMongoDB. عمليات CRUD.", contentSo: "PostgreSQL, MongoDB. Hawlgallada CRUD." },
    { id: "web-7", title: "Authentication & Security", titleAr: "المصادقة والأمان", titleSo: "Xaqiijinta & Amniga", duration: "45 min", isLocked: true, hasQuiz: true, content: "JWT, session auth, bcrypt, OAuth, HTTPS, XSS, CSRF.", contentAr: "JWT والمصادقة بالجلسة وbcrypt وOAuth.", contentSo: "JWT, session auth, bcrypt, OAuth." },
    { id: "web-8", title: "TypeScript for Web Dev", titleAr: "TypeScript لتطوير الويب", titleSo: "TypeScript Web Dev", duration: "45 min", isLocked: true, hasQuiz: true, content: "Types, interfaces, generics. Why TypeScript beats JavaScript.", contentAr: "الأنواع والواجهات والتعميمات.", contentSo: "Types, interfaces, generics." },
    { id: "web-9", title: "Deployment & DevOps", titleAr: "النشر وDevOps", titleSo: "Deployment & DevOps", duration: "40 min", isLocked: true, hasQuiz: false, content: "Vercel, Railway, AWS basics. CI/CD pipelines, Docker intro.", contentAr: "Vercel وRailway وأساسيات AWS.", contentSo: "Vercel, Railway, AWS. CI/CD." },
    { id: "web-10", title: "Next.js Full-Stack Framework", titleAr: "إطار Next.js الشامل", titleSo: "Next.js Framework", duration: "60 min", isLocked: true, hasQuiz: true, content: "SSR, SSG, API routes, server actions, app router.", contentAr: "SSR وSSG ومسارات API وإجراءات الخادم.", contentSo: "SSR, SSG, API routes, server actions." },
    { id: "web-11", title: "Portfolio Website Project", titleAr: "مشروع موقع المحفظة", titleSo: "Mashruuca Portfolio", duration: "60 min", isLocked: true, hasQuiz: false, content: "Build your personal developer portfolio website from scratch.", contentAr: "بناء موقع محفظة المطور الشخصية من الصفر.", contentSo: "Dhis websaydhka portfolio-gaaga." },
    { id: "web-12", title: "Capstone: Full-Stack App & Certificate", titleAr: "مشروع التخرج وشهادة الويب", titleSo: "Mashruuca & Shahaadada", duration: "90 min", isLocked: true, hasQuiz: true, content: "Build and deploy a full-stack application. Earn your Web Dev Certificate!", contentAr: "بناء ونشر تطبيق ويب كامل. احصل على شهادتك!", contentSo: "Dhis oo soo daadi app dhamaystiran. Hel shahaadadaada!" },
  ],
};

const digitalMarketingCourse: Course = {
  id: "digital-marketing", slug: "digital-marketing",
  title: "Digital Marketing & Social Media", titleAr: "التسويق الرقمي ووسائل التواصل الاجتماعي", titleSo: "Suuqgeynta Dhijitaalka & Baraha Bulshada",
  description: "Master digital marketing: SEO, social media, email marketing, paid ads, content creation, and analytics. Grow any business online.",
  descriptionAr: "أتقن التسويق الرقمي: SEO والسوشيال ميديا والتسويق عبر البريد الإلكتروني.", descriptionSo: "Soo xifdiso suuqgeynta dhijitaalka: SEO, baraha bulshada, ads-ka lacag leh.",
  language: "multilingual", level: "beginner", price: 30, duration: "8 weeks", lessonCount: 10, enrolledCount: 2198,
  thumbnail: "📈", imageUrl: "https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=800&q=80",
  color: "from-pink-500 to-purple-500", gradient: "bg-gradient-to-br from-pink-600/20 to-purple-600/20",
  category: "Business", section: "skills", rating: 4.7, ratingCount: 387, certificate: true,
  instructor: "Hodan Marketing", isNew: true,
  lessons: [
    { id: "dm-1", title: "Digital Marketing Overview", titleAr: "نظرة عامة على التسويق الرقمي", titleSo: "Hordhaca Suuqgeynta Dhijitaalka", duration: "25 min", isLocked: false, hasQuiz: true, content: "Digital vs traditional marketing. Marketing funnel. Key channels.", contentAr: "التسويق الرقمي مقابل التقليدي. قمع التسويق.", contentSo: "Suuqgeynta dhijitaalka vs. dhaqameed." },
    { id: "dm-2", title: "SEO – Search Engine Optimization", titleAr: "تحسين محركات البحث SEO", titleSo: "SEO Hagaajinta Raadinta", duration: "40 min", isLocked: false, hasQuiz: true, content: "Keywords, on-page SEO, backlinks, technical SEO, Google ranking.", contentAr: "الكلمات المفتاحية والـSEO على الصفحة.", contentSo: "Erayada muhiimka, SEO bogga, Google ranking." },
    { id: "dm-3", title: "Social Media Marketing", titleAr: "التسويق عبر وسائل التواصل الاجتماعي", titleSo: "Suuqgeynta Baraha Bulshada", duration: "40 min", isLocked: false, hasQuiz: true, content: "Instagram, TikTok, LinkedIn, Twitter/X strategies. Content calendars.", contentAr: "استراتيجيات Instagram وTikTok وLinkedIn.", contentSo: "Instagram, TikTok, LinkedIn xeelad." },
    { id: "dm-4", title: "Content Marketing", titleAr: "تسويق المحتوى", titleSo: "Suuqgeynta Nuxurka", duration: "35 min", isLocked: true, hasQuiz: true, content: "Blog writing, video content, podcasts, infographics, viral hooks.", contentAr: "الكتابة للمدونات والمحتوى المرئي.", contentSo: "Qorista blogs, muuqaalada, podcast." },
    { id: "dm-5", title: "Email Marketing", titleAr: "التسويق عبر البريد الإلكتروني", titleSo: "Suuqgeynta Emailka", duration: "35 min", isLocked: true, hasQuiz: true, content: "Mailchimp, Klaviyo, automation, segmentation, conversion.", contentAr: "Mailchimp وKlaviyo والأتمتة والتقسيم.", contentSo: "Mailchimp, Klaviyo, automation." },
    { id: "dm-6", title: "Paid Advertising (Meta & Google Ads)", titleAr: "الإعلانات المدفوعة", titleSo: "Xayeysiisyada Lacag leh", duration: "50 min", isLocked: true, hasQuiz: true, content: "Facebook/Instagram Ads, Google Ads, targeting, budget, ROI.", contentAr: "إعلانات Facebook وInstagram وGoogle.", contentSo: "Xayeysiisyada Facebook, Instagram, Google." },
    { id: "dm-7", title: "Analytics & Data-Driven Marketing", titleAr: "التحليلات والتسويق المبني على البيانات", titleSo: "Analytics & Suuqgeynta Xogta", duration: "40 min", isLocked: true, hasQuiz: true, content: "Google Analytics 4, conversion tracking, A/B testing.", contentAr: "Google Analytics 4 وتتبع التحويل.", contentSo: "Google Analytics 4, raadraaca rogoshooyinka." },
    { id: "dm-8", title: "Influencer & Affiliate Marketing", titleAr: "التسويق بالمؤثرين والعمولة", titleSo: "Suuqgeynta Saamaynta & Mushaarada", duration: "35 min", isLocked: true, hasQuiz: false, content: "Finding influencers, affiliate programs, partnerships.", contentAr: "إيجاد المؤثرين وبرامج الانتساب.", contentSo: "Helitaanka saamaynta, barnaamijyada affiliate." },
    { id: "dm-9", title: "Brand Building & Growth Hacking", titleAr: "بناء العلامة التجارية", titleSo: "Dhisidda Calaamadda & Korsiinta", duration: "40 min", isLocked: true, hasQuiz: false, content: "Product-led growth, virality, referrals, community building.", contentAr: "النمو القائم على المنتج والفيروسية.", contentSo: "Kobocda alaabta, faafinta, ururada." },
    { id: "dm-10", title: "Digital Marketing Campaign & Certificate", titleAr: "الحملة التسويقية والشهادة", titleSo: "Olole Suuqgeynta & Shahaadada", duration: "60 min", isLocked: true, hasQuiz: true, content: "Plan and present a full digital marketing campaign. Earn your certificate!", contentAr: "خطط وقدم حملة تسويقية رقمية كاملة.", contentSo: "Qorshee oo pashado olole suuqgeynta. Hel shahaadadaada!" },
  ],
};

const businessCourse: Course = {
  id: "digital-business", slug: "digital-business",
  title: "Digital Business & Entrepreneurship", titleAr: "الأعمال الرقمية وريادة الأعمال", titleSo: "Ganacsiga Dhijitaalka & Rishada Ganacsiga",
  description: "Launch and grow a profitable online business. Learn branding, marketing, e-commerce, freelancing, and passive income strategies.",
  descriptionAr: "أطلق وطوّر عملاً تجارياً مربحاً عبر الإنترنت.", descriptionSo: "Bilow oo koboci ganacsi online ah oo faa'iido leh.",
  language: "multilingual", level: "beginner", price: 39, duration: "10 weeks", lessonCount: 12, enrolledCount: 2567,
  thumbnail: "💼", imageUrl: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80",
  color: "from-emerald-500 to-teal-600", gradient: "bg-gradient-to-br from-emerald-600/20 to-teal-500/20",
  category: "Business", section: "skills", rating: 4.7, ratingCount: 445, certificate: true,
  instructor: "Faadumo Business", popular: true,
  lessons: [
    { id: "biz-1", title: "The Digital Business Mindset", titleAr: "عقلية الأعمال الرقمية", titleSo: "Maskaxda Ganacsiga Dhijitaalka", duration: "25 min", isLocked: false, hasQuiz: true, content: "What is a digital business? Success stories: Airbnb, Uber, Amazon.", contentAr: "ما هو العمل الرقمي؟ قصص النجاح.", contentSo: "Ganacsiga dhijitaalka waa maxay? Sheekadaha guusha." },
    { id: "biz-2", title: "Finding Your Niche & Idea", titleAr: "إيجاد تخصصك وفكرة العمل", titleSo: "Helitaanka Goobtaada & Fikradda", duration: "30 min", isLocked: false, hasQuiz: true, content: "Niche research, validating business ideas, market research tools.", contentAr: "بحث المجالات المتخصصة والتحقق من الأفكار.", contentSo: "Baadista goosha, xaqiijinta fikradda." },
    { id: "biz-3", title: "Building Your Brand Identity", titleAr: "بناء هوية علامتك التجارية", titleSo: "Dhisidda Aqoonsiga Calaamadaada", duration: "35 min", isLocked: false, hasQuiz: true, content: "Logo, brand colors, typography, brand story, Canva.", contentAr: "الشعار والألوان والخطوط وقصة العلامة.", contentSo: "Sumadda, midabada, xarfaha, sheekada calaamadda." },
    { id: "biz-4", title: "Digital Marketing Fundamentals", titleAr: "أساسيات التسويق الرقمي", titleSo: "Aasaaska Suuqgeynta Dhijitaalka", duration: "40 min", isLocked: true, hasQuiz: true, content: "SEO, social media, email marketing, paid ads, funnel.", contentAr: "SEO والتسويق عبر وسائل التواصل.", contentSo: "SEO, baraha bulshada, email, ads." },
    { id: "biz-5", title: "Social Media Strategy", titleAr: "استراتيجية وسائل التواصل", titleSo: "Xeelad Baraha Bulshada", duration: "40 min", isLocked: true, hasQuiz: true, content: "Instagram, TikTok, YouTube content strategy. Going viral.", contentAr: "استراتيجية المحتوى على انستغرام وتيك توك ويوتيوب.", contentSo: "Xeelada nuxurka Instagram, TikTok, YouTube." },
    { id: "biz-6", title: "E-Commerce: Sell Online", titleAr: "التجارة الإلكترونية", titleSo: "E-Commerce Iibso Online", duration: "45 min", isLocked: true, hasQuiz: true, content: "Shopify, WooCommerce, dropshipping, payment gateways.", contentAr: "Shopify وWooCommerce والشحن المباشر.", contentSo: "Shopify, WooCommerce, dropshipping." },
    { id: "biz-7", title: "Freelancing & Service Business", titleAr: "العمل الحر وأعمال الخدمات", titleSo: "Freelancing & Ganacsiga Adeegga", duration: "40 min", isLocked: true, hasQuiz: false, content: "Upwork, Fiverr, proposals, pricing, client management.", contentAr: "Upwork وFiverr وكتابة المقترحات.", contentSo: "Upwork, Fiverr, talooyinka, macaamiilka." },
    { id: "biz-8", title: "Digital Products & Passive Income", titleAr: "المنتجات الرقمية والدخل السلبي", titleSo: "Alaabta Dhijitaalka & Dakhli Taxane", duration: "40 min", isLocked: true, hasQuiz: true, content: "eBooks, courses, templates. Gumroad, Lemon Squeezy.", contentAr: "الكتب الإلكترونية والدورات والقوالب.", contentSo: "eBooks, koorsooyinka, qaababka." },
    { id: "biz-9", title: "Business Finance & Cash Flow", titleAr: "تمويل الأعمال والتدفق النقدي", titleSo: "Maaliyadda Ganacsiga", duration: "35 min", isLocked: true, hasQuiz: true, content: "Revenue, expenses, profit, invoicing, tax basics.", contentAr: "الإيرادات والمصروفات والفواتير والضرائب.", contentSo: "Gelitaanka, kharashka, faa'iidada." },
    { id: "biz-10", title: "Scaling Your Business", titleAr: "توسيع نطاق أعمالك", titleSo: "Ballaariinta Ganacsigaaga", duration: "40 min", isLocked: true, hasQuiz: true, content: "From $0 to $10K/month. Hiring, outsourcing, automation.", contentAr: "من 0 إلى 10 آلاف دولار شهرياً.", contentSo: "Ka $0 ilaa $10K/bil." },
    { id: "biz-11", title: "AI Tools for Business", titleAr: "أدوات الذكاء الاصطناعي للأعمال", titleSo: "Qaababka AI ee Ganacsiga", duration: "35 min", isLocked: true, hasQuiz: false, content: "ChatGPT, Midjourney, Jasper for business automation.", contentAr: "ChatGPT وMidjourney وJasper.", contentSo: "ChatGPT, Midjourney, Jasper ganacsiga." },
    { id: "biz-12", title: "Business Plan & Launch & Certificate", titleAr: "خطة العمل والإطلاق والشهادة", titleSo: "Qorshaha & Bilowga & Shahaadada", duration: "80 min", isLocked: true, hasQuiz: true, content: "Full business plan, online presence, launch. Earn your Business Certificate!", contentAr: "خطة عمل كاملة. الإطلاق. احصل على شهادتك!", contentSo: "Qorshe ganacsi dhamaystiran. Hel shahaadadaada!" },
  ],
};

const designCourse: Course = {
  id: "graphic-design", slug: "graphic-design",
  title: "Graphic Design & Visual Branding", titleAr: "التصميم الجرافيكي والعلامة التجارية", titleSo: "Naqshadeynta Sawirka & Calaamadaynta",
  description: "Learn professional graphic design from scratch. Master Canva, Figma, and Adobe tools. Build a design portfolio and start your design career.",
  descriptionAr: "تعلم التصميم الجرافيكي الاحترافي من الصفر. أتقن Canva وFigma.", descriptionSo: "Baro naqshadeynta sawirka xirfadlaha ah eber. Soo xifdiso Canva, Figma.",
  language: "multilingual", level: "beginner", price: 35, duration: "8 weeks", lessonCount: 10, enrolledCount: 1834,
  thumbnail: "🎨", imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80",
  color: "from-pink-500 to-rose-600", gradient: "bg-gradient-to-br from-pink-600/20 to-rose-500/20",
  category: "Design", section: "skills", rating: 4.8, ratingCount: 312, certificate: true,
  instructor: "Leyla Design Studio", isNew: true,
  lessons: [
    { id: "des-1", title: "Design Principles & Elements", titleAr: "مبادئ وعناصر التصميم", titleSo: "Mabaadi'da & Curiyeyaasha Naqshadeynta", duration: "30 min", isLocked: false, hasQuiz: true, content: "Color theory, typography, balance, contrast, hierarchy, whitespace.", contentAr: "نظرية الألوان والطباعة والتوازن والتباين.", contentSo: "Nidaamka midabada, aasaaska daabacaadda." },
    { id: "des-2", title: "Canva Mastery", titleAr: "إتقان Canva", titleSo: "Canva Soo Xifdiso", duration: "40 min", isLocked: false, hasQuiz: true, content: "Canva interface, templates, brand kit, social media, presentations.", contentAr: "واجهة Canva والقوالب ومجموعة العلامة.", contentSo: "Xaashida Canva, qaababka, xusuusiyaha calaamadda." },
    { id: "des-3", title: "Figma for UI/UX Design", titleAr: "Figma لتصميم UI/UX", titleSo: "Figma UI/UX", duration: "50 min", isLocked: false, hasQuiz: true, content: "Figma workspace, components, auto-layout, prototyping.", contentAr: "مساحة عمل Figma والمكونات والنماذج الأولية.", contentSo: "Goobta Figma, qaybyada, naqshadeynta." },
    { id: "des-4", title: "Logo Design Process", titleAr: "عملية تصميم الشعار", titleSo: "Habka Naqshadeynta Sumadda", duration: "45 min", isLocked: true, hasQuiz: true, content: "Logo types, design process: brief, research, sketch, digital.", contentAr: "أنواع الشعار وعملية التصميم.", contentSo: "Noocyada sumadda, habka naqshadeynta." },
    { id: "des-5", title: "Brand Identity Systems", titleAr: "أنظمة هوية العلامة التجارية", titleSo: "Nidaamyada Aqoonsiga Calaamadda", duration: "45 min", isLocked: true, hasQuiz: true, content: "Brand guidelines, color palettes, typography, imagery.", contentAr: "دليل العلامة التجارية ولوحات الألوان.", contentSo: "Tafaasirta calaamadda, paaletada midabada." },
    { id: "des-6", title: "Social Media Design", titleAr: "تصميم وسائل التواصل الاجتماعي", titleSo: "Naqshadeynta Baraha Bulshada", duration: "40 min", isLocked: true, hasQuiz: false, content: "Instagram, TikTok, YouTube thumbnails, stories, reels.", contentAr: "منشورات وقصص Instagram وTikTok.", contentSo: "Qoraallada Instagram, sheekooyin, reels." },
    { id: "des-7", title: "Marketing Materials", titleAr: "المواد التسويقية", titleSo: "Agabyada Suuqgeynta", duration: "40 min", isLocked: true, hasQuiz: false, content: "Flyers, posters, brochures, business cards, print files.", contentAr: "النشرات والملصقات والكتيبات.", contentSo: "Leefleedyada, baastooladaha, buugaagta yaryar." },
    { id: "des-8", title: "Illustration & Icons", titleAr: "الرسم التوضيحي والأيقونات", titleSo: "Sawirada & Astaamaha", duration: "45 min", isLocked: true, hasQuiz: false, content: "Vector illustration, custom icons, flat design, line art.", contentAr: "رسم المتجهات والأيقونات المخصصة.", contentSo: "Sawirada vector, astaamaha gaarka." },
    { id: "des-9", title: "Portfolio & Getting Clients", titleAr: "المحفظة والحصول على عملاء", titleSo: "Portfolio & Helitaanka Macaamiilka", duration: "40 min", isLocked: true, hasQuiz: false, content: "Behance, Dribbble, portfolio website, getting your first design client.", contentAr: "Behance وDribbble وموقع المحفظة.", contentSo: "Behance, Dribbble, websaydhka portfolio." },
    { id: "des-10", title: "Capstone Design Project & Certificate", titleAr: "مشروع التصميم التخرجي والشهادة", titleSo: "Mashruuca & Shahaadada", duration: "80 min", isLocked: true, hasQuiz: true, content: "Full brand identity project: logo, colors, kit. Earn your Design Certificate!", contentAr: "مشروع هوية علامة تجارية كاملة. شهادة التصميم!", contentSo: "Mashruuca aqoonsiga calaamadda. Hel shahaadadaada!" },
  ],
};

const freelancingCourse: Course = {
  id: "freelancing-mastery", slug: "freelancing-mastery",
  title: "Freelancing Mastery: Earn Online", titleAr: "إتقان العمل الحر: اكسب عبر الإنترنت", titleSo: "Freelancing Soo Xifdiso: Online Kasub",
  description: "Start earning money online as a freelancer. Set up your profile, win clients, deliver great work, and scale to $3,000+/month income.",
  descriptionAr: "ابدأ كسب المال عبر الإنترنت كمستقل. أعد ملفك الشخصي واكسب العملاء.", descriptionSo: "Bilow lacag kasub online freelancer ahaan.",
  language: "multilingual", level: "beginner", price: 29, duration: "6 weeks", lessonCount: 10, enrolledCount: 2891,
  thumbnail: "💻", imageUrl: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80",
  color: "from-blue-500 to-indigo-600", gradient: "bg-gradient-to-br from-blue-600/20 to-indigo-500/20",
  category: "Freelancing", section: "skills", rating: 4.8, ratingCount: 534, certificate: true,
  instructor: "Omar Freelance Pro", featured: true, isNew: true,
  lessons: [
    { id: "fl-1", title: "The Freelancing Opportunity", titleAr: "فرصة العمل الحر", titleSo: "Fursadda Freelancing", duration: "20 min", isLocked: false, hasQuiz: true, content: "What is freelancing? Top skills in demand. Platforms overview.", contentAr: "ما هو العمل الحر؟ أكثر المهارات طلباً.", contentSo: "Freelancing waa maxay? Xirfadaha ugu baahan tahay." },
    { id: "fl-2", title: "Choosing Your Freelance Skill", titleAr: "اختيار مهارتك", titleSo: "Doorashada Xirfadaada", duration: "25 min", isLocked: false, hasQuiz: true, content: "High-demand: writing, design, programming, video, social media.", contentAr: "المهارات الأكثر طلباً: الكتابة والتصميم والبرمجة.", contentSo: "Xirfadaha ugu baahan: qorista, naqshadeynta, barnaamijka." },
    { id: "fl-3", title: "Setting Up Your Profiles", titleAr: "إعداد ملفاتك الشخصية", titleSo: "Dejinta Profile-yaadaaga", duration: "35 min", isLocked: false, hasQuiz: true, content: "Upwork, Fiverr, LinkedIn optimization. Portfolio setup.", contentAr: "تحسين ملف Upwork وFiverr وLinkedIn.", contentSo: "Hagaajinta Upwork, Fiverr, LinkedIn." },
    { id: "fl-4", title: "Writing Winning Proposals", titleAr: "كتابة مقترحات رابحة", titleSo: "Qorista Talooyinka Guusha", duration: "40 min", isLocked: true, hasQuiz: true, content: "Proposal structure, personalizing, cover letter tips.", contentAr: "هيكل المقترح وتخصيصه.", contentSo: "Qaab-dhismeedka talooyinka, gaarka." },
    { id: "fl-5", title: "Pricing Your Services", titleAr: "تسعير خدماتك", titleSo: "Qiimeynta Adeegyaadaaga", duration: "30 min", isLocked: true, hasQuiz: true, content: "Hourly vs project-based, value pricing, negotiation.", contentAr: "التسعير بالساعة مقابل المشروع.", contentSo: "Qiimaha saacad vs mashruuca." },
    { id: "fl-6", title: "Client Communication", titleAr: "التواصل مع العملاء", titleSo: "Xiriirka Macaamiilka", duration: "35 min", isLocked: true, hasQuiz: true, content: "Professional communication, contracts, revisions, reviews.", contentAr: "التواصل المهني والعقود والمراجعات.", contentSo: "Xiriirka xirfadlaha, heshiisyada, marka aad dib u eegaysid." },
    { id: "fl-7", title: "Delivering 5-Star Work", titleAr: "تقديم عمل بخمس نجوم", titleSo: "Bixinta Shaqo 5-Xiddig", duration: "30 min", isLocked: true, hasQuiz: false, content: "Quality, deadlines, underpromise-overdeliver, testimonials.", contentAr: "الجودة والمواعيد النهائية.", contentSo: "Tayada, dhafoorka, sinaanta." },
    { id: "fl-8", title: "Scaling to $3,000+/month", titleAr: "التوسع إلى 3,000$/شهر", titleSo: "Ballaarinta ilaa $3,000+/bil", duration: "40 min", isLocked: true, hasQuiz: false, content: "From hourly to packages, retainers, outsourcing.", contentAr: "من الساعة إلى الحزم والرسوم الثابتة.", contentSo: "Ka saacadda ilaa xidhmada, mushaarada." },
    { id: "fl-9", title: "Money Management for Freelancers", titleAr: "إدارة المال للمستقلين", titleSo: "Maareynta Lacagta Freelancers-ka", duration: "30 min", isLocked: true, hasQuiz: true, content: "PayPal, Payoneer, Wise, invoicing, taxes.", contentAr: "PayPal وPayoneer وWise والفواتير.", contentSo: "PayPal, Payoneer, Wise, faatuuraynta." },
    { id: "fl-10", title: "Long-term Success & Certificate", titleAr: "النجاح طويل الأمد والشهادة", titleSo: "Guusha Muddooyinka Dheer & Shahaadada", duration: "60 min", isLocked: true, hasQuiz: true, content: "Personal brand, passive income, avoiding burnout. Earn your Freelancing Certificate!", contentAr: "العلامة الشخصية والدخل السلبي. شهادة العمل الحر!", contentSo: "Calaamadda shakhsiga, dakhliga taxannaha. Hel shahaadadaada!" },
  ],
};

const selfDevCourse: Course = {
  id: "self-development", slug: "self-development",
  title: "Self-Development & Leadership", titleAr: "التطوير الذاتي والقيادة", titleSo: "Is-Horumarinta & Hogaaminta",
  description: "Transform your mindset, build powerful habits, master productivity, develop leadership skills, and achieve your biggest life goals.",
  descriptionAr: "غيّر طريقة تفكيرك وابنِ عادات قوية وأتقن الإنتاجية.", descriptionSo: "Bedel maskaxdaada, dhis caadooyin xoog leh, soo xifdiso waxqabadka.",
  language: "multilingual", level: "beginner", price: 25, duration: "8 weeks", lessonCount: 12, enrolledCount: 3102,
  thumbnail: "🚀", imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80",
  color: "from-orange-500 to-amber-600", gradient: "bg-gradient-to-br from-orange-600/20 to-amber-500/20",
  category: "Self-Development", section: "skills", rating: 4.9, ratingCount: 567, certificate: true,
  instructor: "Coach Nasra", popular: true,
  lessons: [
    { id: "sd-1", title: "The Growth Mindset", titleAr: "عقلية النمو", titleSo: "Maskaxda Kobocda", duration: "25 min", isLocked: false, hasQuiz: true, content: "Fixed vs Growth Mindset. Practical exercises to shift thinking.", contentAr: "العقلية الثابتة مقابل عقلية النمو.", contentSo: "Maskaxda Xidhan vs Kobocda." },
    { id: "sd-2", title: "Goal Setting That Works", titleAr: "تحديد الأهداف الفعّال", titleSo: "Dejinta Yoolka u Shaqeeya", duration: "30 min", isLocked: false, hasQuiz: true, content: "SMART goals, OKRs, 12-Week Year, vision boards.", contentAr: "الأهداف الذكية وOKRs و12 أسبوعاً.", contentSo: "Yoolasha SMART, OKRs, 12-Toddobaad." },
    { id: "sd-3", title: "Building Powerful Habits", titleAr: "بناء عادات قوية", titleSo: "Dhisidda Caadooyin Xoog leh", duration: "35 min", isLocked: false, hasQuiz: true, content: "Atomic Habits, habit loop, habit stacking, tracking.", contentAr: "العادات الذرية وحلقة العادة والتتبع.", contentSo: "Caadooyinka Atomiga, wareega caadada." },
    { id: "sd-4", title: "Time Management & Productivity", titleAr: "إدارة الوقت والإنتاجية", titleSo: "Maareynta Waqtiga & Waxqabadka", duration: "35 min", isLocked: true, hasQuiz: true, content: "Pomodoro, time blocking, deep work, eliminating distractions.", contentAr: "تقنية البومودورو وتحديد الوقت والعمل العميق.", contentSo: "Pomodoro, gooynta waqtiga, shaqada qoto-dheer." },
    { id: "sd-5", title: "Emotional Intelligence (EQ)", titleAr: "الذكاء العاطفي", titleSo: "Xisaabtanka Xisiga (EQ)", duration: "30 min", isLocked: true, hasQuiz: true, content: "Self-awareness, empathy, social skills, emotional triggers.", contentAr: "الوعي الذاتي والتعاطف والمهارات الاجتماعية.", contentSo: "Xisabsiinta nafta, naxariista, xirfadaha bulshada." },
    { id: "sd-6", title: "Public Speaking & Confidence", titleAr: "الخطابة العامة والثقة", titleSo: "Hadlidda Dadweynaha & Is-Kalsooniida", duration: "40 min", isLocked: true, hasQuiz: false, content: "Overcoming fear, body language, storytelling, TED structure.", contentAr: "التغلب على الخوف ولغة الجسد والسرد القصصي.", contentSo: "Ka xukumida cabsida, luuqadda jirka." },
    { id: "sd-7", title: "Financial Intelligence", titleAr: "الذكاء المالي", titleSo: "Xisaabtanka Maaliyadda", duration: "35 min", isLocked: true, hasQuiz: true, content: "Budgeting, saving, investing basics, multiple income streams.", contentAr: "الميزانية والادخار وأساسيات الاستثمار.", contentSo: "Miisaaniyada, badbaadinta, maalgashiga." },
    { id: "sd-8", title: "Leadership & Influence", titleAr: "القيادة والتأثير", titleSo: "Hogaaminta & Saamaynta", duration: "40 min", isLocked: true, hasQuiz: true, content: "Leadership styles, influence without authority, mentoring.", contentAr: "أساليب القيادة والتأثير بدون سلطة.", contentSo: "Qaababka hogaaminta, saamaynta." },
    { id: "sd-9", title: "Health, Energy & Performance", titleAr: "الصحة والطاقة والأداء", titleSo: "Caafimaadka, Tamarida & Waxqabadka", duration: "35 min", isLocked: true, hasQuiz: false, content: "Sleep, exercise, nutrition, morning routines, stress management.", contentAr: "النوم والتمارين والتغذية والروتين الصباحي.", contentSo: "Hurda, jimicsiga, nafaqada, habka subaxda." },
    { id: "sd-10", title: "Networking & Relationships", titleAr: "التواصل والعلاقات", titleSo: "Shabakadaynta & Xiriirrada", duration: "30 min", isLocked: true, hasQuiz: false, content: "Building connections, LinkedIn strategy, mentors, masterminds.", contentAr: "بناء الاتصالات واستراتيجية LinkedIn.", contentSo: "Dhisidda xiriirrada, xeelada LinkedIn." },
    { id: "sd-11", title: "Overcoming Failure & Resilience", titleAr: "التغلب على الفشل والمرونة", titleSo: "Ka Xukumida Guul-darrida & Adkaysiga", duration: "30 min", isLocked: true, hasQuiz: false, content: "Reframing failure, resilience building, stoicism, lessons from setbacks.", contentAr: "إعادة صياغة الفشل وبناء المرونة.", contentSo: "Dib-u-qaabeynta guul-darrida, adkaysiga." },
    { id: "sd-12", title: "Life Vision & Certificate", titleAr: "رؤية الحياة والشهادة", titleSo: "Aragti Nolosha & Shahaadada", duration: "60 min", isLocked: true, hasQuiz: true, content: "Create your personal vision, 5-year plan, legacy. Earn your Self-Development Certificate!", contentAr: "إنشاء رؤيتك الشخصية وخطة 5 سنوات. الشهادة!", contentSo: "Abuur aragtidaada, qorshaha 5 sanadood. Hel shahaadadaada!" },
  ],
};

const dataScienceCourse: Course = {
  id: "data-science", slug: "data-science",
  title: "Data Science & Analytics", titleAr: "علم البيانات والتحليلات", titleSo: "Sayniska Xogta & Falanqaynta",
  description: "Learn to analyze, visualize, and draw insights from data using Python, SQL, and BI tools. Launch your data science career.",
  descriptionAr: "تعلم تحليل البيانات وتصويرها واستخلاص الرؤى باستخدام Python وSQL.", descriptionSo: "Baro falanqaynta, muujinta, iyo ka soo saarka xogta adoo Python, SQL isticmaalaya.",
  language: "multilingual", level: "intermediate", price: 45, duration: "12 weeks", lessonCount: 10, enrolledCount: 1654,
  thumbnail: "📊", imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
  color: "from-cyan-500 to-blue-600", gradient: "bg-gradient-to-br from-cyan-600/20 to-blue-700/20",
  category: "AI & Technology", section: "skills", rating: 4.8, ratingCount: 298, certificate: true,
  instructor: "Dr. Yusuf Data", isNew: true,
  lessons: [
    { id: "ds-1", title: "Introduction to Data Science", titleAr: "مقدمة في علم البيانات", titleSo: "Hordhaca Sayniska Xogta", duration: "30 min", isLocked: false, hasQuiz: true, content: "What is data science? Workflow: collect, clean, analyze, visualize, model.", contentAr: "ما هو علم البيانات؟ سير العمل.", contentSo: "Sayniska xogta waa maxay? Hababka shaqada." },
    { id: "ds-2", title: "Python for Data Science", titleAr: "Python لعلم البيانات", titleSo: "Python Sayniska Xogta", duration: "45 min", isLocked: false, hasQuiz: true, content: "NumPy arrays, Pandas DataFrames, data manipulation.", contentAr: "مصفوفات NumPy وإطارات بيانات Pandas.", contentSo: "NumPy arrays, Pandas DataFrames." },
    { id: "ds-3", title: "Data Cleaning & Preprocessing", titleAr: "تنظيف البيانات والمعالجة المسبقة", titleSo: "Nadiifinta & Diyaarinta Xogta", duration: "40 min", isLocked: false, hasQuiz: true, content: "Handling missing values, outliers, feature engineering.", contentAr: "التعامل مع القيم المفقودة والشاذة.", contentSo: "Maareynta qiyamka la waayay, outliers." },
    { id: "ds-4", title: "Data Visualization", titleAr: "تصور البيانات", titleSo: "Muujinta Xogta", duration: "40 min", isLocked: true, hasQuiz: true, content: "Matplotlib, Seaborn, Plotly. Charts, heatmaps, dashboards.", contentAr: "Matplotlib وSeaborn وPlotly.", contentSo: "Matplotlib, Seaborn, Plotly." },
    { id: "ds-5", title: "SQL for Data Analysis", titleAr: "SQL لتحليل البيانات", titleSo: "SQL Falanqaynta Xogta", duration: "45 min", isLocked: true, hasQuiz: true, content: "SELECT, JOIN, GROUP BY, aggregate functions, subqueries.", contentAr: "SELECT وJOIN وGROUP BY والدوال التجميعية.", contentSo: "SELECT, JOIN, GROUP BY, functions-ka." },
    { id: "ds-6", title: "Machine Learning with Sklearn", titleAr: "التعلم الآلي مع Sklearn", titleSo: "Machine Learning Sklearn", duration: "55 min", isLocked: true, hasQuiz: true, content: "Regression, classification, clustering. Model evaluation.", contentAr: "الانحدار والتصنيف والتجميع.", contentSo: "Regression, classification, clustering." },
    { id: "ds-7", title: "Statistics for Data Science", titleAr: "الإحصاء لعلم البيانات", titleSo: "Statistics Sayniska Xogta", duration: "45 min", isLocked: true, hasQuiz: true, content: "Descriptive stats, hypothesis testing, probability distributions.", contentAr: "الإحصاء الوصفي واختبار الفرضيات.", contentSo: "Xisaabaadka faahfaahsan, tijaabinta faradhiga." },
    { id: "ds-8", title: "Business Intelligence & Dashboards", titleAr: "ذكاء الأعمال والأنظمة التحليلية", titleSo: "BI & Dashboards", duration: "40 min", isLocked: true, hasQuiz: false, content: "Power BI, Tableau, Looker. Build executive dashboards.", contentAr: "Power BI وTableau وLooker.", contentSo: "Power BI, Tableau, Looker." },
    { id: "ds-9", title: "Deep Learning Introduction", titleAr: "مقدمة في التعلم العميق", titleSo: "Hordhaca Deep Learning", duration: "50 min", isLocked: true, hasQuiz: true, content: "Neural networks, TensorFlow/Keras, CNNs for image classification.", contentAr: "الشبكات العصبية وTensorFlow/Keras.", contentSo: "Shabakadaha neerfaha, TensorFlow, CNNs." },
    { id: "ds-10", title: "Capstone Data Project & Certificate", titleAr: "مشروع البيانات والشهادة", titleSo: "Mashruuca Xogta & Shahaadada", duration: "80 min", isLocked: true, hasQuiz: true, content: "End-to-end data science project. Present findings. Earn your Data Science Certificate!", contentAr: "مشروع علم بيانات كامل. احصل على شهادتك!", contentSo: "Mashruuc sayniska xogta. Hel shahaadadaada!" },
  ],
};

/* ──────────────── NEW SCHOOL SUBJECTS ──────────────── */

const physicsSecondary: Course = {
  id: "physics-secondary", slug: "physics-secondary",
  title: "Physics – Secondary School", titleAr: "الفيزياء – المرحلة الثانوية", titleSo: "Physics – Dugsiga Sare",
  description: "Master kinematics, dynamics, electricity, magnetism, waves, and modern physics for secondary school exams.",
  descriptionAr: "أتقن الحركة والديناميكا والكهرباء والمغناطيسية والموجات والفيزياء الحديثة.", descriptionSo: "Soo xifdiso kinematics, dynamics, korontada, birlabta, mowjadaha.",
  language: "multilingual", level: "intermediate", price: 25, duration: "12 weeks", lessonCount: 8, enrolledCount: 1234,
  thumbnail: "⚛️", imageUrl: "https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?w=800&q=80",
  color: "from-purple-600 to-violet-400", gradient: "bg-gradient-to-br from-purple-700/20 to-violet-500/20",
  category: "Physics", section: "curriculum", subSection: "secondary", rating: 4.7, ratingCount: 189,
  certificate: true, instructor: "Dr. Khalid Physics",
  lessons: [
    { id: "ph-1", title: "Kinematics & Motion", titleAr: "الحركة والسرعة", titleSo: "Dhaqdhaqaaqa & Xawaaraha", duration: "40 min", isLocked: false, hasQuiz: true, content: "Distance, speed, velocity, acceleration, equations of motion.", contentAr: "المسافة والسرعة والتسارع.", contentSo: "Masaafada, xawaaraha, dedejinta." },
    { id: "ph-2", title: "Newton's Laws & Forces", titleAr: "قوانين نيوتن والقوى", titleSo: "Sharciyada Newton & Xoogaga", duration: "45 min", isLocked: false, hasQuiz: true, content: "Newton's three laws, friction, tension, normal force.", contentAr: "قوانين نيوتن الثلاثة والقوى.", contentSo: "Saddexda sharci ee Newton, xidhitaan." },
    { id: "ph-3", title: "Energy, Work & Power", titleAr: "الطاقة والشغل والقدرة", titleSo: "Tamarida, Shaqada & Xoogga", duration: "40 min", isLocked: false, hasQuiz: true, content: "KE, PE, conservation of energy, power calculations.", contentAr: "الطاقة الحركية والكامنة وحفظ الطاقة.", contentSo: "KE, PE, ilaalinta tamarida." },
    { id: "ph-4", title: "Waves & Sound", titleAr: "الموجات والصوت", titleSo: "Mowjadaha & Codka", duration: "40 min", isLocked: true, hasQuiz: true, content: "Wave properties, frequency, wavelength, sound waves, Doppler effect.", contentAr: "خصائص الموجات والتردد والطول الموجي.", contentSo: "Sifooyinka mowjadaha, jirta mowjadda." },
    { id: "ph-5", title: "Electricity & Circuits", titleAr: "الكهرباء والدوائر", titleSo: "Koronto & Wareegyada", duration: "45 min", isLocked: true, hasQuiz: true, content: "Ohm's law, series/parallel circuits, power, resistance.", contentAr: "قانون أوم والدوائر المتسلسلة والمتوازية.", contentSo: "Sharciga Ohm, wareegyada taxanaha." },
    { id: "ph-6", title: "Magnetism & Electromagnetism", titleAr: "المغناطيسية والكهرومغناطيسية", titleSo: "Birlabta & Koronto-Birlabta", duration: "40 min", isLocked: true, hasQuiz: true, content: "Magnetic fields, electromagnets, Faraday's law, transformers.", contentAr: "المجالات المغناطيسية والكهرومغناطيسية.", contentSo: "Goobaha birlabeed, koritaanka Faraday." },
    { id: "ph-7", title: "Optics & Light", titleAr: "البصريات والضوء", titleSo: "Aragga & Nuurka", duration: "35 min", isLocked: true, hasQuiz: true, content: "Reflection, refraction, lenses, mirrors, spectrum.", contentAr: "الانعكاس والانكسار والعدسات والمرايا.", contentSo: "Dib-u-celin, jajab, muraayadaha." },
    { id: "ph-8", title: "Modern Physics & Certificate", titleAr: "الفيزياء الحديثة والشهادة", titleSo: "Physics Casriga & Shahaadada", duration: "60 min", isLocked: true, hasQuiz: true, content: "Atomic structure, nuclear physics, radioactivity. Final exam. Certificate!", contentAr: "التركيب الذري والفيزياء النووية. الاختبار النهائي.", contentSo: "Qaab-dhismeedka atomiga, radiyo-fallaadha. Shahaadada!" },
  ],
};

const chemistrySecondary: Course = {
  id: "chemistry-secondary", slug: "chemistry-secondary",
  title: "Chemistry – Secondary School", titleAr: "الكيمياء – المرحلة الثانوية", titleSo: "Kiimikada – Dugsiga Sare",
  description: "Explore atomic structure, bonding, reactions, acids & bases, organic chemistry, and stoichiometry for secondary exams.",
  descriptionAr: "استكشف التركيب الذري والربط والتفاعلات والأحماض والقواعد والكيمياء العضوية.", descriptionSo: "Sahmi qaab-dhismeedka atomiga, falcelinta, kiimikada dabiiciga ah.",
  language: "multilingual", level: "intermediate", price: 25, duration: "12 weeks", lessonCount: 8, enrolledCount: 987,
  thumbnail: "🧪", imageUrl: "https://images.unsplash.com/photo-1532094349884-543559c8d6a0?w=800&q=80",
  color: "from-orange-500 to-red-400", gradient: "bg-gradient-to-br from-orange-600/20 to-red-500/20",
  category: "Chemistry", section: "curriculum", subSection: "secondary", rating: 4.6, ratingCount: 145,
  certificate: true, instructor: "Dr. Amina Chemistry",
  lessons: [
    { id: "ch-1", title: "Atomic Structure & Periodic Table", titleAr: "التركيب الذري والجدول الدوري", titleSo: "Qaab-dhismeedka Atomiga & Jadwalka", duration: "40 min", isLocked: false, hasQuiz: true, content: "Protons, neutrons, electrons, electron configuration, periodic trends.", contentAr: "البروتونات والنيوترونات والإلكترونات.", contentSo: "Protonka, neutronka, electronka." },
    { id: "ch-2", title: "Chemical Bonding", titleAr: "الروابط الكيميائية", titleSo: "Xidhmada Kiimikada", duration: "40 min", isLocked: false, hasQuiz: true, content: "Ionic, covalent, metallic bonds. Lewis structures, VSEPR.", contentAr: "الروابط الأيونية والتساهمية والمعدنية.", contentSo: "Xidhmada ionic, covalent, metallic." },
    { id: "ch-3", title: "Chemical Reactions & Equations", titleAr: "التفاعلات والمعادلات الكيميائية", titleSo: "Falcelinta & Xisaabadaha Kiimikada", duration: "45 min", isLocked: false, hasQuiz: true, content: "Balancing equations, types of reactions, reaction rates.", contentAr: "موازنة المعادلات وأنواع التفاعلات.", contentSo: "Miisaaninta xisaabadaha, noocyada falcelinta." },
    { id: "ch-4", title: "Stoichiometry & Moles", titleAr: "قياس التفاعل والمولات", titleSo: "Stoichiometry & Moles-ka", duration: "45 min", isLocked: true, hasQuiz: true, content: "Mole concept, Avogadro's number, calculations.", contentAr: "مفهوم المول وعدد أفوجادرو.", contentSo: "Fikradda mole-ka, xisaabadaha." },
    { id: "ch-5", title: "Acids, Bases & pH", titleAr: "الأحماض والقواعد والـ pH", titleSo: "Asiidhka, Saldhigga & pH", duration: "35 min", isLocked: true, hasQuiz: true, content: "Arrhenius, Brønsted–Lowry theory, pH scale, indicators.", contentAr: "نظريات الأحماض والقواعد ومقياس pH.", contentSo: "Nidaamyada asiidhka, pH scale-ka." },
    { id: "ch-6", title: "Organic Chemistry Basics", titleAr: "أساسيات الكيمياء العضوية", titleSo: "Aasaaska Kiimikada Dabiiciga ah", duration: "40 min", isLocked: true, hasQuiz: true, content: "Hydrocarbons, functional groups, isomers, polymers.", contentAr: "الهيدروكربونات والمجموعات الوظيفية.", contentSo: "Hydrocarbons, kooxaha shaqada." },
    { id: "ch-7", title: "Thermochemistry & Energy", titleAr: "الكيمياء الحرارية والطاقة", titleSo: "Kuleylka-Kiimikada & Tamarida", duration: "35 min", isLocked: true, hasQuiz: false, content: "Enthalpy, exothermic/endothermic reactions, Hess's law.", contentAr: "المحتوى الحراري والتفاعلات الطاردة/الماصة.", contentSo: "Enthalpy, falcelinta kuleel-bixisa." },
    { id: "ch-8", title: "Final Chemistry Exam & Certificate", titleAr: "الاختبار النهائي للكيمياء والشهادة", titleSo: "Imtixaanka Kiimikada & Shahaadada", duration: "60 min", isLocked: true, hasQuiz: true, content: "Comprehensive chemistry examination. Earn your Chemistry Certificate!", contentAr: "امتحان شامل للكيمياء. احصل على شهادتك!", contentSo: "Imtixaan guud ee kiimikada. Hel shahaadadaada!" },
  ],
};

const biologySecondary: Course = {
  id: "biology-secondary", slug: "biology-secondary",
  title: "Biology – Secondary School", titleAr: "الأحياء – المرحلة الثانوية", titleSo: "Biology – Dugsiga Sare",
  description: "Study cells, genetics, evolution, ecology, plant & animal biology, and human physiology for secondary level.",
  descriptionAr: "ادرس الخلايا والوراثة والتطور والبيئة وعلم وظائف الأعضاء البشرية.", descriptionSo: "Baro unugyada, hiddobeelka, kobcinta, deegaanka, iyo jirka bini'aadamka.",
  language: "multilingual", level: "intermediate", price: 22, duration: "10 weeks", lessonCount: 8, enrolledCount: 1102,
  thumbnail: "🧬", imageUrl: "https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&q=80",
  color: "from-teal-500 to-green-400", gradient: "bg-gradient-to-br from-teal-600/20 to-green-500/20",
  category: "Biology", section: "curriculum", subSection: "secondary", rating: 4.7, ratingCount: 178,
  certificate: true, instructor: "Dr. Faadumo Biology",
  lessons: [
    { id: "bio-1", title: "Cell Biology & Organization", titleAr: "بيولوجيا الخلية والتنظيم", titleSo: "Biology-ga Unugga & Nidaamka", duration: "40 min", isLocked: false, hasQuiz: true, content: "Cell structure, organelles, prokaryotes vs eukaryotes, cell division.", contentAr: "تركيب الخلية والعضيات وانقسام الخلية.", contentSo: "Qaab-dhismeedka unugga, organelles." },
    { id: "bio-2", title: "Genetics & Heredity", titleAr: "علم الوراثة والوراثة", titleSo: "Hiddobeelka & Dhaxalka", duration: "45 min", isLocked: false, hasQuiz: true, content: "DNA, RNA, protein synthesis, Mendel's laws, mutations.", contentAr: "الحمض النووي والحمض الريبوزي وتوليف البروتين.", contentSo: "DNA, RNA, tallaalinta borotiinka." },
    { id: "bio-3", title: "Evolution & Natural Selection", titleAr: "التطور والانتقاء الطبيعي", titleSo: "Kobcinta & Xulashada Dabiiciga", duration: "35 min", isLocked: false, hasQuiz: true, content: "Darwin, natural selection, adaptation, speciation, evidence.", contentAr: "داروين والانتقاء الطبيعي والتكيف.", contentSo: "Darwin, xulashada dabiiciga ah, sifooyinka." },
    { id: "bio-4", title: "Human Body Systems", titleAr: "أجهزة جسم الإنسان", titleSo: "Nidaamyada Jirka Bini'aadamka", duration: "45 min", isLocked: true, hasQuiz: true, content: "Digestive, respiratory, circulatory, nervous, endocrine systems.", contentAr: "الجهاز الهضمي والتنفسي والدوري والعصبي.", contentSo: "Nidaamka dheefka, neefsiga, dhiigga, xididdada." },
    { id: "bio-5", title: "Plant Biology", titleAr: "بيولوجيا النبات", titleSo: "Biology-ga Dhirta", duration: "35 min", isLocked: true, hasQuiz: true, content: "Photosynthesis, respiration, plant structures, reproduction.", contentAr: "التمثيل الضوئي والتنفس وهياكل النبات.", contentSo: "Sawir-guurka, neefsiga, qaab-dhismeedka dhirta." },
    { id: "bio-6", title: "Ecology & Environment", titleAr: "علم البيئة والبيئة", titleSo: "Ecology & Deegaanka", duration: "35 min", isLocked: true, hasQuiz: true, content: "Ecosystems, food chains, energy flow, biodiversity, conservation.", contentAr: "النظم البيئية وسلاسل الغذاء وتدفق الطاقة.", contentSo: "Ecosystems, silsiladaha cuntada, nolosha kala duwan." },
    { id: "bio-7", title: "Microbiology & Disease", titleAr: "علم الأحياء الدقيقة والأمراض", titleSo: "Microbiology & Xanuunada", duration: "35 min", isLocked: true, hasQuiz: false, content: "Bacteria, viruses, fungi. Immunity, vaccines, infectious diseases.", contentAr: "البكتيريا والفيروسات والفطريات.", contentSo: "Bakteeriyada, fayraaska, faangaska." },
    { id: "bio-8", title: "Biology Exam & Certificate", titleAr: "امتحان الأحياء والشهادة", titleSo: "Imtixaanka Biology & Shahaadada", duration: "60 min", isLocked: true, hasQuiz: true, content: "Comprehensive biology exam. Earn your Biology Certificate!", contentAr: "امتحان شامل للأحياء. احصل على شهادتك!", contentSo: "Imtixaan guud ee biology. Hel shahaadadaada!" },
  ],
};

const geographySecondary: Course = {
  id: "geography-secondary", slug: "geography-secondary",
  title: "Geography – Secondary School", titleAr: "الجغرافيا – المرحلة الثانوية", titleSo: "Juqraafiga – Dugsiga Sare",
  description: "Explore physical geography, climate, human geography, maps, natural resources, and global issues.",
  descriptionAr: "استكشف الجغرافيا الطبيعية والمناخ والجغرافيا البشرية والخرائط والموارد.", descriptionSo: "Sahmi juqraafiga dabiiciga ah, cimilada, juqraafiga bini'aadamka, khariidadaha.",
  language: "multilingual", level: "beginner", price: 18, duration: "8 weeks", lessonCount: 6, enrolledCount: 765,
  thumbnail: "🌍", imageUrl: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&q=80",
  color: "from-cyan-500 to-blue-400", gradient: "bg-gradient-to-br from-cyan-600/20 to-blue-500/20",
  category: "Geography", section: "curriculum", subSection: "secondary", rating: 4.5, ratingCount: 123,
  certificate: true, instructor: "Mr. Hassan Geography",
  lessons: [
    { id: "geo-1", title: "Physical Geography & Landforms", titleAr: "الجغرافيا الطبيعية والتضاريس", titleSo: "Juqraafiga Dabiiciga & Qaababka Dhulka", duration: "35 min", isLocked: false, hasQuiz: true, content: "Mountains, rivers, plains, volcanoes, plate tectonics.", contentAr: "الجبال والأنهار والسهول والبراكين.", contentSo: "Buuraha, webiyada, saheelaha, volcanoes." },
    { id: "geo-2", title: "Climate & Weather", titleAr: "المناخ والطقس", titleSo: "Cimilada & Hawada", duration: "35 min", isLocked: false, hasQuiz: true, content: "Climate zones, factors affecting climate, weather patterns.", contentAr: "المناطق المناخية والعوامل المؤثرة.", contentSo: "Goobaha cimilada, saameynta cimilada." },
    { id: "geo-3", title: "Maps, Scale & GIS", titleAr: "الخرائط والمقياس ونظم المعلومات", titleSo: "Khariidadaha, Miisaanka & GIS", duration: "30 min", isLocked: false, hasQuiz: true, content: "Map types, scale, coordinates, latitude/longitude, GIS basics.", contentAr: "أنواع الخرائط والمقياس والإحداثيات.", contentSo: "Noocyada khariidadaha, miisaanka, GIS." },
    { id: "geo-4", title: "Human Geography & Population", titleAr: "الجغرافيا البشرية والسكان", titleSo: "Juqraafiga Bini'aadamka & Dadka", duration: "35 min", isLocked: true, hasQuiz: true, content: "Population distribution, migration, urbanization, demographics.", contentAr: "توزيع السكان والهجرة والتحضر.", contentSo: "Qaybinta dadka, hijradu, magaalaynta." },
    { id: "geo-5", title: "Natural Resources & Environment", titleAr: "الموارد الطبيعية والبيئة", titleSo: "Kheyraadka Dabiiciga & Deegaanka", duration: "30 min", isLocked: true, hasQuiz: true, content: "Renewable/non-renewable resources, conservation, climate change.", contentAr: "الموارد المتجددة وغير المتجددة وتغير المناخ.", contentSo: "Kheyraadka la cusboonaysiin karo, isbeddelka cimilada." },
    { id: "geo-6", title: "Global Issues & Certificate", titleAr: "القضايا العالمية والشهادة", titleSo: "Arrimaha Caalamiga & Shahaadada", duration: "50 min", isLocked: true, hasQuiz: true, content: "Globalization, inequality, development goals, Africa's geography. Certificate!", contentAr: "العولمة والتفاوت وأهداف التنمية.", contentSo: "Caalamiyeynta, kala-duwanaanta, horumarinta. Shahaadada!" },
  ],
};

const historySecondary: Course = {
  id: "history-secondary", slug: "history-secondary",
  title: "History – Secondary School", titleAr: "التاريخ – المرحلة الثانوية", titleSo: "Taariikhda – Dugsiga Sare",
  description: "Explore world history from ancient civilizations to modern times — wars, empires, revolutions, and African history.",
  descriptionAr: "استكشف تاريخ العالم من الحضارات القديمة إلى العصر الحديث.", descriptionSo: "Sahmi taariikhda adduunka: xadaradaha hore ilaa wakhtiga casriga ah.",
  language: "multilingual", level: "beginner", price: 18, duration: "8 weeks", lessonCount: 6, enrolledCount: 634,
  thumbnail: "📜", imageUrl: "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=800&q=80",
  color: "from-rose-500 to-pink-400", gradient: "bg-gradient-to-br from-rose-600/20 to-pink-500/20",
  category: "History", section: "curriculum", subSection: "secondary", rating: 4.5, ratingCount: 98,
  certificate: true, instructor: "Mr. Omar History",
  lessons: [
    { id: "hist-1", title: "Ancient Civilizations", titleAr: "الحضارات القديمة", titleSo: "Xadaradaha Hore", duration: "40 min", isLocked: false, hasQuiz: true, content: "Egypt, Mesopotamia, Greece, Rome, Indus Valley, China.", contentAr: "مصر وبلاد الرافدين واليونان وروما والهند والصين.", contentSo: "Masar, Mesopotamia, Giriigga, Room, Hindiya." },
    { id: "hist-2", title: "Islamic Golden Age & Empires", titleAr: "العصر الذهبي الإسلامي والإمبراطوريات", titleSo: "Xilligii Dahab Islaamiga & Boqortooyadaha", duration: "40 min", isLocked: false, hasQuiz: true, content: "Abbasid Caliphate, science, trade routes, Ottoman, Mughal empires.", contentAr: "الخلافة العباسية والعلوم وطرق التجارة.", contentSo: "Khilaafadda Abbaasiga, cilmiga, Cothmaniyiin." },
    { id: "hist-3", title: "Colonialism & African History", titleAr: "الاستعمار وتاريخ أفريقيا", titleSo: "Gumeysiga & Taariikhda Afrika", duration: "40 min", isLocked: false, hasQuiz: true, content: "African kingdoms, European colonialism, independence movements, Somalia.", contentAr: "الممالك الأفريقية والاستعمار الأوروبي وحركات الاستقلال.", contentSo: "Boqortooyadaha Afrika, gumeysigu Yurubiyaanka, xorriyadda." },
    { id: "hist-4", title: "World Wars I & II", titleAr: "الحربان العالميتان الأولى والثانية", titleSo: "Dagaaladii Adduunka I & II", duration: "40 min", isLocked: true, hasQuiz: true, content: "Causes, major battles, key figures, aftermath, UN formation.", contentAr: "الأسباب والمعارك الكبرى والشخصيات والعواقب.", contentSo: "Sababaha, dagaaladii weyn, natiijooyinka, UN." },
    { id: "hist-5", title: "Cold War & Modern World", titleAr: "الحرب الباردة والعالم الحديث", titleSo: "Dagaalkii Qabow & Adduunka Casriga", duration: "35 min", isLocked: true, hasQuiz: true, content: "USA vs USSR, decolonization, civil rights, globalization, technology.", contentAr: "الحرب الباردة وإنهاء الاستعمار وحقوق الإنسان.", contentSo: "USA vs USSR, xorriyadda, xuquuqda aadanaha." },
    { id: "hist-6", title: "Modern Somalia & Certificate", titleAr: "الصومال الحديثة والشهادة", titleSo: "Soomaaliya Casriga & Shahaadada", duration: "50 min", isLocked: true, hasQuiz: true, content: "History of Somalia, independence 1960, key events, rebuilding. Certificate!", contentAr: "تاريخ الصومال والاستقلال 1960 والأحداث الرئيسية.", contentSo: "Taariikhda Soomaaliya, xorriyadda 1960. Shahaadada!" },
  ],
};

const somaliLanguage: Course = {
  id: "somali-language", slug: "somali-language",
  title: "Somali Language – Primary & Secondary", titleAr: "اللغة الصومالية – الابتدائية والثانوية", titleSo: "Af Soomaali – Heerka Dugsiga",
  description: "Master Somali grammar, reading, writing, poetry (Gabay), and literature for all school levels.",
  descriptionAr: "أتقن قواعد اللغة الصومالية والقراءة والكتابة والشعر والأدب.", descriptionSo: "Soo xifdiso naxwaha Af Soomaali, akhris, qoris, gabay, iyo suugaanta.",
  language: "somali", level: "beginner", price: 15, duration: "8 weeks", lessonCount: 6, enrolledCount: 2134,
  thumbnail: "🇸🇴", imageUrl: "https://images.unsplash.com/photo-1503945438517-f65904a52ce6?w=800&q=80",
  color: "from-sky-500 to-cyan-400", gradient: "bg-gradient-to-br from-sky-600/20 to-cyan-500/20",
  category: "Somali", section: "curriculum", subSection: "school", rating: 4.8, ratingCount: 312,
  certificate: true, instructor: "Ust. Fadumo Somali",
  lessons: [
    { id: "so-1", title: "Somali Alphabet & Pronunciation", titleAr: "الأبجدية الصومالية والنطق", titleSo: "Xarfaha Af Soomaali & Dhawaaqa", duration: "30 min", isLocked: false, hasQuiz: true, content: "21 consonants, 5 vowels, tone markers, pronunciation rules.", contentAr: "21 حرفاً ساكناً و5 حروف علة وعلامات النبرة.", contentSo: "21 xarfo, 5 vowel, calaamadaha heesaha." },
    { id: "so-2", title: "Somali Grammar – Nouns & Verbs", titleAr: "القواعد الصومالية – الأسماء والأفعال", titleSo: "Naxwaha Af Soomaali – Magacyada & Falimaha", duration: "35 min", isLocked: false, hasQuiz: true, content: "Gender, definiteness, verb conjugation, sentence structure.", contentAr: "الجنس والتعريف وتصريف الفعل وبنية الجملة.", contentSo: "Jinsiga, qeexaynta, isugaynta faalka." },
    { id: "so-3", title: "Reading & Comprehension", titleAr: "القراءة والفهم", titleSo: "Akhrisiga & Fahamka", duration: "30 min", isLocked: false, hasQuiz: true, content: "Reading passages, comprehension questions, vocabulary building.", contentAr: "قراءة النصوص وأسئلة الفهم وبناء المفردات.", contentSo: "Akhrinta qoraalada, su'aalaha fahamka." },
    { id: "so-4", title: "Somali Poetry – Gabay", titleAr: "الشعر الصومالي – الغباي", titleSo: "Gabay Soomaaliga", duration: "35 min", isLocked: true, hasQuiz: true, content: "Types of Somali poetry: gabay, geeraar, jiifto, masafo. Alliteration.", contentAr: "أنواع الشعر الصومالي: الغباي والغيرار والجيفتو.", contentSo: "Noocyada gabayga: gabay, geeraar, jiifto." },
    { id: "so-5", title: "Somali Literature & History", titleAr: "الأدب الصومالي وتاريخه", titleSo: "Suugaanta Soomaali & Taariikhdeeda", duration: "30 min", isLocked: true, hasQuiz: false, content: "Famous Somali poets, oral tradition, Sayyid Mohamed, modern literature.", contentAr: "الشعراء الصوماليون المشهورون والتقليد الشفهي.", contentSo: "Gabyaasha Soomaalida caanka ah, Sayid Maxamed." },
    { id: "so-6", title: "Writing & Certificate", titleAr: "الكتابة والشهادة", titleSo: "Qorista & Shahaadada", duration: "45 min", isLocked: true, hasQuiz: true, content: "Formal writing, letters, essays, storytelling in Somali. Certificate!", contentAr: "الكتابة الرسمية والرسائل والمقالات بالصومالية.", contentSo: "Qorista rasmiga ah, warqadaha, sheekooyin. Shahaadada!" },
  ],
};

const islamicPrimary: Course = {
  id: "islamic-primary", slug: "islamic-primary",
  title: "Islamic Studies – School Level", titleAr: "الدراسات الإسلامية – المستوى المدرسي", titleSo: "Cilmiga Islaamiga – Heerka Dugsiga",
  description: "Learn the fundamentals of Islam: pillars, prayer, Quran basics, Islamic manners, and stories of the prophets for young students.",
  descriptionAr: "تعلم أساسيات الإسلام: الأركان والصلاة وأساسيات القرآن والأخلاق الإسلامية.", descriptionSo: "Baro aasaaska Islaamka: tiirarka, salaadda, Qur'aanka, akhlaaqa Islaamiga.",
  language: "arabic", level: "beginner", price: 15, duration: "8 weeks", lessonCount: 6, enrolledCount: 3421,
  thumbnail: "🕋", imageUrl: "https://images.unsplash.com/photo-1590577976322-3d2d6e2130d5?w=800&q=80",
  color: "from-amber-500 to-yellow-400", gradient: "bg-gradient-to-br from-amber-600/20 to-yellow-500/20",
  category: "Islamic Studies", section: "curriculum", subSection: "school", rating: 4.9, ratingCount: 523,
  certificate: true, instructor: "Sheikh Omar Islamic", popular: true,
  lessons: [
    { id: "isl-s-1", title: "Five Pillars of Islam", titleAr: "أركان الإسلام الخمسة", titleSo: "Tiirarka Shanta ee Islaamka", duration: "30 min", isLocked: false, hasQuiz: true, content: "Shahada, Salah, Zakat, Sawm, Hajj — meanings, importance, practice.", contentAr: "الشهادة والصلاة والزكاة والصيام والحج.", contentSo: "Shahaadada, Salaadda, Zakada, Sooma, Xajka." },
    { id: "isl-s-2", title: "How to Pray (Salah)", titleAr: "كيفية الصلاة", titleSo: "Sida Loo Tukado", duration: "35 min", isLocked: false, hasQuiz: true, content: "Wudu, prayer positions, Fatiha, rakat, proper recitation.", contentAr: "الوضوء ومواضع الصلاة والفاتحة والركعات.", contentSo: "Wudhuca, goobaha salaadda, Fatixa, rakaatada." },
    { id: "isl-s-3", title: "Quran Basics – Reading & Tajweed", titleAr: "أساسيات القرآن – القراءة والتجويد", titleSo: "Aasaaska Qur'aanka – Akhris & Tajwiid", duration: "35 min", isLocked: false, hasQuiz: true, content: "Arabic letters, Nooraniyah, basic tajweed rules, short suras.", contentAr: "الحروف العربية والنورانية وقواعد التجويد الأساسية.", contentSo: "Xarfaha Carabiga, Nooraniyah, xeerarka tajwiidka." },
    { id: "isl-s-4", title: "Islamic Manners & Character", titleAr: "الآداب الإسلامية والأخلاق", titleSo: "Dhaqanka Islaamiga & Akhlaaqa", duration: "25 min", isLocked: true, hasQuiz: true, content: "Honesty, respect, sharing, Islamic greetings, dua, daily sunnahs.", contentAr: "الصدق والاحترام والتشارك والتحية الإسلامية.", contentSo: "Daacadnimada, xurmaynta, wadaagga, salaamaha Islaamiga." },
    { id: "isl-s-5", title: "Stories of the Prophets", titleAr: "قصص الأنبياء", titleSo: "Sheekooyin Nabiyada", duration: "30 min", isLocked: true, hasQuiz: false, content: "Adam, Nuh, Ibrahim, Musa, Isa, Muhammad ﷺ — key stories and lessons.", contentAr: "آدم ونوح وإبراهيم وموسى وعيسى ومحمد ﷺ.", contentSo: "Aadam, Nuux, Ibraahim, Muuse, Ciise, Maxamed ﷺ." },
    { id: "isl-s-6", title: "Memorizing Short Surahs & Certificate", titleAr: "حفظ السور القصيرة والشهادة", titleSo: "Xifditaanka Suraha Gaagaaban & Shahaadada", duration: "45 min", isLocked: true, hasQuiz: true, content: "Al-Fatiha, Al-Ikhlas, Al-Falaq, An-Nas, Al-Kawthar memorization & meaning. Certificate!", contentAr: "حفظ الفاتحة والإخلاص والفلق والناس والكوثر.", contentSo: "Xifditaanka Al-Fatixa, Al-Ikhlaas, Al-Falaq. Shahaadada!" },
  ],
};

/* ─── New skills ─── */

const publicSpeakingCourse: Course = {
  id: "public-speaking", slug: "public-speaking",
  title: "Public Speaking & Communication", titleAr: "الخطابة العامة والتواصل", titleSo: "Hadlidda Dadweynaha & Xiriirka",
  description: "Overcome fear, build confidence, and master public speaking for presentations, debates, and professional settings.",
  descriptionAr: "تغلب على الخوف وابنِ الثقة وأتقن الخطابة العامة للعروض والمناقشات.", descriptionSo: "Ka xukum cabsida, dhis is-kalsooni, oo soo xifdiso hadlidda dadweynaha.",
  language: "multilingual", level: "beginner", price: 22, duration: "6 weeks", lessonCount: 8, enrolledCount: 1876,
  thumbnail: "🎤", imageUrl: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80",
  color: "from-purple-500 to-pink-400", gradient: "bg-gradient-to-br from-purple-600/20 to-pink-500/20",
  category: "Communication", section: "skills", rating: 4.8, ratingCount: 287, certificate: true,
  instructor: "Coach Yusuf Speaker", isNew: true,
  lessons: [
    { id: "ps-1", title: "Overcoming Fear of Public Speaking", titleAr: "التغلب على الخوف من الخطابة", titleSo: "Ka Xukumidda Cabsida Hadlidda", duration: "25 min", isLocked: false, hasQuiz: true, content: "Understanding stage fright, breathing techniques, mindset shifts.", contentAr: "فهم رهاب المسرح وتقنيات التنفس وتحويل العقلية.", contentSo: "Fahamka cabsida, farsamooyinka neefsiga." },
    { id: "ps-2", title: "Body Language & Presence", titleAr: "لغة الجسد والحضور", titleSo: "Luuqadda Jirka & Joognanaanta", duration: "30 min", isLocked: false, hasQuiz: true, content: "Posture, eye contact, gestures, voice projection, movement.", contentAr: "الوضعية والتواصل البصري والإيماءات وإسقاط الصوت.", contentSo: "Qaabka joogsiga, indhaha, gacanta, codka." },
    { id: "ps-3", title: "Structuring a Powerful Speech", titleAr: "هيكلة خطاب قوي", titleSo: "Qaabeynta Khudbad Xoog leh", duration: "35 min", isLocked: false, hasQuiz: true, content: "Introduction, body, conclusion. Hook, story, data, call to action.", contentAr: "المقدمة والجسم والخاتمة.", contentSo: "Hordhaca, jirka, gunaanadka." },
    { id: "ps-4", title: "Storytelling That Captivates", titleAr: "السرد القصصي الجذاب", titleSo: "Sheeko Xiiseeya", duration: "30 min", isLocked: true, hasQuiz: true, content: "Story structure, emotional connection, vivid language, examples.", contentAr: "بنية القصة والاتصال العاطفي واللغة الحية.", contentSo: "Qaab-dhismeedka sheekada, xiriirka xisiga." },
    { id: "ps-5", title: "Persuasion & Influence", titleAr: "الإقناع والتأثير", titleSo: "Qancinta & Saamaynta", duration: "30 min", isLocked: true, hasQuiz: false, content: "Aristotle's Ethos, Pathos, Logos. Debate tactics, argumentation.", contentAr: "الإيثوس والباثوس والشعار لأرسطو.", contentSo: "Ethos, Pathos, Logos-ka Aristotle." },
    { id: "ps-6", title: "Presentations & Slides", titleAr: "العروض التقديمية والشرائح", titleSo: "Bandhigga & Golaha", duration: "30 min", isLocked: true, hasQuiz: true, content: "Design principles, slide structure, visual storytelling, delivery.", contentAr: "مبادئ التصميم وبنية الشريحة والتسليم.", contentSo: "Mabaadi'da naqshadeynta, qaab-dhismeedka." },
    { id: "ps-7", title: "Impromptu Speaking", titleAr: "الخطابة الارتجالية", titleSo: "Hadlidda Isu-Diyaarinta", duration: "25 min", isLocked: true, hasQuiz: false, content: "PREP, STAR frameworks. Thinking on your feet, rapid content generation.", contentAr: "أطر PREP وSTAR. التفكير بسرعة.", contentSo: "Hab-raacyada PREP, STAR. Fikir degdeg ah." },
    { id: "ps-8", title: "Final Speech & Certificate", titleAr: "الخطاب النهائي والشهادة", titleSo: "Khudbadda Kama-dambeysta & Shahaadada", duration: "60 min", isLocked: true, hasQuiz: true, content: "Deliver a 5-minute speech. Get feedback. Earn your Public Speaking Certificate!", contentAr: "ألقِ خطاباً مدته 5 دقائق. احصل على شهادتك!", contentSo: "Jeli khudbad 5-daqiiqo. Hel shahaadadaada!" },
  ],
};

const tajweedCourse: Course = {
  id: "tajweed-quran", slug: "tajweed-quran",
  title: "Tajweed & Qur'an Memorization", titleAr: "التجويد وحفظ القرآن الكريم", titleSo: "Tajwiidka & Xifditaanka Qur'aanka",
  description: "Learn the rules of Tajweed and begin memorizing the Qur'an. Perfect pronunciation, correct recitation, and build a Quran habit.",
  descriptionAr: "تعلم أحكام التجويد وابدأ في حفظ القرآن. النطق الصحيح والتلاوة الصحيحة.", descriptionSo: "Baro xeerarka Tajwiidka oo bilow xifditaanka Qur'aanka Kariimka.",
  language: "arabic", level: "beginner", price: 20, duration: "10 weeks", lessonCount: 8, enrolledCount: 4123,
  thumbnail: "📖", imageUrl: "https://images.unsplash.com/photo-1585036156171-384164a8c675?w=800&q=80",
  color: "from-amber-500 to-yellow-400", gradient: "bg-gradient-to-br from-amber-600/20 to-yellow-500/20",
  category: "Islamic Studies", section: "skills", rating: 4.9, ratingCount: 634, certificate: true,
  instructor: "Sheikh Mahad Tajweed", popular: true, featured: true,
  lessons: [
    { id: "tj-1", title: "Arabic Letters & Makharij", titleAr: "الحروف العربية ومخارجها", titleSo: "Xarfaha Carabiga & Makhaarijka", duration: "35 min", isLocked: false, hasQuiz: true, content: "All 28 Arabic letters, articulation points (makharij al-huruf).", contentAr: "28 حرفاً عربياً ونقاط الإخراج.", contentSo: "28 xarf Carabi, goobaha ka soo baxa (makharij)." },
    { id: "tj-2", title: "Vowels, Sukoon & Shaddah", titleAr: "الحركات والسكون والشدة", titleSo: "Dhaqdhaqaaqayaasha, Sukuunka & Shaddada", duration: "30 min", isLocked: false, hasQuiz: true, content: "Fatha, kasra, damma, tanween, sukoon, shaddah, madd.", contentAr: "الفتح والكسر والضم والتنوين والسكون والشدة.", contentSo: "Fatixa, kasra, dhamma, tanwiin, sukuun, shaddah." },
    { id: "tj-3", title: "Rules of Noon Sakinah & Tanween", titleAr: "أحكام النون الساكنة والتنوين", titleSo: "Xeerarka Noon Sakinah & Tanwiin", duration: "35 min", isLocked: false, hasQuiz: true, content: "Idhar, idghaam, ikhfaa, iqlab — with examples.", contentAr: "الإظهار والإدغام والإخفاء والإقلاب مع أمثلة.", contentSo: "Idhhaar, Idgaam, Ikhfaa, Iqlaab — tusaalooyin." },
    { id: "tj-4", title: "Rules of Meem Sakinah", titleAr: "أحكام الميم الساكنة", titleSo: "Xeerarka Miim Sakinah", duration: "25 min", isLocked: true, hasQuiz: true, content: "Ikhfaa shafawi, idghaam shafawi, idhar shafawi.", contentAr: "الإخفاء الشفوي والإدغام الشفوي والإظهار الشفوي.", contentSo: "Ikhfaa Shafawi, Idgaam Shafawi, Idhhaar Shafawi." },
    { id: "tj-5", title: "Madd (Elongation) Rules", titleAr: "أحكام المد", titleSo: "Xeerarka Madd (Dheeraynta)", duration: "30 min", isLocked: true, hasQuiz: true, content: "Madd asli, madd far'i, madd lazim, madd muttasil, madd munfasil.", contentAr: "المد الأصلي والفرعي اللازم والمتصل والمنفصل.", contentSo: "Madd asali, far'i, laazim, muttasil, munfasil." },
    { id: "tj-6", title: "Memorizing Juz' Amma", titleAr: "حفظ جزء عم", titleSo: "Xifditaanka Juzu' Camma", duration: "50 min", isLocked: true, hasQuiz: true, content: "Al-Fatiha, An-Nas, Al-Falaq, Al-Ikhlas, short suras with tajweed.", contentAr: "الفاتحة والناس والفلق والإخلاص والسور القصيرة.", contentSo: "Al-Fatixa, An-Naas, Al-Falaq, Al-Ikhlaas, suraha gaagaaban." },
    { id: "tj-7", title: "Waqf & Ibtida (Stop & Start Rules)", titleAr: "الوقف والابتداء", titleSo: "Waqfiga & Ibtidaada (Joojinta & Bilaabista)", duration: "25 min", isLocked: true, hasQuiz: false, content: "Where to stop and start in Quran. Symbols explained.", contentAr: "أين تتوقف وتبدأ في القرآن. الرموز موضحة.", contentSo: "Meel jooji lagu xusaayo, meel ku bilow." },
    { id: "tj-8", title: "Recitation & Tajweed Certificate", titleAr: "التلاوة وشهادة التجويد", titleSo: "Tilaawaadda & Shahaadada Tajwiidka", duration: "60 min", isLocked: true, hasQuiz: true, content: "Full recitation with tajweed. Assessment. Earn your Tajweed Certificate!", contentAr: "تلاوة كاملة بالتجويد. التقييم. احصل على شهادتك!", contentSo: "Tilaawad buuxda tajwiid leh. Hel shahaadadaada Tajwiidka!" },
  ],
};

export const CURRICULUM_COURSES: Course[] = [
  englishBeginner, englishIntermediate, englishAdvanced,
  arabicBeginner, arabicIntermediate,
  mathSchool, scienceSchool,
  physicsSecondary, chemistrySecondary, biologySecondary,
  geographySecondary, historySecondary,
  somaliLanguage, islamicPrimary,
  computerScienceUni, islamicStudiesUni,
];

export const SCHOOL_COURSES: Course[] = CURRICULUM_COURSES.filter(c => c.subSection === "school");
export const UNIVERSITY_COURSES: Course[] = CURRICULUM_COURSES.filter(c => c.subSection === "university");

export const SKILLS_COURSES: Course[] = [
  aiCourse, pythonCourse, webDevCourse,
  businessCourse, designCourse, digitalMarketingCourse,
  freelancingCourse, selfDevCourse, dataScienceCourse,
  publicSpeakingCourse, tajweedCourse,
];

export const COURSES: Course[] = [...CURRICULUM_COURSES, ...SKILLS_COURSES];

export function getCourseById(id: string): Course | undefined {
  return COURSES.find(c => c.id === id || c.slug === id);
}

export function getFeaturedCourses(): Course[] {
  return COURSES.filter(c => c.featured);
}

export function getPopularCourses(): Course[] {
  return COURSES.filter(c => c.popular);
}

export function getNewCourses(): Course[] {
  return COURSES.filter(c => c.isNew);
}
