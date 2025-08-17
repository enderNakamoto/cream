import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

interface RefinementQuestion {
  id: number;
  question: string;
  category: 'technical' | 'ux' | 'security' | 'market' | 'resources';
  priority: 'high' | 'medium' | 'low';
}

interface RefinementResponse {
  questions?: RefinementQuestion[];
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<RefinementResponse>> {
  try {
    const { projectId } = await request.json();

    if (!projectId) {
      return NextResponse.json(
        { error: 'Missing projectId' },
        { status: 400 }
      );
    }

    // Get API key from environment
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    // Load PRD content from file
    const prdPath = path.join(process.cwd(), '..', 'storage', 'projects', projectId, 'prd.md');
    let prdContent: string;
    
    try {
      prdContent = await fs.readFile(prdPath, 'utf-8');
    } catch (error) {
      return NextResponse.json(
        { error: 'PRD file not found' },
        { status: 404 }
      );
    }

    // Load refinement prompt
    const promptPath = path.join(process.cwd(), '..', 'prompts', 'refinement-prompt.md');
    let systemPrompt: string;
    
    try {
      systemPrompt = await fs.readFile(promptPath, 'utf-8');
    } catch (error) {
      return NextResponse.json(
        { error: 'Refinement prompt not found' },
        { status: 500 }
      );
    }

    // Create user prompt with PRD content
    const userPrompt = `Please analyze the following PRD and generate 10 refinement questions:

${prdContent}

Generate exactly 10 questions in JSON format as specified in the system prompt.`;

    // Call OpenAI API
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!openAIResponse.ok) {
      const errorData = await openAIResponse.json();
      console.error('OpenAI API error:', errorData);
      return NextResponse.json(
        { error: `OpenAI API error: ${errorData.error?.message || 'Unknown error'}` },
        { status: openAIResponse.status }
      );
    }

    const data = await openAIResponse.json();
    const content = data.choices[0]?.message?.content;

    if (!content) {
      return NextResponse.json(
        { error: 'No content received from OpenAI' },
        { status: 500 }
      );
    }

    // Parse JSON response
    let questions: RefinementQuestion[];
    try {
      // Extract JSON from the response (in case there's extra text)
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      if (!jsonMatch) {
        throw new Error('No JSON array found in response');
      }
      questions = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', content);
      return NextResponse.json(
        { error: 'Failed to parse refinement questions' },
        { status: 500 }
      );
    }

    // Validate questions structure
    if (!Array.isArray(questions) || questions.length !== 10) {
      return NextResponse.json(
        { error: 'Invalid questions format - expected 10 questions' },
        { status: 500 }
      );
    }

    // Save questions to refinements.json
    const refinementsPath = path.join(process.cwd(), '..', 'storage', 'projects', projectId, 'refinements.json');
    const refinementsData = {
      projectId,
      questions,
      generatedAt: new Date().toISOString(),
      answers: []
    };

    try {
      await fs.writeFile(refinementsPath, JSON.stringify(refinementsData, null, 2));
      
      // Update metadata to mark questions as generated
      const metadataPath = path.join(process.cwd(), '..', 'storage', 'projects', projectId, 'metadata.json');
      try {
        const metadataContent = await fs.readFile(metadataPath, 'utf-8');
        const metadata = JSON.parse(metadataContent);
        metadata.refinementQuestionsGenerated = true;
        metadata.refinementQuestionsGeneratedAt = new Date().toISOString();
        await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2));
      } catch (metadataError) {
        console.error('Failed to update metadata:', metadataError);
        // Continue anyway - questions are still returned
      }
    } catch (error) {
      console.error('Failed to save refinements:', error);
      // Continue anyway - questions are still returned
    }

    return NextResponse.json({ questions });

  } catch (error) {
    console.error('PRD refinement error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 