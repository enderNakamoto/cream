"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { apiStorage, Project, ProjectMetadata, ProjectAnswers } from '@/lib/api-storage';

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

    const loadProjectData = async () => {
      setIsLoading(true);
      
      try {
        // Load all project data in one call
        const projectData = await apiStorage.getProjectData(projectId);
        
        setProject(projectData.project);
        setMetadata(projectData.metadata);
        setAnswers(projectData.answers);
        setPrdContent(projectData.prdContent);
      } catch (error) {
        console.error('Error loading project data:', error);
        // Project not found, redirect to projects page
        router.push('/projects');
        return;
      } finally {
        setIsLoading(false);
      }
    };

    loadProjectData();
  }, [projectId, router]);

  // Update project
  const updateProject = useCallback(async (updates: Partial<Project>) => {
    if (!project) return;
    
    setIsSaving(true);
    try {
      const updatedProject = { ...project, ...updates };
      setProject(updatedProject);
      await apiStorage.updateProject(projectId, updates);
    } catch (error) {
      console.error('Error updating project:', error);
    } finally {
      setIsSaving(false);
    }
  }, [project, projectId]);

  // Update metadata
  const updateMetadata = useCallback(async (updates: Partial<ProjectMetadata>) => {
    if (!metadata) return;
    
    setIsSaving(true);
    try {
      const updatedMetadata = { ...metadata, ...updates, lastEdited: new Date().toISOString() };
      setMetadata(updatedMetadata);
      await apiStorage.saveProjectMetadata(updatedMetadata);
    } catch (error) {
      console.error('Error updating metadata:', error);
    } finally {
      setIsSaving(false);
    }
  }, [metadata]);

  // Update answers
  const updateAnswers = useCallback(async (updates: Partial<ProjectAnswers>) => {
    if (!answers) return;
    
    setIsSaving(true);
    try {
      const updatedAnswers = { ...answers, ...updates, version: answers.version + 1 };
      setAnswers(updatedAnswers);
      await apiStorage.saveProjectAnswers(updatedAnswers);
      
      // Also update metadata
      if (metadata) {
        const updatedMetadata = { ...metadata, answersVersion: updatedAnswers.version };
        setMetadata(updatedMetadata);
        await apiStorage.saveProjectMetadata(updatedMetadata);
      }
    } catch (error) {
      console.error('Error updating answers:', error);
    } finally {
      setIsSaving(false);
    }
  }, [answers, metadata]);

  // Update PRD content
  const updatePRDContent = useCallback(async (content: string) => {
    setIsSaving(true);
    try {
      setPrdContent(content);
      await apiStorage.savePRDContent(projectId, content);
      
      // Update metadata with new version
      if (metadata) {
        const updatedMetadata = { 
          ...metadata, 
          prdVersion: metadata.prdVersion + 1,
          lastEdited: new Date().toISOString()
        };
        setMetadata(updatedMetadata);
        await apiStorage.saveProjectMetadata(updatedMetadata);
      }
    } catch (error) {
      console.error('Error updating PRD content:', error);
    } finally {
      setIsSaving(false);
    }
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