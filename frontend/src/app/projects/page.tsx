"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus, Edit, Trash2, Eye, Calendar, Clock, RefreshCw } from "lucide-react";
import Link from "next/link";
import { apiStorage, Project } from "@/lib/api-storage";

interface ProjectWithRefinedPRD extends Project {
  hasRefinedPRD?: boolean;
  stageInfo?: {
    stage: string;
    details: string;
    selectedIDEs?: string[];
    progress: number;
  };
}

const statusConfig = {
  draft: { 
    label: "Draft", 
    variant: "outline" as const,
    color: "text-orange-600 bg-orange-50 border-orange-200",
    icon: "📝"
  },
  "prd-preview": { 
    label: "PRD Generated", 
    variant: "secondary" as const,
    color: "text-blue-600 bg-blue-50 border-blue-200",
    icon: "📄"
  },
  refining: { 
    label: "Refining", 
    variant: "secondary" as const,
    color: "text-purple-600 bg-purple-50 border-purple-200",
    icon: "🔧"
  },
  processing: { 
    label: "Processing", 
    variant: "secondary" as const,
    color: "text-yellow-600 bg-yellow-50 border-yellow-200",
    icon: "⚙️"
  },
  complete: { 
    label: "Refined", 
    variant: "default" as const,
    color: "text-green-600 bg-green-50 border-green-200",
    icon: "✅"
  },
  "ide-selection": { 
    label: "IDE Selected", 
    variant: "secondary" as const,
    color: "text-indigo-600 bg-indigo-50 border-indigo-200",
    icon: "💻"
  },
  generating: { 
    label: "Generating Rails", 
    variant: "secondary" as const,
    color: "text-pink-600 bg-pink-50 border-pink-200",
    icon: "🚀"
  }
};

