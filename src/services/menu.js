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
        '/settings',
        '/environments',
        '/projects',
        '/vassals',
      ],
      default: '/enviroments',
    },
  };
}
