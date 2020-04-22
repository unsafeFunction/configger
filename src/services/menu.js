export default async function getMenuData() {
  return [
    {
      title: 'Campaigns',
      key: 'campaigns',
      icon: 'fe fe-home',
      url: '/campaigns?type=ALL',
      count: 6,
      children: [
        {
          title: 'All',
          key: 'campaignsAll',
          url: '/campaigns?type=ALL',
        },
        {
          title: 'Draft',
          key: 'campaignsDraft',
          url: '/campaigns?type=DRAFT',
        },
        {
          title: 'Ongoing',
          key: 'campaignsOngoing',
          url: '/campaigns?type=ONGOING',
        },
        {
          title: 'Completed',
          key: 'campaignsCompleted',
          url: '/campaigns?type=COMPLETED',
        }
      ],
    },
    {
      title: 'Settings',
      key: 'settings',
      icon: 'fe fe-settings',
      url: '/settings',
    },
  ]
}
