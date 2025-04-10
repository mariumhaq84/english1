import React, { useEffect, useState } from "react";
import { CheckCircle, AlertCircle, Info, AlertTriangle, Trophy } from "lucide-react";

interface StatusMessageProps {
  type: "success" | "error" | "info" | "warning";
  message: string;
  duration?: number;
  onDismiss?: () => void;
}

const StatusMessage: React.FC<StatusMessageProps> = ({
  type,
  message,
  duration = 3000,
  onDismiss,
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      if (onDismiss) onDismiss();
    }, duration);

    return () => clearTimeout(timer);
  }, [message, duration, onDismiss]);

  const getBgColor = () => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-800 border-green-300";
      case "error":
        return "bg-red-100 text-red-800 border-red-300";
      case "warning":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "info":
        return "bg-blue-100 text-blue-800 border-blue-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-600" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case "info":
        return <Info className="h-5 w-5 text-blue-600" />;
      default:
        return null;
    }
  };

  const getAnimation = () => {
    if (type === "success") return "animate-bounce-once";
    if (type === "error") return "animate-shake";
    return "animate-fade-in";
  };

  // Check if message contains score information
  const hasScoreInfo = message.includes("score") || message.includes("Score");

  if (!visible) return null;

  return (
    <div 
      className={`p-3 mb-4 rounded-md border shadow-md ${getBgColor()} ${getAnimation()} transition-all duration-300`}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          {getIcon()}
          <p className="text-sm font-medium">
            {hasScoreInfo ? (
              <>
                {message.split('Your score:')[0]}
                <span className="font-bold flex items-center gap-1 mt-1">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  Your score: {message.split('Your score:')[1]}
                </span>
              </>
            ) : (
              message
            )}
          </p>
        </div>
        <button 
          onClick={() => {
            setVisible(false);
            if (onDismiss) onDismiss();
          }}
          className="text-sm font-bold hover:opacity-70 ml-2"
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default StatusMessage;
