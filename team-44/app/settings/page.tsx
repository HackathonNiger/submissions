'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getUser, isAuthenticated, updateUser } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, SettingsIcon } from 'lucide-react';
import { LanguageSelector } from '@/components/language-selector';
import { useLanguage, translations } from '@/lib/language-context';
import { useDyslexia } from '../../lib/dyslexia-context';
import { useAudioNavigation } from '../../lib/vosk-audio-navigation-context';
import type { Language } from '@/lib/types';

function SettingsContent() {
  const router = useRouter();
  const [showLanguageSelector, setShowLanguageSelector] = useState(false);
  const { language, t, setLanguage } = useLanguage();
  const { isDyslexiaMode, toggleDyslexiaMode } = useDyslexia();
  const { isAudioNavigationMode, toggleAudioNavigationMode, isListening, speakText, setAnnouncement } = useAudioNavigation();

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/');
    }
  }, [router]);

  const user = getUser();
  if (!user) return null;

  const handleToggle = (setting: keyof typeof user.settings) => {
    if (setting === 'dyslexiaFont') {
      toggleDyslexiaMode();
      const message = t(isDyslexiaMode ? 'dyslexiaFontDisabled' : 'dyslexiaFontEnabled', {
        english: isDyslexiaMode ? 'Dyslexia font disabled' : 'Dyslexia font enabled',
        hausa: isDyslexiaMode ? 'Rubutun dyslexia kashe' : 'Rubutun dyslexia kunna',
        kanuri: isDyslexiaMode ? 'Rubutun dyslexia kashe' : 'Rubutun dyslexia kunna',
        arabic: isDyslexiaMode ? 'تم تعطيل خط الديسلكسيا' : 'تم تفعيل خط الديسلكسيا',
      });
      setAnnouncement(message);
      if (isAudioNavigationMode) {
        speakText(message, 'medium');
      }
    } else if (setting === 'audioNavigation') {
      toggleAudioNavigationMode();
    } else {
      updateUser({
        settings: {
          ...user.settings,
          [setting]: !user.settings[setting],
        },
      });
      const message = t(`${setting}${user.settings[setting] ? 'Disabled' : 'Enabled'}`, {
        english: `${setting} ${user.settings[setting] ? 'disabled' : 'enabled'}`,
        hausa: `${setting} ${user.settings[setting] ? 'kashe' : 'kunna'}`,
        kanuri: `${setting} ${user.settings[setting] ? 'kashe' : 'kunna'}`,
        arabic: `${setting} ${user.settings[setting] ? 'تم التعطيل' : 'تم التفعيل'}`,
      });
      setAnnouncement(message);
      if (isAudioNavigationMode) {
        speakText(message, 'medium');
      }
      window.location.reload();
    }
  };

  const handleLanguageChange = (newLanguage: Language) => {
    updateUser({ language: newLanguage });
    setLanguage(newLanguage);
    setShowLanguageSelector(false);
    const message = t('languageChanged', {
      english: `Language changed to ${newLanguage}`,
      hausa: `Harshen ya canza zuwa ${newLanguage}`,
      kanuri: `Harshen ya canza zuwa ${newLanguage}`,
      arabic: `تم تغيير اللغة إلى ${newLanguage}`,
    });
    setAnnouncement(message);
    if (isAudioNavigationMode) {
      speakText(message, 'medium');
    }
    window.location.reload();
  };

  const handleSpeedChange = () => {
    const speeds = ['normal', 'slow', 'very-slow'] as const;
    const currentIndex = speeds.indexOf(user.settings.audioSpeed);
    const nextSpeed = speeds[(currentIndex + 1) % speeds.length];
    updateUser({
      settings: {
        ...user.settings,
        audioSpeed: nextSpeed,
      },
    });
    const message = t('audioSpeedChanged', {
      english: `Audio speed changed to ${nextSpeed}`,
      hausa: `Saurin sauti ya canza zuwa ${nextSpeed}`,
      kanuri: `Saurin sauti ya canza zuwa ${nextSpeed}`,
      arabic: `تم تغيير سرعة الصوت إلى ${nextSpeed}`,
    });
    setAnnouncement(message);
    if (isAudioNavigationMode) {
      speakText(message, 'medium');
    }
    window.location.reload();
  };

  const handlePitchChange = () => {
    const pitches = ['normal', 'high'] as const;
    const currentIndex = pitches.indexOf(user.settings.audioPitch);
    const nextPitch = pitches[(currentIndex + 1) % pitches.length];
    updateUser({
      settings: {
        ...user.settings,
        audioPitch: nextPitch,
      },
    });
    const message = t('audioPitchChanged', {
      english: `Audio pitch changed to ${nextPitch}`,
      hausa: `Sautin sauti ya canza zuwa ${nextPitch}`,
      kanuri: `Sautin sauti ya canza zuwa ${nextPitch}`,
      arabic: `تم تغيير نبرة الصوت إلى ${nextPitch}`,
    });
    setAnnouncement(message);
    if (isAudioNavigationMode) {
      speakText(message, 'medium');
    }
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      {showLanguageSelector ? (
        <div className="min-h-screen bg-gradient-to-br from-primary/20 via-background to-secondary/20 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl">
            <Button
              variant="outline"
              onClick={() => {
                setShowLanguageSelector(false);
                const message = t('backToSettings', {
                  english: 'Returned to settings',
                  hausa: 'Koma zuwa saituna',
                  kanuri: 'Koma zuwa saituna',
                  arabic: 'العودة إلى الإعدادات',
                });
                setAnnouncement(message);
                if (isAudioNavigationMode) {
                  speakText(message, 'medium');
                }
              }}
              className="mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('back', {
                english: 'Back',
                hausa: 'Koma',
                kanuri: 'Koma',
                arabic: 'رجوع',
              })}
            </Button>
            <div className="bg-card p-8 rounded-2xl shadow-lg">
              <LanguageSelector onSelect={handleLanguageChange} currentLanguage={user.language} />
            </div>
          </div>
        </div>
      ) : (
        <div className="container mx-auto px-4 py-6 max-w-4xl relative z-10">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8 animate-slide-up">
            <Button
              variant="outline"
              size="icon"
              onClick={() => {
                router.push('/dashboard');
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
              }}
              className="hover:shadow-glow hover:border-primary/50 transition-all"
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
              <div className="p-2 bg-gradient-to-br from-primary to-secondary rounded-xl shadow-glow">
                <SettingsIcon className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {t('settings', translations.settings)}
              </h1>
            </div>
          </div>

          <div className="space-y-6">
            {/* Language Settings */}
            <Card className="border-primary/20 shadow-lg hover:shadow-glow transition-all animate-scale-in">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <span className="w-1 h-6 bg-gradient-to-b from-primary to-secondary rounded-full" />
                  {t('language', {
                    english: 'Language',
                    hausa: 'Harshe',
                    kanuri: 'Harshe',
                    arabic: 'اللغة',
                  })}
                </CardTitle>
                <CardDescription className="text-base">
                  {t('changeLanguage', {
                    english: 'Change your learning language',
                    hausa: 'Canza harshen koyo',
                    kanuri: 'Canza harshen koyo',
                    arabic: 'تغيير لغة التعلم',
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  onClick={() => {
                    setShowLanguageSelector(true);
                    const message = t('languageSelectorOpened', {
                      english: 'Language selector opened',
                      hausa: 'Zabin harshe ya buɗe',
                      kanuri: 'Zabin harshe ya buɗe',
                      arabic: 'تم فتح محدد اللغة',
                    });
                    setAnnouncement(message);
                    if (isAudioNavigationMode) {
                      speakText(message, 'medium');
                    }
                  }}
                  variant="outline"
                  size="lg"
                  className="bg-gradient-to-r from-primary/10 to-secondary/10 hover:from-primary/20 hover:to-secondary/20 border-primary/30 hover:shadow-glow transition-all"
                >
                  {t('changeLanguageButton', {
                    english: 'Change Language',
                    hausa: 'Canza Harshe',
                    kanuri: 'Canza Harshe',
                    arabic: 'تغيير اللغة',
                  })}
                </Button>
              </CardContent>
            </Card>

            {/* Accessibility Settings */}
            <Card className="border-secondary/20 shadow-lg hover:shadow-glow transition-all animate-scale-in" style={{ animationDelay: '0.1s' }}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-xl">
                  <span className="w-1 h-6 bg-gradient-to-b from-secondary to-accent rounded-full" />
                  {t('accessibility', {
                    english: 'Accessibility Settings',
                    hausa: 'Saitunan Samun Dama',
                    kanuri: 'Saitunan Samun Dama',
                    arabic: 'إعدادات إمكانية الوصول',
                  })}
                </CardTitle>
                <CardDescription className="text-base">
                  {t('customizeApp', {
                    english: 'Customize the app for your needs',
                    hausa: 'Daidaita app don bukatunka',
                    kanuri: 'Daidaita app bukatunka',
                    arabic: 'تخصيص التطبيق لاحتياجاتك',
                  })}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-primary/5 to-transparent hover:from-primary/10 transition-all">
                  <div className="space-y-0.5">
                    <Label htmlFor="dyslexia-font" className="text-base font-semibold">
                      {t('dyslexiaFont', translations.dyslexiaFont)}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {t('dyslexiaFontDesc', {
                        english: 'Easier to read font',
                        hausa: 'Rubutu mai sauƙin karatu',
                        kanuri: 'Rubutu mai sauƙi',
                        arabic: 'خط أسهل للقراءة',
                      })}
                    </p>
                  </div>
                  <Switch
                    id="dyslexia-font"
                    checked={isDyslexiaMode}
                    onCheckedChange={() => handleToggle('dyslexiaFont')}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-accent/5 to-transparent hover:from-accent/10 transition-all">
                  <div className="space-y-0.5">
                    <Label htmlFor="audio-navigation" className="text-base font-semibold">
                      {t('audioNavigation', {
                        english: 'Audio Navigation',
                        hausa: 'Kewayawa da Murya',
                        kanuri: 'Murya Kewayawa',
                        arabic: 'التنقل الصوتي',
                      })}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {t('audioNavigationDesc', {
                        english: 'Navigate the app using voice commands',
                        hausa: 'Yi amfani da umarnin murya don kewayawa',
                        kanuri: 'Murya umarni amfani kewayawa don',
                        arabic: 'التنقل في التطبيق باستخدام الأوامر الصوتية',
                      })}
                    </p>
                    {isListening && (
                      <div className="flex items-center gap-2 mt-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-green-600 font-medium">
                          {t('listening', {
                            english: 'Listening...',
                            hausa: 'Ina saurare...',
                            kanuri: 'Saurare...',
                            arabic: 'أستمع...',
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                  <Switch
                    id="audio-navigation"
                    checked={isAudioNavigationMode}
                    onCheckedChange={() => handleToggle('audioNavigation')}
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-r from-secondary/5 to-transparent hover:from-secondary/10 transition-all">
                  <div className="space-y-0.5">
                    <Label htmlFor="subtitles" className="text-base font-semibold">
                      {t('subtitles', translations.subtitles)}
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {t('subtitlesDesc', {
                        english: 'Show text with audio',
                        hausa: 'Nuna rubutu tare da sauti',
                        kanuri: 'Nuna rubutu sauti tare',
                        arabic: 'إظهار النص مع الصوت',
                      })}
                    </p>
                  </div>
                  <Switch
                    id="subtitles"
                    checked={user.settings.subtitles}
                    onCheckedChange={() => handleToggle('subtitles')}
                  />
                </div>

                <div className="space-y-3 p-4 rounded-xl bg-gradient-to-r from-primary/5 to-transparent">
                  <Label className="text-base font-semibold">
                    {t('audioSpeed', translations.audioSpeed)}
                  </Label>
                  <Button
                    onClick={handleSpeedChange}
                    variant="outline"
                    size="lg"
                    className="w-full bg-card hover:bg-primary/10 border-primary/30 hover:shadow-glow transition-all"
                  >
                    {user.settings.audioSpeed === 'normal'
                      ? t('normal', {
                          english: 'Normal',
                          hausa: 'Na Yau da Kullun',
                          kanuri: 'Na Yau da Kullun',
                          arabic: 'عادي',
                        })
                      : user.settings.audioSpeed === 'slow'
                      ? t('slow', {
                          english: 'Slow',
                          hausa: 'Sannu',
                          kanuri: 'Sannu',
                          arabic: 'بطيء',
                        })
                      : t('verySlow', {
                          english: 'Very Slow',
                          hausa: 'Sannu Sosai',
                          kanuri: 'Sannu Sosai',
                          arabic: 'بطيء جدًا',
                        })}
                  </Button>
                </div>

                <div className="space-y-3 p-4 rounded-xl bg-gradient-to-r from-secondary/5 to-transparent">
                  <Label className="text-base font-semibold">
                    {t('audioPitch', {
                      english: 'Audio Pitch',
                      hausa: 'Sautin Sauti',
                      kanuri: 'Sautin Sauti',
                      arabic: 'نبرة الصوت',
                    })}
                  </Label>
                  <Button
                    onClick={handlePitchChange}
                    variant="outline"
                    size="lg"
                    className="w-full bg-card hover:bg-secondary/10 border-secondary/30 hover:shadow-glow transition-all"
                  >
                    {user.settings.audioPitch === 'normal'
                      ? t('normal', {
                          english: 'Normal',
                          hausa: 'Na Yau da Kullun',
                          kanuri: 'Na Yau da Kullun',
                          arabic: 'عادي',
                        })
                      : t('high', {
                          english: 'High',
                          hausa: 'Babba',
                          kanuri: 'Babba',
                          arabic: 'عالي',
                        })}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SettingsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return <SettingsContent />;
}