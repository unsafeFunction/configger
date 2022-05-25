import axiosClient from 'utils/axiosClient';
import errorOutput from 'utils/errorOutput';

export const fetchEnviroments = async () => {
  try {
    const enviroments = await axiosClient.get(`/env/`);
    return enviroments;
  } catch (error) {
    throw new Error(errorOutput(error));
  }
};

export const createEnviroment = async (params: any) => {
  try {
    const enviroments = await axiosClient.post(`/env/create/`, {
      ...params,
    });
    return enviroments;
  } catch (error) {
    throw new Error(errorOutput(error));
  }
};
