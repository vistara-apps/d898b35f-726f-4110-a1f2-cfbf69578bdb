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
        'You can remain silent beyond basic identification',
        'Pull over safely when signaled',
        'Turn off the engine and turn on interior lights if dark'
      ],
      donts: [
        'Don\'t reach for anything without announcing it',
        'Don\'t argue or resist',
        'Don\'t consent to searches without a warrant',
        'Don\'t lie or provide false information',
        'Don\'t get out of the vehicle unless instructed',
        'Don\'t make sudden movements'
      ],
      keyRights: [
        'Right to remain silent',
        'Right to refuse consent to search',
        'Right to ask if you\'re free to leave',
        'Right to record the interaction',
        'Right to an attorney if arrested',
        'Right to know why you\'re being stopped'
      ]
    },
    script: {
      phrases: [
        'I am exercising my right to remain silent',
        'I do not consent to any searches',
        'Am I free to leave?',
        'I would like to speak to an attorney',
        'Why am I being stopped?',
        'I\'m going to reach for my documents now'
      ],
      responses: [
        'I understand, officer',
        'I am complying with your lawful orders',
        'I am recording this interaction for my safety',
        'Yes, sir/ma\'am',
        'I will remain in my vehicle'
      ]
    }
  },
  questioning: {
    title: 'Police Questioning Rights',
    content: {
      dos: [
        'Ask if you are free to leave',
        'Remain calm and respectful',
        'Ask for identification if not in uniform',
        'Remember details of the interaction',
        'Ask for a lawyer if arrested'
      ],
      donts: [
        'Don\'t answer questions without a lawyer present',
        'Don\'t consent to searches',
        'Don\'t resist or argue',
        'Don\'t lie or provide false information',
        'Don\'t sign anything without understanding it'
      ],
      keyRights: [
        'Right to remain silent',
        'Right to leave if not detained',
        'Right to refuse to answer questions',
        'Right to an attorney',
        'Right to know if you\'re being detained',
        'Right to record the interaction'
      ]
    },
    script: {
      phrases: [
        'Am I free to leave?',
        'I am exercising my right to remain silent',
        'I want to speak to a lawyer',
        'I do not consent to any searches',
        'Am I being detained?',
        'I will not answer questions without my attorney'
      ],
      responses: [
        'I understand my rights',
        'I am not resisting',
        'I am recording this interaction',
        'I need to contact my attorney'
      ]
    }
  },
  home_search: {
    title: 'Home Search Rights',
    content: {
      dos: [
        'Ask to see the warrant',
        'Read the warrant carefully',
        'Remain calm and cooperative',
        'Document everything',
        'Contact an attorney immediately'
      ],
      donts: [
        'Don\'t consent to searches without a warrant',
        'Don\'t interfere with the search',
        'Don\'t answer questions without a lawyer',
        'Don\'t sign anything',
        'Don\'t resist or argue'
      ],
      keyRights: [
        'Right to see the search warrant',
        'Right to remain silent',
        'Right to refuse consent without a warrant',
        'Right to an attorney',
        'Right to observe the search',
        'Right to record the interaction'
      ]
    },
    script: {
      phrases: [
        'I do not consent to this search',
        'May I see your warrant?',
        'I am exercising my right to remain silent',
        'I want to contact my attorney',
        'I do not give permission to enter',
        'I am recording this interaction'
      ],
      responses: [
        'I understand you have a warrant',
        'I will not interfere with your search',
        'I am cooperating under protest',
        'I need to call my lawyer'
      ]
    }
  }
};

export const STATE_SPECIFIC_VARIATIONS = {
  CA: {
    traffic_stop: {
      additionalRights: [
        'Right to have documents in electronic format',
        'Right to interpretation services if needed'
      ],
      additionalDos: [
        'You may keep your hands on the steering wheel',
        'Inform officer of any weapons in the vehicle'
      ]
    }
  },
  TX: {
    traffic_stop: {
      additionalRights: [
        'Right to refuse field sobriety tests (with consequences)',
        'Right to independent blood test if arrested for DWI'
      ],
      additionalDos: [
        'Provide proof of financial responsibility',
        'Be aware of open carry laws'
      ]
    }
  },
  NY: {
    traffic_stop: {
      additionalRights: [
        'Right to refuse consent to vehicle search',
        'Right to ask for supervisor if needed'
      ],
      additionalDos: [
        'Keep registration and insurance easily accessible',
        'Be aware of cell phone laws while driving'
      ]
    }
  },
  FL: {
    traffic_stop: {
      additionalRights: [
        'Right to refuse field sobriety tests',
        'Right to independent chemical test'
      ],
      additionalDos: [
        'Inform officer of concealed carry permit if applicable',
        'Keep hands visible at all times'
      ]
    }
  }
};

export const MULTILINGUAL_SCRIPTS = {
  en: {
    traffic_stop: [
      'I am exercising my right to remain silent',
      'I do not consent to any searches',
      'Am I free to leave?',
      'I would like to speak to an attorney'
    ]
  },
  es: {
    traffic_stop: [
      'Estoy ejerciendo mi derecho a permanecer en silencio',
      'No consiento ningún registro',
      '¿Soy libre de irme?',
      'Me gustaría hablar con un abogado'
    ]
  }
};
