import { all, takeEvery, put, call } from 'redux-saga/effects';
import { notification } from 'antd';
import {
  login,
  forgotPassword,
  restore,
  getProfile,
  updateProfile,
  changePassword,
  verifyEmail,
  regByEmail,
} from 'services/user';
import cookieStorage from 'utils/cookie';
import modalActions from 'redux/modal/actions';
import actions from './actions';

const cookie = cookieStorage();

export function* callLogin({ payload }) {
  const { email, password, toScanSession } = payload;
  try {
    const response = yield call(login, email, password);

    cookie.setItem('accessToken', response.data.key);

    yield put({
      type: actions.LOGIN_SUCCESS,
      payload: {
        ...response.data,
      },
    });

    notification.success({
      message: 'Logged In',
      description: 'You have successfully logged in!',
    });

    return yield call(toScanSession);
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
    });
  }
}

export function* callForgotPassword({ payload }) {
  const { email, redirect } = payload;
  try {
    yield call(forgotPassword, email);

    yield put({
      type: actions.FORGOT_SUCCESS,
    });

    yield call(redirect);
    notification.success({
      message: 'Success!',
      description: 'Recover email has been sent successfully.',
    });
  } catch (error) {
    const errorData = error.response.data.non_field_errors;

    yield put({
      type: actions.FORGOT_FAILURE,
      payload: {
        data: errorData,
      },
    });

    notification.error({
      message: 'Something went wrong',
      description: errorData,
    });
  }
}

export function* callRestore({ payload }) {
  const { newPassword, passwordConfirmation, token, uid, redirect } = payload;
  try {
    const response = yield call(
      restore,
      newPassword,
      passwordConfirmation,
      uid,
      token,
    );
    yield put({
      type: actions.RESTORE_SUCCESS,
    });

    yield call(redirect);
    notification.success({
      message: 'Success!',
      description: 'Your password has been updated.',
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

export function* callLoadProfile() {
  try {
    const response = yield call(getProfile);
    yield put({
      type: actions.PROFILE_SUCCESS,
      payload: {
        profile: {
          ...response.data,
          phone_number: response.data?.phone_number?.slice(
            2,
            response.data?.phone_number?.length,
          ),
        },
      },
    });
  } catch (error) {
    const errorData = error?.response?.data?.detail;

    yield put({
      type: actions.PROFILE_FAILURE,
      payload: {
        data: errorData,
      },
    });

    notification.error({
      message: 'Profile loading failed',
      description: errorData,
    });
  }
}

export function* callUpdateProfile({ payload }) {
  const { first_name, last_name, phone_number } = payload;
  try {
    yield call(updateProfile, first_name, last_name, phone_number);

    yield put({
      type: actions.UPDATE_PROFILE_SUCCESS,
      payload: {
        data: {
          first_name,
          last_name,
          phone_number,
        },
      },
    });

    notification.success({
      message: 'Success!',
      description: 'Your profile info has been updated.',
    });
  } catch (error) {
    const errorData = error.response.data;

    yield put({
      type: actions.UPDATE_PROFILE_FAILURE,
      payload: {
        data: errorData,
      },
    });
    if (errorData?.field_errors?.phone_number) {
      return notification.error({
        message: 'Something went wrong',
        description: errorData?.field_errors?.phone_number,
      });
    }
    notification.error({
      message: 'Something went wrong',
      description: errorData,
    });
  }
}

export function* callChangePassword({ payload }) {
  const { currentPassword, newPassword, passwordConfirmation } = payload;
  try {
    yield call(
      changePassword,
      currentPassword,
      newPassword,
      passwordConfirmation,
    );

    yield put({
      type: actions.CHANGE_PASSWORD_SUCCESS,
    });

    notification.success({
      message: 'Success!',
      description: 'Your password has been changed.',
    });
  } catch (error) {
    const errorData = JSON.stringify(error.response.data.field_errors);

    yield put({
      type: actions.CHANGE_PASSWORD_FAILURE,
      payload: {
        data: errorData,
      },
    });

    notification.error({
      message: 'Something went wrong',
      description: 'Previous password is invalid',
    });
  }
}

export function* callVerifyEmail({ payload }) {
  try {
    const response = yield call(verifyEmail, payload.inviteKey);

    yield put({ type: actions.VERIFY_EMAIL_SUCCESS });

    notification.success({ message: 'Email verified' });
  } catch (error) {
    const errorData = error.response?.data?.detail;

    yield put({
      type: actions.VERIFY_EMAIL_FAILURE,
      payload: { data: errorData },
    });

    notification.error({
      message: 'Something went wrong',
      description: errorData,
    });
  }
}

export function* callRegByEmail({ payload }) {
  const { password1, password2, inviteKey, redirect } = payload;
  try {
    const response = yield call(regByEmail, password1, password2, inviteKey);

    yield put({ type: actions.REG_BY_EMAIL_SUCCESS });

    notification.success({
      message: 'Registration completed successfully',
      description: response.data?.detail,
    });

    return yield call(redirect);
  } catch (error) {
    const errorData = error.response?.data?.detail;

    yield put({
      type: actions.REG_BY_EMAIL_FAILURE,
      payload: { data: errorData },
    });

    notification.error({
      message: 'Something went wrong',
      description: 'Previous password is invalid',
    });
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.LOGIN_REQUEST, callLogin),
    takeEvery(actions.FORGOT_REQUEST, callForgotPassword),
    takeEvery(actions.RESTORE_REQUEST, callRestore),
    takeEvery(actions.PROFILE_REQUEST, callLoadProfile),
    takeEvery(actions.LOGOUT, callLogout),
    takeEvery(actions.UPDATE_PROFILE_REQUEST, callUpdateProfile),
    takeEvery(actions.CHANGE_PASSWORD_REQUEST, callChangePassword),
    takeEvery(actions.VERIFY_EMAIL_REQUEST, callVerifyEmail),
    takeEvery(actions.REG_BY_EMAIL_REQUEST, callRegByEmail),
  ]);
}
