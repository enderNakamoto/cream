"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Download, 
  Eye, 
  Edit, 
  RefreshCw, 
  FileText, 
  Code, 
  Settings, 
  Database, 
  Globe,
  CheckCircle,
  AlertCircle,
  Clock,
  Loader2
} from "lucide-react";

// Mock file data
const mockFiles = [
  {
    id: 1,
    name: "project-context.md",
    description: "Main project context file with overview and architecture",
    type: "markdown",
    status: "generated",
    lastModified: "2024-01-15 14:30",
    size: "2.3 KB",
    content: "# Project Context\n\nThis file contains the main context for the E-commerce Platform project..."
  },
  {
    id: 2,
    name: "code-style.md",
    description: "Coding standards and style guidelines",
    type: "markdown",
    status: "generated",
    lastModified: "2024-01-15 14:30",
    size: "1.8 KB",
    content: "# Code Style Guidelines\n\n## General Principles\n- Use TypeScript for type safety..."
  },
  {
    id: 3,
    name: "api-spec.md",
    description: "API endpoints and data models specification",
    type: "markdown",
    status: "generated",
    lastModified: "2024-01-15 14:30",
    size: "3.1 KB",
    content: "# API Specification\n\n## Authentication\nPOST /api/auth/login..."
  },
  {
    id: 4,
    name: "database-schema.md",
    description: "Database schema and relationships",
    type: "markdown",
    status: "generated",
    lastModified: "2024-01-15 14:30",
    size: "2.7 KB",
    content: "# Database Schema\n\n## Users Table\n```sql\nCREATE TABLE users (..."
  },
  {
    id: 5,
    name: "deployment.md",
    description: "Deployment configuration and environment setup",
    type: "markdown",
    status: "generating",
    lastModified: "2024-01-15 14:30",
    size: "0 KB",
    content: ""
  }
];

const fileIcons = {
  markdown: FileText,
  code: Code,
  config: Settings,
  database: Database,
  api: Globe
};

const statusConfig = {
  generated: { 
    label: "Generated", 
    variant: "default" as const, 
    icon: CheckCircle,
    color: "text-green-600"
  },
  generating: { 
    label: "Generating", 
    variant: "secondary" as const, 
    icon: Loader2,
    color: "text-blue-600"
  },
  edited: { 
    label: "Edited", 
    variant: "outline" as const, 
    icon: Edit,
    color: "text-orange-600"
  },
  error: { 
    label: "Error", 
    variant: "destructive" as const, 
    icon: AlertCircle,
    color: "text-red-600"
  }
};

export default function FilesManagementPage({ params }: { params: { id: string } }) {
  const [selectedFile, setSelectedFile] = useState<typeof mockFiles[0] | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateAll = () => {
    setIsGenerating(true);
    // Simulate generation
    setTimeout(() => setIsGenerating(false), 3000);
  };

  const handleRegenerateFile = (fileId: number) => {
    // Handle file regeneration
    console.log("Regenerating file:", fileId);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Your Generated Context Files</h1>
          <p className="text-muted-foreground mt-2">
            Manage and customize your context files for Cursor
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="flex items-center gap-2">
            <Code className="w-4 h-4" />
            Cursor
          </Badge>
          <Button 
            onClick={handleGenerateAll}
            disabled={isGenerating}
            className="flex items-center gap-2"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
            Regenerate All
          </Button>
        </div>
      </div>

      {/* Files List/Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockFiles.map((file) => {
          const status = statusConfig[file.status as keyof typeof statusConfig];
          const IconComponent = fileIcons[file.type as keyof typeof fileIcons] || FileText;
          const StatusIcon = status.icon;

          return (
            <Card key={file.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <IconComponent className="w-6 h-6 text-muted-foreground" />
                    <div>
                      <CardTitle className="text-lg">{file.name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {file.description}
                      </CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <StatusIcon className={`w-4 h-4 ${status.color}`} />
                    <Badge variant={status.variant} className="text-xs">
                      {status.label}
                    </Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {file.lastModified}
                  </span>
                  <span>{file.size}</span>
                </div>
                
                <div className="flex gap-2">
                  {file.status === "generating" ? (
                    <Button size="sm" variant="outline" disabled className="flex-1">
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Generating...
                    </Button>
                  ) : file.status === "error" ? (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="flex-1"
                      onClick={() => handleRegenerateFile(file.id)}
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Retry
                    </Button>
                  ) : (
                    <>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="flex-1"
                            onClick={() => setSelectedFile(file)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[80vh]">
                          <DialogHeader>
                            <DialogTitle>{file.name}</DialogTitle>
                            <DialogDescription>{file.description}</DialogDescription>
                          </DialogHeader>
                          <ScrollArea className="h-[400px] w-full">
                            <pre className="whitespace-pre-wrap text-sm p-4 bg-muted rounded">
                              {file.content || "Content is being generated..."}
                            </pre>
                          </ScrollArea>
                        </DialogContent>
                      </Dialog>
                      
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                      
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4" />
                      </Button>
                      
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleRegenerateFile(file.id)}
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* File Status Summary */}
      <Card className="bg-muted/50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="font-medium">Files Summary</h3>
              <p className="text-sm text-muted-foreground">
                {mockFiles.filter(f => f.status === "generated").length} of {mockFiles.length} files generated
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Download className="w-4 h-4 mr-2" />
                Download All
              </Button>
              <Button variant="outline" size="sm">
                <FileText className="w-4 h-4 mr-2" />
                Export Project
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 