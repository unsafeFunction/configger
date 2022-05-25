import { constants } from 'utils/constants';
import labConfig from 'utils/labConfig';

export async function getMenuData() {
  return [
    {
      title: 'Environments',
      key: 'environments',
      url: '/environments',
      icon: 'fe fe-box',
    },
    {
      title: 'Projects',
      key: 'projects',
      url: '/projects',
      icon: 'fe fe-box',
    },
    {
      title: 'Vassals',
      key: 'vassals',
      url: '/vassals',
      icon: 'fe fe-box',
    },
    // {
    //   title: process.env.REACT_APP_VERSION,
    //   key: 'version',
    // },
  ];
}

export async function getRolePermissions() {
  return {
    admin: {
      permitted: [
        '/profile',
        '/barcode-lookup',
        '/settings',
        '/intake-receipt-log',
        '/pool-scans',
        '/session',
        '/pools',
        '/rack-scans',
        '/generate-run',
        '/companies',
        '/inventory',
        '/analysis-runs',
        '/reflex-list',
        '/runs',
        '/intake-dashboard',
        '/environments',
        '/projects',
        '/vassals',
      ],
      default: '/intake-receipt-log',
    },
    staff: {
      permitted: [
        '/profile',
        '/barcode-lookup',
        '/settings',
        '/intake-receipt-log',
        '/pool-scans',
        '/session',
        '/pools',
        '/companies',
        '/rack-scans',
        '/inventory',
        '/analysis-runs',
        '/reflex-list',
        '/runs',
        '/intake-dashboard',
      ],
      default: '/intake-receipt-log',
    },
    'company-admin': {
      permitted: ['/profile', '/session', '/intake-receipt-log'],
      default: '/intake-receipt-log',
    },
  };
}
