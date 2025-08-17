import { NextRequest, NextResponse } from 'next/server';
import { fileStorage } from '@/lib/file-storage';
import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Create a new zip file
    const zip = new JSZip();
    
    // Read the refined PRD and add as PRD.md
    const prdContent = await fileStorage.getRefinedPRDContent(id);
    if (!prdContent) {
      return NextResponse.json(
        { error: 'Refined PRD not found. Please complete the refinement process first.' },
        { status: 404 }
      );
    }
    zip.file('PRD.md', prdContent);
    
    // Read the workflow rule template and add it with .mdc extension
    const workflowRulePath = path.join(process.cwd(), '..', 'rule_templates', 'workflow.md');
    
    if (!fs.existsSync(workflowRulePath)) {
      return NextResponse.json(
        { error: 'Workflow rule template not found' },
        { status: 404 }
      );
    }
    
    const workflowRuleContent = fs.readFileSync(workflowRulePath, 'utf-8');
    
    // Add workflow rule to .nora/rules/ directory in zip
    zip.file('.nora/rules/workflow.mdc', workflowRuleContent);
    
    // Read all generated Nora documentation files
    const noraDocsDir = path.join(process.cwd(), 'storage', 'projects', id, 'downloads', 'nora', 'docs');
    
    if (fs.existsSync(noraDocsDir)) {
      const docFiles = fs.readdirSync(noraDocsDir);
      
      for (const filename of docFiles) {
        // Skip .DS_Store and other system files
        if (filename === '.DS_Store' || filename.startsWith('.')) {
          continue;
        }
        
        if (filename.endsWith('.md')) {
          const filePath = path.join(noraDocsDir, filename);
          const content = fs.readFileSync(filePath, 'utf-8');
          zip.file(`docs/${filename}`, content);
        }
      }
    }
    
    // Generate the zip file
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
    
    // Return the zip file as a download
    return new NextResponse(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="nora-project-${id}.zip"`,
      },
    });

  } catch (error) {
    console.error('Error creating Nora download:', error);
    return NextResponse.json(
      { error: 'Failed to create Nora download package' },
      { status: 500 }
    );
  }
} 