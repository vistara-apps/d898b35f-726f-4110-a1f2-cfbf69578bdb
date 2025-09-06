import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_RIGHTS_CARDS, STATE_SPECIFIC_VARIATIONS } from '@/lib/constants';
import { validateApiRequest, GenerateCardRequestSchema } from '@/lib/validation';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const state = searchParams.get('state') || 'General';
    const interactionType = searchParams.get('interactionType') || 'traffic_stop';
    const language = searchParams.get('language') || 'en';

    // Get base rights card
    const baseCard = DEFAULT_RIGHTS_CARDS[interactionType as keyof typeof DEFAULT_RIGHTS_CARDS];
    
    if (!baseCard) {
      return NextResponse.json(
        { error: 'Invalid interaction type' },
        { status: 400 }
      );
    }

    // Apply state-specific variations if available
    let rightsCard = { ...baseCard };
    
    if (state !== 'General') {
      const stateVariations = STATE_SPECIFIC_VARIATIONS[state as keyof typeof STATE_SPECIFIC_VARIATIONS];
      
      if (stateVariations?.[interactionType as keyof typeof stateVariations]) {
        const variations = stateVariations[interactionType as keyof typeof stateVariations];
        
        rightsCard = {
          ...baseCard,
          content: {
            ...baseCard.content,
            keyRights: [
              ...baseCard.content.keyRights,
              ...(variations.additionalRights || [])
            ],
            dos: [
              ...baseCard.content.dos,
              ...(variations.additionalDos || [])
            ]
          }
        };
      }
    }

    // Create full rights card object
    const fullCard = {
      cardId: `${interactionType}-${state}-${language}`,
      state,
      interactionType,
      language,
      ...rightsCard
    };

    return NextResponse.json({ card: fullCard });
  } catch (error) {
    console.error('Error fetching rights card:', error);
    return NextResponse.json(
      { error: 'Failed to fetch rights card' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validation = validateApiRequest(GenerateCardRequestSchema, body);
    
    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    const { interactionType, state, context } = validation.data;

    // This would typically generate a custom rights card based on specific context
    // For now, we'll return the standard card with state variations
    const baseCard = DEFAULT_RIGHTS_CARDS[interactionType as keyof typeof DEFAULT_RIGHTS_CARDS];
    
    if (!baseCard) {
      return NextResponse.json(
        { error: 'Invalid interaction type' },
        { status: 400 }
      );
    }

    let rightsCard = { ...baseCard };
    
    if (state !== 'General') {
      const stateVariations = STATE_SPECIFIC_VARIATIONS[state as keyof typeof STATE_SPECIFIC_VARIATIONS];
      
      if (stateVariations?.[interactionType as keyof typeof stateVariations]) {
        const variations = stateVariations[interactionType as keyof typeof stateVariations];
        
        rightsCard = {
          ...baseCard,
          content: {
            ...baseCard.content,
            keyRights: [
              ...baseCard.content.keyRights,
              ...(variations.additionalRights || [])
            ],
            dos: [
              ...baseCard.content.dos,
              ...(variations.additionalDos || [])
            ]
          }
        };
      }
    }

    const fullCard = {
      cardId: `${interactionType}-${state}-custom`,
      state,
      interactionType,
      language: 'en',
      context,
      ...rightsCard
    };

    return NextResponse.json({ card: fullCard });
  } catch (error) {
    console.error('Error creating custom rights card:', error);
    return NextResponse.json(
      { error: 'Failed to create custom rights card' },
      { status: 500 }
    );
  }
}
