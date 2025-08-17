// API-based storage utilities for managing projects via HTTP requests

export interface Project {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  status: 'draft' | 'prd-preview' | 'refining' | 'processing' | 'complete';
  currentStep: 'questions' | 'prd-preview' | 'prd-edit' | 'refinement-questions' | 'processing' | 'complete';
  prdVersion: number;
}

export interface ProjectMetadata {
  projectId: string;
  currentStep: 'questions' | 'prd-preview' | 'prd-edit' | 'refinement-questions' | 'processing' | 'complete';
  prdVersion: number;
  lastEdited: string;
  answersVersion: number;
  status: 'draft' | 'prd-preview' | 'refining' | 'processing' | 'complete';
  refinementQuestionsGenerated?: boolean;
  refinementQuestionsGeneratedAt?: string;
}

export interface ProjectAnswers {
  projectId: string;
  version: number;
  initialAnswers: Record<string, any>;
  refinementAnswers: Record<string, {
    question: string;
    answer: string | null;
    skipped: boolean;
    timestamp: string;
  }>;
  questions: {
    initial: Record<string, string>;
    refinement: Record<string, string>;
  };
}

// API-based storage utilities
export const apiStorage = {
  // Get all projects
  async getProjects(): Promise<Project[]> {
    try {
      const response = await fetch('/api/projects');
      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching projects:', error);
      return [];
    }
  },

  // Create new project
  async createNewProject(name: string): Promise<Project> {
    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create project');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating project:', error);
      throw error;
    }
  },

  // Update project
  async updateProject(projectId: string, updates: Partial<Project>): Promise<void> {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update project');
      }
    } catch (error) {
      console.error('Error updating project:', error);
      throw error;
    }
  },

  // Delete project
  async deleteProject(projectId: string): Promise<void> {
    try {
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete project');
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  },

  // Get project data (metadata, answers, PRD content)
  async getProjectData(projectId: string): Promise<{
    project: Project;
    metadata: ProjectMetadata | null;
    answers: ProjectAnswers | null;
    prdContent: string;
  }> {
    try {
      const response = await fetch(`/api/projects/${projectId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch project data');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching project data:', error);
      throw error;
    }
  },

  // Get project metadata
  async getProjectMetadata(projectId: string): Promise<ProjectMetadata | null> {
    try {
      const response = await fetch(`/api/projects/${projectId}/metadata`);
      if (!response.ok) {
        return null;
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching project metadata:', error);
      return null;
    }
  },

  // Save project metadata
  async saveProjectMetadata(metadata: ProjectMetadata): Promise<void> {
    try {
      const response = await fetch(`/api/projects/${metadata.projectId}/metadata`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metadata),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save metadata');
      }
    } catch (error) {
      console.error('Error saving metadata:', error);
      throw error;
    }
  },

  // Get project answers
  async getProjectAnswers(projectId: string): Promise<ProjectAnswers | null> {
    try {
      const response = await fetch(`/api/projects/${projectId}/answers`);
      if (!response.ok) {
        return null;
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching project answers:', error);
      return null;
    }
  },

  // Save project answers
  async saveProjectAnswers(answers: ProjectAnswers): Promise<void> {
    try {
      const response = await fetch(`/api/projects/${answers.projectId}/answers`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(answers),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save answers');
      }
    } catch (error) {
      console.error('Error saving answers:', error);
      throw error;
    }
  },

  // Get PRD content
  async getPRDContent(projectId: string): Promise<string> {
    try {
      const response = await fetch(`/api/projects/${projectId}/prd`);
      if (!response.ok) {
        return '';
      }
      const data = await response.json();
      return data.content || '';
    } catch (error) {
      console.error('Error fetching PRD content:', error);
      return '';
    }
  },

  // Save PRD content
  async savePRDContent(projectId: string, content: string): Promise<void> {
    try {
      const response = await fetch(`/api/projects/${projectId}/prd`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ content }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save PRD content');
      }
    } catch (error) {
      console.error('Error saving PRD content:', error);
      throw error;
    }
  },

  // Generate unique project ID (client-side for immediate use)
  generateProjectId(): string {
    return `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}; 