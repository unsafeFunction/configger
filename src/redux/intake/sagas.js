import { all, takeEvery, put, call, select } from 'redux-saga/effects';
import {
  fetchCompanies,
  createPackingSlip,
  downloadFile,
} from 'services/intake';
import { getUser } from './selector';
import { notification } from 'antd';
import actions from './actions';

export function* callFetchCompanies({ payload }) {
  try {
    const userInfo = yield select(getUser);
    console.log(userInfo);
    const response = yield call(fetchCompanies, payload);

    yield put({
      type: actions.FETCH_COMPANIES_SUCCESS,
      payload: {
        data: response.data.results,
        total: response.data.count,
      },
    });
  } catch (error) {
    notification.error(error);
  }
}

export function* callCreatePackingSlip({ payload }) {
  try {
    const response = yield call(createPackingSlip, payload);
    yield put({
      type: actions.CREATE_PACKING_SUCCESS,
      payload: {
        data: response.data['packing-slip-url'],
      },
    });
    yield call(downloadFile, {
      link: response.data['packing-slip-url'],
      name: response.data['packing-slip-filename'],
      contentType: 'application/pdf',
    });
  } catch (error) {
    notification.error(error);
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.FETCH_COMPANIES_REQUEST, callFetchCompanies),
    takeEvery(actions.CREATE_PACKING_REQUEST, callCreatePackingSlip),
  ]);
}
