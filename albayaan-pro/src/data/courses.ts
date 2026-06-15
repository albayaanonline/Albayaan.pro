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
  language: "english" | "arabic";
  level: "beginner" | "intermediate" | "advanced";
  price: number;
  duration: string;
  lessonCount: number;
  enrolledCount: number;
  thumbnail: string;
  thumbnailUrl?: string;
  color: string;
  gradient: string;
  lessons: Lesson[];
  category: string;
  rating: number;
  ratingCount: number;
  certificate: boolean;
}

const englishBeginner: Course = {
  id: "en-beginner",
  slug: "english-beginner",
  title: "English for Beginners",
  titleAr: "الإنجليزية للمبتدئين",
  titleSo: "Ingiriisi Bilowga",
  description: "Start your English journey from zero. Learn the alphabet, basic words, greetings, numbers, and everyday conversations — all in an AI-powered environment.",
  descriptionAr: "ابدأ رحلتك في تعلم الإنجليزية من الصفر. تعلم الأبجدية والكلمات الأساسية والتحيات والأرقام والمحادثات اليومية.",
  descriptionSo: "Bilow safar Ingiriisi ah eber. Baro xarfaha, erayada aasaasiga ah, salaamaha, tirada, iyo xarriiqda maalin kasta.",
  language: "english",
  level: "beginner",
  price: 15,
  duration: "8 weeks",
  lessonCount: 13,
  enrolledCount: 2847,
  thumbnail: "🇬🇧",
  thumbnailUrl: "https://xokrirmhuxhugofgheev.supabase.co/storage/v1/object/public/thumbnails/english-beginner-thumb.png",
  color: "from-blue-500 to-cyan-400",
  gradient: "bg-gradient-to-br from-blue-600/20 to-cyan-500/20",
  category: "English",
  rating: 4.9,
  ratingCount: 412,
  certificate: true,
  lessons: [
    {
      id: "en-b-0",
      title: "English Beginner",
      titleAr: "مبتدئ الإنجليزية",
      titleSo: "English Beginner",
      duration: "50 min",
      isLocked: false,
      hasQuiz: false,
      videoUrl: "https://xokrirmhuxhugofgheev.supabase.co/storage/v1/object/public/videos/english-beginner-intro.mp4",
      content: "Welcome to the English Beginner lesson. In this lesson you will learn the basics of the English language, including greetings, common phrases, and simple grammar.\n\nTopics covered:\n- Alphabet and pronunciation\n- Basic greetings (Hello, Good morning, How are you?)\n- Numbers 1–20\n- Common everyday words\n- Simple sentences",
      contentAr: "مرحباً بك في درس مبتدئ الإنجليزية. في هذا الدرس ستتعلم أساسيات اللغة الإنجليزية، بما في ذلك التحيات والعبارات الشائعة والقواعد البسيطة.",
      contentSo: "Ku soo dhawow casharka English Beginner. Casharkan waxaad ku baranaysaa aasaaska luqadda Ingiriisiga.\n\nMawduucyada la daboolayo:\n- Xarfaha iyo sida loo dhawaaqa\n- Salaamaha asaasiga ah (Hello, Good morning, How are you?)\n- Tirada 1-20\n- Ereyada maalinlaha ah\n- Jumlad fudud",
    },
    { id: "en-b-1", title: "The English Alphabet", titleAr: "الأبجدية الإنجليزية", titleSo: "Xarfaha Ingiriisiga", duration: "12 min", isLocked: false, hasQuiz: true, content: "Learn all 26 letters of the English alphabet with proper pronunciation. Practice vowels (A, E, I, O, U) and consonants. We will learn how each letter sounds and practice writing them.", contentAr: "تعلم جميع الـ 26 حرفاً في الأبجدية الإنجليزية مع النطق الصحيح.", contentSo: "Baro dhammaan 26 xaraf ee alifbeetada Ingiriisiga oo leh dhawaaqa saxda ah." },
    { id: "en-b-2", title: "Greetings & Introductions", titleAr: "التحيات والمقدمات", titleSo: "Salaamaha & Is-barashada", duration: "15 min", isLocked: false, hasQuiz: true, content: "Hello, Hi, Good morning, Good afternoon, Good evening, Good night. How are you? I am fine. What is your name? My name is... Nice to meet you. Where are you from?", contentAr: "مرحبا، صباح الخير، مساء الخير، كيف حالك؟ اسمي...", contentSo: "Salaan, Subax wanaagsan, Galab wanaagsan. Magacaygu waa..." },
    { id: "en-b-3", title: "Numbers 1–100", titleAr: "الأرقام من 1 إلى 100", titleSo: "Tirooyin 1-100", duration: "18 min", isLocked: false, hasQuiz: true, content: "One, two, three... Count from 1 to 20, then learn tens: twenty, thirty, forty. Combine to make any number. Practice counting money, ages, and phone numbers.", contentAr: "واحد، اثنان، ثلاثة... تعلم العد من 1 إلى 100.", contentSo: "Kow, labo, saddex... Barasho tirada 1 ilaa 100." },
    { id: "en-b-4", title: "Basic Vocabulary: Colors & Objects", titleAr: "المفردات الأساسية: الألوان والأشياء", titleSo: "Ereybaareedka: Midabada & Walxaha", duration: "20 min", isLocked: true, hasQuiz: true, content: "Colors: red, blue, green, yellow, white, black, orange, purple. Common objects: book, pen, table, chair, door, window, phone, bag.", contentAr: "الألوان: أحمر، أزرق، أخضر... الأشياء: كتاب، قلم، طاولة...", contentSo: "Midabada: cas, buluug, cagaar... Walxaha: buug, qalin, miis..." },
    { id: "en-b-5", title: "Family Members", titleAr: "أفراد العائلة", titleSo: "Xubnaha Qoyska", duration: "15 min", isLocked: true, hasQuiz: true, content: "Mother, father, brother, sister, son, daughter, grandfather, grandmother, uncle, aunt, cousin, husband, wife. Practice sentences: This is my mother. Her name is...", contentAr: "الأم، الأب، الأخ، الأخت، الجد، الجدة...", contentSo: "Hooyo, Aabe, Walaal, Awoowe, Ayeeyo..." },
    { id: "en-b-6", title: "Days, Months & Seasons", titleAr: "الأيام والأشهر والفصول", titleSo: "Maalin, Bilaha & Xilliyadda", duration: "22 min", isLocked: true, hasQuiz: true, content: "Days: Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday. Months: January through December. Seasons: Spring, Summer, Autumn, Winter.", contentAr: "الأيام: الاثنين، الثلاثاء... الأشهر: يناير، فبراير...", contentSo: "Maalinta: Isniin, Talaado... Bilaha: Janaayo, Febraayo..." },
    { id: "en-b-7", title: "Daily Routines", titleAr: "الروتين اليومي", titleSo: "Caadooyinka Maalinlaha", duration: "25 min", isLocked: true, hasQuiz: true, content: "Wake up, brush teeth, take a shower, have breakfast, go to work/school, have lunch, come home, have dinner, watch TV, go to bed.", contentAr: "الاستيقاظ، تنظيف الأسنان، الاستحمام، الإفطار، الذهاب للعمل...", contentSo: "Toosid, caleen cadayn, qubayso, quraac, shaqo aad..." },
    { id: "en-b-8", title: "Food & Drinks", titleAr: "الطعام والمشروبات", titleSo: "Cuntada & Cabitaanka", duration: "20 min", isLocked: true, hasQuiz: true, content: "Breakfast foods: eggs, bread, milk, juice, cereal. Lunch/Dinner: rice, chicken, fish, vegetables, soup. Drinks: water, tea, coffee, juice, milk.", contentAr: "وجبة الإفطار: البيض، الخبز، الحليب... الغداء: الأرز، الدجاج...", contentSo: "Quraacdda: ukunta, rootida, caanaha... Cashadda: bariis, digaag..." },
    { id: "en-b-9", title: "Simple Present Tense", titleAr: "المضارع البسيط", titleSo: "Wakhtiga Hadda Fudud", duration: "30 min", isLocked: true, hasQuiz: true, content: "I work, You work, He/She works, We work, They work. Negative: I do not work. Question: Do you work? Short answers: Yes, I do. No, I don't.", contentAr: "أنا أعمل، أنت تعمل، هو/هي يعمل... النفي: لا أعمل.", contentSo: "Aniga waxaan shaqeeyaa, Adiga waxaad shaqaysaa..." },
    { id: "en-b-10", title: "Basic Conversation Practice", titleAr: "ممارسة المحادثة الأساسية", titleSo: "Tababarka Sheekada Aasaasiga", duration: "35 min", isLocked: true, hasQuiz: false, content: "Full dialogue practice: At a shop, At a restaurant, Meeting someone new, Asking for directions. Practice real conversations with AI assistant.", contentAr: "تدريب على الحوار الكامل: في المتجر، في المطعم، مقابلة شخص جديد...", contentSo: "Tababarka sheekada dhamaystiran: Dukaanka, maqaaxa, kulanka qof cusub..." },
    { id: "en-b-11", title: "Pronunciation & Phonics", titleAr: "النطق والصوتيات", titleSo: "Dhawaaqa & Phonics", duration: "28 min", isLocked: true, hasQuiz: true, content: "Vowel sounds: short vs long. Consonant clusters: bl, br, cl, cr, fl. Silent letters: k in know, b in comb. Practice with common words.", contentAr: "أصوات الحروف المتحركة القصيرة والطويلة. التجمعات الصوتية...", contentSo: "Codadka shaqiilayaasha gaagaaban iyo dhaadheer..." },
    { id: "en-b-12", title: "Final Review & Certificate", titleAr: "المراجعة النهائية والشهادة", titleSo: "Dib-u-eegista Kama-dambeysta & Shahaadada", duration: "45 min", isLocked: true, hasQuiz: true, content: "Comprehensive review of all topics covered. Final quiz covering: alphabet, vocabulary, numbers, grammar, and conversation. Pass to earn your Beginner certificate!", contentAr: "مراجعة شاملة لجميع الموضوعات. اختبار نهائي للحصول على الشهادة!", contentSo: "Dib-u-eeg dhamaanba mawduucyada. Imtixaanka kama-dambeysta si aad shahaadada u hesho!" },
  ],
};

