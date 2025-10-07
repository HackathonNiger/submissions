/**
 * Voice utility functions for Nigerian-like voice selection
 */

export interface VoiceConfig {
  lang: string
  voiceName?: string
  rate: number
  pitch: number
}

/**
 * Get Nigerian-like voice configuration based on language
 * @param language - The current application language
 * @param userSettings - User's audio settings
 * @returns Voice configuration object
 */
export function getNigerianVoiceConfig(
  language: string, 
  userSettings?: { audioSpeed?: string; audioPitch?: string }
): VoiceConfig {
  // Base configuration for Nigerian-like voice characteristics
  const baseConfig: VoiceConfig = {
    lang: 'en-NG', // Nigerian English as fallback
    rate: userSettings?.audioSpeed === 'slow' ? 0.7 : userSettings?.audioSpeed === 'very-slow' ? 0.5 : 0.9,
    pitch: userSettings?.audioPitch === 'high' ? 1.2 : 1.0
  }

  // Language-specific configurations with Nigerian voice preferences
  switch (language) {
    case 'hausa':
      return {
        ...baseConfig,
        lang: 'ha-NG', // Hausa (Nigeria)
        voiceName: 'Microsoft Zira - English (Nigeria)', // Fallback to Nigerian English
        rate: baseConfig.rate * 0.95, // Slightly slower for clarity
        pitch: baseConfig.pitch * 0.95 // Slightly lower pitch for authenticity
      }
    
    case 'kanuri':
      return {
        ...baseConfig,
        lang: 'en-NG', // Use Nigerian English for Kanuri
        voiceName: 'Microsoft Zira - English (Nigeria)',
        rate: baseConfig.rate * 0.9, // Slower for non-native language
        pitch: baseConfig.pitch * 0.9 // Lower pitch for Nigerian accent
      }
    
    case 'arabic':
      return {
        ...baseConfig,
        lang: 'ar-SA', // Arabic (Saudi Arabia) as base
        voiceName: 'Microsoft Naayf - Arabic (Saudi Arabia)', // Fallback
        rate: baseConfig.rate * 0.85, // Slower for clarity
        pitch: baseConfig.pitch * 0.95 // Slightly lower pitch
      }
    
    default: // English
      return {
        ...baseConfig,
        lang: 'en-NG', // Nigerian English
        voiceName: 'Microsoft Zira - English (Nigeria)',
        rate: baseConfig.rate,
        pitch: baseConfig.pitch
      }
  }
}

/**
 * Find and select the best Nigerian-like voice for the given language
 * @param language - The current application language
 * @param userSettings - User's audio settings
 * @returns Promise<SpeechSynthesisVoice | null>
 */
export function selectNigerianVoice(
  language: string,
  userSettings?: { audioSpeed?: string; audioPitch?: string }
): SpeechSynthesisVoice | null {
  if (!('speechSynthesis' in window)) {
    return null
  }

  let voices = speechSynthesis.getVoices()
  
  // If voices are not loaded yet, try to trigger loading
  if (voices.length === 0) {
    speechSynthesis.getVoices()
    voices = speechSynthesis.getVoices()
  }
  const config = getNigerianVoiceConfig(language, userSettings)

  // Priority order for voice selection
  const voiceSelectionPriority = [
    // First priority: Exact Nigerian voices
    (voice: SpeechSynthesisVoice) => 
      voice.lang.includes('NG') || voice.name.toLowerCase().includes('nigeria'),
    
    // Second priority: African English voices
    (voice: SpeechSynthesisVoice) => 
      voice.lang.includes('ZA') || voice.name.toLowerCase().includes('south africa'),
    
    // Third priority: British English (closer to Nigerian accent than American)
    (voice: SpeechSynthesisVoice) => 
      voice.lang.includes('GB') || voice.name.toLowerCase().includes('british'),
    
    // Fourth priority: Language-specific voices
    (voice: SpeechSynthesisVoice) => 
      voice.lang.startsWith(config.lang.split('-')[0]),
    
    // Fifth priority: Any English voice
    (voice: SpeechSynthesisVoice) => 
      voice.lang.startsWith('en')
  ]

  // Try each priority level
  for (const priorityCheck of voiceSelectionPriority) {
    const matchingVoices = voices.filter(priorityCheck)
    if (matchingVoices.length > 0) {
      // Prefer female voices for educational content (generally more pleasant)
      const femaleVoice = matchingVoices.find(voice => 
        voice.name.toLowerCase().includes('female') || 
        voice.name.toLowerCase().includes('zira') ||
        voice.name.toLowerCase().includes('hazel') ||
        voice.name.toLowerCase().includes('susan')
      )
      
      return femaleVoice || matchingVoices[0]
    }
  }

  // Fallback to first available voice
  return voices.length > 0 ? voices[0] : null
}

/**
 * Create and configure a speech utterance with Nigerian voice characteristics
 * @param text - Text to speak
 * @param language - Current application language
 * @param userSettings - User's audio settings
 * @returns Configured SpeechSynthesisUtterance
 */
export function createNigerianUtterance(
  text: string,
  language: string,
  userSettings?: { audioSpeed?: string; audioPitch?: string }
): SpeechSynthesisUtterance {
  const utterance = new SpeechSynthesisUtterance(text)
  const config = getNigerianVoiceConfig(language, userSettings)
  const selectedVoice = selectNigerianVoice(language, userSettings)

  // Apply voice configuration
  utterance.lang = config.lang
  utterance.rate = config.rate
  utterance.pitch = config.pitch
  utterance.volume = 1.0

  // Set the selected voice if available
  if (selectedVoice) {
    utterance.voice = selectedVoice
  }

  return utterance
}

/**
 * Speak text with Nigerian voice characteristics
 * @param text - Text to speak
 * @param language - Current application language
 * @param userSettings - User's audio settings
 * @param onEnd - Optional callback when speech ends
 * @param onError - Optional callback when speech errors
 */
export function speakWithNigerianVoice(
  text: string,
  language: string,
  userSettings?: { audioSpeed?: string; audioPitch?: string },
  onEnd?: () => void,
  onError?: (error: SpeechSynthesisErrorEvent) => void
): void {
  if (!('speechSynthesis' in window) || !text) {
    return
  }

  // Cancel any ongoing speech
  speechSynthesis.cancel()

  const utterance = createNigerianUtterance(text, language, userSettings)

  if (onEnd) {
    utterance.onend = onEnd
  }

  if (onError) {
    utterance.onerror = onError
  }

  speechSynthesis.speak(utterance)
}
