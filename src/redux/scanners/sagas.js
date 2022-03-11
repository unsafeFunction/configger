import { notification } from 'antd';
import sortBy from 'lodash.sortby';
import { all, call, put, takeEvery } from 'redux-saga/effects';
import { fetchScanners } from 'services/scanners';
import actions from './actions';

export function* callFetchScanners() {
  try {
    const response = yield call(fetchScanners);

    const sortedScanners = sortBy(response?.data?.results, [
      'model',
      'scanner_id',
    ]);

    yield put({
      type: actions.FETCH_SCANNERS_SUCCESS,
      payload: {
        data: sortedScanners,
      },
    });
  } catch (error) {
    yield put({ type: actions.FETCH_SCANNERS_FAILURE });

    notification.error({
      message: error.message,
    });
  }
}

export default function* rootSaga() {
  yield all([takeEvery(actions.FETCH_SCANNERS_REQUEST, callFetchScanners)]);
}
