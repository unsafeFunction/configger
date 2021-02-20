import { all, takeEvery, put, call } from 'redux-saga/effects';
import {
  fetchCompanies,
  fetchCompanyShort,
  getSingleCompany,
  createCompany,
  updateUsers,
} from 'services/companies';
import { notification } from 'antd';
import actions from './actions';
import modalActions from '../modal/actions';

export function* callFetchCompanies({ payload }) {
  try {
    const response = yield call(fetchCompanies, payload);

    yield put({
      type: actions.FETCH_COMPANIES_SUCCESS,
      payload: {
        data: response.data.results,
        total: response.data.count,
        firstPage: !response.data.previous,
      },
    });
  } catch (error) {
    notification.error(error);
  }
}

export function* callCreateCompany({ payload }) {
  try {
    const response = yield call(createCompany, payload);
    yield put({
      type: actions.CREATE_COMPANY_SUCCESS,
      payload: response,
    });

    yield put({
      type: modalActions.HIDE_MODAL,
    });

    notification.success({
      message: 'Add Company',
      description: 'You have successfully created company!',
    });
  } catch (error) {
    const errorData = error.response.data.field_errors;
    yield put({
      type: actions.CREATE_COMPANY_FAILURE,
      payload: {
        data: errorData,
      },
    });
    notification.error({
      message: 'Failure!',
      description: `Company not created.`,
    });
  }
}

export function* callGetCompany({ payload }) {
  try {
    const response = yield call(getSingleCompany, payload.id);

    yield put({
      type: actions.GET_COMPANY_SUCCESS,
      payload: {
        data: response.data,
      },
    });
  } catch (error) {
    notification.error(error);
  }
}

export function* callFetchCompanyShort({ payload }) {
  try {
    const response = yield call(fetchCompanyShort, payload.id);

    yield put({
      type: actions.FETCH_COMPANY_SHORT_SUCCESS,
      payload: {
        data: response.data,
      },
    });
  } catch (error) {
    notification.error(error);
  }
}

export function* callUpdateUsers({ payload }) {
  try {
    const response = yield call(updateUsers, payload);

    yield put({
      type: actions.UPDATE_USERS_SUCCESS,
      payload: {
        data: response.data,
      },
    });
    yield put({
      type: modalActions.HIDE_MODAL,
    });
    notification.success({
      message: 'Success',
      description: 'Contact change was successful!',
    });
  } catch (error) {
    notification.error(error);
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.FETCH_COMPANIES_REQUEST, callFetchCompanies),
    takeEvery(actions.FETCH_COMPANY_SHORT_REQUEST, callFetchCompanyShort),
    takeEvery(actions.CREATE_COMPANY_REQUEST, callCreateCompany),
    takeEvery(actions.GET_COMPANY_REQUEST, callGetCompany),
    takeEvery(actions.UPDATE_USERS_REQUEST, callUpdateUsers),
  ]);
}
