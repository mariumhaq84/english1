import React, { useEffect } from "react";
import TimerDisplay from "./TimerDisplay";
import AudioPlayback from "./AudioPlayback";
import StageDisplay from "./StageDisplay";
import { GameStage } from "@/types";

interface MemorizeDisplayProps {
  word: string;
  seconds?: number;
  onTimeUp?: () => void;
  isTimerRunning?: boolean;
  onNextStage?: () => void;
}

const MemorizeDisplay: React.FC<MemorizeDisplayProps> = ({ 
  word, 
  seconds, 
  onTimeUp, 
  isTimerRunning,
  onNextStage
}) => {
  // Add a console log to verify component is rendering with the latest data
  useEffect(() => {
    console.log("MemorizeDisplay rendering with word:", word);
  }, [word]);

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
      <StageDisplay 
        currentStage={GameStage.MEMORIZE}
        onNextStage={onNextStage}
      />
      <div className="bg-gradient-to-br from-green-50 to-orange-50 p-8 rounded-2xl shadow-lg border-4 border-orange-600 transform transition-transform hover:scale-105">
        <span className="text-5xl font-bold text-green-600 tracking-wider">{word}</span>
      </div>
      
      {/* Add audio playback button */}
      <div className="mt-4">
        <AudioPlayback 
          text={word} 
          stage="memorize" 
          autoPlay={false} 
          className="bg-orange-100 hover:bg-orange-200 text-orange-700 p-2"
        />
      </div>
      
      {/* Timer display under the word */}
      {seconds && onTimeUp && (
        <div className="w-full mt-6 mb-2">
          <TimerDisplay 
            seconds={seconds} 
            onTimeUp={onTimeUp} 
            isRunning={isTimerRunning || false} 
          />
        </div>
      )}
    </div>
  );
};

export default MemorizeDisplay;
