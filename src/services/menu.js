export async function getMenuData() {
  return [
    {
      title: 'Packing Slip',
      key: 'packingSlip',
      url: '/packing-slip',
      icon: 'fe fe-download',
    },
    {
      title: 'Barcode Lookup',
      key: 'search',
      icon: 'fe fe-search',
      url: '/barcode-lookup',
      isAlpha: true,
    },
    {
      title: 'Intake',
      key: 'intake',
      url: '/intake',
      icon: 'fe fe-monitor',
    },
    {
      title: 'Intake Receipt Log',
      key: 'intake-receipt-log',
      url: '/intake-receipt-log',
      icon: 'fe fe-list',
    },
    {
      title: 'Scan Sessions',
      key: 'scan-sessions',
      url: '/scan-sessions',
      icon: 'fe fe-maximize',
    },
    {
      title: 'Session',
      key: 'session',
      url: '/session',
      icon: 'fe fe-maximize',
    },
    {
      title: 'Management',
      key: 'management',
      url: '/management',
      icon: 'fe fe-bar-chart',
    },
    {
      title: 'Email Support',
      key: 'contactUs',
      icon: 'fe fe-mail',
    },
    {
      title: 'Help Center',
      key: 'helpCenter',
      icon: 'fa fa-question-circle-o',
    },
  ];
}

export async function getRolePermissions() {
  return {
    admin: {
      permitted: [
        '/profile',
        '/packing-slip',
        '/barcode-lookup',
        '/intake',
        '/intake-receipt-log',
        '/scan-sessions',
        '/management',
        '/session',
      ],
      default: '/runs',
    },
    staff: {
      permitted: [
        '/profile',
        '/packing-slip',
        '/barcode-lookup',
        '/intake',
        '/intake-receipt-log',
        '/scan-sessions',
        '/management',
        '/session',
      ],
      default: '/runs',
    },
    'company-admin': {
      permitted: ['/profile', '/results', '/packing-slip'],
      default: '/results',
    },
  };
}
