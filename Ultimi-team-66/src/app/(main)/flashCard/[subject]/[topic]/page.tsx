// "use client";

// import { useState, useEffect, useRef } from "react";
// import { useParams, useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { motion, AnimatePresence } from "framer-motion";
// import { Volume2, ChevronDown } from "lucide-react";

// // Flashcards for all subjects and topics (Nigerian curriculum, 3–5 questions per topic example)
// const flashcardsData: Record<string, Record<string, { question: string; answer: string }[]>> = {
//   mathematics: {
//     algebra: [
//       { question: "Simplify: 2x + 5x", answer: "7x" },
//       { question: "Factorize: x^2 + 5x", answer: "x(x + 5)" },
//       { question: "Solve: 2x - 3 = 7", answer: "x = 5" },
//     ],
//     trigonometry: [
//       { question: "sin^2θ + cos^2θ = ?", answer: "1" },
//       { question: "tan θ = ?", answer: "sin θ / cos θ" },
//     ],
//     statistics: [
//       { question: "Mean of 2, 4, 6?", answer: "4" },
//       { question: "Mode of 2, 2, 3, 4?", answer: "2" },
//     ],
//     // add other math topics similarly...
//   },
//   physics: {
//     mechanics: [
//       { question: "Force formula?", answer: "F = ma" },
//       { question: "Unit of mass?", answer: "kg" },
//     ],
//     electricity: [
//       { question: "Ohm's Law?", answer: "V = IR" },
//       { question: "Unit of current?", answer: "Ampere" },
//     ],
//     waves: [
//       { question: "Wave speed formula?", answer: "v = fλ" },
//       { question: "Wavelength definition?", answer: "Distance between crests or troughs" },
//     ],
//     // add other physics topics...
//   },
//   chemistry: {
//     "atomic-structure": [
//       { question: "Number of protons in oxygen?", answer: "8" },
//       { question: "Define isotope", answer: "Atoms with same protons but different neutrons" },
//     ],
//     "chemical-bonding": [
//       { question: "Ionic bond definition?", answer: "Transfer of electrons between atoms" },
//       { question: "Covalent bond definition?", answer: "Sharing of electrons" },
//     ],
//     // add other chemistry topics...
//   },
//   biology: {
//     "cell-biology": [
//       { question: "Function of mitochondria?", answer: "Produces energy (ATP)" },
//       { question: "Nucleus function?", answer: "Control center of the cell" },
//     ],
//     genetics: [
//       { question: "What is DNA?", answer: "Genetic material" },
//       { question: "What is a gene?", answer: "Segment of DNA coding for a trait" },
//     ],
//   },
//   english: {
//     grammar: [
//       { question: "What is a noun?", answer: "Person, place, or thing" },
//       { question: "What is a verb?", answer: "Action or state word" },
//     ],
//     literature: [
//       { question: "Author of Things Fall Apart?", answer: "Chinua Achebe" },
//       { question: "Define allegory", answer: "Story with symbolic meaning" },
//     ],
//   },
//   history: {
//     nigeria: [
//       { question: "Nigeria Independence date?", answer: "1st October 1960" },
//       { question: "First President?", answer: "Nnamdi Azikiwe" },
//     ],
//     world: [
//       { question: "Start of WWI?", answer: "28 July 1914" },
//       { question: "Start of WWII?", answer: "1 Sept 1939" },
//     ],
//   },
//   government: {
//     democracy: [
//       { question: "Define democracy?", answer: "Government by the people" },
//       { question: "Executive leader?", answer: "President or Governor" },
//     ],
//   },
//   economics: {
//     microeconomics: [
//       { question: "Define demand?", answer: "Quantity buyers want at a price" },
//       { question: "Define supply?", answer: "Quantity sellers offer at a price" },
//     ],
//     macroeconomics: [
//       { question: "What is GDP?", answer: "Value of goods and services in a country" },
//       { question: "Inflation?", answer: "Increase in general price level" },
//     ],
//   },
//   "christian-religious-studies-(crs)": {
//     creation: [
//       { question: "Who created the world?", answer: "God" },
//       { question: "Days of creation?", answer: "6 days" },
//     ],
//   },
//   "islamic-religious-studies-(irs)": {
//     creation: [
//       { question: "Islam's holy book?", answer: "Qur'an" },
//     ],
//   },
//   commerce: {
//     basics: [
//       { question: "Define commerce?", answer: "Buying and selling of goods and services" },
//       { question: "Define trade?", answer: "Exchange of goods for money" },
//     ],
//   },
//   accounting: {
//     basics: [
//       { question: "Assets formula?", answer: "Assets = Liabilities + Equity" },
//       { question: "Define revenue?", answer: "Income from business" },
//     ],
//   },
//   "igbo-language": {
//     grammar: [
//       { question: "Hello in Igbo?", answer: "Ndewo" },
//       { question: "Thank you in Igbo?", answer: "Daalụ" },
//     ],
//   },
//   geography: {},
//   "further-mathematics": {},
//   "technical-drawing": {},
//   "computer-science": {},
//   "data-processing": {},
//   "agricultural-science": {},
//   "civic-education": {},
//   french: {},
//   "literature-in-english": {},
// };

