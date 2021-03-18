import axiosClient from 'utils/axiosClient';

export const fetchSessions = async (query) => {
  try {
    const sessions = await axiosClient.get(
      '/scans/sessions/?status=COMPLETED',
      {
        params: { ...query },
      },
    );

    return sessions;
  } catch (error) {
    throw new Error(error);
  }
};

export const fetchSessionById = async (sessionId) => {
  try {
    const session = await axiosClient.get(`/scans/sessions/${sessionId}/`);

    return session;
  } catch (error) {
    throw new Error(error);
  }
};

export const updateSession = async (data) => {
  try {
    const session = await axiosClient.patch(`/scans/sessions/${data.id}/`, {
      ...data,
    });

    return session;
  } catch (error) {
    throw new Error(error);
  }
};

export const createSession = async ({ companyId }) => {
  try {
    const session = await axiosClient.post(`/scans/sessions/open/`, {
      company_id: companyId,
    });

    return session;
  } catch (error) {
    throw new Error(error);
  }
};

export const closeSession = async ({ companyId }) => {
  try {
    const session = await axiosClient.delete('/scans/sessions/active');

    return session;
  } catch (error) {
    throw new Error(error);
  }
};
