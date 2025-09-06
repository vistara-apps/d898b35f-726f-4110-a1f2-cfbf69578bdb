import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Initialize OpenAI client only if API key is available
let openai: OpenAI | null = null;

if (process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY || process.env.OPENAI_API_KEY,
    baseURL: process.env.OPENROUTER_API_KEY ? "https://openrouter.ai/api/v1" : undefined,
    dangerouslyAllowBrowser: true,
  });
}

export async function POST(request: NextRequest) {
  try {
    if (!openai) {
      return NextResponse.json(
        { error: 'AI service not configured. Please set OPENAI_API_KEY or OPENROUTER_API_KEY environment variable.' },
        { status: 503 }
      );
    }

    const { interactionType, state, context } = await request.json();

    const prompt = `Create a shareable legal rights card for the following scenario:
    - Interaction Type: ${interactionType}
    - State: ${state}
    - Context: ${context || 'General interaction'}
    
    Generate a JSON response with:
    - title: Brief, clear title
    - summary: 2-3 sentence summary of key rights
    - keyPoints: Array of 3-4 most important points
    - shareableText: Social media friendly text (under 280 characters)
    
    Focus on practical, actionable information that empowers individuals during police interactions.`;

    const completion = await openai.chat.completions.create({
      model: 'google/gemini-2.0-flash-001',
      messages: [
        {
          role: 'system',
          content: 'You are a legal rights educator creating accessible, accurate information about civil rights during police interactions. Always emphasize de-escalation and legal compliance while informing about constitutional rights.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 400,
      temperature: 0.3,
    });

    const content = completion.choices[0]?.message?.content;
    
    try {
      const parsedContent = JSON.parse(content || '{}');
      return NextResponse.json(parsedContent);
    } catch (parseError) {
      // Fallback if JSON parsing fails
      return NextResponse.json({
        title: `${interactionType.replace('_', ' ')} Rights`,
        summary: 'Know your rights during police interactions. Stay calm, be respectful, and remember you have constitutional protections.',
        keyPoints: [
          'You have the right to remain silent',
          'You can refuse consent to searches',
          'You can ask if you are being detained',
          'You have the right to record interactions'
        ],
        shareableText: `Know your rights during ${interactionType.replace('_', ' ')} interactions. Stay informed, stay safe. #KnowYourRights #CivilRights`
      });
    }
  } catch (error) {
    console.error('Error generating card:', error);
    return NextResponse.json(
      { error: 'Failed to generate card' },
      { status: 500 }
    );
  }
}
