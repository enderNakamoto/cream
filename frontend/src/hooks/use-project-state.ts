"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { projectStorage, Project, ProjectMetadata, ProjectAnswers } from '@/lib/project-storage';

export interface UseProjectStateReturn {
  // Project data
  project: Project | null;
  metadata: ProjectMetadata | null;
  answers: ProjectAnswers | null;
  prdContent: string;
  
  // Actions
  updateProject: (updates: Partial<Project>) => void;
  updateMetadata: (updates: Partial<ProjectMetadata>) => void;
  updateAnswers: (updates: Partial<ProjectAnswers>) => void;
  updatePRDContent: (content: string) => void;
  
  // Navigation
  goToStep: (step: ProjectMetadata['currentStep']) => void;
  nextStep: () => void;
  previousStep: () => void;
  
  // Status
  isLoading: boolean;
  isSaving: boolean;
}

const STEPS_ORDER: ProjectMetadata['currentStep'][] = [
  'questions',
  'prd-preview',
  'prd-edit',
  'refinement-questions',
  'processing',
  'complete'
];

export function useProjectState(projectId: string): UseProjectStateReturn {
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [metadata, setMetadata] = useState<ProjectMetadata | null>(null);
  const [answers, setAnswers] = useState<ProjectAnswers | null>(null);
  const [prdContent, setPrdContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Load project data on mount
  useEffect(() => {
    if (!projectId) return;

    const loadProjectData = () => {
      setIsLoading(true);
      
      // Load project from projects list
      const projects = projectStorage.getProjects();
      const foundProject = projects.find(p => p.id === projectId);
      
      if (!foundProject) {
        // Project not found, redirect to projects page
        router.push('/projects');
        return;
      }

      setProject(foundProject);

      // Load metadata
      const projectMetadata = projectStorage.getProjectMetadata(projectId);
      setMetadata(projectMetadata);

      // Load answers
      const projectAnswers = projectStorage.getProjectAnswers(projectId);
      setAnswers(projectAnswers);

      // Load PRD content
      const prd = projectStorage.getPRDContent(projectId);
      setPrdContent(prd);

      setIsLoading(false);
    };

    loadProjectData();
  }, [projectId, router]);

  // Update project
  const updateProject = useCallback((updates: Partial<Project>) => {
    if (!project) return;
    
    setIsSaving(true);
    const updatedProject = { ...project, ...updates };
    setProject(updatedProject);
    projectStorage.updateProject(projectId, updates);
    setIsSaving(false);
  }, [project, projectId]);

  // Update metadata
  const updateMetadata = useCallback((updates: Partial<ProjectMetadata>) => {
    if (!metadata) return;
    
    setIsSaving(true);
    const updatedMetadata = { ...metadata, ...updates, lastEdited: new Date().toISOString() };
    setMetadata(updatedMetadata);
    projectStorage.saveProjectMetadata(updatedMetadata);
    setIsSaving(false);
  }, [metadata]);

  // Update answers
  const updateAnswers = useCallback((updates: Partial<ProjectAnswers>) => {
    if (!answers) return;
    
    setIsSaving(true);
    const updatedAnswers = { ...answers, ...updates, version: answers.version + 1 };
    setAnswers(updatedAnswers);
    projectStorage.saveProjectAnswers(updatedAnswers);
    
    // Also update metadata
    if (metadata) {
      const updatedMetadata = { ...metadata, answersVersion: updatedAnswers.version };
      setMetadata(updatedMetadata);
      projectStorage.saveProjectMetadata(updatedMetadata);
    }
    
    setIsSaving(false);
  }, [answers, metadata]);

  // Update PRD content
  const updatePRDContent = useCallback((content: string) => {
    setIsSaving(true);
    setPrdContent(content);
    projectStorage.savePRDContent(projectId, content);
    
    // Update metadata with new version
    if (metadata) {
      const updatedMetadata = { 
        ...metadata, 
        prdVersion: metadata.prdVersion + 1,
        lastEdited: new Date().toISOString()
      };
      setMetadata(updatedMetadata);
      projectStorage.saveProjectMetadata(updatedMetadata);
    }
    
    setIsSaving(false);
  }, [projectId, metadata]);

  // Navigation functions
  const goToStep = useCallback((step: ProjectMetadata['currentStep']) => {
    if (!metadata) return;
    
    updateMetadata({ currentStep: step });
    
    // Update project status based on step
    let status: Project['status'] = 'draft';
    switch (step) {
      case 'prd-preview':
        status = 'prd-preview';
        break;
      case 'prd-edit':
      case 'refinement-questions':
        status = 'refining';
        break;
      case 'processing':
        status = 'processing';
        break;
      case 'complete':
        status = 'complete';
        break;
    }
    
    updateProject({ status, currentStep: step });
  }, [metadata, updateMetadata, updateProject]);

  const nextStep = useCallback(() => {
    if (!metadata) return;
    
    const currentIndex = STEPS_ORDER.indexOf(metadata.currentStep);
    if (currentIndex < STEPS_ORDER.length - 1) {
      const nextStep = STEPS_ORDER[currentIndex + 1];
      goToStep(nextStep);
    }
  }, [metadata, goToStep]);

  const previousStep = useCallback(() => {
    if (!metadata) return;
    
    const currentIndex = STEPS_ORDER.indexOf(metadata.currentStep);
    if (currentIndex > 0) {
      const prevStep = STEPS_ORDER[currentIndex - 1];
      goToStep(prevStep);
    }
  }, [metadata, goToStep]);

  return {
    project,
    metadata,
    answers,
    prdContent,
    updateProject,
    updateMetadata,
    updateAnswers,
    updatePRDContent,
    goToStep,
    nextStep,
    previousStep,
    isLoading,
    isSaving
  };
} 