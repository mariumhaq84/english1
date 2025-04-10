import React, { useState, useEffect } from "react";

interface ScoreDisplayProps {
  score: number;
  mistakes: number;
  maxScore?: number;
  totalPossibleScore?: number;
  penaltyPoints?: number;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ 
  score, 
  mistakes, 
  maxScore = 10,
  totalPossibleScore = 10,
  penaltyPoints = 0
}) => {
  const [prevScore, setPrevScore] = useState(score);
  const [isScoreChanged, setIsScoreChanged] = useState(false);
  
  // Detect score changes and trigger animation
  useEffect(() => {
    if (score !== prevScore) {
      setIsScoreChanged(true);
      setPrevScore(score);
      
      // Reset animation after a delay
      const timer = setTimeout(() => {
        setIsScoreChanged(false);
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [score, prevScore]);
  
  // Calculate percentage for color coding
  const percentage = Math.min(Math.max((score / totalPossibleScore) * 100, 0), 100);
  
  // Determine color based on score
  const getScoreColor = () => {
    if (percentage >= 80) return "text-green-600"; // Great score
    if (percentage >= 60) return "text-blue-600";  // Good score
    if (percentage >= 40) return "text-yellow-600"; // OK score
    return "text-purple-600"; // Needs improvement
  };
  
  // Log to verify the component is receiving the correct data
  console.log("ScoreDisplay rendering:", { score, mistakes, totalPossibleScore });
  
  return (
    <div className={`inline-flex items-center bg-white/90 rounded-full shadow-md border-2 ${isScoreChanged ? 'border-yellow-300 animate-pulse' : 'border-purple-100'} py-1 px-4 transition-all duration-300 transform ${isScoreChanged ? 'scale-110' : 'scale-100'}`}>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-purple-600 mr-0.5">Score:</span>
        <p className={`font-bold ${getScoreColor()} flex items-center text-base`}>
          <span className={isScoreChanged ? 'animate-bounce' : ''}>{score}</span>
          <span className="text-xs text-gray-500 mx-1">/</span>
          <span>{totalPossibleScore}</span>
        </p>
      </div>
    </div>
  );
};

export default ScoreDisplay;
