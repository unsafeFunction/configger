import { notification } from 'antd';
import run from 'pages/AnalysisRun/data';
import axiosClient from 'utils/axiosClient';

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

export const fetchRun = async () => {
  try {
    return run;
  } catch (error) {
    return error;
  }
};
