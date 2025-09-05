export const INTERACTION_TYPES = {
  TRAFFIC_STOP: 'traffic_stop',
  QUESTIONING: 'questioning',
  HOME_SEARCH: 'home_search',
  OTHER: 'other'
} as const;

export const LANGUAGES = {
  EN: 'en',
  ES: 'es'
} as const;

export const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

export const DEFAULT_RIGHTS_CARDS = {
  traffic_stop: {
    title: 'Traffic Stop Rights',
    content: {
      dos: [
        'Keep your hands visible',
        'Remain calm and polite',
        'Provide license, registration, and insurance when asked',
        'You can remain silent beyond basic identification'
      ],
      donts: [
        'Don\'t reach for anything without announcing it',
        'Don\'t argue or resist',
        'Don\'t consent to searches without a warrant',
        'Don\'t lie or provide false information'
      ],
      keyRights: [
        'Right to remain silent',
        'Right to refuse consent to search',
        'Right to ask if you\'re free to leave',
        'Right to record the interaction'
      ]
    },
    script: {
      phrases: [
        'I am exercising my right to remain silent',
        'I do not consent to any searches',
        'Am I free to leave?',
        'I would like to speak to an attorney'
      ],
      responses: [
        'I understand, officer',
        'I am complying with your lawful orders',
        'I am recording this interaction for my safety'
      ]
    }
  }
};
