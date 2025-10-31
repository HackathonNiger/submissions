export type Language = "hausa" | "kanuri" | "arabic" | "english"

export type MathTopic = "basic" | "intermediate" | "algebra"

export interface User {
  username: string
  email: string
  language: Language
  progress: {
    [key: string]: {
      completed: boolean
      stars: number
      attempts: number
    }
  }
  settings: {
    dyslexiaFont: boolean
    audioSpeed: "normal" | "slow" | "very-slow"
    audioPitch: "normal" | "high"
    subtitles: boolean
    audioNavigation: boolean
  }
}

export interface Lesson {
  id: string
  topic: MathTopic
  title: {
    hausa: string
    kanuri: string
    arabic: string
    english: string
  }
  description: {
    hausa: string
    kanuri: string
    arabic: string
    english: string
  }
  content: {
    hausa: string
    kanuri: string
    arabic: string
    english: string
  }
  questions: Question[]
  icon: string
}

export interface Question {
  id: string
  question: {
    hausa: string
    kanuri: string
    arabic: string
    english: string
  }
  answer: string
  options?: string[]
  visual?: string
}