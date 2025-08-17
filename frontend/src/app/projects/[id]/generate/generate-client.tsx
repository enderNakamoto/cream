"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  FileText, 
  Settings, 
  Code, 
  Palette, 
  Bug, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  Users, 
  Clock,
  CheckCircle,
  Zap
} from "lucide-react";
import Link from "next/link";
import { useProjectState } from "@/hooks/use-project-state";
import { apiStorage } from "@/lib/api-storage";

interface GenerateClientProps {
  projectId: string;
}

interface RuleFile {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

interface DocFile {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const RULE_FILES: RuleFile[] = [
  {
    id: 'generate-rule',
    name: 'Generate Rule',
    description: 'Converts the PRD into all other documentation files, effectively "filling" the context window with relevant info.',
    icon: <Sparkles className="w-6 h-6" />,
    color: 'text-purple-600 bg-purple-50 border-purple-200'
  },
  {
    id: 'work-rule',
    name: 'Work Rule',
    description: 'Guides the model on how to use each file during development (e.g., referring to bug tracking when errors arise).',
    icon: <Settings className="w-6 h-6" />,
    color: 'text-blue-600 bg-blue-50 border-blue-200'
  }
];

const DOC_FILES: DocFile[] = [
  {
    id: 'implementation-plan',
    name: 'Implementation Plan',
    description: 'The blueprint for the entire development process.',
    icon: <Code className="w-6 h-6" />,
    color: 'text-green-600 bg-green-50 border-green-200'
  },
  {
    id: 'project-structure',
    name: 'Project Structure',
    description: 'A live document that evolves as the project takes shape.',
    icon: <Layers className="w-6 h-6" />,
    color: 'text-orange-600 bg-orange-50 border-orange-200'
  },
  {
    id: 'ui-ux-docs',
    name: 'UI/UX Documentation',
    description: 'Guidelines and details about the user interface and experience.',
    icon: <Palette className="w-6 h-6" />,
    color: 'text-pink-600 bg-pink-50 border-pink-200'
  },
  {
    id: 'bug-tracking',
    name: 'Bug Tracking',
    description: 'A log of issues to avoid redundant troubleshooting.',
    icon: <Bug className="w-6 h-6" />,
    color: 'text-red-600 bg-red-50 border-red-200'
  }
];

export default function GenerateClient({ projectId }: GenerateClientProps) {
  const { 
    project, 
    metadata, 
    isLoading 
  } = useProjectState(projectId);

  const [isGenerating, setIsGenerating] = useState(false);

  // Handle generate
  const handleGenerate = async () => {
    if (!project) return;

    setIsGenerating(true);
    try {
      // Update metadata to generating status
      await apiStorage.saveProjectMetadata({
        ...metadata!,
        currentStep: 'generating',
        status: 'generating'
      });

      // TODO: Add actual generation logic here
      // For now, just simulate generation
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirect to results page or show success
      console.log('Generation completed');
    } catch (error) {
      console.error('Error generating files:', error);
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
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">Generate Project Context</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
          Transform your refined PRD into comprehensive documentation and rules that will guide AI development tools
        </p>
      </div>

      {/* Value Proposition */}
      <Alert className="border-primary/20 bg-primary/5">
        <Zap className="h-4 w-4" />
        <AlertDescription className="text-base">
          <strong>The Missing Orchestration Layer:</strong> This platform serves as the missing orchestration layer that transforms human requirements into structured, actionable context for AI development tools while maintaining:
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              Project Coherence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Maintain consistency across tool switches and development phases
            </p>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary" />
              Design Consistency
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Systematic design system generation ensures visual and functional consistency
            </p>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Context Continuity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Seamless context transfer regardless of AI agent choice or tool selection
            </p>
          </CardContent>
        </Card>

        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Knowledge Preservation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Preserve and transfer knowledge over time and across team members
            </p>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Rule Files */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Rule Files</h2>
          <p className="text-muted-foreground mt-2">
            Core rules that guide the AI development process
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {RULE_FILES.map((rule) => (
            <Card key={rule.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${rule.color}`}>
                    {rule.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{rule.name}</CardTitle>
                    <Badge variant="outline" className="text-xs">
                      Rule File
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {rule.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Separator />

      {/* Documentation Files */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Documentation Files</h2>
          <p className="text-muted-foreground mt-2">
            Comprehensive documentation that will be generated from your PRD
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {DOC_FILES.map((doc) => (
            <Card key={doc.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${doc.color}`}>
                    {doc.icon}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{doc.name}</CardTitle>
                    <Badge variant="outline" className="text-xs">
                      Documentation
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {doc.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Separator />

      {/* Generate Button */}
      <div className="text-center space-y-6">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Ready to Generate?</h3>
          <p className="text-muted-foreground">
            This will create all the rule files and documentation needed for your AI development workflow
          </p>
        </div>
        
        <Button
          size="lg"
          onClick={handleGenerate}
          disabled={isGenerating}
          className="flex items-center gap-3 px-8 py-6 text-lg font-semibold h-auto"
        >
          {isGenerating ? (
            <>
              <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
              Generating Files...
            </>
          ) : (
            <>
              <Sparkles className="w-6 h-6" />
              Generate All Files
              <ArrowRight className="w-6 h-6" />
            </>
          )}
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-center pt-8 border-t">
        <div className="flex gap-2">
          <Link href="/projects">
            <Button variant="outline">
              Back to Projects
            </Button>
          </Link>
          <Link href={`/projects/${project.id}/ide-selection`}>
            <Button variant="outline">
              Back to IDE Selection
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
} 