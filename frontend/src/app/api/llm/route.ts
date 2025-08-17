import { NextRequest, NextResponse } from 'next/server';

interface LLMRequest {
  systemPrompt: string;
  userPrompt: string;
  options?: {
    model?: string;
    temperature?: number;
    maxTokens?: number;
  };
}

interface LLMResponse {
  content?: string;
  error?: string;
}

export async function POST(request: NextRequest): Promise<NextResponse<LLMResponse>> {
  try {
    const body: LLMRequest = await request.json();
    const { systemPrompt, userPrompt, options = {} } = body;

    // Validate required fields
    if (!systemPrompt || !userPrompt) {
      return NextResponse.json(
        { error: 'Missing required fields: systemPrompt and userPrompt' },
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

    // Prepare OpenAI request
    const model = options.model || process.env.OPENAI_MODEL || 'gpt-4o';
    const temperature = options.temperature || parseFloat(process.env.OPENAI_TEMPERATURE || '0.7');
    const maxTokens = options.maxTokens || parseInt(process.env.OPENAI_MAX_TOKENS || '2000');

    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature,
        max_tokens: maxTokens,
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

    return NextResponse.json({ content });

  } catch (error) {
    console.error('LLM API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 