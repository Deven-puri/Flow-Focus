import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function getWordDefinition(
  word: string,
  context: string
): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `The user is reading the following sentence and got stuck on a specific word:

Sentence: "${context}"
Stuck on: "${word}"

Provide a 1-sentence simple definition of "${word}" in the context of this sentence. Make it easy to understand for a 5th grader. Keep it under 20 words.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return text.trim();
  } catch (error) {
    console.error('Gemini API error:', error);
    return `Could not load definition for "${word}". Please try again.`;
  }
}

export async function getSummary(text: string): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Summarize this text in 2-3 simple sentences:

${text}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error('Gemini API error:', error);
    return 'Could not generate summary.';
  }
}
