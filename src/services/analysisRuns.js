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

export const uploadRunResult = async (data) => {
  try {
    const formData = new FormData();
    formData.append('file', data.file);

    const uploadedRun = await axiosClient.post(
      `/runs/${data.id}/import/`,
      formData,
      {
        headers: {
          'content-type': 'multipart/form-data',
        },
      },
    );
    console.log(uploadedRun);
    return uploadedRun;
  } catch (error) {
    console.log(error);
    return error;
  }
};
