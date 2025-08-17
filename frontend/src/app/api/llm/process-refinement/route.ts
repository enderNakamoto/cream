import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

interface ProcessRefinementRequest {
  projectId: string;
}

interface ProcessRefinementResponse {
  success: boolean;
  refinedPRD?: string;
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<ProcessRefinementResponse>> {
  try {
    const { projectId }: ProcessRefinementRequest = await request.json();

    if (!projectId) {
      return NextResponse.json(
        { success: false, error: 'Project ID is required' },
        { status: 400 }
      );
    }

    // Read the original PRD
    const prdPath = path.join(process.cwd(), '..', 'storage', 'projects', projectId, 'prd.md');
    const prdContent = await fs.readFile(prdPath, 'utf-8');

    // Read the refinement answers
    const refinementsPath = path.join(process.cwd(), '..', 'storage', 'projects', projectId, 'refinements.json');
    const refinementsContent = await fs.readFile(refinementsPath, 'utf-8');
    const refinements = JSON.parse(refinementsContent);

    // Read the system prompt
    const promptPath = path.join(process.cwd(), '..', 'prompts', 'process-refinement.md');
    const systemPrompt = await fs.readFile(promptPath, 'utf-8');

    // Prepare user prompt with PRD and refinement answers
    const userPrompt = `Original PRD:
${prdContent}

Refinement Answers:
${refinements.answers.map((answer: any) => `Question ${answer.questionId}: ${answer.question}
Answer: ${answer.skipped ? '[SKIPPED]' : answer.answer}`).join('\n\n')}

Please refine the PRD based on these answers.`;

    // Call OpenAI API
    const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
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
            content: systemPrompt,
          },
          {
            role: 'user',
            content: userPrompt,
          },
        ],
        temperature: 0.3,
        max_tokens: 4000,
      }),
    });

    if (!openaiResponse.ok) {
      const error = await openaiResponse.json();
      throw new Error(`OpenAI API error: ${JSON.stringify(error)}`);
    }

    const openaiData = await openaiResponse.json();
    const refinedPRD = openaiData.choices[0].message.content;

    // Save the refined PRD
    const refinedPrdPath = path.join(process.cwd(), '..', 'storage', 'projects', projectId, 'prd-refined.md');
    await fs.writeFile(refinedPrdPath, refinedPRD, 'utf-8');

    return NextResponse.json({
      success: true,
      refinedPRD,
    });

  } catch (error) {
    console.error('Process refinement error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      },
      { status: 500 }
    );
  }
} 