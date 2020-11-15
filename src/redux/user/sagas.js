import { all, takeEvery, put, call } from 'redux-saga/effects';
import { notification } from 'antd';
import { login, restore, fetchUsers, accept } from 'services/user';
import cookieStorage from 'utils/cookie';
import actions from './actions';

const cookie = cookieStorage();

export function* callLogin({ payload }) {
  const { email, password, toDashboard, acceptTerms } = payload;
  try {
    const response = yield call(login, email, password);

    cookie.setItem('accessToken', response.data.key);
    cookie.setItem('termsAccepted', response.data.terms_accepted);

    yield put({
      type: actions.LOGIN_SUCCESS,
    });

    notification.success({
      message: 'Logged In',
      description: 'You have successfully logged in!',
    });

    if (response.data.terms_accepted) {
      return yield call(toDashboard);
    }

    return yield call(acceptTerms);
  } catch (error) {
    const errorData = error.response.data.non_field_errors;

    yield put({
      type: actions.LOGIN_FAILURE,
      payload: {
        data: errorData,
      },
    });

    notification.error({
      message: 'Something went wrong',
      description: errorData,
      placement: 'bottomRight',
    });
  }
}

export function* callRestore({ payload }) {
  const { email, redirect } = payload;
  try {
    yield call(restore, email);

    yield put({
      type: actions.RESTORE_SUCCESS,
    });

    yield call(redirect);
    notification.success({
      message: 'Success!',
      description: 'Recover email sent successfully.',
    });
  } catch (error) {
    const errorData = error.response.data.non_field_errors;

    yield put({
      type: actions.RESTORE_FAILURE,
      payload: {
        data: errorData,
      },
    });

    notification.error({
      message: 'Something went wrong',
      description: errorData,
      placement: 'bottomRight',
    });
  }
}

export function* callAccept({ payload }) {
  const { redirect } = payload;
  try {
    yield call(accept);

    yield put({
      type: actions.ACCEPT_SUCCESS,
    });

    yield call(redirect);

    notification.success({
      message: 'Terms have been accepted!',
    });
  } catch (error) {
    const errorData = error.response.data.non_field_errors;

    yield put({
      type: actions.ACCEPT_FAILURE,
      payload: {
        data: errorData,
      },
    });

    notification.error({
      message: 'Something went wrong',
      description: errorData,
      placement: 'bottomRight',
    });
  }
}

export function* callLogout({ payload }) {
  try {
    cookie.removeItem('accessToken');
    cookie.removeItem('termsAccepted');

    yield call(payload.redirect);
    return true;
  } catch (error) {
    notification.error({
      message: 'Logout failure',
    });
    return error;
  }
}

export function* callLoadUsers({ payload }) {
  try {
    const response = yield call(fetchUsers, payload);

    yield put({
      type: actions.FETCH_USERS_SUCCESS,
      payload: {
        data: response.data,
        // total: response.headers['x-total-count'],
      },
    });
  } catch (error) {
    notification.error(error);
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.LOGIN_REQUEST, callLogin),
    takeEvery(actions.RESTORE_REQUEST, callRestore),
    takeEvery(actions.ACCEPT_REQUEST, callAccept),
    takeEvery(actions.LOGOUT, callLogout),
    takeEvery(actions.FETCH_USERS_REQUEST, callLoadUsers),
  ]);
}