// export default function FlashcardsPage() {
//   const router = useRouter();
//   const { subject, topic } = useParams();
//   const [current, setCurrent] = useState(0);
//   const [flipped, setFlipped] = useState(false);
//   const [direction, setDirection] = useState(1);
//   const [autoRead, setAutoRead] = useState(false);
//   const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
//   const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [speakerActive, setSpeakerActive] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);

//   // Get flashcards for selected subject/topic
//   let flashcards = flashcardsData[subject as string]?.[topic as string] || [
//     { question: "No flashcards available.", answer: "This topic has no questions yet." },
//   ];

//   // Shuffle questions when subject or topic changes
//   useEffect(() => {
//     flashcards = flashcards.sort(() => Math.random() - 0.5);
//     setCurrent(0);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [subject, topic]);

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
//         setDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   // Load voices
//   useEffect(() => {
//     const loadVoices = () => {
//       const availableVoices = window.speechSynthesis.getVoices();
//       const zira = availableVoices.find(v => v.name.toLowerCase().includes("zira"));
//       const googleUK = availableVoices.find(v => v.name.toLowerCase().includes("uk english"));
//       const mark = availableVoices.find(v => v.name.toLowerCase().includes("mark"));
//       const david = availableVoices.find(v => v.name.toLowerCase().includes("david"));
//       const susan = availableVoices.find(v => v.name.toLowerCase().includes("susan"));
//       const orderedVoices = [zira, susan, googleUK, mark, david].filter(Boolean) as SpeechSynthesisVoice[];
//       setVoices(orderedVoices);
//       if (orderedVoices.length > 0) setSelectedVoice(orderedVoices[0]);
//     };
//     window.speechSynthesis.onvoiceschanged = loadVoices;
//     loadVoices();
//   }, []);

//   const speakCard = () => {
//     if (!autoRead || !selectedVoice) return;
//     const textToRead = flipped ? flashcards[current].answer : flashcards[current].question;
//     const utterance = new SpeechSynthesisUtterance(textToRead);
//     utterance.voice = selectedVoice;
//     utterance.rate = 1;
//     utterance.pitch = 1;
//     window.speechSynthesis.speak(utterance);
//   };

//   useEffect(() => {
//     if (autoRead) speakCard();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [current, flipped, autoRead, selectedVoice]);

//   const nextCard = () => {
//     setFlipped(false);
//     setDirection(1);
//     setCurrent((prev) => (prev + 1) % flashcards.length);
//   };

//   const prevCard = () => {
//     setFlipped(false);
//     setDirection(-1);
//     setCurrent((prev) => (prev - 1 + flashcards.length) % flashcards.length);
//   };

