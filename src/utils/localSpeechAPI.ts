// Local Speech Synthesis API using the Web Speech API

/**
 * Available voices for different stages
 */
export type VoiceType = 'default' | 'female' | 'male';

/**
 * Play audio using the browser's Speech Synthesis API
 * @param text The text to speak
 * @param voiceType The type of voice to use
 * @returns A Promise that resolves when the audio has finished playing
 */
export function speakTextLocally(
  text: string,
  voiceType: VoiceType = 'default'
): Promise<void> {
  return new Promise((resolve, reject) => {
    if (!window.speechSynthesis) {
      reject(new Error('Speech synthesis not supported in this browser'));
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set voice based on voiceType
    const voices = window.speechSynthesis.getVoices();
    
    // If voices aren't loaded yet, wait for them
    if (voices.length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {
        setVoiceForUtterance(utterance, voiceType);
        speakWithUtterance(utterance, resolve);
      };
    } else {
      setVoiceForUtterance(utterance, voiceType);
      speakWithUtterance(utterance, resolve);
    }
  });
}

/**
 * Set the appropriate voice for the utterance based on voice type
 */
function setVoiceForUtterance(utterance: SpeechSynthesisUtterance, voiceType: VoiceType): void {
  const voices = window.speechSynthesis.getVoices();
  
  // Try to find appropriate voices based on type
  let selectedVoice: SpeechSynthesisVoice | null = null;
  
  switch (voiceType) {
    case 'female':
      // Try to find a female voice (many female voices contain 'female' or have female names)
      selectedVoice = voices.find(voice => 
        voice.name.toLowerCase().includes('female') || 
        voice.name.includes('Samantha') ||
        voice.name.includes('Victoria') ||
        voice.name.includes('Karen')
      ) || null;
      break;
    case 'male':
      // Try to find a male voice
      selectedVoice = voices.find(voice => 
        voice.name.toLowerCase().includes('male') || 
        voice.name.includes('Daniel') ||
        voice.name.includes('David') ||
        voice.name.includes('Thomas')
      ) || null;
      break;
    default:
      // Default voice - try to find a neutral voice
      selectedVoice = voices.find(voice => 
        voice.name.includes('Google') || 
        voice.lang.startsWith('en-')
      ) || null;
      break;
  }
  
  // If we couldn't find a specific voice, just use the first available English voice
  if (!selectedVoice) {
    selectedVoice = voices.find(voice => voice.lang.startsWith('en-')) || voices[0];
  }
  
  if (selectedVoice) {
    utterance.voice = selectedVoice;
  }
  
  // Set other properties
  utterance.rate = 1.0;  // Speed of speech
  utterance.pitch = 1.0; // Pitch of voice
  utterance.volume = 1.0; // Volume
}

/**
 * Speak with the configured utterance and resolve the promise when done
 */
function speakWithUtterance(utterance: SpeechSynthesisUtterance, resolve: () => void): void {
  utterance.onend = () => {
    resolve();
  };
  
  utterance.onerror = (event) => {
    console.error('Speech synthesis error:', event);
    resolve(); // Resolve anyway to prevent hanging
  };
  
  window.speechSynthesis.speak(utterance);
}

// Cache for storing voice selections to avoid repeated lookups
const voiceCache = new Map<VoiceType, SpeechSynthesisVoice>();

/**
 * Generate and play speech with caching to avoid repeated voice lookups
 * @param text The text to speak
 * @param voiceType The type of voice to use
 * @returns A Promise that resolves when the audio has finished playing
 */
export async function speakTextWithCache(
  text: string,
  voiceType: VoiceType = 'default'
): Promise<void> {
  try {
    await speakTextLocally(text, voiceType);
    return Promise.resolve();
  } catch (error) {
    console.error('Error speaking text with local synthesis:', error);
    return Promise.reject(error);
  }
}
