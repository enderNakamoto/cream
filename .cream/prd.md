# CREAM - Context Rules Everything Around Me
## Ultra-MVP Product Requirements Document

### Overview

**Problem**: Developers using AI coding assistants waste hours manually creating project context, rules, and documentation for each new project.

**Solution**: CREAM generates comprehensive project documentation and AI tool configurations through intelligent LLM-powered questionnaires in under 10 minutes.

**Value Proposition**: "Transform your project idea into AI-ready development context with intelligent questionnaires and templates"

---

### Ultra-MVP Scope (Local-First)

#### Core Features

**1. Project Type Selection**
- Simple choice: Web2 or Web3 project
- Routes to appropriate template and question flow

**2. Intelligent LLM-Powered Questionnaires**
- **Dynamic questioning**: LLM analyzes previous responses to ask relevant follow-up questions
- **Context-aware prompting**: Questions adapt based on chosen tech stack, complexity, and project type
- **Progressive refinement**: Each answer helps the LLM generate better subsequent questions
- **Smart defaults**: Pre-filled answers based on popular patterns

**3. Real-time PRD Generation**
- Live markdown preview that updates as user answers questions
- Uses provided PRD templates (Web2/Web3 specific)
- Template interpolation with user responses

**4. AI Tool Configuration Generation**
- **Post-PRD questionnaire**: LLM asks about coding preferences, patterns, and tool-specific needs
- **Cursor Rules**: Generate `.cursor` files with project-specific rules
- **Nora Rules**: Generate nora configuration files
- **Template-based generation**: Use provided templates for consistent output

**5. Local File Management**
- All projects stored locally in `./projects/` directory
- Simple JSON-based project database
- Export functionality for generated artifacts

#### User Flow

```
1. Landing Page
   └─ "Create New Project" button

2. Project Type Selection
   ├─ Web2 Project
   └─ Web3 Project

3. Intelligent PRD Questionnaire
   ├─ LLM generates questions based on project type
   ├─ Real-time PRD preview (right panel)
   ├─ Each answer refines subsequent questions
   └─ Smart validation and suggestions

4. PRD Review & Edit
   ├─ Generated PRD displayed
   ├─ Manual editing capability
   └─ "Generate AI Configurations" button

5. AI Tool Preference Questionnaire
   ├─ LLM asks about coding patterns
   ├─ Framework preferences
   ├─ Architecture decisions
   └─ Tool-specific preferences

6. Configuration Generation
   ├─ Generate Cursor rules
   ├─ Generate Nora configuration
   └─ Preview all generated files

7. Export & Download
   ├─ Download individual files
   ├─ Download complete project package
   └─ Local project saved automatically
```

---

### Technical Architecture

#### Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **LLM Integration**: OpenAI API or Claude API for intelligent questioning
- **State Management**: Zustand for project state
- **Forms**: React Hook Form with Zod validation
- **File Handling**: Node.js fs module
- **Database**: Simple JSON file storage

#### File Structure
```
./projects/
├── projects.json                 # Project metadata database
└── {project-id}/
    ├── metadata.json            # Project info and responses
    ├── prd.md                   # Generated PRD
    ├── cursor-rules.txt         # Cursor AI configuration
    ├── nora-config.json         # Nora configuration
    └── exports/
        └── project-package.zip  # Complete export
```

#### Data Models
```typescript
interface Project {
  id: string;
  name: string;
  type: 'web2' | 'web3';
  status: 'questionnaire' | 'prd-review' | 'config-gen' | 'complete';
  prdResponses: Record<string, any>;
  configResponses: Record<string, any>;
  generatedPRD: string;
  generatedConfigs: {
    cursorRules: string;
    noraConfig: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface QuestionnaireState {
  currentQuestionIndex: number;
  questions: LLMQuestion[];
  responses: Record<string, any>;
  isGeneratingNextQuestion: boolean;
}

interface LLMQuestion {
  id: string;
  question: string;
  type: 'text' | 'select' | 'multiselect' | 'boolean';
  options?: string[];
  required: boolean;
  context: string; // Why this question is being asked
}
```

---

### LLM Integration Strategy

#### Intelligent Questionnaire Flow

**1. Initial Questions (Template-based)**
- Project name, description, primary goal
- Tech stack preferences
- Target audience/use case

