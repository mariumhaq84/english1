
import React from "react";
import { Button } from "@/components/ui/button";
import { X, Delete, Space } from "lucide-react";

interface UrduKeyboardProps {
  onKeyPress: (key: string) => void;
  visible: boolean;
}

const UrduKeyboard: React.FC<UrduKeyboardProps> = ({ onKeyPress, visible }) => {
  // Common Urdu characters arranged in a more intuitive layout
  const urduKeys = [
    ["ا", "ب", "پ", "ت", "ٹ", "ث", "ج", "چ"],
    ["ح", "خ", "د", "ڈ", "ذ", "ر", "ڑ", "ز"],
    ["ژ", "س", "ش", "ص", "ض", "ط", "ظ", "ع"],
    ["غ", "ف", "ق", "ک", "گ", "ل", "م", "ن"],
    ["ں", "و", "ہ", "ھ", "ء", "ی", "ے", "ۓ"]
  ];

  if (!visible) return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-br from-blue-50 to-purple-50 border-t-4 border-kid-purple p-3 z-50 max-h-[45vh] overflow-y-auto rounded-t-2xl shadow-[0_-4px_12px_rgba(0,0,0,0.1)]">
      <div className="max-w-lg mx-auto">
        {urduKeys.map((row, rowIndex) => (
          <div key={rowIndex} className="grid grid-cols-8 gap-1.5 mb-1.5">
            {row.map((key) => (
              <Button
                key={key}
                variant="outline"
                className="h-10 w-full text-xl p-0 rounded-lg bg-white hover:bg-kid-yellow hover:scale-105 transition-all duration-200 border-2 border-kid-purple/30 shadow-sm urdu-text font-bold"
                onClick={() => onKeyPress(key)}
              >
                {key}
              </Button>
            ))}
          </div>
        ))}
        
        <div className="grid grid-cols-3 gap-1.5 mt-2">
          <Button 
            variant="outline" 
            className="h-9 text-sm flex items-center justify-center gap-1 bg-white hover:bg-kid-green hover:text-white transition-all duration-200 border-2 border-kid-green/50 rounded-lg shadow-sm"
            onClick={() => onKeyPress(" ")}
          >
            <Space size={14} />
            <span>Space</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-9 text-sm flex items-center justify-center gap-1 bg-white hover:bg-kid-orange hover:text-white transition-all duration-200 border-2 border-kid-orange/50 rounded-lg shadow-sm" 
            onClick={() => onKeyPress("backspace")}
          >
            <Delete size={14} />
            <span>Backspace</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-9 text-sm flex items-center justify-center gap-1 bg-white hover:bg-red-400 hover:text-white transition-all duration-200 border-2 border-red-300/50 rounded-lg shadow-sm"
            onClick={() => onKeyPress("close")}
          >
            <X size={14} />
            <span>Close</span>
          </Button>
        </div>
        
        <div className="text-center mt-3 text-xs text-gray-500 bg-white/70 p-1 rounded-lg shadow-sm">
          <p>Tap the letters to type • Space for spacing • Backspace to delete</p>
        </div>
      </div>
    </div>
  );
};

export default UrduKeyboard;
