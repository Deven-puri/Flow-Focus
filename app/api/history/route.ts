import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getWordDefinition } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { word, context, sessionId } = body;

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

    // Store in database
    const { error: insertError } = await supabase.from('word_lookups').insert({
      user_id: user.id,
      session_id: sessionId || null,
      word: word.trim(),
      context: context || null,
      definition,
    });

    if (insertError) {
      console.error('Error storing lookup:', insertError);
    }

    return NextResponse.json({ definition });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate definition' },
      { status: 500 }
    );
  }
}
