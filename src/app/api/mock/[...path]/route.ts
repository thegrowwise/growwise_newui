import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { path: string[] } }
) {
  try {
    const { path } = await params;
    
    if (path.length === 0) {
      return NextResponse.json({ error: 'No file specified' }, { status: 400 });
    }
    
    // Handle both patterns:
    // /api/mock/en/english-courses (locale-specific)
    // /api/mock/english-courses (fallback to English)
    
    let locale = 'en'; // default
    let fileName = path[path.length - 1]; // last segment is always the file
    
    // If we have 2 segments, first is locale, second is file
    if (path.length === 2) {
      locale = path[0];
      fileName = path[1];
    }
    
    // Handle both with and without .json extension
    const finalFileName = fileName.endsWith('.json') ? fileName : `${fileName}.json`;
    const filePath = join(process.cwd(), 'public', 'api', 'mock', locale, finalFileName);
    
    const data = await readFile(filePath, 'utf8');
    const jsonData = JSON.parse(data);
    
    return NextResponse.json(jsonData);
  } catch (error) {
    console.error('Error reading mock file:', error);
    return NextResponse.json(
      { error: 'File not found' },
      { status: 404 }
    );
  }
}
