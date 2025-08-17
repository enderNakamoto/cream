"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiStorage } from "@/lib/api-storage";
import { FileText, Download, Edit, Save, RotateCcw, CheckCircle, AlertCircle, Loader2, Code, Monitor } from "lucide-react";

interface FileStatus {
  status: 'not-generated' | 'generating' | 'generated' | 'error';
  content?: string;
  error?: string;
  isEditing?: boolean;
  originalContent?: string;
}

interface GenerateDocsClientProps {
  projectId: string;
}

const NORA_DOC_FILES = [
  { filename: 'Implementation.md', title: 'Implementation Plan', description: 'Detailed implementation strategy and technical approach' },
  { filename: 'project_structure.md', title: 'Project Structure', description: 'File and folder organization for the project' },
  { filename: 'UI_UX_doc.md', title: 'UI/UX Documentation', description: 'Design system and user experience guidelines' },
  { filename: 'Bug_tracking.md', title: 'Bug Tracking', description: 'Issue tracking and quality assurance processes' }
];

export default function GenerateDocsClient({ projectId }: GenerateDocsClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<string>('cursor');
  const [noraFileStatuses, setNoraFileStatuses] = useState<Record<string, FileStatus>>({});
  const [metadata, setMetadata] = useState<any>(null);
  const [errorDialog, setErrorDialog] = useState<{ open: boolean; message: string }>({ open: false, message: '' });
  const [isDownloadingCursor, setIsDownloadingCursor] = useState(false);

  // Initialize file statuses
  useEffect(() => {
    const initialStatuses: Record<string, FileStatus> = {};
    NORA_DOC_FILES.forEach(file => {
      initialStatuses[file.filename] = { status: 'not-generated' };
    });
    setNoraFileStatuses(initialStatuses);
    loadExistingFiles();
    loadMetadata();
  }, [projectId]);

  const loadExistingFiles = async () => {
    try {
      const metadata = await apiStorage.getProjectMetadata(projectId);
      if (metadata?.noraGeneratedFiles) {
        const newStatuses = { ...noraFileStatuses };
        
        for (const filename of metadata.noraGeneratedFiles) {
          try {
            const fileData = await apiStorage.getDocFileContent(projectId, filename, 'nora');
            newStatuses[filename] = {
              status: 'generated',
              content: fileData.content,
              originalContent: fileData.content
            };
          } catch (error) {
            console.error(`Error loading ${filename}:`, error);
            newStatuses[filename] = {
              status: 'error',
              error: 'Failed to load existing file'
            };
          }
        }
        setNoraFileStatuses(newStatuses);
      }
    } catch (error) {
      console.error('Error loading existing files:', error);
    }
  };

  const loadMetadata = async () => {
    try {
      const metadata = await apiStorage.getProjectMetadata(projectId);
      setMetadata(metadata);
    } catch (error) {
      console.error('Error loading metadata:', error);
    }
  };

  const generateFile = async (filename: string) => {
    setNoraFileStatuses(prev => ({
      ...prev,
      [filename]: { status: 'generating' }
    }));

    try {
      const result = await apiStorage.generateDocFile(projectId, filename, 'nora');
      
      setNoraFileStatuses(prev => ({
        ...prev,
        [filename]: {
          status: 'generated',
          content: result.content,
          originalContent: result.content
        }
      }));

      // Reload metadata to get updated noraGeneratedFiles list
      await loadMetadata();
    } catch (error: any) {
      console.error(`Error generating ${filename}:`, error);
      setNoraFileStatuses(prev => ({
        ...prev,
        [filename]: {
          status: 'error',
          error: error.message || 'Failed to generate file'
        }
      }));
    }
  };

  const startEditing = (filename: string) => {
    setNoraFileStatuses(prev => ({
      ...prev,
      [filename]: {
        ...prev[filename],
        isEditing: true
      }
    }));
  };

  const saveEdit = async (filename: string) => {
    const fileStatus = noraFileStatuses[filename];
    if (!fileStatus.content) return;

    try {
      await apiStorage.updateDocFileContent(projectId, filename, fileStatus.content, 'nora');
      
      setNoraFileStatuses(prev => ({
        ...prev,
        [filename]: {
          ...prev[filename],
          isEditing: false,
          originalContent: fileStatus.content
        }
      }));
    } catch (error: any) {
      console.error(`Error saving ${filename}:`, error);
      setErrorDialog({
        open: true,
        message: `Failed to save changes to ${filename}: ${error.message}`
      });
    }
  };

  const cancelEdit = (filename: string) => {
    setNoraFileStatuses(prev => ({
      ...prev,
      [filename]: {
        ...prev[filename],
        isEditing: false,
        content: prev[filename].originalContent
      }
    }));
  };

  const downloadFile = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const updateContent = (filename: string, content: string) => {
    setNoraFileStatuses(prev => ({
      ...prev,
      [filename]: {
        ...prev[filename],
        content
      }
    }));
  };

  const getStatusIcon = (status: FileStatus['status']) => {
    switch (status) {
      case 'generating':
        return <Loader2 className="w-4 h-4 animate-spin" />;
      case 'generated':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <FileText className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: FileStatus['status']) => {
    switch (status) {
      case 'not-generated':
        return <Badge variant="outline">Not Generated</Badge>;
      case 'generating':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Generating...</Badge>;
      case 'generated':
        return <Badge variant="default" className="bg-green-100 text-green-800">Generated</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
    }
  };

  const selectedIDEs = metadata?.selectedIDEs || [];

  const handleDownloadCursor = async () => {
    setIsDownloadingCursor(true);
    try {
      const blob = await apiStorage.downloadCursorPackage(projectId);
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `cursor-project-${projectId}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error('Error downloading Cursor package:', error);
      setErrorDialog({
        open: true,
        message: `Failed to download Cursor package: ${error.message}`
      });
    } finally {
      setIsDownloadingCursor(false);
    }
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Generate IDE Files</h1>
          <p className="text-muted-foreground mt-2">
            Generate files for your selected development environments
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.push(`/projects/${projectId}/generate`)}
        >
          Back to Generate
        </Button>
      </div>

      <Alert>
        <FileText className="h-4 w-4" />
        <AlertDescription>
          Generate files for your selected IDEs. Each IDE has different requirements and file structures.
        </AlertDescription>
      </Alert>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="cursor" className="flex items-center gap-2">
            <Code className="w-4 h-4" />
            Cursor
          </TabsTrigger>
          <TabsTrigger value="nora" className="flex items-center gap-2">
            <Monitor className="w-4 h-4" />
            Nora
          </TabsTrigger>
        </TabsList>

        <TabsContent value="cursor" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                Cursor IDE
              </CardTitle>
              <CardDescription>
                {selectedIDEs.includes('cursor') 
                  ? 'Cursor file generation will be implemented in a future update.'
                  : 'Cursor is not selected for this project.'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedIDEs.includes('cursor') ? (
                <div className="text-center py-16">
                  <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Code className="w-12 h-12 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Download Cursor Package</h3>
                  <p className="text-muted-foreground mb-8 text-lg">
                    Download a zip file containing your PRD and Cursor rule files.
                  </p>
                  <Button 
                    onClick={handleDownloadCursor}
                    disabled={isDownloadingCursor}
                    size="lg"
                    className="flex items-center gap-3 px-12 py-8 text-xl font-semibold h-auto"
                  >
                    {isDownloadingCursor ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        Creating Package...
                      </>
                    ) : (
                      <>
                        <Download className="w-6 h-6" />
                        Download for Cursor
                      </>
                    )}
                  </Button>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Code className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Not Selected</h3>
                  <p className="text-muted-foreground">
                    Cursor was not selected in the IDE selection step.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nora" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="w-5 h-5" />
                Nora IDE
              </CardTitle>
              <CardDescription>
                {selectedIDEs.includes('nora') 
                  ? 'Generate documentation files for Nora IDE. Each file can be generated individually, previewed, edited, and downloaded.'
                  : 'Nora is not selected for this project.'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedIDEs.includes('nora') ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {NORA_DOC_FILES.map((file) => {
                    const status = noraFileStatuses[file.filename];
                    
                    return (
                      <Card key={file.filename} className="relative">
                        <CardHeader>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(status?.status || 'not-generated')}
                              <CardTitle className="text-lg">{file.title}</CardTitle>
                            </div>
                            {getStatusBadge(status?.status || 'not-generated')}
                          </div>
                          <CardDescription>{file.description}</CardDescription>
                        </CardHeader>
                        
                        <CardContent className="space-y-4">
                          {status?.status === 'error' && (
                            <Alert variant="destructive">
                              <AlertCircle className="h-4 w-4" />
                              <AlertDescription>{status.error}</AlertDescription>
                            </Alert>
                          )}

                          {status?.status === 'generated' && !status.isEditing && (
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium">Content Preview</h4>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => startEditing(file.filename)}
                                  >
                                    <Edit className="w-4 h-4 mr-1" />
                                    Edit
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => downloadFile(file.filename, status.content!)}
                                  >
                                    <Download className="w-4 h-4 mr-1" />
                                    Download
                                  </Button>
                                </div>
                              </div>
                              <div className="bg-muted p-3 rounded-md max-h-40 overflow-y-auto">
                                <pre className="text-sm whitespace-pre-wrap">{status.content}</pre>
                              </div>
                            </div>
                          )}

                          {status?.status === 'generated' && status.isEditing && (
                            <div className="space-y-3">
                              <div className="flex items-center justify-between">
                                <h4 className="font-medium">Editing Content</h4>
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => cancelEdit(file.filename)}
                                  >
                                    Cancel
                                  </Button>
                                  <Button
                                    size="sm"
                                    onClick={() => saveEdit(file.filename)}
                                  >
                                    <Save className="w-4 h-4 mr-1" />
                                    Save
                                  </Button>
                                </div>
                              </div>
                              <Textarea
                                value={status.content || ''}
                                onChange={(e) => updateContent(file.filename, e.target.value)}
                                className="min-h-[200px]"
                                placeholder="Documentation content..."
                              />
                            </div>
                          )}

                          {status?.status === 'generating' && (
                            <div className="flex items-center justify-center py-8">
                              <div className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Generating {file.title}...</span>
                              </div>
                            </div>
                          )}

                          {status?.status === 'not-generated' && (
                            <Button
                              onClick={() => generateFile(file.filename)}
                              className="w-full"
                            >
                              <FileText className="w-4 h-4 mr-2" />
                              Generate {file.title}
                            </Button>
                          )}

                          {status?.status === 'error' && (
                            <Button
                              onClick={() => generateFile(file.filename)}
                              variant="outline"
                              className="w-full"
                            >
                              <RotateCcw className="w-4 h-4 mr-2" />
                              Retry Generation
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Monitor className="w-8 h-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">Not Selected</h3>
                  <p className="text-muted-foreground">
                    Nora was not selected in the IDE selection step.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={errorDialog.open} onOpenChange={(open) => setErrorDialog({ open, message: '' })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
            <DialogDescription>{errorDialog.message}</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
} 