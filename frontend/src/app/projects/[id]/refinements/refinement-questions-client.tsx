"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useProjectState } from "@/hooks/use-project-state";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { apiStorage } from "@/lib/api-storage";

interface RefinementQuestionsClientProps {
  projectId: string;
}

export default function RefinementQuestionsClient({ projectId }: RefinementQuestionsClientProps) {
  const { 
    project, 
    metadata, 
    isLoading,
    updateMetadata
  } = useProjectState(projectId);

  // All useState hooks must be called first
  const [isRefining, setIsRefining] = useState(false);
  const [refinementQuestions, setRefinementQuestions] = useState<any[]>([]);
  const [refinementAnswers, setRefinementAnswers] = useState<Record<number, string>>({});
  const [refinementSkipped, setRefinementSkipped] = useState<Record<number, boolean>>({});
  const [refinementStep, setRefinementStep] = useState(1);
  const [isSavingRefinements, setIsSavingRefinements] = useState(false);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Load existing refinement questions and answers if they exist
  useEffect(() => {
    const loadRefinementData = async () => {
      if (!project || !metadata) return;
      
      // Check if refinement questions have been generated
      if (metadata.refinementQuestionsGenerated) {
        try {
          const response = await fetch(`/api/projects/${project.id}/refinements`);
          if (response.ok) {
            const data = await response.json();
            
            // Load questions if they exist
            if (data.questions && data.questions.length > 0) {
              setRefinementQuestions(data.questions);
            }
            
            // Load answers if they exist
            if (data.answers && data.answers.length > 0) {
              const answersMap: Record<number, string> = {};
              const skippedMap: Record<number, boolean> = {};
              data.answers.forEach((answer: any) => {
                if (answer.skipped) {
                  skippedMap[answer.questionId] = true;
                } else {
                  answersMap[answer.questionId] = answer.answer;
                }
              });
              setRefinementAnswers(answersMap);
              setRefinementSkipped(skippedMap);
            }
          }
        } catch (error) {
          console.error('Error loading refinement data:', error);
        }
      }
    };

    loadRefinementData();
  }, [project, metadata]);

  // Auto-save answers when they change
  const autoSaveAnswers = useCallback(async () => {
    if (!project || refinementQuestions.length === 0) return;
    
    setIsAutoSaving(true);
    try {
      const answers = refinementQuestions.map(question => ({
        questionId: question.id,
        question: question.question,
        answer: refinementAnswers[question.id] || '',
        skipped: refinementSkipped[question.id] || false,
        timestamp: new Date().toISOString()
      }));

      const response = await fetch(`/api/projects/${project.id}/refinements`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers })
      });

      if (!response.ok) {
        console.error('Auto-save failed');
      } else {
        console.log('Answers auto-saved successfully');
      }
    } catch (error) {
      console.error('Auto-save error:', error);
    } finally {
      setIsAutoSaving(false);
    }
  }, [project, refinementQuestions, refinementAnswers, refinementSkipped]);

  // Auto-save when answers change (debounced)
  useEffect(() => {
    if (refinementQuestions.length > 0) {
      const timer = setTimeout(() => {
        autoSaveAnswers();
      }, 2000); // Auto-save after 2 seconds of inactivity

      return () => clearTimeout(timer);
    }
  }, [refinementAnswers, refinementSkipped, autoSaveAnswers]);

  // Handle PRD refinement
  const handleRefinePRD = async () => {
    if (!project || !metadata) return;
    
    // Check if refinement questions already exist
    if (metadata.refinementQuestionsGenerated) {
      // Load existing questions instead of generating new ones
      try {
        const response = await fetch(`/api/projects/${project.id}/refinements`);
        if (response.ok) {
          const data = await response.json();
          if (data.questions && data.questions.length > 0) {
            setRefinementQuestions(data.questions);
            
            // Load existing answers if any
            if (data.answers && data.answers.length > 0) {
              const answersMap: Record<number, string> = {};
              const skippedMap: Record<number, boolean> = {};
              data.answers.forEach((answer: any) => {
                if (answer.skipped) {
                  skippedMap[answer.questionId] = true;
                } else {
                  answersMap[answer.questionId] = answer.answer;
                }
              });
              setRefinementAnswers(answersMap);
              setRefinementSkipped(skippedMap);
            }
            
            // Update metadata to reflect refinement phase
            updateMetadata({ 
              currentStep: 'refinement-questions',
              status: 'refining'
            });
            return;
          }
        }
      } catch (error) {
        console.error('Error loading existing refinement questions:', error);
      }
    }
    
    // Generate new questions if they don't exist
    setIsRefining(true);
    try {
      const response = await fetch('/api/llm/prd-refinement', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectId: project.id })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate refinement questions');
      }

      const data = await response.json();
      setRefinementQuestions(data.questions);
      
      // Update metadata to reflect refinement phase
      updateMetadata({ 
        currentStep: 'refinement-questions',
        status: 'refining'
      });
    } catch (error) {
      console.error('Refinement error:', error);
      setErrorMessage('Failed to generate refinement questions: ' + (error instanceof Error ? error.message : 'Unknown error'));
      setShowErrorDialog(true);
    } finally {
      setIsRefining(false);
    }
  };

  // Handle refinement answer change
  const handleRefinementAnswerChange = (questionId: number, answer: string) => {
    setRefinementAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
    // If user starts answering, mark as not skipped
    if (answer.trim()) {
      setRefinementSkipped(prev => ({
        ...prev,
        [questionId]: false
      }));
    }
  };

  // Handle skip question
  const handleSkipQuestion = (questionId: number) => {
    setRefinementAnswers(prev => ({
      ...prev,
      [questionId]: ''
    }));
    setRefinementSkipped(prev => ({
      ...prev,
      [questionId]: true
    }));
    // Auto-save after skipping
    setTimeout(() => autoSaveAnswers(), 500);
  };

  // Handle save refinement answers and process refinement
  const handleSaveRefinements = async () => {
    if (!project) return;
    
    // If already complete, redirect to IDE selection page
    if (metadata?.status === 'complete') {
      window.location.href = `/projects/${project.id}/ide-selection`;
      return;
    }
    
    setIsSavingRefinements(true);
    try {
      const answers = refinementQuestions.map(question => ({
        questionId: question.id,
        question: question.question,
        answer: refinementAnswers[question.id] || '',
        skipped: refinementSkipped[question.id] || false,
        timestamp: new Date().toISOString()
      }));

      const response = await fetch(`/api/projects/${project.id}/refinements`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers })
      });

      if (!response.ok) {
        throw new Error('Failed to save refinement answers');
      }

      // Update metadata to processing step
      updateMetadata({ 
        currentStep: 'processing',
        status: 'processing'
      });

      // Process refinement to generate refined PRD
      setIsProcessing(true);
      try {
        const refinedPRD = await apiStorage.processRefinement(project.id);
        
        // Update metadata to complete step
        updateMetadata({ 
          currentStep: 'ide-selection',
          status: 'complete'
        });

        // Redirect to IDE selection page
        window.location.href = `/projects/${project.id}/ide-selection`;
      } catch (error) {
        console.error('Error processing refinement:', error);
        setErrorMessage('Failed to process refinement. Please try again.');
        setShowErrorDialog(true);
      } finally {
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Error saving refinements:', error);
      setErrorMessage('Failed to save refinement answers. Please try again.');
      setShowErrorDialog(true);
    } finally {
      setIsSavingRefinements(false);
    }
  };

  // Get current step questions (5 questions per step)
  const getCurrentStepQuestions = () => {
    const startIndex = (refinementStep - 1) * 5;
    const endIndex = startIndex + 5;
    const questions = refinementQuestions.slice(startIndex, endIndex);
    return questions;
  };

  const totalRefinementSteps = Math.ceil(refinementQuestions.length / 5);
  
  // Calculate completion status
  const getCompletionStatus = () => {
    const answeredCount = Object.keys(refinementAnswers).filter(id => 
      refinementAnswers[parseInt(id)] && refinementAnswers[parseInt(id)].trim()
    ).length;
    const skippedCount = Object.keys(refinementSkipped).filter(id => 
      refinementSkipped[parseInt(id)]
    ).length;
    const totalCompleted = answeredCount + skippedCount;
    const isComplete = totalCompleted === refinementQuestions.length;
    
    return {
      answeredCount,
      skippedCount,
      totalCompleted,
      isComplete
    };
  };
  
  const completionStatus = getCompletionStatus();

  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center py-16">
          <p className="text-muted-foreground">Loading project...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (!project || !metadata) {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center py-16">
          <p className="text-muted-foreground">Project not found</p>
          <Link href="/projects">
            <Button className="mt-4">Back to Projects</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Refinement Questions</h1>
          <p className="text-muted-foreground mt-2">
            Answer these questions to help improve your PRD
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link href={`/projects/${project.id}/prd`}>
            <Button variant="outline">
              Back to PRD
            </Button>
          </Link>
        </div>
      </div>

      {/* Generate Questions Section */}
      {refinementQuestions.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Generate Refinement Questions</CardTitle>
            <p className="text-sm text-muted-foreground">
              Generate 10 AI-powered questions to help improve your product requirements document.
            </p>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Button 
                className="flex items-center gap-2"
                disabled={isRefining}
                onClick={handleRefinePRD}
              >
                <Sparkles className="w-4 h-4" />
                {isRefining ? "Generating..." : "Generate Refinement Questions"}
              </Button>
              <div className="text-sm text-muted-foreground">
                {isRefining ? "AI is analyzing your PRD and generating questions..." : "Click to start generating questions"}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Questions Section */}
      {refinementQuestions.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Refinement Questions</CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline">
                  Step {refinementStep} of {totalRefinementSteps}
                </Badge>
                <Badge variant="secondary">
                  {refinementQuestions.length} questions total
                </Badge>
                <Badge variant="default">
                  {completionStatus.answeredCount} answered
                </Badge>
                <Badge variant="secondary">
                  {completionStatus.skippedCount} skipped
                </Badge>
                <Badge variant={completionStatus.isComplete ? "default" : "destructive"}>
                  {completionStatus.totalCompleted}/{refinementQuestions.length} complete
                </Badge>
                {isAutoSaving && (
                  <Badge variant="secondary" className="text-xs">
                    Auto-saving...
                  </Badge>
                )}
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Please answer these questions to help refine your PRD. You can skip questions you're unsure about.
              {metadata?.refinementQuestionsGeneratedAt && (
                <span className="block mt-1">
                  Questions generated on {new Date(metadata.refinementQuestionsGeneratedAt).toLocaleString()}
                </span>
              )}
            </p>
            
            {/* Step Progress Indicator */}
            <div className="flex items-center gap-2 mt-4">
              {Array.from({ length: totalRefinementSteps }, (_, i) => (
                <div
                  key={i}
                  className={`h-2 flex-1 rounded-full transition-colors ${
                    i + 1 === refinementStep
                      ? 'bg-primary'
                      : i + 1 < refinementStep
                      ? 'bg-primary/50'
                      : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {getCurrentStepQuestions().map((question, index) => (
                <div key={question.id} className="space-y-3 p-4 border rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-sm">
                        Question {question.id}: {question.question}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {question.category}
                        </Badge>
                        <Badge 
                          variant={question.priority === 'high' ? 'destructive' : question.priority === 'medium' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {question.priority} priority
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {refinementSkipped[question.id] ? (
                      <div className="p-3 bg-muted rounded-md border-2 border-dashed">
                        <p className="text-sm text-muted-foreground italic">
                          Question skipped
                        </p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setRefinementSkipped(prev => ({ ...prev, [question.id]: false }));
                            setRefinementAnswers(prev => ({ ...prev, [question.id]: '' }));
                            // Auto-save after un-skipping
                            setTimeout(() => autoSaveAnswers(), 500);
                          }}
                          className="text-xs mt-2"
                        >
                          Answer Question
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Textarea
                          placeholder="Enter your answer here..."
                          value={refinementAnswers[question.id] || ''}
                          onChange={(e) => handleRefinementAnswerChange(question.id, e.target.value)}
                          className="min-h-[80px]"
                        />
                        <div className="flex justify-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSkipQuestion(question.id)}
                            className="text-xs"
                          >
                            Skip Question
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <div className="flex items-center gap-4">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={async () => {
                      // Auto-save before navigating
                      await autoSaveAnswers();
                      setRefinementStep(prev => Math.max(1, prev - 1));
                    }}
                    disabled={refinementStep === 1}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    onClick={async () => {
                      // Auto-save before navigating
                      await autoSaveAnswers();
                      setRefinementStep(prev => Math.min(totalRefinementSteps, prev + 1));
                    }}
                    disabled={refinementStep === totalRefinementSteps}
                  >
                    Next
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
                <div className="text-sm text-muted-foreground">
                  Step {refinementStep} of {totalRefinementSteps} • 
                  Questions {((refinementStep - 1) * 5) + 1}-{Math.min(refinementStep * 5, refinementQuestions.length)} of {refinementQuestions.length}
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button
                  onClick={handleSaveRefinements}
                  disabled={isSavingRefinements || isProcessing || !completionStatus.isComplete}
                  className="flex items-center gap-2"
                >
                  {isSavingRefinements ? "Saving..." : isProcessing ? "Processing..." : metadata?.status === 'complete' ? "Create IDE Rails" : "Process Refinement"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Success!</DialogTitle>
            <DialogDescription>
              Your refinement answers have been saved successfully.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setShowSuccessDialog(false)}>
              Continue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Error Dialog */}
      <Dialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
            <DialogDescription>
              {errorMessage}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={() => setShowErrorDialog(false)}>
              OK
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 