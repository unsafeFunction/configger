import axiosClient from 'utils/axiosClient';

export const fetchSessions = async query => {
  const sessions = await axiosClient.get('/scans/sessions/', {
    params: {
      ...query,
    },
  });

  return sessions;
};

export const fetchSessionById = async ({ sessionId }) => {
  console.log('SERVICES PAYLOAD SESSION ID', sessionId);
  // const session = await axiosClient.get(`/scans/sessions/${sessionId}/`);

  // console.log('SERVICES SESSION', session);

  // return session;
};

export const updateSession = async ({ sessionId, companyId }) => {
  console.log(
    'services update session sessionId/companyId',
    sessionId,
    companyId,
  );

  // const session = await axiosClient.patch(`/scans​/sessions​/${sessionId}/`, {
  //   company_id: companyId,
  // });

  // return session;
};