const englishIntermediate: Course = {
  id: "en-intermediate",
  slug: "english-intermediate",
  title: "Intermediate English",
  titleAr: "الإنجليزية المتوسطة",
  titleSo: "Ingiriisi Dhexe",
  description: "Level up your English with intermediate grammar, speaking practice, writing skills, business English, and real-world conversation scenarios.",
  descriptionAr: "طوّر مستواك في الإنجليزية بقواعد متوسطة وممارسة المحادثة ومهارات الكتابة والإنجليزية التجارية.",
  descriptionSo: "Kor u qaad Ingiriisigaaga naxwe dhexe, tababarka hadlidda, xirfadaha qorista, iyo Ingiriisiga ganacsiga.",
  language: "english",
  level: "intermediate",
  price: 25,
  duration: "10 weeks",
  lessonCount: 12,
  enrolledCount: 1924,
  thumbnail: "🇬🇧",
  color: "from-indigo-500 to-blue-400",
  gradient: "bg-gradient-to-br from-indigo-600/20 to-blue-500/20",
  category: "English",
  rating: 4.8,
  ratingCount: 287,
  certificate: true,
  lessons: [
    { id: "en-i-1", title: "Past Tense & Past Continuous", titleAr: "الماضي البسيط والمستمر", titleSo: "Wakhtiga Hore Fudud & Joogto", duration: "30 min", isLocked: false, hasQuiz: true, content: "Simple past: I worked, she went. Past continuous: I was working when she called. Irregular verbs: go→went, see→saw, have→had, come→came.", contentAr: "الماضي البسيط: عملت، ذهبت. الماضي المستمر: كنت أعمل عندما اتصلت.", contentSo: "Waayihii: Waxaan shaqeeyay, waxay taqtay. Joogtada waayihii: Waxaan shaqeynayay markay wacday." },
    { id: "en-i-2", title: "Future Tense (will, going to, present continuous)", titleAr: "المستقبل (will, going to)", titleSo: "Wakhtiga Mustaqbalka", duration: "28 min", isLocked: false, hasQuiz: true, content: "Will for decisions: I will call you. Going to for plans: I am going to study. Present continuous for schedules: I am meeting him tomorrow.", contentAr: "will للقرارات الفورية. going to للخطط المسبقة. المضارع المستمر للجداول الزمنية.", contentSo: "Will go'an go'doon: Will waxaan ku isticmaalaa go'aannada deg-degga ah. Going to qorshaha." },
    { id: "en-i-3", title: "Conditionals (First & Second)", titleAr: "الجمل الشرطية (الأول والثاني)", titleSo: "Shuruudaha (1aad & 2aad)", duration: "35 min", isLocked: false, hasQuiz: true, content: "First conditional (real possibility): If it rains, I will stay home. Second conditional (unreal/hypothetical): If I were rich, I would travel the world.", contentAr: "الشرط الأول (احتمال حقيقي): إذا أمطرت سأبقى في المنزل. الشرط الثاني (غير واقعي).", contentSo: "Shuruudaha 1aad: Haddii roobku da'o, guriga ayaan joogaa. Shuruudaha 2aad: Haddaan hodantahay lahayd..." },
    { id: "en-i-4", title: "Business English Basics", titleAr: "أساسيات اللغة الإنجليزية للأعمال", titleSo: "Aasaaska Ingiriisiga Ganacsiga", duration: "40 min", isLocked: true, hasQuiz: true, content: "Professional emails: Dear Mr/Ms, I am writing to... Meeting language: Let's get started. Could you clarify...? Presentations: Today I will talk about...", contentAr: "البريد الإلكتروني المهني: عزيزي السيد... لغة الاجتماعات: لنبدأ.", contentSo: "Emailada xirfadlaha: Sayyid/Xaawo qaaliga ah... Luqadda shirkadaha: Aynu bilownno..." },
    { id: "en-i-5", title: "Reading Comprehension", titleAr: "فهم المقروء", titleSo: "Fahanka Akhris", duration: "35 min", isLocked: true, hasQuiz: true, content: "Strategies: scanning, skimming, detailed reading. Practice with news articles, short stories. Identify main idea, supporting details, author's purpose.", contentAr: "استراتيجيات القراءة: المسح، التصفح، القراءة التفصيلية.", contentSo: "Xeeladaha: sawirka guud, soo xigashada, akhriska faahfaahsan." },
    { id: "en-i-6", title: "Writing Skills: Paragraphs & Essays", titleAr: "مهارات الكتابة: الفقرات والمقالات", titleSo: "Xirfadaha Qorista", duration: "40 min", isLocked: true, hasQuiz: true, content: "Paragraph structure: topic sentence, supporting details, concluding sentence. Essay types: descriptive, narrative, argumentative. Transition words: however, furthermore, in conclusion.", contentAr: "هيكل الفقرة: الجملة الموضوعية، التفاصيل الداعمة، الجملة الختامية.", contentSo: "Qaab-dhismeedka xigashada: jumladda mawduuca, faahfaahinta, gunaanadka." },
    { id: "en-i-7", title: "Listening Skills & Accents", titleAr: "مهارات الاستماع واللكنات", titleSo: "Xirfadaha Dhegaysiga & Lahjadaha", duration: "30 min", isLocked: true, hasQuiz: false, content: "American vs British pronunciation differences. Listening for gist vs detail. Common reduction in speech: going to→gonna, want to→wanna, have to→hafta.", contentAr: "الاختلافات بين النطق الأمريكي والبريطاني. الاستماع للفكرة الرئيسية.", contentSo: "Farqiga dhawaaqa Ameerika iyo Ingiriiska. Dhegaysiga fikradda guud vs faahfaahinta." },
    { id: "en-i-8", title: "Real Conversations: Social Situations", titleAr: "محادثات حقيقية: مواقف اجتماعية", titleSo: "Sheekooyin Dhabta ah: Xaalado Bulsheed", duration: "45 min", isLocked: true, hasQuiz: false, content: "At a job interview, At a doctor's office, At a bank, Making complaints, Giving opinions. Role-play exercises with real-life scripts.", contentAr: "في مقابلة عمل، في عيادة الطبيب، في البنك، تقديم شكاوى.", contentSo: "Wareysiga shaqada, rugta dhakhtarka, bangiga, cajilada." },
    { id: "en-i-9", title: "Phrasal Verbs & Idioms", titleAr: "الأفعال المركبة والتعابير الاصطلاحية", titleSo: "Feer-ficileedka & Tixraacyada", duration: "35 min", isLocked: true, hasQuiz: true, content: "Common phrasal verbs: give up, look up, run into, come across, get along. Idioms: it's raining cats and dogs, break a leg, piece of cake, hit the nail on the head.", contentAr: "الأفعال المركبة الشائعة: استسلم، ابحث، صادف... التعابير: إنها تمطر بشكل غزير.", contentSo: "Feer-ficileedka guud: tawakal, raadso, kulmid... Tixraacyada: sarraysatay..." },
    { id: "en-i-10", title: "Present Perfect Tense", titleAr: "المضارع التام", titleSo: "Wakhtiga Hadda Dhamaystiran", duration: "30 min", isLocked: true, hasQuiz: true, content: "Formation: have/has + past participle. Uses: experience (I have been to London), recent past (She has just arrived), duration (I have lived here for 5 years).", contentAr: "التكوين: have/has + المصدر الماضي. الاستخدامات: التجربة، الحاضر القريب، المدة.", contentSo: "Dhisidda: have/has + kalimadda waayihii. Isticmaalka: khibradda, waayihii dhow, muddada." },
    { id: "en-i-11", title: "Vocabulary Building Strategies", titleAr: "استراتيجيات بناء المفردات", titleSo: "Xeeladaha Dhisidda Ereybaareedka", duration: "25 min", isLocked: true, hasQuiz: true, content: "Word families: act, action, active, actively, actor. Prefix/suffix: un-, re-, -ful, -less, -ment. Context clues. Collocations: make a decision, do homework, take a break.", contentAr: "عائلات الكلمات. البوادئ واللواحق. السياق. التجمعات اللغوية.", contentSo: "Qoysaska ereyga. Hordhacyada iyo dambaynta. Xadka. Iskudhafka: go'aan gaadh, shaqada guriga samee." },
    { id: "en-i-12", title: "Final Project & Certificate", titleAr: "المشروع النهائي والشهادة", titleSo: "Mashruuca Kama-dambeysta & Shahaadada", duration: "50 min", isLocked: true, hasQuiz: true, content: "Write a formal email, participate in a mock interview, give a 2-minute presentation on any topic. Pass all tasks to earn your Intermediate English Certificate!", contentAr: "اكتب بريداً إلكترونياً رسمياً، شارك في مقابلة وهمية، قدم عرضاً لمدة دقيقتين.", contentSo: "Qor email rasmi ah, ka qayb qaado wareysiga, u samee muqaal 2 daqiiqo ah." },
  ],
};

