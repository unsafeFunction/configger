import axiosClient from 'utils/axiosClient';
import errorOutput from 'utils/errorOutput';

type QueryParams = {
  limit: number;
  offset: number;
  search: string;
};

export const fetchRuns = async (query: QueryParams) => {
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

type OptionsProps = {
  action: string;
  filename: string;
  data: {};
  // file: {
  //   uid: string;
  // };
  file: string | Blob;
  headers: {};
  withCredentials: boolean;
  method: string;
  onSuccess: void;
  onError: void;
};

type FileProps = {
  id: string;
  options: OptionsProps;
};

export const uploadRunResult = async (payload: FileProps) => {
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
    return uploadedRun;
  } catch (error) {
    onError(error);
    throw new Error(errorOutput(error));
  }
};

export const fetchRun = async (id: string) => {
  try {
    const run = await axiosClient.get(`/runs/results/${id}/entries`);
    return run;
  } catch (error) {
    throw new Error(errorOutput(error));
  }
};

export const fetchWellplate = async (id: string) => {
  try {
    return await axiosClient.get(`/runs/${id}/tubes/`);
  } catch (error) {
    throw new Error(errorOutput(error));
  }
};

type SampleProps = {
  id: string;
  values: {
    analysis_result: string;
    rerun_action: string;
    auto_publish: boolean;
  };
};

export const updateSample = async ({ id, values }: SampleProps) => {
  try {
    const sample = await axiosClient.patch(`/runs/results/sample/${id}/`, {
      ...values,
    });
    return sample;
  } catch (error) {
    throw new Error(errorOutput(error));
  }
};

type RunProps = {
  id: string;
  field: string;
  value: string;
};

export const updateRun = async ({ id, field, value }: RunProps) => {
  try {
    const run = await axiosClient.patch(`/runs/${id}/status/`, {
      [field]: value,
    });
    return run;
  } catch (error) {
    throw new Error(errorOutput(error));
  }
};
