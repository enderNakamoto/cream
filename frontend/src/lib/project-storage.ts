// Project storage utilities for managing projects.json, metadata, and file operations

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

// Local storage keys
const PROJECTS_KEY = 'cream-projects';
const PROJECT_PREFIX = 'cream-project-';

// Project management functions
export const projectStorage = {
  // Get all projects
  getProjects(): Project[] {
    if (typeof window === 'undefined') return [];
    const projects = localStorage.getItem(PROJECTS_KEY);
    return projects ? JSON.parse(projects) : [];
  },

  // Save all projects
  saveProjects(projects: Project[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  },

  // Add new project
  addProject(project: Project): void {
    const projects = this.getProjects();
    projects.push(project);
    this.saveProjects(projects);
  },

  // Update project
  updateProject(projectId: string, updates: Partial<Project>): void {
    const projects = this.getProjects();
    const index = projects.findIndex(p => p.id === projectId);
    if (index !== -1) {
      projects[index] = { ...projects[index], ...updates, updatedAt: new Date().toISOString() };
      this.saveProjects(projects);
    }
  },

  // Delete project
  deleteProject(projectId: string): void {
    const projects = this.getProjects();
    const filtered = projects.filter(p => p.id !== projectId);
    this.saveProjects(filtered);
    
    // Also remove project data from localStorage
    localStorage.removeItem(`${PROJECT_PREFIX}${projectId}`);
  },

  // Get project metadata
  getProjectMetadata(projectId: string): ProjectMetadata | null {
    if (typeof window === 'undefined') return null;
    const metadata = localStorage.getItem(`${PROJECT_PREFIX}${projectId}-metadata`);
    return metadata ? JSON.parse(metadata) : null;
  },

  // Save project metadata
  saveProjectMetadata(metadata: ProjectMetadata): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(`${PROJECT_PREFIX}${metadata.projectId}-metadata`, JSON.stringify(metadata));
  },

  // Get project answers
  getProjectAnswers(projectId: string): ProjectAnswers | null {
    if (typeof window === 'undefined') return null;
    const answers = localStorage.getItem(`${PROJECT_PREFIX}${projectId}-answers`);
    return answers ? JSON.parse(answers) : null;
  },

  // Save project answers
  saveProjectAnswers(answers: ProjectAnswers): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(`${PROJECT_PREFIX}${answers.projectId}-answers`, JSON.stringify(answers));
  },

  // Get PRD content
  getPRDContent(projectId: string): string {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem(`${PROJECT_PREFIX}${projectId}-prd`) || '';
  },

  // Save PRD content
  savePRDContent(projectId: string, content: string): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(`${PROJECT_PREFIX}${projectId}-prd`, content);
  },

  // Generate unique project ID
  generateProjectId(): string {
    return `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  },

  // Create new project with initial data
  createNewProject(name: string): Project {
    const projectId = this.generateProjectId();
    const now = new Date().toISOString();
    
    const project: Project = {
      id: projectId,
      name,
      createdAt: now,
      updatedAt: now,
      status: 'draft',
      currentStep: 'questions',
      prdVersion: 0
    };

    const metadata: ProjectMetadata = {
      projectId,
      currentStep: 'questions',
      prdVersion: 0,
      lastEdited: now,
      answersVersion: 0,
      status: 'draft'
    };

    this.addProject(project);
    this.saveProjectMetadata(metadata);

    return project;
  }
}; 