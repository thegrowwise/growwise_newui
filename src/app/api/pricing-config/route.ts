import { NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET() {
  try {
    const filePath = join(
      process.cwd(),
      'public',
      'api',
      'mock',
      'en',
      'pricing-config.json',
    );
    const data = await readFile(filePath, 'utf8');
    const jsonData = JSON.parse(data);

    return NextResponse.json({
      success: true,
      data: jsonData,
    });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Failed to load pricing config' },
      { status: 500 },
    );
  }
}