**2. Dynamic Follow-up Questions (LLM-generated)**
```typescript
// Example LLM prompt for generating next question
const generateNextQuestion = async (projectType: string, previousResponses: Record<string, any>) => {
  const prompt = `
    Based on this ${projectType} project with responses: ${JSON.stringify(previousResponses)}
    
    Generate the next most important question to ask to create a comprehensive PRD.
    Consider: architecture decisions, technical requirements, user experience, deployment needs.
    
    Return JSON: { question: string, type: string, options?: string[], context: string }
  `;
  
  return await llm.generate(prompt);
};
```

**3. PRD Generation**
```typescript
const generatePRD = async (template: string, responses: Record<string, any>) => {
  const prompt = `
    Using this PRD template: ${template}
    And these project responses: ${JSON.stringify(responses)}
    
    Generate a comprehensive PRD by filling in the template with specific details from responses.
    Ensure technical accuracy and actionable requirements.
  `;
  
  return await llm.generate(prompt);
};
```

**4. Configuration Generation**
```typescript
const generateCursorRules = async (prd: string, configResponses: Record<string, any>) => {
  const prompt = `
    Based on this PRD: ${prd}
    And coding preferences: ${JSON.stringify(configResponses)}
    
    Generate Cursor AI rules that enforce:
    - Project architecture patterns
    - Coding conventions
    - Framework-specific best practices
    - Error handling approaches
    
    Use the provided Cursor rules template.
  `;
  
  return await llm.generate(prompt);
};
```

---

### Future Expansion Points (Not Ultra-MVP)

#### Phase 2: Task Management
- **Task breakdown**: LLM generates task list from PRD
- **Dependency mapping**: Identify task relationships
- **Progress tracking**: Check off completed tasks
- **Memory system**: Track what's been done, what's next

#### Phase 3: Enhanced AI Tools
- **Windsurf configuration**: Add windsurf support
- **Claude Code context**: Add claude.md generation
- **Tool comparison**: Help users choose best AI tool

#### Phase 4: Advanced Features
- **Template customization**: User-defined templates
- **Project dashboard**: Multi-project management
- **Export options**: GitHub integration, zip packages
- **Configuration migration**: Convert between tool formats

---

### Success Metrics

**Primary KPIs**:
- **Time to complete**: < 10 minutes from start to export
- **Generated quality**: PRD completeness score (manual review)
- **Config validity**: % of generated rules that work without modification
- **User satisfaction**: Post-generation feedback score

**Technical KPIs**:
- **Question relevance**: LLM generates pertinent follow-ups
- **Template interpolation**: Accurate data insertion
- **File generation**: Error-free config creation
- **Local storage**: Reliable project persistence

---

### Development Task List

#### Foundation Tasks
- [ ] Next.js project setup with shadcn/ui
- [ ] Basic project type selection UI
- [ ] Static questionnaire implementation (no LLM initially)
- [ ] PRD template interpolation system
- [ ] Local file storage and project persistence

#### LLM Integration Tasks
- [ ] OpenAI/Claude API integration
- [ ] Dynamic question generation system
- [ ] Intelligent follow-up question logic
- [ ] Real-time PRD preview updates
- [ ] Question context and relevance scoring

#### Configuration Generation Tasks
- [ ] Post-PRD questionnaire flow
- [ ] Cursor rules generation from templates
- [ ] Nora configuration generation
- [ ] Multi-file export functionality
- [ ] Configuration preview and editing

#### Polish & Refinement Tasks
- [ ] UI/UX improvements and responsive design
- [ ] Comprehensive error handling
- [ ] Template refinement and validation
- [ ] User feedback collection system
- [ ] Performance optimization

---

### Templates Required

**You'll need to provide**:
1. **PRD Templates**:
   - `web2-prd-template.md`
   - `web3-prd-template.md`

2. **Configuration Templates**:
   - `cursor-rules-template.txt`
   - `nora-config-template.json`

3. **Question Templates**:
   - `web2-initial-questions.json`
   - `web3-initial-questions.json`

**Template structure**:
```markdown
# PRD Template Example
## Project: {{projectName}}
### Overview
{{projectDescription}}

### Technical Requirements
- Framework: {{framework}}
- Database: {{database}}
- Deployment: {{deployment}}

<!-- LLM will fill in {{variables}} based on questionnaire responses -->
```

---

### Getting Started

**Next immediate steps**:
1. **Set up Next.js project** with shadcn/ui
2. **Create basic project structure** and routing
3. **Implement simple questionnaire** (static questions first)
4. **Add template interpolation** for PRD generation
5. **Test local file storage** and project persistence

This ultra-MVP focuses on the core value proposition while being achievable in 8 weeks with clear expansion paths for future features.