"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Download, FileText, Share2, Edit, RotateCcw } from "lucide-react";

// Mock PRD data
const mockPRD = {
  projectName: "E-commerce Platform",
  overview: `
# Product Requirements Document
## E-commerce Platform

### Overview
A comprehensive e-commerce platform designed to provide a seamless online shopping experience for both customers and merchants.

### Project Goals
- Create a scalable e-commerce solution
- Provide excellent user experience
- Support multiple payment methods
- Enable inventory management
- Offer analytics and reporting

### Target Audience
- Online shoppers looking for a smooth purchasing experience
- Small to medium-sized businesses wanting to sell online
- Developers seeking a customizable e-commerce solution

### Key Features
1. **User Authentication & Profiles**
   - User registration and login
   - Profile management
   - Address book
   - Order history

2. **Product Catalog**
   - Product listings with images
   - Search and filtering
   - Categories and tags
   - Product reviews and ratings

3. **Shopping Cart & Checkout**
   - Add/remove items from cart
   - Save cart for later
   - Multiple payment options
   - Order confirmation

4. **Admin Dashboard**
   - Product management
   - Order processing
   - Inventory tracking
   - Sales analytics

### Technical Requirements
- **Frontend**: React.js with TypeScript
- **Backend**: Node.js with Express
- **Database**: PostgreSQL
- **Authentication**: JWT tokens
- **Payment**: Stripe integration
- **File Storage**: AWS S3
- **Deployment**: Docker containers

### Development Timeline
- **Phase 1** (4 weeks): Core authentication and product catalog
- **Phase 2** (3 weeks): Shopping cart and checkout
- **Phase 3** (3 weeks): Admin dashboard
- **Phase 4** (2 weeks): Testing and optimization

### Success Metrics
- Page load time < 3 seconds
- 99.9% uptime
- Mobile responsiveness
- SEO optimization
- Security compliance (PCI DSS)
  `,
  lastModified: "2024-01-15",
  status: "draft"
};

export default function PRDPreviewPage({ params }: { params: { id: string } }) {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Your Product Requirements Document</h1>
          <p className="text-muted-foreground mt-2">
            Generated based on your project specifications
          </p>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem>
                <FileText className="w-4 h-4 mr-2" />
                Export as Markdown
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileText className="w-4 h-4 mr-2" />
                Export as PDF
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share2 className="w-4 h-4 mr-2" />
                Share Link
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* PRD Content Display */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{mockPRD.projectName}</CardTitle>
            <div className="text-sm text-muted-foreground">
              Last modified: {mockPRD.lastModified}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px] w-full">
            <div className="prose prose-sm max-w-none">
              <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed">
                {mockPRD.overview}
              </pre>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4" />
            Start Over
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export PRD
          </Button>
          <Button className="flex items-center gap-2">
            <Edit className="w-4 h-4" />
            Refine
          </Button>
        </div>
      </div>
    </div>
  );
} 