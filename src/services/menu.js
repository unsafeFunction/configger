export default async function getMenuData() {
  return [
    // {
    //   title: 'Campaigns',
    //   key: 'campaigns',
    //   icon: 'fe fe-home',
    //   url: '/campaigns?type=ALL',
    //   count: 6,
    //   children: [
    //     {
    //       title: 'All',
    //       key: 'campaignsAll',
    //       url: '/campaigns?type=ALL',
    //       dotColor: '#ff0000',
    //     },
    //     {
    //       title: 'Draft',
    //       key: 'campaignsDraft',
    //       url: '/campaigns?type=DRAFT',
    //       dotColor: '#8A9A5B',
    //     },
    //     {
    //       title: 'Ongoing',
    //       key: 'campaignsOngoing',
    //       url: '/campaigns?type=ONGOING',
    //       dotColor: '#0018F9',
    //     },
    //     {
    //       title: 'Completed',
    //       key: 'campaignsCompleted',
    //       url: '/campaigns?type=COMPLETED',
    //       dotColor: '#9acd32',
    //     },
    //   ],
    // },
    {
      title: 'Customers',
      key: 'users',
      url: '/customers',
      icon: 'fe fe-user',
    },
    {
      title: 'Batches',
      key: 'batches',
      url: '/batches',
      icon: 'fe fe-box',
    },
    {
      title: 'Settings',
      key: 'settings',
      icon: 'fe fe-settings',
      url: '/settings',
    },
  ];
}
