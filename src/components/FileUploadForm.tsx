import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { generateId } from "@/utils/wordUtils";
import { WordItem } from "@/types";
import { Upload } from "lucide-react";

interface FileUploadFormProps {
  onWordsUploaded: (words: WordItem[]) => void;
}

const FileUploadForm: React.FC<FileUploadFormProps> = ({ onWordsUploaded }) => {
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setProcessing(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const lines = content.split(/\r?\n/).filter(line => line.trim() !== '');
        
        if (lines.length === 0) {
          setError("The file doesn't contain any words.");
          setProcessing(false);
          return;
        }
        
        const wordItems = lines.map(word => ({
          id: generateId(),
          word: word.trim()
        }));
        
        onWordsUploaded(wordItems);
      } catch (err) {
        setError("Failed to process file. Please ensure it's a valid text file.");
      } finally {
        setProcessing(false);
      }
    };

    reader.onerror = () => {
      setError("An error occurred while reading the file.");
      setProcessing(false);
    };

    reader.readAsText(file);
  };

  const handleManualEntry = () => {
    const sampleWords = [
      "hello", "world", "book", "pencil", 
      "paper", "tree", "flower", "sky", 
      "earth", "water", "fire", "computer"
    ];

    const wordItems = sampleWords.map(word => ({
      id: generateId(),
      word
    }));

    onWordsUploaded(wordItems);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl overflow-hidden shadow-lg border-4 border-kid-purple">
      <div className="bg-kid-purple/10 border-b-2 border-kid-purple/30 p-4">
        <h2 className="text-center text-kid-purple text-xl font-bold">
          English Word Collection
        </h2>
      </div>
      
      <div className="p-6">
        <div className="flex flex-col items-center space-y-6">
          <div className="text-center text-gray-600">
            <p>Upload a text file with English words,</p>
            <p>one word per line.</p>
            <p className="mt-2 text-urdu-primary text-sm">Your word list will be saved for future sessions.</p>
          </div>
          
          <label className="flex flex-col items-center px-4 py-8 bg-white rounded-xl cursor-pointer border-3 border-dashed border-kid-blue hover:bg-kid-blue/5 transition-all w-full">
            <Upload className="h-12 w-12 text-kid-blue mb-2" />
            <span className="text-lg font-medium text-kid-blue">Select a file</span>
            <span className="text-sm text-gray-500 mt-1">or drop it here</span>
            <input 
              type="file" 
              className="hidden" 
              accept=".txt" 
              onChange={handleFileUpload} 
              disabled={processing}
            />
          </label>
          
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
        </div>
      </div>
      
      <div className="flex justify-center p-6 bg-kid-purple/5 border-t-2 border-kid-purple/30">
        <Button 
          variant="outline"
          onClick={handleManualEntry}
          disabled={processing}
          className="border-kid-blue text-kid-blue hover:bg-kid-blue hover:text-white px-6 py-2 text-lg"
        >
          Use Sample Words
        </Button>
      </div>
    </div>
  );
};

export default FileUploadForm;
