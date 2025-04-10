
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, Cell, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Tooltip, Legend } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, RotateCcw, Award, Star, Medal, Book, ThumbsUp, ThumbsDown, Trophy } from "lucide-react";
import { PerformanceMetrics } from "@/types";

interface PerformanceDashboardProps {
  metrics: PerformanceMetrics;
  onContinue: () => void;
  onExit: () => void;
}

const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({ 
  metrics, 
  onContinue,
  onExit
}) => {
  const progressData = [
    { name: "Completed", value: metrics.completedWords, fill: "#4ade80" },
    { name: "Partial", value: metrics.partialWords, fill: "#facc15" },
    { name: "Not Tried", value: metrics.notAttemptedWords, fill: "#cbd5e1" }
  ];
  
  const wordStatusColors = {
    easy: "#4ade80", // green
    medium: "#facc15", // yellow
    hard: "#f87171", // red
    "not attempted": "#cbd5e1" // grey
  };

  // Create data for word difficulty chart
  const wordDifficultyData = metrics.wordDifficulty
    .map(item => ({
      word: item.word,
      difficulty: item.difficulty,
      value: item.difficulty === 'easy' ? 3 : item.difficulty === 'medium' ? 2 : item.difficulty === 'hard' ? 1 : 0
    }))
    .sort((a, b) => a.value - b.value)
    .slice(0, 5); // Show only 5 words for simplicity

  // Calculate completion percentage
  const completionPercentage = Math.round((metrics.completedWords + metrics.partialWords * 0.5) / metrics.totalWords * 100);
  
  // Calculate accuracy
  const totalPoints = metrics.score + metrics.penaltyPoints;
  const accuracy = totalPoints > 0 ? Math.round((metrics.score / totalPoints) * 100) : 0;
  
  return (
    <div className="container max-w-4xl mx-auto py-8 font-comic">
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={onExit}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Back to Menu
        </Button>
      </div>
      
      <Card className="mb-6 border-4 border-kid-purple rounded-2xl shadow-lg overflow-hidden">
        <CardHeader className="bg-kid-purple/10">
          <CardTitle className="text-center text-kid-purple text-3xl flex items-center justify-center gap-2">
            <Trophy size={28} className="text-kid-yellow" />
            Your Progress
            <Trophy size={28} className="text-kid-yellow" />
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="border-2 border-kid-green rounded-xl shadow-md bg-white">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <Book size={28} className="text-kid-green" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-500">Words Finished</h3>
                  <p className="text-3xl font-bold text-kid-green">
                    {completionPercentage}%
                  </p>
                  <div className="flex justify-center mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        className={i < Math.floor(completionPercentage/20) 
                          ? "text-kid-yellow fill-kid-yellow" 
                          : "text-gray-300"}
                      />
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-kid-purple rounded-xl shadow-md bg-white">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    <Medal size={28} className="text-kid-purple" />
                  </div>
                  <h3 className="text-sm font-medium text-gray-500">Your Score</h3>
                  <p className="text-3xl font-bold text-kid-purple">
                    {metrics.score}/{metrics.totalWords}
                  </p>
                  {metrics.penaltyPoints > 0 ? (
                    <p className="text-xs text-red-400 mt-1">
                      {metrics.penaltyPoints} oopsies
                    </p>
                  ) : (
                    <p className="text-xs text-kid-green mt-1">
                      Perfect!
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-kid-blue rounded-xl shadow-md bg-white">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="flex justify-center mb-2">
                    {accuracy >= 70 ? (
                      <ThumbsUp size={28} className="text-kid-blue" />
                    ) : (
                      <ThumbsDown size={28} className="text-kid-orange" />
                    )}
                  </div>
                  <h3 className="text-sm font-medium text-gray-500">How Good</h3>
                  <p className="text-3xl font-bold text-kid-blue">{accuracy}%</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {metrics.mistakes} mistakes
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card className="border-2 border-kid-blue rounded-xl shadow-md bg-white">
              <CardHeader className="pb-0">
                <CardTitle className="text-base text-kid-blue flex items-center gap-2">
                  <Book size={18} /> 
                  Words Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ChartContainer
                    config={{
                      completed: { theme: { light: "#4ade80", dark: "#4ade80" } },
                      partial: { theme: { light: "#facc15", dark: "#facc15" } },
                      notAttempted: { theme: { light: "#cbd5e1", dark: "#cbd5e1" } }
                    }}
                  >
                    <PieChart>
                      <Pie
                        data={progressData}
                        cx="50%"
                        cy="50%"
                        outerRadius={70}
                        dataKey="value"
                        nameKey="name"
                      >
                        {progressData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <ChartTooltip
                        content={
                          <ChartTooltipContent />
                        }
                      />
                      <Legend />
                    </PieChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-2 border-kid-purple rounded-xl shadow-md bg-white">
              <CardHeader className="pb-0">
                <CardTitle className="text-base text-kid-purple flex items-center gap-2">
                  <Medal size={18} />
                  Word Challenge Level
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ChartContainer
                    config={{
                      easy: { theme: { light: "#4ade80", dark: "#4ade80" } },
                      medium: { theme: { light: "#facc15", dark: "#facc15" } },
                      hard: { theme: { light: "#f87171", dark: "#f87171" } },
                      "not attempted": { theme: { light: "#cbd5e1", dark: "#cbd5e1" } }
                    }}
                  >
                    <BarChart data={wordDifficultyData}>
                      <XAxis dataKey="word" />
                      <YAxis hide />
                      <ChartTooltip
                        content={
                          <ChartTooltipContent />
                        }
                      />
                      <Bar dataKey="value">
                        {wordDifficultyData.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={wordStatusColors[entry.difficulty as keyof typeof wordStatusColors]} 
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Card className="border-2 border-kid-green rounded-xl shadow-md bg-white">
            <CardHeader className="pb-0">
              <CardTitle className="text-base text-kid-green flex items-center gap-2">
                <Award size={18} />
                Words to Practice
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Word</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>What to Do</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {metrics.wordDifficulty
                      .filter(word => word.difficulty === 'hard' || word.difficulty === 'not attempted')
                      .slice(0, 5)
                      .map((word) => (
                        <TableRow key={word.id}>
                          <TableCell className="font-medium">{word.word}</TableCell>
                          <TableCell>
                            <span 
                              className="inline-block w-3 h-3 rounded-full mr-2" 
                              style={{ 
                                backgroundColor: wordStatusColors[word.difficulty as keyof typeof wordStatusColors]
                              }} 
                            />
                            {word.difficulty === 'not attempted' ? 'Not Tried Yet' : 'Needs Practice'}
                          </TableCell>
                          <TableCell className="font-medium text-kid-purple">
                            {word.difficulty === 'not attempted' 
                              ? 'Try this word next!' 
                              : 'Practice again!'}
                          </TableCell>
                        </TableRow>
                      ))}
                    {metrics.wordDifficulty.filter(word => word.difficulty === 'hard' || word.difficulty === 'not attempted').length === 0 && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-4 text-kid-green font-bold">
                          Great job! You're doing well on all words! 🎉
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </CardContent>
        <CardFooter className="flex justify-center bg-kid-purple/10 p-4">
          <Button 
            onClick={onContinue} 
            className="bg-kid-purple hover:bg-purple-700 rounded-xl text-lg px-6 py-3 shadow-md hover:shadow-lg transition-all transform hover:scale-105"
          >
            <RotateCcw size={16} className="mr-2" />
            Keep Playing!
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PerformanceDashboard;
