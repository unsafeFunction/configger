export async function getMenuData() {
  return [
    {
      title: 'Timeline',
      key: 'timeline',
      url: '/timeline',
      icon: 'fe fe-compass',
    },
    {
      title: 'Customers',
      key: 'users',
      url: '/customers',
      icon: 'fe fe-user',
    },
    {
      title: 'Companies',
      key: 'companies',
      icon: 'fe fe-briefcase',
      url: '/companies',
    },
    {
      title: 'Batches',
      key: 'batches',
      url: '/batches',
      icon: 'fe fe-box',
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
      permitted: ['/profile', '/customers', '/companies', '/batches'],
      default: '/batches',
    },
    staff: {
      permitted: ['/profile', '/customers', '/companies', '/batches'],
      default: '/batches',
    },
    'company-admin': {
      permitted: ['/profile', '/timeline'],
      default: '/timeline',
    },
  };
}
