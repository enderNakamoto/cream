"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { apiStorage, ProjectAnswers } from "@/lib/api-storage";

const questionSchema = z.object({
  projectName: z.string().min(1, "Project name is required"),
  projectType: z.string().min(1, "Please select a project type"),
  smartContractLanguage: z.string().optional(),
  description: z.string().min(5, "Description must be at least 5 characters"),
  coreFeatures: z.string().min(5, "Core features must be at least 5 characters"),
  phase1: z.string().min(10, "Phase 1 must be at least 10 characters"),
  phase2: z.string().min(10, "Phase 2 must be at least 10 characters"),
  phase3: z.string().min(10, "Phase 3 must be at least 10 characters"),
  sampleUserJourneys: z.string().min(10, "Please provide sample user journeys"),
  additionalContext: z.string().min(5, "Additional context must be at least 5 characters"),
  targetAudience: z.string().min(1, "Please select target audience"),
  // Web App specific fields
  authentication: z.string().optional(),
  // Web3 DApp specific fields
  walletIntegration: z.string().optional(),
  multiChainSupport: z.string().optional(),
  crossChainSolution: z.string().optional(),
});

type QuestionFormData = z.infer<typeof questionSchema>;

const questions = [
  {
    id: 1,
    title: "Project Basics & Configuration",
    fields: ["projectName", "projectType", "description", "smartContractLanguage", "authentication", "walletIntegration", "multiChainSupport", "crossChainSolution"]
  },
  {
    id: 2,
    title: "Project Planning",
    fields: ["coreFeatures", "phase1", "phase2", "phase3"]
  },
  {
    id: 3,
    title: "User Experience Design",
    fields: ["sampleUserJourneys"]
  },
  {
    id: 4,
    title: "Additional Details",
    fields: ["targetAudience", "additionalContext"]
  }
];

