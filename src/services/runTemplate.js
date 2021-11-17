import axiosClient from 'utils/axiosClient';
import errorOutput from 'utils/errorOutput';
import nameWithExtension from 'utils/nameWithExtension';
import saveBlobAs from 'utils/saveAsBlob';

// eslint-disable-next-line import/prefer-default-export
export const createTemplate = async (payload) => {
  try {
    const contentType = 'text/csv';
    const response = await axiosClient.post('/runs/', {
      ...payload,
      responseType: 'blob',
    });

    const blobData = new Blob([response.data], { type: contentType });
    const parsedName = response.headers['content-disposition']
      ?.split(';')[1]
      ?.split('="')[1]
      ?.split('.')[0];

    saveBlobAs(
      blobData,
      nameWithExtension(`${parsedName}.xls` || 'Unknown', contentType),
    );
    return response;
  } catch (error) {
    throw new Error(errorOutput(error));
  }
};
