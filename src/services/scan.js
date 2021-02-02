import axiosClient from 'utils/axiosClient';
import mockClient from 'utils/mockClient';

export const fetchCompanies = async ({ limit, offset, search }) => {
  const companies = await axiosClient.get('/companies/', {
    params: {
      limit,
      offset,
      search,
    },
  });

  return companies;
};

export const fetchSamples = async () => {
  const samples = await mockClient.get('/scans/byId');

  return samples;
}
