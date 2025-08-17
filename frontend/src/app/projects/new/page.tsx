"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { projectStorage, ProjectAnswers } from "@/lib/project-storage";

const questionSchema = z.object({
  projectName: z.string().min(1, "Project name is required"),
  projectType: z.string().min(1, "Please select a project type"),
  smartContractLanguage: z.string().optional(),
  description: z.string().min(10, "Description must be at least 10 characters"),
  targetAudience: z.string().min(1, "Please select target audience"),
  complexity: z.string().min(1, "Please select complexity level"),
  timeline: z.string().min(1, "Please select timeline"),
});

type QuestionFormData = z.infer<typeof questionSchema>;

const questions = [
  {
    id: 1,
    title: "Project Basics",
    fields: ["projectName", "projectType", "description"]
  },
  {
    id: 2,
    title: "Project Details",
    fields: ["targetAudience", "complexity", "timeline"]
  }
];

export default function NewProjectPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [projectId, setProjectId] = useState<string | null>(null);
  const totalSteps = questions.length;

  const form = useForm<QuestionFormData>({
    resolver: zodResolver(questionSchema),
    defaultValues: {
      projectName: "",
      projectType: "",
      smartContractLanguage: "",
      description: "",
      targetAudience: "",
      complexity: "",
      timeline: "",
    },
  });

  // Initialize project when component mounts
  useEffect(() => {
    if (!projectId) {
      const newProject = projectStorage.createNewProject("New Project");
      setProjectId(newProject.id);
    }
  }, [projectId]);

  const onSubmit = (data: QuestionFormData) => {
    if (!projectId) return;

    // Update project name
    projectStorage.updateProject(projectId, { name: data.projectName });

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
          targetAudience: "Who is your target audience?",
          complexity: "What is the project complexity?",
          timeline: "What is your development timeline?"
        },
        refinement: {}
      }
    };

    // Save answers
    projectStorage.saveProjectAnswers(answers);

    // Navigate to PRD preview
    router.push(`/projects/${projectId}/prd`);
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
                            <SelectItem value="web-app">Web Application</SelectItem>
                            <SelectItem value="mobile-app">Mobile Application</SelectItem>
                            <SelectItem value="api">API/Backend Service</SelectItem>
                            <SelectItem value="desktop-app">Desktop Application</SelectItem>
                            <SelectItem value="library">Library/Package</SelectItem>
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
                          Provide a comprehensive description of your project goals and features
                        </FormDescription>
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
                    name="complexity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Complexity</FormLabel>
                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value}>
                          <div className="space-y-3">
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="simple" id="simple" />
                              <Label htmlFor="simple">Simple - Basic features, single purpose</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="moderate" id="moderate" />
                              <Label htmlFor="moderate">Moderate - Multiple features, some complexity</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem value="complex" id="complex" />
                              <Label htmlFor="complex">Complex - Advanced features, multiple integrations</Label>
                            </div>
                          </div>
                        </RadioGroup>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="timeline"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Development Timeline</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select timeline" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="1-2-weeks">1-2 weeks</SelectItem>
                            <SelectItem value="1-month">1 month</SelectItem>
                            <SelectItem value="2-3-months">2-3 months</SelectItem>
                            <SelectItem value="3-6-months">3-6 months</SelectItem>
                            <SelectItem value="6-months-plus">6+ months</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          What's your expected development timeline?
                        </FormDescription>
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
              <Button type="button" variant="outline" className="flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Draft
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
                <Button type="submit" className="flex items-center gap-2">
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