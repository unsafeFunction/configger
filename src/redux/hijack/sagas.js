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

    const accessToken = cookie.getItem('accessToken');
    const termsAccepted = cookie.getItem('termsAccepted');

    yield put({
      type: actions.FETCH_CREDENTIALS_SUCCESS,
      payload: {
        path,
        accessToken,
        termsAccepted,
        role: currentRole,
      },
    });

    yield put({
      type: 'user/REPLACE_ROLE',
      payload: { role: response.data.role },
    });

    cookie.setItem('accessToken', response.data.key);
    cookie.setItem('termsAccepted', response.data.terms_accepted);
    cookie.setItem(
      'hijack',
      JSON.stringify({
        isActive: true,
        path,
        accessToken,
        termsAccepted,
        role: currentRole,
      }),
    );

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
    cookie.removeItem('hijack');

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

export function* RESTORE() {
  const hijack = cookie.getItem('hijack');

  if (hijack) {
    yield put({
      type: actions.RESTORE,
      payload: JSON.parse(hijack),
    });
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(actions.FETCH_CREDENTIALS_REQUEST, callFetchCredentials),
    takeLatest(actions.LOGOUT, callHijackLogout),
    RESTORE(), // run once on app load
  ]);
}
