export const INTERACTION_TYPES = {
  TRAFFIC_STOP: 'traffic_stop',
  QUESTIONING: 'questioning',
  HOME_SEARCH: 'home_search',
  OTHER: 'other',
} as const;

export const LANGUAGES = {
  EN: 'en',
  ES: 'es',
} as const;

export const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

export const SAMPLE_RIGHTS_CARDS = [
  {
    cardId: '1',
    state: 'CA',
    interactionType: 'traffic_stop',
    title: 'Traffic Stop Rights',
    content: {
      dos: [
        'Keep your hands visible',
        'Provide license, registration, and insurance when asked',
        'Remain calm and polite',
        'Ask if you are free to leave'
      ],
      donts: [
        'Don\'t reach for anything without permission',
        'Don\'t argue or resist',
        'Don\'t consent to searches',
        'Don\'t answer questions beyond identification'
      ],
      keyRights: [
        'You have the right to remain silent',
        'You can refuse consent to search your vehicle',
        'You can ask if you are being detained',
        'You have the right to record the interaction'
      ]
    },
    script: {
      en: [
        'Am I free to leave?',
        'I do not consent to any searches.',
        'I am exercising my right to remain silent.',
        'I would like to speak to a lawyer.'
      ],
      es: [
        '¿Soy libre de irme?',
        'No consiento a ningún registro.',
        'Estoy ejerciendo mi derecho a permanecer en silencio.',
        'Me gustaría hablar con un abogado.'
      ]
    },
    language: 'en'
  }
];
