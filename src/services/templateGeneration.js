import axiosClient from 'utils/axiosClient';
import saveBlobAs from 'utils/saveAsBlob';

export const createRun = async (payload) => {
  const {
    title,
    kfpParam,
    replicationParam,
    poolRacks,
    reflex,
    rerun,
  } = payload;

  try {
    const run = await axiosClient.post('/runs/', {
      title,
      type: kfpParam,
      option: replicationParam,
      scans_ids: poolRacks
        .map((poolRack) => poolRack.id)
        .filter((item) => typeof item === 'string'),
      is_reflexed: reflex,
      is_reruned: rerun,
    });
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
      headers: { 'Content-Type': 'text/csv' },
      responseType: 'blob',
    });

    const blobData = new Blob([response.data], { type: contentType });

    saveBlobAs(blobData, name);

    return response;
  } catch (error) {
    throw new Error(error?.response?.data.detail);
  }
};
