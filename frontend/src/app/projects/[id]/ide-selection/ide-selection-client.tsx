"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Code, Sparkles, Zap, Palette, Brain, Cpu } from "lucide-react";
import Link from "next/link";
import { useProjectState } from "@/hooks/use-project-state";
import { apiStorage } from "@/lib/api-storage";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface IDESelectionClientProps {
  projectId: string;
}

interface IDEOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  available: boolean;
  comingSoon?: boolean;
}

const IDE_OPTIONS: IDEOption[] = [
  {
    id: 'cursor',
    name: 'Cursor',
    description: 'AI-first code editor with advanced code generation and editing capabilities',
    icon: <Code className="w-8 h-8" />,
    available: true,
  },
  {
    id: 'nora',
    name: 'Nora',
    description: 'AI-powered development environment with intelligent code assistance',
    icon: <Brain className="w-8 h-8" />,
    available: true,
  },
  {
    id: 'windsurf',
    name: 'Windsurf',
    description: 'Modern IDE with advanced debugging and collaboration features',
    icon: <Zap className="w-8 h-8" />,
    available: false,
    comingSoon: true,
  },
  {
    id: 'v0',
    name: 'v0',
    description: 'Next-generation development platform with AI-driven workflows',
    icon: <Sparkles className="w-8 h-8" />,
    available: false,
    comingSoon: true,
  },
  {
    id: 'lovable',
    name: 'Lovable',
    description: 'User-friendly IDE designed for rapid prototyping and development',
    icon: <Palette className="w-8 h-8" />,
    available: false,
    comingSoon: true,
  },
  {
    id: 'claude-code',
    name: 'Claude Code',
    description: 'AI-powered coding assistant with advanced code analysis',
    icon: <Cpu className="w-8 h-8" />,
    available: false,
    comingSoon: true,
  },
];

export default function IDESelectionClient({ projectId }: IDESelectionClientProps) {
  const { 
    project, 
    metadata, 
    isLoading 
  } = useProjectState(projectId);

  const [selectedIDE, setSelectedIDE] = useState<string>(metadata?.selectedIDE || '');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Handle IDE selection
  const handleIDESelection = (ideId: string) => {
    const ide = IDE_OPTIONS.find(option => option.id === ideId);
    if (ide && ide.available) {
      setSelectedIDE(ideId);
    }
  };

  // Handle generate
  const handleGenerate = async () => {
    if (!project || !selectedIDE) return;

    setIsGenerating(true);
    try {
      // Update metadata with selected IDE
      await apiStorage.saveProjectMetadata({
        ...metadata!,
        selectedIDE,
        currentStep: 'generating',
        status: 'generating'
      });

      // TODO: Add actual generation logic here
      // For now, just show success dialog
      setShowSuccessDialog(true);
    } catch (error) {
      console.error('Error generating IDE rails:', error);
      setErrorMessage('Failed to generate IDE rails. Please try again.');
      setShowErrorDialog(true);
    } finally {
      setIsGenerating(false);
    }
  };

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
          <h1 className="text-3xl font-bold">Create IDE Rails</h1>
          <p className="text-muted-foreground mt-2">
            Choose your preferred development environment to generate project artifacts
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link href={`/projects/${project.id}/prd-refined`}>
            <Button variant="outline">
              Back to Refined PRD
            </Button>
          </Link>
        </div>
      </div>

      {/* IDE Selection Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {IDE_OPTIONS.map((ide) => (
          <TooltipProvider key={ide.id}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Card 
                    className={`cursor-pointer transition-all duration-200 ${
                      selectedIDE === ide.id
                        ? 'ring-2 ring-primary border-primary'
                        : ide.available
                        ? 'hover:shadow-md hover:scale-105'
                        : 'opacity-60 cursor-not-allowed'
                    }`}
                    onClick={() => handleIDESelection(ide.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            selectedIDE === ide.id
                              ? 'bg-primary text-primary-foreground'
                              : 'bg-muted'
                          }`}>
                            {ide.icon}
                          </div>
                          <div>
                            <CardTitle className="text-lg">{ide.name}</CardTitle>
                            {ide.comingSoon && (
                              <Badge variant="secondary" className="text-xs">
                                Coming Soon
                              </Badge>
                            )}
                          </div>
                        </div>
                        {selectedIDE === ide.id && (
                          <Badge variant="default" className="text-xs">
                            Selected
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {ide.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TooltipTrigger>
              {ide.comingSoon && (
                <TooltipContent>
                  <p>Coming Soon</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        ))}
      </div>

      {/* Generate Button */}
      <div className="flex justify-center pt-8">
        <Button
          size="lg"
          onClick={handleGenerate}
          disabled={!selectedIDE || isGenerating}
          className="flex items-center gap-2"
        >
          {isGenerating ? (
            <>
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              Generate
            </>
          )}
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between pt-8 border-t">
        <div className="flex gap-2">
          <Link href="/projects">
            <Button variant="outline">
              Back to Projects
            </Button>
          </Link>
          <Link href={`/projects/${project.id}/prd-refined`}>
            <Button variant="outline">
              Back to Refined PRD
            </Button>
          </Link>
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Success!</DialogTitle>
            <DialogDescription>
              IDE rails generation has been initiated successfully.
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