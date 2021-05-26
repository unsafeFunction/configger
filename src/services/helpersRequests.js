import axiosClient from 'utils/axiosClient';
import saveBlobAs from 'utils/saveAsBlob';
import nameWithExtension from 'utils/nameWithExtension';

export const downloadFile = async ({ link, instanceId, name, contentType }) => {
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
