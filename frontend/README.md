# PATCH - C.R.E.A.M Frontend

A Next.js application implementing the PATCH (Context Rules Everything Around Me) platform using shadcn/ui components.

## 🚀 Features

### Core Pages Implemented

1. **Landing Page** (`/`)
   - Hero section with C.R.E.A.M branding
   - Context engineering explanation
   - Demo video placeholder
   - Call-to-action buttons

2. **Projects Dashboard** (`/projects`)
   - Project cards with status indicators
   - Quick action buttons (view, edit, delete)
   - Empty state for new users
   - "New Project" creation flow

3. **New Project Flow** (`/projects/new`)
   - Multi-step form with progress indicator
   - Form validation using react-hook-form and zod
   - Project basics and details collection
   - Save draft functionality

4. **PRD Preview** (`/projects/[id]/prd`)
   - Markdown content display
   - Export options (Markdown, PDF, Share)
   - Refine and start over actions

5. **Tool Selection** (`/projects/[id]/tools`)
   - Tool comparison cards (Cursor, Windsurf, Claude Code)
   - Radio group selection
   - Feature highlights for each tool

6. **Files Management** (`/projects/[id]/files`)
   - File status indicators (generated, generating, edited, error)
   - File preview modals
   - Bulk actions (regenerate all, download all)
   - Individual file actions

7. **Project Complete** (`/projects/[id]/complete`)
   - Success celebration
   - Files overview dashboard
   - Next steps guide
   - Resource links

## 🛠️ Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui v4
- **Form Handling**: react-hook-form with zod validation
- **Icons**: Lucide React
- **State Management**: React useState (local state)

## 📦 shadcn/ui Components Used

### Layout & Navigation
- `NavigationMenu` - Main navigation
- `Card` - Content containers
- `ScrollArea` - Scrollable content
- `Separator` - Section dividers
- `AspectRatio` - Video/image containers

### Forms & Inputs
- `Form` - Form containers with validation
- `Input` - Text inputs
- `Textarea` - Multi-line inputs
- `Select` - Dropdown selections
- `RadioGroup` - Radio button groups
- `Checkbox` - Checkboxes
- `Switch` - Toggle switches
- `Label` - Form labels

### Feedback & Status
- `Button` - All CTAs and actions
- `Badge` - Status indicators
- `Alert` - Status messages
- `Progress` - Progress bars
- `Skeleton` - Loading states
- `Sonner` - Toast notifications

### Modals & Overlays
- `Dialog` - Modal dialogs
- `DropdownMenu` - Context menus
- `Tooltip` - Help tooltips
- `HoverCard` - Hover information

### Data Display
- `Tabs` - Tabbed interfaces
- `Table` - Data tables
- `Avatar` - User avatars
- `Calendar` - Date selection

## 🎨 Design System

The application follows a consistent design system using shadcn/ui's design tokens:

- **Colors**: Neutral base with primary accent
- **Typography**: Inter font family
- **Spacing**: Consistent 4px grid system
- **Components**: Unified styling across all UI elements

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**:
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with navigation
│   ├── page.tsx           # Landing page
│   ├── projects/          # Projects pages
│   │   ├── page.tsx       # Projects dashboard
│   │   ├── new/           # New project flow
│   │   └── [id]/          # Individual project pages
│   │       ├── prd/       # PRD preview
│   │       ├── tools/     # Tool selection
│   │       ├── files/     # Files management
│   │       └── complete/  # Project completion
├── components/
│   └── ui/                # shadcn/ui components
└── lib/
    └── utils.ts           # Utility functions
```

## 🎯 Key Features Implemented

### Form Validation
- Multi-step form with progress tracking
- Zod schema validation
- Error handling and user feedback
- Save draft functionality

### File Management
- File status tracking (generated, generating, edited, error)
- File preview modals
- Bulk operations
- Individual file actions

### Responsive Design
- Mobile-first approach
- Responsive grid layouts
- Adaptive navigation
- Touch-friendly interactions

### User Experience
- Loading states and skeletons
- Toast notifications
- Confirmation dialogs
- Intuitive navigation flow

## 🔧 Customization

### Adding New Components
1. Use shadcn/ui CLI: `npx shadcn@latest add [component-name]`
2. Components are automatically added to `src/components/ui/`

### Styling Customization
- Modify `src/app/globals.css` for global styles
- Use Tailwind classes for component-specific styling
- Leverage shadcn/ui's CSS variables for theming

### Adding New Pages
1. Create new route in `src/app/`
2. Follow the established patterns for layout and components
3. Use the same shadcn/ui components for consistency

## 🚀 Deployment

The application is ready for deployment on platforms like:
- Vercel (recommended for Next.js)
- Netlify
- Railway
- Any Node.js hosting platform

### Build for Production
```bash
npm run build
npm start
```

## 📝 Contributing

1. Follow the established component patterns
2. Use shadcn/ui components for consistency
3. Maintain responsive design principles
4. Add proper TypeScript types
5. Include proper error handling

## 🎨 Design Principles

- **Consistency**: Use shadcn/ui components throughout
- **Accessibility**: Follow WCAG guidelines
- **Performance**: Optimize for fast loading
- **User Experience**: Intuitive and responsive design
- **Maintainability**: Clean, well-documented code

## 📚 Resources

- [shadcn/ui Documentation](https://ui.shadcn.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)
