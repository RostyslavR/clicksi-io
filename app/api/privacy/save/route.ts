import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const { htmlContent, textContent } = await request.json();

    if (typeof htmlContent !== 'string' || typeof textContent !== 'string') {
      return NextResponse.json(
        { error: 'Both htmlContent and textContent must be provided as strings' },
        { status: 400 }
      );
    }

    const htmlFilePath = 'E:\\tmp\\privacy.html';
    const textFilePath = 'E:\\tmp\\privacy.txt';

    try {
      // Save both files concurrently
      await Promise.all([
        fs.writeFile(htmlFilePath, htmlContent, 'utf-8'),
        fs.writeFile(textFilePath, textContent, 'utf-8')
      ]);

      return NextResponse.json({
        success: true,
        message: 'Privacy policy files updated successfully',
        timestamp: new Date().toISOString()
      });
    } catch (fileError) {
      console.error('Error writing files:', fileError);
      return NextResponse.json(
        { error: 'Failed to save privacy policy files' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error in privacy save API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}