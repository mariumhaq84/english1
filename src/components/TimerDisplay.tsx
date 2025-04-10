import React, { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Clock, Star } from "lucide-react";

interface TimerDisplayProps {
  seconds: number;
  onTimeUp: () => void;
  isRunning: boolean;
}

const TimerDisplay: React.FC<TimerDisplayProps> = ({ seconds, onTimeUp, isRunning }) => {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const percentLeft = (timeLeft / seconds) * 100;

  // Reset the timer when seconds prop changes
  useEffect(() => {
    setTimeLeft(seconds);
  }, [seconds]);

  // Reset timer when isRunning changes or when component rerenders with isRunning=true
  useEffect(() => {
    if (isRunning) {
      setTimeLeft(seconds);
    }
  }, [isRunning, seconds]);

  // Handle the timer countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isRunning && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && isRunning) {
      onTimeUp();
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [timeLeft, onTimeUp, isRunning]);

  // Get the color class for the progress bar
  const getColorClass = () => {
    if (percentLeft > 60) return "from-blue-400 to-green-400";
    if (percentLeft > 30) return "from-yellow-400 to-orange-400";
    return "from-red-400 to-pink-400";
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      {/* Simple timer display */}
      <div className="w-full flex items-center justify-between px-3 py-2 bg-white/80 rounded-lg shadow-sm">
        <div className="flex items-center gap-2">
          <Clock 
            className={`${percentLeft <= 30 ? 'text-red-500' : 'text-blue-500'}`} 
            size={18} 
          />
          <span className="font-bold text-purple-700">
            {timeLeft}s
          </span>
        </div>
      </div>
      
      {/* Progress bar with stars */}
      <div className="w-full relative">
        <Progress
          value={percentLeft}
          className="w-full h-4 rounded-full"
          indicatorClassName={`bg-gradient-to-r ${getColorClass()}`}
          showStars={true}
        />
      </div>
    </div>
  );
};

export default TimerDisplay;
