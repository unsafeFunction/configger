import axiosClient from 'utils/axiosClient';
import errorOutput from 'utils/errorOutput';

type QueryParamsType = {
  limit: number;
  offset: number;
  search: string;
};

export const fetchRuns = async (query: QueryParamsType) => {
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

type OptionsType = {
  action: string;
  filename: string;
  data: {};
  file: string | Blob;
  headers: {};
  withCredentials: boolean;
  method: string;
  onSuccess: (value: any) => void;
  onError: (value: any) => void;
};

type FileType = {
  id: string;
  options: OptionsType;
};

export const uploadRunResult = async (payload: FileType) => {
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

type ValuesType = {
  analysis_result: string;
  rerun_action: string;
  auto_publish: boolean;
}

type SampleTypes = {
  id: string;
  values: ValuesType
};

export const updateSample = async ({ id, values }: SampleTypes) => {
  try {
    const sample = await axiosClient.patch(`/runs/results/sample/${id}/`, {
      ...values,
    });
    return sample;
  } catch (error) {
    throw new Error(errorOutput(error));
  }
};

type RunType = {
  id: string;
  field: string;
  value: string;
};

export const updateRun = async ({ id, field, value }: RunType) => {
  try {
    const run = await axiosClient.patch(`/runs/${id}/status/`, {
      [field]: value,
    });
    return run;
  } catch (error) {
    throw new Error(errorOutput(error));
  }
};
