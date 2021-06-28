import axiosClient from 'utils/axiosClient';
import saveBlobAs from 'utils/saveAsBlob';

export const createRun = async (payload) => {
  return console.log(payload);
  try {
    const run = await axiosClient.post('/runs/', { ...payload });
    return run;
  } catch (error) {
    const err = error?.response?.data.field_errors;
    throw new Error(err ? JSON.stringify(err) : error);
  }
};

export const createTemplate = async ({
  runId,
  reflex,
  rerun,
  name,
  contentType,
}) => {
  try {
    const response = await axiosClient.get(`/runs/${runId}/generate/`, {
      params: { reflex, rerun },
      headers: { 'Content-Type': contentType },
      responseType: 'blob',
    });

    const blobData = new Blob([response.data], { type: contentType });

    saveBlobAs(blobData, name);

    return response;
  } catch (error) {
    throw new Error(error?.response?.data.detail);
  }
};
