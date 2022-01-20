import { notification } from 'antd';
import { all, call, put, takeEvery } from 'redux-saga/effects';
import { fetchCompanies, getSingleCompany } from 'services/companies';
import actions from './actions';

export function* callFetchCompanies({ payload }) {
  try {
    const response = yield call(fetchCompanies, payload);

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

export default function* rootSaga() {
  yield all([
    takeEvery(actions.FETCH_COMPANIES_REQUEST, callFetchCompanies),
    takeEvery(actions.GET_COMPANY_REQUEST, callGetCompany),
  ]);
}