//   const getDisplayName = (voice: SpeechSynthesisVoice) => {
//     const name = voice.name.toLowerCase();
//     if (name.includes("zira")) return "Zira";
//     if (name.includes("susan")) return "Susan";
//     if (name.includes("uk english")) return "Google UK";
//     if (name.includes("mark")) return "Mark";
//     if (name.includes("david")) return "David";
//     return voice.name;
//   };

//   return (
//     <div className="p-6 flex flex-col items-center">
//       <h1 className="text-2xl font-bold mb-6">{topic?.replace(/-/g, " ")}</h1>

//       <div className="w-77 h-90 relative">
//         <AnimatePresence initial={false} custom={direction} mode="wait">
//           <motion.div
//             key={current}
//             className="w-full h-full cursor-pointer rounded-xl bg-white shadow-md flex items-center justify-center absolute top-0 left-0"
//             style={{ perspective: 1000 }}
//             animate={{ rotateY: flipped ? 180 : 0, rotateX: 2, x: 0, opacity: 1 }}
//             initial={{ x: direction === 1 ? "100%" : "-100%", opacity: 0 }}
//             exit={{ opacity: 0, transition: { duration: 0 } }}
//             transition={{ duration: 0.5 }}
//             onClick={() => setFlipped(!flipped)}
//             whileHover={{ scale: 1.03, boxShadow: "0px 8px 20px rgba(0,0,0,0.25)" }}
//             whileTap={{ scale: 0.98 }}
//           >
//             <AnimatePresence mode="wait">
//               <motion.p
//                 key={flipped ? "answer" : "question"}
//                 className="absolute inset-0 flex items-center justify-center text-center text-lg font-medium px-4 break-words text-black dark:text-black"
//                 style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
//                 initial={{ opacity: 0 }}
//                 animate={{ opacity: 1 }}
//                 exit={{ opacity: 0 }}
//                 transition={{ duration: 0.3 }}
//               >
//                 {flipped ? flashcards[current].answer : flashcards[current].question}
//               </motion.p>
//             </AnimatePresence>

//             <motion.div
//               className={`absolute bottom-2 right-2 cursor-pointer p-1 rounded-full flex items-center z-30 hover:bg-gray-200`}
//               style={{ rotateY: flipped ? 180 : 0 }}
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setAutoRead(!autoRead);
//                 setSpeakerActive(!speakerActive);
//               }}
//             >
//               <Volume2
//                 className={`w-6 h-6 ${speakerActive ? "text-blue-500" : "text-gray-600"}`}
//               />
//             </motion.div>

//             <motion.div
//               className="absolute top-2 right-2 cursor-pointer p-1 hover:bg-gray-100 rounded-full z-30 dropdown-wrapper"
//               style={{ rotateY: flipped ? 180 : 0 }}
//               onClick={(e) => {
//                 e.stopPropagation();
//                 setDropdownOpen(!dropdownOpen);
//               }}
//             >
//               <ChevronDown
//                 className={`w-4 h-4 dropdown-icon ${dropdownOpen ? "text-blue-500" : "text-gray-600"}`}
//               />
//             </motion.div>

//             <AnimatePresence>
//               {dropdownOpen && (
//                 <motion.div
//                   ref={dropdownRef}
//                   initial={{ opacity: 0, y: -10 }}
//                   animate={{ opacity: 1, y: 0, rotateY: flipped ? 180 : 0 }}
//                   exit={{ opacity: 0, y: -10 }}
//                   className="absolute top-8 right-2 z-40 flex flex-col gap-1"
//                 >
//                   {voices.map((voice) => (
//                     <motion.div
//                       key={voice.name}
//                       className={`px-2 py-1 text-xs rounded-md shadow w-24 truncate text-center cursor-pointer
//                         ${selectedVoice?.name === voice.name ? "bg-blue-200 text-blue-700" : "bg-blue-50 text-gray-700"}
//                         hover:bg-blue-100 transition-colors duration-150`}
//                       onClick={(e) => {
//                         e.stopPropagation();
//                         setSelectedVoice(voice);
//                         setDropdownOpen(false);
//                       }}
//                       title={voice.name}
//                       whileHover={{ scale: 1.05 }}
//                       whileTap={{ scale: 0.95 }}
//                     >
//                       {getDisplayName(voice)}
//                     </motion.div>
//                   ))}
//                 </motion.div>
//               )}
//             </AnimatePresence>
//           </motion.div>
//         </AnimatePresence>
//       </div>

