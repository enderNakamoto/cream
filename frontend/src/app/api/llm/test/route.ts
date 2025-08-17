import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Get API key from environment
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured. Please add OPENAI_API_KEY to your .env.local file.' },
        { status: 500 }
      );
    }

    // Simple test prompt
    const testPrompt = "Say 'Hello from OpenAI API!' in a creative way.";

    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'user', content: testPrompt }
        ],
        temperature: 0.7,
        max_tokens: 100,
      }),
    });

    if (!openAIResponse.ok) {
      const errorData = await openAIResponse.json();
      console.error('OpenAI API error:', errorData);
      return NextResponse.json(
        { 
          error: `OpenAI API error: ${errorData.error?.message || 'Unknown error'}`,
          status: openAIResponse.status 
        },
        { status: 500 }
      );
    }

    const data = await openAIResponse.json();
    const content = data.choices[0]?.message?.content;

    return NextResponse.json({ 
      success: true,
      message: content,
      model: data.model,
      usage: data.usage
    });

  } catch (error) {
    console.error('Test API error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 