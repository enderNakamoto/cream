"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CheckCircle, 
  Download, 
  FileText, 
  Code, 
  Settings, 
  Database, 
  Globe,
  Share2,
  ArrowRight,
  Plus,
  ExternalLink
} from "lucide-react";

// Mock completion data
const mockCompletionData = {
  projectName: "E-commerce Platform",
  filesGenerated: 5,
  filesEdited: 2,
  lastActivity: "2024-01-15 15:30",
  selectedTool: "Cursor",
  files: [
    { name: "project-context.md", status: "generated", size: "2.3 KB" },
    { name: "code-style.md", status: "edited", size: "1.8 KB" },
    { name: "api-spec.md", status: "generated", size: "3.1 KB" },
    { name: "database-schema.md", status: "edited", size: "2.7 KB" },
    { name: "deployment.md", status: "generated", size: "1.5 KB" }
  ]
};

export default function ProjectCompletePage({ params }: { params: { id: string } }) {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Success Message */}
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          <strong>Congratulations!</strong> Your project "{mockCompletionData.projectName}" has been successfully completed. 
          All context files have been generated and are ready to use with {mockCompletionData.selectedTool}.
        </AlertDescription>
      </Alert>

      {/* Files Overview Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Files Generated</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockCompletionData.filesGenerated}</div>
            <p className="text-xs text-muted-foreground">
              Context files ready for use
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Files Edited</CardTitle>
            <Code className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockCompletionData.filesEdited}</div>
            <p className="text-xs text-muted-foreground">
              Customized for your needs
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Activity</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-sm font-medium">{mockCompletionData.lastActivity}</div>
            <p className="text-xs text-muted-foreground">
              Recent file updates
            </p>
          </CardContent>
        </Card>
      </div>

      {/* File Status Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Generated Files</CardTitle>
          <CardDescription>
            Overview of all context files created for your project
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockCompletionData.files.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center space-x-3">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{file.name}</p>
                    <p className="text-sm text-muted-foreground">{file.size}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant={file.status === "edited" ? "outline" : "default"}>
                    {file.status === "edited" ? "Edited" : "Generated"}
                  </Badge>
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Next Steps Section */}
      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle>Next Steps</CardTitle>
          <CardDescription>
            Here's how to use your generated context files with {mockCompletionData.selectedTool}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
                1
              </div>
              <div>
                <h4 className="font-medium">Download Your Files</h4>
                <p className="text-sm text-muted-foreground">
                  Download all context files as a ZIP archive or individual files
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
                2
              </div>
              <div>
                <h4 className="font-medium">Add to Your Project</h4>
                <p className="text-sm text-muted-foreground">
                  Place the context files in your project root directory or in a dedicated context folder
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
                3
              </div>
              <div>
                <h4 className="font-medium">Configure {mockCompletionData.selectedTool}</h4>
                <p className="text-sm text-muted-foreground">
                  Reference these files in your {mockCompletionData.selectedTool} configuration or chat context
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium">
                4
              </div>
              <div>
                <h4 className="font-medium">Start Coding</h4>
                <p className="text-sm text-muted-foreground">
                  Your AI assistant will now have full context about your project requirements and architecture
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t">
            <h4 className="font-medium mb-3">Helpful Resources</h4>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                {mockCompletionData.selectedTool} Documentation
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                Context Engineering Guide
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                Best Practices
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            Share Project
          </Button>
          <Button variant="outline" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Export Project
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowRight className="w-4 h-4" />
            Return to Projects
          </Button>
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Start New Project
          </Button>
        </div>
      </div>
    </div>
  );
} 