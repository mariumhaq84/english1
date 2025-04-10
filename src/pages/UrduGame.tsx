import React, { useState, useEffect } from "react";
import { GameStage, GameState, WordItem, PerformanceMetrics } from "@/types";
import { createPartialWord, shuffleArray } from "@/utils/wordUtils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Trophy,
  Leaf,
  Clock,
  Star,
  Cloud,
  Flower,
  Bird as BirdIcon
} from "lucide-react";
import MemorizeDisplay from "@/components/MemorizeDisplay";
import PartialWordDisplay from "@/components/PartialWordDisplay";
import CompleteWordInput from "@/components/CompleteWordInput";
import TimerDisplay from "@/components/TimerDisplay";
import ScoreDisplay from "@/components/ScoreDisplay";
import StatusMessage from "@/components/StatusMessage";
import PerformanceDashboard from "@/components/PerformanceDashboard";
import UrduKeyboard from "@/components/UrduKeyboard";
import AudioPlayback from "@/components/AudioPlayback";

const TIMER_DURATION = 30; // seconds
const PARTIAL_STAGE_POINTS = 0.5;  // 0.5 points for completing partial stage
const COMPLETE_STAGE_POINTS = 0.5; // 0.5 points for completing complete stage
const PENALTY_PER_MISTAKE = 1;   // Penalty for each mistake

interface UrduGameProps {
  initialWords: WordItem[];
  onExit: () => void;
  onClearSavedWords?: () => void;
}

