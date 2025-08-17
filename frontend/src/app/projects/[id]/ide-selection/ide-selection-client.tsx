"use client";

import { useState, useEffect } from "react";
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

  const [selectedIDEs, setSelectedIDEs] = useState<string[]>(metadata?.selectedIDEs || []);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Update local state when metadata changes
  useEffect(() => {
    if (metadata?.selectedIDEs) {
      setSelectedIDEs(metadata.selectedIDEs);
    }
  }, [metadata?.selectedIDEs]);

  // Handle IDE selection
  const handleIDESelection = async (ideId: string) => {
    const ide = IDE_OPTIONS.find(option => option.id === ideId);
    if (ide && ide.available) {
      const newSelectedIDEs = selectedIDEs.includes(ideId)
        ? selectedIDEs.filter(id => id !== ideId)
        : [...selectedIDEs, ideId];
      
      setSelectedIDEs(newSelectedIDEs);

      // Auto-save to metadata
      setIsSaving(true);
      try {
        await apiStorage.saveProjectMetadata({
          ...metadata!,
          selectedIDEs: newSelectedIDEs
        });
      } catch (error) {
        console.error('Error saving IDE selection:', error);
      } finally {
        setIsSaving(false);
      }
    }
  };

  // Handle generate
  const handleGenerate = async () => {
    if (!project || selectedIDEs.length === 0) return;

    setIsGenerating(true);
    try {
      // Update metadata with selected IDEs
      await apiStorage.saveProjectMetadata({
        ...metadata!,
        selectedIDEs,
        currentStep: 'generating',
        status: 'generating'
      });

      // Redirect to generate page
      window.location.href = `/projects/${project.id}/generate`;
    } catch (error) {
      console.error('Error updating project:', error);
      setErrorMessage('Failed to update project. Please try again.');
      setShowErrorDialog(true);
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
            Choose one or more development environments to generate project artifacts
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
                       selectedIDEs.includes(ide.id)
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
                             selectedIDEs.includes(ide.id)
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
                         {selectedIDEs.includes(ide.id) && (
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

            {/* Selection Summary and Generate Button */}
      <div className="flex flex-col items-center gap-4 pt-8">
        {selectedIDEs.length > 0 && (
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {selectedIDEs.length} IDE{selectedIDEs.length > 1 ? 's' : ''} selected
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {selectedIDEs.map(id => IDE_OPTIONS.find(ide => ide.id === id)?.name).join(', ')}
            </p>
            {isSaving && (
              <p className="text-xs text-blue-600 mt-1 flex items-center justify-center gap-1">
                <div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                Saving...
              </p>
            )}
          </div>
        )}
        <Button
          size="lg"
          onClick={handleGenerate}
          disabled={selectedIDEs.length === 0 || isGenerating}
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