const englishAdvanced: Course = {
  id: "en-advanced",
  slug: "english-advanced",
  title: "Advanced English Mastery",
  titleAr: "إتقان الإنجليزية المتقدمة",
  titleSo: "Ingiriisi Heer-sare",
  description: "Achieve fluency with advanced grammar, academic writing, public speaking, professional communication, and interview preparation.",
  descriptionAr: "حقق الطلاقة بالقواعد المتقدمة والكتابة الأكاديمية والخطابة العامة والاتصال المهني.",
  descriptionSo: "Gaar xirfad dhab ah iyadoo naxwaha sare, qorista cilmiga, hadlidda dadweynaha, iyo xirfadaha xirfadlaha ah.",
  language: "english",
  level: "advanced",
  price: 35,
  duration: "12 weeks",
  lessonCount: 12,
  enrolledCount: 1203,
  thumbnail: "🇬🇧",
  color: "from-purple-500 to-indigo-400",
  gradient: "bg-gradient-to-br from-purple-600/20 to-indigo-500/20",
  category: "English",
  rating: 4.9,
  ratingCount: 198,
  certificate: true,
  lessons: [
    { id: "en-a-1", title: "Advanced Grammar: Subjunctive & Inversion", titleAr: "القواعد المتقدمة: المضارع الاقتراني والقلب", titleSo: "Naxwaha Sare: Subjunctive & Inversion", duration: "40 min", isLocked: false, hasQuiz: true, content: "Subjunctive mood: I suggest that he be present. Wish + past: I wish I had studied. Inversion for emphasis: Never have I seen such beauty. Rarely does she arrive late.", contentAr: "المضارع الاقتراني: أقترح أن يكون حاضراً. تمني: أتمنى لو درست.", contentSo: "Subjunctive: Waxaan soo jeedinayaa in uu joogo. Rabitaanka: Waad rajeynaysay..." },
    { id: "en-a-2", title: "Academic Writing & Research", titleAr: "الكتابة الأكاديمية والبحث", titleSo: "Qorista Cilmiga & Baaritaanka", duration: "50 min", isLocked: false, hasQuiz: true, content: "Thesis statements, argumentation, citing sources (APA, MLA). Academic vocabulary: however, nevertheless, in contrast, it can be argued. Avoiding plagiarism.", contentAr: "أطروحات، الجدل، الاستشهاد بالمصادر. المفردات الأكاديمية.", contentSo: "Bayaanka qoddbaca, doodda, tilmaamida ilaha. Ereybaareedka cilmiga." },
    { id: "en-a-3", title: "Public Speaking & Presentations", titleAr: "الخطابة العامة والعروض التقديمية", titleSo: "Hadlidda Dadweynaha & Muqaaladda", duration: "45 min", isLocked: false, hasQuiz: false, content: "Structure: opening hook, main body, memorable conclusion. Techniques: storytelling, rhetorical questions, repetition. Body language: eye contact, pausing, gestures.", contentAr: "الهيكل: مقدمة جذابة، جسم رئيسي، خاتمة. التقنيات: سرد القصص، الأسئلة الخطابية.", contentSo: "Qaab-dhismeedka: furitaanka qabashada, jirka muhiimka, gunaanad la xasuusanayo." },
    { id: "en-a-4", title: "Advanced Vocabulary: Synonyms & Nuance", titleAr: "المفردات المتقدمة: المترادفات والدقة", titleSo: "Ereybaareedka Sare: Isku-micneyaasha & Nuance", duration: "35 min", isLocked: true, hasQuiz: true, content: "Formal vs informal register: get→obtain, big→substantial, try→endeavor. Connotations: slim vs skinny, confident vs arrogant. Word choice in context.", contentAr: "السجل الرسمي مقابل غير الرسمي. الدلالات والإيحاءات في السياق.", contentSo: "Isdiiwaangelinta rasmiga vs meel kasta: qaado→hel, weyn→muhiim." },
    { id: "en-a-5", title: "Professional Writing: Reports & Proposals", titleAr: "الكتابة المهنية: التقارير والمقترحات", titleSo: "Qorista Xirfadlaha: Warbixinta & Qorshayaasha", duration: "45 min", isLocked: true, hasQuiz: true, content: "Executive summaries, business reports, project proposals. Formatting: headings, bullet points, charts. Tone: objective, precise, persuasive. Email chains and memos.", contentAr: "الملخصات التنفيذية، التقارير التجارية، مقترحات المشاريع.", contentSo: "Koobbiyada maamulka, warbixinta ganacsiga, qorshayaasha mashruuca." },
    { id: "en-a-6", title: "Interview Preparation", titleAr: "التحضير للمقابلات", titleSo: "Diyaarinta Wareysiga", duration: "50 min", isLocked: true, hasQuiz: false, content: "STAR method: Situation, Task, Action, Result. Common questions: Tell me about yourself. Strengths/weaknesses. Salary negotiation. Asking questions to the interviewer.", contentAr: "طريقة STAR: الموقف، المهمة، الإجراء، النتيجة. أسئلة شائعة في المقابلات.", contentSo: "Habka STAR: Xaaladda, Hawsha, Tallaabada, Natiijooyinka. Su'aalaha guud." },
    { id: "en-a-7", title: "Advanced Listening: Debates & Lectures", titleAr: "الاستماع المتقدم: المناظرات والمحاضرات", titleSo: "Dhegaysiga Sare: Muranaadka & Muhaadradaha", duration: "40 min", isLocked: true, hasQuiz: false, content: "Note-taking strategies: outline method, Cornell method. Listening to TED talks and BBC news. Identifying bias and tone. Evaluating arguments critically.", contentAr: "استراتيجيات تدوين الملاحظات. الاستماع إلى خطابات TED وأخبار BBC.", contentSo: "Xeeladaha qorista xusuusinta. Dhegaysiga khudbadaha TED iyo wariyeyaasha BBC." },
    { id: "en-a-8", title: "Discourse & Cohesion", titleAr: "الخطاب والتماسك", titleSo: "Khudbadda & Isku-xidhka", duration: "35 min", isLocked: true, hasQuiz: true, content: "Cohesive devices: reference (this, that, it, they), substitution, ellipsis. Linkers at text level: on the one hand, in this regard, as a result, to conclude.", contentAr: "أدوات التماسك: الإشارة، الإبدال، الحذف. الروابط على مستوى النص.", contentSo: "Qaababka isku-xidhka: tixraaca, beddelka, baajilaanshaha. Xidhxidhinaadyada qoraalka." },
    { id: "en-a-9", title: "Authentic Communication: Humor & Culture", titleAr: "التواصل الأصيل: الفكاهة والثقافة", titleSo: "Xiriirka Dhab ah: Kaftan & Dhaqanka", duration: "30 min", isLocked: true, hasQuiz: false, content: "Understanding British sarcasm, American humor, cultural references in media. Small talk mastery. Cross-cultural communication. Understanding idioms from context.", contentAr: "فهم السخرية البريطانية، الفكاهة الأمريكية، المراجع الثقافية في وسائل الإعلام.", contentSo: "Fahanka fakaahnimada Ingiriisiga, kaftan-bixinta Ameerika, tixraacyada dhaqanka warbaahinta." },
    { id: "en-a-10", title: "Critical Thinking in English", titleAr: "التفكير النقدي بالإنجليزية", titleSo: "Fikir-dhexgalka Ingiriisiga", duration: "40 min", isLocked: true, hasQuiz: true, content: "Analyzing arguments: premise, conclusion, logical fallacies. Evaluating sources. Forming evidence-based opinions. Debate structure. Writing persuasive essays.", contentAr: "تحليل الحجج: المقدمة، الاستنتاج، المغالطات المنطقية. تقييم المصادر.", contentSo: "Falanqaynta doodda: aasaaska, gunaanadka, cilladaha xujada." },
    { id: "en-a-11", title: "Media & News English", titleAr: "إنجليزية الإعلام والأخبار", titleSo: "Ingiriisiga Warbaahinta & Wararka", duration: "35 min", isLocked: true, hasQuiz: true, content: "News vocabulary: breaking news, allegedly, confirmed, sources say. Headline grammar: passive, infinitive, abbreviations. Reporting verbs: claim, deny, confirm, announce.", contentAr: "مفردات الأخبار: أخبار عاجلة، يُدَّعى، مؤكد. قواعد العناوين.", contentSo: "Ereybaareedka wararka: warar deg-deg ah, lagu sheegay, la xaqiijiyay." },
    { id: "en-a-12", title: "Capstone Project & Advanced Certificate", titleAr: "مشروع التخرج والشهادة المتقدمة", titleSo: "Mashruuca Dhameysirka & Shahaadada Sare", duration: "60 min", isLocked: true, hasQuiz: true, content: "Deliver a 5-minute presentation, write a 500-word analytical essay, participate in a structured debate. Receive your Advanced English Mastery Certificate upon passing!", contentAr: "قدم عرضاً لمدة 5 دقائق، اكتب مقالاً تحليلياً بـ500 كلمة، شارك في نقاش منظم.", contentSo: "U samee muqaal 5 daqiiqo ah, qor maqaal falanqayn ah oo 500 erey ah, ka qayb qaado dood nidaamsan." },
  ],
};

