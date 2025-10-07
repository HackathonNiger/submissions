"use client"

import { useEffect, useState } from "react"
import { useRouter, useParams } from "next/navigation"
import { getUser, isAuthenticated, updateUser } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Volume2, CheckCircle2, XCircle, Star, Mic } from "lucide-react"
import { lessons } from "@/lib/lessons-data"
import { useLanguage, translations } from "@/lib/language-context"
import { useAudioNavigation } from "../../../lib/vosk-audio-navigation-context"
import { speakWithNigerianVoice } from "@/lib/voice-utils"

function LessonContent() {
  const router = useRouter()
  const params = useParams()
  const [showPractice, setShowPractice] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [stars, setStars] = useState(0)
  const [isListening, setIsListening] = useState(false)
  const [recognition, setRecognition] = useState<any>(null)
  const { language, t, setLanguage } = useLanguage()
  const { speakText, setCurrentFocus, isAudioNavigationMode, startListening, stopListening, isListening: audioNavIsListening } = useAudioNavigation()

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/")
    } else {
      const user = getUser()
      if (user && user.language !== language) {
        setLanguage(user.language)
      }
    }
  }, [router, language, setLanguage])

  // Sync listening state with audio navigation
  useEffect(() => {
    setIsListening(audioNavIsListening)
  }, [audioNavIsListening])

  // Set focus when audio navigation is active and announce lesson options
  useEffect(() => {
    if (isAudioNavigationMode && params.id) {
      const lesson = lessons.find((l) => l.id === params.id)
      if (lesson) {
        setCurrentFocus(`Lesson: ${lesson.title[language]}`)
        
        // Announce lesson options automatically
        setTimeout(() => {
          if (!showPractice) {
            const announcement = language === 'english' 
              ? `You're in the lesson: ${lesson.title[language]}. Say 'Start practice' to begin the practice questions, or use global commands like 'Go to Dashboard'.`
              : language === 'hausa'
              ? `Kana cikin darasi: ${lesson.title[language]}. Ka ce 'Fara aiki' don fara tambayoyin aiki, ko ka yi amfani da umarnin gaba daya kamar 'Zuwa Dashboard'.`
              : language === 'kanuri'
              ? `Darasi cikin: ${lesson.title[language]}. 'Fara aiki' ce tambayoyin aiki fara don, ko gaba daya umarni kamar 'Dashboard zuwa' amfani.`
              : `أنت في الدرس: ${lesson.title[language]}. قل 'ابدأ التمرين' لبدء أسئلة التمرين، أو استخدم الأوامر العامة مثل 'الانتقال إلى لوحة القيادة'.`
            
            speakText(announcement, 'medium')
          }
        }, 2500) // Wait 2.5 seconds after welcome message
      }
    }
  }, [isAudioNavigationMode, params.id, setCurrentFocus, language, showPractice, speakText])

  // Listen for audio navigation commands
  useEffect(() => {
    const handleAudioCommand = (event: CustomEvent) => {
      const { command, option, text } = event.detail
      const currentLesson = lessons.find((l) => l.id === params.id)
      if (!currentLesson) return
      
      switch (command) {
        case 'startPractice':
          if (!showPractice) {
            handleStartPractice()
            // Read first question after starting practice
            setTimeout(() => {
              if (currentLesson.questions[0]) {
                speakText(`Question 1: ${currentLesson.questions[0].question[language]}`, 'high')
              }
            }, 1000)
          }
          break
        case 'readQuestion':
        case 'repeatQuestion':
          if (showPractice && currentLesson.questions[currentQuestion]) {
            const questionText = currentLesson.questions[currentQuestion].question[language]
            speakText(`Question ${currentQuestion + 1}: ${questionText}`, 'high')
          }
          break
        case 'nextQuestion':
          if (showFeedback) {
            handleNextQuestion()
            // Read next question after moving
            setTimeout(() => {
              if (currentQuestion + 1 < currentLesson.questions.length) {
                const nextQ = currentLesson.questions[currentQuestion + 1]
                speakText(`Question ${currentQuestion + 2}: ${nextQ.question[language]}`, 'high')
              }
            }, 500)
          } else if (showPractice && !showFeedback) {
            // If not showing feedback yet, submit current answer first
            if (selectedAnswer) {
              handleSubmitAnswer()
            } else {
              speakText("Please select an answer first.", 'medium')
            }
          }
          break
        case 'stopPractice':
          if (showPractice) {
            speakText("Stopping practice session. Returning to dashboard.", 'medium')
            router.push('/dashboard')
          }
          break
        case 'genericCommand':
          // Try to match answer options
          if (showPractice && !showFeedback && currentLesson.questions[currentQuestion]?.options) {
            const matchedOption = currentLesson.questions[currentQuestion].options.find(option => 
              option.toLowerCase().includes(text.toLowerCase()) || 
              text.toLowerCase().includes(option.toLowerCase())
            )
            
            if (matchedOption) {
              handleAnswerSelect(matchedOption)
              speakText(`Selected: ${matchedOption}. Say 'Next question' to continue.`, 'medium')
            } else {
              // Try to match numbers in the text
              const numberMatch = text.match(/\d+/)
              if (numberMatch) {
                const number = parseInt(numberMatch[0])
                // Check if there's an option that matches this number
                const numberOption = currentLesson.questions[currentQuestion].options.find(option => 
                  option.includes(number.toString())
                )
                
                if (numberOption) {
                  handleAnswerSelect(numberOption)
                  speakText(`Selected: ${numberOption}. Say 'Next question' to continue.`, 'medium')
                } else {
                  speakText(`I heard "${text}" but couldn't match it to an answer option. Please try again.`, 'medium')
                }
              } else {
                speakText(`I heard "${text}" but couldn't match it to an answer option. Please try again.`, 'medium')
              }
            }
          }
          break
      }
    }

    if (isAudioNavigationMode) {
      window.addEventListener('audioNavigationCommand', handleAudioCommand as EventListener)
      return () => {
        window.removeEventListener('audioNavigationCommand', handleAudioCommand as EventListener)
      }
    }
  }, [showPractice, showFeedback, selectedAnswer, currentQuestion, params.id, isAudioNavigationMode, speakText, t])

  const user = getUser()
  if (!user) return null

  const lesson = lessons.find((l) => l.id === params.id)
  if (!lesson) {
    router.push("/dashboard")
    return null
  }

  const handleStartPractice = () => {
    setShowPractice(true)
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setShowFeedback(false)
  }

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer)
  }

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return

    const question = lesson.questions[currentQuestion]
    const correct = selectedAnswer === question.answer

    setIsCorrect(correct)
    setShowFeedback(true)

    if (correct) {
      setStars((prev) => Math.min(prev + 1, 3))
    }
  }

  const handleNextQuestion = () => {
    if (currentQuestion < lesson.questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
      setSelectedAnswer(null)
      setShowFeedback(false)
    } else {
      // Complete lesson
      const user = getUser()
      if (user) {
        const newProgress = {
          ...user.progress,
          [lesson.id]: {
            completed: true,
            stars: Math.max(stars, user.progress[lesson.id]?.stars || 0),
            attempts: (user.progress[lesson.id]?.attempts || 0) + 1,
          },
        }
        updateUser({ progress: newProgress })
      }
      router.push("/dashboard")
    }
  }

  const handlePlayAudio = (text?: string) => {
    // Text-to-Speech functionality with Nigerian voice
    const textToSpeak = text || lesson.content[language]
    
    if ('speechSynthesis' in window) {
      // Use Nigerian voice utility for all non-English languages
      if (language !== 'english') {
        speakWithNigerianVoice(textToSpeak, language, user.settings)
      } else {
        // For English, use standard implementation
        const utterance = new SpeechSynthesisUtterance(textToSpeak)
        utterance.lang = 'en-US'
        utterance.rate = user.settings.audioSpeed === 'slow' ? 0.7 : user.settings.audioSpeed === 'very-slow' ? 0.5 : 1
        utterance.pitch = user.settings.audioPitch === 'high' ? 1.2 : 1
        speechSynthesis.speak(utterance)
      }
    } else {
      // Fallback for browsers without speech synthesis
      const messages = {
        english: "Audio playing... (Demo Mode)",
        hausa: "Sauti yana kunna... (Demo Mode)",
        kanuri: "Sauti yana kunna... (Demo Mode)",
        arabic: "تشغيل الصوت... (وضع العرض)"
      }
      alert(messages[language])
    }
  }

  const handleVoiceInput = async () => {
    // Check for speech recognition support
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      const messages = {
        english: "Voice recognition not supported in this browser",
        hausa: "Ba a goyan bayan gane murya a wannan browser ba",
        kanuri: "Browser wannan murya gane goyan baya ba",
        arabic: "لا يدعم هذا المتصفح تقنية التعرف على الصوت"
      }
      alert(messages[language])
      return
    }

    // Request microphone permission
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true })
    } catch (error) {
      const messages = {
        english: "Microphone access denied. Please allow microphone access and try again.",
        hausa: "An hana samun damar microphone. Ka ba da izini ka sake gwadawa.",
        kanuri: "Microphone damar hana. Izini ba ka sake gwadawa.",
        arabic: "تم رفض الوصول للميكروفون. يرجى السماح بالوصول والمحاولة مرة أخرى."
      }
      alert(messages[language])
      return
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    const newRecognition = new SpeechRecognition()
    setRecognition(newRecognition)
    
    // Set language for speech recognition
    switch (language) {
      case 'hausa':
        newRecognition.lang = 'ha-NG'
        break
      case 'kanuri':
        newRecognition.lang = 'en-US' // Fallback to English
        break
      case 'arabic':
        newRecognition.lang = 'ar-SA'
        break
      default:
        newRecognition.lang = 'en-US'
    }
    
    newRecognition.continuous = false
    newRecognition.interimResults = false
    newRecognition.maxAlternatives = 3
    
    setIsListening(true)
    
    newRecognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript.toLowerCase().trim()
      console.log('Voice input:', transcript)
      
      // Try to match the transcript with available answers
      const question = lesson.questions[currentQuestion]
      let matchedOption = null
      
      // First try exact match
      matchedOption = question.options?.find(option => 
        option.toLowerCase() === transcript
      )
      
      // If no exact match, try partial match
      if (!matchedOption) {
        matchedOption = question.options?.find(option => 
          transcript.includes(option.toLowerCase()) || 
          option.toLowerCase().includes(transcript)
        )
      }
      
      // Try number matching for numeric answers
      if (!matchedOption && /\d+/.test(transcript)) {
        const spokenNumber = transcript.match(/\d+/)?.[0]
        matchedOption = question.options?.find(option => 
          option.includes(spokenNumber || '')
        )
      }
      
      if (matchedOption) {
        setSelectedAnswer(matchedOption)
        // Don't auto-submit, let user confirm
        const messages = {
          english: `I heard "${matchedOption}". Tap Submit to confirm or speak again.`,
          hausa: `Na ji "${matchedOption}". Danna Submit don tabbatarwa ko sake magana.`,
          kanuri: `Na ji "${matchedOption}". Submit danna tabbatarwa ko sake magana.`,
          arabic: `سمعت "${matchedOption}". اضغط إرسال للتأكيد أو تحدث مرة أخرى.`
        }
        alert(messages[language])
      } else {
        const messages = {
          english: `I heard "${transcript}" but couldn't match it to an answer. Please try again or tap an answer.`,
          hausa: `Na ji "${transcript}" amma ban iya daidaita shi da amsa ba. Ka sake gwadawa ko ka danna amsa.`,
          kanuri: `Na ji "${transcript}" amma amsa daidaita ba zai iya ba. Sake gwadawa ko amsa danna.`,
          arabic: `سمعت "${transcript}" لكن لم أتمكن من مطابقته مع إجابة. حاول مرة أخرى أو اضغط على إجابة.`
        }
        alert(messages[language])
      }
      
      setIsListening(false)
    }
    
    newRecognition.onerror = (event: any) => {
      setIsListening(false)
      console.error('Speech recognition error:', event.error)
      
      let errorMessage = ""
      switch (event.error) {
        case 'no-speech':
          errorMessage = language === 'english' ? "No speech detected. Please try again." :
                        language === 'hausa' ? "Ba a gano magana ba. Ka sake gwadawa." :
                        language === 'kanuri' ? "Magana gano ba. Sake gwadawa." :
                        "لم يتم اكتشاف كلام. حاول مرة أخرى."
          break
        case 'audio-capture':
          errorMessage = language === 'english' ? "Microphone not available. Please check your microphone." :
                        language === 'hausa' ? "Microphone ba ya samuwa. Ka duba microphone naka." :
                        language === 'kanuri' ? "Microphone samuwa ba. Microphone naka duba." :
                        "الميكروفون غير متاح. يرجى فحص الميكروفون."
          break
        case 'not-allowed':
          errorMessage = language === 'english' ? "Microphone access denied. Please allow microphone access." :
                        language === 'hausa' ? "An hana samun damar microphone. Ka ba da izini." :
                        language === 'kanuri' ? "Microphone damar hana. Izini ba." :
                        "تم رفض الوصول للميكروفون. يرجى السماح بالوصول."
          break
        default:
          errorMessage = language === 'english' ? "Voice recognition error. Please try again." :
                        language === 'hausa' ? "Kuskuren gane murya. Ka sake gwadawa." :
                        language === 'kanuri' ? "Murya gane kuskure. Sake gwadawa." :
                        "خطأ في التعرف على الصوت. حاول مرة أخرى."
      }
      
      alert(errorMessage)
    }
    
    newRecognition.onend = () => {
      setIsListening(false)
    }
    
    try {
      newRecognition.start()
    } catch (error) {
      setIsListening(false)
      console.error('Failed to start speech recognition:', error)
      const messages = {
        english: "Failed to start voice recognition. Please try again.",
        hausa: "Ba a iya fara gane murya ba. Ka sake gwadawa.",
        kanuri: "Murya gane fara ba zai iya ba. Sake gwadawa.",
        arabic: "فشل في بدء التعرف على الصوت. حاول مرة أخرى."
      }
      alert(messages[language])
    }
  }

  const handleStopListening = () => {
    if (recognition) {
      recognition.stop()
      setIsListening(false)
      setRecognition(null)
    }
  }

  const question = lesson.questions[currentQuestion]

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20 ${user.settings.dyslexiaFont ? "dyslexia-font" : ""}`}
    >
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button variant="outline" size="icon" onClick={() => router.push(`/topics/${lesson.topic}`)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-balance">{lesson.title[language]}</h1>
            <p className="text-muted-foreground">{lesson.description[language]}</p>
          </div>
        </div>

        {!showPractice ? (
          /* Teaching Section */
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{t("lesson", {
                    english: "Lesson",
                    hausa: "Darasi",
                    kanuri: "Darasi",
                    arabic: "الدرس"
                  })}</span>
                  <Button variant="outline" size="icon" onClick={() => handlePlayAudio()}>
                    <Volume2 className="h-5 w-5" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Visual Aid */}
                <div className="bg-muted p-8 rounded-xl text-center">
                  <div className="text-6xl mb-4">{lesson.icon}</div>
                  <p className="text-4xl font-bold">{lesson.questions[0]?.visual || "📚"}</p>
                </div>

                {/* Lesson Content */}
                <div className="prose prose-lg max-w-none">
                  <p className="text-xl leading-relaxed">{lesson.content[language]}</p>
                </div>

                {/* Subtitles */}
                {user.settings.subtitles && (
                  <div className="bg-card border-2 border-primary p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">
                      {t("subtitles", translations.subtitles)}
                    </p>
                    <p className="text-base">{lesson.content[language]}</p>
                  </div>
                )}

                <Button onClick={handleStartPractice} size="lg" className="w-full text-lg">
                  {t("startPractice", {
                    english: "Start Practice",
                    hausa: "Fara Aiki",
                    kanuri: "Fara Aiki",
                    arabic: "ابدأ التمرين"
                  })}
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          /* Practice Section */
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>
                    {t("question", {
                      english: "Question",
                      hausa: "Tambaya",
                      kanuri: "Tambaya",
                      arabic: "سؤال"
                    })}{" "}
                    {currentQuestion + 1}/{lesson.questions.length}
                  </span>
                  <div className="flex gap-1">
                    {[...Array(3)].map((_, i) => (
                      <Star key={i} className={`h-5 w-5 ${i < stars ? "fill-accent text-accent" : "text-muted"}`} />
                    ))}
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Question Visual */}
                {question.visual && (
                  <div className="bg-muted p-8 rounded-xl text-center">
                    <p className="text-5xl">{question.visual}</p>
                  </div>
                )}

                {/* Question Text */}
                <div className="text-center">
                  <p className="text-2xl font-bold mb-4">{question.question[language]}</p>
                  <div className="flex gap-2 justify-center">
                    <Button variant="outline" size="icon" onClick={() => handlePlayAudio(question.question[language])}>
                      <Volume2 className="h-5 w-5" />
                    </Button>
                    <Button 
                      variant={isListening ? "default" : "outline"} 
                      size="icon" 
                      onClick={handleVoiceInput}
                      disabled={showFeedback}
                    >
                      <Mic className={`h-5 w-5 ${isListening ? 'animate-pulse' : ''}`} />
                    </Button>
                  </div>
                  {isListening && (
                    <div className="mt-4 p-4 bg-primary/10 rounded-lg border-2 border-primary/20">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                        <p className="text-sm font-medium text-primary">
                          {t("listening", {
                            english: "Listening... Speak your answer",
                            hausa: "Ina saurare... Fada amsarka",
                            kanuri: "Saurare... Amsarka fada",
                            arabic: "أستمع... قل إجابتك"
                          })}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground text-center">
                        {t("speakClearly", {
                          english: "Speak clearly and wait for confirmation",
                          hausa: "Yi magana a fili ka jira tabbatarwa",
                          kanuri: "Fili magana yi tabbatarwa jira",
                          arabic: "تحدث بوضوح وانتظر التأكيد"
                        })}
                      </p>
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={handleStopListening}
                        className="mt-2"
                      >
                        {t("stopListening", {
                          english: "Stop Listening",
                          hausa: "Dakatar da Saurare",
                          kanuri: "Saurare Dakatar",
                          arabic: "توقف عن الاستماع"
                        })}
                      </Button>
                    </div>
                  )}
                </div>

                {/* Answer Options */}
                <div className="grid grid-cols-2 gap-4">
                  {question.options?.map((option) => (
                    <Button
                      key={option}
                      variant={selectedAnswer === option ? "default" : "outline"}
                      size="lg"
                      className="h-20 text-2xl font-bold"
                      onClick={() => handleAnswerSelect(option)}
                      disabled={showFeedback}
                    >
                      {option}
                    </Button>
                  ))}
                </div>

                {/* Feedback */}
                {showFeedback && (
                  <Card className={isCorrect ? "bg-accent/10 border-accent" : "bg-destructive/10 border-destructive"}>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-3 mb-2">
                        {isCorrect ? (
                          <CheckCircle2 className="h-8 w-8 text-accent" />
                        ) : (
                          <XCircle className="h-8 w-8 text-destructive" />
                        )}
                        <p className="text-xl font-bold">
                          {isCorrect
                            ? t("correct", {
                                english: "Great job! 🎉",
                                hausa: "Madalla! 🎉",
                                kanuri: "Madalla! 🎉",
                                arabic: "ممتاز! 🎉"
                              })
                            : t("tryAgain", {
                                english: "Try again...",
                                hausa: "Sake gwadawa...",
                                kanuri: "Sake gwadawa...",
                                arabic: "حاول مرة أخرى..."
                              })}
                        </p>
                      </div>
                      {!isCorrect && (
                        <p className="text-muted-foreground">
                          {t("correctAnswer", {
                            english: `The correct answer is: ${question.answer}`,
                            hausa: `Amsar da ta dace ita ce: ${question.answer}`,
                            kanuri: `Amsar da ta dace: ${question.answer}`,
                            arabic: `الإجابة الصحيحة هي: ${question.answer}`
                          })}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* Action Buttons */}
                {!showFeedback ? (
                  <Button onClick={handleSubmitAnswer} size="lg" className="w-full text-lg" disabled={!selectedAnswer}>
                    {t("submitAnswer", {
                      english: "Submit Answer",
                      hausa: "Tura Amsa",
                      kanuri: "Tura Amsa",
                      arabic: "إرسال الإجابة"
                    })}
                  </Button>
                ) : (
                  <Button onClick={handleNextQuestion} size="lg" className="w-full text-lg">
                    {currentQuestion < lesson.questions.length - 1
                      ? t("nextQuestion", {
                          english: "Next Question",
                          hausa: "Tambaya Na Gaba",
                          kanuri: "Tambaya Na Gaba",
                          arabic: "السؤال التالي"
                        })
                      : t("complete", {
                          english: "Complete",
                          hausa: "Kammala",
                          kanuri: "Kammala",
                          arabic: "إنهاء"
                        })}
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default function LessonPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return <LessonContent />
}