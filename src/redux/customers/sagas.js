import { all, takeEvery, put, call } from 'redux-saga/effects';
import { notification } from 'antd';
import {
  fetchCustomers,
  toggleUser,
  reinviteUser,
  fetchCompanies,
  inviteCustomer,
} from 'services/customers';
import modalActions from 'redux/modal/actions';
import actions from './actions';

export function* callLoadCustomers({ payload }) {
  try {
    const response = yield call(fetchCustomers, payload);
    console.log('RESPONSE DATA', response.data);

    yield put({
      type: actions.FETCH_CUSTOMERS_SUCCESS,
      payload: {
        data: response.data,
        total: response.data.count,
        firstPage: !response.data.previous,
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
    const response = yield call(fetchCompanies, page, search);

    yield put({
      type: actions.FETCH_COMPANIES_SUCCESS,
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
    const errorData = Object.values(error?.response?.data?.field_errors);

    yield put({
      type: actions.INVITE_CUSTOMER_FAILURE,
      payload: {
        data: errorData,
      },
    });

    notification.error({
      message: 'Failure!',
      description: `The user has not been invited. Details: ${errorData?.join(' ')}`,
    });
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.FETCH_CUSTOMERS_REQUEST, callLoadCustomers),
    takeEvery(actions.SET_STATUS_REQUEST, callToggleUser),
    takeEvery(actions.REINVITE_REQUEST, callReinviteUser),
    takeEvery(actions.FETCH_COMPANIES_REQUEST, callLoadCompanies),
    takeEvery(actions.INVITE_CUSTOMER_REQUEST, callInviteCustomer),
  ]);
}
