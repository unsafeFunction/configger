export default async function getMenuData() {
  return [
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
