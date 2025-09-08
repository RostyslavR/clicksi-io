import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (!type || (type !== 'html' && type !== 'text')) {
      return NextResponse.json(
        { error: 'Invalid type parameter. Must be "html" or "text"' },
        { status: 400 }
      );
    }

    const filePath = type === 'html' 
      ? 'E:\\tmp\\privacy.html'
      : 'E:\\tmp\\privacy.txt';

    try {
      const content = await fs.readFile(filePath, 'utf-8');
      return new NextResponse(content, {
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
        },
      });
    } catch (fileError) {
      console.error(`Error reading ${type} file:`, fileError);
      return NextResponse.json(
        { error: `Failed to read ${type} file` },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Error in privacy load API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}