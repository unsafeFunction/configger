import axiosClient from 'utils/axiosClient';
import errorOutput from 'utils/errorOutput';

export const createProject = async (params: any) => {
  try {
    const enviroments = await axiosClient.post(
      `/env/${params.envId}/proj/create/`,
      {
        ...params,
      },
    );
    return enviroments;
  } catch (error) {
    throw new Error(errorOutput(error));
  }
};
