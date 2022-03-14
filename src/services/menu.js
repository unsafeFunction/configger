import labConfig from 'utils/labConfig';
import { constants } from 'utils/constants';

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
        {
          title: 'Pool Scans',
          key: 'pool-scans',
          url: '/pool-scans',
          icon: 'fe fe-maximize',
        },
        {
          title: `${labConfig[process.env.REACT_APP_LAB_ID].naming.rack} Scans`,
          key: 'rack-scans',
          url: '/rack-scans',
          icon: 'fe fe-box',
        },
        {
          title: 'Intake dashboard',
          key: 'intake-dashboard',
          url: '/intake-dashboard',
          icon: 'fe fe-book-open',
        },
      ],
    },
    {
      title: 'Companies',
      key: 'companies',
      icon: 'fe fe-briefcase',
      url: '/companies',
    },
    {
      title: 'Pools',
      key: 'pools',
      url: '/pools',
      icon: 'fe fe-folder',
    },
    {
      title: 'Runs',
      key: 'runsSection',
      icon: 'fe fe-box',
      children: [
        {
          title: 'Analysis Runs',
          key: 'analysisRuns',
          url: `/analysis-runs?from=${constants.analysisRuns.initialDates.from}&to=${constants.analysisRuns.initialDates.to}`,
          icon: 'fe fe-bar-chart-2',
        },
        {
          title: 'Generate Run',
          key: 'runTemplate',
          url: '/generate-run',
          icon: 'fe fe-layers',
        },
        {
          title: 'Reflex List',
          key: 'reflexList',
          url: '/reflex-list',
          icon: 'fe fe-check-square',
        },
      ],
    },
    {
      title: 'Completed Runs',
      key: 'runs',
      url: '/runs',
      icon: 'fe fe-box',
    },
    {
      title: 'Barcode Lookup',
      key: 'search',
      icon: 'fe fe-search',
      url: '/barcode-lookup',
    },
    {
      title: 'Inventory',
      key: 'inventory',
      url: '/inventory',
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
