import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
});

export async function generateRightsSummary(
  interactionType: string,
  duration: number,
  location?: string
): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'google/gemini-2.0-flash-001',
      messages: [
        {
          role: 'system',
          content: 'You are a legal rights assistant. Generate concise, accurate summaries of legal rights and interactions. Focus on practical, actionable information.'
        },
        {
          role: 'user',
          content: `Generate a summary for a ${interactionType} interaction that lasted ${duration} seconds${location ? ` at location ${location}` : ''}. Include key rights exercised and important details to remember.`
        }
      ],
      max_tokens: 200,
      temperature: 0.3
    });

    return completion.choices[0]?.message?.content || 'Summary generation failed';
  } catch (error) {
    console.error('AI summary generation error:', error);
    return 'Unable to generate summary at this time';
  }
}

export async function generateShareableCard(
  interactionType: string,
  summary: string,
  keyRights: string[]
): Promise<string> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'google/gemini-2.0-flash-001',
      messages: [
        {
          role: 'system',
          content: 'Create shareable social media content about legal rights. Keep it concise, informative, and empowering.'
        },
        {
          role: 'user',
          content: `Create a shareable card for a ${interactionType}. Summary: ${summary}. Key rights: ${keyRights.join(', ')}. Make it educational and empowering.`
        }
      ],
      max_tokens: 150,
      temperature: 0.4
    });

    return completion.choices[0]?.message?.content || 'Card generation failed';
  } catch (error) {
    console.error('AI card generation error:', error);
    return 'Unable to generate shareable card at this time';
  }
}
