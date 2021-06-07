/* eslint-disable import/prefer-default-export */
import axiosClient from 'utils/axiosClient';
import nameWithExtension from 'utils/nameWithExtension';
import saveBlobAs from 'utils/saveAsBlob';

export const downloadFile = async ({ link, instanceId, contentType }) => {
  try {
    const response = await axiosClient.get(link, {
      headers: {
        'Content-Type': contentType,
      },
      responseType: 'blob',
    });

    const blobData = new Blob([response.data], { type: contentType });
    const parsedName = response.headers['content-disposition']
      ?.split(';')[1]
      ?.split('="')[1]
      ?.split('.')[0];

    saveBlobAs(
      blobData,
      nameWithExtension(parsedName || `Unknown_${instanceId}`, contentType),
    );
    return response;
  } catch (error) {
    throw new Error(error);
  }
};
