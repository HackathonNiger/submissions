// // src/lib/fetchQuestions.ts
// const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://questions.aloc.com.ng/api/v2/q";
// const API_KEY = process.env.NEXT_PUBLIC_API_KEY || "";

// interface RawQuestion {
//   question: string;
//   option: Record<string, string>;
//   answer: string;
// }

// export interface Question {
//   text: string;
//   options: string[];
//   correct: number;
// }

// const letterToIndex: Record<string, number> = {
//   a: 0,
//   b: 1,
//   c: 2,
//   d: 3,
// };

// /**
//  * Fetch questions for a subject from the API
//  */
// export async function fetchQuestions(subject: string, limit = 20): Promise<Question[]> {
//   const res = await fetch(`${API_URL}?subject=${subject}&limit=${limit}`, {
//     headers: {
//       Accept: "application/json",
//       "X-Api-Key": API_KEY,
//     },
//     cache: "no-store",
//   });

//   if (!res.ok) throw new Error(`Failed to fetch ${subject} questions`);

//   const json = await res.json();
//   const dataArray: RawQuestion[] = Array.isArray(json.data) ? json.data : [json.data];

//   return dataArray.map((q: RawQuestion) => {
//     const options = Object.values(q.option).filter(Boolean);
//     const correctIndex = letterToIndex[q.answer.toLowerCase()] ?? -1;

//     return {
//       text: q.question,
//       options,
//       correct: correctIndex,
//     };
//   });
// }
