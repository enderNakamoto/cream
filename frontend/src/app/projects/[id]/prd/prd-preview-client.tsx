"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Edit, ArrowRight, Download, Save, X, Check, Sparkles, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useProjectState } from "@/hooks/use-project-state";

interface PRDPreviewClientProps {
  projectId: string;
}

export default function PRDPreviewClient({ projectId }: PRDPreviewClientProps) {
  const searchParams = useSearchParams();
  const { 
    project, 
    metadata, 
    answers, 
    prdContent, 
    isLoading, 
    isSaving,
    nextStep,
    updatePRDContent,
    updateMetadata
  } = useProjectState(projectId);

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);
  const [isRefining, setIsRefining] = useState(false);
  const [refinementQuestions, setRefinementQuestions] = useState<any[]>([]);
  const [showRefinementQuestions, setShowRefinementQuestions] = useState(false);
  const [refinementAnswers, setRefinementAnswers] = useState<Record<number, string>>({});
  const [refinementStep, setRefinementStep] = useState(1);
  const [isSavingRefinements, setIsSavingRefinements] = useState(false);

  // Generate comprehensive PRD content if none exists
  const generatePRDContent = () => {
    if (!project || !answers) return '';
    
    const data = answers.initialAnswers;
    
    return `# Product Requirements Document
## ${project.name}

### 📋 Project Overview
**Project Name**: ${data.projectName}  
**Project Type**: ${data.projectType}  
**Target Audience**: ${data.targetAudience || 'Not specified'}  
**Description**: ${data.description}

### 🏗️ Technical Architecture

#### Tech Stack
- **Frontend**: Next.js, Tailwind CSS, shadcn/ui
- **Backend**: ${data.projectType === 'web3-dapp' ? 'Smart Contracts' : 'API/Serverless'}
${data.projectType === 'web-app' && data.authentication === 'yes' ? '- **Authentication**: Clerk' : ''}
${data.projectType === 'web3-dapp' ? `- **Smart Contract Language**: ${data.smartContractLanguage || 'Not specified'}` : ''}

${data.projectType === 'web3-dapp' ? `
#### Web3 Configuration
- **Wallet Integration**: ${data.walletIntegration || 'Not specified'}
${data.smartContractLanguage === 'solidity' ? `- **Multi-Chain Support**: ${data.multiChainSupport || 'Not specified'}` : ''}
${data.multiChainSupport === 'multi-chain' ? `- **Cross-Chain Solution**: ${data.crossChainSolution || 'Not specified'}` : ''}
${data.oracleNeeded === 'yes' ? `- **Oracle Solution**: ${data.oracleSolution === 'other' ? data.oracleOther : data.oracleSolution || 'Not specified'}` : ''}
` : ''}

### 🎯 Core Features
${data.coreFeatures}

### 📅 Development Phases

#### Phase 1
${data.phase1}

#### Phase 2
${data.phase2}

#### Phase 3
${data.phase3}

### 🎨 User Experience Design

#### User Journeys & Page Structure
${data.sampleUserJourneys}

#### Key User Flows
- **Landing Page**: User's first impression and entry point
- **Navigation**: How users move between pages and features
- **Core Actions**: Primary user interactions and goals
- **Onboarding**: New user experience and feature discovery

### 👥 Target Audience
**Primary Audience**: ${data.targetAudience || 'Not specified'}

#### User Personas
- **Demographics**: Based on target audience selection
- **Technical Level**: Varies by audience type
- **Use Cases**: Specific to project requirements

${data.additionalContext ? `
### 🔧 Additional Context & Requirements
${data.additionalContext}
` : ''}

---
*Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}*
`;
  };

  const displayContent = prdContent || (project && answers ? generatePRDContent() : '');

  // Check for edit parameter in URL and auto-switch to edit mode
  useEffect(() => {
    const editParam = searchParams.get('edit');
    if (editParam === 'true' && !isEditing) {
      setIsEditing(true);
    }
  }, [searchParams, isEditing]);

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
              setShowRefinementQuestions(true);
            }
            
            // Load answers if they exist
            if (data.answers && data.answers.length > 0) {
              const answersMap: Record<number, string> = {};
              data.answers.forEach((answer: any) => {
                if (!answer.skipped) {
                  answersMap[answer.questionId] = answer.answer;
                }
              });
              setRefinementAnswers(answersMap);
            }
          }
        } catch (error) {
          console.error('Error loading refinement data:', error);
        }
      }
    };

    loadRefinementData();
  }, [project, metadata]);

  // Initialize edit content when entering edit mode
  useEffect(() => {
    if (isEditing && displayContent) {
      setEditContent(displayContent);
      setHasChanges(false);
    }
  }, [isEditing, displayContent]);

  // Update hasChanges when editContent or displayContent changes
  useEffect(() => {
    if (isEditing) {
      const changed = editContent !== displayContent;
      setHasChanges(changed);
    }
  }, [editContent, displayContent, isEditing]);

  // Auto-save functionality
  const autoSave = useCallback((content: string) => {
    if (content !== displayContent) {
      updatePRDContent(content);
    }
  }, [displayContent, updatePRDContent]);

  // Handle edit mode toggle
  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing
      setIsEditing(false);
      setEditContent(displayContent);
      setHasChanges(false);
    } else {
      // Start editing
      setIsEditing(true);
      setEditContent(displayContent);
    }
  };

  // Handle save
  const handleSave = async () => {
    try {
      console.log('Saving PRD content:', editContent.substring(0, 100) + '...');
      await updatePRDContent(editContent);
      console.log('PRD content saved successfully');
      setIsEditing(false);
      setHasChanges(false);
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
        setAutoSaveTimer(null);
      }
      // Show success feedback
      alert('PRD saved successfully!');
    } catch (error) {
      console.error('Error saving PRD:', error);
      alert('Failed to save PRD. Please try again.');
    }
  };

  // Handle export PRD
  const handleExport = () => {
    if (!project) return;
    const content = isEditing ? editContent : displayContent;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_prd.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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
            setShowRefinementQuestions(true);
            
            // Load existing answers if any
            if (data.answers && data.answers.length > 0) {
              const answersMap: Record<number, string> = {};
              data.answers.forEach((answer: any) => {
                if (!answer.skipped) {
                  answersMap[answer.questionId] = answer.answer;
                }
              });
              setRefinementAnswers(answersMap);
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
      setShowRefinementQuestions(true);
      
      // Update metadata to reflect refinement phase
      updateMetadata({ 
        currentStep: 'refinement-questions',
        status: 'refining'
      });
    } catch (error) {
      console.error('Refinement error:', error);
      alert('Failed to generate refinement questions: ' + (error instanceof Error ? error.message : 'Unknown error'));
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
  };

  // Handle skip question
  const handleSkipQuestion = (questionId: number) => {
    setRefinementAnswers(prev => ({
      ...prev,
      [questionId]: ''
    }));
  };

  // Handle save refinement answers
  const handleSaveRefinements = async () => {
    if (!project) return;
    
    setIsSavingRefinements(true);
    try {
      const answers = refinementQuestions.map(question => ({
        questionId: question.id,
        question: question.question,
        answer: refinementAnswers[question.id] || '',
        skipped: !refinementAnswers[question.id],
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

      alert('Refinement answers saved successfully!');
      setShowRefinementQuestions(false);
      setRefinementStep(1);
      setRefinementAnswers({});
      
      // Update metadata to move to next step
      updateMetadata({ 
        currentStep: 'processing',
        status: 'processing'
      });
    } catch (error) {
      console.error('Error saving refinements:', error);
      alert('Failed to save refinement answers. Please try again.');
    } finally {
      setIsSavingRefinements(false);
    }
  };

  // Get current step questions (5 questions per step)
  const getCurrentStepQuestions = () => {
    const startIndex = (refinementStep - 1) * 5;
    const endIndex = startIndex + 5;
    const questions = refinementQuestions.slice(startIndex, endIndex);
    console.log('getCurrentStepQuestions:', {
      refinementStep,
      startIndex,
      endIndex,
      totalQuestions: refinementQuestions.length,
      questionsInStep: questions.length,
      questionIds: questions.map(q => q.id)
    });
    return questions;
  };

  const totalRefinementSteps = Math.ceil(refinementQuestions.length / 5);
  
  // Debug logging
  console.log('Refinement Questions Debug:', {
    totalQuestions: refinementQuestions.length,
    totalSteps: totalRefinementSteps,
    currentStep: refinementStep,
    currentQuestions: getCurrentStepQuestions().length,
    questions: refinementQuestions.map(q => ({ id: q.id, question: q.question.substring(0, 50) + '...' }))
  });

  // Handle content change with auto-save
  const handleContentChange = (newContent: string) => {
    setEditContent(newContent);

    // Clear existing timer
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
    }

    // Set new auto-save timer (3 seconds delay)
    if (newContent !== displayContent) {
      const timer = setTimeout(() => {
        autoSave(newContent);
      }, 3000);
      setAutoSaveTimer(timer);
    }
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }
    };
  }, [autoSaveTimer]);

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
  if (!project || !metadata || !answers) {
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
          <h1 className="text-3xl font-bold">PRD Preview</h1>
          <p className="text-muted-foreground mt-2">
            Generated based on your project specifications
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleEditToggle}
          >
            {isEditing ? <Check className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
            {isEditing ? "Editing" : "Edit PRD"}
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleExport}
          >
            <Download className="w-4 h-4" />
            Export PRD
          </Button>

        </div>
      </div>

      {/* PRD Content Display/Edit */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{project.name}</CardTitle>
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                Last modified: {new Date(metadata.lastEdited).toLocaleString()}
              </div>
              {isSaving && (
                <Badge variant="secondary" className="text-xs">
                  Saving...
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <div className="space-y-4">
              <Textarea
                value={editContent}
                onChange={(e) => handleContentChange(e.target.value)}
                className="min-h-[600px] font-mono text-sm"
                placeholder="Edit your PRD content here..."
              />
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {hasChanges ? (
                    autoSaveTimer ? "Auto-saving in 3s..." : "Changes saved automatically"
                  ) : "No changes"}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEditToggle}
                    className="flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={!hasChanges || isSaving}
                    className="flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Save Now
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <ScrollArea className="h-[600px] w-full">
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                  {displayContent}
                </pre>
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Refinement Questions */}
      {showRefinementQuestions && refinementQuestions.length > 0 && (
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
                {Object.keys(refinementAnswers).filter(id => refinementAnswers[parseInt(id)]).length} answered
              </Badge>
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
                  onClick={() => {
                    console.log('Previous button clicked. Current step:', refinementStep);
                    setRefinementStep(prev => {
                      const prevStep = Math.max(1, prev - 1);
                      console.log('Setting step to:', prevStep);
                      return prevStep;
                    });
                  }}
                  disabled={refinementStep === 1}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                                  <Button
                  variant="outline"
                  onClick={() => {
                    console.log('Next button clicked. Current step:', refinementStep, 'Total steps:', totalRefinementSteps);
                    setRefinementStep(prev => {
                      const nextStep = Math.min(totalRefinementSteps, prev + 1);
                      console.log('Setting step to:', nextStep);
                      return nextStep;
                    });
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
                  variant="outline"
                  onClick={() => {
                    setShowRefinementQuestions(false);
                    setRefinementStep(1);
                    setRefinementAnswers({});
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveRefinements}
                  disabled={isSavingRefinements}
                  className="flex items-center gap-2"
                >
                  {isSavingRefinements ? "Saving..." : "Save Answers & Continue"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Link href="/projects">
            <Button variant="outline">
              Back to Projects
            </Button>
          </Link>
        </div>
        <div className="flex gap-2">
          {!showRefinementQuestions && (
            <Button 
              onClick={handleRefinePRD}
              className="flex items-center gap-2"
              disabled={isSaving || isEditing || isRefining}
            >
              <Sparkles className="w-4 h-4" />
              {isRefining ? "Loading..." : metadata?.refinementQuestionsGenerated ? "Continue Refinement" : "Refine PRD"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
} 