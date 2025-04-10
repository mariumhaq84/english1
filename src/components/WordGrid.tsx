
import React from "react";
import { WordItem } from "@/types";
import { cn } from "@/lib/utils";

interface WordGridProps {
  words: WordItem[];
  onWordSelect?: (id: string) => void;
  currentWordIndex?: number;
}

const WordGrid: React.FC<WordGridProps> = ({ words, onWordSelect, currentWordIndex }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
      {words.map((word, index) => (
        <div
          key={word.id}
          onClick={() => onWordSelect?.(word.id)}
          className={cn(
            "p-4 rounded-xl cursor-pointer transition-all duration-300 urdu-text text-xl text-center",
            "bg-gradient-to-br shadow-md hover:shadow-lg transform hover:-translate-y-1",
            "border-2 flex items-center justify-center min-h-[100px]",
            currentWordIndex === index 
              ? "from-urdu-primary/20 to-urdu-primary/30 border-urdu-primary shadow-urdu-primary/20" 
              : "from-white to-urdu-secondary/5 border-urdu-secondary/30 hover:border-urdu-primary"
          )}
        >
          <span className="text-2xl">{word.word}</span>
        </div>
      ))}
    </div>
  );
};

export default WordGrid;
