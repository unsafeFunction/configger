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

    saveBlobAs(
      blobData,
      nameWithExtension(name || `Unknown_${instanceId}`, contentType),
    );
    return response;
  } catch (error) {
    throw new Error(error);
  }
};
