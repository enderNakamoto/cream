import { NextRequest, NextResponse } from 'next/server';
import { fileStorage } from '@/lib/file-storage';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id;
    const answers = fileStorage.getProjectAnswers(projectId);
    
    if (!answers) {
      return NextResponse.json({ error: 'Answers not found' }, { status: 404 });
    }

    return NextResponse.json(answers);
  } catch (error) {
    console.error('Error fetching answers:', error);
    return NextResponse.json({ error: 'Failed to fetch answers' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id;
    const answers = await request.json();
    
    fileStorage.saveProjectAnswers(answers);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating answers:', error);
    return NextResponse.json({ error: 'Failed to update answers' }, { status: 500 });
  }
} 