import { notification } from 'antd';
import { all, call, put, takeEvery } from 'redux-saga/effects';
import { fetchIntakeCounts } from 'services/intakeDashboard';
import actions from './actions';

export function* callFetchIntakeCounts({ payload }) {
  try {
    const response = yield call(fetchIntakeCounts, payload);

    yield put({
      type: actions.FETCH_DAILY_INTAKE_COUNTS_SUCCESS,
      payload: {
        data: response.data,
        // total: response.data.count,
        // firstPage: !response.data.previous,
      },
    });
  } catch (error) {
    notification.error(error);
  }
}

export default function* rootSaga() {
  yield all([
    takeEvery(actions.FETCH_DAILY_INTAKE_COUNTS_REQUEST, callFetchIntakeCounts),
  ]);
}
