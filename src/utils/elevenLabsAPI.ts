// Eleven Labs API integration for text-to-speech
// IMPORTANT: This is a client-side implementation and should be replaced with a server-side implementation in production
// to avoid exposing API keys in the client code.

const ELEVEN_LABS_API_URL = 'https://api.elevenlabs.io/v1';

// Voice IDs - you can replace these with preferred voices from your Eleven Labs account
const VOICES = {
  default: 'pNInz6obpgDQGcFmaJgB', // Example voice ID, replace with your preferred voice
  female: '21m00Tcm4TlvDq8ikWAM',  // Example female voice
  male: 'AZnzlk1XvdvUeBnXmlld',    // Example male voice
};

// Model ID - you can replace this with your preferred model
const MODEL_ID = 'eleven_multilingual_v2';

/**
 * Generate speech from text using Eleven Labs API
 * @param text The text to convert to speech
 * @param apiKey Your Eleven Labs API key
 * @param voiceId The voice ID to use (defaults to 'default')
 * @returns A Promise that resolves to an ArrayBuffer containing the audio data
 */
export async function generateSpeech(
  text: string, 
  apiKey: string,
  voiceId: keyof typeof VOICES = 'default'
): Promise<ArrayBuffer> {
  const voice = VOICES[voiceId] || VOICES.default;
  
  const response = await fetch(`${ELEVEN_LABS_API_URL}/text-to-speech/${voice}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': apiKey,
    },
    body: JSON.stringify({
      text,
      model_id: MODEL_ID,
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.75,
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(`Eleven Labs API error: ${response.status} ${response.statusText} ${JSON.stringify(errorData)}`);
  }

  return await response.arrayBuffer();
}

/**
 * Play audio from an ArrayBuffer
 * @param audioData The audio data as an ArrayBuffer
 * @returns A Promise that resolves when the audio has finished playing
 */
export function playAudio(audioData: ArrayBuffer): Promise<void> {
  return new Promise((resolve) => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    audioContext.decodeAudioData(audioData, (buffer) => {
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(audioContext.destination);
      
      source.onended = () => {
        resolve();
      };
      
      source.start(0);
    });
  });
}

/**
 * Generate and play speech from text
 * @param text The text to speak
 * @param apiKey Your Eleven Labs API key
 * @param voiceId The voice ID to use
 * @returns A Promise that resolves when the audio has finished playing
 */
export async function speakText(
  text: string, 
  apiKey: string,
  voiceId: keyof typeof VOICES = 'default'
): Promise<void> {
  try {
    const audioData = await generateSpeech(text, apiKey, voiceId);
    await playAudio(audioData);
    return Promise.resolve();
  } catch (error) {
    console.error('Error speaking text:', error);
    return Promise.reject(error);
  }
}

// Cache for storing generated audio to avoid repeated API calls
const audioCache = new Map<string, ArrayBuffer>();

/**
 * Generate and play speech with caching to avoid repeated API calls
 * @param text The text to speak
 * @param apiKey Your Eleven Labs API key
 * @param voiceId The voice ID to use
 * @returns A Promise that resolves when the audio has finished playing
 */
export async function speakTextWithCache(
  text: string, 
  apiKey: string,
  voiceId: keyof typeof VOICES = 'default'
): Promise<void> {
  const cacheKey = `${text}-${voiceId}`;
  
  try {
    let audioData: ArrayBuffer;
    
    if (audioCache.has(cacheKey)) {
      audioData = audioCache.get(cacheKey)!;
    } else {
      audioData = await generateSpeech(text, apiKey, voiceId);
      audioCache.set(cacheKey, audioData);
    }
    
    await playAudio(audioData);
    return Promise.resolve();
  } catch (error) {
    console.error('Error speaking text with cache:', error);
    return Promise.reject(error);
  }
}
