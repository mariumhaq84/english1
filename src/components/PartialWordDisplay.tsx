import React, { useState, useRef, useEffect } from "react";
import EnglishKeyboard from "./EnglishKeyboard";
import { Button } from "@/components/ui/button";
import { Keyboard, CheckCircle2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import StageDisplay from "./StageDisplay";
import { GameStage } from "@/types";
import StatusMessage from "./StatusMessage";

interface PartialWordDisplayProps {
  displayWord: string;
  missingLetters: string[];
  onComplete: (input: string) => void;
  onIncorrectInput?: () => void;
  onPreviousStage?: () => void;
  onNextStage?: () => void;
  showSuccessAnimation?: boolean;
}

const PartialWordDisplay: React.FC<PartialWordDisplayProps> = ({
  displayWord,
  missingLetters,
  onComplete,
  onIncorrectInput,
  onPreviousStage,
  onNextStage,
  showSuccessAnimation = false
}) => {
  const [userInput, setUserInput] = useState<string[]>(Array(missingLetters.length).fill(""));
  const [focusIndex, setFocusIndex] = useState(0);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [hasError, setHasError] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [autoCheck, setAutoCheck] = useState(true);
  const [lastSubmittedInput, setLastSubmittedInput] = useState<string[]>([]);
  const inputRefs = useRef<HTMLInputElement[]>([]);
  const previousInputLength = useRef<number>(0);

  // Reset component state when word changes
  useEffect(() => {
    setUserInput(Array(missingLetters.length).fill(""));
    setFocusIndex(0);
    setHasError(false);
    setIsSubmitting(false);
    setLastSubmittedInput([]);
    setIsCorrect(null);
    
    setTimeout(() => {
      if (inputRefs.current[0]) {
        inputRefs.current[0].focus();
      }
    }, 0);
  }, [displayWord, missingLetters.length]);

  const validateInput = (): boolean => {
    for (let i = 0; i < userInput.length; i++) {
      if (userInput[i].toLowerCase() !== missingLetters[i].toLowerCase()) {
        return false;
      }
    }
    return true;
  };

  // Check if all inputs are filled
  const areAllInputsFilled = (): boolean => {
    return userInput.every(letter => letter.trim() !== "");
  };

  const handleSubmit = () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    setLastSubmittedInput([...userInput]);
    
    const isValid = validateInput();
    setIsCorrect(isValid);
    
    if (isValid) {
      // Delay completion to show animation
      setTimeout(() => {
        onComplete(userInput.join(''));
        setIsSubmitting(false);
      }, 800);
    } else {
      // For incorrect answers, don't show success animation
      setHasError(true);
      
      if (onIncorrectInput) {
        onIncorrectInput();
      }
      
      setTimeout(() => {
        setHasError(false);
        setIsSubmitting(false);
        setIsCorrect(null);
        
        // Clear inputs and reset focus
        setUserInput(Array(missingLetters.length).fill(""));
        setFocusIndex(0);
        
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
      }, 800);
    }
  };

  // Force check when all inputs are filled
  useEffect(() => {
    // Count filled inputs
    const filledInputs = userInput.filter(input => input.trim() !== "").length;
    
    // Only proceed if auto-check is enabled and not already submitting
    if (autoCheck && !isSubmitting) {
      // If we've just filled the last input (transition from n-1 to n filled inputs)
      if (filledInputs === missingLetters.length && previousInputLength.current === missingLetters.length - 1) {
        console.log("Last input just filled, triggering auto-check");
        handleSubmit();
      }
      
      // If somehow all inputs are filled but we haven't triggered a check yet
      if (filledInputs === missingLetters.length && filledInputs > previousInputLength.current) {
        console.log("All inputs are filled, triggering auto-check");
        handleSubmit();
      }
    }
    
    // Update our reference of how many inputs were filled
    previousInputLength.current = filledInputs;
  }, [userInput, autoCheck, isSubmitting]);

  const handleInputChange = (index: number, value: string) => {
    const newUserInput = [...userInput];
    newUserInput[index] = value;
    setUserInput(newUserInput);
    
    if (value && index < missingLetters.length - 1) {
      setFocusIndex(index + 1);
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !userInput[index] && index > 0) {
      setFocusIndex(index - 1);
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "Enter") {
      handleSubmit();
    }
  };

  const handleKeyPress = (key: string) => {
    if (key === "close") {
      setShowKeyboard(false);
      return;
    }

    if (key === "backspace") {
      const newUserInput = [...userInput];
      newUserInput[focusIndex] = "";
      setUserInput(newUserInput);
      
      if (focusIndex > 0) {
        setFocusIndex(focusIndex - 1);
        inputRefs.current[focusIndex - 1]?.focus();
      }
      return;
    }

    // Handle the key press by updating the input
    const newUserInput = [...userInput];
    newUserInput[focusIndex] = key;
    setUserInput(newUserInput);
    
    if (focusIndex < missingLetters.length - 1) {
      setFocusIndex(focusIndex + 1);
      inputRefs.current[focusIndex + 1]?.focus();
    }
  };

  // Toggle auto-check handler
  const handleAutoCheckToggle = (checked: boolean) => {
    setAutoCheck(checked);
    
    // If turning on auto-check and all fields are already filled, trigger check
    if (checked && areAllInputsFilled() && !isSubmitting) {
      handleSubmit();
    }
  };

  const renderWordWithInputs = () => {
    const displayChars = displayWord.split('');
    let blankIndex = 0;
    
    return (
      <div className="flex justify-center items-baseline space-x-3" dir="ltr">
        {displayChars.map((char, index) => {
          if (char === '_') {
            const currentBlankIndex = blankIndex;
            blankIndex++;
            
            return (
              <div 
                key={`blank-${index}`} 
                className={`inline-block mx-2 w-12 h-14 ${
                  isSubmitting && hasError 
                    ? 'bg-red-100 border-4 border-red-400 shake-error' 
                    : isCorrect === true 
                      ? 'bg-green-100 border-4 border-green-400' 
                      : 'bg-white border-4 border-kid-orange'
                } rounded-xl shadow-md transform transition-all duration-300 hover:scale-105`}
              >
                <input
                  ref={el => {
                    if (el) inputRefs.current[currentBlankIndex] = el;
                  }}
                  type="text"
                  maxLength={1}
                  className={`w-full h-full text-center bg-transparent text-2xl font-bold focus:outline-none ${
                    isSubmitting && hasError ? 'text-red-500' : isCorrect === true ? 'text-green-500' : 'text-kid-purple'
                  }`}
                  value={userInput[currentBlankIndex] || ''}
                  onChange={e => handleInputChange(currentBlankIndex, e.target.value)}
                  onKeyDown={e => handleKeyDown(currentBlankIndex, e)}
                  onFocus={() => setFocusIndex(currentBlankIndex)}
                  autoFocus={currentBlankIndex === focusIndex}
                  readOnly={showKeyboard}
                  disabled={isSubmitting}
                />
              </div>
            );
          } else {
            return (
              <span 
                key={`char-${index}`} 
                className="text-3xl font-bold text-kid-blue"
              >
                {char}
              </span>
            );
          }
        })}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
      <StageDisplay 
        currentStage={GameStage.PARTIAL}
        onPreviousStage={onPreviousStage}
        onNextStage={onNextStage}
      />
      
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl shadow-lg border-4 border-kid-yellow relative">
        {showSuccessAnimation && (
          <div className="absolute inset-0 flex items-center justify-center bg-green-100/70 rounded-xl z-10 animate-fade-in">
            <div className="bg-white rounded-full p-4 shadow-lg animate-bounce">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            </div>
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/4 animate-float-up-slow">
                <span className="text-4xl">🎉</span>
              </div>
              <div className="absolute top-0 right-1/4 animate-float-up">
                <span className="text-4xl">✨</span>
              </div>
              <div className="absolute bottom-0 left-1/3 animate-float-up-fast">
                <span className="text-4xl">🎊</span>
              </div>
            </div>
          </div>
        )}
        {renderWordWithInputs()}
      </div>
      
      <div className="mt-6 flex flex-col items-center gap-4">
        <div className="flex items-center justify-center gap-3">
          <Button
            onClick={handleSubmit}
            disabled={!areAllInputsFilled() || isSubmitting}
            className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-xl text-sm font-medium shadow-md transform transition-transform hover:scale-105"
          >
            {isSubmitting ? (
              <span className="inline-flex items-center gap-1.5">
                <span className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full"></span>
                <span>Check</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5">
                <CheckCircle2 size={14} />
                <span>Check</span>
              </span>
            )}
          </Button>
          
          <Button
            variant="outline" 
            className="kid-button p-3 rounded-full bg-kid-orange text-white hover:bg-kid-orange/80"
            onClick={() => setShowKeyboard(!showKeyboard)}
          >
            <Keyboard size={22} />
          </Button>
          
          <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-full shadow">
            <Switch 
              id="auto-check" 
              checked={autoCheck}
              onCheckedChange={handleAutoCheckToggle}
              className="data-[state=checked]:bg-kid-green"
            />
            <label 
              htmlFor="auto-check" 
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-1"
            >
              <CheckCircle2 size={15} className="text-kid-green" />
              Auto
            </label>
          </div>
        </div>
      </div>
      
      <EnglishKeyboard 
        onKeyPress={handleKeyPress} 
        visible={showKeyboard} 
      />
    </div>
  );
};

export default PartialWordDisplay;
