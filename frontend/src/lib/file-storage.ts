import fs from 'fs';
import path from 'path';

// File storage utilities for managing projects.json, metadata, and file operations

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

// Storage paths
const STORAGE_BASE = path.join(process.cwd(), '..', 'storage');
const PROJECTS_FILE = path.join(STORAGE_BASE, 'projects.json');
const PROJECTS_DIR = path.join(STORAGE_BASE, 'projects');

// Ensure storage directories exist
function ensureStorageExists() {
  if (!fs.existsSync(STORAGE_BASE)) {
    fs.mkdirSync(STORAGE_BASE, { recursive: true });
  }
  if (!fs.existsSync(PROJECTS_DIR)) {
    fs.mkdirSync(PROJECTS_DIR, { recursive: true });
  }
  if (!fs.existsSync(PROJECTS_FILE)) {
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify([], null, 2));
  }
}

// Get project directory path
function getProjectDir(projectId: string): string {
  return path.join(PROJECTS_DIR, projectId);
}

// File-based storage utilities
export const fileStorage = {
  // Get all projects
  getProjects(): Project[] {
    try {
      ensureStorageExists();
      const data = fs.readFileSync(PROJECTS_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading projects:', error);
      return [];
    }
  },

  // Save all projects
  saveProjects(projects: Project[]): void {
    try {
      ensureStorageExists();
      fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2));
    } catch (error) {
      console.error('Error saving projects:', error);
    }
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
    
    // Also remove project directory
    const projectDir = getProjectDir(projectId);
    if (fs.existsSync(projectDir)) {
      fs.rmSync(projectDir, { recursive: true, force: true });
    }
  },

  // Get project metadata
  getProjectMetadata(projectId: string): ProjectMetadata | null {
    try {
      const metadataFile = path.join(getProjectDir(projectId), 'metadata.json');
      if (!fs.existsSync(metadataFile)) return null;
      
      const data = fs.readFileSync(metadataFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading project metadata:', error);
      return null;
    }
  },

  // Save project metadata
  saveProjectMetadata(metadata: ProjectMetadata): void {
    try {
      const projectDir = getProjectDir(metadata.projectId);
      if (!fs.existsSync(projectDir)) {
        fs.mkdirSync(projectDir, { recursive: true });
      }
      
      const metadataFile = path.join(projectDir, 'metadata.json');
      fs.writeFileSync(metadataFile, JSON.stringify(metadata, null, 2));
    } catch (error) {
      console.error('Error saving project metadata:', error);
    }
  },

  // Get project answers
  getProjectAnswers(projectId: string): ProjectAnswers | null {
    try {
      const answersFile = path.join(getProjectDir(projectId), 'answers.json');
      if (!fs.existsSync(answersFile)) return null;
      
      const data = fs.readFileSync(answersFile, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error('Error reading project answers:', error);
      return null;
    }
  },

  // Save project answers
  saveProjectAnswers(answers: ProjectAnswers): void {
    try {
      const projectDir = getProjectDir(answers.projectId);
      if (!fs.existsSync(projectDir)) {
        fs.mkdirSync(projectDir, { recursive: true });
      }
      
      const answersFile = path.join(projectDir, 'answers.json');
      fs.writeFileSync(answersFile, JSON.stringify(answers, null, 2));
    } catch (error) {
      console.error('Error saving project answers:', error);
    }
  },

  // Get PRD content
  getPRDContent(projectId: string): string {
    try {
      const prdFile = path.join(getProjectDir(projectId), 'prd.md');
      if (!fs.existsSync(prdFile)) return '';
      
      return fs.readFileSync(prdFile, 'utf8');
    } catch (error) {
      console.error('Error reading PRD content:', error);
      return '';
    }
  },

  // Save PRD content
  savePRDContent(projectId: string, content: string): void {
    try {
      const projectDir = getProjectDir(projectId);
      if (!fs.existsSync(projectDir)) {
        fs.mkdirSync(projectDir, { recursive: true });
      }
      
      const prdFile = path.join(projectDir, 'prd.md');
      fs.writeFileSync(prdFile, content);
    } catch (error) {
      console.error('Error saving PRD content:', error);
    }
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
  },

  // Get project directory structure
  getProjectStructure(projectId: string): string[] {
    try {
      const projectDir = getProjectDir(projectId);
      if (!fs.existsSync(projectDir)) return [];
      
      return fs.readdirSync(projectDir);
    } catch (error) {
      console.error('Error reading project structure:', error);
      return [];
    }
  },

  // Export project as zip (placeholder for future implementation)
  exportProject(projectId: string): string {
    const projectDir = getProjectDir(projectId);
    return projectDir; // For now, just return the directory path
  }
}; 