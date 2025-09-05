import OpenAI from 'openai';
import { DEFAULT_RIGHTS_CARDS, SPANISH_RIGHTS_CARDS } from './constants';

const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
  baseURL: "https://openrouter.ai/api/v1",
  dangerouslyAllowBrowser: true,
});

export async function generateRightsSummary(
  interactionType: string,
  duration: number,
  location?: string,
  language: string = 'en'
): Promise<string> {
  try {
    const isSpanish = language === 'es';
    const durationText = isSpanish 
      ? `${Math.floor(duration / 60)} minutos y ${duration % 60} segundos`
      : `${Math.floor(duration / 60)} minutes and ${duration % 60} seconds`;

    const systemMessage = isSpanish
      ? 'Eres un asistente útil de derechos legales. Proporciona información clara y precisa sobre los derechos constitucionales durante las interacciones policiales. Siempre recuerda a los usuarios consultar con abogados calificados para asesoramiento legal específico.'
      : 'You are a helpful legal rights assistant. Provide clear, accurate information about constitutional rights during police interactions. Always remind users to consult with qualified attorneys for specific legal advice.';

    const userMessage = isSpanish
      ? `Genera un resumen breve y útil para una interacción de ${interactionType.replace('_', ' ')} que duró ${durationText}${location ? ` en ${location}` : ''}. 

Enfócate en:
- Derechos clave que fueron relevantes
- Cosas importantes para recordar en futuras interacciones
- Cualquier consejo específico para este tipo de situación

Manténlo bajo 100 palabras y hazlo práctico.`
      : `Generate a brief, helpful summary for a ${interactionType.replace('_', ' ')} interaction that lasted ${durationText}${location ? ` in ${location}` : ''}. 

Focus on:
- Key rights that were relevant
- Important things to remember for future interactions
- Any specific advice for this type of situation

Keep it under 100 words and make it actionable.`;

    const completion = await openai.chat.completions.create({
      model: 'google/gemini-2.0-flash-001',
      messages: [
        {
          role: 'system',
          content: systemMessage
        },
        {
          role: 'user',
          content: userMessage
        }
      ],
      max_tokens: 200,
      temperature: 0.3
    });

    return completion.choices[0]?.message?.content || (isSpanish 
      ? 'No se pudo generar el resumen' 
      : 'Summary generation failed');
  } catch (error) {
    console.error('AI summary generation error:', error);
    return language === 'es'
      ? 'No se puede generar el resumen en este momento. Por favor consulta tu tarjeta de derechos para orientación.'
      : 'Unable to generate summary at this time. Please consult your rights card for guidance.';
  }
}

export async function generateShareableCard(
  interactionType: string,
  summary: string,
  keyRights: string[],
  language: string = 'en',
  state?: string
): Promise<string> {
  try {
    const isSpanish = language === 'es';
    const stateText = state ? ` in ${state}` : '';

    const systemMessage = isSpanish
      ? 'Crea contenido compartible para redes sociales sobre derechos legales. Manténlo conciso, informativo y empoderador.'
      : 'Create shareable social media content about legal rights. Keep it concise, informative, and empowering.';

    const userMessage = isSpanish
      ? `Crea una tarjeta compartible para ${interactionType.replace('_', ' ')}${stateText}. Resumen: ${summary}. Derechos clave: ${keyRights.join(', ')}. Hazlo educativo y empoderador. Incluye hashtags relevantes.`
      : `Create a shareable card for ${interactionType.replace('_', ' ')}${stateText}. Summary: ${summary}. Key rights: ${keyRights.join(', ')}. Make it educational and empowering. Include relevant hashtags.`;

    const completion = await openai.chat.completions.create({
      model: 'google/gemini-2.0-flash-001',
      messages: [
        {
          role: 'system',
          content: systemMessage
        },
        {
          role: 'user',
          content: userMessage
        }
      ],
      max_tokens: 200,
      temperature: 0.4
    });

    return completion.choices[0]?.message?.content || (isSpanish
      ? 'No se pudo generar la tarjeta'
      : 'Card generation failed');
  } catch (error) {
    console.error('AI card generation error:', error);
    return language === 'es'
      ? 'Conoce tus derechos durante las interacciones policiales. Mantén la calma, permanece en silencio y pide un abogado. #ConoceTusDerechos #DerechosCiviles'
      : 'Know your rights during police interactions. Stay calm, remain silent, and ask for a lawyer. #KnowYourRights #CivilRights';
  }
}

