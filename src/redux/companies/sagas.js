import { notification } from 'antd';
import { all, call, put, takeEvery } from 'redux-saga/effects';
import {
  createCompany,
  fetchCompanies,
  getSingleCompany,
  updateUsers,
} from 'services/companies';
import modalActions from '../modal/actions';
import actions from './actions';

export function* callFetchCompanies({ payload }) {
  const { redirectToTimeline, ...query } = payload;
  try {
    const response = yield call(fetchCompanies, query);

    if (redirectToTimeline && response.data.count === 1) {
      return yield call(
        redirectToTimeline,
        response.data.results[0]?.company_id,
      );
    }

    return yield put({
      type: actions.FETCH_COMPANIES_SUCCESS,
      payload: {
        data: response.data.results,
        total: response.data.count,
        firstPage: !response.data.previous,
      },
    });
  } catch (error) {
    return notification.error({
      message: error.message,
    });
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
    takeEvery(actions.CREATE_COMPANY_REQUEST, callCreateCompany),
    takeEvery(actions.GET_COMPANY_REQUEST, callGetCompany),
    takeEvery(actions.UPDATE_USERS_REQUEST, callUpdateUsers),
  ]);
}
