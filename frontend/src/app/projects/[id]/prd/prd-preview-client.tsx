"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Edit, ArrowRight, Download, Save, X, Check } from "lucide-react";
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
    updatePRDContent
  } = useProjectState(projectId);

  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);

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

  // Initialize edit content when entering edit mode
  useEffect(() => {
    if (isEditing && displayContent) {
      setEditContent(displayContent);
      setHasChanges(false);
    }
  }, [isEditing, displayContent]);

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
      setEditContent("");
      setHasChanges(false);
    } else {
      // Start editing
      setIsEditing(true);
    }
  };

  // Handle save
  const handleSave = () => {
    updatePRDContent(editContent);
    setIsEditing(false);
    setHasChanges(false);
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
      setAutoSaveTimer(null);
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

  // Handle content change with auto-save
  const handleContentChange = (newContent: string) => {
    setEditContent(newContent);
    const changed = newContent !== displayContent;
    setHasChanges(changed);

    // Clear existing timer
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
    }

    // Set new auto-save timer (3 seconds delay)
    if (changed) {
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
          <Button 
            onClick={nextStep}
            className="flex items-center gap-2"
            disabled={isSaving || isEditing}
          >
            Continue
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
} 