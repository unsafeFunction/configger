import axiosClient from 'utils/axiosClient';
import nameWithExtension from 'utils/nameWithExtension';
import saveBlobAs from 'utils/saveAsBlob';

// eslint-disable-next-line import/prefer-default-export
export const createTemplate = async (payload) => {
  try {
    const contentType = 'text/csv';
    const response = await axiosClient.post('/runs/', {
      data: { ...payload },
      // headers: {
      //   'Content-Type': contentType,
      // },
      responseType: 'blob',
    });

    const blobData = new Blob([response.data], { type: contentType });
    const parsedName = response.headers['content-disposition']
      ?.split(';')[1]
      ?.split('="')[1]
      ?.split('.')[0];

    saveBlobAs(
      blobData,
      nameWithExtension(parsedName || 'Unknown', contentType),
    );
    return response;
  } catch (error) {
    throw new Error(error?.response?.data.detail);
  }
};
