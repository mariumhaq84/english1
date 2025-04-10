
// Function to create a partially filled word with blanks
export const createPartialWord = (word: string): { display: string; blanksIndices: number[] } => {
  if (word.length <= 2) {
    return { display: '_ '.repeat(word.length).trim(), blanksIndices: [0] };
  }
  
  // Determine number of blanks (at least 2 or 40% of the word, whichever is greater)
  const numBlanks = Math.max(2, Math.floor(word.length * 0.4));
  
  // Create array of indices and shuffle them to randomly select positions for blanks
  const indices = Array.from({ length: word.length }, (_, i) => i);
  const shuffledIndices = [...indices].sort(() => Math.random() - 0.5);
  
  // Select the first numBlanks indices from the shuffled array
  const blanksIndices = shuffledIndices.slice(0, numBlanks).sort((a, b) => a - b);
  
  // Create the display string with blanks
  const display = word
    .split('')
    .map((char, idx) => blanksIndices.includes(idx) ? '_' : char)
    .join('');
  
  return { display, blanksIndices };
};

// Function to shuffle array (Fisher-Yates algorithm)
export const shuffleArray = <T>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// Function to validate user input for partial word stage
export const validatePartialInput = (
  userInput: string, 
  originalWord: string, 
  blanksIndices: number[]
): boolean => {
  const userChars = userInput.split('');
  const originalChars = originalWord.split('');
  
  for (let i = 0; i < blanksIndices.length; i++) {
    const blankIndex = blanksIndices[i];
    if (userChars[i] !== originalChars[blankIndex]) {
      return false;
    }
  }
  
  return true;
};

// Function to generate unique ID
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};

// Get individual letter input positions for a word with blank indices
export const getLetterPositions = (word: string, blanksIndices: number[]): string[] => {
  return blanksIndices.map(index => word[index] || '');
};
