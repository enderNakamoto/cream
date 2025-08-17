import { NextRequest, NextResponse } from 'next/server';
import { fileStorage } from '@/lib/file-storage';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const content = fileStorage.getRefinedPRDContent(id);

    return NextResponse.json({ content });
  } catch (error) {
    console.error('Error fetching refined PRD:', error);
    return NextResponse.json(
      { error: 'Failed to fetch refined PRD' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { content } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    fileStorage.saveRefinedPRDContent(id, content);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving refined PRD:', error);
    return NextResponse.json(
      { error: 'Failed to save refined PRD' },
      { status: 500 }
    );
  }
} 