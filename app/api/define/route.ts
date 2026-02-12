import { NextRequest, NextResponse } from 'next/server';
import { getWordDefinition } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { word, context } = body;

    if (!word) {
      return NextResponse.json(
        { error: 'Word is required' },
        { status: 400 }
      );
    }

    const definition = await getWordDefinition(
      word,
      context || `The user is trying to understand the word "${word}".`
    );

    return NextResponse.json({ definition });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate definition' },
      { status: 500 }
    );
  }
}
