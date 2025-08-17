# PATCH App - shadcn/ui Implementation Plan

## 1. Landing Page
### Hero Section
- **Typography**: Custom headings with shadcn styling
- **Button**: Primary CTA button
- **Card**: Hero content container

### Context Engineering Section
- **Card**: Content container
- **Typography**: Section headings and body text

### Demo Section
- **Card**: Video container
- **Button**: Play button overlay
- **Aspect-ratio**: Video placeholder

### Call to Action
- **Button**: "Get Started" button

## 2. Projects Dashboard
### Header Section
- **Typography**: Page title
- **Button**: "New Project" button

### Projects Grid/List
- **Card**: Project cards
- **Badge**: Status indicators
- **Button**: Quick action buttons (edit, delete, view)
- **Typography**: Project names and dates

### Empty State
- **Card**: Empty state container
- **Typography**: Empty state message
- **Button**: CTA button

## 3. Initial Questions Page (New Project)
### Progress Indicator
- **Progress**: Progress bar
- **Typography**: Step counter

### Question Form
- **Form**: Form container with validation
- **Input**: Text inputs
- **Textarea**: Long text inputs
- **Select**: Dropdown selections
- **Radio-group**: Radio button groups
- **Label**: Form labels
- **Typography**: Helper text and examples

### Navigation
- **Button**: Previous/Next buttons
- **Button**: Save Draft button

## 4. PRD Preview Page
### Header
- **Typography**: Page title
- **Dropdown-menu**: Export options

### PRD Content Display
- **Card**: Content container
- **Typography**: Formatted markdown content
- **Scroll-area**: Content scrolling

### Actions
- **Button**: Primary action buttons
- **Button**: Secondary action buttons

## 5. Refinement Questions Page
### Context Banner
- **Alert**: Context information banner
- **Typography**: Reference text

### Question Form
- **Form**: Form container
- **Input**: Text inputs
- **Textarea**: Long text inputs
- **Select**: Dropdown selections
- **Radio-group**: Radio button groups
- **Label**: Form labels

### Navigation
- **Button**: Navigation buttons

## 6. Refined PRD Preview
### Header
- **Typography**: Page title
- **Toggle-group**: Comparison toggle

### Enhanced PRD Content
- **Card**: Content container
- **Typography**: Updated content
- **Scroll-area**: Content scrolling

### Actions
- **Button**: Action buttons

## 7. Tool Selection Page
### Header
- **Typography**: Page title

### Tool Cards
- **Card**: Tool selection cards
- **Radio-group**: Tool selection
- **Typography**: Tool descriptions
- **Aspect-ratio**: Tool logos

### Selection Actions
- **Button**: Continue button

## 8. Tool-Specific Questions Page
### Context Header
- **Alert**: Tool context banner
- **Typography**: Tool-specific instructions

### Tool-Specific Form
- **Form**: Form container
- **Input**: Configuration inputs
- **Textarea**: Code style preferences
- **Select**: Configuration options
- **Label**: Form labels

### Navigation
- **Button**: Navigation buttons

## 9. Generated Files Management Page
### Header
- **Typography**: Page title
- **Badge**: Tool indicator
- **Button**: Regenerate all button

### Files List/Grid
- **Card**: File cards
- **Badge**: Status indicators
- **Typography**: File names and descriptions
- **Skeleton**: Loading states

### File Actions
- **Button**: Action buttons (Generate, View, Edit, Download, Regenerate)
- **Dialog**: Confirmation dialogs for actions

### File States
- **Badge**: Status badges
- **Typography**: Status text

## 10. File Editor Modal/Page
### Header
- **Typography**: File name and type
- **Badge**: Save status indicator

### Editor Interface
- **Textarea**: Markdown editor
- **Tabs**: Editor/preview toggle
- **Scroll-area**: Content scrolling
- **Typography**: Preview content

### Editor Toolbar
- **Button**: Formatting buttons
- **Dropdown-menu**: Insert options
- **Separator**: Toolbar separators

### Actions
- **Button**: Save buttons
- **Button**: Cancel button
- **Button**: Restore button
- **Button**: Export button

## 11. File Preview Modal
### Header
- **Typography**: File name and description
- **Typography**: File metadata

### Preview Content
- **Typography**: Rendered content
- **Button**: Copy button
- **Scroll-area**: Content scrolling

### Actions
- **Button**: Action buttons

## 12. Project Complete/Summary Page
### Success Message
- **Alert**: Success banner
- **Typography**: Congratulations message

### Files Overview Dashboard
- **Card**: Overview cards
- **Typography**: Statistics
- **Button**: Bulk action buttons

### File Status Summary
- **Badge**: Status badges
- **Typography**: Summary text

### Next Steps Section
- **Card**: Instructions container
- **Typography**: Step-by-step instructions
- **Button**: Navigation buttons

### Actions
- **Button**: Action buttons

## Common UI Components Across Pages

### Navigation Bar
- **Navigation-menu**: Main navigation
- **Typography**: Logo and page titles
- **Breadcrumb**: Page breadcrumbs
- **Dropdown-menu**: User menu

### File Status Indicators
- **Badge**: Status badges
- **Tooltip**: Status tooltips
- **Typography**: Status text

### Loading States
- **Skeleton**: Loading skeletons
- **Progress**: Progress indicators
- **Typography**: Loading text

### Error States
- **Alert**: Error messages
- **Button**: Retry buttons
- **Typography**: Error descriptions

### Modals/Overlays
- **Dialog**: Modal dialogs
- **Sheet**: Side panels
- **Alert-dialog**: Confirmation dialogs
- **Tooltip**: Help tooltips

### Auto-save Functionality
- **Badge**: Save status
- **Typography**: Save messages
- **Button**: Conflict resolution

## Additional Features for File Management

### File History/Versions
- **Tabs**: Version tabs
- **Typography**: Version information
- **Button**: Restore buttons

### Template System
- **Card**: Template cards
- **Button**: Template actions
- **Typography**: Template descriptions

### Export Options
- **Dropdown-menu**: Export options
- **Button**: Export buttons
- **Typography**: Export descriptions

### Collaboration Features
- **Card**: Share cards
- **Button**: Share buttons
- **Typography**: Collaboration text

## Layout Components
- **Separator**: Section separators
- **Aspect-ratio**: Image/video containers
- **Scroll-area**: Scrollable content areas
- **Resizable**: Resizable panels (for editor)

## Form Components
- **Form**: All form containers
- **Input**: Text inputs
- **Textarea**: Multi-line inputs
- **Select**: Dropdown selections
- **Checkbox**: Checkboxes
- **Radio-group**: Radio buttons
- **Switch**: Toggle switches
- **Slider**: Range inputs
- **Label**: Form labels

## Feedback Components
- **Sonner**: Toast notifications
- **Alert**: Status messages
- **Progress**: Progress indicators
- **Skeleton**: Loading states 