import { all, takeEvery, put, call } from 'redux-saga/effects';
import { notification } from 'antd';
import { login, restore } from 'services/user';
import cookieStorage from 'utils/cookie';
import actions from './actions';

const cookie = cookieStorage();

export function* callLogin({ payload }) {
  const { email, password, toDashboard, acceptTerms } = payload;
  try {
    const response = yield call(login, email, password);

    cookie.setItem('accessToken', response.data.key);

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

export function* callLogout({ payload }) {
  try {
    cookie.removeItem('accessToken');

    yield call(payload.redirect);
    return true;
  } catch (error) {
    notification.error({
      message: 'Logout failure',
    });
    return error;
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.LOGIN_REQUEST, callLogin),
    takeEvery(actions.RESTORE_REQUEST, callRestore),
    takeEvery(actions.LOGOUT, callLogout),
  ]);
}
