import axiosClient from 'utils/axiosClient';
import mockClient from 'utils/mockClient';

export const fetchPoolScanById = async ({ poolScanId, sortBy }) => {
  const scan = await mockClient.get('/scans/byId');

  // const scan = await axiosClient.get(`/scans/pool-scan/${poolScanId}/`, {
  //   params: {
  //     sort_by: sortBy,
  //   },
  // });

  return scan;
};

export const updateTube = async ({ id, tube_id }) => {
  console.log('services update tube id/tube_id', id, tube_id);

  // const tube = await axiosClient.patch(`/scans/pool-scan-tube/${id}/`, {
  //   tube_id,
  // });

  // return tube;

  return {
    id: 'ce08ac6e-1207-4332-87a3-1055ff30ea73',
    created: '2021-02-04T11:32:20.222912-05:00',
    modified: '2021-02-05T03:29:31.279987-05:00',
    position: 'C3',
    tube_id: '123',
    status: 'TESTED',
    color: '#f7df8c',
    metadata: {
      errors: [],
    },
    pool_scan: '2a16024c-4b82-4630-a297-9eaed6af699f',
  };
};

// export const fetchScanSessions = async () => {
//   const samples = await mockClient.get('/scans/byId');

//   return samples;
// };
