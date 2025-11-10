export const questions: Record<string, { id: number; question: string; options: string[]; answer: string }[]> = {
  mathematics: [
    { id: 1, question: "Solve: 2x + 3 = 7", options: ["x=1", "x=2", "x=3", "x=4"], answer: "x=2" },
    { id: 2, question: "Derivative of x² is?", options: ["2x", "x", "x²", "1"], answer: "2x" },
  ],
  english: [
    { id: 1, question: "Choose the correct synonym of 'happy'", options: ["sad", "joyful", "angry", "tired"], answer: "joyful" },
    { id: 2, question: "Pick the correct spelling:", options: ["Definately", "Definitely", "Definetly", "Definitaly"], answer: "Definitely" },
  ],
  physics: [
    { id: 1, question: "SI unit of Force?", options: ["Joule", "Newton", "Pascal", "Watt"], answer: "Newton" },
    { id: 2, question: "Acceleration due to gravity on Earth?", options: ["9.8 m/s²", "10 m/s²", "8.9 m/s²", "12 m/s²"], answer: "9.8 m/s²" },
  ],
  chemistry: [
    { id: 1, question: "Atomic number of Oxygen?", options: ["6", "7", "8", "9"], answer: "8" },
    { id: 2, question: "NaCl is commonly known as?", options: ["Sugar", "Salt", "Chalk", "Water"], answer: "Salt" },
  ],
  biology: [
    { id: 1, question: "The powerhouse of the cell is?", options: ["Nucleus", "Mitochondria", "Chloroplast", "Ribosome"], answer: "Mitochondria" },
    { id: 2, question: "Which blood group is universal donor?", options: ["A", "B", "AB", "O"], answer: "O" },
  ],
  literature: [
    { id: 1, question: "Who wrote 'Things Fall Apart'?", options: ["Wole Soyinka", "Chinua Achebe", "Ngugi wa Thiong’o", "T.S. Eliot"], answer: "Chinua Achebe" },
    { id: 2, question: "Literary device in 'The wind whispered'?", options: ["Metaphor", "Simile", "Personification", "Irony"], answer: "Personification" },
  ],
  government: [
    { id: 1, question: "Nigeria became independent in?", options: ["1960", "1963", "1970", "1957"], answer: "1960" },
    { id: 2, question: "Who was Nigeria's first Prime Minister?", options: ["Tafawa Balewa", "Nnamdi Azikiwe", "Obafemi Awolowo", "Yakubu Gowon"], answer: "Tafawa Balewa" },
  ],
  history: [
    { id: 1, question: "Who was the first president of Nigeria?", options: ["Obasanjo", "Balewa", "Nnamdi Azikiwe", "Gowon"], answer: "Nnamdi Azikiwe" },
    { id: 2, question: "Berlin Conference was held in?", options: ["1844", "1884", "1944", "1984"], answer: "1884" },
  ],
};