const arabicBeginner: Course = {
  id: "ar-beginner",
  slug: "arabic-beginner",
  title: "Arabic for Beginners",
  titleAr: "العربية للمبتدئين",
  titleSo: "Carabi Bilowga",
  description: "Start your Arabic journey with the alphabet, basic vocabulary, greetings, numbers, and simple conversations — guided step by step.",
  descriptionAr: "ابدأ رحلتك في تعلم العربية بالأبجدية والمفردات الأساسية والتحيات والأرقام والمحادثات البسيطة.",
  descriptionSo: "Bilow safarkaaga Carabiga iyadoo lagu socodsiinaayo xarfaha, ereybaareedka aasaasiga, salaamaha, tirada, iyo sheekooyin fudud.",
  language: "arabic",
  level: "beginner",
  price: 15,
  duration: "8 weeks",
  lessonCount: 12,
  enrolledCount: 3412,
  thumbnail: "🇸🇦",
  color: "from-green-500 to-emerald-400",
  gradient: "bg-gradient-to-br from-green-600/20 to-emerald-500/20",
  category: "Arabic",
  rating: 4.9,
  ratingCount: 521,
  certificate: true,
  lessons: [
    { id: "ar-b-1", title: "The Arabic Alphabet (Alif to Ya)", titleAr: "الأبجدية العربية (من الألف إلى الياء)", titleSo: "Xarfaha Carabiga (Alif ilaa Ya)", duration: "20 min", isLocked: false, hasQuiz: true, content: "Arabic has 28 letters. All letters connect. Letters change shape at start, middle, end of word. Learn: ا ب ت ث ج ح خ د ذ ر ز س ش ص ض ط ظ ع غ ف ق ك ل م ن ه و ي", contentAr: "اللغة العربية تحتوي على 28 حرفاً. جميع الحروف تتصل. تتغير أشكال الحروف في بداية ووسط ونهاية الكلمة.", contentSo: "Carabiga wuxuu leeyahay 28 xaraf. Dhammaan xarfuhu way is-xidhdhaanaan. Qaab-yada xarfuhu waxay isbeddelaan bilowga, dhexda, dhamaadka erayga." },
    { id: "ar-b-2", title: "Vowels (Harakat) & Short Vowels", titleAr: "الحركات والحروف المتحركة القصيرة", titleSo: "Xarakadaha (Harakat) & Codadka Gaagaaban", duration: "18 min", isLocked: false, hasQuiz: true, content: "Fatha (a), Kasra (i), Damma (u), Sukun, Shadda, Tanween. Practice reading simple words with harakat: كَتَبَ (kataba = he wrote), بَيْت (bayt = house).", contentAr: "الفتحة (أ)، الكسرة (إ)، الضمة (أو)، السكون، الشدة، التنوين. تدريب على قراءة الكلمات البسيطة.", contentSo: "Fatha (a), Kasra (i), Damma (u), Sukun, Shadda, Tanween. Tababarka akhrisida erayada fudud." },
    { id: "ar-b-3", title: "Greetings & Common Phrases", titleAr: "التحيات والعبارات الشائعة", titleSo: "Salaamaha & Ereyada Guud", duration: "15 min", isLocked: false, hasQuiz: true, content: "مرحبا (Marhaba = Hello), السلام عليكم (Assalamu Alaikum), كيف حالك (How are you?), بخير شكراً (Fine, thank you), ما اسمك (What is your name?), اسمي (My name is...)", contentAr: "مرحبا، السلام عليكم، كيف حالك؟ بخير شكراً، ما اسمك؟ اسمي...", contentSo: "Marhaba, Assalamu Alaikum, Sidee tahay? Waan fiicanahay, mahadsanid, Magacaa? Magacaygu waa..." },
    { id: "ar-b-4", title: "Numbers in Arabic (1–100)", titleAr: "الأرقام بالعربية (1-100)", titleSo: "Tirada Carabiga (1-100)", duration: "22 min", isLocked: true, hasQuiz: true, content: "واحد، اثنان، ثلاثة، أربعة، خمسة، ستة، سبعة، ثمانية، تسعة، عشرة. Then tens: عشرون، ثلاثون... مئة (100). Arabic numbers go right to left.", contentAr: "واحد، اثنان، ثلاثة... العشرات: عشرون، ثلاثون... مئة.", contentSo: "Kow, labo, saddex, afar, shan, lix, toddoba, siddeed, sagaal, toban. Ka dibna tobanyooyin: labaatan, soddon..." },
    { id: "ar-b-5", title: "Basic Vocabulary: Home & Family", titleAr: "مفردات أساسية: المنزل والعائلة", titleSo: "Ereybaareedka Aasaasiga: Guriga & Qoyska", duration: "20 min", isLocked: true, hasQuiz: true, content: "بيت (house), غرفة (room), مطبخ (kitchen), حمام (bathroom). العائلة: أب (father), أم (mother), أخ (brother), أخت (sister), جد (grandfather), جدة (grandmother).", contentAr: "بيت، غرفة، مطبخ، حمام. العائلة: أب، أم، أخ، أخت، جد، جدة.", contentSo: "Guriga: guri, qol, jiko, musqul. Qoyska: aabe, hooyo, walaal, awoowe, ayeeyo." },
    { id: "ar-b-6", title: "Colors & Descriptions", titleAr: "الألوان والأوصاف", titleSo: "Midabada & Qeexiddooyinka", duration: "18 min", isLocked: true, hasQuiz: true, content: "أحمر (red), أزرق (blue), أخضر (green), أصفر (yellow), أبيض (white), أسود (black). Describing: هذا كبير (this is big), هذا صغير (this is small).", contentAr: "أحمر، أزرق، أخضر، أصفر، أبيض، أسود. الوصف: هذا كبير، هذا صغير.", contentSo: "Cas, buluug, cagaar, huruud, cad, madow. Sharaxaad: Kani waa weyn yahay, kani waa yar yahay." },
    { id: "ar-b-7", title: "Days, Months & Time", titleAr: "الأيام والأشهر والوقت", titleSo: "Maalinta, Bilaha & Wakhtiga", duration: "25 min", isLocked: true, hasQuiz: true, content: "Ayam: الاثنين، الثلاثاء، الأربعاء، الخميس، الجمعة، السبت، الأحد. Shuhur: يناير، فبراير... الساعة كم؟ (What time is it?)", contentAr: "الأيام: الاثنين، الثلاثاء... الأشهر: يناير، فبراير... الساعة كم؟", contentSo: "Maalinta: Isniin, Talaado, Arbaco, Khamiis, Jimco, Sabti, Axad. Bilaha: Janaayo..." },
    { id: "ar-b-8", title: "Basic Arabic Grammar: Gender & Plural", titleAr: "قواعد عربية أساسية: الجنس والجمع", titleSo: "Naxwaha Carabiga Aasaasiga: Jinisga & Jamaca", duration: "30 min", isLocked: true, hasQuiz: true, content: "All Arabic nouns are masculine or feminine. Feminine usually ends in ة (ta marbuta). Plural forms: sound plural (add ون/ين or ات) and broken plural (internal change).", contentAr: "جميع الأسماء العربية مذكر أو مؤنث. المؤنث عادة ينتهي بـ ة. الجمع: السالم والمكسر.", contentSo: "Dhammaan magacyada Carabiga waa xaasiliis ama dheddig. Dheddiggu caadi ahaan wuxuu ku dhammaanayaa ة." },
    { id: "ar-b-9", title: "Simple Sentences & Pronouns", titleAr: "جمل بسيطة والضمائر", titleSo: "Jumlado Fudud & Abwaanadda", duration: "25 min", isLocked: true, hasQuiz: true, content: "Pronouns: أنا (I), أنت (you m), أنتِ (you f), هو (he), هي (she), نحن (we), أنتم (you pl), هم (they). Simple sentences: أنا طالب (I am a student).", contentAr: "الضمائر: أنا، أنت، أنتِ، هو، هي، نحن، أنتم، هم. جمل بسيطة: أنا طالب.", contentSo: "Abwaanadda: Aniga, Adiga (lab), Adiga (dheddig), Isaga, Iyada, Annaga, Idinka, Iyaga." },
    { id: "ar-b-10", title: "Food & Shopping Vocabulary", titleAr: "مفردات الطعام والتسوق", titleSo: "Ereybaareedka Cuntada & Xiddigta", duration: "22 min", isLocked: true, hasQuiz: true, content: "طعام (food): خبز (bread), أرز (rice), لحم (meat), سمك (fish), خضار (vegetables), فاكهة (fruit). التسوق: كم هذا؟ (How much is this?), غالي (expensive), رخيص (cheap).", contentAr: "الطعام: خبز، أرز، لحم، سمك، خضار، فاكهة. التسوق: كم هذا؟ غالي، رخيص.", contentSo: "Cuntada: rootid, bariis, hilib, kalluun, khudaar, midho. Xiddigta: Imisa kani?" },
    { id: "ar-b-11", title: "Reading Practice: Short Texts", titleAr: "تدريب على القراءة: نصوص قصيرة", titleSo: "Tababarka Akhrisida: Qoraallada Gaagaaban", duration: "30 min", isLocked: true, hasQuiz: false, content: "Read and understand simple Arabic texts about: daily life, family, home. Practice reading right to left. Identify words you have learned. Build reading confidence.", contentAr: "اقرأ وافهم نصوصاً عربية بسيطة عن: الحياة اليومية، العائلة، المنزل.", contentSo: "Akhri oo faham qoraallada Carabiga fudud ee ku saabsan: nolosha maalinlaha ah, qoyska, guriga." },
    { id: "ar-b-12", title: "Final Review & Beginner Certificate", titleAr: "المراجعة النهائية وشهادة المبتدئ", titleSo: "Dib-u-eegista Kama-dambeysta & Shahaadada Bilowga", duration: "45 min", isLocked: true, hasQuiz: true, content: "Final quiz covering all topics: alphabet, numbers, vocabulary, basic grammar, reading. Score 70%+ to earn your Arabic Beginner Certificate!", contentAr: "اختبار نهائي يغطي جميع الموضوعات. اجتز 70%+ لتحصل على شهادة مبتدئ العربية!", contentSo: "Imtixaanka kama-dambeysta ee dhamaanba mawduucyada. Hel 70%+ si aad Shahaadada Bilowga Carabiga u hesho!" },
  ],
};

