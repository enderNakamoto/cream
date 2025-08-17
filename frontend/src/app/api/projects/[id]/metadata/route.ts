import { NextRequest, NextResponse } from 'next/server';
import { fileStorage } from '@/lib/file-storage';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id;
    const metadata = fileStorage.getProjectMetadata(projectId);
    
    if (!metadata) {
      return NextResponse.json({ error: 'Metadata not found' }, { status: 404 });
    }

    return NextResponse.json(metadata);
  } catch (error) {
    console.error('Error fetching metadata:', error);
    return NextResponse.json({ error: 'Failed to fetch metadata' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id;
    const metadata = await request.json();
    
    fileStorage.saveProjectMetadata(metadata);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating metadata:', error);
    return NextResponse.json({ error: 'Failed to update metadata' }, { status: 500 });
  }
} 