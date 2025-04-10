import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import EnglishKeyboard from "./EnglishKeyboard";
import { Keyboard, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import StageDisplay from "./StageDisplay";
import { GameStage } from "@/types";
import StatusMessage from "./StatusMessage";

interface CompleteWordInputProps {
  onSubmit: (word: string) => void;
  wordLength?: number;
  onPreviousStage?: () => void;
  showSuccessAnimation?: boolean;
}

const CompleteWordInput: React.FC<CompleteWordInputProps> = ({ 
  onSubmit, 
  wordLength = 5,
  onPreviousStage,
  showSuccessAnimation = false
}) => {
  const [letterInputs, setLetterInputs] = useState<string[]>(Array(wordLength).fill(""));
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [autoCheck, setAutoCheck] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasError, setHasError] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const previousInputsRef = useRef<string[]>([]);
  
  // Update local state when parent controls animation
  useEffect(() => {
    // No need to maintain local state for animation - use parent prop directly
  }, [showSuccessAnimation]);
  
  // Function to check if all inputs are filled
  const areAllInputsFilled = () => {
    return letterInputs.every(input => input.trim() !== "");
  };
  
  // Function to handle submission
  const handleSubmit = () => {
    if (isSubmitting) return;
    
    const word = letterInputs.join('');
    
    // Don't submit if already submitting or if inputs are not all filled
    if (!areAllInputsFilled()) {
      return;
    }
    
    // Prevent duplicate submissions
    if (JSON.stringify(letterInputs) === JSON.stringify(previousInputsRef.current)) {
      return;
    }
    
    previousInputsRef.current = [...letterInputs];
    setIsSubmitting(true);
    
    // Don't set local animation state - parent will control it
    
    // Submit the word to the parent component for validation
    onSubmit(word);
    
    // Reset submission state after a delay
    setTimeout(() => {
      setIsSubmitting(false);
      // Don't reset animation state here
    }, 1500);
  };

  // Check for auto-submission when inputs change
  useEffect(() => {
    // Skip if auto-check is disabled or already submitting
    if (!autoCheck || isSubmitting) return;
    
    // Get the current filled count and previous filled count
    const currentFilledCount = letterInputs.filter(input => input.trim() !== "").length;
    const previousFilledCount = previousInputsRef.current.filter(input => input.trim() !== "").length;
    
    // If we just filled the last input (transition from n-1 to n filled)
    if (currentFilledCount === wordLength && previousFilledCount === wordLength - 1) {
      console.log("Last input just filled, triggering immediate submission");
      handleSubmit();
    }
    
    // Update the previous inputs reference
    previousInputsRef.current = [...letterInputs];
  }, [letterInputs, autoCheck, isSubmitting, wordLength]);
  
  // Handle input change from keyboard
  const handleInputChange = (index: number, value: string) => {
    // Only take the last character typed
    const letter = value.slice(-1);
    
    // Update the inputs
    const newInputs = [...letterInputs];
    newInputs[index] = letter;
    setLetterInputs(newInputs);
    
    // For LTR, move focus to the next input (which is visually to the right)
    if (letter && index < letterInputs.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };
  
  // Handle key press from on-screen keyboard
  const handleKeyPress = (key: string) => {
    // Handle special keys
    if (key === "close") {
      setShowKeyboard(false);
      return;
    }

    if (key === "backspace") {
      // Find the first non-empty input from left to right (for LTR)
      let lastFilledIndex = -1;
      for (let i = 0; i < letterInputs.length; i++) {
        if (letterInputs[i] !== "") {
          lastFilledIndex = i;
          break;
        }
      }

      if (lastFilledIndex >= 0) {
        const newInputs = [...letterInputs];
        newInputs[lastFilledIndex] = "";
        setLetterInputs(newInputs);
        if (inputRefs.current[lastFilledIndex]) {
          inputRefs.current[lastFilledIndex].focus();
        }
      }
      return;
    }
    
    // Find the first empty input from left to right (for LTR)
    let targetIndex = -1;
    for (let i = 0; i < letterInputs.length; i++) {
      if (letterInputs[i] === "") {
        targetIndex = i;
        break;
      }
    }
    
    // If all inputs are filled, replace the first one
    if (targetIndex === -1) {
      targetIndex = 0;
    }
    
    // Update the input
    const newInputs = [...letterInputs];
    newInputs[targetIndex] = key;
    setLetterInputs(newInputs);
    
    // Move focus to the next input (for LTR)
    if (targetIndex < letterInputs.length - 1) {
      inputRefs.current[targetIndex + 1]?.focus();
    }
  };
  
  // Initialize input refs
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, wordLength);
    setLetterInputs(Array(wordLength).fill(""));
  }, [wordLength]);
  
  // Handle manual submit button click
  const handleManualSubmit = () => {
    if (!areAllInputsFilled()) {
      console.log("Not all inputs are filled, cannot submit");
      return;
    }
    handleSubmit();
  };
  
  return (
    <div className="flex flex-col items-center w-full max-w-2xl mx-auto">
      <StageDisplay 
        currentStage={GameStage.COMPLETE}
        onPreviousStage={onPreviousStage}
      />
      
      <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-6 rounded-2xl shadow-lg border-4 border-orange-400 mb-4 relative">
        {showSuccessAnimation && (
          <div className="absolute inset-0 flex items-center justify-center bg-green-100/70 rounded-xl z-10 animate-fade-in">
            <div className="bg-white rounded-full p-4 shadow-lg animate-bounce">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            </div>
          </div>
        )}
        <div className="flex flex-row items-center justify-center gap-2 w-full">
          {Array.from({ length: wordLength }).map((_, index) => (
            <div key={index} className="relative">
              <Input
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                value={letterInputs[index]}
                onChange={(e) => handleInputChange(index, e.target.value)}
                className="w-12 h-12 text-center text-xl font-urdu border-2 border-emerald-300 focus:border-emerald-500 focus:ring-emerald-500 rounded-lg text-kid-purple"
                maxLength={1}
                dir="ltr"
                lang="en"
              />
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-6 flex items-center justify-center gap-3">
        <Button
          type="button"
          onClick={handleManualSubmit}
          disabled={!areAllInputsFilled() || isSubmitting}
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-xl text-sm font-medium shadow-md transform transition-transform hover:scale-105 flex items-center gap-1.5"
        >
          <CheckCircle2 size={14} />
          <span>Check</span>
        </Button>
        
        <Button
          type="button"
          variant="outline" 
          className="p-3 rounded-full bg-kid-orange text-white hover:bg-kid-orange/80"
          onClick={() => setShowKeyboard(!showKeyboard)}
        >
          <Keyboard size={22} />
        </Button>
        
        <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-full shadow">
          <Switch 
            id="auto-check"
            checked={autoCheck}
            onCheckedChange={setAutoCheck}
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
      
      {showKeyboard && (
        <div className="w-full mt-4">
          <EnglishKeyboard onKeyPress={handleKeyPress} visible={showKeyboard} />
        </div>
      )}
    </div>
  );
};

export default CompleteWordInput;
