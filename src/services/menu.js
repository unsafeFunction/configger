import { Badge } from 'antd';

export async function getMenuData() {
  return [
    {
      title: 'Results',
      key: 'results',
      url: '/results',
      icon: 'fe fe-compass',
    },
    {
      title: 'Users',
      key: 'users',
      url: '/users',
      icon: 'fe fe-user',
    },
    {
      title: 'Companies',
      key: 'companies',
      icon: 'fe fe-briefcase',
      url: '/companies',
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
        '/users',
        '/companies',
        '/runs',
        '/pools',
        '/packing-slip',
        '/barcode-lookup',
        '/intake',
        '/intake-receipt-log',
        '/scan-sessions',
        '/management',
        '/session'
      ],
      default: '/runs',
    },
    staff: {
      permitted: [
        '/profile',
        '/users',
        '/companies',
        '/runs',
        '/pools',
        '/packing-slip',
        '/barcode-lookup',
        '/intake',
        '/intake-receipt-log',
        '/scan-sessions',
        '/management',
        '/session'
      ],
      default: '/runs',
    },
    'company-admin': {
      permitted: ['/profile', '/results', '/packing-slip'],
      default: '/results',
    },
  };
}
