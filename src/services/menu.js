export async function getMenuData() {
  return [
    {
      title: 'Intake',
      key: 'intakeSection',
      icon: 'fe fe-monitor',
      children: [
        {
          title: 'Intake Receipt Log',
          key: 'intake-receipt-log',
          url: '/intake-receipt-log',
          icon: 'fe fe-list',
        },
      ],
    },
    {
      title: 'Pools',
      key: 'poolSection',
      icon: 'fe fe-folder',
      children: [
        {
          title: 'Pool Scans',
          key: 'pool-scans',
          url: '/pool-scans',
          icon: 'fe fe-maximize',
        },
        {
          title: 'PoolRack Scans',
          key: 'rack-scans',
          url: '/rack-scans',
          icon: 'fe fe-box',
        },
        {
          title: 'Pools',
          key: 'pools',
          url: '/pools',
          icon: 'fe fe-folder',
        },
      ],
    },
    {
      title: 'Runs',
      key: 'runsSection',
      icon: 'fe fe-box',
      children: [
        {
          title: 'Generate Run',
          key: 'runTemplate',
          url: '/generate-run',
          icon: 'fe fe-layers',
        },
        {
          title: 'Analysis Runs',
          key: 'analysisRuns',
          url: '/analysis-runs',
          icon: 'fe fe-bar-chart-2',
        },
        {
          title: 'Reflex List',
          key: 'reflexList',
          url: '/reflex-list',
          icon: 'fe fe-check-square',
        },
      ],
    },
    // {
    //   title: 'Packing Slip',
    //   key: 'packingSlip',
    //   url: '/packing-slip',
    //   icon: 'fe fe-download',
    // },
    {
      title: 'Barcode Lookup',
      key: 'search',
      icon: 'fe fe-search',
      url: '/barcode-lookup',
      isAlpha: true,
    },
    {
      title: 'Inventory',
      key: 'inventory',
      url: '/inventory',
      icon: 'fe fe-bar-chart',
    },
    // {
    //   title: 'Management',
    //   key: 'management',
    //   url: '/management',
    //   icon: 'fe fe-bar-chart',
    // },
    // {
    //   category: true,
    //   title: 'Settings',
    // },
    // {
    //   title: 'Users',
    //   key: 'usersSettings',
    //   icon: 'fe fe-settings',
    //   children: [
    //     {
    //       title: 'User permission',
    //       key: 'permission',
    //       url: '/settings/permission',
    //       icon: 'fe fe-lock',
    //     },
    //   ],
    // },
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
    {
      title: `v ${process.env.REACT_APP_VERSION}`,
      key: 'version',
      icon: 'fe fe-git-merge',
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
        '/settings',
        '/intake-receipt-log',
        '/pool-scans',
        '/session',
        '/pools',
        '/rack-scans',
        '/generate-run',
        // '/management',
        '/inventory',
        '/analysis-runs',
        '/reflex-list',
      ],
      default: '/intake-receipt-log',
    },
    staff: {
      permitted: [
        '/profile',
        '/packing-slip',
        '/barcode-lookup',
        '/intake',
        '/settings',
        '/intake-receipt-log',
        '/pool-scans',
        '/session',
        '/pools',
        '/rack-scans',
        // '/management',
        '/inventory',
        '/analysis-runs',
        '/reflex-list',
      ],
      default: '/intake-receipt-log',
    },
    'company-admin': {
      permitted: ['/profile', '/session', '/intake-receipt-log'],
      default: '/intake-receipt-log',
    },
  };
}
