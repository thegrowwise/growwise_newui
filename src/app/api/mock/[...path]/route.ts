import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { parseMockApiPath } from '../parseMockApiPath';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  try {
    const { path } = await context.params;
    const parsed = parseMockApiPath(path);
    if (!parsed.ok) {
      return NextResponse.json({ error: 'No file specified' }, { status: 400 });
    }
    const { locale, fileName } = parsed;

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
