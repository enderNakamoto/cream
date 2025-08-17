"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Download, Edit, Save, X, Check } from "lucide-react";
import Link from "next/link";
import { useProjectState } from "@/hooks/use-project-state";
import { apiStorage } from "@/lib/api-storage";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface RefinedPRDPreviewClientProps {
  projectId: string;
}

export default function RefinedPRDPreviewClient({ projectId }: RefinedPRDPreviewClientProps) {
  const { 
    project, 
    metadata, 
    isLoading 
  } = useProjectState(projectId);

  const [refinedPRDContent, setRefinedPRDContent] = useState("");
  const [isLoadingPRD, setIsLoadingPRD] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Load refined PRD content
  useEffect(() => {
    const loadRefinedPRD = async () => {
      if (!project) return;
      
      try {
        setIsLoadingPRD(true);
        const content = await apiStorage.getRefinedPRDContent(project.id);
        setRefinedPRDContent(content);
      } catch (error) {
        console.error('Error loading refined PRD:', error);
      } finally {
        setIsLoadingPRD(false);
      }
    };

    loadRefinedPRD();
  }, [project]);

  // Handle export refined PRD
  const handleExport = () => {
    if (!project || !refinedPRDContent) return;
    
    const content = isEditing ? editContent : refinedPRDContent;
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_prd_refined.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Auto-save functionality
  const autoSave = useCallback((content: string) => {
    if (content !== refinedPRDContent) {
      // Save to refined PRD file
      apiStorage.saveRefinedPRDContent(project!.id, content);
    }
  }, [refinedPRDContent, project]);

  // Handle edit mode toggle
  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing
      setIsEditing(false);
      setEditContent(refinedPRDContent);
      setHasChanges(false);
    } else {
      // Start editing
      setIsEditing(true);
      setEditContent(refinedPRDContent);
    }
  };

  // Handle save
  const handleSave = async () => {
    try {
      console.log('Saving refined PRD content:', editContent.substring(0, 100) + '...');
      await apiStorage.saveRefinedPRDContent(project!.id, editContent);
      setRefinedPRDContent(editContent);
      console.log('Refined PRD content saved successfully');
      setIsEditing(false);
      setHasChanges(false);
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
        setAutoSaveTimer(null);
      }
      // Show success feedback
      setShowSuccessDialog(true);
    } catch (error) {
      console.error('Error saving refined PRD:', error);
      setErrorMessage('Failed to save refined PRD. Please try again.');
      setShowErrorDialog(true);
    }
  };

  // Handle content change with auto-save
  const handleContentChange = (newContent: string) => {
    setEditContent(newContent);

    // Clear existing timer
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
    }

    // Set new auto-save timer (3 seconds delay)
    if (newContent !== refinedPRDContent) {
      const timer = setTimeout(() => {
        autoSave(newContent);
      }, 3000);
      setAutoSaveTimer(timer);
    }
  };

  // Update hasChanges when editContent or refinedPRDContent changes
  useEffect(() => {
    if (isEditing) {
      const changed = editContent !== refinedPRDContent;
      setHasChanges(changed);
    }
  }, [editContent, refinedPRDContent, isEditing]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }
    };
  }, [autoSaveTimer]);

  // Loading state
  if (isLoading || isLoadingPRD) {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center py-16">
          <p className="text-muted-foreground">Loading refined PRD...</p>
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

  // No refined PRD content
  if (!refinedPRDContent) {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center py-16">
          <p className="text-muted-foreground">No refined PRD found. Please complete the refinement process first.</p>
          <Link href={`/projects/${project.id}/refinements`}>
            <Button className="mt-4">Go to Refinements</Button>
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
          <h1 className="text-3xl font-bold">Refined PRD</h1>
          <p className="text-muted-foreground mt-2">
            Enhanced product requirements document based on refinement answers
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleEditToggle}
          >
            {isEditing ? <Check className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
            {isEditing ? "Editing" : "Edit Refined PRD"}
          </Button>
          <Link href={`/projects/${project.id}/prd`}>
            <Button variant="outline">
              View Original PRD
            </Button>
          </Link>
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleExport}
          >
            <Download className="w-4 h-4" />
            Export Refined PRD
          </Button>
        </div>
      </div>

      {/* Refined PRD Content */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{project.name} - Refined</CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="default">Refined</Badge>
              <Badge variant="secondary">
                {metadata.status === 'complete' ? 'Complete' : 'Processing'}
              </Badge>
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
                placeholder="Edit your refined PRD content here..."
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
                    disabled={!hasChanges}
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
                <pre className="whitespace-pre-wrap font-mono text-sm">{refinedPRDContent}</pre>
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Link href="/projects">
            <Button variant="outline">
              Back to Projects
            </Button>
          </Link>
          <Link href={`/projects/${project.id}/prd`}>
            <Button variant="outline">
              View Original PRD
            </Button>
          </Link>
        </div>
        <div className="flex gap-2">
          <Link href={`/projects/${project.id}/refinements`}>
            <Button variant="outline">
              Back to Refinements
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
              Your refined PRD has been saved successfully.
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