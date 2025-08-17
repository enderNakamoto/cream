import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

interface RefinementAnswer {
  questionId: number;
  answer: string;
  skipped: boolean;
  timestamp: string;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;
    const { answers } = await request.json();

    if (!Array.isArray(answers)) {
      return NextResponse.json(
        { error: 'Invalid answers format' },
        { status: 400 }
      );
    }

    // Load existing refinements
    const refinementsPath = path.join(process.cwd(), '..', 'storage', 'projects', projectId, 'refinements.json');
    
    let refinementsData;
    try {
      const existingData = await fs.readFile(refinementsPath, 'utf-8');
      refinementsData = JSON.parse(existingData);
    } catch (error) {
      return NextResponse.json(
        { error: 'Refinements file not found' },
        { status: 404 }
      );
    }

    // Update answers
    refinementsData.answers = answers;
    refinementsData.updatedAt = new Date().toISOString();

    // Save updated refinements
    await fs.writeFile(refinementsPath, JSON.stringify(refinementsData, null, 2));

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Save refinements error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: projectId } = await params;
    
    // Load refinements
    const refinementsPath = path.join(process.cwd(), '..', 'storage', 'projects', projectId, 'refinements.json');
    
    try {
      const refinementsData = await fs.readFile(refinementsPath, 'utf-8');
      return NextResponse.json(JSON.parse(refinementsData));
    } catch (error) {
      return NextResponse.json(
        { error: 'Refinements not found' },
        { status: 404 }
      );
    }

  } catch (error) {
    console.error('Get refinements error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 