# PATCH App - Updated Page Structure & UI Components

## 1. Landing Page
- **Hero Section**
  - Main title: "C.R.E.A.M"
  - Subtitle: "Context Rules Everything Around Me"
  - Tagline: "Stop prompting like it's 2024"
- **Context Engineering Section**
  - Heading
  - Descriptive paragraph about context engineering
- **Demo Section**
  - Embedded video placeholder/image
  - Play button overlay
- **Call to Action**
  - "Get Started" button (prominent)

## 2. Projects Dashboard
- **Header Section**
  - Page title: "Your Projects"
  - "New Project" button
- **Projects Grid/List**
  - Project cards showing:
    - Project name
    - Last modified date
    - Status badge
    - Quick actions (edit, delete, view)
- **Empty State** (when no projects exist)
  - Illustration
  - "Create your first project" message
  - CTA button

## 3. Initial Questions Page (New Project)
- **Progress Indicator**
  - Step counter (1 of 5)
  - Progress bar
- **Question Form**
  - Question title/number
  - Input field (text/textarea/select/radio)
  - Helper text/examples
- **Navigation**
  - "Previous" button
  - "Next" button
  - "Save Draft" option

## 4. PRD Preview Page
- **Header**
  - "Your Product Requirements Document"
  - Export options
- **PRD Content Display**
  - Formatted markdown preview
  - Sections: Overview, Features, Tech Stack, etc.
- **Actions**
  - "Refine" button (primary)
  - "Start Over" button
  - "Export PRD" button

## 5. Refinement Questions Page
- **Context Banner**
  - "Let's refine your PRD"
  - Reference to previous answers
- **Question Form** (similar to initial questions)
  - More detailed/specific questions
  - Conditional questions based on previous answers
- **Navigation**
  - "Back to PRD" button
  - "Continue" button

## 6. Refined PRD Preview
- **Header**
  - "Refined Product Requirements Document"
  - Comparison toggle (before/after)
- **Enhanced PRD Content**
  - Updated sections
  - New details added
- **Actions**
  - "Proceed to Tool Selection"
  - "Refine Further"
  - "Export Refined PRD"

## 7. Tool Selection Page
- **Header**
  - "Choose Your Development Tool"
- **Tool Cards**
  - Cursor card with logo/description
  - Windsurf card with logo/description  
  - Claude Code card with logo/description
- **Selection Actions**
  - Radio buttons or card selection
  - "Continue with [Tool]" button

## 8. Tool-Specific Questions Page
- **Context Header**
  - "Configuring for [Selected Tool]"
  - Tool logo/branding
- **Tool-Specific Form**
  - Questions tailored to chosen tool
  - Code style preferences
  - Configuration options
- **Navigation**
  - "Back to Tool Selection"
  - "Generate Files" button

## 9. **Generated Files Management Page** (Updated)
- **Header**
  - "Your Generated Context Files"
  - Selected tool indicator
  - "Regenerate All" option
- **Files List/Grid**
  - 5 file cards showing:
    - File name/icon
    - Description
    - Last generated/edited timestamp
    - File size/word count
    - Status indicator (generated/edited/needs update)
- **File Actions** (per file)
  - **Generate** button (if not generated)
  - **View** button (opens preview modal)
  - **Edit** button (opens editor)
  - **Download** button
  - **Regenerate** button (with loading state)
- **File States**
  - Not generated (gray/disabled state)
  - Generating (loading spinner)
  - Generated (green checkmark)
  - Edited (orange edit icon)
  - Error (red warning icon)

## 10. **File Editor Modal/Page** (New)
- **Header**
  - File name and type
  - Last saved timestamp
  - Save status indicator
- **Editor Interface**
  - Markdown editor with syntax highlighting
  - Live preview pane (side-by-side or toggle)
  - Line numbers
  - Search/replace functionality
- **Editor Toolbar**
  - Bold, italic, headers formatting
  - Insert code blocks
  - Insert links/images
  - Undo/redo
- **Actions**
  - "Save" button (with auto-save indicator)
  - "Save & Close" button
  - "Cancel/Discard Changes" button
  - "Restore Original" button
  - "Export" button

## 11. **File Preview Modal** (Updated)
- **Header**
  - File name and description
  - File metadata (size, last modified)
- **Preview Content**
  - Rendered markdown display
  - Code syntax highlighting
  - Copy to clipboard button
- **Actions**
  - "Edit" button (opens editor)
  - "Download" button
  - "Copy Content" button
  - "Close" button

## 12. Project Complete/Summary Page
- **Success Message**
  - Congratulations header
  - Project completion summary
- **Files Overview Dashboard**
  - Grid/list of all generated files
  - Quick stats (files generated, edited, downloaded)
  - Bulk actions (download all, export project)
- **File Status Summary**
  - Generated files count
  - Edited files indicator
  - Last activity timestamp
- **Next Steps Section**
  - Instructions for using files with chosen tool
  - Integration guides
  - Links to tool documentation
- **Actions**
  - "Return to Projects"
  - "Edit Files" button
  - "Start New Project"
  - "Share Project"

## Common UI Components Across Pages (Updated)
- **Navigation Bar** (persistent)
  - PATCH logo
  - Current page indicator
  - Project breadcrumb
  - User menu/settings
- **File Status Indicators**
  - Color-coded badges
  - Icons for different states
  - Tooltips with details
- **Loading States**
  - File generation spinners
  - Skeleton loaders for content
  - Progress bars for bulk operations
- **Error States**
  - File generation errors
  - Save/edit error messages
  - Retry/recovery options
- **Modals/Overlays**
  - File preview windows
  - Editor interface
  - Confirmation dialogs (delete, restore)
  - Help tooltips
- **Auto-save Functionality**
  - Save status indicators
  - Conflict resolution
  - Version history access

## Additional Features for File Management
- **File History/Versions**
  - Version comparison
  - Restore previous versions
  - Change tracking
- **Template System**
  - Save custom templates
  - Apply templates to new projects
- **Export Options**
  - Individual file download
  - Bulk ZIP download
  - Direct integration with tools
- **Collaboration Features**
  - Share read-only links
  - Export project configurations
  - Team templates