//       <div className="flex gap-4 mt-6 w-96 justify-center">
//         <Button onClick={prevCard}>Previous</Button>
//         <Button onClick={nextCard}>Next</Button>
//       </div>

//       <div className="mt-6 flex justify-center">
//         <Button
//           className="bg-blue-700 text-white hover:bg-blue-800 dark:hover:bg-blue-600 transition-colors duration-300"
//           onClick={() => router.push(`/flashCard/${subject}`)}
//         >
//           ← Back to Topics
//         </Button>
//       </div>
//     </div>
//   );
// }


"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Volume2, ChevronDown } from "lucide-react";

// Flashcards for all subjects and topics (Nigerian curriculum, 3–5 questions per topic example)
const flashcardsData: Record<string, Record<string, { question: string; answer: string }[]>> = {
  mathematics: {
    algebra: [
      { question: "Simplify: 2x + 5x", answer: "7x" },
      { question: "Factorize: x^2 + 5x", answer: "x(x + 5)" },
      { question: "Solve: 2x - 3 = 7", answer: "x = 5" },
    ],
    trigonometry: [
      { question: "sin^2θ + cos^2θ = ?", answer: "1" },
      { question: "tan θ = ?", answer: "sin θ / cos θ" },
    ],
    statistics: [
      { question: "Mean of 2, 4, 6?", answer: "4" },
      { question: "Mode of 2, 2, 3, 4?", answer: "2" },
    ],
    // add other math topics similarly...
  },
  physics: {
    mechanics: [
      { question: "Force formula?", answer: "F = ma" },
      { question: "Unit of mass?", answer: "kg" },
    ],
    electricity: [
      { question: "Ohm's Law?", answer: "V = IR" },
      { question: "Unit of current?", answer: "Ampere" },
    ],
    waves: [
      { question: "Wave speed formula?", answer: "v = fλ" },
      { question: "Wavelength definition?", answer: "Distance between crests or troughs" },
    ],
    // add other physics topics...
  },
  chemistry: {
    "atomic-structure": [
      { question: "Number of protons in oxygen?", answer: "8" },
      { question: "Define isotope", answer: "Atoms with same protons but different neutrons" },
    ],
    "chemical-bonding": [
      { question: "Ionic bond definition?", answer: "Transfer of electrons between atoms" },
      { question: "Covalent bond definition?", answer: "Sharing of electrons" },
    ],
    // add other chemistry topics...
  },
  biology: {
    "cell-biology": [
      { question: "Function of mitochondria?", answer: "Produces energy (ATP)" },
      { question: "Nucleus function?", answer: "Control center of the cell" },
    ],
    genetics: [
      { question: "What is DNA?", answer: "Genetic material" },
      { question: "What is a gene?", answer: "Segment of DNA coding for a trait" },
    ],
  },
  english: {
    grammar: [
      { question: "What is a noun?", answer: "Person, place, or thing" },
      { question: "What is a verb?", answer: "Action or state word" },
    ],
    literature: [
      { question: "Author of Things Fall Apart?", answer: "Chinua Achebe" },
      { question: "Define allegory", answer: "Story with symbolic meaning" },
    ],
  },
  history: {
    nigeria: [
      { question: "Nigeria Independence date?", answer: "1st October 1960" },
      { question: "First President?", answer: "Nnamdi Azikiwe" },
    ],
    world: [
      { question: "Start of WWI?", answer: "28 July 1914" },
      { question: "Start of WWII?", answer: "1 Sept 1939" },
    ],
  },
  government: {
    democracy: [
      { question: "Define democracy?", answer: "Government by the people" },
      { question: "Executive leader?", answer: "President or Governor" },
    ],
  },
  economics: {
    microeconomics: [
      { question: "Define demand?", answer: "Quantity buyers want at a price" },
      { question: "Define supply?", answer: "Quantity sellers offer at a price" },
    ],
    macroeconomics: [
      { question: "What is GDP?", answer: "Value of goods and services in a country" },
      { question: "Inflation?", answer: "Increase in general price level" },
    ],
  },
  "christian-religious-studies-(crs)": {
    creation: [
      { question: "Who created the world?", answer: "God" },
      { question: "Days of creation?", answer: "6 days" },
    ],
  },
  "islamic-religious-studies-(irs)": {
    creation: [
      { question: "Islam's holy book?", answer: "Qur'an" },
    ],
  },
  commerce: {
    basics: [
      { question: "Define commerce?", answer: "Buying and selling of goods and services" },
      { question: "Define trade?", answer: "Exchange of goods for money" },
    ],
  },
  accounting: {
    basics: [
      { question: "Assets formula?", answer: "Assets = Liabilities + Equity" },
      { question: "Define revenue?", answer: "Income from business" },
    ],
  },
  "igbo-language": {
    grammar: [
      { question: "Hello in Igbo?", answer: "Ndewo" },
      { question: "Thank you in Igbo?", answer: "Daalụ" },
    ],
  },
  geography: {},
  "further-mathematics": {},
  "technical-drawing": {},
  "computer-science": {},
  "data-processing": {},
  "agricultural-science": {},
  "civic-education": {},
  french: {},
  "literature-in-english": {},
};

