import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
});

export async function POST(request: NextRequest) {
  try {
    const { interactionType, duration, location } = await request.json();

    const prompt = `Generate a concise summary for a legal rights interaction recording with the following details:
    - Interaction Type: ${interactionType.replace('_', ' ')}
    - Duration: ${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}
    - Location: ${location || 'Not specified'}
    
    Create a brief, professional summary that could be shared with legal counsel or trusted contacts. Focus on the key facts and maintain objectivity.`;

    const completion = await openai.chat.completions.create({
      model: 'google/gemini-2.0-flash-001',
      messages: [
        {
          role: 'system',
          content: 'You are a legal assistant helping to create objective summaries of police interactions for documentation purposes. Keep summaries factual, concise, and professional.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 200,
      temperature: 0.3,
    });

    const summary = completion.choices[0]?.message?.content || 
      `${interactionType.replace('_', ' ')} interaction recorded for ${Math.floor(duration / 60)}:${(duration % 60).toString().padStart(2, '0')}`;

    return NextResponse.json({ summary });
  } catch (error) {
    console.error('Error generating summary:', error);
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    );
  }
}