const UrduGame: React.FC<UrduGameProps> = ({ initialWords, onExit, onClearSavedWords }) => {
  const [gameState, setGameState] = useState<GameState>({
    words: shuffleArray(initialWords),
    currentWordIndex: 0,
    currentStage: GameStage.MEMORIZE,
    timeRemaining: TIMER_DURATION,
    score: 0,
    isTimerRunning: true,
    mistakes: 0,
    showSuccessAnimation: false // Add this flag to control animation
  });
  
  const [showDashboard, setShowDashboard] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error" | "info" | "warning"; message: string; } | null>(null);
  const [partialWordData, setPartialWordData] = useState<{ display: string, blanksIndices: number[] }>({ display: "", blanksIndices: [] });
  const [missingLetters, setMissingLetters] = useState<string[]>([]);
  const [penaltyPoints, setPenaltyPoints] = useState(0);
  const [wordScores, setWordScores] = useState<Record<string, { partial: boolean, complete: boolean }>>({});
  const [resetCounter, setResetCounter] = useState(0);
  
  const currentWord = gameState.words[gameState.currentWordIndex]?.word || "";
  const totalPossibleScore = gameState.words.length; 
  const currentMaxScore = Math.max(gameState.currentWordIndex, 1);

  useEffect(() => {
    if (gameState.currentStage === GameStage.PARTIAL) {
      const data = createPartialWord(currentWord);
      setPartialWordData(data);
      
      const letters = data.blanksIndices.map(index => currentWord[index] || "");
      setMissingLetters(letters);
    }
  }, [gameState.currentStage, currentWord, gameState.currentWordIndex]);

  const toggleDashboard = () => {
    setShowDashboard(prev => !prev);
  };

  const restartCurrentStage = () => {
    setStatusMessage(null);
    
    setGameState(prev => {
      const newPenaltyPoints = prev.isTimerRunning ? 0 : PENALTY_PER_MISTAKE;
      
      return {
        ...prev,
        timeRemaining: TIMER_DURATION,
        isTimerRunning: true,
        showSuccessAnimation: false // Reset animation flag
      };
    });
    
    setResetCounter(prev => prev + 1);
    
    if (!gameState.isTimerRunning) {
      setPenaltyPoints(prev => prev + PENALTY_PER_MISTAKE);
    }
    
    if (gameState.currentStage === GameStage.PARTIAL) {
      const data = createPartialWord(currentWord);
      setPartialWordData(data);
      
      const letters = data.blanksIndices.map(index => currentWord[index] || "");
      setMissingLetters(letters);
    }
  };

  const handleTimeUp = () => {
    setStatusMessage({
      type: "error",
      message: "Time's up! Try again."
    });
    
    setGameState(prev => ({
      ...prev,
      isTimerRunning: false,
      mistakes: prev.mistakes + 1,
      showSuccessAnimation: false // Ensure animation is off for incorrect answers
    }));
    
    setPenaltyPoints(prev => prev + PENALTY_PER_MISTAKE);
    
    setTimeout(() => {
      restartCurrentStage();
    }, 1500);
  };

  const moveToNextStage = () => {
    setGameState(prev => {
      const nextStage = (() => {
        switch(prev.currentStage) {
          case GameStage.MEMORIZE:
            return GameStage.PARTIAL;
          case GameStage.PARTIAL:
            return GameStage.COMPLETE;
          case GameStage.COMPLETE:
            return GameStage.MEMORIZE;
          default:
            return prev.currentStage;
        }
      })();
      
      const nextWordIndex = 
        prev.currentStage === GameStage.COMPLETE 
          ? (prev.currentWordIndex + 1) % prev.words.length 
          : prev.currentWordIndex;
      
      return {
        ...prev,
        currentStage: nextStage,
        currentWordIndex: nextWordIndex,
        timeRemaining: TIMER_DURATION,
        isTimerRunning: true,
        showSuccessAnimation: false // Reset animation flag
      };
    });
  };

  const handleIncorrectInput = () => {
    setStatusMessage({
      type: "error",
      message: "That's not right. Try again."
    });
    
    setGameState(prev => ({
      ...prev,
      mistakes: prev.mistakes + 1,
      isTimerRunning: false,
      showSuccessAnimation: false // Ensure animation is off for incorrect answers
    }));
    
    setPenaltyPoints(prev => prev + PENALTY_PER_MISTAKE);
    
    setTimeout(() => {
      restartCurrentStage();
    }, 1500);
  };

  const updateWordScore = (wordId: string, stage: 'partial' | 'complete', success: boolean) => {
    setWordScores(prev => {
      const currentWordScore = prev[wordId] || { partial: false, complete: false };
      
      // Only update the stage if it's a success or if it wasn't successful before
      // This ensures we keep the highest score for each stage
      const updatedStageValue = success || !currentWordScore[stage];
      
      return {
        ...prev,
        [wordId]: {
          ...currentWordScore,
          [stage]: success ? true : currentWordScore[stage] // Only update if success is true, otherwise keep previous value
        }
      };
    });
  };

  const calculateEffectiveScore = () => {
    let totalScore = 0;
    
    Object.values(wordScores).forEach(score => {
      // For each word, count only the highest score achieved
      if (score.partial && score.complete) {
        totalScore += 1; // 1 point for completing both stages
      } else if (score.partial || score.complete) {
        totalScore += 0.5; // Half a point for completing one stage
      }
    });
    
    // Apply penalty but keep score as simple as possible
    const finalScore = Math.max(0, totalScore - penaltyPoints);
    
    // Debug logging to verify scoring
    console.log('Score calculation:', { 
      wordScores, 
      totalScore, 
      penaltyPoints, 
      finalScore: Math.round(finalScore) 
    });
    
    return Math.round(finalScore); // Round to nearest whole number for simplicity
  };

  const handlePartialSubmit = (input: string) => {
    const isCorrect = checkPartialInput(input);
    const currentWordId = gameState.words[gameState.currentWordIndex]?.id;
    
    if (isCorrect) {
      updateWordScore(currentWordId, 'partial', true);
      
      const newScore = calculateEffectiveScore();
      
      // Remove success message - just update the score silently
      setStatusMessage(null);
      
      // Set success animation flag in the component state
      setGameState(prev => ({
        ...prev,
        score: newScore,
        isTimerRunning: false,
        showSuccessAnimation: true // Add this flag to control animation
      }));
      
      // Automatically move to the type word stage (COMPLETE stage) for the same word
      setTimeout(() => {
        setGameState(prev => ({
          ...prev,
          currentStage: GameStage.COMPLETE,
          timeRemaining: TIMER_DURATION,
          isTimerRunning: true,
          showSuccessAnimation: false // Reset animation flag
        }));
        setStatusMessage(null);
      }, 800);
    } else {
      setStatusMessage({
        type: "error",
        message: "That's not right. Try again."
      });
      
      setGameState(prev => ({
        ...prev,
        mistakes: prev.mistakes + 1,
        isTimerRunning: false,
        showSuccessAnimation: false // Ensure animation is off for incorrect answers
      }));
      
      setPenaltyPoints(prev => prev + PENALTY_PER_MISTAKE);
      
      setTimeout(() => {
        restartCurrentStage();
      }, 1500);
    }
  };

  const handleCompleteSubmit = (input: string) => {
    const isCorrect = input.trim().toLowerCase() === currentWord.trim().toLowerCase();
    const currentWordId = gameState.words[gameState.currentWordIndex]?.id;
    
    if (isCorrect) {
      updateWordScore(currentWordId, 'complete', true);
      
      const newScore = calculateEffectiveScore();
      
      // Remove success message - just update the score silently
      setStatusMessage(null);
      
      // Set success animation flag in the component state
      setGameState(prev => ({
        ...prev,
        score: newScore,
        isTimerRunning: false,
        showSuccessAnimation: true // Add this flag to control animation
      }));
      
      setTimeout(() => {
        moveToNextStage();
        setStatusMessage(null);
      }, 1500);
    } else {
      setStatusMessage({
        type: "error",
        message: "That's not right. Try again."
      });
      
      setGameState(prev => ({
        ...prev,
        mistakes: prev.mistakes + 1,
        isTimerRunning: false,
        showSuccessAnimation: false // Ensure animation is off for incorrect answers
      }));
      
      setPenaltyPoints(prev => prev + PENALTY_PER_MISTAKE);
      
      setTimeout(() => {
        restartCurrentStage();
      }, 1500);
    }
  };

  const checkPartialInput = (input: string): boolean => {
    const targetLetters = partialWordData.blanksIndices.map(index => currentWord[index]?.toLowerCase() || "");
    const inputLetters = input.split('').map(letter => letter.toLowerCase());
    
    return targetLetters.every((letter, index) => letter === inputLetters[index]);
  };

  const handlePreviousStage = () => {
    switch(gameState.currentStage) {
      case GameStage.PARTIAL:
        navigateToStage(GameStage.MEMORIZE);
        break;
      case GameStage.COMPLETE:
        navigateToStage(GameStage.PARTIAL);
        break;
      default:
        break;
    }
  };

  const handleNextStage = () => {
    switch(gameState.currentStage) {
      case GameStage.MEMORIZE:
        navigateToStage(GameStage.PARTIAL);
        break;
      case GameStage.PARTIAL:
        navigateToStage(GameStage.COMPLETE);
        break;
      case GameStage.COMPLETE:
        setGameState(prev => ({
          ...prev,
          currentWordIndex: (prev.currentWordIndex + 1) % prev.words.length,
          currentStage: GameStage.MEMORIZE,
          timeRemaining: TIMER_DURATION,
          isTimerRunning: true,
          showSuccessAnimation: false // Reset animation flag
        }));
        break;
    }
  };

  const navigateToStage = (stage: GameStage) => {
    setGameState(prev => ({
      ...prev,
      currentStage: stage,
      timeRemaining: TIMER_DURATION,
      isTimerRunning: true,
      showSuccessAnimation: false // Reset animation flag
    }));
    
    setStatusMessage(null);
    
    if (stage === GameStage.PARTIAL) {
      const data = createPartialWord(currentWord);
      setPartialWordData(data);
      
      const letters = data.blanksIndices.map(index => currentWord[index] || "");
      setMissingLetters(letters);
    }
  };

  const navigateToWord = (direction: 'prev' | 'next') => {
    setStatusMessage(null);
    
    setGameState(prev => {
      const totalWords = prev.words.length;
      let nextIndex;
      
      if (direction === 'next') {
        nextIndex = (prev.currentWordIndex + 1) % totalWords;
      } else {
        nextIndex = (prev.currentWordIndex - 1 + totalWords) % totalWords;
      }
      
      return {
        ...prev,
        currentWordIndex: nextIndex,
        currentStage: GameStage.MEMORIZE,
        timeRemaining: TIMER_DURATION,
        isTimerRunning: true,
        showSuccessAnimation: false // Reset animation flag
      };
    });
    
    setResetCounter(prev => prev + 1);
  };

  const calculatePerformanceMetrics = (): PerformanceMetrics => {
    const totalWords = gameState.words.length;
    const totalAttemptedWords = Object.keys(wordScores).length;
    const completedWords = Object.values(wordScores).filter(score => score.complete).length;
    const partialWords = Object.values(wordScores).filter(score => score.partial && !score.complete).length;
    const mistakesPerWord = gameState.mistakes / Math.max(1, totalAttemptedWords);
    
    const wordDifficulty = gameState.words.map((word) => {
      const wordId = word.id;
      const hasAttempted = wordScores[wordId] !== undefined;
      const isComplete = hasAttempted && wordScores[wordId].complete;
      const isPartial = hasAttempted && wordScores[wordId].partial;
      
      let difficulty: 'easy' | 'medium' | 'hard' | 'not attempted';
      
      if (!hasAttempted) {
        difficulty = 'not attempted';
      } else if (isComplete) {
        difficulty = 'easy';
      } else if (isPartial) {
        difficulty = 'medium';
      } else {
        difficulty = 'hard';
      }
      
      return {
        word: word.word,
        id: word.id,
        difficulty
      };
    });
    
    return {
      totalWords,
      completedWords,
      partialWords,
      notAttemptedWords: totalWords - completedWords - partialWords,
      mistakesPerWord,
      wordDifficulty,
      score: gameState.score,
      mistakes: gameState.mistakes,
      penaltyPoints
    };
  };

  if (showDashboard) {
    return (
      <PerformanceDashboard 
        metrics={calculatePerformanceMetrics()}
        onContinue={toggleDashboard}
        onExit={onExit}
      />
    );
  }

  return (
    <div className="relative">
      <div className="relative min-h-screen bg-gradient-to-b from-purple-50 to-indigo-50 overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-200 to-purple-300 rounded-bl-full opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-indigo-200 to-indigo-300 rounded-tr-full opacity-60"></div>
        
        {/* Subtle decorative elements */}
        <div className="absolute top-1/4 left-8 text-purple-300 animate-float" style={{ animationDelay: '0.2s' }}>
          <Leaf size={20} />
        </div>
        <div className="absolute top-1/3 right-8 text-indigo-400 animate-float" style={{ animationDelay: '0.7s' }}>
          <Flower size={20} />
        </div>
        <div className="absolute top-2/3 left-12 text-purple-400 animate-float" style={{ animationDelay: '1.2s' }}>
          <BirdIcon size={20} />
        </div>
        <div className="absolute top-1/5 right-1/4 text-indigo-200 animate-float" style={{ animationDelay: '1.8s' }}>
          <Cloud size={28} />
        </div>
        <div className="absolute bottom-1/4 right-1/5 text-purple-300 animate-float" style={{ animationDelay: '2.3s' }}>
          <Star size={18} />
        </div>
        
        {/* Floating particles - reduced number for less distraction */}
        {Array.from({ length: 6 }).map((_, i) => (
          <div 
            key={i}
            className="absolute rounded-full bg-indigo-300/20 animate-float"
            style={{
              width: `${Math.random() * 8 + 4}px`,
              height: `${Math.random() * 8 + 4}px`,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${Math.random() * 10 + 10}s`
            }}
          />
        ))}
      
        <div className="container max-w-4xl mx-auto py-3 px-3 relative z-10">
          <div className="flex justify-between items-center mb-3">
            <div className="flex gap-1">
              <Button 
                variant="outline" 
                size="sm"
                onClick={onExit}
                className="flex items-center gap-1 bg-white hover:bg-purple-50 border-purple-200 text-purple-700 hover:text-purple-800 transition-all text-xs py-1 px-2"
              >
                <ArrowLeft size={14} />
                Word List
              </Button>
            </div>
            
            <div className="flex items-center bg-white/80 rounded-full shadow-sm p-0 border border-purple-100">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigateToWord('prev')}
                className="flex items-center justify-center rounded-full h-6 w-6 text-purple-600 hover:text-purple-700 hover:bg-purple-50 p-0"
              >
                <ChevronLeft size={14} />
              </Button>
              
              <div className="text-center px-2 py-0.5">
                <span className="font-medium text-purple-700 text-xs">
                  Word {gameState.currentWordIndex + 1}/{gameState.words.length}
                </span>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigateToWord('next')}
                className="flex items-center justify-center rounded-full h-6 w-6 text-purple-600 hover:text-purple-700 hover:bg-purple-50 p-0"
              >
                <ChevronRight size={14} />
              </Button>
            </div>
            
            <ScoreDisplay 
              score={gameState.score} 
              mistakes={gameState.mistakes} 
              maxScore={totalPossibleScore}
              totalPossibleScore={totalPossibleScore}
              penaltyPoints={penaltyPoints}
            />
          </div>
          
          <Card className="mb-3 relative bg-white/90 border-purple-100 shadow-md rounded-xl overflow-hidden">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={toggleDashboard}
              className="absolute top-2 right-2 rounded-full h-6 w-6 z-10 hover:bg-red-50 hover:text-red-500 transition-all"
            >
              <X size={14} />
            </Button>
            
            <CardContent className="p-4">
              {statusMessage && (
                <StatusMessage 
                  type={statusMessage.type} 
                  message={statusMessage.message} 
                  onDismiss={() => setStatusMessage(null)}
                />
              )}
              
              <div className="py-6">
                {gameState.currentStage === GameStage.MEMORIZE && (
                  <div className="flex flex-col items-center space-y-4">
                    <AudioPlayback 
                      text={currentWord} 
                      stage="memorize" 
                      autoPlay={true}
                      className="hidden"
                    />
                    <MemorizeDisplay 
                      word={currentWord} 
                      seconds={TIMER_DURATION}
                      onTimeUp={handleTimeUp}
                      isTimerRunning={gameState.isTimerRunning}
                      onNextStage={handleNextStage}
                    />
                  </div>
                )}
                
                {gameState.currentStage === GameStage.PARTIAL && (
                  <div className="flex flex-col items-center space-y-6">
                    <AudioPlayback 
                      text={currentWord} 
                      stage="partial" 
                      autoPlay={true}
                      className="hidden"
                    />
                    <PartialWordDisplay 
                      key={`partial-${resetCounter}`}
                      displayWord={partialWordData.display} 
                      missingLetters={missingLetters}
                      onComplete={handlePartialSubmit}
                      onIncorrectInput={handleIncorrectInput}
                      onPreviousStage={handlePreviousStage}
                      onNextStage={handleNextStage}
                      showSuccessAnimation={gameState.showSuccessAnimation}
                    />
                    
                    <div className="w-full">
                      <TimerDisplay 
                        seconds={TIMER_DURATION} 
                        onTimeUp={handleTimeUp} 
                        isRunning={gameState.isTimerRunning} 
                      />
                    </div>
                  </div>
                )}
                
                {gameState.currentStage === GameStage.COMPLETE && (
                  <div className="flex flex-col items-center space-y-6">
                    <AudioPlayback 
                      text={currentWord} 
                      stage="complete" 
                      autoPlay={true}
                      className="hidden"
                    />
                    <CompleteWordInput 
                      key={`complete-${resetCounter}`}
                      onSubmit={handleCompleteSubmit}
                      wordLength={currentWord.length}
                      onPreviousStage={handlePreviousStage}
                      showSuccessAnimation={gameState.showSuccessAnimation}
                    />
                    
                    <div className="w-full">
                      <TimerDisplay 
                        seconds={TIMER_DURATION} 
                        onTimeUp={handleTimeUp} 
                        isRunning={gameState.isTimerRunning} 
                      />
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {showDashboard && (
        <PerformanceDashboard 
          metrics={calculatePerformanceMetrics()}
          onContinue={toggleDashboard}
          onExit={onExit}
        />
      )}
    </div>
  );
};

export default UrduGame;