export default function ProjectsPage() {
  const [projects, setProjects] = useState<ProjectWithRefinedPRD[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Check if refined PRD exists for a project
  const checkRefinedPRDExists = async (projectId: string): Promise<boolean> => {
    try {
      const refinedPRD = await apiStorage.getRefinedPRDContent(projectId);
      return !!refinedPRD;
    } catch (error) {
      return false;
    }
  };

  // Get detailed stage information for a project
  const getStageInfo = async (project: Project): Promise<{ stage: string; details: string; selectedIDEs?: string[]; progress: number }> => {
    try {
      const metadata = await apiStorage.getProjectMetadata(project.id);
      
      switch (project.status) {
        case 'draft':
          return {
            stage: 'Draft',
            details: 'Project questions answered, ready to generate PRD,',
            progress: 20
          };
        
        case 'prd-preview':
          return {
            stage: 'PRD Generated',
            details: 'Initial PRD created, ready for refinement',
            progress: 40
          };
        
        case 'refining':
          return {
            stage: 'Refining',
            details: 'Answering refinement questions to improve PRD',
            progress: 60
          };
        
        case 'processing':
          return {
            stage: 'Processing',
            details: 'Generating refined PRD from answers',
            progress: 70
          };
        
        case 'complete':
          return {
            stage: 'Refined',
            details: 'PRD refined and ready for IDE selection',
            progress: 80
          };
        
        case 'ide-selection':
          const selectedIDEs = metadata?.selectedIDEs || [];
          if (selectedIDEs.length === 0) {
            return {
              stage: 'IDE Selection',
              details: 'Choose development environment(s)',
              progress: 85
            };
          } else {
            const ideNames = selectedIDEs.map(id => {
              switch (id) {
                case 'cursor': return 'Cursor';
                case 'nora': return 'Nora';
                default: return id;
              }
            }).join(', ');
            return {
              stage: 'IDE Selected',
              details: `Selected: ${ideNames}`,
              selectedIDEs,
              progress: 90
            };
          }
        
        case 'generating':
          const generatingIDEs = metadata?.selectedIDEs || [];
          const ideNames = generatingIDEs.map(id => {
            switch (id) {
              case 'cursor': return 'Cursor';
              case 'nora': return 'Nora';
              default: return id;
            }
          }).join(', ');
          return {
            stage: 'Generating Rails',
            details: `Creating project files for: ${ideNames}`,
            selectedIDEs: generatingIDEs,
            progress: 95
          };
        
        default:
          return {
            stage: 'Unknown',
            details: 'Project status unclear',
            progress: 0
          };
      }
    } catch (error) {
      return {
        stage: 'Error',
        details: 'Unable to load project details',
        progress: 0
      };
    }
  };

  const loadProjects = async () => {
    try {
      const allProjects = await apiStorage.getProjects();
      
      // Check for refined PRD existence and get stage info for each project
      const projectsWithRefinedPRD = await Promise.all(
        allProjects.map(async (project) => {
          const [hasRefinedPRD, stageInfo] = await Promise.all([
            checkRefinedPRDExists(project.id),
            getStageInfo(project)
          ]);
          return { ...project, hasRefinedPRD, stageInfo };
        })
      );
      
      setProjects(projectsWithRefinedPRD);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const handleDeleteProject = async (projectId: string) => {
    try {
      await apiStorage.deleteProject(projectId);
      const updatedProjects = await apiStorage.getProjects();
      setProjects(updatedProjects);
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const hasProjects = projects.length > 0;

  if (isLoading) {
    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Your Projects</h1>
            <p className="text-muted-foreground mt-2">
              Manage and organize your context engineering projects
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={loadProjects}
              className="flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
            <Link href="/projects/new">
              <Button className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                New Project
              </Button>
            </Link>
          </div>
        </div>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Your Projects</h1>
          <p className="text-muted-foreground mt-2">
            Manage and organize your context engineering projects
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={loadProjects}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
          <Link href="/projects/new">
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              New Project
            </Button>
          </Link>
        </div>
      </div>

      {/* Projects Grid/List */}
      {hasProjects ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project: ProjectWithRefinedPRD) => {
            const status = statusConfig[project.status];
            return (
              <Card key={project.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{project.name}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        Project ID: {project.id}
                      </CardDescription>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${status.color}`}>
                        <span>{status.icon}</span>
                        <span>{status.label}</span>
                      </div>
                      {project.stageInfo && (
                        <div className="text-xs text-muted-foreground text-right max-w-32">
                          {project.stageInfo.stage}
                        </div>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-2" />
                      Last modified: {new Date(project.updatedAt).toLocaleDateString()}
                    </div>
                    {project.stageInfo && (
                      <div className="space-y-3 p-3 bg-muted/30 rounded-lg border">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-sm font-medium text-primary">
                            <Clock className="w-4 h-4 mr-2" />
                            {project.stageInfo.stage}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {project.stageInfo.progress}%
                          </span>
                        </div>
                        <Progress value={project.stageInfo.progress} className="h-2" />
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {project.stageInfo.details}
                        </p>
                        {project.stageInfo.selectedIDEs && project.stageInfo.selectedIDEs.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {project.stageInfo.selectedIDEs.map((ide) => (
                              <span key={ide} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                                {ide === 'cursor' ? 'Cursor' : ide === 'nora' ? 'Nora' : ide}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Link href={project.hasRefinedPRD ? `/projects/${project.id}/prd-refined` : `/projects/${project.id}/prd`} className="flex-1">
                      <Button size="sm" variant="outline" className="w-full">
                        <Eye className="w-4 h-4 mr-2" />
                        {project.hasRefinedPRD ? "View Refined" : "View"}
                      </Button>
                    </Link>
                    <Link href={`/projects/${project.id}/prd?edit=true`}>
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                    </Link>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleDeleteProject(project.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <Card className="text-center py-16">
          <CardContent className="space-y-6">
            <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto">
              <Plus className="w-12 h-12 text-muted-foreground" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">No projects yet</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Create your first project to start building context files for your development tools.
              </p>
            </div>
            <Link href="/projects/new">
              <Button size="lg" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Create Your First Project
              </Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 