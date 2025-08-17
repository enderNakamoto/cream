import { NextRequest, NextResponse } from 'next/server';
import { fileStorage } from '@/lib/file-storage';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id;
    const prdContent = fileStorage.getPRDContent(projectId);
    
    return NextResponse.json({ content: prdContent });
  } catch (error) {
    console.error('Error fetching PRD content:', error);
    return NextResponse.json({ error: 'Failed to fetch PRD content' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id;
    const { content } = await request.json();
    
    if (typeof content !== 'string') {
      return NextResponse.json({ error: 'Content must be a string' }, { status: 400 });
    }
    
    fileStorage.savePRDContent(projectId, content);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating PRD content:', error);
    return NextResponse.json({ error: 'Failed to update PRD content' }, { status: 500 });
  }
} 