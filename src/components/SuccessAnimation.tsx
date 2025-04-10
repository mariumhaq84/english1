
import React, { useEffect, useState } from "react";

interface SuccessAnimationProps {
  isVisible: boolean;
  onComplete?: () => void;
}

const SuccessAnimation: React.FC<SuccessAnimationProps> = ({ isVisible, onComplete }) => {
  const [visible, setVisible] = useState(isVisible);
  
  useEffect(() => {
    setVisible(isVisible);
    
    if (isVisible) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onComplete) onComplete();
      }, 2000);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, onComplete]);
  
  if (!visible) return null;
  
  // Create confetti particles
  const confettiCount = 80;
  const confetti = Array.from({ length: confettiCount }).map((_, i) => {
    const size = Math.random() * 12 + 8;
    const colors = [
      "bg-kid-purple", "bg-kid-blue", "bg-kid-green", 
      "bg-kid-yellow", "bg-kid-orange", "bg-kid-pink"
    ];
    const color = colors[Math.floor(Math.random() * colors.length)];
    const left = `${Math.random() * 100}%`;
    const animationDelay = `${Math.random() * 0.5}s`;
    const shape = Math.random() > 0.5 ? "rounded-full" : "rounded";
    
    return (
      <div
        key={i}
        className={`absolute ${color} ${shape} animate-confetti`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          left,
          top: "-20px",
          animationDelay,
          animationDuration: `${0.5 + Math.random() * 2}s`,
          transform: `rotate(${Math.random() * 360}deg)`,
        }}
      />
    );
  });
  
  // Create stars for the success animation
  const stars = Array.from({ length: 5 }).map((_, i) => (
    <div 
      key={`star-${i}`}
      className="text-kid-yellow text-4xl animate-bounce" 
      style={{ animationDelay: `${i * 0.1}s` }}
    >
      ⭐
    </div>
  ));
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30">
      <div className="relative">
        {confetti}
        <div className="bg-gradient-to-br from-white to-blue-50 p-8 rounded-2xl shadow-2xl animate-bounce-in flex flex-col items-center border-4 border-kid-yellow">
          <div className="w-24 h-24 rounded-full bg-kid-green/20 flex items-center justify-center mb-4">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="h-16 w-16 text-kid-green" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                clipRule="evenodd" 
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-kid-purple mb-2">Excellent!</h2>
          <p className="text-kid-blue text-xl text-center mb-4">You got it right!</p>
          <div className="flex justify-center gap-2">
            {stars}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuccessAnimation;
