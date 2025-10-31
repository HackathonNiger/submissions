import type { Lesson } from "./types"

export const lessons: Lesson[] = [
  // Basic Math - Counting
  {
    id: "counting",
    topic: "basic",
    title: {
      english: "Counting (1-100)",
      hausa: "Ƙidaya (1-100)",
      kanuri: "Kərəwa (1-100)",
      arabic: "العد (1-100)",
    },
    description: {
      english: "Learn how to count from 1 to 100",
      hausa: "Koyi yadda ake ƙidaya daga 1 zuwa 100",
      kanuri: "Kərəwa kəmma 1 to 100",
      arabic: "تعلم العد من 1 إلى 100",
    },
    content: {
      english: "Let's start learning to count! If we have 3 oranges, we can count: one, two, three!",
      hausa: "Mu fara koyon ƙidaya! Idan muna da lemu 3, za mu iya ƙidaya: ɗaya, biyu, uku!",
      kanuri: "Kərəwa kəmma! Ləmun 3 nə, kərəwa: dəgə, fətu, yaska!",
      arabic: "لنبدأ بتعلم العد! إذا كان لدينا 3 برتقالات، يمكننا العد: واحد، اثنان، ثلاثة!",
    },
    questions: [
      {
        id: "q1",
        question: {
          english: "How many oranges do you see?",
          hausa: "Nawa lemu ake gani?",
          kanuri: "Ləmun nawa?",
          arabic: "كم عدد البرتقالات؟",
        },
        answer: "5",
        options: ["3", "5", "7", "4"],
        visual: "🍊🍊🍊🍊🍊",
      },
      {
        id: "q2",
        question: {
          english: "Count the apples: 🍎🍎🍎",
          hausa: "Ƙidaya tuffa: 🍎🍎🍎",
          kanuri: "Tuffa kərəwa: 🍎🍎🍎",
          arabic: "عد التفاح: 🍎🍎🍎",
        },
        answer: "3",
        options: ["2", "3", "4", "5"],
        visual: "🍎🍎🍎",
      },
    ],
    icon: "🔢",
  },
  // Basic Math - Addition
  {
    id: "addition",
    topic: "basic",
    title: {
      english: "Addition",
      hausa: "Ƙari",
      kanuri: "Kəmma",
      arabic: "الجمع",
    },
    description: {
      english: "Learn how to add numbers",
      hausa: "Koyi yadda ake ƙara lambobi",
      kanuri: "Kəmma lambobi",
      arabic: "تعلم كيفية جمع الأرقام",
    },
    content: {
      english: "Addition means combining numbers. Example: 2 + 3 = 5. If we have 2 oranges and add 3, we get 5!",
      hausa: "Ƙari yana nufin haɗa lambobi. Misali: 2 + 3 = 5. Idan muna da lemu 2 kuma muka ƙara 3, za mu sami 5!",
      kanuri: "Kəmma nə lambobi haɗa. Misali: 2 + 3 = 5. Ləmun 2 kəmma 3, za mu sami 5!",
      arabic: "الجمع يعني إضافة الأرقام. مثال: 2 + 3 = 5. إذا كان لدينا برتقالتان وأضفنا 3، سنحصل على 5!",
    },
    questions: [
      {
        id: "q1",
        question: {
          english: "3 + 4 = ?",
          hausa: "3 + 4 = ?",
          kanuri: "3 + 4 = ?",
          arabic: "3 + 4 = ؟",
        },
        answer: "7",
        options: ["6", "7", "8", "5"],
        visual: "🍊🍊🍊 + 🍊🍊🍊🍊",
      },
      {
        id: "q2",
        question: {
          english: "2 + 5 = ?",
          hausa: "2 + 5 = ?",
          kanuri: "2 + 5 = ?",
          arabic: "2 + 5 = ؟",
        },
        answer: "7",
        options: ["6", "7", "8", "9"],
        visual: "🍎🍎 + 🍎🍎🍎🍎🍎",
      },
    ],
    icon: "➕",
  },
  // Basic Math - Subtraction
  {
    id: "subtraction",
    topic: "basic",
    title: {
      english: "Subtraction",
      hausa: "Ragi",
      kanuri: "Ragi",
      arabic: "الطرح",
    },
    description: {
      english: "Learn how to subtract numbers",
      hausa: "Koyi yadda ake rage lambobi",
      kanuri: "Lambobi ragi koyi",
      arabic: "تعلم كيفية طرح الأرقام",
    },
    content: {
      english: "Subtraction means taking away. Example: 5 - 2 = 3. If we have 5 apples and eat 2, we have 3 left!",
      hausa: "Ragi yana nufin ɗauke wani abu. Misali: 5 - 2 = 3. Idan muna da tuffa 5 kuma muka ci 2, za mu rage da 3!",
      kanuri: "Ragi nə abu ɗauke. Misali: 5 - 2 = 3. Tuffa 5 nə, 2 ci, 3 rage!",
      arabic: "الطرح يعني أخذ شيء. مثال: 5 - 2 = 3. إذا كان لدينا 5 تفاحات وأكلنا 2، يبقى لدينا 3!",
    },
    questions: [
      {
        id: "q1",
        question: {
          english: "7 - 3 = ?",
          hausa: "7 - 3 = ?",
          kanuri: "7 - 3 = ?",
          arabic: "7 - 3 = ؟",
        },
        answer: "4",
        options: ["3", "4", "5", "6"],
        visual: "🍊🍊🍊🍊🍊🍊🍊 ❌🍊🍊🍊",
      },
    ],
    icon: "➖",
  },
  // Basic Math - Multiplication
  {
    id: "multiplication",
    topic: "basic",
    title: {
      english: "Multiplication",
      hausa: "Ninkawa",
      kanuri: "Ninkawa",
      arabic: "الضرب",
    },
    description: {
      english: "Learn how to multiply numbers",
      hausa: "Koyi yadda ake ninka lambobi",
      kanuri: "Lambobi ninka koyi",
      arabic: "تعلم كيفية ضرب الأرقام",
    },
    content: {
      english: "Multiplication is repeated addition. 3 × 2 means 3 + 3 = 6. It's like having 3 groups of 2 things each!",
      hausa: "Ninkawa shine ƙari da yawa. 3 × 2 yana nufin 3 + 3 = 6. Kamar samun rukuni 3 na abu 2-2!",
      kanuri: "Ninkawa nə ƙari da yawa. 3 × 2 nə 3 + 3 = 6. Rukuni 3 abu 2-2 kamar!",
      arabic: "الضرب هو جمع متكرر. 3 × 2 يعني 3 + 3 = 6. مثل وجود 3 مجموعات من شيئين لكل منها!",
    },
    questions: [
      {
        id: "q1",
        question: {
          english: "2 × 3 = ?",
          hausa: "2 × 3 = ?",
          kanuri: "2 × 3 = ?",
          arabic: "2 × 3 = ؟",
        },
        answer: "6",
        options: ["5", "6", "7", "8"],
        visual: "🍎🍎 🍎🍎 🍎🍎",
      },
    ],
    icon: "✖️",
  },
  // Basic Math - Division
  {
    id: "division",
    topic: "basic",
    title: {
      english: "Division",
      hausa: "Raba",
      kanuri: "Raba",
      arabic: "القسمة",
    },
    description: {
      english: "Learn how to divide numbers",
      hausa: "Koyi yadda ake raba lambobi",
      kanuri: "Lambobi raba koyi",
      arabic: "تعلم كيفية قسمة الأرقام",
    },
    content: {
      english: "Division means sharing equally. 6 ÷ 2 = 3. If we have 6 apples and share them between 2 people, each gets 3!",
      hausa: "Raba yana nufin rarraba daidai. 6 ÷ 2 = 3. Idan muna da tuffa 6 kuma muka raba tsakanin mutane 2, kowa ya sami 3!",
      kanuri: "Raba nə daidai rarraba. 6 ÷ 2 = 3. Tuffa 6 nə, mutane 2 tsakanin raba, kowa 3 sami!",
      arabic: "القسمة تعني المشاركة بالتساوي. 6 ÷ 2 = 3. إذا كان لدينا 6 تفاحات وقسمناها بين شخصين، يحصل كل منهما على 3!",
    },
    questions: [
      {
        id: "q1",
        question: {
          english: "8 ÷ 2 = ?",
          hausa: "8 ÷ 2 = ?",
          kanuri: "8 ÷ 2 = ?",
          arabic: "8 ÷ 2 = ؟",
        },
        answer: "4",
        options: ["3", "4", "5", "6"],
        visual: "🍊🍊🍊🍊 | 🍊🍊🍊🍊",
      },
    ],
    icon: "➗",
  },

  // Basic Math - Comparing Numbers
  {
    id: "comparing-numbers",
    topic: "basic",
    title: {
      english: "Comparing Numbers (Greater Than, Less Than)",
      hausa: "Kwatanta Lambobi (Girman, Ƙarami)",
      kanuri: "Lambobi Kwatanta (Girman, Ƙarami)",
      arabic: "مقارنة الأرقام (أكبر من، أصغر من)",
    },
    description: {
      english: "Learn to compare numbers using greater than (>) and less than (<)",
      hausa: "Koyi yadda ake kwatanta lambobi ta amfani da girma (>) da ƙarami (<)",
      kanuri: "Lambobi kwatanta girma (>) da ƙarami (<) koyi",
      arabic: "تعلم مقارنة الأرقام باستخدام أكبر من (>) وأصغر من (<)",
    },
    content: {
      english: "We can compare numbers to see which is bigger! 5 > 3 means 5 is greater than 3. 2 < 7 means 2 is less than 7. Imagine a hungry alligator always wanting to eat the bigger number!",
      hausa: "Za mu iya kwatanta lambobi don ganin wanne ne ya fi girma! 5 > 3 yana nufin 5 ya fi 3. 2 < 7 yana nufin 2 ya fi ƙarami daga 7. Ka yi tunanin kada mai yunwa koyaushe yana son cin babban lamba!",
      kanuri: "Lambobi kwatanta girman wane! 5 > 3 nə 5 girma 3. 2 < 7 nə 2 ƙarami 7. Kada mai yunwa babban lamba cin so kamar!",
      arabic: "يمكننا مقارنة الأرقام لمعرفة أيها أكبر! 5 > 3 يعني 5 أكبر من 3. 2 < 7 يعني 2 أصغر من 7. تخيل تمساحًا جائعًا يريد دائمًا أن يأكل الرقم الأكبر!",
    },
    questions: [
      {
        id: "q1",
        question: {
          english: "Which symbol makes this true: 8 ? 6",
          hausa: "Wane alama ce ke sa wannan gaskiya: 8 ? 6",
          kanuri: "Alama wane gaskiya: 8 ? 6",
          arabic: "ما الرمز الذي يجعل هذا صحيحًا: 8 ؟ 6",
        },
        answer: ">",
        options: ["<", ">", "=", "+"],
        visual: "8️⃣ 🐊 6️⃣",
      },
      {
        id: "q2",
        question: {
          english: "Which symbol makes this true: 4 ? 9",
          hausa: "Wane alama ce ke sa wannan gaskiya: 4 ? 9",
          kanuri: "Alama wane gaskiya: 4 ? 9",
          arabic: "ما الرمز الذي يجعل هذا صحيحًا: 4 ؟ 9",
        },
        answer: "<",
        options: [">", "<", "=", "-"],
        visual: "4️⃣ 🐊 9️⃣",
      },
    ],
    icon: "↔️",
  },
  // Basic Math - Even and Odd Numbers
  {
    id: "even-odd",
    topic: "basic",
    title: {
      english: "Even and Odd Numbers",
      hausa: "Lambobi Masu Tarayya da Marasa Tarayya",
      kanuri: "Lambobi Masu Tarayya da Marasa Tarayya",
      arabic: "الأعداد الزوجية والفردية",
    },
    description: {
      english: "Learn to identify even and odd numbers",
      hausa: "Koyi yadda ake gano lambobi masu tarayya da marasa tarayya",
      kanuri: "Lambobi masu tarayya da marasa tarayya gano koyi",
      arabic: "تعلم تحديد الأعداد الزوجية والفردية",
    },
    content: {
      english: "Even numbers can be shared equally between two people (like 2, 4, 6...). Odd numbers always have one left over when shared by two (like 1, 3, 5...).",
      hausa: "Lambobi masu tarayya za a iya raba su daidai tsakanin mutane biyu (kamar 2, 4, 6...). Lambobi marasa tarayya koyaushe suna da ɗaya da ya rage idan aka raba su biyu (kamar 1, 3, 5...).",
      kanuri: "Lambobi masu tarayya mutane biyu daidai raba (2, 4, 6...). Lambobi marasa tarayya ɗaya rage idan biyu raba (1, 3, 5...).",
      arabic: "الأعداد الزوجية يمكن تقسيمها بالتساوي بين شخصين (مثل 2، 4، 6...). الأعداد الفردية دائمًا ما يتبقى منها واحد عند تقسيمها على اثنين (مثل 1، 3، 5...).",
    },
    questions: [
      {
        id: "q1",
        question: {
          english: "Which of these is an even number?",
          hausa: "Wanne daga cikin waɗannan lamba ce mai tarayya?",
          kanuri: "Wanne daga waɗannan lamba ce mai tarayya?",
          arabic: "أي من هذه الأعداد هو عدد زوجي؟",
        },
        answer: "8",
        options: ["3", "7", "8", "11"],
        visual: "2️⃣ 4️⃣ 6️⃣ 8️⃣",
      },
      {
        id: "q2",
        question: {
          english: "Which of these is an odd number?",
          hausa: "Wanne daga cikin waɗannan lamba ce mara tarayya?",
          kanuri: "Wanne daga waɗannan lamba ce mara tarayya?",
          arabic: "أي من هذه الأعداد هو عدد فردي؟",
        },
        answer: "9",
        options: ["2", "4", "6", "9"],
        visual: "1️⃣ 3️⃣ 5️⃣ 7️⃣ 9️⃣",
      },
    ],
    icon: "☯️",
  },
  // Basic Math - Money
  {
    id: "money",
    topic: "basic",
    title: {
      english: "Money (Counting & Simple Transactions)",
      hausa: "Kuɗi (Ƙidaya da Mu'amaloli Masu Sauƙi)",
      kanuri: "Kuɗi (Kərəwa da Mu'amaloli Masu Sauƙi)",
      arabic: "المال (العد والمعاملات البسيطة)",
    },
    description: {
      english: "Learn to count money and make simple purchases",
      hausa: "Koyi yadda ake ƙidaya kuɗi da yin siyayya masu sauƙi",
      kanuri: "Kuɗi kərəwa da siyayya masu sauƙi koyi",
      arabic: "تعلم عد النقود وإجراء عمليات شراء بسيطة",
    },
    content: {
      english: "Money helps us buy things! If you have two ₦50 notes, you have ₦100. If an apple costs ₦30 and you pay with ₦50, you get ₦20 change.",
      hausa: "Kuɗi yana taimaka mana mu sayi abubuwa! Idan kana da takardun ₦50 guda biyu, kana da ₦100. Idan tuffa tana ₦30 kuma ka biya da ₦50, za ka sami canji ₦20.",
      kanuri: "Kuɗi abubuwa sayi taimaka! Takardun ₦50 biyu, ₦100. Tuffa ₦30, ₦50 biya, canji ₦20 sami.",
      arabic: "المال يساعدنا على شراء الأشياء! إذا كان لديك ورقتان من فئة 50 ₦، فلديك 100 ₦. إذا كانت التفاحة تكلف 30 ₦ ودفعت 50 ₦، فستحصل على 20 ₦ كباقي.",
    },
    questions: [
      {
        id: "q1",
        question: {
          english: "You have ₦100. A toy costs ₦70. How much change will you get?",
          hausa: "Kina da ₦100. Abin wasa yana ₦70. Nawa canji za ki samu?",
          kanuri: "₦100. Abin wasa ₦70. Canji nawa sami?",
          arabic: "لديك 100 ₦. لعبة تكلف 70 ₦. كم ستحصل على الباقي؟",
        },
        answer: "30",
        options: ["20", "30", "40", "50"],
        visual: "💸 100 - 70 = ?",
      },
    ],
    icon: "💰",
  },

  // Basic Math - Shapes
  {
    id: "shapes",
    topic: "basic",
    title: {
      english: "Shapes & Patterns",
      hausa: "Siffofi da Tsari",
      kanuri: "Siffofi da Tsari",
      arabic: "الأشكال والأنماط",
    },
    description: {
      english: "Learn about different shapes and patterns",
      hausa: "Koyi game da siffofi da tsari daban-daban",
      kanuri: "Siffofi da tsari daban-daban koyi",
      arabic: "تعلم عن الأشكال والأنماط المختلفة",
    },
    content: {
      english: "Shapes are everywhere! A circle is round like the sun ☀️, a square has 4 equal sides like a window, and a triangle has 3 sides like a mountain!",
      hausa: "Siffofi suna ko'ina! Da'ira tana zagaye kamar rana ☀️, murabba'i yana da gefuna 4 daidai kamar taga, kuma triangle yana da gefuna 3 kamar dutse!",
      kanuri: "Siffofi ko'ina suna! Da'ira zagaye rana kamar ☀️, murabba'i gefuna 4 daidai taga kamar, triangle gefuna 3 dutse kamar!",
      arabic: "الأشكال في كل مكان! الدائرة مستديرة مثل الشمس ☀️، والمربع له 4 جوانب متساوية مثل النافذة، والمثلث له 3 جوانب مثل الجبل!",
    },
    questions: [
      {
        id: "q1",
        question: {
          english: "How many sides does a triangle have?",
          hausa: "Nawa gefuna triangle yake da su?",
          kanuri: "Triangle gefuna nawa?",
          arabic: "كم عدد أضلاع المثلث؟",
        },
        answer: "3",
        options: ["2", "3", "4", "5"],
        visual: "🔺",
      },
    ],
    icon: "🔷",
  },
  // Basic Math - Fractions
  {
    id: "fractions",
    topic: "basic",
    title: {
      english: "Fractions",
      hausa: "Kashi-kashi",
      kanuri: "Kashi-kashi",
      arabic: "الكسور",
    },
    description: {
      english: "Learn about parts of a whole",
      hausa: "Koyi game da sassan abu guda",
      kanuri: "Abu guda sassan koyi",
      arabic: "تعلم عن أجزاء الكل",
    },
    content: {
      english: "A fraction shows part of something. 1/2 means half - like cutting a pizza into 2 equal pieces and taking 1 piece!",
      hausa: "Kashi yana nuna wani bangare na abu. 1/2 yana nufin rabi - kamar yanke pizza zuwa guda 2 daidai sannan ka ɗauki guda 1!",
      kanuri: "Kashi abu bangare nuna. 1/2 rabi nə - pizza guda 2 daidai yanke, guda 1 ɗauki kamar!",
      arabic: "الكسر يُظهر جزءًا من شيء. 1/2 يعني النصف - مثل تقطيع البيتزا إلى قطعتين متساويتين وأخذ قطعة واحدة!",
    },
    questions: [
      {
        id: "q1",
        question: {
          english: "What is half of 4?",
          hausa: "Menene rabin 4?",
          kanuri: "4 rabin menene?",
          arabic: "ما هو نصف 4؟",
        },
        answer: "2",
        options: ["1", "2", "3", "4"],
        visual: "🍕🍕 | 🍕🍕",
      },
    ],
    icon: "🍰",
  },
  // Intermediate Math - Place Value & Decimals
  {
    id: "place-value",
    topic: "intermediate",
    title: {
      english: "Place Value & Decimals",
      hausa: "Darajar Wuri da Decimals",
      kanuri: "Darajar Wuri da Decimals",
      arabic: "القيمة المكانية والعشريات",
    },
    description: {
      english: "Learn about place value and decimal numbers",
      hausa: "Koyi game da darajar wuri da lambobin decimal",
      kanuri: "Darajar wuri da lambobin decimal koyi",
      arabic: "تعلم عن القيمة المكانية والأرقام العشرية",
    },
    content: {
      english: "In the number 123, the 1 is in the hundreds place, 2 is in the tens place, and 3 is in the ones place. Decimals like 1.5 mean 1 whole and 5 tenths!",
      hausa: "A lambar 123, 1 yana a wurin ɗaruruwa, 2 yana a wurin goma-goma, 3 kuma yana a wurin ɗaya-ɗaya. Decimals kamar 1.5 yana nufin cikakke 1 da kashi 5 na goma!",
      kanuri: "Lambar 123, 1 ɗaruruwa wuri, 2 goma-goma wuri, 3 ɗaya-ɗaya wuri. Decimals 1.5 kamar cikakke 1 da kashi 5 na goma!",
      arabic: "في الرقم 123، الرقم 1 في خانة المئات، و2 في خانة العشرات، و3 في خانة الآحاد. الأرقام العشرية مثل 1.5 تعني 1 كامل و5 أعشار!",
    },
    questions: [
      {
        id: "q1",
        question: {
          english: "In the number 456, what digit is in the tens place?",
          hausa: "A lambar 456, wane lamba ne ke wurin goma-goma?",
          kanuri: "Lambar 456, goma-goma wuri lamba wane?",
          arabic: "في الرقم 456، ما الرقم الموجود في خانة العشرات؟",
        },
        answer: "5",
        options: ["4", "5", "6", "456"],
        visual: "4️⃣5️⃣6️⃣",
      },
    ],
    icon: "🔢",
  },
  // Intermediate Math - Percentages
  {
    id: "percentages",
    topic: "intermediate",
    title: {
      english: "Percentages",
      hausa: "Kashi Ɗari",
      kanuri: "Kashi Dari",
      arabic: "النسب المئوية",
    },
    description: {
      english: "Learn about percentages",
      hausa: "Koyi game da kashi ɗari",
      kanuri: "Kashi dari koyi",
      arabic: "تعلم عن النسب المئوية",
    },
    content: {
      english: "Percentage shows a part of 100. Example: 50% means half of something. If you have 100 candies and eat 25%, you ate 25 candies!",
      hausa: "Kashi ɗari yana nuna kashi na 100. Misali: 50% yana nufin rabin abu. Idan kana da alewa 100 kuma ka ci 25%, ka ci alewa 25!",
      kanuri: "Kashi dari nə 100 kashi. Misali: 50% rabin abu nə. Alewa 100 nə, 25% ci, alewa 25 ci!",
      arabic: "النسبة المئوية تظهر جزءًا من 100. مثال: 50٪ تعني نصف الشيء. إذا كان لديك 100 حلوى وأكلت 25٪، فقد أكلت 25 حلوى!",
    },
    questions: [
      {
        id: "q1",
        question: {
          english: "What is 50% of 10?",
          hausa: "Menene 50% na 10?",
          kanuri: "50% na 10 menene?",
          arabic: "ما هو 50٪ من 10؟",
        },
        answer: "5",
        options: ["3", "5", "7", "10"],
        visual: "🍭🍭🍭🍭🍭 | 🍭🍭🍭🍭🍭",
      },
    ],
    icon: "📊",
  },
  // Intermediate Math - Time
  {
    id: "time",
    topic: "intermediate",
    title: {
      english: "Time (Prayer Times & Daily Life)",
      hausa: "Lokaci (Lokutan Salla da Rayuwar Yau da Kullum)",
      kanuri: "Lokaci (Salla Lokutan da Rayuwar Yau da Kullum)",
      arabic: "الوقت (أوقات الصلاة والحياة اليومية)",
    },
    description: {
      english: "Learn about time using prayer times and daily activities",
      hausa: "Koyi game da lokaci ta amfani da lokutan salla da ayyukan yau da kullum",
      kanuri: "Lokaci koyi salla lokutan da ayyukan yau da kullum",
      arabic: "تعلم عن الوقت باستخدام أوقات الصلاة والأنشطة اليومية",
    },
    content: {
      english: "Time helps us organize our day! Fajr prayer is at dawn, Dhuhr at midday, Asr in afternoon, Maghrib at sunset, and Isha at night. A clock has 12 hours, and 60 minutes make 1 hour!",
      hausa: "Lokaci yana taimaka mana mu shirya ranarmu! Sallar Subh tana da safe, Zuhr da tsakar rana, Asir da yamma, Maghrib da faɗuwar rana, Isha kuma da dare. Agogo yana da sa'o'i 12, kuma mintuna 60 suna yin sa'a 1!",
      kanuri: "Lokaci ranarmu shirya taimaka! Subh salla safe, Zuhr tsakar rana, Asir yamma, Maghrib faɗuwar rana, Isha dare. Agogo sa'o'i 12, mintuna 60 sa'a 1!",
      arabic: "الوقت يساعدنا في تنظيم يومنا! صلاة الفجر عند الفجر، والظهر في منتصف النهار، والعصر بعد الظهر، والمغرب عند الغروب، والعشاء في الليل. الساعة بها 12 ساعة، و60 دقيقة تصنع ساعة واحدة!",
    },
    questions: [
      {
        id: "q1",
        question: {
          english: "How many minutes are in 1 hour?",
          hausa: "Mintuna nawa ne ke cikin sa'a 1?",
          kanuri: "Sa'a 1 mintuna nawa?",
          arabic: "كم دقيقة في الساعة الواحدة؟",
        },
        answer: "60",
        options: ["30", "60", "90", "120"],
        visual: "🕐",
      },
    ],
    icon: "🕐",
  },
  // Intermediate Math - Measurement
  {
    id: "measurement",
    topic: "intermediate",
    title: {
      english: "Measurement (Length, Weight, Volume)",
      hausa: "Auna (Tsawo, Nauyi, Girma)",
      kanuri: "Auna (Tsawo, Nauyi, Girma)",
      arabic: "القياس (الطول، الوزن، الحجم)",
    },
    description: {
      english: "Learn about measuring length, weight, and volume",
      hausa: "Koyi game da auna tsawo, nauyi, da girma",
      kanuri: "Tsawo, nauyi, girma auna koyi",
      arabic: "تعلم عن قياس الطول والوزن والحجم",
    },
    content: {
      english: "We measure many things! Length in meters (how tall you are), weight in kilograms (how heavy something is), and volume in liters (how much water fits in a bottle)!",
      hausa: "Muna auna abubuwa da yawa! Tsawo da mita (yadda kake da tsawo), nauyi da kilograms (yadda abu yake da nauyi), girma kuma da lita (ruwa nawa ya iya shiga kwalba)!",
      kanuri: "Abubuwa da yawa auna! Tsawo mita (tsawo nawa), nauyi kilograms (nauyi nawa), girma lita (ruwa nawa kwalba shiga)!",
      arabic: "نقيس أشياء كثيرة! الطول بالأمتار (كم طولك)، والوزن بالكيلوغرامات (كم يزن الشيء)، والحجم باللترات (كم من الماء يمكن أن يتسع في زجاجة)!",
    },
    questions: [
      {
        id: "q1",
        question: {
          english: "What do we use to measure length?",
          hausa: "Me muke amfani da shi don auna tsawo?",
          kanuri: "Tsawo auna me amfani?",
          arabic: "ماذا نستخدم لقياس الطول؟",
        },
        answer: "Meters",
        options: ["Meters", "Liters", "Kilograms", "Hours"],
        visual: "📏",
      },
    ],
    icon: "📏",
  },

  // Intermediate Math - Averages
  {
    id: "averages",
    topic: "intermediate",
    title: {
      english: "Averages (Mean)",
      hausa: "Matsakaici (Ma'ana)",
      kanuri: "Matsakaici (Ma'ana)",
      arabic: "المتوسطات (الوسط الحسابي)",
    },
    description: {
      english: "Learn to find the average of a set of numbers",
      hausa: "Koyi yadda ake samun matsakaici na jerin lambobi",
      kanuri: "Jerin lambobi matsakaici sami koyi",
      arabic: "تعلم إيجاد متوسط مجموعة من الأرقام",
    },
    content: {
      english: "The average (or mean) is like finding the 'middle' number! To find the average of 2, 4, and 6, you add them (2+4+6=12) and divide by how many numbers there are (12/3=4). So the average is 4!",
      hausa: "Matsakaici (ko ma'ana) kamar gano lambar 'tsakiya' ne! Don nemo matsakaici na 2, 4, da 6, za ku haɗa su (2+4+6=12) kuma ku raba da adadin lambobin da ke akwai (12/3=4). Don haka matsakaicin shine 4!",
      kanuri: "Matsakaici (ko ma'ana) lambar 'tsakiya' gano! 2, 4, 6 matsakaici nemo, haɗa (2+4+6=12) da adadin lambobi raba (12/3=4). Matsakaici 4!",
      arabic: "المتوسط (أو الوسط الحسابي) يشبه إيجاد الرقم 'الأوسط'! لإيجاد متوسط 2، 4، و6، تقوم بجمعها (2+4+6=12) وتقسم على عدد الأرقام (12/3=4). إذن المتوسط هو 4!",
    },
    questions: [
      {
        id: "q1",
        question: {
          english: "What is the average of 1, 2, and 3?",
          hausa: "Menene matsakaicin 1, 2, da 3?",
          kanuri: "1, 2, 3 matsakaicin menene?",
          arabic: "ما هو متوسط 1، 2، و3؟",
        },
        answer: "2",
        options: ["1", "2", "3", "6"],
        visual: " (1+2+3) / 3 = ?",
      },
    ],
    icon: "📈",
  },
  // Intermediate Math - Geometry (Area & Perimeter)
  {
    id: "geometry",
    topic: "intermediate",
    title: {
      english: "Geometry (Area & Perimeter)",
      hausa: "Lissafin Geometri (Fadi & Kewaye)",
      kanuri: "Lissafin Geometri (Fadi & Kewaye)",
      arabic: "الهندسة (المساحة والمحيط)",
    },
    description: {
      english: "Learn about area and perimeter of basic shapes",
      hausa: "Koyi game da fadi da kewaye na siffofi na asali",
      kanuri: "Fadi da kewaye siffofi na asali koyi",
      arabic: "تعلم عن المساحة والمحيط للأشكال الأساسية",
    },
    content: {
      english: "Perimeter is the distance around a shape, like walking around a square! Area is the space inside a shape, like how much grass is in a field. For a square with side 2, perimeter is 2+2+2+2=8, and area is 2x2=4!",
      hausa: "Kewaye shine nisan da ke kewaye da siffa, kamar tafiya a kewayen murabba'i! Fadi shine sararin da ke cikin siffa, kamar ciyawa nawa ce a fili. Ga murabba'i mai gefe 2, kewaye shine 2+2+2+2=8, kuma fadi shine 2x2=4!",
      kanuri: "Kewaye nisan siffa kewaye, murabba'i kewaye tafiya kamar! Fadi sararin siffa ciki, ciyawa nawa fili. Murabba'i gefe 2, kewaye 2+2+2+2=8, fadi 2x2=4!",
      arabic: "المحيط هو المسافة حول الشكل، مثل المشي حول مربع! المساحة هي الفراغ داخل الشكل، مثل كمية العشب في حقل. بالنسبة لمربع ضلعه 2، المحيط هو 2+2+2+2=8، والمساحة هي 2x2=4!",
    },
    questions: [
      {
        id: "q1",
        question: {
          english: "What is the perimeter of a square with sides of length 3?",
          hausa: "Menene kewaye na murabba'i mai gefe 3?",
          kanuri: "Murabba'i gefe 3 kewaye menene?",
          arabic: "ما هو محيط مربع أضلاعه 3؟",
        },
        answer: "12",
        options: ["3", "6", "9", "12"],
        visual: "🖼️ (Side 3)",
      },
    ],
    icon: "📐",
  },
  // Intermediate Math - Data & Graphs
  {
    id: "data-graphs",
    topic: "intermediate",
    title: {
      english: "Data & Graphs (Bar Charts)",
      hausa: "Bayanai da Zane-zane (Zane-zanen Bar)",
      kanuri: "Bayanai da Zane-zane (Zane-zanen Bar)",
      arabic: "البيانات والرسوم البيانية (الرسوم البيانية الشريطية)",
    },
    description: {
      english: "Learn to read and understand simple bar charts",
      hausa: "Koyi yadda ake karantawa da fahimtar zane-zanen bar masu sauƙi",
      kanuri: "Zane-zanen bar masu sauƙi karantawa da fahimtar koyi",
      arabic: "تعلم قراءة وفهم الرسوم البيانية الشريطية البسيطة",
    },
    content: {
      english: "Graphs help us see data clearly! A bar chart uses bars of different heights to show amounts. If you have a chart of favorite fruits, taller bars mean more people like that fruit!",
      hausa: "Zane-zane suna taimaka mana mu ga bayanai a sarari! Zane-zanen bar yana amfani da sanduna masu tsayi daban-daban don nuna adadi. Idan kana da zane na 'ya'yan itatuwa da aka fi so, sanduna masu tsayi suna nufin mutane da yawa suna son wannan 'ya'yan itacen!",
      kanuri: "Zane-zane bayanai sarari ga taimaka! Zane-zanen bar sanduna tsayi daban-daban adadi nuna. 'Ya'yan itatuwa fi so zane, sanduna masu tsayi mutane da yawa 'ya'yan itacen so!",
      arabic: "الرسوم البيانية تساعدنا على رؤية البيانات بوضوح! يستخدم الرسم البياني الشريطي أشرطة ذات ارتفاعات مختلفة لإظهار الكميات. إذا كان لديك رسم بياني للفواكه المفضلة، فإن الأشرطة الأطول تعني أن المزيد من الناس يحبون تلك الفاكهة!",
    },
    questions: [
      {
        id: "q1",
        question: {
          english: "In a bar chart, if 'Apples' has a bar twice as tall as 'Bananas', what does that mean?",
          hausa: "A zane-zanen bar, idan 'Tuffa' yana da sandar da ta ninka tsayin 'Ayaba' sau biyu, menene hakan yake nufi?",
          kanuri: "Zane-zanen bar, 'Tuffa' sandar tsayin 'Ayaba' sau biyu, menene nufi?",
          arabic: "في الرسم البياني الشريطي، إذا كان شريط 'التفاح' ضعف طول شريط 'الموز'، فماذا يعني ذلك؟",
        },
        answer: "Twice as many people like Apples",
        options: [
          "Apples are twice as expensive",
          "Twice as many people like Apples",
          "Apples are healthier",
          "Bananas are older",
        ],
        visual: "📊 (Example bar chart)",
      },
    ],
    icon: "📊",
  },

  // Intermediate Math - Word Problems
  {
    id: "word-problems",
    topic: "intermediate",
    title: {
      english: "Word Problems",
      hausa: "Matsalolin Kalmomi",
      kanuri: "Matsalolin Kalmomi",
      arabic: "مسائل كلامية",
    },
    description: {
      english: "Solve real-life math problems using words",
      hausa: "Warware matsalolin lissafi na ainihi ta amfani da kalmomi",
      kanuri: "Ainihi lissafi matsaloli kalmomi amfani warware",
      arabic: "حل مسائل الرياضيات الحقيقية باستخدام الكلمات",
    },
    content: {
      english: "Word problems tell a story with math! Example: 'Ahmed has 5 mangoes. His sister gives him 3 more. How many mangoes does Ahmed have now?' Answer: 5 + 3 = 8 mangoes!",
      hausa: "Matsalolin kalmomi suna ba da labari tare da lissafi! Misali: 'Ahmed yana da mangwaro 5. 'Yar uwarsa ta ba shi 3 ƙari. Mangwaro nawa Ahmed yake da su yanzu?' Amsa: 5 + 3 = 8 mangwaro!",
      kanuri: "Matsalolin kalmomi labari lissafi! Misali: 'Ahmed mangwaro 5. 'Yar uwarsa 3 ƙari ba. Ahmed mangwaro nawa yanzu?' Amsa: 5 + 3 = 8 mangwaro!",
      arabic: "المسائل الكلامية تحكي قصة بالرياضيات! مثال: 'أحمد لديه 5 مانجو. أخته أعطته 3 أخرى. كم مانجو لدى أحمد الآن؟' الجواب: 5 + 3 = 8 مانجو!",
    },
    questions: [
      {
        id: "q1",
        question: {
          english: "Fatima has 8 books. She gives 2 to her friend. How many books does she have left?",
          hausa: "Fatima tana da littattafai 8. Ta ba abokiyarta 2. Littattafai nawa suka rage mata?",
          kanuri: "Fatima littattafai 8. Abokiyarta 2 ba. Littattafai nawa rage?",
          arabic: "فاطمة لديها 8 كتب. أعطت صديقتها 2. كم كتابًا تبقى لديها؟",
        },
        answer: "6",
        options: ["5", "6", "7", "10"],
        visual: "📚📚📚📚📚📚📚📚 ➡️ 📚📚",
      },
    ],
    icon: "📝",
  },
  // Algebra - Variables
  {
    id: "variables",
    topic: "algebra",
    title: {
      english: "Understanding Variables (x, y)",
      hausa: "Fahimtar Masu Canzawa (x, y)",
      kanuri: "Masu Canzawa (x, y)",
      arabic: "فهم المتغيرات (x، y)",
    },
    description: {
      english: "Learn about letters that represent numbers",
      hausa: "Koyi game da haruffa waɗanda ke wakiltar lambobi",
      kanuri: "Haruffa lambobi wakiltar",
      arabic: "تعلم عن الحروف التي تمثل الأرقام",
    },
    content: {
      english: "In algebra, we use letters like x and y to represent numbers we don't know. Example: x + 2 = 5, so x = 3. Think of x as a mystery box that holds a number!",
      hausa: "A algebra, muna amfani da haruffa kamar x da y don wakiltar lambobi da ba mu sani ba. Misali: x + 2 = 5, to x = 3. Ka ɗauki x kamar akwatin sirri da ke ɗauke da lamba!",
      kanuri: "Algebra, haruffa kamar x da y lambobi wakiltar. Misali: x + 2 = 5, x = 3. x akwatin sirri lamba ɗauke kamar!",
      arabic: "في الجبر، نستخدم حروفًا مثل x و y لتمثيل الأرقام التي لا نعرفها. مثال: x + 2 = 5، إذن x = 3. فكر في x كصندوق سري يحتوي على رقم!",
    },
    questions: [
      {
        id: "q1",
        question: {
          english: "If x + 3 = 7, what is x?",
          hausa: "Idan x + 3 = 7, menene x?",
          kanuri: "x + 3 = 7, x menene?",
          arabic: "إذا كان x + 3 = 7، ما هو x؟",
        },
        answer: "4",
        options: ["3", "4", "5", "10"],
        visual: "❓ + 3 = 7",
      },
      {
        id: "q2",
        question: {
          english: "If y - 2 = 5, what is y?",
          hausa: "Idan y - 2 = 5, menene y?",
          kanuri: "y - 2 = 5, y menene?",
          arabic: "إذا كان y - 2 = 5، ما هو y؟",
        },
        answer: "7",
        options: ["3", "5", "7", "10"],
        visual: "❓ - 2 = 5",
      },
    ],
    icon: "🔤",
  },
  // Algebra - Simple Equations
  {
    id: "simple-equations",
    topic: "algebra",
    title: {
      english: "Simple Equations (x + 2 = 5)",
      hausa: "Ma'auni Masu Sauki (x + 2 = 5)",
      kanuri: "Ma'auni Masu Sauki (x + 2 = 5)",
      arabic: "معادلات بسيطة (x + 2 = 5)",
    },
    description: {
      english: "Learn to solve simple equations",
      hausa: "Koyi yadda ake warware ma'auni masu sauki",
      kanuri: "Ma'auni masu sauki warware koyi",
      arabic: "تعلم حل المعادلات البسيطة",
    },
    content: {
      english: "An equation is like a balance scale - both sides must be equal! To solve x + 2 = 5, we subtract 2 from both sides: x + 2 - 2 = 5 - 2, so x = 3!",
      hausa: "Ma'auni yana kama da ma'aunin daidaita - bangarorin biyu dole su kasance daidai! Don warware x + 2 = 5, muna rage 2 daga bangarorin biyu: x + 2 - 2 = 5 - 2, to x = 3!",
      kanuri: "Ma'auni ma'aunin daidaita kamar - bangarorin biyu daidai! x + 2 = 5 warware, 2 bangarorin biyu rage: x + 2 - 2 = 5 - 2, x = 3!",
      arabic: "المعادلة مثل ميزان التوازن - يجب أن يكون الجانبان متساويين! لحل x + 2 = 5، نطرح 2 من الجانبين: x + 2 - 2 = 5 - 2، إذن x = 3!",
    },
    questions: [
      {
        id: "q1",
        question: {
          english: "Solve: x + 5 = 9",
          hausa: "Warware: x + 5 = 9",
          kanuri: "Warware: x + 5 = 9",
          arabic: "حل: x + 5 = 9",
        },
        answer: "4",
        options: ["3", "4", "5", "14"],
        visual: "⚖️ x + 5 = 9",
      },
    ],
    icon: "⚖️",
  },
  // Algebra - Balancing Equations
  {
    id: "balancing-equations",
    topic: "algebra",
    title: {
      english: "Balancing Equations (Visual Balance Scale)",
      hausa: "Daidaita Ma'auni (Ma'aunin Gani)",
      kanuri: "Ma'auni Daidaita (Ma'aunin Gani)",
      arabic: "موازنة المعادلات (ميزان بصري)",
    },
    description: {
      english: "Learn to balance equations like a scale",
      hausa: "Koyi yadda ake daidaita ma'auni kamar ma'auni",
      kanuri: "Ma'auni kamar ma'auni daidaita koyi",
      arabic: "تعلم موازنة المعادلات مثل الميزان",
    },
    content: {
      english: "Think of equations as a balance scale! If one side has x + 3 and the other has 8, they must balance. What do you put in the x box to make both sides equal? x = 5!",
      hausa: "Ka ɗauki ma'auni kamar ma'aunin daidaita! Idan gefe ɗaya yana da x + 3 ɗayan kuma yana da 8, dole su kasance daidai. Me za ka sa a akwatin x don bangarorin biyu su zama daidai? x = 5!",
      kanuri: "Ma'auni ma'aunin daidaita kamar! Gefe ɗaya x + 3, ɗayan 8, daidai kasance. x akwatin me sa bangarorin biyu daidai? x = 5!",
      arabic: "فكر في المعادلات كميزان توازن! إذا كان جانب واحد به x + 3 والآخر به 8، يجب أن يتوازنا. ماذا تضع في صندوق x لجعل الجانبين متساويين؟ x = 5!",
    },
    questions: [
      {
        id: "q1",
        question: {
          english: "Balance the scale: x + 4 = 10",
          hausa: "Daidaita ma'auni: x + 4 = 10",
          kanuri: "Ma'auni daidaita: x + 4 = 10",
          arabic: "وازن الميزان: x + 4 = 10",
        },
        answer: "6",
        options: ["4", "6", "8", "14"],
        visual: "⚖️ [❓ + 4] = [10]",
      },
    ],
    icon: "⚖️",
  },
  // Algebra - Sequences & Patterns
  {
    id: "sequences",
    topic: "algebra",
    title: {
      english: "Sequences & Patterns (2, 4, 6 ...)",
      hausa: "Jeri da Tsari (2, 4, 6 ...)",
      kanuri: "Jeri da Tsari (2, 4, 6 ...)",
      arabic: "المتتاليات والأنماط (2، 4، 6 ...)",
    },
    description: {
      english: "Learn to find patterns in number sequences",
      hausa: "Koyi yadda ake gano tsari a cikin jerin lambobi",
      kanuri: "Jerin lambobi tsari gano koyi",
      arabic: "تعلم إيجاد الأنماط في متتاليات الأرقام",
    },
    content: {
      english: "A sequence is a list of numbers that follow a pattern! In 2, 4, 6, 8... we add 2 each time. In 1, 3, 5, 7... we also add 2 but start with 1. Can you find the next number?",
      hausa: "Jeri shine jerin lambobi da ke bin tsari! A cikin 2, 4, 6, 8... muna ƙara 2 kowane lokaci. A cikin 1, 3, 5, 7... mu ma muna ƙara 2 amma muna farawa da 1. Za ka iya gano lamba ta gaba?",
      kanuri: "Jeri lambobi jerin tsari bin! 2, 4, 6, 8... 2 kowane lokaci ƙara. 1, 3, 5, 7... 2 ƙara amma 1 farawa. Lamba gaba gano?",
      arabic: "المتتالية هي قائمة من الأرقام تتبع نمطًا! في 2، 4، 6، 8... نضيف 2 في كل مرة. في 1، 3، 5، 7... نضيف أيضًا 2 لكن نبدأ بـ 1. هل يمكنك إيجاد الرقم التالي؟",
    },
    questions: [
      {
        id: "q1",
        question: {
          english: "What comes next in this pattern: 2, 4, 6, 8, ?",
          hausa: "Me ya zo na gaba a wannan tsari: 2, 4, 6, 8, ?",
          kanuri: "Tsari wannan gaba me: 2, 4, 6, 8, ?",
          arabic: "ما يأتي تاليًا في هذا النمط: 2، 4، 6، 8، ؟",
        },
        answer: "10",
        options: ["9", "10", "11", "12"],
        visual: "2️⃣ ➡️ 4️⃣ ➡️ 6️⃣ ➡️ 8️⃣ ➡️ ❓",
      },
      {
        id: "q2",
        question: {
          english: "What comes next: 1, 3, 5, 7, ?",
          hausa: "Me ya zo na gaba: 1, 3, 5, 7, ?",
          kanuri: "Gaba me: 1, 3, 5, 7, ?",
          arabic: "ما يأتي تاليًا: 1، 3، 5، 7، ؟",
        },
        answer: "9",
        options: ["8", "9", "10", "11"],
        visual: "1️⃣ ➡️ 3️⃣ ➡️ 5️⃣ ➡️ 7️⃣ ➡️ ❓",
      },
    ],
    icon: "🔢",
  },

  // Algebra - Inequalities
  {
    id: "inequalities",
    topic: "algebra",
    title: {
      english: "Inequalities (> , < , ≥ , ≤)",
      hausa: "Rashin Daidaito (> , < , ≥ , ≤)",
      kanuri: "Rashin Daidaito (> , < , ≥ , ≤)",
      arabic: "المتراجحات (> ، < ، ≥ ، ≤)",
    },
    description: {
      english: "Learn about 'not equal' relationships between numbers",
      hausa: "Koyi game da alaƙar 'ba daidai ba' tsakanin lambobi",
      kanuri: "Alaƙar 'ba daidai ba' lambobi tsakanin koyi",
      arabic: "تعلم عن علاقات 'عدم التساوي' بين الأرقام",
    },
    content: {
      english: "Sometimes numbers aren't equal! x > 5 means x can be 6, 7, 8... (anything greater than 5). x ≤ 10 means x can be 10 or less (9, 8, 7...). These are inequalities!",
      hausa: "Wani lokaci lambobi ba su daidaita ba! x > 5 yana nufin x na iya zama 6, 7, 8... (duk wani abu da ya fi 5). x ≤ 10 yana nufin x na iya zama 10 ko ƙasa (9, 8, 7...). Waɗannan rashin daidaito ne!",
      kanuri: "Lambobi ba daidaita! x > 5 nə x 6, 7, 8... (duka abin 5 fi). x ≤ 10 nə x 10 ko ƙasa (9, 8, 7...). Waɗannan rashin daidaito!",
      arabic: "أحيانًا لا تكون الأرقام متساوية! x > 5 يعني أن x يمكن أن يكون 6، 7، 8... (أي شيء أكبر من 5). x ≤ 10 يعني أن x يمكن أن يكون 10 أو أقل (9، 8، 7...). هذه هي المتراجحات!",
    },
    questions: [
      {
        id: "q1",
        question: {
          english: "If x < 4, which number can x be?",
          hausa: "Idan x < 4, wace lamba x na iya zama?",
          kanuri: "x < 4, lamba wace x?",
          arabic: "إذا كان x < 4، فما الرقم الذي يمكن أن يكون x؟",
        },
        answer: "3",
        options: ["4", "5", "3", "6"],
        visual: "⬅️ 3 < 4",
      },
    ],
    icon: "🔀",
  },
  // Algebra - Introduction to Functions (Input/Output)
  {
    id: "functions",
    topic: "algebra",
    title: {
      english: "Introduction to Functions (Input/Output)",
      hausa: "Gabatarwa ga Ayyuka (Shigarwa/Fitarwa)",
      kanuri: "Ayyuka Gabatarwa (Shigarwa/Fitarwa)",
      arabic: "مقدمة للدوال (المدخلات/المخرجات)",
    },
    description: {
      english: "Understand functions as machines that take an input and give an output",
      hausa: "Fahimtar ayyuka kamar injuna masu ɗaukar shigarwa kuma suna bayar da fitarwa",
      kanuri: "Ayyuka injuna kamar shigarwa ɗaukar fitarwa bayar fahimtar",
      arabic: "فهم الدوال كآلات تأخذ مدخلًا وتعطي مخرجًا",
    },
    content: {
      english: "A function is like a special machine! You put a number (input) in, and it does something to it and gives you a new number (output). If the machine is 'add 2', input 3 gives output 5 (3+2=5)!",
      hausa: "Aiki kamar injin musamman ne! Za ka sa lamba (shigarwa) a ciki, kuma zai yi wani abu da ita kuma ya ba ka sabon lamba (fitarwa). Idan injin shine 'ƙara 2', shigarwa 3 zai ba da fitarwa 5 (3+2=5)!",
      kanuri: "Aiki injin musamman! Lamba (shigarwa) ciki sa, abu yi sabon lamba (fitarwa) ba. Injin 'ƙara 2', shigarwa 3 fitarwa 5 (3+2=5) ba!",
      arabic: "الدالة مثل آلة خاصة! تضع رقمًا (مدخلًا) فيها، وتقوم بفعل شيء له وتعطيك رقمًا جديدًا (مخرجًا). إذا كانت الآلة 'أضف 2'، فإن إدخال 3 يعطي مخرج 5 (3+2=5)!",
    },
    questions: [
      {
        id: "q1",
        question: {
          english: "If a function is 'multiply by 3', what is the output for an input of 4?",
          hausa: "Idan aiki shine 'ninka da 3', menene fitarwa don shigarwa na 4?",
          kanuri: "Aiki 'ninka da 3', fitarwa shigarwa 4 menene?",
          arabic: "إذا كانت الدالة هي 'اضرب في 3'، فما هو المخرج لمدخل 4؟",
        },
        answer: "12",
        options: ["7", "9", "12", "16"],
        visual: "📦 (Input 4) -> ⚙️ (x3) -> 🎁 (Output ?)",
      },
    ],
    icon: "➡️",
  },
  // Algebra - Coordinate Plane (Basic)
  {
    id: "coordinate-plane",
    topic: "algebra",
    title: {
      english: "Coordinate Plane (Finding Points)",
      hausa: "Tsarin Hadewa (Nemo Maɓallai)",
      kanuri: "Tsarin Hadewa (Nemo Maɓallai)",
      arabic: "المستوى الإحداثي (إيجاد النقاط)",
    },
    description: {
      english: "Learn to locate points on a simple coordinate grid",
      hausa: "Koyi yadda ake gano maɓallai a kan grid mai sauƙi",
      kanuri: "Maɓallai grid mai sauƙi gano koyi",
      arabic: "تعلم تحديد النقاط على شبكة إحداثية بسيطة",
    },
    content: {
      english: "A coordinate plane is like a map for numbers! We use two numbers (x, y) to find a spot. The first number (x) tells you to go left or right, and the second (y) tells you to go up or down. (2, 3) means 2 right, 3 up!",
      hausa: "Tsarin hadewa kamar taswira ne na lambobi! Muna amfani da lambobi biyu (x, y) don gano wuri. Lamba ta farko (x) tana gaya maka ka je hagu ko dama, ta biyu (y) kuma tana gaya maka ka je sama ko ƙasa. (2, 3) yana nufin dama 2, sama 3!",
      kanuri: "Tsarin hadewa lambobi taswira! Lambobi biyu (x, y) wuri gano. Lamba farko (x) hagu ko dama, biyu (y) sama ko ƙasa. (2, 3) dama 2, sama 3!",
      arabic: "المستوى الإحداثي يشبه خريطة للأرقام! نستخدم رقمين (x، y) لإيجاد نقطة. الرقم الأول (x) يخبرك بالذهاب يمينًا أو يسارًا، والثاني (y) يخبرك بالذهاب للأعلى أو للأسفل. (2، 3) يعني 2 يمينًا، 3 للأعلى!",
    },
    questions: [
      {
        id: "q1",
        question: {
          english: "What are the coordinates for a point that is 1 unit right and 4 units up from the center?",
          hausa: "Menene hadewar maɓalli wanda yake 1 dama da 4 sama daga tsakiya?",
          kanuri: "Hadewar maɓalli 1 dama da 4 sama daga tsakiya menene?",
          arabic: "ما هي إحداثيات النقطة التي تبعد وحدة واحدة يمينًا و4 وحدات للأعلى من المركز؟",
        },
        answer: "(1, 4)",
        options: ["(4, 1)", "(1, 4)", "(-1, 4)", "(1, -4)"],
        visual: "📍 (1,4)",
      },
    ],
    icon: "🗺️",
  },
]