const arabicIntermediate: Course = {
  id: "ar-intermediate",
  slug: "arabic-intermediate",
  title: "Intermediate Arabic",
  titleAr: "العربية المتوسطة",
  titleSo: "Carabi Dhexe",
  description: "Build on your Arabic foundation with intermediate grammar, expanded vocabulary, reading comprehension, and real conversation practice.",
  descriptionAr: "بنِ على أساسك في العربية بالقواعد المتوسطة وتوسيع المفردات وفهم المقروء وممارسة المحادثة الحقيقية.",
  descriptionSo: "Ka samayso aasaaskaaga Carabiga naxwaha dhexe, ereybaareedka ballaaran, fahamka akhrisida, iyo tababarka sheekada dhabta ah.",
  language: "arabic",
  level: "intermediate",
  price: 25,
  duration: "10 weeks",
  lessonCount: 10,
  enrolledCount: 1567,
  thumbnail: "🇸🇦",
  color: "from-teal-500 to-green-400",
  gradient: "bg-gradient-to-br from-teal-600/20 to-green-500/20",
  category: "Arabic",
  rating: 4.8,
  ratingCount: 234,
  certificate: true,
  lessons: [
    { id: "ar-i-1", title: "Arabic Verb Conjugation", titleAr: "تصريف الأفعال العربية", titleSo: "Jiifka Feeraha Carabiga", duration: "35 min", isLocked: false, hasQuiz: true, content: "Past tense (الماضي): كَتَبَ, كَتَبَتْ, كَتَبْتُ. Present tense (المضارع): يَكْتُبُ, تَكْتُبُ. Future: سَيَكْتُبُ. Conjugate common verbs: ذهب (go), أكل (eat), شرب (drink), نام (sleep).", contentAr: "الماضي: كتب، كتبت، كتبت. المضارع: يكتب، تكتب. المستقبل: سيكتب.", contentSo: "Waayihii (Maadi): Qoray, Qortay, Qoray. Hadda (Mudaari): Qoraa, Taqoraa. Mustaqbalka: Sayaqtub." },
    { id: "ar-i-2", title: "Definite & Indefinite Articles", titleAr: "المعرفة والنكرة", titleSo: "Qeexidda & Qeex-la'aanta", duration: "25 min", isLocked: false, hasQuiz: true, content: "Definite: ال (al-) prefix. الكتاب (the book) vs كتاب (a book). Sun letters cause assimilation: الشمس (ash-shams). Moon letters: القمر (al-qamar). Tanween for indefinite.", contentAr: "المعرفة: ال + اسم. كتاب (نكرة) vs الكتاب (معرفة). حروف الشمس والقمر.", contentSo: "Qeexidda: ال + magac. Buug (qeex-la'aan) vs Buugga (qeexan). Xarfaha Qorraxda iyo Dayaxa." },
    { id: "ar-i-3", title: "Sentence Structure: Verbal & Nominal", titleAr: "هيكل الجملة: الفعلية والاسمية", titleSo: "Qaab-dhismeedka Jumladda: Fiilka & Magaca", duration: "30 min", isLocked: false, hasQuiz: true, content: "Verbal sentence: Verb + Subject + Object. ذهب الطالب إلى المدرسة. Nominal sentence: Subject + Predicate. الطالب ذكي. Agreement in gender and number.", contentAr: "الجملة الفعلية: فعل + فاعل + مفعول. ذهب الطالب إلى المدرسة. الجملة الاسمية: مبتدأ + خبر.", contentSo: "Jumladda Fiilka: Feer + Faa'il + Mafuul. Ardaygu dugsi buu tegay. Jumladda Magaca: Mabda' + Khabar." },
    { id: "ar-i-4", title: "Reading Comprehension: Stories", titleAr: "فهم المقروء: القصص", titleSo: "Fahamka Akhrisida: Sheekooyin", duration: "40 min", isLocked: true, hasQuiz: true, content: "Read short Arabic stories and answer questions. Practice: identifying main characters, plot, setting. Vocabulary in context. Summarizing in your own words.", contentAr: "اقرأ قصصاً عربية قصيرة وأجب على الأسئلة. تعرف على الشخصيات الرئيسية، الحبكة، الإعداد.", contentSo: "Akhri sheekooyin Carabiga gaagaaban oo su'aalaha ka jawaab. Garto: qaraabada muhiimka, shiidaalka, goobta." },
    { id: "ar-i-5", title: "Expanded Vocabulary: 500+ Words", titleAr: "توسيع المفردات: 500+ كلمة", titleSo: "Ballaarinta Ereybaareedka: 500+ Ereyood", duration: "45 min", isLocked: true, hasQuiz: true, content: "Thematic vocabulary: Work, Education, Health, Travel, Technology, Sports. Word families in Arabic: كتب (book/write) → كاتب (writer) → مكتبة (library) → مكتب (office).", contentAr: "مفردات موضوعية: العمل، التعليم، الصحة، السفر، التكنولوجيا، الرياضة.", contentSo: "Ereybaareedka mawduuca: Shaqada, Waxbarashada, Caafimaadka, Safarka, Teknoloojiyadda, Ciyaaraha." },
    { id: "ar-i-6", title: "Speaking Practice: Daily Conversations", titleAr: "ممارسة المحادثة: المحادثات اليومية", titleSo: "Tababarka Hadlidda: Sheekooyin Maalinlaha", duration: "35 min", isLocked: true, hasQuiz: false, content: "Practice dialogues: At a café, At the airport, At a hospital, Discussing news. Learn Arabic slang and colloquial expressions. Practice with the AI conversation partner.", contentAr: "تدريب على الحوار: في المقهى، في المطار، في المستشفى، مناقشة الأخبار.", contentSo: "Tababarka wada-hadalka: Kafee, garoonka diyaaradaha, isbitaalka, falanqaynta wararka." },
    { id: "ar-i-7", title: "Writing in Arabic: Paragraphs", titleAr: "الكتابة بالعربية: الفقرات", titleSo: "Qorista Carabiga: Xigashada", duration: "40 min", isLocked: true, hasQuiz: true, content: "Write structured paragraphs in Arabic. Topic sentences, supporting ideas, conclusion. Practice: describe your day, your family, your city. Correct use of connectors: لذلك، ثم، أيضاً.", contentAr: "اكتب فقرات منظمة بالعربية. جمل الموضوع، الأفكار الداعمة، الخاتمة.", contentSo: "Qor xigashooyin nidaamsan Carabiga. Jumladaha mawduuca, fikradaha taageeraya, gunaanadka." },
    { id: "ar-i-8", title: "Listening: Arabic Media", titleAr: "الاستماع: وسائل الإعلام العربية", titleSo: "Dhegaysiga: Warbaahinta Carabiga", duration: "35 min", isLocked: true, hasQuiz: false, content: "Listen to simple Arabic news, songs, and podcasts. Different Arabic accents: Egyptian, Gulf, Levantine. Focus on understanding without reading subtitles.", contentAr: "استمع إلى أخبار عربية بسيطة وأغاني وبودكاست. لكنات عربية مختلفة: المصرية والخليجية والشامية.", contentSo: "Dhegayso wararka Carabiga fudud, heesaha, iyo podcasts-ka. Lahjadaha Carabiga kala duwan." },
    { id: "ar-i-9", title: "Arabic Grammar: Case System", titleAr: "قواعد عربية: نظام الإعراب", titleSo: "Naxwaha Carabiga: Nidaamka Doodda", duration: "45 min", isLocked: true, hasQuiz: true, content: "Three cases: Nominative (الرفع), Accusative (النصب), Genitive (الجر). How vowel endings change meaning. Fatha, Damma, Kasra at end of nouns.", contentAr: "ثلاثة حالات: الرفع، النصب، الجر. كيف تتغير نهايات الحركات المعنى.", contentSo: "Saddex xaaladood: Nominative (Rafa'), Accusative (Nasb), Genitive (Jarr). Sidee beddelka codadka kama-dambeysta u beddelo macnaha." },
    { id: "ar-i-10", title: "Final Assessment & Certificate", titleAr: "التقييم النهائي والشهادة", titleSo: "Qiimaynta Kama-dambeysta & Shahaadada", duration: "50 min", isLocked: true, hasQuiz: true, content: "Comprehensive assessment: reading comprehension, writing a paragraph, listening exercise, grammar test. Score 70%+ to earn your Intermediate Arabic Certificate!", contentAr: "تقييم شامل: فهم المقروء، كتابة فقرة، تمرين استماع، اختبار قواعد.", contentSo: "Qiimayn dhamaystiran: fahamka akhrisida, qorista xigasho, jimicsiga dhegaysiga, imtixaanka naxwaha." },
  ],
};

