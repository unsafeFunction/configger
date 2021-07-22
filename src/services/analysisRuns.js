import { notification } from 'antd';
import axiosClient from 'utils/axiosClient';
import errorOutput from 'utils/errorOutput';

export const fetchRuns = async (query) => {
  try {
    const runs = await axiosClient.get('/runs/', {
      params: {
        ...query,
      },
    });
    return runs;
  } catch (error) {
    return error;
  }
};

export const uploadRunResult = async (payload) => {
  const { file, onSuccess, onError } = payload?.options;

  try {
    const formData = new FormData();
    formData.append('result_file', file);

    const uploadedRun = await axiosClient.post(
      `/runs/${payload.id}/import/`,
      formData,
      {
        headers: {
          'content-type': 'multipart/form-data',
        },
      },
    );
    onSuccess(uploadedRun);
    notification.success({ message: 'Successfully loaded' });
    return uploadedRun;
  } catch (error) {
    notification.error({ message: 'Something went wrong.' });
    onError(error);
    return error;
  }
};

export const fetchRun = async ({ id }) => {
  try {
    const run = await axiosClient.get(`/runs/results/${id}/entries`);
    return run;
  } catch (error) {
    throw new Error(errorOutput(error));
  }
};

export const updateSample = async ({ id, field, value }) => {
  try {
    // return console.log('SERVISES UPDATE SAMPLE', id, field, value);

    const sample = await axiosClient.put(`/runs/results/sample/${id}/`, {
      [field]: value,
    });
    return sample;
  } catch (error) {
    throw new Error(errorOutput(error));
  }
};

export const updateRun = async ({ id, field, value }) => {
  try {
    // return console.log('SERVISES UPDATE RUN', id, field, value);

    const run = await axiosClient.put(`/runs/${id}/status/`, {
      [field]: value,
    });
    return run;
  } catch (error) {
    throw new Error(errorOutput(error));
  }
};