export default function NewProjectPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [projectId, setProjectId] = useState<string | null>(null);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const hasInitialized = useRef(false);
  const totalSteps = questions.length;

  const form = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      projectName: "",
      projectType: "",
      smartContractLanguage: "",
      description: "",
      coreFeatures: "",
      phase1: "",
      phase2: "",
      phase3: "",
      sampleUserJourneys: "",
      additionalContext: "",
      targetAudience: "",
      authentication: "",
      walletIntegration: "",
      multiChainSupport: "",
      crossChainSolution: "",
    },
  });

  // Initialize project when component mounts (only once)
  useEffect(() => {
    const initializeProject = async () => {
      // Check if we have a project ID in URL params
      const urlProjectId = searchParams.get('projectId');
      
      if (urlProjectId) {
        console.log('Found project ID in URL:', urlProjectId);
        setProjectId(urlProjectId);
        setIsInitializing(false);
        return;
      }

      // Use ref to ensure we only create a project once
      if (!hasInitialized.current && !projectId) {
        hasInitialized.current = true;
        try {
          console.log('Creating new project...');
          const newProject = await apiStorage.createNewProject("New Project");
          console.log('Created project:', newProject.id);
          setProjectId(newProject.id);
          
          // Update URL with project ID
          const newUrl = `/projects/new?projectId=${newProject.id}`;
          router.replace(newUrl, { scroll: false });
        } catch (error) {
          console.error('Error creating project:', error);
        } finally {
          setIsInitializing(false);
        }
      } else {
        setIsInitializing(false);
      }
    };

    initializeProject();
  }, [searchParams, router]); // Include searchParams and router in dependencies

  const handleSaveDraft = async () => {
    if (!projectId) return;

    setIsSavingDraft(true);
    try {
      const formData = form.getValues();
      
      // Update project name if provided
      if (formData.projectName) {
        await apiStorage.updateProject(projectId, { name: formData.projectName });
      }

      // Create draft answers structure with current form data
      const answers: ProjectAnswers = {
        projectId,
        version: 1,
        initialAnswers: formData,
        refinementAnswers: {},
        questions: {
          initial: {
            projectName: "What is your project name?",
            projectType: "What type of project are you building?",
            smartContractLanguage: "What smart contract language will you use?",
            description: "Describe your project in detail",
            coreFeatures: "What are the core features for MVP?",
            phase1: "What will be accomplished in Phase 1?",
            phase2: "What will be accomplished in Phase 2?",
            phase3: "What will be accomplished in Phase 3?",
            sampleUserJourneys: "What are the sample user journeys?",
            additionalContext: "What additional context is needed?",
            targetAudience: "Who is your target audience?",
            authentication: "Do you need authentication?",
            walletIntegration: "Which wallet integration will you use?",
            multiChainSupport: "Will you support multiple chains?",
            crossChainSolution: "Which cross-chain solution will you use?"
          },
          refinement: {}
        }
      };

      // Save draft answers
      await apiStorage.saveProjectAnswers(answers);

      // Show success message (you could add a toast notification here)
      console.log('Draft saved successfully!');
      
      // Redirect to projects page
      router.push('/projects');
    } catch (error) {
      console.error('Error saving draft:', error);
    } finally {
      setIsSavingDraft(false);
    }
  };

  const onSubmit = async (data: QuestionFormData) => {
    console.log('=== onSubmit called ===');
    console.log('Form data:', data);
    console.log('Project ID:', projectId);
    console.log('Form errors:', form.formState.errors);
    console.log('Form is valid:', form.formState.isValid);
    
    if (!projectId) {
      console.error('No projectId available');
      return;
    }

    try {
      console.log('Updating project name...');
      // Update project name
      await apiStorage.updateProject(projectId, { name: data.projectName });

      console.log('Creating answers structure...');
      // Create answers structure
      const answers: ProjectAnswers = {
        projectId,
        version: 1,
        initialAnswers: data,
        refinementAnswers: {},
        questions: {
          initial: {
            projectName: "What is your project name?",
            projectType: "What type of project are you building?",
            smartContractLanguage: "What smart contract language will you use?",
            description: "Describe your project in detail",
            coreFeatures: "What are the core features for MVP?",
            phase1: "What will be accomplished in Phase 1?",
            phase2: "What will be accomplished in Phase 2?",
            phase3: "What will be accomplished in Phase 3?",
            sampleUserJourneys: "What are the sample user journeys?",
            additionalContext: "What additional context is needed?",
            targetAudience: "Who is your target audience?",
            authentication: "Do you need authentication?",
            walletIntegration: "Which wallet integration will you use?",
            multiChainSupport: "Will you support multiple chains?",
            crossChainSolution: "Which cross-chain solution will you use?"
          },
          refinement: {}
        }
      };

      console.log('Saving answers...');
      // Save answers
      await apiStorage.saveProjectAnswers(answers);

      console.log('Navigating to PRD preview...');
      // Navigate to PRD preview
      router.push(`/projects/${projectId}/prd`);
    } catch (error) {
      console.error('Error saving project data:', error);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const progress = (currentStep / totalSteps) * 100;

  // Show loading while initializing
  if (isInitializing) {
    return (
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center py-16">
          <p className="text-muted-foreground">Initializing project...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Progress Indicator */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Create New Project</h1>
          <span className="text-sm text-muted-foreground">
            Step {currentStep} of {totalSteps}
          </span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Question Form */}
      <Form {...form}>
        <form 
          onSubmit={form.handleSubmit(onSubmit, (errors) => {
            console.log('Form validation errors:', errors);
          })} 
          className="space-y-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>{questions[currentStep - 1].title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentStep === 1 && (
                <>
                  <FormField
                    control={form.control}
                    name="projectName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your project name" {...field} />
                        </FormControl>
                        <FormDescription>
                          Choose a descriptive name for your project
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="projectType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select project type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="web-app">Web App</SelectItem>
                            <SelectItem value="web3-dapp">Web3 DApp</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          What type of project are you building?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Tech Stack Information */}
                  <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">🚀 Tech Stack Information</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      We will be building your project frontend with <strong>Next.js</strong>, <strong>Tailwind CSS</strong>, and <strong>shadcn/ui</strong>. 
                      This is a very opinionated guided helper to ensure consistency and best practices.
                    </p>
                  </div>

                  {form.watch("projectType") === "web3-dapp" && (
                    <FormField
                      control={form.control}
                      name="smartContractLanguage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Smart Contract Language</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select smart contract language" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="solidity">Solidity</SelectItem>
                              <SelectItem value="move">Move</SelectItem>
                              <SelectItem value="rust-soroban">Rust (Soroban)</SelectItem>
                              <SelectItem value="rust-solana">Rust (Solana)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Choose the programming language for your smart contracts
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {form.watch("projectType") === "web-app" && (
                    <FormField
                      control={form.control}
                      name="authentication"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Authentication</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select authentication option" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="yes">Yes, I need authentication</SelectItem>
                              <SelectItem value="no">No, authentication not required</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Do you need user authentication for your web app?
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {form.watch("authentication") === "yes" && (
                    <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">🔐 Authentication Setup</h4>
                      <p className="text-sm text-green-700 dark:text-green-300">
                        We will be using <strong>Clerk</strong> for authentication. Clerk provides a complete authentication solution with pre-built components and APIs.
                      </p>
                    </div>
                  )}

                  {form.watch("projectType") === "web3-dapp" && (
                    <FormField
                      control={form.control}
                      name="walletIntegration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Wallet Integration</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select wallet integration" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="dynamic">Dynamic (Recommended)</SelectItem>
                              <SelectItem value="rainbow-kit">Rainbow Kit</SelectItem>
                              <SelectItem value="custom">Custom Implementation</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormDescription>
                            Which wallet integration library will you use for UI integration with smart contracts?
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {form.watch("smartContractLanguage") === "solidity" && (
                    <>
                      <FormField
                        control={form.control}
                        name="multiChainSupport"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Multi-Chain Support</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select multi-chain support" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="single-chain">Single Chain (Ethereum Mainnet)</SelectItem>
                                <SelectItem value="multi-chain">Multiple EVM Chains</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              Will you deploy smart contracts on multiple EVM chains?
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {form.watch("multiChainSupport") === "multi-chain" && (
                        <FormField
                          control={form.control}
                          name="crossChainSolution"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Cross-Chain Solution</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select cross-chain solution" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="layer-zero">Layer Zero</SelectItem>
                                  <SelectItem value="hyperlane">HyperLane</SelectItem>
                                  <SelectItem value="custom">Custom Solution</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormDescription>
                                Which cross-chain solution will you use for multi-chain deployments?
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </>
                  )}

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Description</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your project in detail..."
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Provide a comprehensive description of your project goals and features (minimum 5 characters)
                        </FormDescription>
                        <div className="text-xs text-muted-foreground">
                          {field.value?.length || 0}/5 characters
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {currentStep === 2 && (
                <>
                  <FormField
                    control={form.control}
                    name="coreFeatures"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Core Features</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="List the core features needed for MVP..."
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Keep this simple and only add what is needed for MVP (minimum 5 characters)
                        </FormDescription>
                        <div className="text-xs text-muted-foreground">
                          {field.value?.length || 0}/5 characters
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Development Phases Section */}
                  <div className="p-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded-lg mb-6">
                    <h4 className="font-medium text-amber-900 dark:text-amber-100 mb-2">⏰ Take Your Time to Plan</h4>
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      Spend time now to think about your development phases. This planning will save significant time later when building your project. 
                      Clear phases help with project management and development efficiency.
                    </p>
                  </div>

                  <FormField
                    control={form.control}
                    name="phase1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phase 1</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe Phase 1 of your project development..."
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          What will be accomplished in Phase 1? (minimum 10 characters)
                        </FormDescription>
                        <div className="text-xs text-muted-foreground">
                          {field.value?.length || 0}/10 characters
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phase2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phase 2</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe Phase 2 of your project development..."
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          What will be accomplished in Phase 2? (minimum 10 characters)
                        </FormDescription>
                        <div className="text-xs text-muted-foreground">
                          {field.value?.length || 0}/10 characters
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phase3"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phase 3</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe Phase 3 of your project development..."
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          What will be accomplished in Phase 3? (minimum 10 characters)
                        </FormDescription>
                        <div className="text-xs text-muted-foreground">
                          {field.value?.length || 0}/10 characters
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />


                </>
              )}

              {currentStep === 3 && (
                <>
                  {/* User Experience Design Section */}
                  <div className="p-4 bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-lg mb-6">
                    <h4 className="font-medium text-purple-900 dark:text-purple-100 mb-2">🎨 User Experience Design</h4>
                    <p className="text-sm text-purple-700 dark:text-purple-300 mb-3">
                      <strong>This step is crucial!</strong> The difference between a good app and a bad app often lies in how well you think through the user experience. 
                      Take time to plan your pages, user flows, and overall structure.
                    </p>
                    <div className="bg-white dark:bg-gray-800 p-3 rounded border">
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                        <strong>💡 Get Inspired:</strong> Check out <a href="https://dribbble.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">Dribbble</a> for amazing UI/UX inspiration from top designers worldwide.
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        Look for patterns in navigation, layouts, and user flows that work well for your type of application.
                      </p>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="sampleUserJourneys"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Sample User Journeys & Page Structure</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Think through and describe:
• What pages will your app have?
• How will users navigate between pages?
• What's the main user flow from landing to completing their goal?
• What actions can users take on each page?
• How will users discover features?
• What's the onboarding experience like?

Be specific about the user journey and page structure..."
                            className="min-h-[200px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Plan your user experience carefully. Think through pages, navigation, and user flows in advance. 
                          This planning will make the difference between a good app and a bad app. (minimum 10 characters)
                        </FormDescription>
                        <div className="text-xs text-muted-foreground">
                          {field.value?.length || 0}/10 characters
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {currentStep === 4 && (
                <>
                  <FormField
                    control={form.control}
                    name="targetAudience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Audience</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select target audience" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="consumers">General Consumers</SelectItem>
                            <SelectItem value="businesses">Businesses/Enterprise</SelectItem>
                            <SelectItem value="developers">Developers</SelectItem>
                            <SelectItem value="students">Students/Educational</SelectItem>
                            <SelectItem value="internal">Internal/Company Use</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Who is the primary audience for your project?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="additionalContext"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Context</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Any additional context, constraints, or requirements..."
                            className="min-h-[100px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Share any additional context, constraints, or specific requirements (minimum 5 characters)
                        </FormDescription>
                        <div className="text-xs text-muted-foreground">
                          {field.value?.length || 0}/5 characters
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}


            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex items-center justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={prevStep}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>

            <div className="flex gap-2">
              <Button 
                type="button" 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={handleSaveDraft}
                disabled={!projectId || isSavingDraft || isInitializing}
              >
                <Save className="w-4 h-4" />
                {isSavingDraft ? 'Saving...' : 'Save Draft'}
              </Button>
              
              {currentStep < totalSteps ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center gap-2"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  className="flex items-center gap-2"
                  onClick={() => console.log('Generate PRD button clicked')}
                >
                  Generate PRD
                </Button>
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
} 