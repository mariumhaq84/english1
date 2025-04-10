import React from "react";
import { Button } from "@/components/ui/button";
import { X, Delete, Space } from "lucide-react";

interface EnglishKeyboardProps {
  onKeyPress: (key: string) => void;
  visible: boolean;
}

const EnglishKeyboard: React.FC<EnglishKeyboardProps> = ({ onKeyPress, visible }) => {
  // QWERTY keyboard layout
  const englishKeys = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["z", "x", "c", "v", "b", "n", "m"]
  ];

  if (!visible) return null;
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-br from-blue-50 to-purple-50 border-t-4 border-kid-purple p-3 z-50 max-h-[45vh] overflow-y-auto rounded-t-2xl shadow-[0_-4px_12px_rgba(0,0,0,0.1)]">
      <div className="max-w-lg mx-auto">
        {englishKeys.map((row, rowIndex) => (
          <div key={rowIndex} className={`flex justify-center gap-1.5 mb-1.5 ${rowIndex === 1 ? 'ml-4' : rowIndex === 2 ? 'ml-10' : ''}`}>
            {row.map((key) => (
              <Button
                key={key}
                variant="outline"
                className="h-10 w-10 text-xl p-0 rounded-lg bg-white hover:bg-kid-yellow hover:scale-105 transition-all duration-200 border-2 border-kid-purple/30 shadow-sm font-bold"
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
            className="h-9 text-sm flex items-center justify-center gap-1 bg-white hover:bg-red-100 hover:text-red-600 transition-all duration-200 border-2 border-red-200 rounded-lg shadow-sm"
            onClick={() => onKeyPress("backspace")}
          >
            <Delete size={14} />
            <span>Delete</span>
          </Button>
          
          <Button 
            variant="outline" 
            className="h-9 text-sm flex items-center justify-center gap-1 bg-white hover:bg-gray-100 hover:text-gray-700 transition-all duration-200 border-2 border-gray-200 rounded-lg shadow-sm"
            onClick={() => onKeyPress("close")}
          >
            <X size={14} />
            <span>Close</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EnglishKeyboard;
