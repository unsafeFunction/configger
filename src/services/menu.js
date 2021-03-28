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
      title: 'Runs',
      key: 'runs',
      url: '/runs',
      icon: 'fe fe-box',
    },
    {
      title: 'Pools',
      key: 'pools',
      url: '/pools',
      icon: 'fe fe-folder',
    },
    {
      title: 'Intake Receipt Log',
      key: 'intake-receipt-log',
      url: '/intake-receipt-log',
      icon: 'fe fe-list',
    },
    {
      title: 'Pool Scans',
      key: 'pool-scans',
      url: '/pool-scans',
      icon: 'fe fe-maximize',
    },
    {
      title: 'Session',
      key: 'session',
      url: '/session',
      icon: 'fe fe-minimize',
    },
    {
      title: 'Inventory',
      key: 'inventory',
      url: '/inventory',
      icon: 'fe fe-bar-chart',
    },
    {
      title: 'PoolRack Scans',
      key: 'rack-scans',
      url: '/rack-scans',
      icon: 'fe fe-box',
    },
    // {
    //   title: 'Management',
    //   key: 'management',
    //   url: '/management',
    //   icon: 'fe fe-bar-chart',
    // },
    {
      title: 'Generate Run',
      key: 'runCreation',
      url: '/run-creation',
      icon: 'fe fe-layers',
    },
    {
      title: 'Analysis Runs',
      key: 'analysisRuns',
      url: '/analysis-runs',
      icon: 'fe fe-bar-chart-2',
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
        '/pool-scans',
        '/session',
        '/runs',
        '/pools',
        '/rack-scans',
        '/run-creation',
        // '/management',
        '/inventory',
        '/analysis-runs',
      ],
      default: '/session',
    },
    staff: {
      permitted: [
        '/profile',
        '/packing-slip',
        '/barcode-lookup',
        '/intake',
        '/intake-receipt-log',
        '/pool-scans',
        '/session',
        '/runs',
        '/pools',
        '/rack-scans',
        '/run-creation',
        // '/management',
        '/inventory',
        '/analysis-runs',
      ],
      default: '/session',
    },
    'company-admin': {
      permitted: ['/profile', '/session', '/intake-receipt-log'],
      default: '/session',
    },
  };
}
