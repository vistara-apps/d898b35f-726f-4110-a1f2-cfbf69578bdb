export const INTERACTION_TYPES = {
  TRAFFIC_STOP: 'traffic_stop',
  QUESTIONING: 'questioning',
  HOME_SEARCH: 'home_search',
  ARREST: 'arrest',
  PROTEST: 'protest',
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

export const STATE_NAMES: Record<string, string> = {
  'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas',
  'CA': 'California', 'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware',
  'FL': 'Florida', 'GA': 'Georgia', 'HI': 'Hawaii', 'ID': 'Idaho',
  'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa', 'KS': 'Kansas',
  'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
  'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi',
  'MO': 'Missouri', 'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada',
  'NH': 'New Hampshire', 'NJ': 'New Jersey', 'NM': 'New Mexico', 'NY': 'New York',
  'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio', 'OK': 'Oklahoma',
  'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
  'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah',
  'VT': 'Vermont', 'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia',
  'WI': 'Wisconsin', 'WY': 'Wyoming'
};

export const EMERGENCY_NUMBERS = {
  POLICE: '911',
  ACLU: '1-212-549-2500',
  LEGAL_AID: '211',
  NATIONAL_LAWYERS_GUILD: '1-415-285-1011'
};

export const DEFAULT_RIGHTS_CARDS = {
  traffic_stop: {
    title: 'Traffic Stop Rights',
    content: {
      dos: [
        'Keep your hands visible at all times',
        'Remain calm and polite',
        'Provide license, registration, and insurance when asked',
        'You can remain silent beyond basic identification',
        'Inform passengers of their rights',
        'Ask if you are free to leave'
      ],
      donts: [
        'Don\'t reach for anything without announcing it first',
        'Don\'t argue, resist, or run',
        'Don\'t consent to searches without a warrant',
        'Don\'t lie or provide false information',
        'Don\'t get out of the car unless ordered',
        'Don\'t touch the officer or their equipment'
      ],
      keyRights: [
        'Right to remain silent (5th Amendment)',
        'Right to refuse consent to search (4th Amendment)',
        'Right to ask if you\'re free to leave',
        'Right to record the interaction',
        'Right to an attorney if arrested',
        'Right to know why you\'re being stopped'
      ],
      emergencyContacts: [
        'ACLU: 1-212-549-2500',
        'Legal Aid: 211',
        'National Lawyers Guild: 1-415-285-1011'
      ],
      legalResources: [
        'ACLU Know Your Rights',
        'Electronic Frontier Foundation',
        'National Lawyers Guild'
      ]
    },
    script: {
      phrases: [
        'I am exercising my right to remain silent',
        'I do not consent to any searches',
        'Am I free to leave?',
        'I would like to speak to an attorney',
        'I am recording this interaction for my safety'
      ],
      responses: [
        'I understand, officer',
        'I am complying with your lawful orders',
        'I need to reach for my [license/registration/insurance]',
        'I prefer to remain silent'
      ],
      emergencyPhrases: [
        'I need medical attention',
        'I am having difficulty breathing',
        'I need to contact my attorney immediately',
        'I am being harmed'
      ]
    }
  },
  questioning: {
    title: 'Police Questioning Rights',
    content: {
      dos: [
        'Ask if you are free to leave',
        'Remain calm and polite',
        'Ask for identification if not in uniform',
        'Remember details for later',
        'Ask for a lawyer if arrested',
        'Provide only basic identification if required'
      ],
      donts: [
        'Don\'t answer questions without a lawyer present',
        'Don\'t consent to searches',
        'Don\'t lie or provide false information',
        'Don\'t resist or argue',
        'Don\'t sign anything without reading',
        'Don\'t go anywhere voluntarily'
      ],
      keyRights: [
        'Right to remain silent',
        'Right to leave if not detained',
        'Right to refuse to answer questions',
        'Right to an attorney',
        'Right to know if you\'re being detained',
        'Right to record the interaction'
      ],
      emergencyContacts: [
        'ACLU: 1-212-549-2500',
        'Legal Aid: 211'
      ]
    },
    script: {
      phrases: [
        'Am I free to leave?',
        'I am exercising my right to remain silent',
        'I do not wish to answer questions',
        'I want to speak to a lawyer',
        'I do not consent to any searches'
      ],
      responses: [
        'I understand',
        'I prefer not to answer questions',
        'I would like to leave now',
        'I am recording this interaction'
      ]
    }
  },
  home_search: {
    title: 'Home Search Rights',
    content: {
      dos: [
        'Ask to see the warrant',
        'Read the warrant carefully',
        'Ask what they are looking for',
        'Remain calm and observe',
        'Take notes or record if possible',
        'Ask for a copy of the warrant'
      ],
      donts: [
        'Don\'t consent to a search without a warrant',
        'Don\'t interfere with the search',
        'Don\'t answer questions without a lawyer',
        'Don\'t sign anything',
        'Don\'t let them expand beyond the warrant',
        'Don\'t leave them alone in your home'
      ],
      keyRights: [
        'Right to see the warrant',
        'Right to refuse warrantless searches',
        'Right to remain silent',
        'Right to an attorney',
        'Right to observe the search',
        'Right to record the interaction'
      ]
    },
    script: {
      phrases: [
        'I do not consent to a search',
        'May I see your warrant?',
        'I am exercising my right to remain silent',
        'I want to speak to my attorney',
        'I am recording this interaction'
      ],
      responses: [
        'I understand you have a warrant',
        'I am not interfering with your search',
        'I prefer to remain silent',
        'I am observing for my protection'
      ]
    }
  },
  arrest: {
    title: 'Arrest Rights',
    content: {
      dos: [
        'Remain calm and don\'t resist',
        'Ask why you\'re being arrested',
        'Ask for a lawyer immediately',
        'Remember the Miranda rights',
        'Ask for medical attention if needed',
        'Try to remember badge numbers and details'
      ],
      donts: [
        'Don\'t resist arrest',
        'Don\'t answer questions without a lawyer',
        'Don\'t sign anything',
        'Don\'t consent to searches',
        'Don\'t make any statements',
        'Don\'t argue about the arrest'
      ],
      keyRights: [
        'Right to remain silent (Miranda rights)',
        'Right to an attorney',
        'Right to know charges against you',
        'Right to a phone call',
        'Right to medical attention',
        'Right to refuse to sign anything'
      ]
    },
    script: {
      phrases: [
        'I am exercising my right to remain silent',
        'I want to speak to a lawyer',
        'I do not consent to any searches',
        'Why am I being arrested?',
        'I need medical attention'
      ],
      responses: [
        'I understand I am under arrest',
        'I am not resisting',
        'I prefer to remain silent',
        'I want my attorney present'
      ]
    }
  }
};

export const SPANISH_RIGHTS_CARDS = {
  traffic_stop: {
    title: 'Derechos Durante una Parada de Tráfico',
    content: {
      dos: [
        'Mantén las manos visibles en todo momento',
        'Mantén la calma y sé cortés',
        'Proporciona licencia, registro y seguro cuando se solicite',
        'Puedes permanecer en silencio más allá de la identificación básica'
      ],
      donts: [
        'No busques nada sin anunciarlo primero',
        'No discutas, resistas o huyas',
        'No consientas a registros sin una orden judicial',
        'No mientas o proporciones información falsa'
      ],
      keyRights: [
        'Derecho a permanecer en silencio',
        'Derecho a rechazar el consentimiento para registros',
        'Derecho a preguntar si eres libre de irte',
        'Derecho a grabar la interacción'
      ]
    },
    script: {
      phrases: [
        'Estoy ejerciendo mi derecho a permanecer en silencio',
        'No consiento a ningún registro',
        '¿Soy libre de irme?',
        'Me gustaría hablar con un abogado'
      ],
      responses: [
        'Entiendo, oficial',
        'Estoy cumpliendo con sus órdenes legales',
        'Estoy grabando esta interacción para mi seguridad'
      ]
    }
  }
};
