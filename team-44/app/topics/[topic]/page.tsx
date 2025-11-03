'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getUser, isAuthenticated } from '@/lib/auth';
import { LessonCard } from '@/components/lesson-card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { lessons } from '@/lib/lessons-data';
import { useLanguage } from '@/lib/language-context';
import { useAudioNavigation } from '../../../lib/vosk-audio-navigation-context';
import { findBestCommandMatch } from '@/lib/text-recognition';
import type { MathTopic } from '@/lib/types';

function TopicContent() {
  const router = useRouter();
  const params = useParams();
  const { language, setLanguage, t } = useLanguage();
  const { speakText, setCurrentFocus, isAudioNavigationMode, announcePage } = useAudioNavigation();
  const [announcement, setAnnouncement] = useState(''); // For ARIA live region

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/');
    } else {
      const user = getUser();
      if (user && user.language !== language) {
        setLanguage(user.language);
      }
    }
  }, [router, language, setLanguage]);

  const user = getUser();
  if (!user) return null;

  const topic = params.topic as MathTopic;
  const topicLessons = lessons.filter((l) => l.topic === topic);

  const topicTitles = {
    basic: {
      english: 'Basic Math',
      hausa: 'Lissafi na Asali',
      kanuri: 'Lissafi Asali',
      arabic: 'الرياضيات الأساسية',
    },
    intermediate: {
      english: 'Intermediate Math',
      hausa: 'Lissafi na Matsakaici',
      kanuri: 'Lissafi Matsakaici',
      arabic: 'الرياضيات المتوسطة',
    },
    algebra: {
      english: 'Algebra',
      hausa: 'Algebra',
      kanuri: 'Algebra',
      arabic: 'الجبر',
    },
  };

  // Set focus and announce lessons
  useEffect(() => {
    if (isAudioNavigationMode && topic) {
      const topicTitle = topicTitles[topic][language];
      setCurrentFocus(`Topic: ${topicTitle}`);
      const announcementText =
        language === 'english'
          ? `Topic: ${topicTitle}. Available lessons: ${topicLessons.map((lesson) => lesson.title[language]).join(', ')}. Say the lesson name to navigate to it, or say 'Go back' to return to dashboard.`
          : language === 'hausa'
          ? `Jigo: ${topicTitle}. Darussa da ake da su: ${topicLessons.map((lesson) => lesson.title[language]).join(', ')}. Ka ce sunan darasi don zuwa gare shi, ko ka ce 'Koma baya' don komawa dashboard.`
          : language === 'kanuri'
          ? `Jigo: ${topicTitle}. Darussa cikin: ${topicLessons.map((lesson) => lesson.title[language]).join(', ')}. Darasi suna ce gare shi zuwa don, ko 'Baya koma' ce dashboard komawa don.`
          : `الموضوع: ${topicTitle}. الدروس المتاحة: ${topicLessons.map((lesson) => lesson.title[language]).join(', ')}. قل اسم الدرس للانتقال إليه، أو قل 'العودة' للعودة إلى لوحة القيادة.`;
      
      announcePage(window.location.pathname, announcementText, 'medium');
    }
  }, [isAudioNavigationMode]);

  // Listen for audio navigation commands
  useEffect(() => {
    const handleAudioCommand = (event: CustomEvent) => {
      const { command, text } = event.detail;
      if (command === 'genericCommand') {
        // Try fuzzy matching lesson names using Levenshtein-based matcher
        const lessonCandidates = topicLessons.map((l) => l.title[language]);
        const match = findBestCommandMatch(text, lessonCandidates, { threshold: 0.6, allowPartial: true });
        const matchedLesson = match
          ? topicLessons.find((l) => l.title[language] === match.command)
          : topicLessons.find(
              (lesson) =>
                lesson.title[language].toLowerCase().includes(text.toLowerCase()) ||
                text.toLowerCase().includes(lesson.title[language].toLowerCase())
            );
        if (matchedLesson) {
          const message = t('navigatingToLesson', {
            english: `Going to ${matchedLesson.title[language]}`,
            hausa: `Zai zuwa ${matchedLesson.title[language]}`,
            kanuri: `Zai zuwa ${matchedLesson.title[language]}`,
            arabic: `الانتقال إلى ${matchedLesson.title[language]}`,
          });
          setAnnouncement(message);
          if (isAudioNavigationMode) {
            speakText(message, 'medium');
          }
          router.push(`/lesson/${matchedLesson.id}`);
        } else if (text.toLowerCase().includes('go back') || text.toLowerCase().includes('koma') || text.toLowerCase().includes('baya') || text.toLowerCase().includes('رجوع')) {
          const message = t('navigatedToDashboard', {
            english: 'Navigated to dashboard',
            hausa: 'Ya kewaya zuwa dashboard',
            kanuri: 'Ya kewaya zuwa dashboard',
            arabic: 'تم الانتقال إلى لوحة القيادة',
          });
          setAnnouncement(message);
          if (isAudioNavigationMode) {
            speakText(message, 'medium');
          }
          router.push('/dashboard');
        }
      }
    };

    if (isAudioNavigationMode) {
      window.addEventListener('audioNavigationCommand', handleAudioCommand as EventListener);
      return () => {
        window.removeEventListener('audioNavigationCommand', handleAudioCommand as EventListener);
      };
    }
  }, [isAudioNavigationMode, topicLessons, language, speakText, router, t]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20">
      {/* Skip Link */}
      <a href="#main-content" className="sr-only focus:not-sr-only">
        {t('skipToContent', {
          english: 'Skip to content',
          hausa: 'Tsallake zuwa abun ciki',
          kanuri: 'Tsallake zuwa abun ciki',
          arabic: 'التخطي إلى المحتوى',
        })}
      </a>
      {/* ARIA Live Region */}
      <div aria-live="polite" className="sr-only">
        {announcement}
      </div>

      <div className="container mx-auto px-4 py-6">
        <main id="main-content">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                const message = t('navigatedToDashboard', {
                  english: 'Navigated to dashboard',
                  hausa: 'Ya kewaya zuwa dashboard',
                  kanuri: 'Ya kewaya zuwa dashboard',
                  arabic: 'تم الانتقال إلى لوحة القيادة',
                });
                setAnnouncement(message);
                if (isAudioNavigationMode) {
                  speakText(message, 'medium');
                }
                router.push('/dashboard');
              }}
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="sr-only">
                {t('backToDashboard', {
                  english: 'Back to dashboard',
                  hausa: 'Koma zuwa dashboard',
                  kanuri: 'Koma zuwa dashboard',
                  arabic: 'العودة إلى لوحة القيادة',
                })}
              </span>
            </Button>
            <div className="flex items-center gap-3">
              <BookOpen className="h-8 w-8 text-primary" />
              <h1 className="text-3xl md:text-4xl font-bold">{topicTitles[topic][language]}</h1>
            </div>
          </div>

          {/* Lessons */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" role="list">
            {topicLessons.map((lesson, index) => {
              const progress = user.progress[lesson.id];
              return (
                <div role="listitem" key={lesson.id}>
                  <LessonCard
                    lesson={lesson}
                    language={language}
                    stars={progress?.stars || 0}
                    completed={progress?.completed || false}
                    locked={false}
                    onClick={() => {
                      const message = t('navigatingToLesson', {
                        english: `Going to ${lesson.title[language]}`,
                        hausa: `Zai zuwa ${lesson.title[language]}`,
                        kanuri: `Zai zuwa ${lesson.title[language]}`,
                        arabic: `الانتقال إلى ${lesson.title[language]}`,
                      });
                      setAnnouncement(message);
                      if (isAudioNavigationMode) {
                        speakText(message, 'medium');
                      }
                      router.push(`/lesson/${lesson.id}`);
                    }}
                    aria-label={t('selectLesson', {
                      english: `Select lesson ${lesson.title[language]}`,
                      hausa: `Zaɓi darasi ${lesson.title[language]}`,
                      kanuri: `Zaɓi darasi ${lesson.title[language]}`,
                      arabic: `اختر الدرس ${lesson.title[language]}`,
                    })}
                  />
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
}

export default function TopicPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <TopicContent />;
}