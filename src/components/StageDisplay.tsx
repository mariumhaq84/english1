import React from "react";
import { GameStage } from "@/types";
import { ChevronLeft, ChevronRight, Pencil, Type, Eye } from "lucide-react";
import { Button } from "./ui/button";

interface StageDisplayProps {
  currentStage: GameStage;
  onPreviousStage?: () => void;
  onNextStage?: () => void;
}

const StageDisplay: React.FC<StageDisplayProps> = ({ 
  currentStage, 
  onPreviousStage, 
  onNextStage 
}) => {
  const getStageLabel = () => {
    switch (currentStage) {
      case GameStage.MEMORIZE:
        return "Memorize";
      case GameStage.PARTIAL:
        return "Fill Blanks";
      case GameStage.COMPLETE:
        return "Type Word";
      default:
        return "Unknown";
    }
  };

  const getStageIcon = () => {
    switch (currentStage) {
      case GameStage.MEMORIZE:
        return <Eye size={14} />;
      case GameStage.PARTIAL:
        return <Pencil size={14} />;
      case GameStage.COMPLETE:
        return <Type size={14} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex justify-center items-center mb-4 mt-0">
      <div className="bg-white/80 rounded-full px-0.5 py-0 flex items-center shadow-sm border border-purple-100">
        <Button 
          variant="ghost" 
          className="text-purple-600 p-0 h-6 w-6 hover:bg-purple-50 hover:text-purple-700 rounded-full"
          onClick={onPreviousStage}
          size="icon"
          disabled={currentStage === GameStage.MEMORIZE}
        >
          <ChevronLeft size={14} />
        </Button>
        
        <div className="px-1.5 text-purple-700 flex items-center gap-0.5 font-medium text-xs">
          <span className="bg-purple-100 p-0.5 rounded-full flex items-center justify-center h-4 w-4">
            {getStageIcon()}
          </span>
          {getStageLabel()}
        </div>
        
        <Button 
          variant="ghost" 
          className="text-purple-600 p-0 h-6 w-6 hover:bg-purple-50 hover:text-purple-700 rounded-full"
          onClick={onNextStage}
          size="icon"
          disabled={currentStage === GameStage.COMPLETE}
        >
          <ChevronRight size={14} />
        </Button>
      </div>
    </div>
  );
};

export default StageDisplay;
