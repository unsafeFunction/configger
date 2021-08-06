// eslint-disable-next-line import/prefer-default-export
export const constants = {
  customers: {
    itemsLoadingCount: 25,
  },
  companies: {
    itemsLoadingCount: 25,
  },
  runs: {
    itemsLoadingCount: 25,
  },
  pools: {
    itemsLoadingCount: 25,
  },
  scanSessions: {
    itemsLoadingCount: 12,
  },
  poolRacks: {
    itemsLoadingCount: 25,
  },
  inventory: {
    itemsLoadingCount: 25,
  },
  scanStatuses: {
    voided: 'VOIDED',
    started: 'STARTED',
    completed: 'COMPLETED',
    invalid: 'INVALID',
  },
  tubes: {
    // default
    blank: {
      status: 'BLANK',
      countedForPool: false,
      countedForPoolRack: false,
    },
    missing: {
      status: 'MISSING',
      countedForPool: false,
      countedForPoolRack: false,
    },
    valid: {
      status: 'VALID',
      countedForPool: true,
      countedForPoolRack: true,
    },
    deleted: {
      status: 'NULL',
      countedForPool: false,
      countedForPoolRack: false,
    },
    positiveControl: {
      status: 'POSITIVE_CONTROL',
      countedForPool: false,
      countedForPoolRack: false,
    },
    negativeControl: {
      status: 'NEGATIVE_CONTROL',
      countedForPool: false,
      countedForPoolRack: false,
    },
    pooling: {
      status: 'POOLING',
      countedForPool: false,
      countedForPoolRack: true,
    },
    // invalid statuses
    invalid: {
      status: 'INVALID',
      countedForPool: true,
      countedForPoolRack: true,
    },
    empty: {
      status: 'EMPTY',
      countedForPool: true,
      countedForPoolRack: true,
    }, // A
    insufficient: {
      status: 'INSUFFICIENT',
      countedForPool: true,
      countedForPoolRack: true,
    }, // B
    improperCollection: {
      status: 'IMPROPER_COLLECTION',
      countedForPool: true,
      countedForPoolRack: true,
    }, // C
    contamination: {
      status: 'CONTAMINATION',
      countedForPool: true,
      countedForPoolRack: true,
    }, // D
    incorrectLetters: ['D', 'E', 'F'],
    referenceTubePosition: 'F8',
  },
  poolsByRun: {
    itemsLoadingCount: 100,
  },
  intakeLog: {
    itemsLoadingCount: 25,
  },
  runStatuses: {
    qpcr: 'QPCR',
    analysis: 'ANALYSIS',
    review: 'REVIEW',
    published: 'PUBLISHED',
  },
  poolResults: {
    notDetected: 'NOT_DETECTED',
    detected: 'DETECTED',
    inconclusive: 'INCONCLUSIVE',
    invalid: 'INVALID',
    inProgress: 'IN_PROGRESS',
  },
  reflexList: {
    itemsLoadingCount: 10,
  },
  USstates: [
    {
      label: 'Alabama',
      value: 'AL',
    },
    {
      label: 'Alaska',
      value: 'AK',
    },
    {
      label: 'American Samoa',
      value: 'AS',
    },
    {
      label: 'Arizona',
      value: 'AZ',
    },
    {
      label: 'Arkansas',
      value: 'AR',
    },
    {
      label: 'California',
      value: 'CA',
    },
    {
      label: 'Colorado',
      value: 'CO',
    },
    {
      label: 'Connecticut',
      value: 'CT',
    },
    {
      label: 'Delaware',
      value: 'DE',
    },
    {
      label: 'District Of Columbia',
      value: 'DC',
    },
    {
      label: 'Federated States Of Micronesia',
      value: 'FM',
    },
    {
      label: 'Florida',
      value: 'FL',
    },
    {
      label: 'Georgia',
      value: 'GA',
    },
    {
      label: 'Guam',
      value: 'GU',
    },
    {
      label: 'Hawaii',
      value: 'HI',
    },
    {
      label: 'Idaho',
      value: 'ID',
    },
    {
      label: 'Illinois',
      value: 'IL',
    },
    {
      label: 'Indiana',
      value: 'IN',
    },
    {
      label: 'Iowa',
      value: 'IA',
    },
    {
      label: 'Kansas',
      value: 'KS',
    },
    {
      label: 'Kentucky',
      value: 'KY',
    },
    {
      label: 'Louisiana',
      value: 'LA',
    },
    {
      label: 'Maine',
      value: 'ME',
    },
    {
      label: 'Marshall Islands',
      value: 'MH',
    },
    {
      label: 'Maryland',
      value: 'MD',
    },
    {
      label: 'Massachusetts',
      value: 'MA',
    },
    {
      label: 'Michigan',
      value: 'MI',
    },
    {
      label: 'Minnesota',
      value: 'MN',
    },
    {
      label: 'Mississippi',
      value: 'MS',
    },
    {
      label: 'Missouri',
      value: 'MO',
    },
    {
      label: 'Montana',
      value: 'MT',
    },
    {
      label: 'Nebraska',
      value: 'NE',
    },
    {
      label: 'Nevada',
      value: 'NV',
    },
    {
      label: 'New Hampshire',
      value: 'NH',
    },
    {
      label: 'New Jersey',
      value: 'NJ',
    },
    {
      label: 'New Mexico',
      value: 'NM',
    },
    {
      label: 'New York',
      value: 'NY',
    },
    {
      label: 'North Carolina',
      value: 'NC',
    },
    {
      label: 'North Dakota',
      value: 'ND',
    },
    {
      label: 'Northern Mariana Islands',
      value: 'MP',
    },
    {
      label: 'Ohio',
      value: 'OH',
    },
    {
      label: 'Oklahoma',
      value: 'OK',
    },
    {
      label: 'Oregon',
      value: 'OR',
    },
    {
      label: 'Palau',
      value: 'PW',
    },
    {
      label: 'Pennsylvania',
      value: 'PA',
    },
    {
      label: 'Puerto Rico',
      value: 'PR',
    },
    {
      label: 'Rhode Island',
      value: 'RI',
    },
    {
      label: 'South Carolina',
      value: 'SC',
    },
    {
      label: 'South Dakota',
      value: 'SD',
    },
    {
      label: 'Tennessee',
      value: 'TN',
    },
    {
      label: 'Texas',
      value: 'TX',
    },
    {
      label: 'Utah',
      value: 'UT',
    },
    {
      label: 'Vermont',
      value: 'VT',
    },
    {
      label: 'Virgin Islands',
      value: 'VI',
    },
    {
      label: 'Virginia',
      value: 'VA',
    },
    {
      label: 'Washington',
      value: 'WA',
    },
    {
      label: 'West Virginia',
      value: 'WV',
    },
    {
      label: 'Wisconsin',
      value: 'WI',
    },
    {
      label: 'Wyoming',
      value: 'WY',
    },
  ],
  A: 'A'.charCodeAt(0),
  invalidateCodes: [
    {
      id: 1,
      code: 'A',
      reason: 'Empty',
      color: '#ffffff',
      status: 'EMPTY',
    },
    {
      id: 2,
      code: 'B',
      reason: 'Quantity Not Sufficient',
      color: '#cacaca',
      status: 'INSUFFICIENT',
    },
    {
      id: 3,
      code: 'C',
      reason: 'Improper Sample Collection',
      color: '#ff0000',
      status: 'IMPROPER_COLLECTION',
    },
    {
      id: 4,
      code: 'D',
      reason: 'Contamination',
      color: '#ff0000',
      status: 'CONTAMINATION',
    },
  ],
  controlTypes: [
    {
      label: 'Positive',
      value: 'POSITIVE_CONTROL',
    },
    {
      label: 'Negative',
      value: 'NEGATIVE_CONTROL',
    },
  ],
};
