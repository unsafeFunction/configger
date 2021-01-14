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
      title: 'Search',
      key: 'search',
      url: '/search',
      icon: 'fe fe-search',
    },
    {
      title: 'Help',
      key: 'contactUs',
      icon: 'fe fe-mail',
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
        '/activity-stream',
        '/packing-slip',
        '/search',
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
        '/activity-stream',
        '/packing-slip',
        '/search',
      ],
      default: '/runs',
    },
    'company-admin': {
      permitted: ['/profile', '/results', '/packing-slip'],
      default: '/results',
    },
  };
}
