import axiosClient from 'utils/axiosClient';
import saveBlobAs from 'utils/saveAsBlob';

export const loadTimeline = async query => {
  try {
    const timeline = await axiosClient.get('/timeline/', {
      params: { ...query },
      baseURL: process.env.REACT_APP_API_URL,
    });
    return timeline;
  } catch (error) {
    return error;
  }
};

export const downloadFile = async ({ link, name, contentType }) => {
  try {
    const response = await axiosClient.get(link, {
      headers: {
        'Content-Type': 'application/pdf',
      },
      responseType: 'blob',
    });

    const blobData = new Blob([response.data], { type: contentType });

    saveBlobAs(blobData, name);
    return response;
  } catch (error) {
    return error;
  }
};
