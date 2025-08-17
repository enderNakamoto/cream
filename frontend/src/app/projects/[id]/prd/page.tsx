"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Edit, ArrowRight, Download, Save, X, Check } from "lucide-react";
import Link from "next/link";
import { useProjectState } from "@/hooks/use-project-state";

export default function PRDPreviewPage({ params }: { params: { id: string } }) {
  const { 
    project, 
    metadata, 
    answers, 
    prdContent, 
    isLoading, 
    isSaving,
    nextStep 
  } = useProjectState(params.id);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center py-16">
          <p className="text-muted-foreground">Loading project...</p>
        </div>
      </div>
    );
  }

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

  // Generate mock PRD content if none exists
  const displayContent = prdContent || `# Product Requirements Document
## ${project.name}

### Overview
This is a generated PRD based on your project specifications.

### Project Details
- **Project Name**: ${answers.initialAnswers.projectName}
- **Project Type**: ${answers.initialAnswers.projectType}
- **Target Audience**: ${answers.initialAnswers.targetAudience}
- **Complexity**: ${answers.initialAnswers.complexity}
- **Timeline**: ${answers.initialAnswers.timeline}

### Description
${answers.initialAnswers.description}

### Next Steps
This is a draft PRD. You can edit it to add more details and refine the requirements.
`;

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
          <Badge variant="outline">
            Version {metadata.prdVersion}
          </Badge>
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>

      {/* PRD Content Display */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{project.name}</CardTitle>
            <div className="text-sm text-muted-foreground">
              Last modified: {new Date(metadata.lastEdited).toLocaleString()}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] w-full">
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                {displayContent}
              </pre>
            </div>
          </ScrollArea>
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
          <Link href={`/projects/${project.id}/edit`}>
            <Button className="flex items-center gap-2">
              <Edit className="w-4 h-4" />
              Edit PRD
            </Button>
          </Link>
          <Button 
            onClick={nextStep}
            className="flex items-center gap-2"
            disabled={isSaving}
          >
            Continue
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
} 