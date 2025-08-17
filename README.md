# C.R.E.A.M - Context Engineering for AI Development

> **C**ontext **R**efinement **E**ngineering **A**nd **M**anagement

A comprehensive platform that transforms human requirements into structured, actionable context for AI development tools. C.R.E.A.M serves as the missing orchestration layer that bridges the gap between project requirements and AI-powered development environments.

## 🎯 What is C.R.E.A.M?

C.R.E.A.M is an intelligent context engineering platform that helps developers create comprehensive, tool-specific context files for AI coding assistants like Cursor and Nora. It addresses the common pain points in AI-assisted development by providing:

- **Structured Context Creation**: Transform vague requirements into detailed PRDs
- **AI-Powered Refinement**: Use LLMs to enhance and refine project documentation
- **Tool-Specific Outputs**: Generate context files optimized for different AI development environments
- **Project Orchestration**: Maintain consistency across development phases and tool switches

## 🚀 Key Features

### 📋 **Intelligent PRD Generation**
- Guided project setup with smart form validation
- Support for Web Apps and Web3 dApps
- Conditional questions based on project type
- Phase-based task breakdown

### 🤖 **AI-Powered Refinement**
- OpenAI GPT-4o integration for PRD enhancement
- 10 targeted refinement questions
- Intelligent context processing
- Refined PRD generation with improved structure

### 🛠️ **IDE-Specific Context Generation**
- **Cursor IDE**: PRD + Rule files (generate.mdc, workflow.mdc)
- **Nora IDE**: Comprehensive documentation suite
  - Implementation Plan
  - Project Structure
  - UI/UX Documentation
  - Bug Tracking Guidelines

### 🎨 **Modern UI/UX**
- Built with Next.js 14 and App Router
- shadcn/ui components for consistent design
- Dark/Light mode support
- Responsive design for all devices

### 💾 **Robust Data Management**
- File-based storage system
- Project metadata tracking
- Version control for PRDs
- Export capabilities for different IDEs

## 🏗️ Architecture

### **Frontend Stack**
- **Framework**: Next.js 14 with App Router
- **UI Library**: shadcn/ui components
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **State Management**: React hooks + custom hooks
- **Forms**: React Hook Form + Zod validation

### **Backend Stack**
- **API Routes**: Next.js API routes
- **Storage**: File-based system (JSON, Markdown)
- **LLM Integration**: OpenAI GPT-4o
- **File Operations**: Node.js fs/path modules

### **Project Structure**
```
cream/
├── frontend/                 # Next.js application
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   ├── components/      # Reusable UI components
│   │   ├── lib/            # Utility functions
│   │   └── hooks/          # Custom React hooks
│   ├── storage/            # File storage (gitignored)
│   └── public/             # Static assets
├── prompts/                # LLM system prompts
├── rule_templates/         # IDE rule templates
├── storage/               # Root storage (gitignored)
└── templates/             # Project templates
```

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ 
- npm or yarn
- OpenAI API key

### **Installation**

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd cream
   ```

2. **Install dependencies**
   ```bash
   cd frontend
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Create .env.local file
   cp .env.example .env.local
   ```
   
   Add your OpenAI API key:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📖 How to Use

### **1. Create a New Project**
1. Click "Get Started" on the landing page
2. Click "New Project" on the projects dashboard
3. Fill out the guided form with your project details
4. Choose project type (Web App or Web3 dApp)
5. Answer conditional questions based on your selection
6. Define your project phases

### **2. Generate Initial PRD**
1. Review your project answers
2. Click "Generate PRD" to create your initial Product Requirements Document
3. Edit the PRD inline if needed
4. Save your changes

### **3. Refine Your PRD**
1. Click "Refine PRD" to access AI-powered refinement
2. Answer 10 targeted questions to improve your PRD
3. Process the refinement to generate an enhanced PRD
4. Review and edit the refined PRD

### **4. Select Development Tools**
1. Choose your preferred IDEs (Cursor, Nora)
2. Click "Generate" to proceed to file generation

### **5. Generate Context Files**
1. **For Cursor**: Download a zip package with PRD and rule files
2. **For Nora**: Generate individual documentation files
   - Implementation Plan
   - Project Structure
   - UI/UX Documentation
   - Bug Tracking Guidelines
3. Preview, edit, and download files as needed

## 🔧 Configuration

### **Environment Variables**
```env
# Required
OPENAI_API_KEY=your_openai_api_key_here

# Optional
NODE_ENV=development
```

### **Storage Configuration**
The application uses file-based storage located in:
- `frontend/storage/` (development)
- `storage/` (production)

All storage directories are gitignored for security.

## 🛠️ Development

### **Available Scripts**
```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
```

### **Project Structure Details**

#### **Pages & Routes**
- `/` - Landing page with project overview
- `/projects` - Projects dashboard
- `/projects/new` - New project creation
- `/projects/[id]/prd` - PRD preview and editing
- `/projects/[id]/refinements` - PRD refinement questions
- `/projects/[id]/prd-refined` - Refined PRD preview
- `/projects/[id]/ide-selection` - IDE selection
- `/projects/[id]/generate` - Context generation overview
- `/projects/[id]/generate-docs` - IDE-specific file generation

#### **Key Components**
- `TypewriterComplaints` - Animated developer complaints
- `ThemeProvider` - Dark/light mode management
- `ProjectState` - Project state management hook
- `FileStorage` - Server-side file operations
- `ApiStorage` - Client-side API interactions

#### **API Routes**
- `/api/projects` - Project CRUD operations
- `/api/llm/*` - OpenAI integration endpoints
- `/api/projects/[id]/*` - Project-specific operations

## 🎨 UI Components

The application uses shadcn/ui components for consistent design:

- **Navigation**: NavigationMenu, Breadcrumb
- **Forms**: Input, Textarea, Select, Checkbox
- **Feedback**: Alert, Dialog, Toast
- **Layout**: Card, Separator, Tabs
- **Data Display**: Badge, Progress, Skeleton

## 🔒 Security & Privacy

- **API Keys**: Stored in environment variables
- **File Storage**: Local file system (no cloud dependencies)
- **Data Privacy**: All project data stays on your machine
- **Gitignore**: Storage directories excluded from version control

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Andrej Karpathy** for popularizing context engineering
- **shadcn/ui** for the excellent component library
- **Next.js team** for the amazing framework
- **OpenAI** for the powerful LLM APIs

## 📞 Support

For support, questions, or feature requests:
- Open an issue on GitHub
- Check the documentation
- Review the code examples

---

**Built with ❤️ for the AI development community** 