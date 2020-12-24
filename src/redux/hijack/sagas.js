import { all, takeLatest, put, call } from 'redux-saga/effects';
import { notification } from 'antd';
import { fetchCredentials } from 'services/hijack';
import actions from './actions';
import cookieStorage from 'utils/cookie';

const cookie = cookieStorage();

export function* callFetchCredentials({ payload }) {
  const {
    userId,
    userFirstName,
    userLastName,
    path,
    currentRole,
    toTimeline,
    toRuns,
    toTerms,
  } = payload;

  try {
    const response = yield call(fetchCredentials, { userId });

    yield put({
      type: actions.FETCH_CREDENTIALS_SUCCESS,
      payload: {
        path,
        accessToken: cookie.getItem('accessToken'),
        termsAccepted: cookie.getItem('termsAccepted'),
        role: currentRole,
      },
    });

    yield put({
      type: 'user/REPLACE_ROLE',
      payload: { role: response.data.role },
    });

    cookie.setItem('accessToken', response.data.key);
    cookie.setItem('termsAccepted', response.data.terms_accepted);

    notification.success({
      message: 'Logged In',
      description: `You have successfully logged in as ${userFirstName} ${userLastName}!`,
    });

    if (response.data.terms_accepted) {
      return response.data.role === 'admin' || response.data.role === 'staff'
        ? yield call(toRuns)
        : yield call(toTimeline);
    }
    return yield call(toTerms);
  } catch (error) {
    yield put({ type: actions.FETCH_CREDENTIALS_FAILURE });

    const errorData = error.response.data;

    notification.error({
      message: 'Something went wrong',
      description: errorData?.detail,
    });
    return error;
  }
}

export function* callHijackLogout({ payload }) {
  const { redirect, accessToken, termsAccepted, role } = payload;

  try {
    yield put({
      type: 'user/REPLACE_ROLE',
      payload: { role },
    });

    cookie.setItem('accessToken', accessToken);
    cookie.setItem('termsAccepted', termsAccepted);

    notification.success({
      message: 'Logged Out',
      description: `You have successfully logged out!`,
    });

    return yield call(redirect);
  } catch (error) {
    notification.error({
      message: 'Logout failure',
    });
    return error;
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(actions.FETCH_CREDENTIALS_REQUEST, callFetchCredentials),
    takeLatest(actions.LOGOUT, callHijackLogout),
  ]);
}