export default function FlashcardsPage() {
  const router = useRouter();
  const { subject, topic } = useParams();
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [direction, setDirection] = useState(1);
  const [autoRead, setAutoRead] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [speakerActive, setSpeakerActive] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const subjectStr = Array.isArray(subject) ? subject[0] : subject;
  const topicStr = Array.isArray(topic) ? topic[0] : topic;

  // Get flashcards for selected subject/topic
  let flashcards = flashcardsData[subjectStr as string]?.[topicStr as string] || [
    { question: "No flashcards available.", answer: "This topic has no questions yet." },
  ];

  // Shuffle questions when subject or topic changes
  useEffect(() => {
    flashcards = flashcards.sort(() => Math.random() - 0.5);
    setCurrent(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subjectStr, topicStr]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Load voices
  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      const zira = availableVoices.find(v => v.name.toLowerCase().includes("zira"));
      const googleUK = availableVoices.find(v => v.name.toLowerCase().includes("uk english"));
      const mark = availableVoices.find(v => v.name.toLowerCase().includes("mark"));
      const david = availableVoices.find(v => v.name.toLowerCase().includes("david"));
      const susan = availableVoices.find(v => v.name.toLowerCase().includes("susan"));
      const orderedVoices = [zira, susan, googleUK, mark, david].filter(Boolean) as SpeechSynthesisVoice[];
      setVoices(orderedVoices);
      if (orderedVoices.length > 0) setSelectedVoice(orderedVoices[0]);
    };
    window.speechSynthesis.onvoiceschanged = loadVoices;
    loadVoices();
  }, []);

  const speakCard = () => {
    if (!autoRead || !selectedVoice) return;
    const textToRead = flipped ? flashcards[current].answer : flashcards[current].question;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.voice = selectedVoice;
    utterance.rate = 1;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (autoRead) speakCard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, flipped, autoRead, selectedVoice]);

  const nextCard = () => {
    setFlipped(false);
    setDirection(1);
    setCurrent((prev) => (prev + 1) % flashcards.length);
  };

  const prevCard = () => {
    setFlipped(false);
    setDirection(-1);
    setCurrent((prev) => (prev - 1 + flashcards.length) % flashcards.length);
  };

  const getDisplayName = (voice: SpeechSynthesisVoice) => {
    const name = voice.name.toLowerCase();
    if (name.includes("zira")) return "Zira";
    if (name.includes("susan")) return "Susan";
    if (name.includes("uk english")) return "Google UK";
    if (name.includes("mark")) return "Mark";
    if (name.includes("david")) return "David";
    return voice.name;
  };

  return (
    <div className="p-6 flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6">{topicStr?.replace(/-/g, " ")}</h1>

      <div className="w-77 h-90 relative">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={current}
            className="w-full h-full cursor-pointer rounded-xl bg-white shadow-md flex items-center justify-center absolute top-0 left-0"
            style={{ perspective: 1000 }}
            animate={{ rotateY: flipped ? 180 : 0, rotateX: 2, x: 0, opacity: 1 }}
            initial={{ x: direction === 1 ? "100%" : "-100%", opacity: 0 }}
            exit={{ opacity: 0, transition: { duration: 0 } }}
            transition={{ duration: 0.5 }}
            onClick={() => setFlipped(!flipped)}
            whileHover={{ scale: 1.03, boxShadow: "0px 8px 20px rgba(0,0,0,0.25)" }}
            whileTap={{ scale: 0.98 }}
          >
            <AnimatePresence mode="wait">
              <motion.p
                key={flipped ? "answer" : "question"}
                className="absolute inset-0 flex items-center justify-center text-center text-lg font-medium px-4 break-words text-black dark:text-black"
                style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                {flipped ? flashcards[current].answer : flashcards[current].question}
              </motion.p>
            </AnimatePresence>

            <motion.div
              className={`absolute bottom-2 right-2 cursor-pointer p-1 rounded-full flex items-center z-30 hover:bg-gray-200`}
              style={{ rotateY: flipped ? 180 : 0 }}
              onClick={(e) => {
                e.stopPropagation();
                setAutoRead(!autoRead);
                setSpeakerActive(!speakerActive);
              }}
            >
              <Volume2
                className={`w-6 h-6 ${speakerActive ? "text-blue-500" : "text-gray-600"}`}
              />
            </motion.div>

            <motion.div
              className="absolute top-2 right-2 cursor-pointer p-1 hover:bg-gray-100 rounded-full z-30 dropdown-wrapper"
              style={{ rotateY: flipped ? 180 : 0 }}
              onClick={(e) => {
                e.stopPropagation();
                setDropdownOpen(!dropdownOpen);
              }}
            >
              <ChevronDown
                className={`w-4 h-4 dropdown-icon ${dropdownOpen ? "text-blue-500" : "text-gray-600"}`}
              />
            </motion.div>

            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  ref={dropdownRef}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0, rotateY: flipped ? 180 : 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-8 right-2 z-40 flex flex-col gap-1"
                >
                  {voices.map((voice) => (
                    <motion.div
                      key={voice.name}
                      className={`px-2 py-1 text-xs rounded-md shadow w-24 truncate text-center cursor-pointer
                        ${selectedVoice?.name === voice.name ? "bg-blue-200 text-blue-700" : "bg-blue-50 text-gray-700"}
                        hover:bg-blue-100 transition-colors duration-150`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedVoice(voice);
                        setDropdownOpen(false);
                      }}
                      title={voice.name}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {getDisplayName(voice)}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="flex gap-4 mt-6 w-96 justify-center">
        <Button onClick={prevCard}>Previous</Button>
        <Button onClick={nextCard}>Next</Button>
      </div>

      <div className="mt-6 flex justify-center">
        <Button
          className="bg-blue-700 text-white hover:bg-blue-800 dark:hover:bg-blue-600 transition-colors duration-300"
          onClick={() => router.push(`/flashCard/${subjectStr}`)}
        >
          ← Back to Topics
        </Button>
      </div>
    </div>
  );
}