export async function generateCustomRightsCard(
  interactionType: string,
  state: string,
  language: string = 'en'
): Promise<any> {
  try {
    const isSpanish = language === 'es';
    
    const systemMessage = isSpanish
      ? 'Eres un experto en derechos constitucionales y leyes estatales. Proporciona información precisa y específica del estado sobre derechos durante interacciones policiales.'
      : 'You are an expert in constitutional rights and state laws. Provide accurate, state-specific information about rights during police interactions.';

    const userMessage = isSpanish
      ? `Genera una tarjeta de derechos personalizada para ${interactionType.replace('_', ' ')} en el estado de ${state}. 

Incluye:
- 4-6 cosas que SÍ hacer
- 4-6 cosas que NO hacer
- 4-6 derechos clave específicos del estado
- 3-5 frases útiles para usar
- 3-5 respuestas apropiadas

Hazlo específico para las leyes de ${state} cuando sea posible.`
      : `Generate a custom rights card for ${interactionType.replace('_', ' ')} in ${state}. 

Include:
- 4-6 things to DO
- 4-6 things NOT to do
- 4-6 key state-specific rights
- 3-5 useful phrases to use
- 3-5 appropriate responses

Make it specific to ${state} laws when possible.`;

    const completion = await openai.chat.completions.create({
      model: 'google/gemini-2.0-flash-001',
      messages: [
        {
          role: 'system',
          content: systemMessage
        },
        {
          role: 'user',
          content: userMessage
        }
      ],
      max_tokens: 500,
      temperature: 0.3
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('No content generated');
    }

    // Parse the AI response into structured data
    return parseAIRightsCard(content, interactionType, state, language);
  } catch (error) {
    console.error('Error generating custom rights card:', error);
    // Fallback to default cards
    const cards = isSpanish ? SPANISH_RIGHTS_CARDS : DEFAULT_RIGHTS_CARDS;
    return cards[interactionType as keyof typeof cards] || cards.traffic_stop;
  }
}

function parseAIRightsCard(content: string, interactionType: string, state: string, language: string): any {
  // Simple parsing logic - in production you might want to use more sophisticated parsing
  const lines = content.split('\n').filter(line => line.trim());
  
  const dos: string[] = [];
  const donts: string[] = [];
  const keyRights: string[] = [];
  const phrases: string[] = [];
  const responses: string[] = [];
  
  let currentSection = '';
  
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.toLowerCase().includes('do:') || trimmed.toLowerCase().includes('things to do')) {
      currentSection = 'dos';
    } else if (trimmed.toLowerCase().includes('don\'t') || trimmed.toLowerCase().includes('not to do')) {
      currentSection = 'donts';
    } else if (trimmed.toLowerCase().includes('rights') || trimmed.toLowerCase().includes('derechos')) {
      currentSection = 'rights';
    } else if (trimmed.toLowerCase().includes('phrases') || trimmed.toLowerCase().includes('frases')) {
      currentSection = 'phrases';
    } else if (trimmed.toLowerCase().includes('responses') || trimmed.toLowerCase().includes('respuestas')) {
      currentSection = 'responses';
    } else if (trimmed.startsWith('-') || trimmed.startsWith('•') || /^\d+\./.test(trimmed)) {
      const cleanLine = trimmed.replace(/^[-•\d.]\s*/, '');
      switch (currentSection) {
        case 'dos':
          dos.push(cleanLine);
          break;
        case 'donts':
          donts.push(cleanLine);
          break;
        case 'rights':
          keyRights.push(cleanLine);
          break;
        case 'phrases':
          phrases.push(cleanLine);
          break;
        case 'responses':
          responses.push(cleanLine);
          break;
      }
    }
  }
  
  return {
    title: `${interactionType.replace('_', ' ')} Rights - ${state}`,
    content: {
      dos: dos.length > 0 ? dos : ['Keep your hands visible', 'Remain calm and polite'],
      donts: donts.length > 0 ? donts : ['Don\'t resist', 'Don\'t argue'],
      keyRights: keyRights.length > 0 ? keyRights : ['Right to remain silent', 'Right to an attorney']
    },
    script: {
      phrases: phrases.length > 0 ? phrases : ['I am exercising my right to remain silent'],
      responses: responses.length > 0 ? responses : ['I understand, officer']
    }
  };
}

export async function translateText(text: string, targetLanguage: string): Promise<string> {
  if (targetLanguage === 'en') return text;
  
  try {
    const prompt = `Translate the following text to ${targetLanguage === 'es' ? 'Spanish' : targetLanguage}. Keep the meaning accurate and appropriate for legal/rights context:

"${text}"`;

    const completion = await openai.chat.completions.create({
      model: 'google/gemini-2.0-flash-001',
      messages: [
        {
          role: 'system',
          content: 'You are a professional translator specializing in legal and rights-related content. Provide accurate translations that preserve the legal meaning.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: 200,
      temperature: 0.3
    });

    return completion.choices[0]?.message?.content || text;
  } catch (error) {
    console.error('Error translating text:', error);
    return text;
  }
}
