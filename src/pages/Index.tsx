import React, { useState, useEffect } from "react";
import { WordItem } from "@/types";
import FileUploadForm from "@/components/FileUploadForm";
import UrduGame from "@/pages/UrduGame";
import WordGrid from "@/components/WordGrid";
import { Button } from "@/components/ui/button";
import { Play, Trash2 } from "lucide-react";
import { Card, CardContent, CardFooter, CardTitle } from "@/components/ui/card";

const LOCAL_STORAGE_KEY = "urduMemorizeMasterWords";

const Index: React.FC = () => {
  const [words, setWords] = useState<WordItem[] | null>(null);
  const [gameStarted, setGameStarted] = useState(false);

  // Load words from local storage when the component mounts
  useEffect(() => {
    const savedWords = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedWords) {
      try {
        const parsedWords = JSON.parse(savedWords);
        setWords(parsedWords);
      } catch (error) {
        console.error("Failed to parse saved words:", error);
        // Clear corrupted data
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    }
  }, []);

  const handleWordsUploaded = (uploadedWords: WordItem[]) => {
    setWords(uploadedWords);
    // Save to local storage
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(uploadedWords));
  };

  const handleStartGame = () => {
    setGameStarted(true);
  };

  const handleExitGame = () => {
    setGameStarted(false);
  };

  const handleClearSavedWords = () => {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    setWords(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-green-100 font-comic">
      <div className="container mx-auto p-4">
        <header className="pt-2 pb-1 text-center">
          <h1 className="inline-flex flex-col items-center">
            <div>
              <span className="text-5xl font-bold bg-gradient-to-r from-emerald-500 to-teal-600 bg-clip-text text-transparent">English Spellings</span>
            </div>
            <span className="text-xs text-gray-500 mt-1">Learn English Spellings</span>
          </h1>
        </header>

        <main className="py-0">
          {gameStarted && words ? (
            <UrduGame 
              initialWords={words} 
              onExit={handleExitGame} 
              onClearSavedWords={handleClearSavedWords}
            />
          ) : words ? (
            <Card className="max-w-4xl mx-auto border-4 border-emerald-400 rounded-2xl overflow-hidden shadow-lg">
              <CardContent className="p-6 bg-white pt-8">
                <div className="mb-2">
                  <WordGrid words={words} />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between items-center p-6 bg-emerald-100/5 border-t-2 border-emerald-200/30">
                <Button
                  variant="outline"
                  className="flex items-center gap-2 border-red-400 text-red-500 hover:bg-red-50 hover:text-red-600 transition-all"
                  onClick={handleClearSavedWords}
                >
                  <Trash2 size={18} />
                  <span>Clear List</span>
                </Button>
                <Button
                  className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full text-lg transition-transform transform hover:scale-105 shadow-md"
                  onClick={handleStartGame}
                >
                  <Play size={20} className="fill-white" />
                  <span>Start Playing</span>
                </Button>
              </CardFooter>
            </Card>
          ) : (
            <FileUploadForm 
              onWordsUploaded={handleWordsUploaded} 
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default Index;
