export interface WordItem {
  id: string;
  word: string;
}

export enum GameStage {
  MEMORIZE = "memorize",
  PARTIAL = "partial",
  COMPLETE = "complete"
}

export interface GameState {
  words: WordItem[];
  currentWordIndex: number;
  currentStage: GameStage;
  timeRemaining: number;
  score: number;
  isTimerRunning: boolean;
  mistakes: number;
  showSuccessAnimation?: boolean; // Add this property to control success animations
}

export interface PerformanceMetrics {
  totalWords: number;
  completedWords: number;
  partialWords: number;
  notAttemptedWords: number;
  mistakesPerWord: number;
  wordDifficulty: {
    word: string;
    id: string;
    difficulty: 'easy' | 'medium' | 'hard' | 'not attempted';
  }[];
  score: number;
  mistakes: number;
  penaltyPoints: number;
}
