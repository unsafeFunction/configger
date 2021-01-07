export async function getMenuData() {
  return [
    {
      title: 'Timeline',
      key: 'timeline',
      url: '/timeline',
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
      title: 'Contact Us',
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
      ],
      default: '/runs',
    },
    'company-admin': {
      permitted: ['/profile', '/timeline'],
      default: '/timeline',
    },
  };
}
