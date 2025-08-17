import { NextRequest, NextResponse } from 'next/server';
import { fileStorage } from '@/lib/file-storage';
import fs from 'fs';
import path from 'path';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; filename: string }> }
) {
  try {
    const { id, filename } = await params;
    const { ide } = await request.json();
    
    console.log('Generating doc file:', { id, filename, ide });
    
    // Validate IDE
    if (ide !== 'nora') {
      return NextResponse.json(
        { error: 'Only Nora IDE is supported for documentation generation' },
        { status: 400 }
      );
    }
    
    // Read the system prompt
    const promptPath = path.join(process.cwd(), '..', 'prompts', 'generate-docs.md');
    const systemPrompt = fs.readFileSync(promptPath, 'utf-8');
    
    // Read the refined PRD
    const prdContent = await fileStorage.getRefinedPRDContent(id);
    console.log('PRD content length:', prdContent?.length || 0);
    if (!prdContent) {
      return NextResponse.json(
        { error: 'Refined PRD not found. Please complete the refinement process first.' },
        { status: 404 }
      );
    }
    
    // Read project answers for additional context
    const answers = await fileStorage.getProjectAnswers(id);
    
    // Prepare the context for the LLM
    const context = `
PRD Content:
${prdContent}

Project Answers:
${JSON.stringify(answers, null, 2)}

Please generate the ${filename} file for Nora IDE based on the above PRD and project context.
`;

    console.log('Calling OpenAI API...');
    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: context
          }
        ],
        temperature: 0.7,
        max_tokens: 4000
      })
    });

    console.log('OpenAI response status:', response.status);
    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to generate content from OpenAI API' },
        { status: 500 }
      );
    }

    const data = await response.json();
    const generatedContent = data.choices[0].message.content;

    // Create the nora/docs directory structure
    const docsDir = path.join(process.cwd(), 'storage', 'projects', id, 'downloads', 'nora', 'docs');
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true });
    }

    // Save the generated file
    const filePath = path.join(docsDir, filename);
    fs.writeFileSync(filePath, generatedContent);

    // Update metadata to track generated files for Nora
    const metadata = await fileStorage.getProjectMetadata(id);
    if (metadata) {
      const noraGeneratedFiles = metadata.noraGeneratedFiles || [];
      if (!noraGeneratedFiles.includes(filename)) {
        noraGeneratedFiles.push(filename);
      }
      await fileStorage.saveProjectMetadata({
        ...metadata,
        noraGeneratedFiles,
        lastGeneratedFile: filename,
        lastGeneratedAt: new Date().toISOString()
      });
    }

    return NextResponse.json({ 
      success: true, 
      content: generatedContent,
      filename,
      ide: 'nora'
    });

  } catch (error) {
    console.error('Error generating docs:', error);
    return NextResponse.json(
      { error: 'Failed to generate documentation file' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; filename: string }> }
) {
  try {
    const { id, filename } = await params;
    const { searchParams } = new URL(request.url);
    const ide = searchParams.get('ide');
    
    if (!ide || ide !== 'nora') {
      return NextResponse.json(
        { error: 'IDE parameter is required and must be "nora"' },
        { status: 400 }
      );
    }
    
    const docsDir = path.join(process.cwd(), 'storage', 'projects', id, 'downloads', 'nora', 'docs');
    const filePath = path.join(docsDir, filename);
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }
    
    const content = fs.readFileSync(filePath, 'utf-8');
    return NextResponse.json({ content, filename, ide });

  } catch (error) {
    console.error('Error reading file:', error);
    return NextResponse.json(
      { error: 'Failed to read file' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; filename: string }> }
) {
  try {
    const { id, filename } = await params;
    const { content, ide } = await request.json();
    
    if (!ide || ide !== 'nora') {
      return NextResponse.json(
        { error: 'IDE parameter is required and must be "nora"' },
        { status: 400 }
      );
    }
    
    const docsDir = path.join(process.cwd(), 'storage', 'projects', id, 'downloads', 'nora', 'docs');
    const filePath = path.join(docsDir, filename);
    
    // Ensure directory exists
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true });
    }
    
    // Save the updated content
    fs.writeFileSync(filePath, content);
    
    return NextResponse.json({ 
      success: true, 
      filename,
      ide,
      message: 'File updated successfully' 
    });

  } catch (error) {
    console.error('Error updating file:', error);
    return NextResponse.json(
      { error: 'Failed to update file' },
      { status: 500 }
    );
  }
} 