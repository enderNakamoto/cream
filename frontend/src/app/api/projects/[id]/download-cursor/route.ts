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
    
    // Read the rule templates and add them with .mdc extension
    const generateRulePath = path.join(process.cwd(), '..', 'rule_templates', 'generate.md');
    const workflowRulePath = path.join(process.cwd(), '..', 'rule_templates', 'workflow.md');
    
    console.log('Current working directory:', process.cwd());
    console.log('Generate rule path:', generateRulePath);
    console.log('Workflow rule path:', workflowRulePath);
    console.log('Generate rule exists:', fs.existsSync(generateRulePath));
    console.log('Workflow rule exists:', fs.existsSync(workflowRulePath));
    
    if (!fs.existsSync(generateRulePath)) {
      return NextResponse.json(
        { error: `Generate rule template not found at: ${generateRulePath}` },
        { status: 404 }
      );
    }
    
    if (!fs.existsSync(workflowRulePath)) {
      return NextResponse.json(
        { error: `Workflow rule template not found at: ${workflowRulePath}` },
        { status: 404 }
      );
    }
    
    const generateRuleContent = fs.readFileSync(generateRulePath, 'utf-8');
    const workflowRuleContent = fs.readFileSync(workflowRulePath, 'utf-8');
    
    // Add rule files to .cursor/rules/ directory in zip
    zip.file('.cursor/rules/generate.mdc', generateRuleContent);
    zip.file('.cursor/rules/workflow.mdc', workflowRuleContent);
    
    // Generate the zip file
    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer' });
    
    // Return the zip file as a download
    return new NextResponse(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="cursor-project-${id}.zip"`,
      },
    });

  } catch (error) {
    console.error('Error creating Cursor download:', error);
    return NextResponse.json(
      { error: 'Failed to create Cursor download package' },
      { status: 500 }
    );
  }
} 