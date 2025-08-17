import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  Play, 
  FileText, 
  Settings, 
  Code, 
  Palette, 
  Bug, 
  Sparkles, 
  Layers, 
  Users, 
  Clock,
  CheckCircle,
  Zap
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-6 py-16">
        <div className="space-y-4">
          <h1 className="text-6xl font-bold text-primary">C.R.E.A.M</h1>
          <h2 className="text-2xl font-semibold text-muted-foreground">
            Context Rules Everything Around Me
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Stop prompting like it's 2024
          </p>
        </div>
        <Link href="/projects">
          <Button size="lg" className="text-lg px-8 py-6">
            Get Started
          </Button>
        </Link>
      </section>

      {/* Context Engineering Section */}
      <section className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl">Context Engineering</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-lg leading-relaxed">
              Transform your development workflow with intelligent context engineering. 
              Our platform helps you create comprehensive, tool-specific context files 
              that enhance your AI coding experience across multiple development environments.
            </CardDescription>
          </CardContent>
        </Card>
      </section>

      {/* Demo Section */}
      <section className="space-y-6">
        <h2 className="text-3xl font-bold text-center">See It In Action</h2>
        <Card className="max-w-4xl mx-auto">
          <CardContent className="p-0">
            <AspectRatio ratio={16 / 9} className="relative">
              <div className="absolute inset-0 bg-muted flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                    <Play className="w-8 h-8 text-primary ml-1" />
                  </div>
                  <p className="text-muted-foreground">Demo Video Coming Soon</p>
                </div>
              </div>
            </AspectRatio>
          </CardContent>
        </Card>
      </section>

      {/* Context Engineering Explanation */}
      <section className="space-y-8">
        <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-primary/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary text-2xl">
              <FileText className="w-6 h-6" />
              What is Context Engineering?
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-base leading-relaxed">
              Context engineering, popularized by Andrej Karpathy (OpenAI founding member), is about managing the information you provide to large language models (LLMs) so they can perform tasks accurately and efficiently. Unlike traditional prompt engineering, context engineering involves:
            </p>
            <ul className="text-base space-y-2 ml-4">
              <li className="flex items-start gap-2">
                <span className="text-primary font-medium">•</span>
                <span>Providing all relevant facts, rules, tools, and information within the model's context window</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-medium">•</span>
                <span>Structuring information to prevent hallucinations and ensure precise task understanding</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary font-medium">•</span>
                <span>Efficiently managing context to avoid overwhelming the model and reducing accuracy</span>
              </li>
            </ul>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="text-sm font-medium text-muted-foreground">
                💡 <strong>Why it matters:</strong> The AI app you use matters. Apps like Cursor and Claude Code are more than frontends; they are integral parts of effective context engineering that reduce hallucinations and improve output quality.
              </p>
            </div>
          </CardContent>
        </Card>

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

        {/* Workflow Section */}
        <div className="space-y-6">
          <div className="text-center">
            <h3 className="text-2xl font-bold">Context Engineering Workflow</h3>
            <p className="text-muted-foreground mt-2">
              A proven step-by-step approach to effective AI-assisted development
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-bold">1</span>
                  PRD Foundation
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Start with a comprehensive Project Requirement Document that lists all features, requirements, and tech stack preferences.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-bold">2</span>
                  Documentation Structure
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Build a structured documentation folder with key files that provide organized context for AI development.
                </p>
              </CardContent>
            </Card>

            <Card className="border-primary/20 bg-primary/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <span className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full text-sm font-bold">3</span>
                  Context Rules
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Define crucial rules that guide the model and ensure step-by-step progress without context overflow.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center space-y-6 py-16">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold">Ready to Transform Your Workflow?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Join thousands of developers who are already using context engineering 
            to supercharge their AI coding experience.
          </p>
        </div>
        <div className="flex gap-4 justify-center">
          <Link href="/projects/new">
            <Button size="lg" className="text-lg px-8 py-6">
              Start Your First Project
            </Button>
          </Link>
          <Button size="lg" variant="outline" className="text-lg px-8 py-6">
            Learn More
          </Button>
        </div>
      </section>
    </div>
  );
}
