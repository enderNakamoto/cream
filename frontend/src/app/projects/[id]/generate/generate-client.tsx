"use client";

import { useState, useEffect } from "react";
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
import { useRouter } from "next/navigation";
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
  },
  {
    id: 'shadcn-ui-rule',
    name: 'shadcn-UI.md',
    description: 'Orchestrates with shadCN MCP to create consistent UI with minimal effort.',
    icon: <Palette className="w-6 h-6" />,
    color: 'text-green-600 bg-green-50 border-green-200'
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

// Web3-specific documentation files
const getWeb3DocFiles = (answers: any): DocFile[] => {
  console.log('getWeb3DocFiles called with answers:', answers);
  console.log('Answers keys:', Object.keys(answers));
  const web3Docs: DocFile[] = [];

  // Oracle documentation
  console.log('Checking oracle solution:', answers.oracleSolution, 'Type:', typeof answers.oracleSolution);
  if (answers.oracleSolution === 'chainlink') {
    console.log('Adding Chainlink docs');
    web3Docs.push({
      id: 'chainlink-docs',
      name: 'Chainlink Documentation',
      description: 'Chainlink oracle integration and best practices.',
      icon: <Code className="w-6 h-6" />,
      color: 'text-blue-600 bg-blue-50 border-blue-200'
    });
  } else if (answers.oracleSolution === 'acurast') {
    console.log('Adding Acurast docs');
    web3Docs.push({
      id: 'acurast-docs',
      name: 'Acurast Documentation',
      description: 'Acurast oracle integration and best practices.',
      icon: <Code className="w-6 h-6" />,
      color: 'text-indigo-600 bg-indigo-50 border-indigo-200'
    });
  } else {
    console.log('Oracle solution not matched:', answers.oracleSolution);
  }

  // Cross-chain solution documentation
  console.log('Checking cross-chain solution:', answers.crossChainSolution, 'Type:', typeof answers.crossChainSolution);
  if (answers.crossChainSolution === 'layer-zero') {
    console.log('Adding Layer Zero docs');
    web3Docs.push({
      id: 'layer-zero-docs',
      name: 'Layer Zero Documentation',
      description: 'Layer Zero cross-chain integration and best practices.',
      icon: <Layers className="w-6 h-6" />,
      color: 'text-purple-600 bg-purple-50 border-purple-200'
    });
  } else if (answers.crossChainSolution === 'hyperlane') {
    console.log('Adding Hyperlane docs');
    web3Docs.push({
      id: 'hyperlane-docs',
      name: 'Hyperlane Documentation',
      description: 'Hyperlane cross-chain integration and best practices.',
      icon: <Layers className="w-6 h-6" />,
      color: 'text-cyan-600 bg-cyan-50 border-cyan-200'
    });
  } else {
    console.log('Cross-chain solution not matched:', answers.crossChainSolution);
  }

  // Wallet integration documentation
  console.log('Checking wallet integration:', answers.walletIntegration, 'Type:', typeof answers.walletIntegration);
  if (answers.walletIntegration === 'rainbowkit') {
    console.log('Adding RainbowKit docs');
    web3Docs.push({
      id: 'rainbowkit-docs',
      name: 'RainbowKit Documentation',
      description: 'RainbowKit wallet integration and best practices.',
      icon: <Palette className="w-6 h-6" />,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200'
    });
  } else if (answers.walletIntegration === 'dynamic') {
    console.log('Adding Dynamic docs');
    web3Docs.push({
      id: 'dynamic-docs',
      name: 'Dynamic Documentation',
      description: 'Dynamic wallet integration and best practices.',
      icon: <Palette className="w-6 h-6" />,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200'
    });
  } else {
    console.log('Wallet integration not matched:', answers.walletIntegration);
  }

  console.log('Final web3Docs array:', web3Docs);
  return web3Docs;
};

export default function GenerateClient({ projectId }: GenerateClientProps) {
  const router = useRouter();
  const { 
    project, 
    metadata, 
    isLoading 
  } = useProjectState(projectId);

  const [projectAnswers, setProjectAnswers] = useState<any>(null);
  const [web3DocFiles, setWeb3DocFiles] = useState<DocFile[]>([]);

  // Load project answers and determine Web3 documentation files
  useEffect(() => {
    const loadProjectData = async () => {
      if (project) {
        try {
          const answers = await apiStorage.getProjectAnswers(project.id);
          console.log('Project answers:', answers);
          setProjectAnswers(answers);
          
          // Check if it's a Web3 project and get specific documentation files
          const projectType = answers?.initialAnswers?.projectType;
          console.log('Checking project type:', projectType);
          
          if (projectType === 'Web3 DApp' || projectType === 'web3-dapp' || projectType === 'Web3 Dapp') {
            console.log('Web3 project detected, initial answers:', answers?.initialAnswers);
            const web3Docs = getWeb3DocFiles(answers?.initialAnswers || {});
            console.log('Web3 docs generated:', web3Docs);
            setWeb3DocFiles(web3Docs);
          } else {
            console.log('Not a Web3 project or projectType not found:', projectType);
          }
        } catch (error) {
          console.error('Error loading project answers:', error);
        }
      }
    };

    loadProjectData();
  }, [project]);



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
          Transform your refined PRD into comprehensive documentation and rules for AI development tools
        </p>
      </div>

      {/* Rule Files */}
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Rule Files</h2>
          <p className="text-muted-foreground mt-2">
            Core rules that guide the AI development process and prevent context overflow
          </p>
        </div>

        <Alert className="border-blue-200 bg-blue-50">
          <Settings className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Why Rules Matter:</strong> These rules ensure the model can work step-by-step without losing track or hallucinating due to context overflow. They provide structured guidance for efficient context management.
          </AlertDescription>
        </Alert>

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
                    <div className="flex gap-2">
                      <Badge variant="outline" className="text-xs">
                        Rule File
                      </Badge>
                      {rule.id === 'shadcn-ui-rule' && (
                        <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800 border-orange-200">
                          Coming Soon
                        </Badge>
                      )}
                    </div>
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
            Comprehensive documentation that will be generated from your PRD to fill the context window
          </p>
        </div>

        <Alert className="border-green-200 bg-green-50">
          <Layers className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Context Window Management:</strong> Don't dump everything into one file; break context into manageable pieces. Provide context only when necessary to keep the model focused and avoid overwhelming it.
          </AlertDescription>
        </Alert>

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



      {/* Web3 Documentation Files */}
      {web3DocFiles.length > 0 && (
        <>
          <Separator />
          
          <div className="space-y-6">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <h2 className="text-2xl font-bold">Web3 Integration Documentation</h2>
                <Badge variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200">
                  Coming Soon
                </Badge>
              </div>
              <p className="text-muted-foreground mt-2">
                Additional documentation for your selected Web3 integrations
              </p>
            </div>

            <Alert className="border-amber-200 bg-amber-50">
              <Code className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800">
                <strong>Web3 Context:</strong> These files provide specific integration details for your chosen Web3 technologies, ensuring proper implementation and best practices.
              </AlertDescription>
            </Alert>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {web3DocFiles.map((doc) => (
                <Card key={doc.id} className="hover:shadow-lg transition-shadow border-amber-200 bg-amber-50/30">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${doc.color}`}>
                        {doc.icon}
                      </div>
                      <div>
                        <CardTitle className="text-lg">{doc.name}</CardTitle>
                        <Badge variant="outline" className="text-xs">
                          Web3 Integration
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
        </>
      )}

      <Separator />

      {/* Generate Button */}
      <div className="flex flex-col items-center space-y-6">
        <div className="text-center space-y-2 max-w-2xl">
          <h3 className="text-xl font-semibold">Ready to Generate Your Context Engineering Setup?</h3>
          <p className="text-muted-foreground">
            This will create all the rule files and documentation needed for your AI development workflow
          </p>
        </div>

        <Card className="border-primary/20 bg-primary/5 p-4 max-w-2xl">
          <p className="text-sm text-muted-foreground text-center">
            💡 <strong>Pro Tip:</strong> Use your app's task list features to break down large tasks into subtasks intelligently.
          </p>
        </Card>
        
        <Button
          size="lg"
          onClick={() => router.push(`/projects/${project.id}/generate-docs`)}
          className="flex items-center gap-3 px-8 py-6 text-lg font-semibold h-auto"
        >
          <Sparkles className="w-6 h-6" />
          Generate Documentation
          <ArrowRight className="w-6 h-6" />
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