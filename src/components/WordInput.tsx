import React, { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Keyboard, CheckCircle2, SendHorizontal } from "lucide-react";
import UrduKeyboard from "./UrduKeyboard";
import { Switch } from "@/components/ui/switch";

interface WordInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  placeholder?: string;
  isRtl?: boolean;
  showKeyboard?: boolean;
}

const WordInput: React.FC<WordInputProps> = ({
  value,
  onChange,
  onSubmit,
  placeholder = "Type here...",
  isRtl = true,
  showKeyboard = true,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [autoCheck, setAutoCheck] = useState(true);
  const [lastSubmittedValue, setLastSubmittedValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const autoCheckTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastValueRef = useRef<string>(value);

  // Clear any existing timers
  const clearAutoCheckTimer = () => {
    if (autoCheckTimerRef.current) {
      clearTimeout(autoCheckTimerRef.current);
      autoCheckTimerRef.current = null;
    }
  };

  // Function to handle auto-check submission
  const triggerAutoCheck = () => {
    if (!isSubmitting && value.trim() && value !== lastSubmittedValue) {
      setLastSubmittedValue(value);
      setIsSubmitting(true);
      onSubmit();
      
      setTimeout(() => {
        setIsSubmitting(false);
      }, 800);
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
    
    // Cleanup on unmount
    return () => {
      clearAutoCheckTimer();
    };
  }, []);

  // Handle auto-check when value changes
  useEffect(() => {
    // Only proceed if auto-check is enabled and value has changed
    if (autoCheck && value.trim() && value !== lastSubmittedValue && !isSubmitting) {
      // Clear any existing timer first
      clearAutoCheckTimer();
      
      // Trigger check immediately instead of waiting
      triggerAutoCheck();
    }
    
    // Update the last value reference
    lastValueRef.current = value;
    
    return () => {
      clearAutoCheckTimer();
    };
  }, [value, autoCheck, lastSubmittedValue, isSubmitting]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !isSubmitting) {
      e.preventDefault();
      clearAutoCheckTimer(); // Clear any pending auto-check
      triggerAutoCheck();
    }
  };

  const handleKeyPress = (key: string) => {
    if (key === "close") {
      setIsKeyboardVisible(false);
      return;
    }

    if (key === "backspace") {
      onChange(value.slice(0, -1));
      return;
    }

    onChange(value + key);
  };

  const handleSubmitClick = () => {
    if (isSubmitting) return;
    
    clearAutoCheckTimer(); // Clear any pending auto-check
    triggerAutoCheck();
  };

  // Toggle auto-check handler
  const handleAutoCheckToggle = (checked: boolean) => {
    setAutoCheck(checked);
    
    // If turning on auto-check and there's already a value, check it
    if (checked && value.trim() && value !== lastSubmittedValue && !isSubmitting) {
      clearAutoCheckTimer();
      autoCheckTimerRef.current = setTimeout(() => {
        triggerAutoCheck();
      }, 300);
    }
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <div className="mb-3">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className={`w-full p-3 border-2 border-emerald-400 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-lg shadow-md ${
              isRtl ? "input-rtl urdu-text" : ""
            }`}
            dir={isRtl ? "rtl" : "ltr"}
            readOnly={isKeyboardVisible}
            disabled={isSubmitting}
          />
          
          {showKeyboard && (
            <Button
              type="button"
              variant="outline"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
              onClick={() => setIsKeyboardVisible(!isKeyboardVisible)}
              disabled={isSubmitting}
            >
              <Keyboard size={18} />
            </Button>
          )}
        </div>
      </div>
      
      <div className="flex justify-between items-center gap-3">
        <div className="flex items-center space-x-1 bg-white px-2 py-1.5 rounded-lg shadow-sm border border-emerald-500">
          <Switch 
            id="word-auto-check" 
            checked={autoCheck}
            onCheckedChange={handleAutoCheckToggle}
            className="data-[state=checked]:bg-emerald-500"
            disabled={isSubmitting}
          />
          <label 
            htmlFor="word-auto-check" 
            className="text-xs font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 flex items-center gap-1"
          >
            <CheckCircle2 size={12} className="text-emerald-500" />
            Auto
          </label>
        </div>
        
        <Button
          type="button"
          className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md transform transition hover:scale-105"
          onClick={handleSubmitClick}
          disabled={isSubmitting}
        >
          <SendHorizontal size={16} />
          {isSubmitting ? "Checking..." : "Check My Answer"}
        </Button>
      </div>
      
      <UrduKeyboard 
        onKeyPress={handleKeyPress}
        visible={isKeyboardVisible} 
      />
    </div>
  );
};

export default WordInput;
