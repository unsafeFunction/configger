import axiosClient from 'utils/axiosClient';

export const fetchIntake = async () => {
  try {
    return await axiosClient.get('/companies-short/');
  } catch (error) {
    return error;
  }
};

export const createPackingSlip = async (payload) => {
  try {
    return await axiosClient.post('/packing-slip/create', {
      company_name: payload.companyName,
      company_id: payload.companyId,
      sample_count: payload.sampleCount,
      pool_count: payload.poolCount,
      ship_date: payload.shipDate,
      shipping_by: payload.shippingBy.toLowerCase(),
    });
  } catch (error) {
    return error;
  }
};

export const downloadFile = async ({ link }) => {
  try {
    const response = await axiosClient.get(link, {
      headers: {
        'Content-Type': 'application/pdf',
      },
      responseType: 'blob',
    });

    return response;
  } catch (error) {
    return error;
  }
};
