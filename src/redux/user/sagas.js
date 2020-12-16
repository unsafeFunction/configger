import { all, takeEvery, put, call } from 'redux-saga/effects';
import { notification } from 'antd';
import {
  login,
  forgotPassword,
  restore,
  loadUsers,
  accept,
  getProfile,
  updateProfile,
  changePassword,
  toggleUser,
  reinviteUser,
  loadCompanies,
  inviteCustomer,
} from 'services/user';
import cookieStorage from 'utils/cookie';
import modalActions from 'redux/modal/actions';
import actions from './actions';

const cookie = cookieStorage();

export function* callLogin({ payload }) {
  const { email, password, toRuns, toTimeline, acceptTerms } = payload;
  try {
    const response = yield call(login, email, password);

    cookie.setItem('accessToken', response.data.key);
    cookie.setItem('termsAccepted', response.data.terms_accepted);

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

    if (response.data.terms_accepted) {
      return response.data.role === 'admin'
        ? yield call(toRuns)
        : yield call(toTimeline);
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
    const errorData = error.response.data;

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
      description: errorData,
    });
  }
}

export function* callLoadUsers({ payload }) {
  const { page, search } = payload;
  try {
    const response = yield call(loadUsers, page, search);

    yield put({
      type: actions.LOAD_USERS_SUCCESS,
      payload: {
        data: response.data,
        page,
      },
    });
  } catch (error) {
    notification.error(error);
  }
}

export function* callToggleUser({ payload }) {
  const { id, status } = payload;
  try {
    const response = yield call(toggleUser, id, status);
    yield put({
      type: actions.SET_STATUS_SUCCESS,
      payload: {
        data: response.data.user,
      },
    });
    notification.success({
      message: 'Success!',
      description: response.data.details,
    });
  } catch (error) {
    notification.error(error);
  }
}

export function* callReinviteUser({ payload }) {
  try {
    const response = yield call(reinviteUser, payload.id);

    yield put({
      type: actions.REINVITE_SUCCESS,
    });
    notification.success({
      message: 'Success!',
      description: response.data.detail,
    });
  } catch (error) {
    yield put({
      type: actions.REINVITE_FAILURE,
    });
    notification.error(error);
  }
}

export function* callLoadCompanies({ payload }) {
  const { page, search } = payload;
  try {
    const response = yield call(loadCompanies, page, search);

    yield put({
      type: actions.LOAD_COMPANIES_SUCCESS,
      payload: {
        data: response.data,
        page,
      },
    });
  } catch (error) {
    notification.error(error);
  }
}

export function* callInviteCustomer({ payload }) {
  try {
    const response = yield call(inviteCustomer, payload);

    yield put({
      type: actions.INVITE_CUSTOMER_SUCCESS,
    });

    yield put({
      type: modalActions.HIDE_MODAL,
    });

    notification.success({
      message: 'Success!',
      description: 'The user has been invited.',
    });
  } catch (error) {
    const errorData = error.response.data;

    yield put({
      type: actions.INVITE_CUSTOMER_FAILURE,
      payload: {
        data: errorData,
      },
    });

    notification.error({
      message: 'Failure!',
      description: `The user has not been invited. Details: ${errorData}`,
    });
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.LOGIN_REQUEST, callLogin),
    takeEvery(actions.FORGOT_REQUEST, callForgotPassword),
    takeEvery(actions.RESTORE_REQUEST, callRestore),
    takeEvery(actions.ACCEPT_REQUEST, callAccept),
    takeEvery(actions.PROFILE_REQUEST, callLoadProfile),
    takeEvery(actions.LOGOUT, callLogout),
    takeEvery(actions.LOAD_USERS_REQUEST, callLoadUsers),
    takeEvery(actions.UPDATE_PROFILE_REQUEST, callUpdateProfile),
    takeEvery(actions.CHANGE_PASSWORD_REQUEST, callChangePassword),
    takeEvery(actions.SET_STATUS_REQUEST, callToggleUser),
    takeEvery(actions.REINVITE_REQUEST, callReinviteUser),
    takeEvery(actions.LOAD_COMPANIES_REQUEST, callLoadCompanies),
    takeEvery(actions.INVITE_CUSTOMER_REQUEST, callInviteCustomer),
  ]);
}
