/**
 * Test utility for Nigerian voice implementation
 * This file can be used for testing voice functionality in development
 */

import { speakWithNigerianVoice, selectNigerianVoice, getNigerianVoiceConfig } from './voice-utils'

/**
 * Test Nigerian voice selection for different languages
 */
export function testNigerianVoices() {
  if (!('speechSynthesis' in window)) {
    console.log('❌ Speech synthesis not supported in this browser')
    return
  }

  const languages = ['english', 'hausa', 'kanuri', 'arabic']
  const testText = {
    english: "Hello, this is a test of the Nigerian voice system.",
    hausa: "Sannu, wannan gwaji ne na tsarin murya na Najeriya.",
    kanuri: "Sannu, wannan gwaji tsarin murya Najeriya.",
    arabic: "مرحبا، هذا اختبار لنظام الصوت النيجيري."
  }

  console.log('🎤 Testing Nigerian voice selection...')
  
  languages.forEach(language => {
    console.log(`\n--- Testing ${language.toUpperCase()} ---`)
    
    // Test voice configuration
    const config = getNigerianVoiceConfig(language)
    console.log('Voice config:', config)
    
    // Test voice selection
    const selectedVoice = selectNigerianVoice(language)
    if (selectedVoice) {
      console.log('Selected voice:', selectedVoice.name, '|', selectedVoice.lang)
    } else {
      console.log('No voice selected for', language)
    }
    
    // Test speech (uncomment to actually speak)
    // speakWithNigerianVoice(testText[language], language)
  })

  // List all available voices for reference
  console.log('\n--- All Available Voices ---')
  const allVoices = speechSynthesis.getVoices()
  allVoices.forEach(voice => {
    console.log(`${voice.name} (${voice.lang}) - ${voice.localService ? 'Local' : 'Remote'}`)
  })
}

/**
 * Test voice with specific text and language
 */
export function testVoiceWithText(text: string, language: string) {
  console.log(`🗣️ Testing voice for ${language}: "${text}"`)
  speakWithNigerianVoice(text, language)
}

/**
 * Compare standard voice vs Nigerian voice
 */
export function compareVoices(text: string, language: string) {
  console.log(`🔄 Comparing voices for ${language}`)
  
  // Standard voice
  console.log('Playing with standard voice...')
  const standardUtterance = new SpeechSynthesisUtterance(text)
  standardUtterance.lang = language === 'hausa' ? 'ha-NG' : 
                          language === 'arabic' ? 'ar-SA' : 'en-US'
  speechSynthesis.speak(standardUtterance)
  
  // Wait 3 seconds then play Nigerian voice
  setTimeout(() => {
    console.log('Playing with Nigerian voice...')
    speakWithNigerianVoice(text, language)
  }, 3000)
}
