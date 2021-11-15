/* eslint-disable import/prefer-default-export */
import axiosClient from 'utils/axiosClient';
import nameWithExtension from 'utils/nameWithExtension';
import saveBlobAs from 'utils/saveAsBlob';

export const downloadFile = async ({ link, instanceId }) => {
  try {
    const response = await axiosClient.get(link, {
      responseType: 'blob',
    });

    const requestContentTYpe = response.headers['content-type'];
    const parsedName = response.headers['content-disposition']
      ?.split(';')[1]
      ?.split('="')[1]
      ?.split('.')[0];
    const blobData = new Blob([response.data], {
      type: requestContentTYpe,
    });

    saveBlobAs(
      blobData,
      nameWithExtension(
        parsedName || `Unknown_${instanceId}`,
        requestContentTYpe,
      ),
    );

    return response;
  } catch (error) {
    throw new Error(error);
  }
};