const arabicAdvanced: Course = {
  id: "ar-advanced",
  slug: "arabic-advanced",
  title: "Advanced Arabic Mastery",
  titleAr: "إتقان العربية المتقدمة",
  titleSo: "Carabi Heer-sare",
  description: "Achieve fluency in Modern Standard Arabic with advanced grammar, professional communication, classical texts, and sophisticated writing.",
  descriptionAr: "حقق الطلاقة في العربية الفصحى مع القواعد المتقدمة والتواصل المهني والنصوص الكلاسيكية.",
  descriptionSo: "Gaar xirfad dhab ah Carabiga Casriga ah oo leh naxwe sare, xiriirka xirfadlaha, qoraallada hore, iyo qorista heer sare.",
  language: "arabic",
  level: "advanced",
  price: 35,
  duration: "12 weeks",
  lessonCount: 10,
  enrolledCount: 892,
  thumbnail: "🇸🇦",
  color: "from-amber-500 to-orange-400",
  gradient: "bg-gradient-to-br from-amber-600/20 to-orange-500/20",
  category: "Arabic",
  rating: 4.9,
  ratingCount: 156,
  certificate: true,
  lessons: [
    { id: "ar-a-1", title: "Advanced Grammar: Root System", titleAr: "القواعد المتقدمة: نظام الجذر", titleSo: "Naxwaha Sare: Nidaamka Xiddigta", duration: "45 min", isLocked: false, hasQuiz: true, content: "Arabic root system: 3-4 consonant roots. Root ك-ت-ب (ktb): كَتَبَ (wrote), كِتَاب (book), كَاتِب (writer), مَكْتَبَة (library), مَكْتُوب (written). Recognize patterns to decode unknown words.", contentAr: "نظام الجذر العربي: جذور من 3-4 أحرف. جذر ك-ت-ب: كتب، كتاب، كاتب، مكتبة، مكتوب.", contentSo: "Nidaamka xiddigta Carabiga: xiddigooyin 3-4 xaraf. Xiddigta ك-ت-ب: Qoray, Buug, Qoraa, Maktabadda, Qoran." },
    { id: "ar-a-2", title: "Classical Arabic Literature", titleAr: "الأدب العربي الكلاسيكي", titleSo: "Suugaanta Carabiga Hore", duration: "50 min", isLocked: false, hasQuiz: true, content: "Read and analyze poetry from the Mu'allaqat. Prose from One Thousand and One Nights. Al-Quran linguistic style. Understand classical vocabulary and rhetorical devices.", contentAr: "اقرأ وحلل شعر المعلقات. نثر ألف ليلة وليلة. الأسلوب اللغوي القرآني.", contentSo: "Akhri oo falanqee gabayada Al-Mu'allaqaat. Qoraalka Alf Layla wa Layla. Qaabka luqadda Al-Quran." },
    { id: "ar-a-3", title: "Professional Arabic: Business & Media", titleAr: "العربية المهنية: الأعمال والإعلام", titleSo: "Carabiga Xirfadlaha: Ganacsiga & Warbaahinta", duration: "45 min", isLocked: false, hasQuiz: true, content: "Business Arabic: formal letters, reports, meeting language. Media Arabic: news vocabulary, reporting style, analysis. Professional email in Arabic. Contract language basics.", contentAr: "العربية التجارية: رسائل رسمية، تقارير، لغة الاجتماعات. العربية الإعلامية: مفردات الأخبار.", contentSo: "Carabiga ganacsiga: warqadaha rasmiga, warbixinta, luqadda shirkadaha. Carabiga warbaahinta: ereybaareedka wararka." },
    { id: "ar-a-4", title: "Rhetoric & Eloquence (البلاغة)", titleAr: "البلاغة والفصاحة", titleSo: "Khudbadda & Af-xumida (Balaagha)", duration: "40 min", isLocked: true, hasQuiz: true, content: "Three branches of Arabic rhetoric: بيان (bayan - clarity), معاني (ma'ani - meanings), بديع (badi' - embellishment). Simile (تشبيه), Metaphor (استعارة), Metonymy (كناية).", contentAr: "فروع البلاغة الثلاثة: البيان، المعاني، البديع. التشبيه، الاستعارة، الكناية.", contentSo: "Saddex laanood ee Balaagha Carabiga: Bayaan, Ma'aani, Badi'. Tashbiih, Isti'aara, Kinaaya." },
    { id: "ar-a-5", title: "Advanced Reading: News & Analysis", titleAr: "القراءة المتقدمة: الأخبار والتحليل", titleSo: "Akhrisida Sare: Wararka & Falanqaynta", duration: "45 min", isLocked: true, hasQuiz: true, content: "Read Al-Jazeera, BBC Arabic, Al-Ahram articles. Identify: main argument, evidence, bias, tone. Write Arabic summaries. Discuss geopolitics, economics, culture in Arabic.", contentAr: "اقرأ مقالات الجزيرة وبي بي سي عربي والأهرام. حدد: الحجة الرئيسية، الأدلة، التحيز، النبرة.", contentSo: "Akhri maqaallada Al-Jazeera, BBC Carabi, Al-Ahram. Garto: doodda muhiimka, caddaynta, xagiilka, hadalka." },
    { id: "ar-a-6", title: "Arabic Dialects Overview", titleAr: "نظرة عامة على اللهجات العربية", titleSo: "Dulmar Guud ee Lahjadaha Carabiga", duration: "40 min", isLocked: true, hasQuiz: false, content: "Major dialects: Egyptian, Gulf, Levantine, Moroccan/Maghrebi. Compare with Modern Standard Arabic. Key differences in vocabulary and grammar. When to use MSA vs dialect.", contentAr: "اللهجات الرئيسية: المصرية، الخليجية، الشامية، المغاربية. المقارنة مع الفصحى.", contentSo: "Lahjadaha weyn: Masar, Khaliij, Shaam, Marocco. Barbar Fushaa waxaad ka dheeraatay." },
    { id: "ar-a-7", title: "Advanced Writing: Essays & Reports", titleAr: "الكتابة المتقدمة: المقالات والتقارير", titleSo: "Qorista Sare: Maqaaladda & Warbixinta", duration: "55 min", isLocked: true, hasQuiz: true, content: "Write argumentative essays in Arabic. Research report structure. Use advanced connectors: علاوة على ذلك، بناءً على، في ضوء. Formal register. Avoid common writing mistakes.", contentAr: "اكتب مقالات جدلية بالعربية. هيكل التقرير البحثي. استخدم روابط متقدمة.", contentSo: "Qor maqaallo dood-joog ah Carabiga. Qaab-dhismeedka warbixinta cilmi-baarista. Isticmaal xiriiriyayaasha sare." },
    { id: "ar-a-8", title: "Islamic & Cultural Texts", titleAr: "النصوص الإسلامية والثقافية", titleSo: "Qoraallada Diinta Islaamka & Dhaqanka", duration: "45 min", isLocked: true, hasQuiz: true, content: "Quranic Arabic: understanding key verses linguistically. Hadith language. Islamic jurisprudence terminology. Arabic poetry from Umayyad and Abbasid eras.", contentAr: "اللغة القرآنية: فهم الآيات الرئيسية لغوياً. لغة الحديث. مصطلحات الفقه الإسلامي.", contentSo: "Carabiga Quraniga: fahamka luqadeed ee aayaadka muhiimka. Luqadda Xadiisyada. Ereyladda Fiqhiga." },
    { id: "ar-a-9", title: "Public Speaking in Arabic", titleAr: "الخطابة العامة بالعربية", titleSo: "Hadlidda Dadweynaha Carabiga", duration: "50 min", isLocked: true, hasQuiz: false, content: "Prepare and deliver a 5-minute Arabic speech. Techniques: rhetorical questions, repetition for emphasis, storytelling in Arabic. Proper intonation and pause in Arabic speech.", contentAr: "حضّر وقدّم خطاباً عربياً لمدة 5 دقائق. التقنيات: الأسئلة الخطابية، التكرار للتأكيد، السرد.", contentSo: "Diyaari oo bixi khudbad Carabiga ah oo 5 daqiiqo ah. Tignoolajiyada: su'aalaha hadal-jeedka, celcelinta, sheekaysiga." },
    { id: "ar-a-10", title: "Capstone: Portfolio & Advanced Certificate", titleAr: "مشروع التخرج والشهادة المتقدمة", titleSo: "Mashruuca Dhameysirka & Shahaadada Sare", duration: "60 min", isLocked: true, hasQuiz: true, content: "Submit a portfolio: 1000-word analytical essay, a recorded 5-minute speech, translation of a news article. Pass to earn Advanced Arabic Mastery Certificate!", contentAr: "قدم ملفاً: مقال تحليلي 1000 كلمة، خطاب مسجل لمدة 5 دقائق، ترجمة مقال إخباري.", contentSo: "Gudbi portfolio: maqaal falanqayn ah 1000 ereyood, hadal la duubay oo 5 daqiiqo ah, tarjumaad maqaal warka ah." },
  ],
};

export const COURSES: Course[] = [
  englishBeginner,
  englishIntermediate,
  englishAdvanced,
  arabicBeginner,
  arabicIntermediate,
  arabicAdvanced,
];

export function getCourseById(id: string): Course | undefined {
  return COURSES.find(c => c.id === id || c.slug === id);
}

export function getCoursesByLanguage(language: "english" | "arabic"): Course[] {
  return COURSES.filter(c => c.language === language);
}

export function getCoursesByLevel(level: "beginner" | "intermediate" | "advanced"): Course[] {
  return COURSES.filter(c => c.level === level);
}
