"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Check } from "lucide-react";

const tools = [
  {
    id: "cursor",
    name: "Cursor",
    description: "AI-first code editor with built-in AI assistance and context awareness",
    features: [
      "Advanced AI code completion",
      "Built-in chat interface",
      "Context-aware suggestions",
      "Multi-language support",
      "Git integration"
    ],
    logo: "🚀",
    recommended: true
  },
  {
    id: "windsurf",
    name: "Windsurf",
    description: "AI-powered development environment with collaborative features",
    features: [
      "Real-time collaboration",
      "AI pair programming",
      "Code review automation",
      "Project templates",
      "Team management"
    ],
    logo: "🌊",
    recommended: false
  },
  {
    id: "claude-code",
    name: "Claude Code",
    description: "Specialized AI coding assistant with deep code understanding",
    features: [
      "Deep code analysis",
      "Bug detection",
      "Performance optimization",
      "Documentation generation",
      "Testing assistance"
    ],
    logo: "🤖",
    recommended: false
  }
];

export default function ToolSelectionPage({ params }: { params: { id: string } }) {
  const [selectedTool, setSelectedTool] = useState<string>("");

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Choose Your Development Tool</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Select the development tool you'll be using. We'll customize your context files 
          specifically for your chosen environment.
        </p>
      </div>

      {/* Tool Cards */}
      <RadioGroup value={selectedTool} onValueChange={setSelectedTool}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Card 
              key={tool.id} 
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedTool === tool.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedTool(tool.id)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">{tool.logo}</div>
                    <div>
                      <CardTitle className="text-lg">{tool.name}</CardTitle>
                      {tool.recommended && (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                          Recommended
                        </span>
                      )}
                    </div>
                  </div>
                  <RadioGroupItem value={tool.id} id={tool.id} className="sr-only" />
                  {selectedTool === tool.id && (
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                      <Check className="w-4 h-4 text-primary-foreground" />
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription className="text-sm leading-relaxed">
                  {tool.description}
                </CardDescription>
                <div className="space-y-2">
                  <h4 className="text-sm font-medium">Key Features:</h4>
                  <ul className="text-xs text-muted-foreground space-y-1">
                    {tool.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-1 h-1 bg-primary rounded-full mr-2"></span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </RadioGroup>

      {/* Selection Actions */}
      <div className="flex justify-center pt-8">
        <Button 
          size="lg" 
          disabled={!selectedTool}
          className="flex items-center gap-2"
        >
          Continue with {selectedTool ? tools.find(t => t.id === selectedTool)?.name : 'Tool'}
        </Button>
      </div>

      {/* Additional Info */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="text-center space-y-2">
            <h3 className="font-medium">Not sure which tool to choose?</h3>
            <p className="text-sm text-muted-foreground">
              We recommend <strong>Cursor</strong> for most developers as it provides the best 
              integration with our context engineering approach. You can always change your 
              selection later and regenerate your context files.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 